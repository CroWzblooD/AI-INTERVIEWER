import { Box, Container } from '@mui/material';

export default function InterviewLayout({ children }) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #ff6005 0%, #E6F3ED 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(143, 192, 169, 0.1) 0%, rgba(143, 192, 169, 0) 70%)',
          pointerEvents: 'none'
        }
      }}
      minHeight='100vh'
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '65rem',
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
