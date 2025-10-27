import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import app from '../firebaseConfig.js';

function AdminPanel({ onLogout }) { 
  const [itemTitle, setItemTitle] = useState('');
  const [file, setFile] = useState(null);
  // "Memória" para guardar a categoria selecionada. O valor inicial é 'Calopsitas'.
  const [category, setCategory] = useState('Calopsitas'); 
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSaveItem = async () => {
    if (!itemTitle || !file || !category) {
      alert('Por favor, preencha o título, a categoria e selecione um arquivo.');
      return;
    }
    setIsUploading(true);
    
    try {
      const storage = getStorage(app);
      // O arquivo será salvo numa subpasta com o nome da categoria para melhor organização
      const storageRef = ref(storage, `book_files/${category}/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      const db = getFirestore(app);

      // Salvamos o item com a sua "etiqueta" de categoria
      await addDoc(collection(db, "bookItems"), {
        title: itemTitle,
        fileURL: downloadURL,
        fileName: file.name,
        category: category, // A ETIQUETA IMPORTANTE
        createdAt: serverTimestamp() 
      });

      alert('Item salvo com sucesso na categoria: ' + category);
      setItemTitle('');
      setFile(null);
      document.getElementById('file-input').value = null;

    } catch (e) {
      console.error("Erro no processo: ", e);
      alert('Ocorreu um erro ao salvar.');
    }
    setIsUploading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Painel de Administração - Gerenciador de Conteúdo</h2>
      <button onClick={onLogout} style={{ float: 'right' }}>Sair</button>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Adicionar Novo Item ao Livro</h3>
        
        {/* ESTE É O SELETOR DE CATEGORIA */}
        <label htmlFor="category-select">Escolha o livro para adicionar o arquivo:</label>
        <select 
          id="category-select"
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', marginTop: '5px' }}
        >
          <option value="Calopsitas">Livro: Calopsitas</option>
          <option value="Ring Necks">Livro: Ring Necks</option>
          <option value="Roselas">Livro: Roselas</option>
        </select>
        
        <input 
          type="text" 
          placeholder="Título do Item (ex: Capa, Capítulo 1)" 
          value={itemTitle}
          onChange={(e) => setItemTitle(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button onClick={handleSaveItem} disabled={isUploading}>
          {isUploading ? 'Enviando...' : 'Salvar Item'}
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;