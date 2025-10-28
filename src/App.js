import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; 
import app from './firebaseConfig.js';
import './App.css'; 

import backgroundImage from './assets/background.png';

import Login from './components/Login';
import HomePage from './components/HomePage';
import Book from './components/Book';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

function AppHeader({ navigate, user }) {
  return (
    <header className="app-header">
      {/* --- AQUI ESTÁ A NOVA ESTRUTURA DO LOGO --- */}
      <div className="header-logo">
        <span className="logo-brand-name">O NINHO</span>
        <span className="logo-tagline">A Bíblia das Aves Exóticas</span>
      </div>
      
      {!user && (
        <div onClick={() => navigate('login')} className="header-login-link">
          Acesso Restrito
        </div>
      )}
    </header>
  );
}

// O resto do código do App.js não muda.
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home'); 
  const [selectedBook, setSelectedBook] = useState(null); 

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (view !== 'book' && view !== 'login') {
        if (currentUser) { setView('admin'); } 
        else { setView('home'); }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [view]);

  const handleLogout = () => { signOut(getAuth(app)); };
  
  const navigate = (destination, bookCategory = null) => {
    if (bookCategory) { setSelectedBook(bookCategory); }
    setView(destination);
  };

  if (loading) { return <div className="loading-screen">Carregando...</div>; }
  
  const renderCurrentView = () => {
    switch (view) {
      case 'login': return <Login />;
      case 'book': return <Book bookCategory={selectedBook} />; 
      case 'admin': return user ? <AdminPanel onLogout={handleLogout} /> : <Login />;
      default: return <HomePage navigate={navigate} />;
    }
  };
  
  const appStyle = {
    backgroundImage: `url(${backgroundImage})`
  };

  const showHeader = view === 'home' || view === 'login';
  const showFooter = view === 'home' || view === 'book';

  return (
    <div className="app-container" style={appStyle}>
      {showHeader && <AppHeader navigate={navigate} user={user} />}
      <main className="main-content">
        {renderCurrentView()}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;