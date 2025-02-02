'use client';

import { Box } from '@mui/material';

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FF7043 0%, #FFA726 50%, #FFE0B2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient Overlay Effects */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%), radial-gradient(circle at bottom left, rgba(255,117,34,0.15) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Content Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: { xs: '2rem', md: '4rem' },
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: { xs: '2rem', md: '3rem' },
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
