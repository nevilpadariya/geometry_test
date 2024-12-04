import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const GeometryDashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (geometryType) => {
    navigate(`/${geometryType}`);
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', p: 4, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}>Geometry Test</Typography>
      <Grid container spacing={4}>
        {['Euclidean', 'Non-Euclidean', 'Differential', 'Analytical'].map((geometry, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              onClick={() => handleCardClick(geometry.toLowerCase().replace(' ', '-'))}
              sx={{
                cursor: 'pointer',
                textAlign: 'center',
                transition: '0.3s',
                '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
                backgroundColor: '#f5f5f5',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'medium', color: '#424242' }}>{geometry} Geometry</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const GeometryQuestionsPage = ({ geometryType, questions }) => {
  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2', textAlign: 'center' }}>{`${geometryType} Questions`}</Typography>
      <Grid container spacing={4}>
        {questions.map((question, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ mb: 2, borderRadius: 1, boxShadow: 3 }}>
              <CardContent>
                <Accordion sx={{ width: '100%' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e3f2fd' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>{`Question ${index + 1}`}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: '#f9f9f9' }}>
                    <Typography>{question}</Typography>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        onClick={() => window.history.back()}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default GeometryDashboard;