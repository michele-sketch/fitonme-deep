import React from 'react';
import { TESTIMONIALS } from '../constants';

const TestimonialsSection: React.FC = () => {
    return (
        <section className="py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="font-display text-3xl font-bold text-text-main">Perché i professionisti scelgono FitOnMe</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-soft flex flex-col">
                            <div className="flex-shrink-0">
                                <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-200">
                                    <path d="M0 30V13.3158L10.3226 0H19.3548L13.5484 13.3158H19.3548V30H0Z" fill="currentColor"/>
                                    <path d="M20.6452 30V13.3158L30.9677 0H40L34.1935 13.3158H40V30H20.6452Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <blockquote className="mt-4 text-text-muted flex-grow">"{testimonial.quote}"</blockquote>
                            <footer className="mt-6 flex items-center">
                                <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full" />
                                <div className="ml-4">
                                    <p className="font-semibold text-text-main">{testimonial.author}</p>
                                    <p className="text-sm text-text-muted">{testimonial.title}</p>
                                </div>
                            </footer>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;