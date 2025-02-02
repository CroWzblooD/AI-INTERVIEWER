'use client';

import { Grid, TextField, Button, Box } from '@mui/material';
import MultipleSelectChip from './components/multiselect';
import { useContext, useState } from 'react';
import { JobContext } from '../../../../providers/JobProvider';
import { useRouter } from 'next/navigation';
import BoxWrapper from '../../../../shared/BoxWrapper';
import ArrowForward from '@mui/icons-material/ChevronRightRounded';

export default function JobForm() {
  const [jobInfo, setJobInfo] = useContext(JobContext);
  const [title, setTitle] = useState(jobInfo.title);
  const [company, setCompany] = useState(jobInfo.company);
  const [reqs, setReqs] = useState(jobInfo.reqs);
  const [type, setType] = useState(jobInfo.type);
  const router = useRouter();

  const removeWhitespace = (text) => {
    return text.trim().length === 0 ? '' : text;
  };

  const handleNext = (e) => {
    e.preventDefault();
    setJobInfo({
      title: removeWhitespace(title),
      type: type,
      company: removeWhitespace(company),
      reqs: removeWhitespace(reqs),
    });
    router.push('/question-entry');
  };

  return (
    <Box 
      component='form' 
      onSubmit={handleNext}
      sx={{
        backgroundColor: '#FFF5EE', // Light salmon background for entire form
        padding: '2rem',
        borderRadius: '8px'
      }}
    >
      <BoxWrapper 
        title='Job Information' 
        imageSrc='/jobInfo.svg'
        sx={{
          backgroundColor: '#FFEEE6', // Slightly darker salmon for inner box
          borderRadius: '8px',
          padding: '1.5rem'
        }}
      >
        <Grid container spacing={5} flexDirection='row'>
          <Grid item container flexDirection='column' xs={6}>
            <TextField
              required
              label='Job Title'
              fullWidth
              margin='normal'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ 
                mb: 0.5,
                '& .MuiInputLabel-root': {
                  color: '#FF4500' // Orange-red
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#FF8C00' // Dark orange
                }
              }}
            />
            <MultipleSelectChip jobType={type} setJobType={setType} />
            <TextField
              fullWidth
              margin='normal'
              label='Company'
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              sx={{ 
                mt: 1.5,
                '& .MuiInputLabel-root': {
                  color: '#FF4500'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#FF8C00'
                }
              }}
            />
          </Grid>
          <Grid item container xs={6} height='100%'>
            <TextField
              inputProps={{ className: 'greyScroll' }}
              fullWidth
              label='Job Requirements'
              margin='normal'
              multiline
              minRows={8}
              maxRows={8}
              value={reqs}
              onChange={(e) => setReqs(e.target.value)}
              sx={{ 
                '& .MuiInputLabel-root': {
                  color: '#FF4500'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#FF8C00'
                }
              }}
            />
          </Grid>
        </Grid>
      </BoxWrapper>
      <Box
        display='flex'
        justifyContent='end'
        alignItems='center'
        marginTop='2rem'
      >
        <Button 
          variant='contained' 
          type='submit' 
          endIcon={<ArrowForward />}
          sx={{
            backgroundColor: '#FF4500', // Orange-red background
            '&:hover': {
              backgroundColor: '#FF8C00', // Dark orange on hover
            },
            color: 'white',
            boxShadow: 'none',
            '&:active': {
              boxShadow: 'none'
            }
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
