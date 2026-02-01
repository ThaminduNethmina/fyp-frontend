import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Network, Zap, FileJson } from "lucide-react";
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <Layout>
      {/* 1. HERO SECTION: Clean, Centered, Academic */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wider uppercase"
          >
            Neuro-Symbolic AI Research
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Code Complexity <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Decoded & Explained.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed">
            AlgoX overcomes the limitations of LLMs by combining <strong>CodeBERT</strong> embeddings with <strong>Static Analysis</strong> to accurately predict and explain Big-O complexity.
          </p>

          {/* CTA Buttons - flex column in mobile but inline in larger screens */}
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/analyze">
              <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                Run Analysis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/">
            <Button variant="outline" size="lg" className="h-12 px-8 rounded-full border-slate-300 text-slate-700 hover:bg-slate-50">
              Read the Abstract
            </Button>
            </Link>        
          </div>
        </div>

        {/* Background Subtle Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />
      </section>

      {/* 2. TECHNICAL PILLARS: Minimal Grid */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10">
            
            <Feature 
              icon={<Network className="text-violet-500" />}
              title="Hybrid Architecture"
              desc="Merges deep learning semantics with strict AST-based structural analysis for higher precision."
            />
            
            <Feature 
              icon={<FileJson className="text-amber-500" />}
              title="SHAP Explainability"
              desc="Black-box no more. See the exact tokens driving the prediction with interpretability scores."
            />
            
            <Feature 
              icon={<Code2 className="text-blue-500" />}
              title="Multi-Language"
              desc="Intelligent pattern matching automatically detects and parses both Java and Python codebases."
            />

          </div>
        </div>
      </section>

      {/* 3. FINAL CALL: Simple Statement */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Built for accuracy, designed for developers.
          </h2>
          <Link to="/analyze" className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1">
            Test the model now <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="flex flex-col items-start p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
    <div className="mb-4 p-3 bg-white rounded-xl shadow-sm border border-slate-100">{icon}</div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default Landing;