import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import PersonList from './pages/PersonList';
import PersonForm from './pages/PersonForm';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Navbar />
        <Routes>
          <Route path="/persons" element={<PersonList />} />
          <Route path="/persons/new" element={<PersonForm />} />
          <Route path="/persons/:id/edit" element={<PersonForm />} />
          <Route path="/" element={<Navigate to="/persons" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
