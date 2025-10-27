import React, { useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { getFirestore, collection, getDocs, orderBy, query, where } from "firebase/firestore"; 
import app from '../firebaseConfig.js';

// Importamos a biblioteca que vai "ler" o PDF e seus estilos
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

// Este componente renderiza o LIVRO com efeito de virar a página
function PdfFlipBook({ fileUrl }) {
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { jumpToPage } = pageNavigationPluginInstance;
    const [numPages, setNumPages] = useState(0);

    return (
        <div style={{ position: 'relative', width: '500px', height: '700px' }}>
            <div style={{ display: 'none' }}>
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                    <Viewer 
                        fileUrl={fileUrl}
                        plugins={[pageNavigationPluginInstance]}
                        onDocumentLoad={({ numPages: nextNumPages }) => setNumPages(nextNumPages)}
                    />
                </Worker>
            </div>

            {numPages > 0 && (
                <HTMLFlipBook 
                    width={500} 
                    height={700} 
                    onFlip={(e) => jumpToPage(e.data)}
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <div className="page" key={`page_${index + 1}`} style={{ backgroundColor: '#fdfaf7', border: '1px solid #c2b5a3' }}>
                            {/* Conteúdo será mostrado pelo Viewer flutuante */}
                        </div>
                    ))}
                </HTMLFlipBook>
            )}

            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                     <Viewer 
                        fileUrl={fileUrl}
                        plugins={[pageNavigationPluginInstance]}
                    />
                </Worker>
            </div>
        </div>
    );
}

// Componente principal que busca os dados no Firestore
function Book({ bookCategory }) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!bookCategory) {
            setIsLoading(false);
            return;
        }
        const fetchItems = async () => {
            setIsLoading(true);
            const db = getFirestore(app);
            const itemsQuery = query(
                collection(db, "bookItems"), 
                where("category", "==", bookCategory),
                orderBy("createdAt")
            );
            
            const querySnapshot = await getDocs(itemsQuery);
            const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            setItems(itemsData);
            setIsLoading(false);
        };
        fetchItems();
    }, [bookCategory]);

    if (isLoading) {
        return <div style={{textAlign: 'center', paddingTop: '50px'}}>Carregando livro...</div>;
    }

    if (items.length === 0) {
        return (
            <div style={{textAlign: 'center', paddingTop: '50px'}}>
                <h2>{bookCategory}</h2>
                <p>Nenhum conteúdo publicado para este livro ainda.</p>
            </div>
        );
    }

    const bookFile = items[0]; 

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#e0e0e0' }}>
            {bookFile && bookFile.fileURL.includes('.pdf') ? (
                <PdfFlipBook fileUrl={bookFile.fileURL} />
            ) : (
                <p>Este item não é um PDF.</p>
            )}
        </div>
    );
}

export default Book;