import React, { useState } from 'react';
import { getAuth, signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, serverTimestamp, writeBatch, doc } from "firebase/firestore";
import app from '../firebaseConfig.js';

function AdminPanel({ onLogout }) {
    const [topicTitle, setTopicTitle] = useState('');
    const [files, setFiles] = useState([]);
    const [category, setCategory] = useState('Calopsitas');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files.length) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSaveTopic = async () => {
        if (!topicTitle || files.length === 0) {
            alert('Por favor, preencha o título e selecione os arquivos.');
            return;
        }
        setIsUploading(true);
        setUploadProgress('Iniciando...');
        const db = getFirestore(app);
        const storage = getStorage(app);
        const batch = writeBatch(db);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setUploadProgress(`Enviando ${i + 1}/${files.length}: ${file.name}`);
            const storagePath = `book_files/${category}/${topicTitle.replace(/\s+/g, '_')}/${file.name}`;
            const storageRef = ref(storage, storagePath);
            
            try {
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                const docRef = doc(collection(db, "bookItems"));
                
                batch.set(docRef, {
                    title: file.name.split('.')[0],
                    fileURL: downloadURL,
                    storagePath: storagePath,
                    category: category,
                    topic: topicTitle,
                    pageOrder: i + 1,
                    fileName: file.name,
                    createdAt: serverTimestamp() 
                });

            } catch (error) {
                console.error("Erro ao enviar o arquivo:", error);
                alert(`Ocorreu um erro ao enviar o arquivo ${file.name}.`);
                setIsUploading(false);
                setUploadProgress('');
                return;
            }
        }
        
        try {
            await batch.commit();
            alert(`Tópico "${topicTitle}" salvo com sucesso!`);
        } catch (error) {
            console.error("Erro ao salvar no Firestore:", error);
            alert("Erro ao salvar as referências no banco de dados.");
        }

        setTopicTitle('');
        setFiles([]);
        if(document.getElementById('file-input')) {
            document.getElementById('file-input').value = null;
        }
        setIsUploading(false);
        setUploadProgress('');
    };

    return (
        <div className="admin-panel">
            <header className="app-header">
                <div className="header-logo">O NINHO - Painel de Administração</div>
                <button onClick={onLogout} className="header-login-link">Sair</button>
            </header>

            <section className="admin-section">
                <h3>Adicionar Tópico/Capítulo (com Múltiplas Páginas)</h3>
                <div className="admin-form">
                    <label htmlFor="category-select">Escolha o livro:</label>
                    <select id="category-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Calopsitas">Livro: Calopsitas</option>
                        <option value="Ring Necks">Livro: Ring Necks</option>
                        <option value="Roselas">Livro: Roselas</option>
                    </select>

                    <label htmlFor="topic-title-input">Título do Tópico/Capítulo:</label>
                    <input id="topic-title-input" type="text" placeholder="Ex: Capítulo 1 - Introdução" value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} />
                    
                    <label htmlFor="file-input">Selecione os arquivos das páginas (pode selecionar vários):</label>
                    <input 
                        type="file" 
                        id="file-input" 
                        onChange={handleFileChange} 
                        multiple
                    />

                    <button onClick={handleSaveTopic} disabled={isUploading}>
                        {isUploading ? 'Enviando...' : 'Salvar Tópico'}
                    </button>
                    {isUploading && <p>{uploadProgress}</p>}
                </div>
            </section>
        </div>
    );
}

export default AdminPanel;