'use client';

// using provided audio recorder, will replace with custom UI later
import { useEffect, useContext, useState, useRef } from 'react';
import {
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Modal,
  List,
  ListItem,
  ListItemText,
  Fade,
  IconButton,
} from '@mui/material';

import ArrowForward from '@mui/icons-material/ChevronRightRounded';
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded';
import CallEndRoundedIcon from '@mui/icons-material/CallEndRounded';
import PersonIcon from '@mui/icons-material/Person';
import { JobContext } from '../../providers/JobProvider';
import { QuestionContext } from '../../providers/QuestionProvider';
import { UserDetailsContext } from '../../providers/UserDetailsProvider';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import WebCamera from './webcam';
import { Player } from '@lottiefiles/react-lottie-player';
import TextTransition from 'react-text-transition';
import { useRouter } from 'next/navigation';
import { useCompletion } from 'ai/react';
import Image from 'next/image';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';

export default function Interview() {
  const [jobInfo, setJobInfo] = useContext(JobContext);
  const [questions, setQuestions] = useContext(QuestionContext);
  const [userDetails, setUserDetails] = useContext(UserDetailsContext);

  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [redo, setRedo] = useState(false);
  const [interviewerTalking, setInterviewerTalking] = useState(false);
  const [questionDisplay, setQuestionDisplay] = useState('');
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [speaking, setSpeaking] = useState(false);

  const router = useRouter();
  const interviewerPlayer = useRef(null);
  const speech = useRef(null);
  const ready = useRef(false);

  const { complete } = useCompletion({
    api: '/util/chatGPT',
    onFinish: (prompt, completion) => {
      textToSpeech(completion);
    },
  });

  const parseAudio = async (blob) => {
    const res = await fetch('/util/speechToText', {
      method: 'POST',
      body: blob,
    });

    const result = await res.json();

    const newQuestions = questions.slice();

    newQuestions[questionsAnswered]['answer'] = result.answer;

    setQuestions(newQuestions);
    setQuestionsAnswered(questionsAnswered + 1);

    console.log(result.answer);
  };

  const speak = (text) => {
    return new Promise((resolve) => {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create new speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure speech settings
      utterance.rate = 1.0;  // Speed of speech
      utterance.pitch = 1.0; // Pitch of voice
      utterance.volume = 1.0; // Volume
      
      // Get available voices and set a good English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Female')
      ) || voices[0];
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      // Add event listeners
      utterance.onstart = () => {
        setSpeaking(true);
      };

      utterance.onend = () => {
        setSpeaking(false);
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeaking(false);
        resolve();
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleSpeak = async (text) => {
    try {
      await speak(text);
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  const askQuestion = async () => {
    let requestBody = {};

    if (questionsAnswered == 0) {
      requestBody = {
        queryType: 'firstMessage',
        jobTitle: jobInfo.title,
        jobCompany: jobInfo.company,
        name: userDetails.name,
        question: questions[0].question,
      };
    } else if (questionsAnswered < questions.length) {
      requestBody = {
        queryType: 'subsequentMessage',
        jobTitle: jobInfo.title,
        jobCompany: jobInfo.company,
        name: userDetails.name,
        question: questions[questionsAnswered].question,
        prevQuestion: questions[questionsAnswered - 1].question,
        prevAnswer: questions[questionsAnswered - 1].answer,
      };
    } else {
      requestBody = {
        queryType: 'lastMessage',
        jobTitle: jobInfo.title,
        jobCompany: jobInfo.company,
        name: userDetails.name,
        prevQuestion: questions[questionsAnswered - 1].question,
        prevAnswer: questions[questionsAnswered - 1].answer,
      };
    }

    await handleSpeak(requestBody.question);
    complete(requestBody);
  };

  const textToSpeech = async (input) => {
    try {
      if (!isAudioOn) return;

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(input);
      
      if (speechSynthesis.getVoices().length === 0) {
        await new Promise(resolve => {
          speechSynthesis.addEventListener('voiceschanged', resolve, { once: true });
        });
      }

      utterance.voice = speechSynthesis.getVoices().find(
        voice => voice.name.includes('Google') || voice.name.includes('English')
      );
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setInterviewerTalking(true);
        if (interviewerPlayer.current) {
          interviewerPlayer.current.play();
        }
      };

      utterance.onend = () => {
        setInterviewerTalking(false);
        if (interviewerPlayer.current) {
          interviewerPlayer.current.setSeeker(239, false);
        }
        if (questionsAnswered < questions.length) {
          if (isMicOn) startRecording();
          setQuestionDisplay(questions[questionsAnswered].question);
        } else {
          setInterviewComplete(true);
        }
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setInterviewerTalking(false);
      };

      if (ready.current) {
        speechSynthesis.speak(utterance);
      } else {
        speech.current = utterance;
      }
    } catch (error) {
      console.error('Text to speech error:', error);
      setInterviewerTalking(false);
    }
  };

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder({
    noiseSuppression: true,
    echoCancellation: true,
  });

  const redoQuestion = () => {
    setRedo(true);
    stopRecording();
  };

  const toggleMicrophone = () => {
    if (isMicOn) {
      stopRecording();
      setIsRecording(false);
    } else {
      if (!interviewerTalking) {
        startRecording();
        setIsRecording(true);
      }
    }
    setIsMicOn(!isMicOn);
  };

  const handleAnswerSubmit = async () => {
    if (isRecording) {
      stopRecording();
      setIsRecording(false);
      setRecordingComplete(true);
      
      // Save the answer
      const newQuestions = [...questions];
      newQuestions[questionsAnswered].answer = currentAnswer;
      setQuestions(newQuestions);
      
      // Move to next question
      if (questionsAnswered < questions.length - 1) {
        setQuestionsAnswered(questionsAnswered + 1);
        askQuestion();
      } else {
        setInterviewComplete(true);
      }
    }
  };

  useEffect(() => {
    setQuestionDisplay(
      'Welcome to your interview, ' + userDetails.name.replace(/ .*/, '')
    );
  }, []);

  useEffect(() => {
    if (!recordingBlob) {
      return;
    }

    if (redo) {
      setRedo(false);
      startRecording();
      return;
    }

    parseAudio(recordingBlob);
  }, [recordingBlob]);

  useEffect(() => {
    askQuestion();
  }, [questionsAnswered]);

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const closeModal = () => {
    setModalOpen(false);
    ready.current = true;

    if (speech.current != null) {
      delay(1000).then(() => {
        speech.current.play();
        interviewerPlayer.current.play();
        setInterviewerTalking(true);
      });
    }
  };

  // Make sure voices are loaded
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <>
      <Modal open={modalOpen} closeAfterTransition>
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              width: '40rem',
              padding: '3rem',
              borderRadius: '1rem',
              outline: 0,
              boxShadow: '0px 4px 6.599999904632568px 0px #00000040',
            }}
          >
            <Typography variant='h2' sx={{ marginBottom: '1rem' }}>
              Welcome to your interview!
            </Typography>
            <Box
              height={5}
              mb={4}
              mt={2}
              width='6rem'
              bgcolor='primary.main'
              borderRadius={1}
            ></Box>
            <Typography>
              Once the interview starts, the interviewer will begin by welcoming
              you and asking you the first question. Here are some tips for the
              best interview experience:
            </Typography>
            <List sx={{ listStyle: 'decimal', pl: 4 }}>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary='Ensure you are in an environment with minimal background noise' />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary='Talk clearly at a regular pace in the direction of your microphone' />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary='Answer the questions appropriately and stay on topic' />
              </ListItem>
            </List>
            <Typography>
              Best of luck! We'll see you afterwards with your feedback.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'flex-end',
                marginTop: '2rem',
              }}
            >
              <Button
                variant='outlined'
                sx={{ boxShadow: 'none', padding: '.5rem 1.5rem' }}
                endIcon={<ArrowForward />}
                onClick={closeModal}
              >
                Let's Go!
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Box
          sx={{
            maxWidth: '80%',
            maxHeight: '80.98px',
            display: 'flex',
            flexDirection: 'column-reverse',
          }}
        >
          <Box
            height={5}
            mb={4}
            mt={2}
            width='6rem'
            bgcolor='primary.main'
            borderRadius={1}
          >
            &#8203;
          </Box>
          <Typography variant='h2'>
            <TextTransition className='transition'>
              {questionDisplay}
            </TextTransition>
          </Typography>
        </Box>
        <Box
          sx={{
            marginLeft: 'auto',
            bgcolor: '#E6F3ED',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '3rem',
            width: '10.45rem',
          }}
        >
          <Typography
            sx={{
              color: '#e31414',
              fontWeight: 700,
            }}
          >
            {questions.length - questionsAnswered}{' '}
            {questions.length - questionsAnswered == 1
              ? 'question'
              : 'questions'}{' '}
            left
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={4} sx={{ position: 'relative' }}>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F9F7 100%)',
              borderRadius: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(143, 192, 169, 0.1)',
              border: '1px solid rgba(143, 192, 169, 0.1)',
              overflow: 'hidden'
            }}
          >
            <Player
              autoplay
              loop
              src="/Interviewer.json"
              style={{ 
                width: '100%',
                height: '100%',
                maxWidth: '25rem',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              ref={interviewerPlayer}
            />
            
            <Chip
              icon={<PersonIcon sx={{ '&.MuiChip-icon': { color: '#ff6005' } }} />}
              label="AI Interviewer"
              sx={{
                position: 'absolute',
                zIndex: 5,
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(238, 81, 19, 0.9)',
                color: '#3F3D56',
                fontWeight: 600,
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(143, 192, 169, 0.3)',
                '& .MuiChip-label': {
                  px: 2
                }
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={8} sx={{ position: 'relative' }}>
          <Chip
            icon={
              <GraphicEqRoundedIcon
                sx={{ '&.MuiChip-icon': { color: '#AF6161 !important' } }}
              />
            }
            label='Please wait for the interviewer to finish speaking'
            sx={{
              position: 'absolute',
              zIndex: 5,
              top: '2.5rem',
              right: '1rem',
              backgroundColor: '#FB2D2D54',
              transition: '0.5s',
              opacity: interviewerTalking ? '100%' : '0%',
            }}
          ></Chip>
          <Chip
            icon={
              <GraphicEqRoundedIcon
                sx={{ '&.MuiChip-icon': { color: '#799D8C !important' } }}
              />
            }
            label='You may answer the question now'
            sx={{
              position: 'absolute',
              zIndex: 5,
              top: '2.5rem',
              right: '1rem',
              backgroundColor: '#28C17B4D',
              transition: '0.5s',
              opacity: isRecording ? '100%' : '0%',
            }}
          ></Chip>
          <Chip
            icon={
              <PersonIcon sx={{ '&.MuiChip-icon': { color: '#FFFFFF8A' } }} />
            }
            label={userDetails.name}
            sx={{
              position: 'absolute',
              zIndex: 5,
              bottom: '1rem',
              left: '2.5rem',
              backgroundColor: '#00000052',
              color: '#FFFFFFA1',
              fontWeight: 700,
            }}
          ></Chip>

          <WebCamera />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box width='18rem'></Box>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3,
            mt: 3,
            padding: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(143, 192, 169, 0.15)',
            border: '1px solid rgba(143, 192, 169, 0.2)'
          }}
        >
          <IconButton 
            onClick={toggleMicrophone}
            disabled={interviewerTalking}
            sx={{ 
              backgroundColor: isMicOn ? '#4CAF50' : '#f44336',
              '&:hover': { 
                backgroundColor: isMicOn ? '#45a049' : '#d32f2f' 
              },
              '&.Mui-disabled': {
                backgroundColor: '#9e9e9e'
              },
              padding: '12px'
            }}
          >
            {isMicOn ? <MicIcon sx={{ color: 'white' }} /> : <MicOffIcon sx={{ color: 'white' }} />}
          </IconButton>

          <IconButton 
            onClick={() => setIsCameraOn(!isCameraOn)}
            sx={{ 
              backgroundColor: isCameraOn ? '#2196F3' : '#f44336',
              '&:hover': { 
                backgroundColor: isCameraOn ? '#1976D2' : '#d32f2f' 
              },
              padding: '12px'
            }}
          >
            {isCameraOn ? 
              <VideocamIcon sx={{ color: 'white' }} /> : 
              <VideocamOffIcon sx={{ color: 'white' }} />
            }
          </IconButton>

          <IconButton 
            onClick={() => {
              setIsAudioOn(!isAudioOn);
              if (isAudioOn) {
                speechSynthesis.cancel();
              }
            }}
            sx={{ 
              backgroundColor: isAudioOn ? '#FF9800' : '#f44336',
              '&:hover': { 
                backgroundColor: isAudioOn ? '#F57C00' : '#d32f2f' 
              },
              padding: '12px'
            }}
          >
            {isAudioOn ? 
              <VolumeUpIcon sx={{ color: 'white' }} /> : 
              <VolumeOffIcon sx={{ color: 'white' }} />
            }
          </IconButton>

          <Button
            variant="contained"
            color={interviewComplete ? "success" : "primary"}
            disabled={!isRecording && !interviewComplete}
            onClick={interviewComplete ? () => router.push('/feedback') : handleAnswerSubmit}
            startIcon={interviewComplete ? <CheckCircleIcon /> : null}
            endIcon={!interviewComplete ? <SendIcon /> : null}
            sx={{
              minWidth: '150px',
              backgroundColor: interviewComplete ? '#ff6005' : '#ff6005',
              '&:hover': {
                backgroundColor: interviewComplete ? '#ff6005' : '#ff6005'
              }
            }}
          >
            {interviewComplete ? 'Complete Interview' : 'Submit Answer'}
          </Button>
        </Box>
      </Box>
    </>
  );
}
