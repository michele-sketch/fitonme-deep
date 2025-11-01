import React, { useState, useEffect } from 'react';
import { COOKIE_CONSENT_TEXT } from '../constants';

interface CookieConsentBannerProps {
    onPrivacyClick: () => void;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onPrivacyClick }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            if (!localStorage.getItem('cookie_consent')) {
                setVisible(true);
            }
        } catch (error) {
            console.error("Could not access localStorage:", error);
        }
    }, []);

    const handleAccept = () => {
        try {
            localStorage.setItem('cookie_consent', 'true');
            setVisible(false);
        } catch (error) {
            console.error("Could not set localStorage item:", error);
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 z-50 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <p className="text-sm">
                {COOKIE_CONSENT_TEXT} 
                <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); onPrivacyClick(); }} 
                    className="underline hover:text-slate-300 ml-1"
                >
                    Privacy Policy
                </a>.
            </p>
            <button onClick={handleAccept} className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-5 rounded-lg transition-colors whitespace-nowrap">
                Accetta
            </button>
        </div>
    );
};

export default CookieConsentBanner;
