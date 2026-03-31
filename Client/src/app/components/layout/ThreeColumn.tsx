import Box from "@mui/material/Box";

export function ThreeColumn({
  left,
  main,
  right,
}: {
  left: React.ReactNode;
  main: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "320px 1fr 360px" },
        gap: 3,
        alignItems: "start",
      }}
    >
      <Box sx={{ display: { xs: "none", md: "block" } }}>{left}</Box>
      <Box>{main}</Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}>{right}</Box>
    </Box>
  );
}
