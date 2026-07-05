
import React from 'react';
import type { UIMappings } from '../types';

interface HeaderProps {
    T: UIMappings;
}

export const Header: React.FC<HeaderProps> = ({ T }) => (
    <header className="flex items-center gap-3 p-4 border-b border-gray-200">
        <div className="w-9 h-9 bg-green-700 rounded-md flex-shrink-0">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 11c1.333-2 4-2 6 0s4 2 6 0" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
        <div>
            <h1 className="text-xl font-bold text-green-900">{T.title}</h1>
            <small className="text-gray-600 text-sm">{T.subtitle}</small>
        </div>
    </header>
);
