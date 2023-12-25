import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface PhraseTitleProps {
  text: string;
}

const PhraseTitle: React.FC<PhraseTitleProps> = ({ text }) => {
  return (
    <Box
      sx={{
        width: 400,
        height: 86,
        backgroundImage: `url("/images/phrase_bg.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      <Typography
        sx={{ color: "yellow", fontWeight: "bold", fontSize: "30px" }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default PhraseTitle;
