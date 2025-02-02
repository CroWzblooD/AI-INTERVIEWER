'use client';

import { Box, Typography, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { UserDetailsContext } from '../../../providers/UserDetailsProvider';

export default function Home() {
  const [name, setName] = useState('');
  const [userDetails, setUserDetails] = useContext(UserDetailsContext);
  const router = useRouter();

  const handleStart = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setUserDetails({ name: name.trim() });
      router.push('/job-info');
    }
  };

  return (
    <>
      {/* Header Section */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          fontWeight: 800,
          color: '#FF5722',
          textAlign: 'left',
          mb: 2,
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        AI INTERVIEWER
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '1.1rem', md: '1.25rem' },
          color: '#2C2C2C',
          maxWidth: '700px',
          mb: 6,
          lineHeight: 1.6,
        }}
      >
        Improve your interview skills with AI! Do a mock interview and get helpful feedback!
      </Typography>

      {/* Features Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 6,
        }}
      >
        {[
          {
            title: 'CUSTOMIZE',
            description: 'Provide job details and add your own questions to tailor the interview to your needs'
          },
          {
            title: 'INTERVIEW',
            description: 'Sit in a mock interview with our AI interviewer and answer questions tailored to you'
          },
          {
            title: 'FEEDBACK',
            description: 'Read about your strengths and improvements for each of your interview answers'
          }
        ].map((item, index) => (
          <Box
            key={index}
            sx={{
              background: 'white',
              borderRadius: '16px',
              p: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255,87,34,0.1)',
              '&:hover': {
                transform: 'translateY(-5px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(255,87,34,0.1)',
              },
            }}
          >
            <Typography
              sx={{
                color: '#FF5722',
                fontWeight: 700,
                fontSize: '1.25rem',
                mb: 2,
              }}
            >
              {item.title}
            </Typography>
            <Typography
              sx={{
                color: '#2C2C2C',
                fontSize: '1rem',
                lineHeight: 1.6,
              }}
            >
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Get Started Section */}
      <Box
        sx={{
          maxWidth: '400px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            color: '#2C2C2C',
            fontSize: '1.2rem',
            fontWeight: 600,
            mb: 3,
          }}
        >
          Enter your name to get started!
        </Typography>
        <Box
          component="form"
          onSubmit={handleStart}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            InputProps={{
              sx: {
                color: '#2C2C2C',
                '&::placeholder': {
                  color: '#666666',
                  opacity: 1,
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                '&:hover fieldset': {
                  borderColor: '#FF5722',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF5722',
                },
              },
              '& .MuiInputBase-input': {
                color: '#2C2C2C',
                '&::placeholder': {
                  color: '#666666',
                  opacity: 1,
                },
              },
            }}
          />
          <Button
            type="submit"
            sx={{
              background: 'linear-gradient(45deg, #FF5722, #FF8A65)',
              color: 'white',
              py: 1.5,
              px: 4,
              borderRadius: '12px',
              fontSize: '1.1rem',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(255,87,34,0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF8A65, #FF5722)',
                boxShadow: '0 6px 20px rgba(255,87,34,0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Start Setup
          </Button>
        </Box>
      </Box>
    </>
  );
}