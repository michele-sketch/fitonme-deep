import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const RenderHistory: React.FC = () => {
    const { renderHistory, removeRenderFromHistory } = useAuth();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleDownload = () => {
        if (!selectedImage) return;
        const link = document.createElement('a');
        link.href = selectedImage;
        link.download = `FitOnMe_${new Date().getTime()}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleRemoveImage = (e: React.MouseEvent, imageSrc: string) => {
        e.stopPropagation(); // Prevent modal from opening when clicking delete
        removeRenderFromHistory(imageSrc);
    };

    if (renderHistory.length === 0) {
        return (
             <div className="bg-white p-6 rounded-2xl shadow-soft-lg">
                <h3 className="font-display font-bold text-xl text-text-main mb-4">La tua Cronologia Recente</h3>
                <div className="text-center text-text-muted p-8 border-2 border-dashed rounded-lg">
                    <h4 className="font-semibold text-lg">La cronologia è vuota</h4>
                    <p className="text-sm">Le immagini che generi appariranno qui.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white p-6 rounded-2xl shadow-soft-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display font-bold text-xl text-text-main">La tua Cronologia Recente</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {renderHistory.map((imageSrc, index) => (
                        <div key={index} 
                             className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
                             onClick={() => setSelectedImage(imageSrc)}>
                            <img src={imageSrc} alt={`Render ${index + 1}`} className="w-full h-full object-cover" />
                            <button 
                                onClick={(e) => handleRemoveImage(e, imageSrc)}
                                className="absolute top-1.5 right-1.5 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-opacity z-10"
                                title="Elimina immagine"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image Viewer Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="Anteprima rendering" className="w-full h-full object-contain rounded-lg shadow-2xl" />
                        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex gap-4">
                             <button
                                onClick={handleDownload}
                                className="bg-secondary hover:bg-secondary-hover text-text-main font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Scarica
                            </button>
                             <button
                                onClick={() => setSelectedImage(null)}
                                className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
                            >
                                Chiudi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RenderHistory;