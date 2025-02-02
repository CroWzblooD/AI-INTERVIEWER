'use client';

import { Box } from '@mui/material';
import Webcam from 'react-webcam';

export default function WebCamera({ isCameraOn = true }) {
  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      borderRadius: '1.25rem',
      overflow: 'hidden',
      backgroundColor: '#1A1A1A',  // Darker background for better contrast
      border: '1px solid rgba(143, 192, 169, 0.2)',  // Subtle brand-colored border
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',  // Depth shadow
    }}>
      {isCameraOn && (
        <Webcam
          mirrored
          style={{ width: '100%', height: '100%' }}
          audio={false}
        />
      )}
    </Box>
  );
}
