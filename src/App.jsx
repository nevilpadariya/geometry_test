import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GeometryDashboard from './pages/dashboard';
import AnalyticalGeometryQuizComponent from './components/Questions/AnalyticalGeometryQuizComponent';
import EuclideanGeometryQuizComponent from './components/Questions/EuclideanGeometryQuizComponent';
import DiffrentialGeometryQuizComponent from './components/Questions/DifferentialGeometryQuizComponent';
import NonEuclideanGeometryQuizComponent from './components/Questions/NonEuclideanGeometryQuizComponent';

const App = () => {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<GeometryDashboard />} />
        <Route path="/euclidean" element={<EuclideanGeometryQuizComponent />} />
        <Route path="/non-euclidean" element={<NonEuclideanGeometryQuizComponent />} />
        <Route path="/differential" element={<DiffrentialGeometryQuizComponent />} />
        <Route path="/analytical" element={<AnalyticalGeometryQuizComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
