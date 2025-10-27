import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; 
import app from './firebaseConfig.js';

import Login from './components/Login';
import HomePage from './components/HomePage';
import Book from './components/Book';
import AdminPanel from './components/AdminPanel';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null); 

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setView('admin');
      } else {
        setView('home');
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
    // Garantimos que a categoria seja salva antes de mudar a visão
    if (bookCategory) {
      setSelectedBook(bookCategory);
    }
    setView(destination);
  };

  if (loading) return <div>Carregando...</div>;
  
  switch (view) {
    case 'login':
      return <Login />;
    case 'book':
      // Passamos a categoria do livro para o componente Book
      return <Book bookCategory={selectedBook} />;
    case 'admin':
      return user ? <AdminPanel onLogout={handleLogout} /> : <Login />;
    case 'home':
    default:
      return <HomePage navigate={navigate} />;
  }
}

export default App;