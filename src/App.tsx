import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Globe, Moon, Sun, X, Info, BookOpen, Shuffle, Filter, Download, Share2, Settings, HelpCircle, ChevronUp, Brain, GitCompare } from 'lucide-react';
import { fullElements } from './data/elements';
import { PeriodicElement, Language } from './types';
import { cn, getElectronConfiguration } from './lib/utils';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'story' | 'model'>('info');
  const [accentColor, setAccentColor] = useState<string>('#3b82f6');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<{ element: PeriodicElement, options: string[] } | null>(null);
  const [compareElement, setCompareElement] = useState<PeriodicElement | null>(null);

  const categories = Array.from(new Set(fullElements.map(el => el.category)));

  const playSound = (freq: number) => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / totalHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor]);

  // Initialize language and theme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const browserLang = navigator.language;
    if (browserLang.startsWith('zh-CN')) setLang('zh-CN');
    else if (browserLang.startsWith('zh-TW')) setLang('zh-TW');
    else if (browserLang.startsWith('ja')) setLang('ja');
    else if (browserLang.startsWith('ko')) setLang('ko');
    else setLang('en');

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDark ? 'dark' : 'light');

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const t = (key: string) => {
    const translations: Record<Language, Record<string, string>> = {
      'zh-CN': { title: '交互式元素周期表', story: '故事', description: '描述', weight: '原子量', category: '类别', search: '搜索...', all: '全部', info: '信息', model: '模型' },
      'en': { title: 'Interactive Periodic Table', story: 'Story', description: 'Description', weight: 'Atomic Weight', category: 'Category', search: 'Search...', all: 'All', info: 'Info', model: 'Model' },
      'zh-TW': { title: '交互式元素週期表', story: '故事', description: '描述', weight: '原子量', category: '類別', search: '搜尋...', all: '全部', info: '信息', model: '模型' },
      'ja': { title: 'インタラクティブ周期表', story: '物語', description: '説明', weight: '原子量', category: 'カテゴリー', search: '検索...', all: 'すべて', info: '情報', model: 'モデル' },
      'ko': { title: '대화형 주기율표', story: '이야기', description: '설명', weight: '원자량', category: '범주', search: '검색...', all: '모두', info: '정보', model: '모델' },
    };
    return translations[lang][key] || key;
  };

  const filteredElements = fullElements.filter(el => {
    const matchesSearch = 
      el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.number.toString().includes(searchQuery) ||
      el.translations[lang].name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || el.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-500 bg-[var(--bg-primary)]">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
        <motion.div 
          className="h-full bg-[var(--accent-color)] shadow-[0_0_10px_var(--accent-color)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold tracking-tighter text-[var(--text-primary)]"
        >
          {t('title')}
        </motion.h1>

        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => {
              const randomEl = fullElements[Math.floor(Math.random() * fullElements.length)];
              setSelectedElement(randomEl);
            }}
            className="glass p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors group"
            title="Random Element"
          >
            <Shuffle className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
          </button>

          <div className="relative group">
            <input 
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass px-6 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
            />
          </div>

          <div className="relative group">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="glass px-6 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] appearance-none cursor-pointer text-sm text-[var(--text-secondary)] pr-10"
            >
              <option value="">{t('all')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace(/-/g, ' ')}
                </option>
              ))}
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
          </div>

          <button 
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullElements, null, 2));
              const downloadAnchorNode = document.createElement('a');
              downloadAnchorNode.setAttribute("href",     dataStr);
              downloadAnchorNode.setAttribute("download", "periodic_table_data.json");
              document.body.appendChild(downloadAnchorNode);
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            }}
            className="glass p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors group"
            title="Download JSON Data"
          >
            <Download className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
          </button>

          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
            className="glass p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors group"
            title="Share App"
          >
            <Share2 className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
          </button>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="glass p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors group"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
          </button>

          <button 
            onClick={() => setIsHelpOpen(true)}
            className="glass p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors group"
            title="Help"
          >
            <HelpCircle className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
          </button>

          <button 
            onClick={() => {
              const randomEl = fullElements[Math.floor(Math.random() * fullElements.length)];
              const options = [randomEl.symbol];
              while (options.length < 4) {
                const opt = fullElements[Math.floor(Math.random() * fullElements.length)].symbol;
                if (!options.includes(opt)) options.push(opt);
              }
              setCurrentQuestion({ element: randomEl, options: options.sort(() => Math.random() - 0.5) });
              setIsQuizOpen(true);
            }}
            className="glass p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors group"
            title="Quiz Mode"
          >
            <Brain className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
          </button>
        </div>
      </header>

      {/* Periodic Table Grid */}
      <main className="relative overflow-x-auto pb-8">
        <div className="grid grid-cols-18 gap-1 md:gap-2 min-w-[1200px] mx-auto relative">
          {/* Quick View Panel (in the empty space) */}
          <AnimatePresence>
            {hoveredElement && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute top-0 left-[16.66%] w-[55.55%] h-[33.33%] z-0 flex items-center justify-center p-8 pointer-events-none"
                style={{ gridColumn: '3 / span 10', gridRow: '1 / span 3' }}
              >
                <div className="flex items-center gap-12">
                  <div className={cn(
                    "w-32 h-32 rounded-2xl flex flex-col items-center justify-center shadow-2xl border-2 border-white/20",
                    `cat-${hoveredElement.category}`
                  )}>
                    <span className="text-sm font-mono opacity-70">#{hoveredElement.number}</span>
                    <span className="text-5xl font-black">{hoveredElement.symbol}</span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-[var(--text-primary)]">
                      {hoveredElement.translations[lang].name}
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] font-medium">
                      {hoveredElement.weight}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", `cat-${hoveredElement.category}`)} />
                      <span className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                        {hoveredElement.category.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {filteredElements.map((el) => (
            <motion.div
              key={el.number}
              layout
              layoutId={`element-${el.number}`}
              onClick={() => {
                setSelectedElement(el);
                playSound(880 + el.number * 2);
                if (el.symbol === 'Au') {
                  confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FFD700', '#DAA520', '#B8860B']
                  });
                }
              }}
              onMouseEnter={() => {
                setHoveredElement(el);
                playSound(440 + el.number * 2);
              }}
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
                  <div className="flex flex-wrap gap-4 justify-center">
                    <div className="glass px-4 py-2 rounded-xl">
                      <p className="text-xs opacity-70 uppercase tracking-widest">{t('weight')}</p>
                      <p className="text-xl font-mono">{selectedElement.weight}</p>
                    </div>
                    <div className="glass px-4 py-2 rounded-xl">
                      <p className="text-xs opacity-70 uppercase tracking-widest">Electrons</p>
                      <p className="text-xl font-mono">{getElectronConfiguration(selectedElement.number).join(', ')}</p>
                    </div>
                    <div className="glass px-4 py-2 rounded-xl">
                      <p className="text-xs opacity-70 uppercase tracking-widest">{t('category')}</p>
                      <p className="text-sm font-bold">{selectedElement.category.replace(/-/g, ' ')}</p>
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
              <div className="w-full md:w-1/2 flex flex-col bg-[var(--bg-primary)] h-[70vh] md:h-auto">
                {/* Tabs */}
                <div className="flex items-center justify-between border-b border-[var(--border-color)] px-8 pt-6">
                  <div className="flex">
                    {['info', 'story', 'model'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={cn(
                          "px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all border-b-2",
                          activeTab === tab 
                            ? "border-[var(--accent-color)] text-[var(--text-primary)]" 
                            : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        )}
                      >
                        {t(tab)}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setCompareElement(selectedElement);
                      setSelectedElement(null);
                      alert('Select another element to compare');
                    }}
                    className="flex items-center gap-2 px-4 py-2 glass hover:bg-[var(--bg-secondary)] rounded-xl text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] transition-all mb-2"
                  >
                    <GitCompare className="w-4 h-4" /> Compare
                  </button>
                </div>

                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {activeTab === 'info' && (
                      <motion.div
                        key="info"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <section>
                          <div className="flex items-center gap-2 mb-4 text-[var(--text-secondary)]">
                            <Info className="w-5 h-5" />
                            <h3 className="text-sm font-bold uppercase tracking-widest">{t('description')}</h3>
                          </div>
                          <p className="text-lg leading-relaxed text-[var(--text-primary)]">
                            {selectedElement.translations[lang].description}
                          </p>
                        </section>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="glass px-4 py-3 rounded-2xl">
                            <p className="text-[10px] opacity-70 uppercase tracking-widest mb-1">{t('weight')}</p>
                            <p className="text-lg font-mono font-bold text-[var(--text-primary)]">{selectedElement.weight}</p>
                          </div>
                          <div className="glass px-4 py-3 rounded-2xl">
                            <p className="text-[10px] opacity-70 uppercase tracking-widest mb-1">{t('category')}</p>
                            <p className="text-sm font-bold text-[var(--text-primary)] truncate">{selectedElement.category.replace(/-/g, ' ')}</p>
                          </div>
                          <div className="glass px-4 py-3 rounded-2xl col-span-2">
                            <p className="text-[10px] opacity-70 uppercase tracking-widest mb-1">Electron Config</p>
                            <p className="text-lg font-mono font-bold text-[var(--text-primary)]">
                              {getElectronConfiguration(selectedElement.number).join(', ')}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'story' && (
                      <motion.div
                        key="story"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-2 mb-4 text-[var(--text-secondary)]">
                          <BookOpen className="w-5 h-5" />
                          <h3 className="text-sm font-bold uppercase tracking-widest">{t('story')}</h3>
                        </div>
                        <p className="text-xl leading-relaxed italic text-[var(--text-primary)] font-serif">
                          "{selectedElement.translations[lang].story}"
                        </p>
                      </motion.div>
                    )}

                    {activeTab === 'model' && (
                      <motion.div
                        key="model"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex justify-center items-center h-full"
                      >
                        <BohrModel 
                          atomicNumber={selectedElement.number} 
                          symbol={selectedElement.symbol} 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <footer className="mt-12 flex flex-wrap gap-6 justify-center max-w-5xl mx-auto">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-full transition-all",
            !selectedCategory ? "glass ring-2 ring-[var(--accent-color)]" : "opacity-50 hover:opacity-100"
          )}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">{t('all')}</span>
        </button>
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
          <button 
            key={item.cat} 
            onClick={() => setSelectedCategory(selectedCategory === item.cat ? null : item.cat)}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-full transition-all",
              selectedCategory === item.cat ? "glass ring-2 ring-[var(--accent-color)]" : "opacity-50 hover:opacity-100"
            )}
          >
            <div className={cn("w-4 h-4 rounded-full border-2 border-white/20 shadow-sm", `cat-${item.cat}`)} />
            <span className="text-sm font-medium text-[var(--text-secondary)]">{item.label}</span>
          </button>
        ))}
      </footer>
      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass w-full max-w-md p-8 rounded-3xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[var(--accent-color)] text-white">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h2>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-[var(--text-secondary)]" />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-4 uppercase tracking-wider">
                    Accent Color
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'].map(color => (
                      <button
                        key={color}
                        onClick={() => setAccentColor(color)}
                        className={cn(
                          "w-10 h-10 rounded-full transition-all hover:scale-110 active:scale-95",
                          accentColor === color ? "ring-4 ring-offset-2 ring-[var(--accent-color)]" : ""
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-4 uppercase tracking-wider">
                    Language
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['en', 'zh-CN', 'zh-TW', 'ja', 'ko'] as Language[]).map(l => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                          lang === l 
                            ? "bg-[var(--accent-color)] text-white shadow-lg" 
                            : "glass hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                        )}
                      >
                        {l === 'en' ? 'English' : l === 'zh-CN' ? '简体中文' : l === 'zh-TW' ? '繁體中文' : l === 'ja' ? '日本語' : '한국어'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-4 uppercase tracking-wider">
                    Theme
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={cn(
                        "flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        theme === 'light' 
                          ? "bg-[var(--accent-color)] text-white shadow-lg" 
                          : "glass hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                      )}
                    >
                      <Sun className="w-4 h-4" /> Light
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={cn(
                        "flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        theme === 'dark' 
                          ? "bg-[var(--accent-color)] text-white shadow-lg" 
                          : "glass hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                      )}
                    >
                      <Moon className="w-4 h-4" /> Dark
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-[var(--border-color)] text-center">
                <p className="text-xs text-[var(--text-secondary)] opacity-60">
                  Interactive Periodic Table v2.0
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Help Modal */}
      <AnimatePresence>
        {isHelpOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsHelpOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass w-full max-w-lg p-8 rounded-3xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[var(--accent-color)] text-white">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">How to Use</h2>
                </div>
                <button 
                  onClick={() => setIsHelpOpen(false)}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-[var(--text-secondary)]" />
                </button>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[var(--accent-color)]" /> Filtering
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    Use the search bar to find elements by name, symbol, or atomic number. You can also filter by category using the dropdown in the header or the legend at the bottom.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-[var(--accent-color)]" /> Element Details
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    Click on any element to see detailed information, its historical story, and a 3D-like Bohr model visualization.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[var(--accent-color)]" /> Keyboard Shortcuts
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass p-3 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-mono text-[var(--text-secondary)]">Search</span>
                      <kbd className="px-2 py-1 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)] text-xs font-mono">/</kbd>
                    </div>
                    <div className="glass p-3 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-mono text-[var(--text-secondary)]">Close Modal</span>
                      <kbd className="px-2 py-1 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)] text-xs font-mono">Esc</kbd>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                    <Shuffle className="w-4 h-4 text-[var(--accent-color)]" /> Random Element
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    Feeling curious? Click the shuffle icon in the header to jump to a random element.
                  </p>
                </section>
              </div>

              <div className="mt-12 pt-8 border-t border-[var(--border-color)] flex items-center justify-between">
                <p className="text-xs text-[var(--text-secondary)] opacity-60">
                  Made with ❤️ for Chemistry lovers.
                </p>
                <button 
                  onClick={() => setIsHelpOpen(false)}
                  className="px-6 py-2 bg-[var(--accent-color)] text-white rounded-xl text-sm font-medium shadow-lg hover:scale-105 transition-transform"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-40 p-4 bg-[var(--accent-color)] text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-transform group"
          >
            <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
      {/* Custom Cursor */}
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[var(--accent-color)] pointer-events-none z-[100] hidden md:block mix-blend-difference"
        animate={{ 
          x: mousePos.x - 16, 
          y: mousePos.y - 16,
          scale: hoveredElement ? 2 : 1,
          backgroundColor: hoveredElement ? 'var(--accent-color)' : 'transparent'
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
      />
      {/* Quiz Modal */}
      <AnimatePresence>
        {isQuizOpen && currentQuestion && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass w-full max-w-md p-8 rounded-3xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[var(--accent-color)] text-white">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Quiz Mode</h2>
                </div>
                <div className="text-[var(--accent-color)] font-bold">Score: {quizScore}</div>
              </div>

              <div className="text-center mb-8">
                <p className="text-[var(--text-secondary)] text-sm uppercase tracking-widest mb-2">What is the symbol for</p>
                <h3 className="text-4xl font-black text-[var(--text-primary)]">{currentQuestion.element.translations[lang].name}?</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (opt === currentQuestion.element.symbol) {
                        setQuizScore(s => s + 1);
                        playSound(880);
                        confetti({ particleCount: 50, spread: 30, origin: { y: 0.8 } });
                        
                        // Next question
                        const randomEl = fullElements[Math.floor(Math.random() * fullElements.length)];
                        const options = [randomEl.symbol];
                        while (options.length < 4) {
                          const o = fullElements[Math.floor(Math.random() * fullElements.length)].symbol;
                          if (!options.includes(o)) options.push(o);
                        }
                        setCurrentQuestion({ element: randomEl, options: options.sort(() => Math.random() - 0.5) });
                      } else {
                        playSound(220);
                        setIsQuizOpen(false);
                        alert(`Game Over! Final Score: ${quizScore}`);
                        setQuizScore(0);
                      }
                    }}
                    className="glass p-6 rounded-2xl text-2xl font-bold hover:bg-[var(--accent-color)] hover:text-white transition-all active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  setIsQuizOpen(false);
                  setQuizScore(0);
                }}
                className="mt-8 w-full py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium"
              >
                Quit Quiz
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Compare Modal */}
      <AnimatePresence>
        {compareElement && selectedElement && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass w-full max-w-4xl p-8 rounded-3xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[var(--accent-color)] text-white">
                    <GitCompare className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Element Comparison</h2>
                </div>
                <button 
                  onClick={() => {
                    setCompareElement(null);
                    setSelectedElement(null);
                  }}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-[var(--text-secondary)]" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* Element 1 */}
                <div className="space-y-6 text-center">
                  <div className={cn("w-32 h-32 mx-auto rounded-2xl flex flex-col items-center justify-center shadow-xl", `cat-${compareElement.category}`)}>
                    <span className="text-4xl font-black">{compareElement.symbol}</span>
                    <span className="text-xs opacity-70">#{compareElement.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{compareElement.translations[lang].name}</h3>
                </div>

                {/* Comparison Labels */}
                <div className="flex flex-col justify-center space-y-8 pt-12">
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">Atomic Weight</p>
                    <div className="h-px bg-[var(--border-color)] w-full" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">Category</p>
                    <div className="h-px bg-[var(--border-color)] w-full" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-1">Electrons</p>
                    <div className="h-px bg-[var(--border-color)] w-full" />
                  </div>
                </div>

                {/* Element 2 */}
                <div className="space-y-6 text-center">
                  <div className={cn("w-32 h-32 mx-auto rounded-2xl flex flex-col items-center justify-center shadow-xl", `cat-${selectedElement.category}`)}>
                    <span className="text-4xl font-black">{selectedElement.symbol}</span>
                    <span className="text-xs opacity-70">#{selectedElement.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{selectedElement.translations[lang].name}</h3>
                </div>
              </div>

              {/* Data Rows */}
              <div className="grid grid-cols-3 gap-8 mt-4">
                <div className="text-center text-lg font-mono text-[var(--text-primary)]">{compareElement.weight}</div>
                <div className="text-center" />
                <div className="text-center text-lg font-mono text-[var(--text-primary)]">{selectedElement.weight}</div>

                <div className="text-center text-sm font-bold text-[var(--text-primary)] capitalize">{compareElement.category.replace(/-/g, ' ')}</div>
                <div className="text-center" />
                <div className="text-center text-sm font-bold text-[var(--text-primary)] capitalize">{selectedElement.category.replace(/-/g, ' ')}</div>

                <div className="text-center text-sm font-mono text-[var(--text-primary)]">{getElectronConfiguration(compareElement.number).join(', ')}</div>
                <div className="text-center" />
                <div className="text-center text-sm font-mono text-[var(--text-primary)]">{getElectronConfiguration(selectedElement.number).join(', ')}</div>
              </div>

              <div className="mt-12 flex justify-center">
                <button 
                  onClick={() => {
                    setCompareElement(null);
                    setSelectedElement(null);
                  }}
                  className="px-8 py-3 bg-[var(--accent-color)] text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  Close Comparison
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
