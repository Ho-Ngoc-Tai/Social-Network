import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

interface StatPillProps {
  label: string;
  value: number;
}

export function StatPill({ label, value }: StatPillProps) {
  return (
    <Chip
      label={
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
      }
      variant="filled"
      sx={{ borderRadius: 999, backgroundColor: "rgba(226,231,255,1)", height: 28 }}
    />
  );
}
