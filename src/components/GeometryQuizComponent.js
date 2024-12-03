import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  Alert,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import questionsData from './Questions/EuclideanQue.json';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const GeometryQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  // Load questions from JSON dynamically
  useEffect(() => {
    setQuestions(questionsData.questions);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const testAnswer = async () => {
    try {
      const response = await axios.post(
        CLAUDE_API_URL,
        {
          prompt: `Provide the answer for the following question: "${currentQuestion.question}"`,
          model: 'claude-1',
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_CLAUDE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const aiAnswer = response.data.output.trim();
      const isCorrect = aiAnswer.toLowerCase() === currentQuestion.expectedAnswer.toLowerCase();

      setFeedback({
        isCorrect,
        message: isCorrect ? 'Test result: Pass' : 'Test result: Fail',
      });
    } catch (error) {
      setFeedback({
        isCorrect: false,
        message: 'Error contacting Claude AI. Please try again later.',
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      resetQuestion();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      resetQuestion();
    }
  };

  const resetQuestion = () => {
    setFeedback(null);
  };

  if (questions.length === 0) {
    return <Typography>Loading questions...</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 2 }}>
      <CardHeader
        title={`Geometry Question ${currentQuestionIndex + 1}`}
        titleTypographyProps={{ variant: 'h5', textAlign: 'center' }}
      />
      <CardContent>
        {currentQuestion.imageUrl && (
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <img
              src={currentQuestion.imageUrl}
              alt={`Geometry question ${currentQuestionIndex + 1}`}
              style={{ maxHeight: 200, objectFit: 'contain' }}
            />
          </div>
        )}
        <Typography variant="body1" gutterBottom>
          {currentQuestion.question}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={testAnswer}
          fullWidth
          sx={{ mt: 2 }}
        >
          Test
        </Button>
        {feedback && (
          <Alert
            severity={feedback.isCorrect ? 'success' : 'error'}
            sx={{ mt: 2 }}
          >
            {feedback.message}
          </Alert>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          endIcon={<ArrowForward />}
          onClick={nextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </Button>
      </CardActions>
    </Card>
  );
};

export default GeometryQuiz;