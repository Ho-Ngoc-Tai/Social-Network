import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function BrandMark({ condensed = false }: { condensed?: boolean }) {
  return (
    <Box display="flex" alignItems="baseline" gap={1.25}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: 999,
          background:
            "linear-gradient(135deg, rgba(0,82,255,1) 0%, rgba(0,56,182,1) 100%)",
        }}
      />
      <Typography
        variant={condensed ? "h6" : "h5"}
        sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
      >
        UniNet
      </Typography>
    </Box>
  );
}
