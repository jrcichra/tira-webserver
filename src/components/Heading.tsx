import { Typography } from "@mui/material";

export default function Heading({
  children,
  gutterBottom,
}: {
  children: Element | string;
  gutterBottom: boolean | undefined;
}) {
  return (
    <Typography
      component="h2"
      variant="h6"
      color="primary"
      gutterBottom={gutterBottom}
    >
      {children}
    </Typography>
  );
}
