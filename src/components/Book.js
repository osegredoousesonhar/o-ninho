import React, { useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { getFirestore, collection, getDocs, orderBy, query, where } from "firebase/firestore"; 
import app from '../firebaseConfig.js';

// Componente para UMA PÁGINA (agora, apenas uma imagem)
const Page = React.forwardRef(({ imageUrl, number }, ref) => {
    return (
        <div className="page" ref={ref} style={{backgroundColor: '#FFF', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={imageUrl} alt={`Página ${number}`} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
    );
});


function Book({ bookCategory }) {
    const [pages, setPages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!bookCategory) { setIsLoading(false); return; }

        const fetchPages = async () => {
            setIsLoading(true);
            const db = getFirestore(app);
            
            // AQUI ESTÁ A MUDANÇA
            const itemsQuery = query(
                collection(db, "bookItems"), 
                where("category", "==", bookCategory),
                orderBy("fileName", "asc") // Ordenamos pelo nome do arquivo
            );
            
            const querySnapshot = await getDocs(itemsQuery);
            const pagesData = querySnapshot.docs.map(doc => doc.data());
            
            setPages(pagesData);
            setIsLoading(false);
        };

        fetchPages();
    }, [bookCategory]);

    if (isLoading) { return <div style={{textAlign: 'center', paddingTop: '50px'}}>Carregando livro...</div>; }
    if (pages.length === 0) { return <div style={{textAlign: 'center', paddingTop: '50px'}}><h2>{bookCategory}</h2><p>Nenhuma página publicada para este livro ainda.</p></div>; }


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#e0e0e0' }}>
            <HTMLFlipBook 
                width={500} 
                height={700}
                showCover={true}
                flippingTime={800}
                maxShadowOpacity={0.5}
            >
                {pages.map((page, index) => (
                    <Page key={index} imageUrl={page.fileURL} number={index + 1} />
                ))}
            </HTMLFlipBook>
        </div>
    );
}

export default Book;