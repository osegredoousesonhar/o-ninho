import React from 'react';

// Importamos APENAS as imagens das aves
import calopsitaImg from '../imagens/calopsita.jpg';
import ringneckImg from '../imagens/ringneck.jpg';
import roselaImg from '../imagens/rosela.jpg';

function LandingPage({ navigate }) {

  return (
    <div className="landing-container">
      
      <h1 className="landing-title">Bem-vindo ao O NINHO</h1>
      <p className="landing-subtitle">
        A Bíblia das aves exóticas. Clique em uma espécie para iniciar sua jornada de conhecimento.
      </p>

      <div className="birds-grid">
        
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

export default LandingPage;