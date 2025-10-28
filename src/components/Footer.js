import React, { useEffect } from 'react';

function Footer() {
  const footerStyle = {
    width: '100%',
    
    /* --- AJUSTE 2: SUBIR O RODAPÉ --- */
    /* Diminuímos o padding vertical para ele ficar mais "enxuto" */
    padding: '10px 0', 

    backgroundColor: 'rgba(26, 35, 46, 0.9)',
    textAlign: 'center',
    color: '#bdc3c7',
    
    /* Esta propriedade impede que o rodapé encolha */
    flexShrink: 0, 
  };

  const adContainerStyle = {
    width: '728px',
    height: '90px',
    backgroundColor: '#333',
    margin: '5px auto 0 auto', // Diminuímos a margem superior
    border: '1px solid #444',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px'
  };

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Erro ao carregar anúncio do AdSense:", e);
    }
  }, []);

  return (
    <footer style={footerStyle}>
      <p style={{ margin: '0 0 5px 0' }}>Publicidade</p>
      <div style={adContainerStyle}>
        <ins className="adsbygoogle"
             style={{ display: 'inline-block', width: '728px', height: '90px' }}
             data-ad-client="ca-pub-SEU_CLIENT_ID"
             data-ad-slot="SEU_SLOT_ID"></ins>
        <span>Espaço reservado para anúncio (728x90)</span>
      </div>
    </footer>
  );
}

export default Footer;