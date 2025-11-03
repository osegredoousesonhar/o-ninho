// ===================================================================
// ARQUIVO COMPLETO E CORRIGIDO PARA: src/components/AdminPanel.js
// ===================================================================

import React, { useState, useEffect } from 'react';
// Importamos o 'app' principal
import app from '../firebaseConfig.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirestore, collection, getDocs, serverTimestamp, writeBatch, doc } from "firebase/firestore";

function AdminPanel({ user, onLogout }) {
    const [topicTitle, setTopicTitle] = useState('');
    const [files, setFiles] = useState([]);
    const [category, setCategory] = useState('Calopsitas');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [publishedItems, setPublishedItems] = useState([]);
    const [isLoadingItems, setIsLoadingItems] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoadingItems(true);
            // Obtemos o serviço do Firestore usando o 'app' importado
            const db = getFirestore(app);
            try {
                const querySnapshot = await getDocs(collection(db, "bookitems"));
                const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPublishedItems(items);
            } catch (error) {
                console.error("Erro ao buscar itens:", error);
            } finally {
                setIsLoadingItems(false);
            }
        };
        if (user) { fetchItems(); } 
        else { setIsLoadingItems(false); }
    }, [user]);

    const handleFileChange = (e) => { if (e.target.files.length) { setFiles(Array.from(e.target.files)); } };

    const handleSaveTopic = async () => {
        if (!topicTitle || files.length === 0) { alert('Por favor, preencha o título e selecione os arquivos.'); return; }
        setIsUploading(true);
        setUploadProgress('Iniciando...');
        const db = getFirestore(app);
        const storage = getStorage(app);
        const batch = writeBatch(db);
        const newItems = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setUploadProgress(`Enviando ${i + 1}/${files.length}: ${file.name}`);
            const storagePath = `book_files/${category}/${topicTitle.replace(/\s+/g, '_')}/${file.name}`;
            const storageRef = ref(storage, storagePath);
            try {
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                const docRef = doc(collection(db, "bookitems"));
                const newItemData = { title: file.name.split('.')[0], fileURL: downloadURL, storagePath: storagePath, category: category, topic: topicTitle, pageOrder: i + 1, fileName: file.name, createdAt: serverTimestamp() };
                batch.set(docRef, newItemData);
                newItems.push({ id: docRef.id, ...newItemData, createdAt: new Date() });
            } catch (error) { console.error("Erro ao enviar o arquivo:", error); alert(`Ocorreu um erro ao enviar o arquivo ${file.name}.`); setIsUploading(false); setUploadProgress(''); return; }
        }
        try {
            await batch.commit();
            alert(`Tópico "${topicTitle}" salvo com sucesso!`);
            setPublishedItems(currentItems => [...currentItems, ...newItems]);
        } catch (error) { console.error("Erro ao salvar no Firestore:", error); alert("Erro ao salvar as referências no banco de dados."); }
        setTopicTitle(''); setFiles([]); if (document.getElementById('file-input')) { document.getElementById('file-input').value = null; } setIsUploading(false); setUploadProgress('');
    };
    
    const handleDeleteTopic = async (categoryToDelete, topicToDelete) => {
        if (!window.confirm(`Tem certeza que deseja apagar o tópico "${topicToDelete}" e todos os seus arquivos? Esta ação não pode ser desfeita.`)) { return; }
        setIsDeleting(true);
        const db = getFirestore(app);
        const storage = getStorage(app);
        const batch = writeBatch(db);
        const itemsToDelete = publishedItems.filter(item => item.category === categoryToDelete && item.topic === topicToDelete);
        if (itemsToDelete.length === 0) { alert("Nenhum item encontrado para apagar."); setIsDeleting(false); return; }
        try {
            for (const item of itemsToDelete) {
                const fileRef = ref(storage, item.storagePath); await deleteObject(fileRef);
            }
            itemsToDelete.forEach(item => {
                const docRef = doc(db, "bookitems", item.id);
                batch.delete(docRef);
            });
            await batch.commit();
            setPublishedItems(currentItems => currentItems.filter(item => !(item.category === categoryToDelete && item.topic === topicToDelete)));
            alert(`Tópico "${topicToDelete}" apagado com sucesso!`);
        } catch (error) { console.error("Erro ao apagar o tópico:", error); alert("Ocorreu um erro ao apagar o tópico. Verifique o console para mais detalhes."); }
        setIsDeleting(false);
    };

    const groupedItems = publishedItems.reduce((acc, item) => { acc[item.category] = acc[item.category] || {}; acc[item.category][item.topic] = acc[item.category][item.topic] || []; acc[item.category][item.topic].push(item); return acc; }, {});

    return (
        <div className="admin-panel">
            <header className="admin-header"><h2>O NINHO - Painel de Administração</h2><button onClick={onLogout} className="logout-button">Sair</button></header>
            <section className="admin-section">
                <h3>Adicionar Novo Tópico/Capítulo</h3>
                <div className="admin-form">
                    <label htmlFor="category-select">Escolha o livro:</label>
                    <select id="category-select" value={category} onChange={(e) => setCategory(e.target.value)}><option value="Calopsitas">Livro: Calopsitas</option><option value="Ring Necks">Livro: Ring Necks</option><option value="Roselas">Livro: Roselas</option></select>
                    <label htmlFor="topic-title-input">Título do Tópico/Capítulo:</label>
                    <input id="topic-title-input" type="text" placeholder="Ex: Capítulo 1 - Introdução" value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} />
                    <label htmlFor="file-input">Selecione os arquivos das páginas (pode selecionar vários):</label>
                    <input type="file" id="file-input" onChange={handleFileChange} multiple />
                    <button onClick={handleSaveTopic} disabled={isUploading || isDeleting}>{isUploading ? 'Enviando...' : 'Salvar Tópico'}</button>
                    {isUploading && <p>{uploadProgress}</p>}
                </div>
            </section>
            <section className="admin-section">
                <h3>Tópicos Publicados</h3>
                <div className="published-list">
                    {isLoadingItems ? (<p>Carregando tópicos...</p>) : Object.keys(groupedItems).length === 0 ? (<p>Nenhum tópico publicado ainda.</p>) : (Object.keys(groupedItems).map(categoryName => (<div key={categoryName} className="category-group"><h4>Livro: {categoryName}</h4><ul>{Object.keys(groupedItems[categoryName]).map(topicName => (<li key={topicName} className="published-list-item"><span>{topicName} ({groupedItems[categoryName][topicName].length} pág.)</span><button onClick={() => handleDeleteTopic(categoryName, topicName)} disabled={isDeleting}>{isDeleting ? 'Apagando...' : 'Apagar'}</button></li>))}</ul></div>)))}
                </div>
            </section>
        </div>
    );
}

export default AdminPanel;