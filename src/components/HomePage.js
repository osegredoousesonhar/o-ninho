import React from 'react';
// Importe as imagens do seu diretório 'src/assets'
// Se você ainda não as moveu, por favor, crie a pasta 'assets' dentro de 'src'
// e coloque as imagens lá.
import calopsitaImg from '../assets/calopsita.png';
import ringneckImg from '../assets/ringneck.png';
import roselaImg from '../assets/rosela.png';

// Componente reutilizável para o Card da Ave
function BirdCard({ name, image, onClick }) {
  return (
    <div className="bird-card" onClick={onClick}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
    </div>
  );
}

function HomePage({ navigate }) {
  return (
    // O container principal da HomePage
    <div className="home-page-container">
      <h1>Bem-vindo ao O NINHO</h1>
      <h2>A Bíblia das aves exóticas. Clique em uma espécie para iniciar sua jornada de conhecimento.</h2>
      
      {/* O container que alinha os cards horizontalmente */}
      <div className="bird-cards-container">
        <BirdCard 
          name="Calopsitas" 
          image={calopsitaImg}
          onClick={() => navigate('book', 'Calopsitas')} 
        />
        <BirdCard 
          name="Ring Necks" 
          image={ringneckImg}
          onClick={() => navigate('book', 'Ring Necks')} 
        />
        <BirdCard 
          name="Roselas" 
          image={roselaImg}
          onClick={() => navigate('book', 'Roselas')} 
        />
      </div>
    </div>
  );
}

export default HomePage;