import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 999,
        backgroundColor: "rgba(226,231,255,1)",
        display: "flex",
        alignItems: "baseline",
        gap: 1,
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
        {value.toLocaleString()}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
