import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Brain, Github, Menu, X } from "lucide-react";

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform">
              <Brain size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">AlgoX</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://github.com/ThaminduNethmina/fyp-frontend" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Github size={20} />
            </a>
            <Link to="/analyze">
              <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm">
                Try Prototype
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-3 shadow-lg absolute w-full left-0">
            <Link to="/analyze" className="block w-full">
              <Button className="w-full bg-slate-900">Try Prototype</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* --- MAIN CONTENT (FIXED: Added w-full) --- */}
      <main className="flex-grow flex flex-col w-full">
        {children}
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-200 py-8 bg-white text-center mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2026 AlgoX Research.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-slate-900">Research Paper</span>
            <span className="cursor-pointer hover:text-slate-900">Documentation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;