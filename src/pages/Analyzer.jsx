import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { Card, CardHeader, CardContent } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Zap, Code2, AlertCircle, ChevronDown, ChevronUp, FileCode, CheckCircle2, Ban } from "lucide-react";
import ShapHighlighter from '../components/ShapHighlighter';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from "@monaco-editor/react";

// --- CONSTANTS ---
const PLACEHOLDERS = {
  java: "// Enter your Java code here...",
  python: "# Enter your Python code here..."
};

// --- UTILITY: STRIP COMMENTS ---
const stripComments = (code, lang) => {
  if (!code) return "";
  
  if (lang === 'java') {
    // Remove // comments and /* */ comments
    return code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
  } else if (lang === 'python') {
    // Remove # comments and '''/""" docstrings
    return code.replace(/#.*$/gm, '').replace(/('''[\s\S]*?'''|"""[\s\S]*?""")/g, '').trim();
  }
  return code;
};

// --- STRICT VALIDATOR ---
const validateInput = (code, selectedLang) => {
  // Ignore empty or placeholder code
  if (!code || code.trim().length < 10 || Object.values(PLACEHOLDERS).includes(code.trim())) return null;

  const pythonScore = [
    /def\s+/, /import\s+/, /print\(/, /if\s+__name__/, /:\s*$/, /#\s+/, /elif\s+/, /class\s+.*:/
  ].reduce((c, r) => c + (r.test(code) ? 1 : 0), 0);

  const javaScore = [
    /public\s+class/, /System\.out/, /public\s+static/, /;\s*$/, /{\s*$/, /}\s*$/, /String\s+args/, /@Override/, /int\s+\[\]/
  ].reduce((c, r) => c + (r.test(code) ? 1 : 0), 0);

  const looksLikePython = pythonScore > javaScore;
  const looksLikeJava = javaScore > pythonScore;
  const isGibberish = pythonScore === 0 && javaScore === 0;

  if (isGibberish && code.length > 50) {
    return "Syntax Error: Input does not look like valid code.";
  }

  if (selectedLang === 'java' && looksLikePython) {
    return "Language Mismatch: You selected Java but pasted Python code.";
  }

  if (selectedLang === 'python' && looksLikeJava) {
    return "Language Mismatch: You selected Python but pasted Java code.";
  }

  return null;
};

const Analyzer = () => {
  const [code, setCode] = useState(PLACEHOLDERS.java);
  const [language, setLanguage] = useState('java');
  const [validationError, setValidationError] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const resultsRef = useRef(null); // Reference for auto-scroll

  // --- AUTO-SCROLL EFFECT ---
  useEffect(() => {
    if (result && resultsRef.current) {
      // Small timeout to ensure DOM renders before scrolling
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (!code || code.trim() === PLACEHOLDERS.java || code.trim() === PLACEHOLDERS.python) {
      setCode(PLACEHOLDERS[newLang]);
    }
  };

  useEffect(() => {
    const error = validateInput(code, language);
    setValidationError(error);

    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (error) {
        monacoRef.current.editor.setModelMarkers(model, "owner", [
          {
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: model.getLineCount(),
            endColumn: model.getLineMaxColumn(model.getLineCount()),
            message: error,
            severity: monacoRef.current.MarkerSeverity.Error,
          },
        ]);
      } else {
        monacoRef.current.editor.setModelMarkers(model, "owner", []);
      }
    }
  }, [code, language]);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const handleAnalyze = async () => {
    if (validationError) return;

    // 1. Strip comments before sending
    const cleanCode = stripComments(code, language);

    if (cleanCode.length < 5) {
      setValidationError("Code is too short after removing comments.");
      return;
    }

    setLoading(true);
    setResult(null);
    setShowExplanation(false);

    try {
      const response = await fetch('https://himansha2001-algox-backend.hf.space/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, language: language }) // Send clean code
      });
      
      if (!response.ok) throw new Error("Failed to connect to analysis engine.");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setValidationError("Analysis Service Unavailable. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const isCodeEmpty = !code || code.trim().length < 5 || Object.values(PLACEHOLDERS).includes(code.trim());

  return (
    <Layout>
      <div className="w-full flex-grow flex flex-col items-center py-12 bg-slate-50/50">
        <div className="container max-w-5xl mx-auto px-4 w-full">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold mb-3 text-slate-900 tracking-tight">
              Algorithm Complexity Analyzer
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Paste your function below. The system will strictly validate syntax before analysis.
            </p>
          </div>

          <Card className={`border-2 shadow-lg mb-8 overflow-hidden bg-white transition-colors duration-300 ${validationError ? 'border-red-300' : 'border-slate-200'}`}>
            <div className="bg-slate-50 border-b border-slate-100 py-3 px-6 flex justify-between items-center">
              
              <div className="flex items-center gap-3">
                <Select 
                  value={language} 
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="w-[140px] h-9 bg-white border-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                  </SelectContent>
                </Select>
                
                {validationError && (
                   <span className="text-xs font-bold text-red-600 flex items-center gap-1 animate-pulse">
                     <Ban size={12} /> {validationError}
                   </span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCode(PLACEHOLDERS[language])} className="text-slate-400 hover:text-red-500">
                Reset
              </Button>
            </div>
            
            <div className="h-[400px] w-full border-b border-slate-100 relative">
              <Editor
                height="100%"
                language={language}
                theme="light"
                value={code}
                onMount={handleEditorMount}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>

            <div className="bg-slate-50 p-4 flex justify-between items-center">
               <div className="text-xs text-slate-400 hidden sm:block">
                 {validationError ? <span className="text-red-500 font-bold">Fix errors to proceed</span> : "Ready to analyze"}
               </div>
               
               <Button 
                  onClick={handleAnalyze} 
                  disabled={!!validationError || loading || isCodeEmpty} 
                  size="lg"
                  className={`min-w-[160px] shadow-sm transition-all ${
                    !!validationError || isCodeEmpty
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed hover:bg-slate-300" 
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                  {loading ? "Analyzing..." : "Analyze Complexity"}
                </Button>
            </div>
          </Card>

          {/* Results Section - Attached Ref here for scrolling */}
          {result && (
            <motion.div 
              ref={resultsRef} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid gap-6 md:grid-cols-3 scroll-mt-24" // scroll-mt ensures header doesn't cover it
            >
              <Card className="md:col-span-3 border-blue-200 bg-blue-50/40 shadow-md">
                <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="p-3 bg-white rounded-full shadow-sm text-blue-600">
                      <FileCode size={24} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Language</div>
                      <div className="font-bold text-slate-900 capitalize text-lg">{language}</div>
                    </div>
                  </div>
                  
                  <div className="hidden md:block w-px h-12 bg-blue-200/50"></div>

                  <div className="text-center w-full md:w-auto">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Complexity</div>
                    <div className="text-4xl font-black text-blue-700 tracking-tight">{result.complexity}</div>
                  </div>

                  <div className="hidden md:block w-px h-12 bg-blue-200/50"></div>

                  <div className="text-center w-full md:w-auto">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Confidence</div>
                    <Badge variant="secondary" className="text-lg px-4 py-1 bg-white border border-blue-100 text-slate-700 shadow-sm">
                      {(result.confidence * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="md:col-span-1 border-slate-200 h-fit bg-white">
                <CardHeader className="pb-2 pt-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Detected Patterns</h3>
                </CardHeader>
                <div className="px-6 pb-6 space-y-3">
                  <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-medium text-slate-700">Recursion</span>
                    {result.static_features.recursion ? (
                      <Badge className="bg-blue-600 hover:bg-blue-700"><CheckCircle2 size={12} className="mr-1"/> Yes</Badge>
                    ) : (
                      <span className="text-sm text-slate-400">None</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-medium text-slate-700">Log Logic</span>
                    {result.static_features.log_hint ? (
                      <Badge className="bg-amber-500 hover:bg-amber-600"><CheckCircle2 size={12} className="mr-1"/> Yes</Badge>
                    ) : (
                      <span className="text-sm text-slate-400">None</span>
                    )}
                  </div>
                </div>
              </Card>

              <div className="md:col-span-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full mb-4 justify-between bg-white border-slate-300 hover:bg-slate-50 text-slate-700 h-12"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <Code2 size={18} className="text-blue-600"/> 
                    {showExplanation ? "Hide Logic Explanation" : "View Logic Explanation"}
                  </span>
                  {showExplanation ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </Button>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <Card className="border-slate-200 shadow-sm bg-white">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 text-sm text-slate-600">
                          Tokens highlighted in <span className="text-red-600 font-bold bg-red-50 px-1 rounded border border-red-100">Red</span> strongly influenced the model to predict <b>{result.complexity}</b>.
                        </div>
                        <div className="p-0">
                          <ShapHighlighter tokens={result.shap_explanation} />
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Analyzer;