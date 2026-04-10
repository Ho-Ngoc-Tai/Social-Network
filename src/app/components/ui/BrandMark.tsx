import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function BrandMark({ condensed = false }: { condensed?: boolean }) {
  return (
    <Box display="flex" alignItems="center" gap={1.25}>
      {/* Animated colorful logo */}
      <Box
        sx={{
          width: condensed ? 32 : 40,
          height: condensed ? 32 : 40,
          borderRadius: "12px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
          backgroundSize: "300% 300%",
          animation: "gradientShift 4s ease infinite",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
          position: "relative",
          overflow: "hidden",
          "@keyframes gradientShift": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 2,
            background: "rgba(255,255,255,0.2)",
            borderRadius: "10px",
          },
        }}
      >
        <Box
          component="span"
          sx={{
            fontSize: condensed ? 16 : 20,
            fontWeight: 700,
            color: "#fff",
            zIndex: 1,
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          S
        </Box>
      </Box>
      
      <Typography
        variant={condensed ? "h6" : "h5"}
        sx={{ 
          fontWeight: 800, 
          letterSpacing: "-0.02em",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textDecoration: "none",
        }}
      >
        SocialNetwork
      </Typography>
    </Box>
  );
}
