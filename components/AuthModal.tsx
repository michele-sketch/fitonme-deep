import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { signIn, signUp } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                await signUp(email, password);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || 'Si è verificato un errore.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleClose = () => {
        // Reset state on close
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setError('');
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-soft-lg w-full max-w-md p-8"
            >
                <div className="flex justify-end">
                     <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-text-main transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => { setIsLogin(true); setError(''); }}
                        className={`w-1/2 py-3 text-center font-semibold transition-colors ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-main'}`}
                    >
                        Accedi
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(''); }}
                        className={`w-1/2 py-3 text-center font-semibold transition-colors ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-main'}`}
                    >
                        Registrati
                    </button>
                </div>

                <div className="text-center mb-6">
                    <h2 className="font-display text-2xl font-bold text-text-main">
                        {isLogin ? 'Bentornato!' : 'Crea il tuo Account'}
                    </h2>
                     <p className="text-text-muted mt-2">
                        {isLogin ? 'Accedi per continuare.' : 'Registrati per iniziare a usare il servizio.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-muted">Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-text-muted">Password</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    
                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-300">
                        {loading ? 'Caricamento...' : (isLogin ? 'Accedi' : 'Registrati e Inizia')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;