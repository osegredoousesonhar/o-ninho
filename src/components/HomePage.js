// ===================================================================
// ARQUIVO COMPLETO PARA: src/components/HomePage.js
// ===================================================================

import React from 'react';

// Importando as imagens dos pássaros
import calopsitaImg from '../assets/calopsita.png';
import ringneckImg from '../assets/ringneck.png';
import roselaImg from '../assets/rosela.png';

function HomePage({ navigate }) {
  return (
    <div className="home-page-container">
      {/* ===== MUDANÇA: Textos alterados conforme solicitado ===== */}
      <h1>SEJA BEM VINDO</h1>
      <h2>ESTÁ EM BUSCA DE CONHECIMENTO ESTA NO LOCAL CERTO</h2>
      {/* ====================================================== */}

      <div className="bird-cards-container">
        <div className="bird-card" onClick={() => navigate('book', 'Calopsitas')}>
          <img src={calopsitaImg} alt="Calopsita" />
          <h3>Calopsitas</h3>
        </div>
        <div className="bird-card" onClick={() => navigate('book', 'Ring Necks')}>
          <img src={ringneckImg} alt="Ring Neck" />
          <h3>Ring Necks</h3>
        </div>
        <div className="bird-card" onClick={() => navigate('book', 'Roselas')}>
          <img src={roselaImg} alt="Rosela" />
          <h3>Roselas</h3>
        </div>
      </div>
    </div>
  );
}

export default HomePage;