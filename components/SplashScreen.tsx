import React from 'react';

const SplashScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-background flex items-center justify-center z-50 animate-fade-in">
            <div className="animate-pulse">
                <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-text-main">
                    FitOn<span className="text-primary">Me</span>
                </h1>
            </div>
        </div>
    );
};

export default SplashScreen;