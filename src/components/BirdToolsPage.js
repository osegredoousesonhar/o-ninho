// ===================================================================
// ARQUIVO COMPLETO PARA: src/components/BirdToolsPage.js (NOVO ARQUIVO)
// ===================================================================

import React from 'react';

// Importando ícones (vamos adicionar depois, por enquanto usamos texto)

function BirdToolsPage({ birdName, navigate }) {
  return (
    <div className="tools-page-container">
      {/* Botão para voltar para a Home */}
      <button className="back-button" onClick={() => navigate('home')}>
        &larr; Voltar
      </button>

      {/* Título da página, que muda dependendo da ave clicada */}
      <h1>Ferramentas para {birdName}</h1>
      
      {/* Container para os nossos 4 boxes */}
      <div className="tools-grid">

        {/* Box 1: Calculadora Genética */}
        <div className="tool-card">
          <div className="tool-icon">🧬</div>
          <h2>Calculadora Genética</h2>
          <p>Calcule os resultados genéticos dos seus casais com precisão.</p>
        </div>

        {/* Box 2: Mutações */}
        <div className="tool-card">
          <div className="tool-icon">🎨</div>
          <h2>Guia de Mutações</h2>
          <p>Explore um guia visual completo com todas as mutações da espécie.</p>
        </div>

        {/* Box 3: Saúde */}
        <div className="tool-card">
          <div className="tool-icon">❤️</div>
          <h2>Saúde e Manejo</h2>
          <p>Artigos e dicas essenciais para manter sua ave saudável e feliz.</p>
        </div>

        {/* Box 4: Conhecimento */}
        <div className="tool-card">
          <div className="tool-icon">📖</div>
          <h2>Base de Conhecimento</h2>
          <p>Aprenda tudo sobre a espécie, desde a alimentação até a reprodução.</p>
        </div>

      </div>
    </div>
  );
}

export default BirdToolsPage;