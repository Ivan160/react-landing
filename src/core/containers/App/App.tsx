import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from 'core/components/Navigation';
import { OnlineStore } from 'modules/OnlineStore';
import { Wallet } from 'modules/Wallet';


export const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigation />} />
      <Route path="wallet" element={<Wallet />} />
      <Route path="online-store" element={<OnlineStore />} />
    </Routes>
  </BrowserRouter>
);
