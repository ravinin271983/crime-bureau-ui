import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import logo from './logo.svg';
import './App.css';
import Case from './components/Case';
import InvestigatingOfficer from './components/InvestigatingOfficer';
import Evidence from './components/Evidence';
import LegalAction from './components/LegalAction';
import Suspect from './components/Suspect';
import Victim from './components/Victim';

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Case />} />
        <Route path="/case" element={<Case />} />
        <Route path="/investigatingofficer" element={<InvestigatingOfficer />} />
        <Route path="/evidence" element={<Evidence />} />
        <Route path="/legalaction" element={<LegalAction />} />
        <Route path="/suspect" element={<Suspect />} />
        <Route path="/victim" element={<Victim />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
