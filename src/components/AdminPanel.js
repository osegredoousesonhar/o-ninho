import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import app from '../firebaseConfig.js';

function AdminPanel({ onLogout }) {
    const [files, setFiles] = useState([]); // Agora pode guardar múltiplos arquivos
    const [category, setCategory] = useState('Calopsitas');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            // Converte a lista de arquivos em um array para podermos usar 'map'
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSaveItems = async () => {
        if (files.length === 0 || !category) {
            alert('Por favor, selecione uma categoria e um ou mais arquivos de imagem.');
            return;
        }
        setIsUploading(true);

        // Usamos Promise.all para fazer o upload de todos os arquivos em paralelo
        await Promise.all(
            files.map(async (file) => {
                try {
                    const storage = getStorage(app);
                    const storageRef = ref(storage, `book_files/${category}/${file.name}`);
                    const uploadResult = await uploadBytes(storageRef, file);
                    const downloadURL = await getDownloadURL(uploadResult.ref);
                    const db = getFirestore(app);

                    // Salvamos um documento para CADA imagem
                    await addDoc(collection(db, "bookItems"), {
                        title: file.name.replace(/\.[^/.]+$/, ""), // Usa o nome do arquivo (sem extensão) como título
                        fileURL: downloadURL,
                        fileName: file.name,
                        category: category,
                        createdAt: serverTimestamp()
                    });
                } catch (e) {
                    console.error("Erro ao salvar o arquivo:", file.name, e);
                    // Podemos adicionar uma lógica para notificar sobre falhas individuais
                }
            })
        );

        alert(`${files.length} páginas foram salvas com sucesso na categoria: ${category}`);
        setIsUploading(false);
        setFiles([]);
        document.getElementById('file-input').value = null;
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Painel de Administração - Publicar Páginas</h2>
            <button onClick={onLogout} style={{ float: 'right' }}>Sair</button>
            
            <div style={{ marginTop: '30px' }}>
                <h3>Adicionar Páginas (Imagens) a um Livro</h3>
                
                <label htmlFor="category-select">Escolha o livro:</label>
                <select id="category-select" value={category} onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', marginTop: '5px' }}>
                    <option value="Calopsitas">Livro: Calopsitas</option>
                    <option value="Ring Necks">Livro: Ring Necks</option>
                    <option value="Roselas">Livro: Roselas</option>
                </select>
                
                <label htmlFor="file-input">Selecione as imagens das páginas:</label>
                <input type="file" id="file-input" onChange={handleFileChange} multiple // A palavra "multiple" é a chave aqui
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', marginTop: '5px' }} />
                
                <button onClick={handleSaveItems} disabled={isUploading || files.length === 0}>
                    {isUploading ? `Enviando ${files.length} páginas...` : 'Salvar Páginas'}
                </button>
            </div>
        </div>
    );
}

export default AdminPanel;