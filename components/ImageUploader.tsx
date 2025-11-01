import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ImageFile } from '../types';

// Helper function to optimize images before upload
const optimizeImage = async (file: File): Promise<ImageFile> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error("Failed to get canvas context"));
                }
                const MAX_DIMENSION = 1024;
                let { width, height } = img;
                if (width > height) {
                    if (width > MAX_DIMENSION) {
                        height *= MAX_DIMENSION / width;
                        width = MAX_DIMENSION;
                    }
                } else {
                    if (height > MAX_DIMENSION) {
                        width *= MAX_DIMENSION / height;
                        height = MAX_DIMENSION;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    async (blob) => {
                        if (!blob) return reject(new Error("Canvas to Blob conversion failed"));
                        try {
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                            const base64 = dataUrl.split(',')[1];
                            resolve({
                                file: new File([blob], file.name, { type: 'image/jpeg' }),
                                dataUrl,
                                base64,
                                mimeType: 'image/jpeg',
                            });
                        } catch (error) {
                            reject(error);
                        }
                    }, 'image/jpeg', 0.9
                );
            };
            img.onerror = reject;
            if (typeof event.target?.result === 'string') {
                img.src = event.target.result;
            } else {
                reject(new Error("FileReader result is not a string"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

interface CameraViewProps {
    onCapture: (file: File) => void;
    onClose: () => void;
    initialFacingMode: 'user' | 'environment';
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose, initialFacingMode }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>(initialFacingMode);

    const startStream = useCallback(async () => {
        try {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Impossibile accedere alla fotocamera. Assicurati di aver dato i permessi.");
            onClose();
        }
    }, [facingMode, onClose]);

    useEffect(() => {
        startStream();
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [startStream]);

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0);
            canvas.toBlob(blob => {
                if (blob) {
                    const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
                    onCapture(file);
                }
            }, 'image/jpeg', 0.95);
        }
    };
    
    const toggleFacingMode = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 flex justify-around items-center">
                <button onClick={onClose} className="text-white text-sm">Annulla</button>
                <button onClick={handleCapture} className="w-16 h-16 rounded-full bg-white border-4 border-gray-400"></button>
                <button onClick={toggleFacingMode} className="text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" /></svg>
                </button>
            </div>
        </div>
    );
};

interface ImageUploaderProps {
    onFileSelect: (file: ImageFile | null) => void;
    title: string;
    subtitle: string;
    children?: React.ReactNode;
    imageKey: string;
    defaultCamera?: 'user' | 'environment';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, title, subtitle, children, imageKey, defaultCamera = 'user' }) => {
    const [isActive, setIsActive] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!imageKey && inputRef.current) {
            inputRef.current.value = "";
        }
    }, [imageKey]);

    const handleFile = useCallback(async (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            try {
                const optimizedFile = await optimizeImage(file);
                onFileSelect(optimizedFile);
            } catch (error) {
                console.error("Error optimizing image:", error);
                onFileSelect(null);
            }
        }
    }, [onFileSelect]);
    
    const handleCameraCapture = async (file: File) => {
        await handleFile(file);
        setIsCameraOpen(false);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsActive(false);
        handleFile(e.dataTransfer.files?.[0] ?? null);
    }, [handleFile]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files?.[0] ?? null);
    }, [handleFile]);
    
    const handlePaste = useCallback(async (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
                const file = items[i].getAsFile();
                if (file) {
                    await handleFile(file);
                    break; 
                }
            }
        }
    }, [handleFile]);

    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setIsActive(true);
        else if (e.type === 'dragleave') setIsActive(false);
    };

    const handleOpenCamera = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent file picker from opening
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            setIsCameraOpen(true);
        } else {
            alert("La fotocamera non è supportata da questo browser.");
        }
    };

    return (
        <>
            <div
                key={imageKey}
                tabIndex={0}
                onDrop={handleDrop}
                onDragEnter={handleDragEvents}
                onDragOver={handleDragEvents}
                onDragLeave={handleDragEvents}
                onPaste={handlePaste}
                className={`relative w-full aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 outline-none focus:ring-2 focus:ring-primary ${isActive ? 'border-primary bg-primary/10' : 'border-secondary bg-secondary/30 hover:bg-secondary/50 hover:border-secondary'}`}
            >
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
                {children || (
                     <div onClick={() => inputRef.current?.click()} className="cursor-pointer p-4 w-full h-full flex flex-col items-center justify-center">
                        <svg className="w-10 h-10 text-text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <h3 className="text-text-main font-semibold">{title}</h3>
                        <p className="text-text-muted text-sm">{subtitle}</p>
                     </div>
                )}
                <button onClick={handleOpenCamera} className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors" title="Scatta una foto">
                    <svg className="w-6 h-6 text-text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
            </div>
            {isCameraOpen && <CameraView onCapture={handleCameraCapture} onClose={() => setIsCameraOpen(false)} initialFacingMode={defaultCamera} />}
        </>
    );
};

export default ImageUploader;