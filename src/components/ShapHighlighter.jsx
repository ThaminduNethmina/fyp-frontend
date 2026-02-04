import React from 'react';
import { motion } from 'framer-motion';

const ShapHighlighter = ({ tokens }) => {
  return (
    <div className="bg-slate-950 p-6 rounded-lg font-mono text-sm leading-relaxed overflow-x-auto text-slate-300 border border-slate-800 shadow-inner whitespace-pre-wrap">
      {tokens.map((item, index) => {
        const score = item.score;
        let style = {};
        
        if (score > 0) {
          const alpha = Math.min(score * 50, 0.9); 
          style = { backgroundColor: `rgba(220, 38, 38, ${alpha})`, color: 'white' };
        } else if (score < 0) {
          const alpha = Math.min(Math.abs(score) * 50, 0.5);
          style = { backgroundColor: `rgba(37, 99, 235, ${alpha})`, color: 'white' };
        }

        // Clean up CodeBERT special characters
        // 'Ġ' is a space, 'Ċ' is a newline
        let tokenText = item.token.replace(/Ġ/g, ' ').replace(/Ċ/g, '\n');

        return (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.001 }} // Faster animation for long code
            className="inline rounded px-0 py-0.5 transition-colors duration-200 cursor-help relative group"
            style={style}
          >
            {tokenText}
            
            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-slate-700">
              Impact: {score.toFixed(4)}
            </span>
          </motion.span>
        );
      })}
    </div>
  );
};

export default ShapHighlighter;