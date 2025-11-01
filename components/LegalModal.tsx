import React from 'react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'privacy' | 'terms' | null;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
    if (!isOpen || !type) return null;

    const content = {
        privacy: {
            title: 'Informativa sulla Privacy (Privacy Policy)',
            body: `
                <h3 class="font-bold text-lg mb-2">Introduzione</h3>
                <p class="mb-4">Questa è l'informativa sulla privacy di FitOnMe ("noi", "ci"). Rispettiamo la tua privacy e ci impegniamo a proteggere i tuoi dati personali. Questa informativa ti spiegherà come trattiamo i tuoi dati personali quando visiti il nostro sito web.</p>
                
                <h3 class="font-bold text-lg mb-2">Quali dati raccogliamo</h3>
                <ul class="list-disc list-inside mb-4 space-y-2">
                    <li><strong>Dati di Identità e Contatto:</strong> Quando ti registri, raccogliamo il tuo indirizzo email.</li>
                    <li><strong>Dati di Utilizzo:</strong> Raccogliamo le immagini che carichi, i prompt testuali che inserisci e le immagini generate dal nostro servizio.</li>
                    <li><strong>Dati Tecnici:</strong> Informazioni standard raccolte dai browser web, come tipo di browser, lingua preferita e indirizzo IP.</li>
                    <li><strong>Dati Finanziari:</strong> Quando effettui un acquisto, i tuoi dati di pagamento sono elaborati direttamente da PayPal. Noi non memorizziamo i dettagli della tua carta di credito.</li>
                </ul>

                <h3 class="font-bold text-lg mb-2">Come usiamo i tuoi dati</h3>
                <p class="mb-4">Utilizziamo i tuoi dati per:</p>
                <ul class="list-disc list-inside mb-4 space-y-2">
                    <li>Fornirti, gestire e migliorare il nostro servizio.</li>
                    <li>Autenticare il tuo account e gestire i tuoi crediti.</li>
                    <li>Elaborare i tuoi pagamenti.</li>
                    <li>Comunicare con te per questioni relative al servizio.</li>
                </ul>

                <h3 class="font-bold text-lg mb-2">Condivisione dei dati</h3>
                <p class="mb-4">Condividiamo i tuoi dati solo con i seguenti fornitori di servizi terzi, necessari per il funzionamento dell'applicazione:</p>
                <ul class="list-disc list-inside mb-4 space-y-2">
                    <li><strong>Google (Gemini API):</strong> Le immagini e i prompt che fornisci vengono inviati all'API di Gemini per generare il rendering.</li>
                    <li><strong>PayPal:</strong> Per elaborare i pagamenti.</li>
                </ul>

                <h3 class="font-bold text-lg mb-2">I tuoi diritti</h3>
                <p class="mb-4">In base al GDPR, hai il diritto di accedere, rettificare o cancellare i tuoi dati personali. Contattaci per esercitare questi diritti.</p>
            `,
        },
        terms: {
            title: 'Termini di Servizio',
            body: `
                <h3 class="font-bold text-lg mb-2">1. Accettazione dei Termini</h3>
                <p class="mb-4">Utilizzando il servizio FitOnMe (il "Servizio"), accetti di essere vincolato da questi Termini di Servizio (i "Termini"). Se non sei d'accordo con questi Termini, non puoi utilizzare il Servizio.</p>
                
                <h3 class="font-bold text-lg mb-2">2. Descrizione del Servizio</h3>
                <p class="mb-4">FitOnMe è un servizio che utilizza l'intelligenza artificiale per trasformare immagini fornite dall'utente in rendering fotorealistici. Il servizio funziona su un sistema a crediti.</p>

                <h3 class="font-bold text-lg mb-2">3. Uso del Servizio</h3>
                <p class="mb-4">Ti impegni a non utilizzare il Servizio per:</p>
                <ul class="list-disc list-inside mb-4 space-y-2">
                    <li>Caricare o generare materiale illegale, dannoso, pornografico o che violi i diritti di terzi.</li>
                    <li>Tentare di aggirare i sistemi di pagamento o di gestione dei crediti.</li>
                    <li>Svolgere attività di reverse engineering sul Servizio.</li>
                </ul>

                <h3 class="font-bold text-lg mb-2">4. Proprietà Intellettuale</h3>
                <p class="mb-4">Tu mantieni tutti i diritti sulla tua immagine di partenza. Acquistando i nostri servizi, ti concediamo la piena proprietà e i diritti commerciali sull'immagine finale generata per te. Puoi usarla per qualsiasi scopo personale o commerciale.</p>

                <h3 class="font-bold text-lg mb-2">5. Pagamenti e Rimborsi</h3>
                <p class="mb-4">I crediti vengono acquistati in pacchetti una tantum. A causa della natura digitale e dei costi computazionali del servizio, una volta che i crediti sono stati acquistati e aggiunti al tuo account, non sono rimborsabili. Acquistando, accetti di perdere il tuo diritto di recesso di 14 giorni come previsto dalle normative europee per i contenuti digitali forniti immediatamente.</p>

                <h3 class="font-bold text-lg mb-2">6. Responsabilità per i Contenuti Caricati</h3>
                <p class="mb-4">L'utente è l'unico responsabile delle immagini e dei contenuti che carica sul Servizio ("Contenuti dell'Utente"). Utilizzando il Servizio, dichiari e garantisci di possedere tutti i diritti, le licenze, i consensi e le autorizzazioni necessarie per utilizzare e autorizzarci a utilizzare i tuoi Contenuti dell'Utente. Questo include, ma non si limita a, ottenere il permesso esplicito da parte di qualsiasi persona riconoscibile nelle immagini caricate per l'uso della loro immagine in questo contesto. FitOnMe agisce come un fornitore di servizi di elaborazione di immagini e non si assume alcuna responsabilità per i Contenuti dell'Utente o per il loro utilizzo da parte tua. Sarà tua esclusiva cura ottenere tutte le autorizzazioni necessarie per l'uso e la diffusione dei risultati generati.</p>
            `,
        },
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
            >
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">{content[type].title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-800 transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div
                    className="prose prose-slate p-6 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: content[type].body }}
                />
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

export default LegalModal;