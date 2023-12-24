import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "black",
        color: "white",
        textAlign: "center", // Center text alignment for the whole footer
      }}
    >
      {/* Centered text */}
      <Typography variant="body1" sx={{ fontSize: "30px" }}>
        以上內容為100%AI生成，純屬虛構，認真就輸了。
      </Typography>

      {/* Absolute positioning for the link */}
      <Box
        sx={{ position: "fixed", right: 16, bottom: "20px", color: "white" }}
      >
        <Typography variant="body2">
          <Link color="inherit" href="https://newtypelab.org" underline="hover">
            newtypelab.org
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
