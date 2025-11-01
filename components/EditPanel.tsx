import React from 'react';

interface EditPanelProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    onEdit: () => void;
    isEditing: boolean;
    disabled: boolean;
}

const EditPanel: React.FC<EditPanelProps> = ({ prompt, onPromptChange, onEdit, isEditing, disabled }) => {
    return (
        <div className="mt-8 p-6 bg-primary-light/50 rounded-2xl border border-primary/20 animate-fade-in">
            <h4 className="font-display text-lg font-semibold text-text-main mb-2">Modifica il Risultato con l'AI</h4>
            <p className="text-sm text-text-muted mb-4">
                Aggiungi un accessorio, cambia un colore o fai altre modifiche. Ogni modifica costa 1 credito.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    placeholder="Es: aggiungi un cappello di paglia"
                    className="flex-grow px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    disabled={isEditing}
                />
                <button
                    onClick={onEdit}
                    disabled={isEditing || disabled || !prompt.trim()}
                    className="bg-primary text-white font-bold py-3 px-5 rounded-lg hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                    {isEditing ? 'Modifico...' : 'Applica (1 credito)'}
                </button>
            </div>
        </div>
    );
};

export default EditPanel;