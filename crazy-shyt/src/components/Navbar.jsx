"use client"
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              UltimateBroker.AI
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
          <Link href="/voice-rec" className="text-gray-700 hover:text-indigo-600 transition">
              Real-Time Translator
            </Link>
            <Link href="/#features" className="text-gray-700 hover:text-indigo-600 transition">
              Features
            </Link>
            <Link href="/#demo" className="text-gray-700 hover:text-indigo-600 transition">
              Demo
            </Link>
            <Link href="/#team" className="text-gray-700 hover:text-indigo-600 transition">
              Team
            </Link>
            <Link href="/#contact" className="text-gray-700 hover:text-indigo-600 transition">
              Contact
            </Link>
            <a 
              href="https://github.com/Harkirattt/hackathon-cc-final" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              GitHub
            </a>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-2">
            <Link 
              href="/#features" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/#demo" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Demo
            </Link>
            <Link 
              href="/#team" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Team
            </Link>
            <Link 
              href="/#contact" 
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <a 
              href="https://github.com/yourusername/project" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block px-3 py-2 text-indigo-600 font-medium hover:bg-indigo-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}