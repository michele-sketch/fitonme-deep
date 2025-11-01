import { Plan } from './types';

export const STATUS_MESSAGES: string[] = [
    "Analizzando la postura...",
    "Adattando il tessuto alla silhouette...",
    "Simulando il comportamento della stoffa...",
    "Calcolando luci e ombre...",
    "Applicando la texture del materiale...",
    "Regolando il fit del capo...",
    "Composizione finale dell'immagine...",
    "Quasi pronto, gli ultimi ritocchi...",
];

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9,
    credits: 20,
    features: ['20 prove virtuali', 'Ideale per iniziare'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 39,
    credits: 100,
    features: ['100 prove virtuali', 'Supporto standard', 'Il più scelto'],
    mostPopular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 69,
    credits: 200,
    features: ['200 prove virtuali', 'Supporto prioritario', 'Perfetto per professionisti'],
  },
];

export const DISCLAIMER_TEXT = "L'AI potrebbe interpretare i capi in modo creativo. Verifica sempre il risultato.";
export const PRIVACY_POLICY_TEXT = "Accetto la Privacy Policy e i Termini di Servizio.";
export const SALES_TERMS_TEXT = "Termini di vendita: Nessun rimborso. I prezzi sono fissi e possono essere soggetti a modifiche per futuri acquisti.";
export const COOKIE_CONSENT_TEXT = "Utilizziamo i cookie per migliorare la tua esperienza. Accettando, acconsenti al nostro utilizzo dei cookie.";


export const TESTIMONIALS = [
    {
        quote: "FitOnMe ha rivoluzionato il nostro modo di vendere online. I clienti provano i vestiti da casa e acquistano con più sicurezza. Le conversioni sono aumentate del 30%!",
        author: "Laura Bianchi",
        title: "E-commerce Manager, Boutique Moda",
        avatar: "https://api.dicebear.com/8.x/lorelei/svg?seed=Laura"
    },
    {
        quote: "Finalmente posso mostrare alle mie clienti come un abito si adatterà a loro prima ancora che entrino in negozio. È uno strumento di marketing e consulenza potentissimo.",
        author: "Marco Russo",
        title: "Personal Shopper & Stylist",
        avatar: "https://api.dicebear.com/8.x/micah/svg?seed=Marco"
    },
    {
        quote: "Implementare la prova virtuale è stato un punto di svolta. I resi sono diminuiti e la soddisfazione del cliente è al massimo. Non potrei più farne a meno.",
        author: "Sofia Conti",
        title: "Titolare, Atelier Sposa",
        avatar: "https://api.dicebear.com/8.x/adventurer/svg?seed=Sofia"
    }
];