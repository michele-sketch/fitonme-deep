import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { generateImage, editImage } from './services/authService';
import { ImageFile } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PricingSection from './components/PricingSection';
import SplashScreen from './components/SplashScreen';
import PricingModal from './components/PricingModal';
import AuthModal from './components/AuthModal';
import LegalModal from './components/LegalModal';
import TaxInfoModal from './components/TaxInfoModal';
import CookieConsentBanner from './components/CookieConsentBanner';
import { STATUS_MESSAGES, DISCLAIMER_TEXT, PRIVACY_POLICY_TEXT } from './constants';
import RenderHistory from './components/RenderHistory';
import InfoModal from './components/InfoModal';
import TestimonialsSection from './components/TestimonialsSection';
import EditPanel from './components/EditPanel';

type InfoModalContent = 'how-it-works' | 'contact';

// Helper to convert data URL to the ImageFile structure needed by the API service
const dataUrlToImageFile = (dataUrl: string, filename: string = 'image.jpeg'): ImageFile => {
    const [header, base64] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeType });
    
    return {
        file: new File([blob], filename, { type: mimeType }),
        dataUrl,
        base64,
        mimeType,
    };
};


const App: React.FC = () => {
    const { user, loading: authLoading, refreshUser, addRenderToHistory } = useAuth();
    
    const [personImage, setPersonImage] = useState<ImageFile | null>(null);
    const [clothingImage, setClothingImage] = useState<ImageFile | null>(null);
    const [outputImage, setOutputImage] = useState<string | null>(null);
    const [isRendering, setIsRendering] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [legalAccepted, setLegalAccepted] = useState<boolean>(false);
    
    const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
    const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
    const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
    const [isResultViewerOpen, setIsResultViewerOpen] = useState(false);
    const [isTaxInfoModalOpen, setIsTaxInfoModalOpen] = useState<boolean>(false);

    const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
    const [infoModalContent, setInfoModalContent] = useState<InfoModalContent>('how-it-works');
    
    // State for editing functionality
    const [editPrompt, setEditPrompt] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    
    const availableCredits = user ? user.credits : 0;

    useEffect(() => {
        // This logic can be adjusted based on Bubble.io profile completion flags
        if (user && !user.firstName) { 
            const timer = setTimeout(() => {
                if (!isAuthModalOpen && !isLegalModalOpen && !isPricingModalOpen) {
                   setIsTaxInfoModalOpen(true);
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [user, isAuthModalOpen, isLegalModalOpen, isPricingModalOpen]);

    useEffect(() => {
        let interval: number | undefined;
        if (isRendering) {
            setStatusMessage(STATUS_MESSAGES[0]);
            let i = 1;
            interval = window.setInterval(() => {
                setStatusMessage(STATUS_MESSAGES[i % STATUS_MESSAGES.length]);
                i++;
            }, 2500);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRendering]);

    const handleRender = async () => {
        if (!personImage || !clothingImage) {
            setError("Per favore carica entrambe le immagini.");
            return;
        }
        if (!legalAccepted) {
            setError("Devi accettare la Privacy Policy e i Termini di Servizio per procedere.");
            return;
        }
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        if (availableCredits <= 0) {
            setIsPricingModalOpen(true);
            return;
        }

        setIsRendering(true);
        setError(null);
        setOutputImage(null);

        try {
            // Call the new API service which contacts the Bubble.io backend
            const result = await generateImage(personImage, clothingImage);
            setOutputImage(result.imageUrl);
            addRenderToHistory(result.imageUrl);
            await refreshUser(); // Refresh user data to get updated credits
        } catch (e: any) {
            setError(e.message || 'Si è verificato un errore durante la prova virtuale.');
        } finally {
            setIsRendering(false);
        }
    };
    
    const handleEdit = async () => {
        if (!outputImage || !editPrompt.trim()) {
            setError("Scrivi una modifica da applicare prima di procedere.");
            return;
        }
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        if (availableCredits <= 0) {
            setIsPricingModalOpen(true);
            return;
        }

        setIsEditing(true);
        setError(null);

        try {
            const imageToEdit = dataUrlToImageFile(outputImage);
            // Call the new API service for editing
            const result = await editImage(imageToEdit, editPrompt);
            setOutputImage(result.imageUrl);
            addRenderToHistory(result.imageUrl);
            await refreshUser(); // Refresh user data to get updated credits
            setEditPrompt(''); // Clear prompt after successful edit
        } catch (e: any) {
            setError(e.message || 'Si è verificato un errore durante la modifica.');
        } finally {
            setIsEditing(false);
        }
    };

    const handleReset = () => {
        setPersonImage(null);
        setClothingImage(null);
        setOutputImage(null);
        setError(null);
        setEditPrompt('');
    };


    const handleDownload = () => {
        if (!outputImage) return;
        const link = document.createElement('a');
        link.href = outputImage;
        link.download = `FitOnMe_${new Date().getTime()}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (!outputImage) return;
    
        const message = "Ciao! Guarda come ti starebbe questo vestito – prova virtuale grazie a FitOnMe!";
        
        try {
            // Using a CORS-friendly proxy if the image is on a different domain (like Cloudinary via Bubble)
            // This may not be needed if CORS headers are set correctly on the storage service.
            const response = await fetch(outputImage);
            const blob = await response.blob();
            const file = new File([blob], `FitOnMe_${new Date().getTime()}.jpeg`, { type: blob.type });
    
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Il tuo risultato FitOnMe',
                    text: message,
                });
            } else {
                const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            }
        } catch (error) {
            console.error('Errore durante la condivisione:', error);
            const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    const openLegalModal = (type: 'privacy' | 'terms') => {
        setLegalModalType(type);
        setIsLegalModalOpen(true);
    };

    const handleOpenInfoModal = (content: InfoModalContent) => {
        setInfoModalContent(content);
        setIsInfoModalOpen(true);
    };

    if (authLoading) {
        return <SplashScreen />;
    }

    const howItWorksSteps = [
        {
            icon: <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
            title: "1. Carica la Tua Foto",
            description: "Carica una tua foto a figura intera."
        },
        {
            icon: <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>,
            title: "2. Carica il Vestito",
            description: "Carica l'immagine del capo d'abbigliamento."
        },
        {
            icon: <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
            title: "3. Prova Virtuale",
            description: "L'AI ti mostrerà come ti sta. Scarica e condividi!"
        }
    ];
    
    return (
        <div className="bg-background min-h-screen text-text-main">
            <Header 
                onBuyCredits={() => setIsPricingModalOpen(true)} 
                onAuthClick={() => setIsAuthModalOpen(true)}
                onMenuClick={handleOpenInfoModal}
                onProfileClick={() => setIsTaxInfoModalOpen(true)}
            />
            <main className="px-4 sm:px-6 lg:px-8">
                <section className="text-center py-16 max-w-4xl mx-auto">
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-main">
                        FitOn<span className="text-primary">Me</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-text-muted">
                        Prova i vestiti virtualmente. Carica una tua foto e l'abito che ti piace.
                    </p>
                </section>

                <section className="max-w-5xl mx-auto mb-12">
                    <div className="text-center mb-10">
                         <h2 className="font-display text-3xl font-bold text-text-main">Come Funziona</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {howItWorksSteps.map(step => (
                            <div key={step.title} className="bg-white p-6 rounded-xl shadow-soft text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mb-4">
                                    {step.icon}
                                </div>
                                <h3 className="font-semibold text-lg text-text-main">{step.title}</h3>
                                <p className="text-text-muted text-sm mt-2">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section id="app-section" className="py-12">
                     <div className="bg-white rounded-2xl shadow-soft-lg p-6 sm:p-8 max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                             {/* Colonna Sinistra (Input - 40%) */}
                            <div className="lg:col-span-2 flex flex-col gap-6">
                                <div>
                                    <h3 className="font-display text-xl font-semibold mb-3 text-center">1. La tua Foto</h3>
                                    <ImageUploader onFileSelect={setPersonImage} title="Carica la tua foto" subtitle="a figura intera, con buona luce" imageKey={personImage?.dataUrl || ''} defaultCamera="environment">
                                        {personImage && <img src={personImage.dataUrl} alt="Person" className="w-full h-full object-contain rounded-xl" />}
                                    </ImageUploader>
                                </div>
                                <div>
                                    <h3 className="font-display text-xl font-semibold mb-3 text-center">2. Il Capo d'Abbigliamento</h3>
                                    <ImageUploader onFileSelect={setClothingImage} title="Carica il vestito" subtitle="dal catalogo, su manichino o steso" imageKey={clothingImage?.dataUrl || ''} defaultCamera="environment">
                                        {clothingImage && <img src={clothingImage.dataUrl} alt="Clothing" className="w-full h-full object-contain rounded-xl" />}
                                    </ImageUploader>
                                </div>

                                <div className="flex items-start mt-4">
                                    <input type="checkbox" id="legal" checked={legalAccepted} onChange={(e) => setLegalAccepted(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1 flex-shrink-0" />
                                    <label htmlFor="legal" className="ml-2 text-sm text-text-muted">{PRIVACY_POLICY_TEXT}</label>
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    <button onClick={handleRender} disabled={isRendering || !personImage || !clothingImage || !legalAccepted} className="bg-primary text-white font-bold py-4 px-6 rounded-lg hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xl w-full">
                                        {isRendering ? 'GENERAZIONE...' : 'FitOnMe'}
                                    </button>
                                    <button onClick={handleReset} title="Reset images" className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" /></svg>
                                    </button>
                                </div>

                                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">{error}</div>}
                                <p className="text-xs text-text-muted text-center">{DISCLAIMER_TEXT}</p>
                            </div>
                            
                            {/* Colonna Destra (Risultato - 60%) */}
                            <div className="lg:col-span-3 h-full flex flex-col">
                                {isRendering || isEditing ? (
                                    <div className="w-full h-full min-h-[600px] bg-gray-100 rounded-xl flex flex-col items-center justify-center relative group animate-pulse">
                                        <p className="text-text-muted font-semibold text-lg">{isRendering ? statusMessage : 'Applico la modifica...'}</p>
                                    </div>
                                ) : outputImage ? (
                                    <div className="animate-fade-in">
                                        <h3 className="font-display text-2xl font-bold text-center mb-4">Ecco il Risultato!</h3>
                                        <div onClick={() => setIsResultViewerOpen(true)} className="cursor-pointer relative group">
                                            <img src={outputImage} alt="Risultato della prova virtuale" className="rounded-lg shadow-soft w-full object-contain aspect-[3/4] bg-gray-100 transition-opacity group-hover:opacity-90" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                                            <button onClick={handleDownload} className="bg-secondary text-text-main font-bold py-2 px-5 rounded-lg hover:bg-secondary-hover transition-colors flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                Scarica
                                            </button>
                                            <button onClick={handleShare} className="bg-green-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.456l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l.474.854-1.217 4.433 4.515-1.182z" /></svg>
                                                Condividi su WhatsApp
                                            </button>
                                        </div>
                                        <EditPanel
                                            prompt={editPrompt}
                                            onPromptChange={setEditPrompt}
                                            onEdit={handleEdit}
                                            isEditing={isEditing}
                                            disabled={!user || availableCredits <= 0}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full min-h-[600px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center p-8">
                                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <h3 className="font-display text-2xl font-bold text-text-main">Il tuo risultato apparirà qui</h3>
                                        <p className="text-text-muted mt-2">Carica le immagini e clicca "FitOnMe" per vedere la magia.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
                
                <RenderHistory />

                <div id="pricing-section">
                    <PricingSection onChoosePlan={() => setIsPricingModalOpen(true)} />
                </div>
                
                <TestimonialsSection />

            </main>
            <footer className="bg-gray-100 border-t border-gray-200 mt-16">
                 <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-sm text-text-muted">
                    <p>FitOnMe è un servizio di INTERNO77</p>
                    <p>Sede: Meduna di Livenza (TV), Italia - P.IVA: IT04199540263</p>
                    <p>Email: <a href="mailto:info@interno77.it" className="hover:underline">info@interno77.it</a></p>
                    <p className="mt-4">&copy; {new Date().getFullYear()} FitOnMe. Tutti i diritti riservati.</p>
                     <p className="mt-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); openLegalModal('privacy'); }} className="hover:underline">Privacy Policy</a>
                        <span className="mx-2">|</span>
                        <a href="#" onClick={(e) => { e.preventDefault(); openLegalModal('terms'); }} className="hover:underline">Termini di Servizio</a>
                         <span className="mx-2">|</span>
                        <a href="https://fitonme.app/sito-principale" target="_blank" rel="noopener noreferrer" className="hover:underline">Torna al Negozio Principale</a>
                    </p>
                </div>
            </footer>
            
            {isPricingModalOpen && user && (
                <PricingModal 
                    isOpen={isPricingModalOpen} 
                    onClose={() => setIsPricingModalOpen(false)}
                    onLegalLinkClick={openLegalModal}
                />
            )}
            
            {isAuthModalOpen && !user && (
                <AuthModal 
                    isOpen={isAuthModalOpen} 
                    onClose={() => setIsAuthModalOpen(false)} 
                />
            )}
            
            {isLegalModalOpen && (
                <LegalModal 
                    isOpen={isLegalModalOpen} 
                    onClose={() => setIsLegalModalOpen(false)}
                    type={legalModalType}
                />
            )}
            
            {isTaxInfoModalOpen && user && (
                <TaxInfoModal 
                    isOpen={isTaxInfoModalOpen}
                    onClose={() => setIsTaxInfoModalOpen(false)}
                />
            )}

            {isInfoModalOpen && (
                <InfoModal 
                    isOpen={isInfoModalOpen}
                    onClose={() => setIsInfoModalOpen(false)}
                    contentType={infoModalContent}
                />
            )}

            <CookieConsentBanner onPrivacyClick={() => openLegalModal('privacy')} />

            {/* Result Viewer Modal */}
            {isResultViewerOpen && outputImage && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setIsResultViewerOpen(false)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <img src={outputImage} alt="Anteprima rendering" className="w-full h-full object-contain rounded-lg shadow-2xl" />
                         <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-4">
                             <button
                                onClick={handleDownload}
                                className="bg-secondary hover:bg-secondary-hover text-text-main font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Scarica
                            </button>
                             <button
                                onClick={() => setIsResultViewerOpen(false)}
                                className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
                            >
                                Chiudi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;