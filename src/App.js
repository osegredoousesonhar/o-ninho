// ===================================================================
// ARQUIVO COMPLETO E FINAL PARA: src/App.js
// ===================================================================

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; 
import app from './firebaseConfig.js';
import './App.css'; 

import logoImage from './assets/logo2.png'; // Usando o logo2 como solicitado

import Login from './components/Login';
import HomePage from './components/HomePage';
import Book from './components/Book';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

function AppHeader({ navigate, user }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-title">O Ninho</div>
      </div>
      <div className="header-logo-container">
        <img src={logoImage} alt="O Ninho Logo" className="header-logo-img" />
      </div>
      <div className="header-right">
        {!user && (
          <div onClick={() => navigate('login')} className="header-login-link">
            Acesso Restrito
          </div>
        )}
      </div>
    </header>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home'); 
  const [selectedBook, setSelectedBook] = useState(null); 

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (view !== 'book') {
        if (currentUser) { setView('admin'); } 
        else { setView('home'); }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []); 

  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth);
  };
  
  const navigate = (destination, bookCategory = null) => {
    if (bookCategory) { setSelectedBook(bookCategory); }
    setView(destination);
  };

  if (loading) { return <div className="loading-screen">Carregando...</div>; }
  
  const renderCurrentView = () => {
    switch (view) {
      case 'login': return <Login navigate={navigate} />;
      case 'book': return <Book bookCategory={selectedBook} />; 
      case 'admin': return user ? <AdminPanel user={user} onLogout={handleLogout} /> : <Login navigate={navigate} />;
      default: return <HomePage navigate={navigate} />;
    }
  };
  
  const showHeader = view === 'home' || view === 'login';
  const showFooter = view === 'home' || view === 'book';

  return (
    <div className="app-container">
      {showHeader && <AppHeader navigate={navigate} user={user} />}
      <main className="main-content">
        {renderCurrentView()}
      </main>
      
      {showFooter && (
        <div className="ad-area">
          Espaço para Adsense (728x90)
        </div>
      )}
      
      {showFooter && <Footer />}
    </div>
  );
}

export default App;