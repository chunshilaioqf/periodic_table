import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Moon, Sun, X, Info, BookOpen } from 'lucide-react';
import { fullElements } from './data/elements';
import { PeriodicElement, Language } from './types';
import { cn } from './lib/utils';

import { BohrModel } from './components/BohrModel';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en', label: 'English' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
];

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedElement, setSelectedElement] = useState<PeriodicElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<PeriodicElement | null>(null);

  // Initialize language and theme
  useEffect(() => {
    const browserLang = navigator.language;
    if (browserLang.startsWith('zh-CN')) setLang('zh-CN');
    else if (browserLang.startsWith('zh-TW')) setLang('zh-TW');
    else if (browserLang.startsWith('ja')) setLang('ja');
    else if (browserLang.startsWith('ko')) setLang('ko');
    else setLang('en');

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const t = (key: string) => {
    const translations: Record<Language, Record<string, string>> = {
      'zh-CN': { title: '交互式元素周期表', story: '故事', description: '描述', weight: '原子量', category: '类别' },
      'en': { title: 'Interactive Periodic Table', story: 'Story', description: 'Description', weight: 'Atomic Weight', category: 'Category' },
      'zh-TW': { title: '交互式元素週期表', story: '故事', description: '描述', weight: '原子量', category: '類別' },
      'ja': { title: 'インタラクティブ周期表', story: '物語', description: '説明', weight: '原子量', category: 'カテゴリー' },
      'ko': { title: '대화형 주기율표', story: '이야기', description: '설명', weight: '원자량', category: '범주' },
    };
    return translations[lang][key] || key;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-500 bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold tracking-tighter text-[var(--text-primary)]"
        >
          {t('title')}
        </motion.h1>

        <div className="flex items-center gap-4 glass p-2 rounded-full">
          <div className="flex items-center gap-2 px-3 border-r border-[var(--border-color)]">
            <Globe className="w-4 h-4 text-[var(--text-secondary)]" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer text-[var(--text-primary)]"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code} className="bg-[var(--bg-primary)]">{l.label}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Periodic Table Grid */}
      <main className="relative overflow-x-auto pb-8">
        <div className="grid grid-cols-18 gap-1 md:gap-2 min-w-[1200px] mx-auto">
          {fullElements.map((el) => (
            <motion.div
              key={el.number}
              layoutId={`element-${el.number}`}
              onClick={() => setSelectedElement(el)}
              onMouseEnter={() => setHoveredElement(el)}
              onMouseLeave={() => setHoveredElement(null)}
              style={{
                gridColumn: el.group,
                gridRow: el.period
              }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              className={cn(
                "aspect-square p-1 md:p-2 rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden group",
                `cat-${el.category}`,
                "shadow-lg hover:shadow-xl",
                el.period > 7 && "mt-8" // Add spacing for Lanthanides/Actinides
              )}
            >
              <span className="text-[8px] md:text-[10px] absolute top-1 left-1 opacity-70 font-mono">{el.number}</span>
              <span className="text-lg md:text-2xl font-bold leading-none">{el.symbol}</span>
              <span className="text-[8px] md:text-[10px] opacity-90 truncate w-full text-center">
                {el.translations[lang].name}
              </span>
              
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
          
          {/* Spacer for Lanthanides/Actinides label */}
          <div style={{ gridColumn: 1, gridRow: 8 }} className="flex items-end pb-2 text-[10px] font-bold opacity-30 uppercase tracking-widest text-[var(--text-primary)]">
            Lanthanides
          </div>
          <div style={{ gridColumn: 1, gridRow: 9 }} className="flex items-end pb-2 text-[10px] font-bold opacity-30 uppercase tracking-widest text-[var(--text-primary)]">
            Actinides
          </div>
        </div>
      </main>

      {/* Element Detail Modal */}
      <AnimatePresence>
        {selectedElement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedElement(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              layoutId={`element-${selectedElement.number}`}
              className="relative w-full max-w-4xl glass rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedElement(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full z-10 text-[var(--text-primary)]"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left Side: Visuals */}
              <div className={cn(
                "w-full md:w-1/2 p-12 flex flex-col items-center justify-center text-white relative",
                `cat-${selectedElement.category}`
              )}>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <span className="text-4xl font-mono opacity-50 block mb-2">#{selectedElement.number}</span>
                  <h2 className="text-9xl font-black tracking-tighter mb-4">{selectedElement.symbol}</h2>
                  <p className="text-3xl font-bold mb-8">{selectedElement.translations[lang].name}</p>
                  <div className="flex gap-4 justify-center">
                    <div className="glass px-4 py-2 rounded-xl">
                      <p className="text-xs opacity-70 uppercase tracking-widest">{t('weight')}</p>
                      <p className="text-xl font-mono">{selectedElement.weight}</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Background Pattern */}
                <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
                  <span className="text-[20rem] font-black leading-none translate-y-1/4 translate-x-1/4">
                    {selectedElement.symbol}
                  </span>
                </div>
              </div>

              {/* Right Side: Content */}
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[70vh] md:max-h-none bg-[var(--bg-primary)]">
                <div className="space-y-8">
                  <section>
                    <div className="flex items-center gap-2 mb-4 text-[var(--text-secondary)]">
                      <Info className="w-5 h-5" />
                      <h3 className="text-sm font-bold uppercase tracking-widest">{t('description')}</h3>
                    </div>
                    <p className="text-lg leading-relaxed text-[var(--text-primary)]">
                      {selectedElement.translations[lang].description}
                    </p>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4 text-[var(--text-secondary)]">
                      <BookOpen className="w-5 h-5" />
                      <h3 className="text-sm font-bold uppercase tracking-widest">{t('story')}</h3>
                    </div>
                    <p className="text-lg leading-relaxed italic text-[var(--text-primary)]">
                      "{selectedElement.translations[lang].story}"
                    </p>
                  </section>

                  <section className="pt-4 flex justify-center">
                    <BohrModel 
                      atomicNumber={selectedElement.number} 
                      symbol={selectedElement.symbol} 
                    />
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <footer className="mt-12 flex flex-wrap gap-6 justify-center max-w-5xl mx-auto">
        {[
          { cat: 'alkali-metal', label: 'Alkali metals' },
          { cat: 'alkaline-earth-metal', label: 'Alkaline earth metals' },
          { cat: 'transition-metal', label: 'Transition metals' },
          { cat: 'post-transition-metal', label: 'Post-transition metals' },
          { cat: 'metalloid', label: 'Metalloids' },
          { cat: 'reactive-nonmetal', label: 'Reactive nonmetals' },
          { cat: 'noble-gas', label: 'Noble gases' },
          { cat: 'lanthanide', label: 'Lanthanides' },
          { cat: 'actinide', label: 'Actinides' },
          { cat: 'unknown', label: 'Unknown properties' },
        ].map(item => (
          <div key={item.cat} className="flex items-center gap-3">
            <div className={cn("w-4 h-4 rounded-full border-2 border-white/20 shadow-sm", `cat-${item.cat}`)} />
            <span className="text-sm font-medium text-[var(--text-secondary)]">{item.label}</span>
          </div>
        ))}
      </footer>
    </div>
  );
}
