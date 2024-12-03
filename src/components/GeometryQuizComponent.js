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

// It's better to use an environment variable for the API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/claude';

const GeometryQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setQuestions(questionsData.questions);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const testAnswer = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        API_URL,
        {
          messages: [
            {
              role: "user",
              content: `Provide the answer for the following geometry question: "${currentQuestion.question}". Please provide only the final answer without any explanation.`
            }
          ],
          model: "claude-3-sonnet-20240229",
          max_tokens: 100,
          temperature: 0
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // Handle the new Claude API response format
      const aiAnswer = response.data.content || '';
      const isCorrect = aiAnswer.toLowerCase().includes(currentQuestion.expectedAnswer.toLowerCase());

      setFeedback({
        isCorrect,
        message: isCorrect ? 'Test result: Pass' : 'Test result: Fail',
        aiResponse: aiAnswer
      });
    } catch (error) {
      console.error('API Error:', error);
      setFeedback({
        isCorrect: false,
        message: `Error: ${error.response?.data?.error || 'Failed to contact the API. Please try again.'}`,
      });
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {isLoading ? 'Testing...' : 'Test'}
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