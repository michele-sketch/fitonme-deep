import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { PLANS } from '../constants';

interface PricingSectionProps {
    onChoosePlan: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onChoosePlan }) => {
    const { user } = useAuth();

    return (
        <section className="py-12 bg-white rounded-2xl shadow-soft-lg mt-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="font-display text-3xl font-bold text-text-main">Piani Chiari e Flessibili</h2>
                    <p className="text-text-muted mt-2">Scegli il pacchetto di crediti perfetto per le tue esigenze e inizia subito.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {PLANS.map((plan) => (
                        <div key={plan.id} className={`relative border rounded-xl p-6 flex flex-col ${plan.mostPopular ? 'border-primary shadow-soft ring-2 ring-primary' : 'border-gray-200'}`}>
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
                            <button
                                onClick={onChoosePlan}
                                disabled={user?.plan === plan.id}
                                className={`w-full font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed ${plan.mostPopular ? 'bg-primary hover:bg-primary-hover text-white' : 'bg-secondary hover:bg-secondary-hover text-text-main'}`}
                            >
                                {user?.plan === plan.id ? 'Piano Attuale' : 'Scegli Piano'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;