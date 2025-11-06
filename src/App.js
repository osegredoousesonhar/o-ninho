// ===================================================================
// ARQUIVO COMPLETO E FINAL PARA: src/App.js (INTEGRADO)
// ===================================================================

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; 
import app from './firebaseConfig.js';
import './App.css'; 

import logoImage from './assets/logo2.png';

import Login from './components/Login';
import HomePage from './components/HomePage';
import Book from './components/Book';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
// ===== MUDANÇA 1: Importamos nossa nova página de ferramentas =====
import BirdToolsPage from './components/BirdToolsPage';
// =================================================================

function AppHeader({ navigate, user }) {
  // ... (O seu componente AppHeader continua exatamente igual)
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
    // ... (O seu useEffect continua exatamente igual)
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (view !== 'book' && view !== 'tools') { // Adicionado 'tools' para não resetar a view
        if (currentUser) { setView('admin'); } 
        else { setView('home'); }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []); 

  const handleLogout = () => {
    // ... (Sua função handleLogout continua exatamente igual)
    const auth = getAuth(app);
    signOut(auth);
  };
  
  const navigate = (destination, bookCategory = null) => {
    // ... (Sua função navigate continua exatamente igual)
    if (bookCategory) { setSelectedBook(bookCategory); }
    setView(destination);
  };

  if (loading) { return <div className="loading-screen">Carregando...</div>; }
  
  const renderCurrentView = () => {
    switch (view) {
      case 'login': return <Login navigate={navigate} />;
      case 'book': return <Book bookCategory={selectedBook} />; 
      // ===== MUDANÇA 2: Adicionamos o 'case' para a nossa nova página =====
      case 'tools': return <BirdToolsPage birdName={selectedBook} navigate={navigate} />;
      // ===================================================================
      case 'admin': return user ? <AdminPanel user={user} onLogout={handleLogout} /> : <Login navigate={navigate} />;
      default: return <HomePage navigate={navigate} />;
    }
  };
  
  const showHeader = view === 'home' || view === 'login';
  // ===== MUDANÇA 3: Adicionamos a view 'tools' para mostrar o footer nela também =====
  const showFooter = view === 'home' || view === 'book' || view === 'tools';
  // =================================================================================

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