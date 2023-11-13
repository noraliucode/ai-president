// MediaHandler.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

class MediaHandler {
  constructor(mediaConfig) {
    const { elementId, audioUrl, idleVideo } = mediaConfig;
    this.audioUrl = audioUrl;
    this.idleVideo = idleVideo;
    this.talkVideo = document.getElementById(elementId);
    this.mediaConfig = mediaConfig;
    this.peerConnection = null;
    this.streamId = null;
    this.sessionId = null;
    this.sessionClientAnswer = null;
    this.statsIntervalId = null;
    this.videoIsPlaying = undefined;
    this.lastBytesReceived = undefined;
  }

  connect = async () => {
    if (
      this.peerConnection &&
      this.peerConnection.connectionState === "connected"
    ) {
      return;
    }

    this.stopAllStreams();
    this.closePC();

    const sessionResponse = await this.fetchWithRetries(
      `${API_URL}/talks-stream`,
      {
        method: "POST",
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

    let sdpResponse;

    try {
      sdpResponse = await axios.post(`${API_URL}/sdp`, {
        sessionClientAnswer: this.sessionClientAnswer,
        sessionId: this.sessionId,
        streamId: this.streamId,
      });
    } catch (error) {}
  };

  playVideo = async () => {
    // connectionState not supported in firefox
    if (
      this.peerConnection?.signalingState === "stable" ||
      this.peerConnection?.iceConnectionState === "connected"
    ) {
      let talkResponse;
      try {
        talkResponse = await this.fetchWithRetries(`${API_URL}/streams`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            streamId: this.streamId,
            script: {
              type: "audio",
              audio_url: this.audioUrl,
            },
            driver_url: "bank://lively/",
            config: {
              stitch: true,
            },
            sessionId: this.sessionId,
          }),
        });
      } catch (error) {
        console.log("post streams error", error);
      }
    }
  };

  destroy = async () => {
    try {
      // In Axios, the second parameter in a delete request is not the request body (like in post, put, or patch), but the configuration object
      // https://stackoverflow.com/questions/74950058/empty-request-body-in-delete-method-node-ls-react-axios#:~:text=If%20we%20review%20the%20API,as%20it%20is%20with%20post
      axios.delete(`${API_URL}/stream/${this.streamId}`, {
        data: {
          sessionId: this.sessionId,
        },
      });
    } catch (error) {}

    this.stopAllStreams();
    this.closePC();
  };

  onIceGatheringStateChange = () => {
    const iceGatheringStatusLabel = document.getElementById(
      "ice-gathering-status-label"
    );

    iceGatheringStatusLabel.innerText = this.peerConnection.iceGatheringState;
    iceGatheringStatusLabel.className =
      "iceGatheringState-" + this.peerConnection.iceGatheringState;
  };

  onIceCandidate = (event) => {
    if (event.candidate) {
      const { candidate, sdpMid, sdpMLineIndex } = event.candidate;

      try {
        axios.post(`${API_URL}/ice`, {
          candidate,
          sdpMid,
          sdpMLineIndex,
          sessionId: this.sessionId,
          streamId: this.streamId,
        });
      } catch (error) {
        console.log("post ice error", error);
      }
    }
  };
  onIceConnectionStateChange = () => {
    const iceStatusLabel = document.getElementById("ice-status-label");
    if (!iceStatusLabel) return;

    iceStatusLabel.innerText = this.peerConnection.iceConnectionState;
    iceStatusLabel.className =
      "iceConnectionState-" + this.peerConnection.iceConnectionState;
    if (
      this.peerConnection.iceConnectionState === "failed" ||
      this.peerConnection.iceConnectionState === "closed"
    ) {
      this.stopAllStreams();
      this.closePC();
    }
  };

  onConnectionStateChange = () => {
    const peerStatusLabel = document.getElementById("peer-status-label");
    // not supported in firefox
    peerStatusLabel.innerText = this.peerConnection.connectionState;
    peerStatusLabel.className =
      "peerConnectionState-" + this.peerConnection.connectionState;
  };
  onSignalingStateChange = () => {
    const signalingStatusLabel = document.getElementById(
      "signaling-status-label"
    );
    if (!signalingStatusLabel) return;

    signalingStatusLabel.innerText = this.peerConnection.signalingState;
    signalingStatusLabel.className =
      "signalingState-" + this.peerConnection?.signalingState;
  };

  onVideoStatusChange = (videoIsPlaying, stream) => {
    const streamingStatusLabel = document.getElementById(
      "streaming-status-label"
    );

    let status;
    if (videoIsPlaying) {
      status = "streaming";
      const remoteStream = stream;
      this.setVideoElement(remoteStream);
    } else {
      status = "empty";
      this.playIdleVideo();
    }
    streamingStatusLabel.innerText = status;
    streamingStatusLabel.className = "streamingState-" + status;
  };

  onTrack = (event) => {
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
      const stats = await this.peerConnection?.getStats(event.track);
      stats?.forEach((report) => {
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
  };

  createPeerConnection = async (offer, iceServers) => {
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
  };

  setVideoElement = (stream) => {
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
  };

  playIdleVideo = () => {
    console.log("playIdleVideo");
    this.talkVideo.srcObject = undefined;
    this.talkVideo.src = this.idleVideo;
    this.talkVideo.loop = true;
  };

  stopAllStreams = () => {
    if (this.talkVideo.srcObject) {
      console.log("stopping video streams");
      this.talkVideo.srcObject.getTracks().forEach((track) => track.stop());
      this.talkVideo.srcObject = null;
    }
  };

  closePC = (pc = this.peerConnection) => {
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
  };

  fetchWithRetries = async (url, options, retries = 1) => {
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
  };
}

export default MediaHandler;
