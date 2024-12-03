import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  TextField,
  IconButton,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import questions from './Questions/EuclideanQue.json';

const GeometryQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = questions.questions[currentQuestionIndex];

  const checkAnswer = () => {
    const isCorrect = answer.toLowerCase() === currentQuestion.expectedAnswer.toLowerCase();
    setFeedback({
      isCorrect,
      message: isCorrect
        ? 'Correct! Well done!'
        : 'Not quite right. Try again!',
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.questions.length - 1) {
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
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 2 }}>
      <CardHeader
        title={`Geometry Question ${currentQuestionIndex + 1}`}
        titleTypographyProps={{ variant: 'h5', textAlign: 'center' }}
      />
      <CardContent>
        {/* Image Display */}
        {currentQuestion.imageUrl && (
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <img
              src={currentQuestion.imageUrl}
              alt={`Geometry question ${currentQuestionIndex + 1}`}
              style={{ maxHeight: 200, objectFit: 'contain' }}
            />
          </div>
        )}

        {/* Question Section */}
        <Typography variant="body1" gutterBottom>
          {currentQuestion.question}
        </Typography>
        <TextField
          fullWidth
          label="Enter your answer"
          variant="outlined"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          sx={{ mb: 2 }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={checkAnswer}
            disabled={!answer.trim()}
            fullWidth
          >
            Submit Answer
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowHint(!showHint)}
            fullWidth
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </Button>
        </div>

        {/* Hint Section */}
        {showHint && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mt: 2,
              p: 2,
              bgcolor: '#f9f9f9',
              borderRadius: 1,
            }}
          >
            {currentQuestion.hint}
          </Typography>
        )}

        {/* Feedback Section */}
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
          disabled={currentQuestionIndex === questions.questions.length - 1}
        >
          Next
        </Button>
      </CardActions>
    </Card>
  );
};

export default GeometryQuiz;
