import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PLANS, SALES_TERMS_TEXT } from '../constants';
import { PlanId } from '../types';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLegalLinkClick: (type: 'privacy' | 'terms') => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onLegalLinkClick }) => {
    const { purchaseCredits } = useAuth();
    const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(PLANS.find(p => p.mostPopular)?.id || PLANS[0].id);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const selectedPlan = PLANS.find(p => p.id === selectedPlanId) || PLANS[0];

    useEffect(() => {
        if(isOpen) {
            setTermsAccepted(false);
            setIsProcessing(false);
            setError('');
        }
    }, [isOpen]);

    const handlePurchase = async () => {
        if (!selectedPlanId || !termsAccepted) return;
        
        setIsProcessing(true);
        setError('');

        try {
            await purchaseCredits(selectedPlanId);
            alert(`Acquisto completato! Hai ricevuto ${selectedPlan.credits} crediti.`);
            onClose();
        } catch (err: any) {
            console.error("Errore durante l'acquisto:", err);
            setError(err.message || 'Si è verificato un errore durante il pagamento.');
        } finally {
            setIsProcessing(false);
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-soft-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8"
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-main">Non hai abbastanza crediti</h2>
                        <p className="text-text-muted mt-1">Scegli un pacchetto per continuare a creare.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-text-main transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {PLANS.map((plan) => (
                        <div key={plan.id} 
                            onClick={() => setSelectedPlanId(plan.id)}
                            className={`cursor-pointer relative border-2 rounded-xl p-6 flex flex-col transition-all duration-200 ${selectedPlanId === plan.id ? 'border-primary shadow-soft ring-2 ring-primary' : 'border-gray-200 hover:border-gray-400'}`}>
                            {plan.mostPopular && (
                                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Più Popolare</div>
                            )}
                            <h3 className="text-xl font-semibold text-text-main">{plan.name}</h3>
                            <p className="text-sm text-text-muted mb-4">{plan.credits} crediti</p>
                            <div className="my-4">
                                <span className="font-display text-4xl font-extrabold text-text-main">€{plan.price}</span>
                            </div>
                            <ul className="space-y-2 text-sm text-text-muted mb-6 flex-grow">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="bg-primary-light/50 p-6 rounded-lg">
                     <div className="flex items-start mb-4">
                        <input 
                            type="checkbox" 
                            id="terms" 
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1 flex-shrink-0"
                        />
                        <label htmlFor="terms" className="ml-3 block text-sm text-text-muted">
                            Accetto i <a href="#" onClick={(e) => { e.preventDefault(); onLegalLinkClick('terms'); }} className="font-semibold text-primary hover:underline">Termini di Servizio</a>. Comprendo e accetto che, acquistando crediti (un bene digitale), perdo il mio diritto di recesso di 14 giorni non appena l'acquisto è completato.
                        </label>
                    </div>
                    
                    {error && <p className="text-sm text-red-600 text-center mb-2">{error}</p>}
                    
                    <button
                        onClick={handlePurchase}
                        disabled={!termsAccepted || isProcessing}
                        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isProcessing ? 'Elaborazione...' : `Acquista Pacchetto ${selectedPlan.name} - €${selectedPlan.price}`}
                    </button>
                </div>

                 <p className="text-xs text-gray-400 text-center mt-6">{SALES_TERMS_TEXT}</p>

            </div>
        </div>
    );
};

export default PricingModal;