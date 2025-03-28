import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import FeedbackInfoPair from './FeedbackInfoPair';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className='feedbackScroll'
      {...other}
      style={{
        margin: '24px 32px 24px 40px',
        overflowY: 'auto',
        // height: 'calc(45vh - 3.5rem- 48px)',
        flex: 1,
      }}
    >
      {value === index && <Box sx={{ marginRight: '1.5rem' }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function FeedbackTabs({ questionFeedback }) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Tabs
        variant='fullWidth'
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          backgroundColor: '#e31414',
          borderRadius: '.5rem .5rem 0 0',
          '& .MuiTabs-indicator': {
            backgroundColor: '#e31414',
            height: '3px',
          },
        }}
        indicatorColor='primary'
      >
        <Tab
          label='Strengths'
          {...a11yProps(0)}
          sx={{
            fontWeight: 700,
            color: '#354F528A',
            '&.Mui-selected': {
              color: '#272D2DC7',
            },
            height: '3.5rem',
          }}
        />
        <Tab
          label='Improvements'
          {...a11yProps(1)}
          sx={{
            fontWeight: 700,
            color: '#354F528A',
            '&.Mui-selected': {
              color: '#272D2DC7',
            },
            height: '3.5rem',
          }}
        />
      </Tabs>
      <CustomTabPanel value={tabValue} index={0}>
        {Object.entries(questionFeedback['strengths']).map(
          ([key, value], index) => {
            return (
              <FeedbackInfoPair
                key={index}
                fieldName={key}
                feedbackContent={value}
              />
            );
          }
        )}
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        {Object.entries(questionFeedback['improvements']).map(
          ([key, value], index) => {
            return (
              <FeedbackInfoPair
                key={index}
                fieldName={key}
                feedbackContent={value}
              />
            );
          }
        )}
      </CustomTabPanel>
    </>
  );
}
