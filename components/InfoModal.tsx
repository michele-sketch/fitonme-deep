import React from 'react';

type InfoModalContent = 'how-it-works' | 'contact';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    contentType: InfoModalContent;
}

const HowItWorksContent: React.FC = () => {
    const steps = [
        {
            icon: <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
            title: "1. Carica la Tua Foto",
            description: "Carica una tua foto a figura intera, con una buona illuminazione e una posa frontale."
        },
        {
            icon: <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>,
            title: "2. Carica il Vestito",
            description: "Carica l'immagine del capo d'abbigliamento che vuoi provare, preferibilmente su un manichino o steso."
        },
        {
            icon: <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
            title: "3. Prova Virtuale",
            description: "La nostra AI ti mostrerà in pochi secondi come ti sta il capo. Potrai poi scaricare e condividere il risultato!"
        }
    ];

    return (
        <div className="space-y-6">
            {steps.map(step => (
                <div key={step.title} className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        {step.icon}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-text-main">{step.title}</h3>
                        <p className="text-text-muted text-sm mt-1">{step.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ContactContent: React.FC = () => (
    <div className="space-y-4 text-text-muted">
        <p>Per qualsiasi domanda, richiesta di supporto o collaborazione, non esitare a contattarci.</p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="font-semibold text-text-main">FitOnMe - un servizio di INTERNO77</p>
            <p>Sede: Meduna di Livenza (TV), Italia</p>
            <p>P.IVA: IT04199540263</p>
            <p>
                Email: <a href="mailto:info@interno77.it" className="hover:underline text-primary font-medium">info@interno77.it</a>
            </p>
        </div>
        <p>Rispondiamo solitamente entro 24-48 ore lavorative.</p>
    </div>
);


const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, contentType }) => {
    if (!isOpen) {
        return null;
    }

    const content = {
        'how-it-works': {
            title: 'Come Funziona FitOnMe',
            component: <HowItWorksContent />
        },
        'contact': {
            title: 'Contattaci',
            component: <ContactContent />
        }
    };

    const selectedContent = content[contentType];

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            >
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="font-display text-xl font-bold text-slate-800">{selectedContent.title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-800 transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {selectedContent.component}
                </div>
                 <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
                    <button 
                        onClick={onClose}
                        className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-5 rounded-lg transition-colors"
                    >
                        Chiudi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;