import { Typography } from '@mui/material';
import React from 'react';

export default function Heading({
  children,
  gutterBottom,
}: {
  children: React.ReactNode | string;
  gutterBottom: boolean | undefined;
}) {
  return (
    <Typography
      component='h2'
      variant='h6'
      color='primary'
      gutterBottom={gutterBottom}
    >
      {children}
    </Typography>
  );
}
