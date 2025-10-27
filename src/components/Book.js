import React, { useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import app from '../firebaseConfig.js';

const Page = React.forwardRef(({ imageUrl, number }, ref) => {
    const pageStyle = {
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    };
    return (
        <div style={pageStyle} ref={ref}>
            <img src={imageUrl} alt={`Página ${number}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
    );
});

function Book({ bookCategory }) {
    const [pages, setPages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!bookCategory) {
            setIsLoading(false);
            return;
        }
        const fetchPages = async () => {
            setIsLoading(true);
            const db = getFirestore(app);
            
            const itemsQuery = query(
                collection(db, "bookItems"), 
                where("category", "==", bookCategory)
            );
            
            const querySnapshot = await getDocs(itemsQuery);
            const pagesData = querySnapshot.docs.map(doc => doc.data());
            
            pagesData.sort((a, b) => a.fileName.localeCompare(b.fileName, undefined, { numeric: true, sensitivity: 'base' }));
            
            const orderedUrls = pagesData.map(page => page.fileURL);

            setPages(orderedUrls);
            setIsLoading(false);
        };
        fetchPages();
    }, [bookCategory]);

    if (isLoading) {
        return <div style={{textAlign: 'center', paddingTop: '50px'}}>Montando o livro...</div>;
    }

    if (pages.length === 0) {
        return (
            <div style={{textAlign: 'center', paddingTop: '50px'}}>
                <h2>{bookCategory}</h2>
                <p>Nenhum conteúdo publicado ainda.</p>
            </div>
        );
    }

    return (
        // ESTA É A LINHA ALTERADA
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#333333' }}>
            <HTMLFlipBook 
                width={450} 
                height={636}
                showCover={true}
                flippingTime={800}
                maxShadowOpacity={0.5}
            >
                {pages.map((pageUrl, index) => (
                    <Page key={index} imageUrl={pageUrl} number={index + 1} />
                ))}
            </HTMLFlipBook>
        </div>
    );
}

export default Book;