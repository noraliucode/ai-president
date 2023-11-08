const DID_API_URL = process.env.REACT_APP_DID_API_URL;
const DID_API_KEY = process.env.REACT_APP_DID_API_KEY;

class MediaHandler {
  constructor(mediaConfig) {
    this.mediaConfig = mediaConfig;
    this.peerConnection = null;
    this.streamId = null;
    this.sessionId = null;
    this.sessionClientAnswer = null;
    this.statsIntervalId = null;
    this.videoIsPlaying = false;
    this.lastBytesReceived = 0;
  }

  async connect() {
    if (
      this.peerConnection &&
      this.peerConnection.connectionState === "connected"
    ) {
      return;
    }

    this.stopAllStreams();
    this.closePC();

    const sessionResponse = await this.fetchWithRetries(
      `${DID_API_URL}/talks/streams`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${DID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_url:
            "https://d-id-public-bucket.s3.amazonaws.com/or-roman.jpg",
        }),
      }
    );

    const {
      id: newStreamId,
      offer,
      ice_servers: iceServers,
      session_id: newSessionId,
    } = await sessionResponse.json();
    this.streamId = newStreamId;
    this.sessionId = newSessionId;

    try {
      this.sessionClientAnswer = await this.createPeerConnection(
        offer,
        iceServers
      );
    } catch (e) {
      console.log("error during streaming setup", e);
      this.stopAllStreams();
      this.closePC();
      return;
    }

    const sdpResponse = await fetch(
      `${DID_API_URL}/talks/streams/${this.streamId}/sdp`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${DID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: this.sessionClientAnswer,
          session_id: this.sessionId,
        }),
      }
    );
  }

  async playVideo() {
    // connectionState not supported in firefox
    if (
      this.peerConnection?.signalingState === "stable" ||
      this.peerConnection?.iceConnectionState === "connected"
    ) {
      const talkResponse = await this.fetchWithRetries(
        `${DID_API_URL}/talks/streams/${this.streamId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${DID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            script: {
              type: "audio",
              audio_url:
                "https://d-id-public-bucket.s3.us-west-2.amazonaws.com/webrtc.mp3",
            },
            driver_url: "bank://lively/",
            config: {
              stitch: true,
            },
            session_id: this.sessionId,
          }),
        }
      );
    }
  }

  async destroy() {
    await fetch(`${DID_API_URL}/talks/streams/${this.streamId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${DID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: this.sessionId }),
    });

    this.stopAllStreams();
    this.closePC();
  }

  onIceCandidate(event) {
    console.log("onIceCandidate", event);
    if (event.candidate) {
      const { candidate, sdpMid, sdpMLineIndex } = event.candidate;

      fetch(`${DID_API_URL}/talks/streams/${this.streamId}/ice`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${DID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidate,
          sdpMid,
          sdpMLineIndex,
          session_id: this.sessionId,
        }),
      });
    }
  }
  onIceConnectionStateChange() {
    if (
      this.peerConnection.iceConnectionState === "failed" ||
      this.peerConnection.iceConnectionState === "closed"
    ) {
      this.stopAllStreams();
      this.closePC();
    }
  }

  onVideoStatusChange(videoIsPlaying, stream) {
    let status;
    if (videoIsPlaying) {
      status = "streaming";
      const remoteStream = stream;
      this.setVideoElement(remoteStream);
    } else {
      status = "empty";
      this.playIdleVideo();
    }
  }

  onTrack(event) {
    /**
     * The following code is designed to provide information about wether currently there is data
     * that's being streamed - It does so by periodically looking for changes in total stream data size
     *
     * This information in our case is used in order to show idle video while no talk is streaming.
     * To create this idle video use the POST https://api.d-id.com/talks endpoint with a silent audio file or a text script with only ssml breaks
     * https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html#break-tag
     * for seamless results use `config.fluent: true` and provide the same configuration as the streaming video
     */

    if (!event.track) return;

    this.statsIntervalId = setInterval(async () => {
      const stats = await this.peerConnection.getStats(event.track);
      stats.forEach((report) => {
        if (report.type === "inbound-rtp" && report.mediaType === "video") {
          const videoStatusChanged =
            this.videoIsPlaying !==
            report.bytesReceived > this.lastBytesReceived;

          if (videoStatusChanged) {
            this.videoIsPlaying = report.bytesReceived > this.lastBytesReceived;
            this.onVideoStatusChange(this.videoIsPlaying, event.streams[0]);
          }
          this.lastBytesReceived = report.bytesReceived;
        }
      });
    }, 500);
  }

  async createPeerConnection(offer, iceServers) {
    if (!this.peerConnection) {
      this.peerConnection = new RTCPeerConnection({ iceServers });
      this.peerConnection.addEventListener(
        "icegatheringstatechange",
        this.onIceGatheringStateChange,
        true
      );
      this.peerConnection.addEventListener(
        "icecandidate",
        this.onIceCandidate,
        true
      );
      this.peerConnection.addEventListener(
        "iceconnectionstatechange",
        this.onIceConnectionStateChange,
        true
      );
      this.peerConnection.addEventListener(
        "connectionstatechange",
        this.onConnectionStateChange,
        true
      );
      this.peerConnection.addEventListener(
        "signalingstatechange",
        this.onSignalingStateChange,
        true
      );
      this.peerConnection.addEventListener("track", this.onTrack, true);
    }

    await this.peerConnection.setRemoteDescription(offer);
    console.log("set remote sdp OK");

    const sessionClientAnswer = await this.peerConnection.createAnswer();
    console.log("create local sdp OK");

    await this.peerConnection.setLocalDescription(sessionClientAnswer);
    console.log("set local sdp OK");

    return sessionClientAnswer;
  }

  setVideoElement(stream) {
    if (!stream) return;
    this.talkVideo.srcObject = stream;
    this.talkVideo.loop = false;

    // safari hotfix
    if (this.talkVideo.paused) {
      this.talkVideo
        .play()
        .then((_) => {})
        .catch((e) => {});
    }
  }

  playIdleVideo() {
    this.talkVideo.srcObject = undefined;
    this.talkVideo.src = "or_idle.mp4";
    this.talkVideo.loop = true;
  }

  stopAllStreams() {
    if (this.talkVideo.srcObject) {
      console.log("stopping video streams");
      this.talkVideo.srcObject.getTracks().forEach((track) => track.stop());
      this.talkVideo.srcObject = null;
    }
  }

  closePC(pc = this.peerConnection) {
    if (!pc) return;
    console.log("stopping peer connection");
    pc.close();
    pc.removeEventListener(
      "icegatheringstatechange",
      this.onIceGatheringStateChange,
      true
    );
    pc.removeEventListener("icecandidate", this.onIceCandidate, true);
    pc.removeEventListener(
      "iceconnectionstatechange",
      this.onIceConnectionStateChange,
      true
    );
    pc.removeEventListener(
      "connectionstatechange",
      this.onConnectionStateChange,
      true
    );
    pc.removeEventListener(
      "signalingstatechange",
      this.onSignalingStateChange,
      true
    );
    pc.removeEventListener("track", this.onTrack, true);
    clearInterval(this.statsIntervalId);

    console.log("stopped peer connection");
    if (pc === this.peerConnection) {
      this.peerConnection = null;
    }
  }

  async fetchWithRetries(url, options, retries = 1) {
    const maxRetryCount = 3;
    const maxDelaySec = 4;

    try {
      return await fetch(url, options);
    } catch (err) {
      if (retries <= maxRetryCount) {
        const delay =
          Math.min(Math.pow(2, retries) / 4 + Math.random(), maxDelaySec) *
          1000;

        await new Promise((resolve) => setTimeout(resolve, delay));

        console.log(
          `Request failed, retrying ${retries}/${maxRetryCount}. Error ${err}`
        );
        return this.fetchWithRetries(url, options, retries + 1);
      } else {
        throw new Error(`Max retries exceeded. error: ${err}`);
      }
    }
  }
}

export default MediaHandler;
