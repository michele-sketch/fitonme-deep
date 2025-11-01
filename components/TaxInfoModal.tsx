import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserProfileData } from '../types';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TaxInfoModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const { user, updateUserProfile } = useAuth();
    
    const [formData, setFormData] = useState<UserProfileData>({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            // Reset and pre-fill form on open
            setError('');
            setLoading(false);
            setFormData({
                type: user.type || 'private',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                address: user.address || '',
                phone: user.phone || '',
                vatNumber: user.vatNumber || '',
                sdiCode: user.sdiCode || '',
                taxCode: user.taxCode || '',
            });
        }
    }, [isOpen, user]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, type: e.target.value as 'private' | 'professional' });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.firstName || !formData.lastName || !formData.email) {
            setError('Nome, Cognome ed Email sono campi obbligatori.');
            return;
        }

        if (formData.type === 'professional' && (!formData.vatNumber || !formData.sdiCode)) {
            setError('Partita IVA e Codice SDI sono obbligatori per i professionisti.');
            return;
        }

        setLoading(true);
        try {
            await updateUserProfile(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Si è verificato un errore durante il salvataggio.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;
    
    const taxType = formData.type || 'private';

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Il Mio Profilo</h2>
                <p className="text-slate-500 mb-6">Aggiorna i tuoi dati personali e di fatturazione.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">Nome <span className="text-red-500">*</span></label>
                            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">Cognome <span className="text-red-500">*</span></label>
                            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email <span className="text-red-500">*</span></label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-slate-700">Indirizzo (opzionale)</label>
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Telefono (opzionale)</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>

                    <hr className="my-4" />

                    <fieldset>
                        <legend className="text-sm font-medium text-slate-700 mb-2">Tipo di account</legend>
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input id="private" name="taxType" type="radio" value="private" checked={taxType === 'private'} onChange={handleRadioChange} className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"/>
                                <label htmlFor="private" className="ml-3 block text-sm font-medium text-slate-700">Privato</label>
                            </div>
                            <div className="flex items-center">
                                <input id="professional" name="taxType" type="radio" value="professional" checked={taxType === 'professional'} onChange={handleRadioChange} className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"/>
                                <label htmlFor="professional" className="ml-3 block text-sm font-medium text-slate-700">Professionista / Azienda</label>
                            </div>
                        </div>
                    </fieldset>
                    
                    {taxType === 'professional' ? (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="vatNumber" className="block text-sm font-medium text-slate-700">Partita IVA <span className="text-red-500">*</span></label>
                                <input type="text" id="vatNumber" name="vatNumber" value={formData.vatNumber} onChange={handleChange} required={taxType === 'professional'} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                            </div>
                            <div>
                                <label htmlFor="sdiCode" className="block text-sm font-medium text-slate-700">Codice SDI / PEC <span className="text-red-500">*</span></label>
                                <input type="text" id="sdiCode" name="sdiCode" value={formData.sdiCode} onChange={handleChange} required={taxType === 'professional'} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="taxCode" className="block text-sm font-medium text-slate-700">Codice Fiscale (opzionale)</label>
                            <input type="text" id="taxCode" name="taxCode" value={formData.taxCode} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                    )}
                    
                    {error && <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md">{error}</p>}

                    <div className="flex justify-end gap-4 pt-4">
                         <button type="button" onClick={onClose} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-5 rounded-lg transition-colors">
                            Annulla
                        </button>
                        <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-5 rounded-lg transition-colors disabled:bg-slate-300">
                            {loading ? 'Salvataggio...' : 'Salva Profilo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaxInfoModal;