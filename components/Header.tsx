import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

type InfoModalContent = 'how-it-works' | 'contact';

interface HeaderProps {
    onBuyCredits: () => void;
    onAuthClick: () => void;
    onMenuClick: (content: InfoModalContent) => void;
    onProfileClick: () => void; // Aggiunta prop per il profilo
}

const Header: React.FC<HeaderProps> = ({ onBuyCredits, onAuthClick, onMenuClick, onProfileClick }) => {
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const displayCredits = user ? user.credits : 0;

    const navLinks = [
        { label: 'Come Funziona', action: () => onMenuClick('how-it-works') },
        { label: 'Prezzi', action: () => {
            const pricingSection = document.querySelector('#pricing-section');
            if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' });
        }},
        { label: 'Contatti', action: () => onMenuClick('contact') }
    ];

    const handleLinkClick = (action: () => void) => {
        action();
        setIsMenuOpen(false);
    };
    
    const creditsDisplay = user && user.credits > 9999 
        ? '∞' 
        : displayCredits;

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-soft">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <h1 className="font-display text-2xl font-bold text-text-main cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            FitOn<span className="text-primary">Me</span>
                        </h1>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map(link => (
                             <button key={link.label} onClick={link.action} className="text-sm font-semibold text-text-muted hover:text-primary transition-colors">
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    {/* Right side buttons - Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                         <div className="text-sm font-semibold text-text-main bg-primary-light px-3 py-1 rounded-full">
                            Crediti: <span className="text-primary font-bold">{user ? creditsDisplay : 'N/A'}</span>
                        </div>
                       
                        {user ? (
                             <>
                                <button
                                    onClick={onBuyCredits}
                                    className="bg-primary-light text-primary font-bold py-2 px-4 rounded-lg text-sm hover:bg-primary/20 transition-colors"
                                >
                                    Compra Crediti
                                </button>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-text-muted font-medium">{user.email}</span>
                                     <span className="text-gray-300">|</span>
                                    <button onClick={onProfileClick} className="text-sm font-semibold text-text-muted hover:text-primary">
                                        Il Mio Profilo
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <button onClick={signOut} className="text-sm font-semibold text-text-muted hover:text-text-main">
                                        Esci
                                    </button>
                                </div>
                             </>
                        ) : (
                            <button
                                onClick={onAuthClick}
                                className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors"
                            >
                                Accedi / Registrati
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-text-muted hover:text-primary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
                        </button>
                    </div>
                </div>
            </div>

             {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full z-30">
                    <nav className="flex flex-col p-4 gap-4">
                        {navLinks.map(link => (
                             <button key={link.label} onClick={() => handleLinkClick(link.action)} className="text-left font-semibold text-text-muted hover:text-primary transition-colors py-2">
                                {link.label}
                            </button>
                        ))}
                        <hr className="border-gray-200" />
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="text-sm font-semibold text-text-main bg-primary-light px-3 py-2 rounded-full text-center">
                                Crediti: <span className="text-primary font-bold">{user ? creditsDisplay : 'N/A'}</span>
                            </div>
                            {user ? (
                                <>
                                    <button onClick={() => handleLinkClick(onBuyCredits)} className="w-full bg-primary-light text-primary font-bold py-2 px-4 rounded-lg text-sm hover:bg-primary/20 transition-colors">
                                        Compra Crediti
                                    </button>
                                    <button onClick={() => handleLinkClick(onProfileClick)} className="w-full bg-gray-200 text-text-main font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                                        Il Mio Profilo
                                    </button>
                                    <div className="flex items-center gap-3 self-center">
                                        <span className="text-sm text-text-muted font-medium">{user.email}</span>
                                        <button onClick={() => handleLinkClick(signOut)} className="font-semibold text-text-muted hover:text-text-main">
                                            Esci
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button onClick={() => handleLinkClick(onAuthClick)} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    Accedi / Registrati
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;