
import React, { useState, useRef, useCallback } from 'react';
import { Download, RefreshCw, Wand2, Palette, Type, Settings2, Layout } from 'lucide-react';
import { DEFAULT_LOGO_CONFIG, FONT_OPTIONS } from './constants';
import { LogoConfig, DownloadFormat } from './types';
import { LogoRenderer } from './components/LogoRenderer';
import { generateLogoModification } from './services/geminiService';

export default function App() {
  const [config, setConfig] = useState<LogoConfig>(DEFAULT_LOGO_CONFIG);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDownload = useCallback((format: DownloadFormat) => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    if (format === DownloadFormat.SVG) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${config.textMain}_${config.textSecondary}_logo.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === DownloadFormat.PNG) {
      const canvas = document.createElement('canvas');
      // High resolution for PNG
      const scale = 4;
      const svgRect = svgElement.getBoundingClientRect();
      canvas.width = svgRect.width * scale;
      canvas.height = svgRect.height * scale;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = config.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${config.textMain}_${config.textSecondary}_logo.png`;
        link.href = pngUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      
      // Handle special characters in SVG data URI
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  }, [config]);

  const handleAIGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const newConfig = await generateLogoModification(config, prompt);
      setConfig(newConfig);
    } catch (err) {
      console.error(err);
      setError("Could not generate logo. Please check your API key or try a different prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setConfig(DEFAULT_LOGO_CONFIG);
    setPrompt('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center font-bold italic text-white">D</div>
            <h1 className="text-xl font-bold tracking-wide text-white">LogoForge <span className="text-red-500 font-normal text-sm ml-2">AI Edition</span></h1>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
             <span>Dimo V Construction Replicator</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Preview Section */}
        <section className="lg:col-span-8 space-y-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            
            <div className="relative z-10 w-full max-w-2xl aspect-[2/1] shadow-2xl rounded-lg overflow-hidden border border-gray-700">
               <LogoRenderer 
                 ref={svgRef} 
                 config={config} 
                 className="w-full h-full"
               />
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => handleDownload(DownloadFormat.PNG)}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-red-600/20 active:scale-95"
              >
                <Download size={20} />
                <span>Download PNG</span>
              </button>
              <button 
                onClick={() => handleDownload(DownloadFormat.SVG)}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 border border-gray-600"
              >
                <Download size={20} />
                <span>Download SVG</span>
              </button>
            </div>
          </div>
          
           <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4 text-blue-200 text-sm flex items-start space-x-3">
              <span className="text-xl">💡</span>
              <p>
                Customize fonts and spacing below or use AI to experiment with new styles.
              </p>
           </div>
        </section>

        {/* Controls Section */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* AI Controller */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-2 mb-4 text-purple-400">
              <Wand2 size={20} />
              <h2 className="font-bold text-lg uppercase tracking-wider">AI Modifier</h2>
            </div>
            <div className="space-y-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 'Change font to Times New Roman and increase gap between Dimo and V'..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none h-24 text-sm"
              />
              <button
                onClick={handleAIGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                  isGenerating 
                    ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-600/20 active:scale-95'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    <span>Generate Variations</span>
                  </>
                )}
              </button>
              {error && (
                <p className="text-red-400 text-xs mt-2">{error}</p>
              )}
            </div>
          </div>

          {/* Manual Controls */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <div className="flex items-center space-x-2">
                <Settings2 size={20} />
                <h2 className="font-bold text-lg uppercase tracking-wider">Manual Edit</h2>
              </div>
              <button onClick={handleReset} className="text-xs hover:text-white underline">Reset Default</button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
                <Type size={14} />
                <span>Content</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">Main Name</label>
                    <input 
                      type="text" 
                      value={config.textMain}
                      onChange={(e) => setConfig({...config, textMain: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    />
                 </div>
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">Symbol</label>
                    <input 
                      type="text" 
                      value={config.textSecondary}
                      onChange={(e) => setConfig({...config, textSecondary: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    />
                 </div>
              </div>
              <div>
                  <label className="block text-xs text-gray-500 mb-1">Tagline</label>
                  <input 
                    type="text" 
                    value={config.textTagline}
                    onChange={(e) => setConfig({...config, textTagline: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  />
               </div>
            </div>

            <div className="border-t border-gray-700 pt-4"></div>

            {/* Typography & Spacing */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
                <Layout size={14} />
                <span>Typography & Layout</span>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Font Family</label>
                <select 
                  value={config.fontFamily}
                  onChange={(e) => setConfig({...config, fontFamily: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Main Letter Spacing</label>
                <input 
                  type="range" 
                  min="-0.1" 
                  max="0.5" 
                  step="0.01"
                  value={config.letterSpacingMain}
                  onChange={(e) => setConfig({...config, letterSpacingMain: parseFloat(e.target.value)})}
                  className="w-full accent-red-500"
                />
              </div>

               <div>
                <label className="block text-xs text-gray-500 mb-1">Gap Size (Dimo - V)</label>
                <input 
                  type="range" 
                  min="-50" 
                  max="100" 
                  step="1"
                  value={config.gapSize}
                  onChange={(e) => setConfig({...config, gapSize: parseFloat(e.target.value)})}
                  className="w-full accent-red-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Tagline Spacing</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={config.letterSpacingTagline}
                  onChange={(e) => setConfig({...config, letterSpacingTagline: parseFloat(e.target.value)})}
                  className="w-full accent-red-500"
                />
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4"></div>

            {/* Colors */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
                <Palette size={14} />
                <span>Colors</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">First Letter</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={config.colorMain}
                      onChange={(e) => setConfig({...config, colorMain: e.target.value})}
                      className="h-8 w-8 bg-transparent cursor-pointer border-none"
                    />
                    <span className="text-xs font-mono text-gray-400">{config.colorMain}</span>
                  </div>
                </div>
                 <div>
                  <label className="block text-xs text-gray-500 mb-1">Rest of Name</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={config.colorMainRest}
                      onChange={(e) => setConfig({...config, colorMainRest: e.target.value})}
                      className="h-8 w-8 bg-transparent cursor-pointer border-none"
                    />
                    <span className="text-xs font-mono text-gray-400">{config.colorMainRest}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Secondary (V)</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={config.colorSecondary}
                      onChange={(e) => setConfig({...config, colorSecondary: e.target.value})}
                      className="h-8 w-8 bg-transparent cursor-pointer border-none"
                    />
                    <span className="text-xs font-mono text-gray-400">{config.colorSecondary}</span>
                  </div>
                </div>
                 <div>
                  <label className="block text-xs text-gray-500 mb-1">Tagline</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={config.colorTagline}
                      onChange={(e) => setConfig({...config, colorTagline: e.target.value})}
                      className="h-8 w-8 bg-transparent cursor-pointer border-none"
                    />
                    <span className="text-xs font-mono text-gray-400">{config.colorTagline}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Background</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={config.bgColor}
                      onChange={(e) => setConfig({...config, bgColor: e.target.value})}
                      className="h-8 w-8 bg-transparent cursor-pointer border-none"
                    />
                    <span className="text-xs font-mono text-gray-400">{config.bgColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
