'use client';
import Feedback from './Feedback';
import Loading from './loading';
import { useEffect, useContext, useState } from 'react';

import { FeedbackContext } from '../../../providers/FeedbackProvider';
import { QuestionContext } from '../../../providers/QuestionProvider';
import { JobContext } from '../../../providers/JobProvider';
import { useCompletion } from 'ai/react';

export default function Page() {
  const [questions] = useContext(QuestionContext);
  const [jobInfo] = useContext(JobContext);
  const [, setFeedback] = useContext(FeedbackContext);
  const [numComplete, setNumComplete] = useState(0);

  const { complete } = useCompletion({
    api: '/util/chatGPT',
    onFinish: (prompt, completion) => {
      try {
        if (prompt.queryType === 'overall') {
          setFeedback((prevFeedback) => ({
            ...prevFeedback,
            overall: completion || 'No feedback available',
          }));
        } else {
          const parsedFeedback = JSON.parse(completion);
          setFeedback((prevFeedback) => ({
            ...prevFeedback,
            [prompt.index]: parsedFeedback,
          }));
        }
        setNumComplete((num) => num + 1);
      } catch (error) {
        console.error('Error processing feedback:', error);
        setFeedback((prevFeedback) => ({
          ...prevFeedback,
          [prompt.queryType === 'overall' ? 'overall' : prompt.index]: 
            prompt.queryType === 'overall' 
              ? 'Feedback unavailable at this time.'
              : {
                  strengths: { "Note": "Feedback unavailable" },
                  improvements: { "Note": "Please try again later" }
                }
        }));
        setNumComplete((num) => num + 1);
      }
    },
  });

  const questionFeedback = (index) => {
    const requestBody = {
      index: index,
      queryType: 'feedback',
      question: questions[index].question,
      answer: questions[index].answer,
      ...jobInfo,
    };

    complete(requestBody);
  };

  const overallFeedback = () => {
    const requestBody = {
      queryType: 'overall',
      questions: questions,
      ...jobInfo,
    };

    complete(requestBody);
  };

  useEffect(() => {
    overallFeedback();
    [...Array(questions.length).keys()].forEach((index) => {
      questionFeedback(index);
    });
  }, []);

  return (
    <>{numComplete == questions.length + 1 ? <Feedback /> : <Loading />}</>
  );
}
