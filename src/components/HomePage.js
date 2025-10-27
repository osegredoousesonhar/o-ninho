import React from 'react';

function HomePage({ navigate }) {
  const pageStyle = {
    textAlign: 'center',
    padding: '50px',
    fontFamily: 'Arial, sans-serif',
    position: 'relative'
  };
  const buttonStyle = {
    fontSize: '20px',
    padding: '15px 30px',
    margin: '10px',
    cursor: 'pointer'
  };
  const loginLinkStyle = {
    position: 'absolute',
    top: '10px',
    right: '20px',
    cursor: 'pointer',
    textDecoration: 'underline'
  };

  return (
    <div style={pageStyle}>
      <div onClick={() => navigate('login')} style={loginLinkStyle}>Acesso Restrito</div>
      <h1>O NINHO</h1>
      <h2>O Impressionante Mundo das Aves Exóticas</h2>
      <p>Selecione uma espécie para começar sua jornada:</p>
      <div>
        {/* Cada botão passa a categoria para a função de navegação */}
        <button style={buttonStyle} onClick={() => navigate('book', 'Calopsitas')}>CALOPSITAS</button>
        <button style={buttonStyle} onClick={() => navigate('book', 'Ring Necks')}>RING NECKS</button>
        <button style={buttonStyle} onClick={() => navigate('book', 'Roselas')}>ROSELAS</button>
      </div>
    </div>
  );
}

export default HomePage;