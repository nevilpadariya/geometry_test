import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const questionsData = require('./EuclideanQues.json');

const EuclideanGeometryQuizComponent = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState({});
  const [showHint, setShowHint] = useState({});

  useEffect(() => {
    try {
      setQuestions(questionsData.questions);
    } catch (err) {
      setError('Failed to load questions');
    }
  }, []);

  const validateWithAPI = async (question, index) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/validate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.question,
          expectedAnswer: question.expectedAnswer,
          imageUrl: question.imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to validate answer');
      }

      const data = await response.json();
      setResult((prevResult) => ({ ...prevResult, [index]: { isCorrect: data.isCorrect, feedback: data.isCorrect ? 'Pass' : 'Fail' } }));
    } catch (err) {
      console.error('Error in validateWithAPI:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateAll = async () => {
    setLoading(true);
    setError(null);
    for (let i = 0; i < questions.length; i++) {
      await validateWithAPI(questions[i], i);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button variant="outlined" onClick={() => navigate('/')}>Back to Dashboard</Button>
        <Typography variant="h4" align="center">Analytical Geometry Questions</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={validateAll}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Test All'}
        </Button>
      </Box>
      {questions.map((question, index) => (
        <Box key={index} sx={{ mb: 2, position: 'relative' }}>
          <Accordion sx={{ borderRadius: 1, boxShadow: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e3f2fd' }}>
              <Typography variant="h6">{`Question ${index + 1}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>
                  {question.imageUrl && (
                    <img
                      src={process.env.PUBLIC_URL + question.imageUrl}
                      alt={`Question ${index + 1}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        objectFit: 'contain',
                      }}
                    />
                  )}
                </Box>
              </Box>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                {question.question}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => validateWithAPI(question, index)}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Test'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setShowHint((prevShowHint) => ({ ...prevShowHint, [index]: !prevShowHint[index] }))}
                >
                  {showHint[index] ? 'Hide Hint' : 'Show Hint'}
                </Button>
              </Box>
              {showHint[index] && question.hint && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body1">Hint: {question.hint}</Typography>
                </Alert>
              )}
            </AccordionDetails>
          </Accordion>
          {result[index] && (
            <Alert
              severity={result[index].isCorrect ? 'success' : 'error'}
              sx={{ position: 'absolute', top: 0, right: -250, width: '200px' }}
            >
              <Typography>{result[index].feedback}</Typography>
            </Alert>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default EuclideanGeometryQuizComponent;