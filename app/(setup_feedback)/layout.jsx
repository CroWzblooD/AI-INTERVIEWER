import { Box } from '@mui/material';

export default function RootLayout({ children }) {
  return (
    <Box
      sx={{
        background:
          'linear-gradient(108deg, #FAF3DD -0.23%, rgba(143, 192, 169, 0.00) 91.06%), #ff6005',
      }}
      minHeight='100vh'
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      {children}
    </Box>
  );
}
