import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Moon,
  Sun,
  X,
  Info,
  BookOpen,
  Shuffle,
  Filter,
  Download,
  Share2,
  Settings,
  HelpCircle,
  ChevronUp,
  Brain,
  GitCompare,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { fullElements } from './data/elements';
import { PeriodicElement, Language, Category, CATEGORIES } from './types';
import { cn, getElectronConfiguration } from './lib/utils';
import { BohrModel } from './components/BohrModel';
import { ElementTrends } from './components/ElementTrends';
import { translations, TranslationDictionary } from './data/translations';

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
  const [activeTab, setActiveTab] = useState<'info' | 'trends' | 'model' | 'story'>('info');
  const [accentColor, setAccentColor] = useState<string>('#3b82f6');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<{ element: PeriodicElement; options: string[] } | null>(null);
  const [compareElement, setCompareElement] = useState<PeriodicElement | null>(null);

  const tr: TranslationDictionary = translations[lang] || translations['en'];
  const categories = CATEGORIES;

  const playSound = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio not permitted or supported
    }
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
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor]);

  // Keyboard navigation & language initialization
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
      if (e.key === 'Escape') {
        setSelectedElement(null);
        setIsSettingsOpen(false);
        setIsHelpOpen(false);
        setIsQuizOpen(false);
        setCompareElement(null);
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

  const filteredElements = fullElements.filter((el) => {
    const matchesSearch =
      el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.number.toString().includes(searchQuery) ||
      (el.translations[lang]?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || el.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleStartQuiz = () => {
    const randomEl = fullElements[Math.floor(Math.random() * fullElements.length)];
    const options = [randomEl.symbol];
    while (options.length < 4) {
      const opt = fullElements[Math.floor(Math.random() * fullElements.length)].symbol;
      if (!options.includes(opt)) options.push(opt);
    }
    setCurrentQuestion({ element: randomEl, options: options.sort(() => Math.random() - 0.5) });
    setIsQuizOpen(true);
  };

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
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[var(--accent-color)] text-white shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text-primary)]">
              {tr.title}
            </h1>
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Random Element */}
          <button
            onClick={() => {
              const randomEl = fullElements[Math.floor(Math.random() * fullElements.length)];
              setSelectedElement(randomEl);
              playSound(660);
            }}
            className="glass p-2.5 hover:bg-[var(--bg-secondary)] rounded-2xl transition-all group border border-[var(--border-color)] shadow-sm hover:scale-105 active:scale-95"
            title={tr.randomElement}
          >
            <Shuffle className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
          </button>

          {/* Search Bar */}
          <div className="relative group">
            <input
              type="text"
              placeholder={tr.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass pl-4 pr-9 py-2 rounded-2xl w-56 md:w-64 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] border border-[var(--border-color)]"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] pointer-events-none">
              /
            </kbd>
          </div>

          {/* Category Dropdown */}
          <div className="relative group">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="glass px-4 py-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] appearance-none cursor-pointer text-xs font-medium text-[var(--text-secondary)] pr-8 border border-[var(--border-color)]"
            >
              <option value="">{tr.all}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {tr[cat] || cat}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)] pointer-events-none" />
          </div>

          {/* Download JSON Data */}
          <button
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullElements, null, 2));
              const downloadAnchorNode = document.createElement('a');
              downloadAnchorNode.setAttribute('href', dataStr);
              downloadAnchorNode.setAttribute('download', 'periodic_table_data.json');
              document.body.appendChild(downloadAnchorNode);
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            }}
            className="glass p-2.5 hover:bg-[var(--bg-secondary)] rounded-2xl transition-all group border border-[var(--border-color)] shadow-sm hover:scale-105 active:scale-95"
            title={tr.downloadJson}
          >
            <Download className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
          </button>

          {/* Share App */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert(tr.linkCopied);
            }}
            className="glass p-2.5 hover:bg-[var(--bg-secondary)] rounded-2xl transition-all group border border-[var(--border-color)] shadow-sm hover:scale-105 active:scale-95"
            title={tr.shareApp}
          >
            <Share2 className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
          </button>

          {/* Quiz Mode */}
          <button
            onClick={handleStartQuiz}
            className="glass p-2.5 hover:bg-[var(--bg-secondary)] rounded-2xl transition-all group border border-[var(--border-color)] shadow-sm hover:scale-105 active:scale-95"
            title={tr.quizMode}
          >
            <Brain className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="glass p-2.5 hover:bg-[var(--bg-secondary)] rounded-2xl transition-all group border border-[var(--border-color)] shadow-sm hover:scale-105 active:scale-95"
            title={tr.settings}
          >
            <Settings className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
          </button>

          {/* Help */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="glass p-2.5 hover:bg-[var(--bg-secondary)] rounded-2xl transition-all group border border-[var(--border-color)] shadow-sm hover:scale-105 active:scale-95"
            title={tr.help}
          >
            <HelpCircle className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
          </button>
        </div>
      </header>

      {/* Periodic Table Grid */}
      <main className="relative overflow-x-auto pb-8">
        <div className="grid grid-cols-18 gap-1 md:gap-1.5 min-w-[1240px] mx-auto relative">
          {/* Quick View Panel (in the empty space) */}
          <AnimatePresence>
            {hoveredElement && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-0 left-[16.66%] w-[55.55%] h-[33.33%] z-0 flex items-center justify-center p-6 pointer-events-none"
                style={{ gridColumn: '3 / span 10', gridRow: '1 / span 3' }}
              >
                <div className="flex items-center gap-8 glass p-6 rounded-3xl border border-[var(--border-color)] shadow-2xl backdrop-blur-xl">
                  <div
                    className={cn(
                      'w-28 h-28 rounded-2xl flex flex-col items-center justify-center shadow-xl border-2 border-white/20',
                      `cat-${hoveredElement.category}`
                    )}
                  >
                    <span className="text-xs font-mono opacity-80">#{hoveredElement.number}</span>
                    <span className="text-4xl font-black">{hoveredElement.symbol}</span>
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="text-3xl font-black text-[var(--text-primary)]">
                      {hoveredElement.translations[lang]?.name}
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] font-mono font-semibold">
                      {hoveredElement.weight}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className={cn('w-2.5 h-2.5 rounded-full', `cat-${hoveredElement.category}`)} />
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                        {tr[hoveredElement.category] || hoveredElement.category}
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
                if (compareElement && compareElement.number !== el.number) {
                  // Already in comparison selection
                  setSelectedElement(el);
                  playSound(880);
                  return;
                }
                setSelectedElement(el);
                playSound(600 + el.number * 4);
                if (el.symbol === 'Au') {
                  confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FFD700', '#DAA520', '#B8860B'],
                  });
                }
              }}
              onMouseEnter={() => {
                setHoveredElement(el);
                playSound(350 + el.number * 3);
              }}
              onMouseLeave={() => setHoveredElement(null)}
              style={{
                gridColumn: el.group,
                gridRow: el.period,
              }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              className={cn(
                'aspect-square p-1 md:p-1.5 rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden group border border-white/10',
                `cat-${el.category}`,
                'shadow-sm hover:shadow-xl',
                el.period > 7 && 'mt-6' // Lanthanides/Actinides row spacing
              )}
            >
              <span className="text-[8px] md:text-[9px] absolute top-1 left-1 opacity-75 font-mono">{el.number}</span>
              <span className="text-base md:text-xl font-black leading-none">{el.symbol}</span>
              <span className="text-[8px] md:text-[9px] opacity-95 truncate w-full text-center font-medium mt-0.5">
                {el.translations[lang]?.name}
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}

          {/* Spacers for Lanthanides/Actinides labels */}
          <div
            style={{ gridColumn: 1, gridRow: 8 }}
            className="flex items-end pb-1 text-[9px] font-bold opacity-50 uppercase tracking-wider text-[var(--text-primary)]"
          >
            {tr.lanthanidesRow}
          </div>
          <div
            style={{ gridColumn: 1, gridRow: 9 }}
            className="flex items-end pb-1 text-[9px] font-bold opacity-50 uppercase tracking-wider text-[var(--text-primary)]"
          >
            {tr.actinidesRow}
          </div>
        </div>
      </main>

      {/* Element Detail Modal */}
      <AnimatePresence>
        {selectedElement && !compareElement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedElement(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              layoutId={`element-${selectedElement.number}`}
              className="relative w-full max-w-5xl glass rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh] border border-[var(--border-color)]"
            >
              {/* Top-Right Close Button: Positioned absolute with clean z-index and spacing so it NEVER overlaps Compare */}
              <button
                onClick={() => setSelectedElement(null)}
                className="absolute top-4 right-4 p-2.5 bg-black/40 hover:bg-black/70 text-white rounded-full z-30 backdrop-blur-md transition-all shadow-lg active:scale-95 border border-white/10"
                title={tr.shortcutsClose}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Visuals */}
              <div
                className={cn(
                  'w-full md:w-5/12 p-8 md:p-10 flex flex-col items-center justify-center text-white relative',
                  `cat-${selectedElement.category}`
                )}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-center z-10"
                >
                  <span className="text-2xl md:text-3xl font-mono opacity-60 block mb-1">#{selectedElement.number}</span>
                  <h2 className="text-7xl md:text-8xl font-black tracking-tighter mb-2">{selectedElement.symbol}</h2>
                  <p className="text-2xl md:text-3xl font-bold mb-6">{selectedElement.translations[lang]?.name}</p>

                  <div className="flex flex-wrap gap-2.5 justify-center">
                    <div className="glass px-3.5 py-1.5 rounded-xl border border-white/20">
                      <p className="text-[10px] opacity-75 uppercase tracking-wider">{tr.weight}</p>
                      <p className="text-sm font-mono font-bold">{selectedElement.weight}</p>
                    </div>
                    <div className="glass px-3.5 py-1.5 rounded-xl border border-white/20">
                      <p className="text-[10px] opacity-75 uppercase tracking-wider">{tr.electrons}</p>
                      <p className="text-sm font-mono font-bold">
                        {getElectronConfiguration(selectedElement.number).join(', ')}
                      </p>
                    </div>
                    <div className="glass px-3.5 py-1.5 rounded-xl border border-white/20">
                      <p className="text-[10px] opacity-75 uppercase tracking-wider">{tr.category}</p>
                      <p className="text-xs font-bold">{tr[selectedElement.category] || selectedElement.category}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Giant watermark */}
                <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none select-none overflow-hidden">
                  <span className="text-[18rem] font-black leading-none translate-y-1/4 translate-x-1/4">
                    {selectedElement.symbol}
                  </span>
                </div>
              </div>

              {/* Right Side: Content with tabs */}
              <div className="w-full md:w-7/12 flex flex-col bg-[var(--bg-primary)] h-[65vh] md:h-auto overflow-hidden">
                {/* Tabs & Action Header: pr-16 ensures Compare button never collides with Close button */}
                <div className="flex flex-wrap items-center justify-between border-b border-[var(--border-color)] px-6 pt-5 pb-3 pr-16 gap-3">
                  <div className="flex flex-wrap gap-1">
                    {(['info', 'trends', 'model', 'story'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          'flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all',
                          activeTab === tab
                            ? 'bg-[var(--accent-color)] text-white shadow-md'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                        )}
                      >
                        {tab === 'trends' && <TrendingUp className="w-3.5 h-3.5" />}
                        <span>{tr[tab]}</span>
                      </button>
                    ))}
                  </div>

                  {/* Compare Button */}
                  <button
                    onClick={() => {
                      setCompareElement(selectedElement);
                      alert(tr.selectAnotherToCompare);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 glass hover:bg-[var(--bg-secondary)] rounded-xl text-xs font-bold uppercase tracking-wider text-[var(--accent-color)] border border-[var(--border-color)] transition-all hover:scale-105 active:scale-95 shadow-sm"
                    title={tr.compare}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>{tr.compare}</span>
                  </button>
                </div>

                {/* Tab Body */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {/* INFO TAB */}
                    {activeTab === 'info' && (
                      <motion.div
                        key="info"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <section>
                          <div className="flex items-center gap-2 mb-3 text-[var(--text-secondary)]">
                            <Info className="w-4 h-4 text-[var(--accent-color)]" />
                            <h3 className="text-xs font-bold uppercase tracking-wider">{tr.description}</h3>
                          </div>
                          <p className="text-base leading-relaxed text-[var(--text-primary)]">
                            {selectedElement.translations[lang]?.description}
                          </p>
                        </section>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="glass px-4 py-3 rounded-2xl border border-[var(--border-color)]">
                            <p className="text-[10px] opacity-70 uppercase tracking-wider mb-1 font-semibold">
                              {tr.weight}
                            </p>
                            <p className="text-base font-mono font-bold text-[var(--text-primary)]">
                              {selectedElement.weight}
                            </p>
                          </div>
                          <div className="glass px-4 py-3 rounded-2xl border border-[var(--border-color)]">
                            <p className="text-[10px] opacity-70 uppercase tracking-wider mb-1 font-semibold">
                              {tr.category}
                            </p>
                            <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                              {tr[selectedElement.category] || selectedElement.category}
                            </p>
                          </div>
                          <div className="glass px-4 py-3 rounded-2xl border border-[var(--border-color)]">
                            <p className="text-[10px] opacity-70 uppercase tracking-wider mb-1 font-semibold">
                              {tr.period} / {tr.group}
                            </p>
                            <p className="text-base font-mono font-bold text-[var(--text-primary)]">
                              {tr.period} {selectedElement.period} • {tr.group} {selectedElement.group}
                            </p>
                          </div>
                          <div className="glass px-4 py-3 rounded-2xl border border-[var(--border-color)]">
                            <p className="text-[10px] opacity-70 uppercase tracking-wider mb-1 font-semibold">
                              {tr.electronegativity}
                            </p>
                            <p className="text-base font-mono font-bold text-[var(--text-primary)]">
                              {selectedElement.properties?.electronegativity ?? tr.noData}
                            </p>
                          </div>
                          <div className="glass px-4 py-3 rounded-2xl border border-[var(--border-color)] col-span-2">
                            <p className="text-[10px] opacity-70 uppercase tracking-wider mb-1 font-semibold">
                              {tr.electronConfig}
                            </p>
                            <p className="text-base font-mono font-bold text-[var(--accent-color)]">
                              {getElectronConfiguration(selectedElement.number).join(', ')}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* TRENDS TAB (Recharts) */}
                    {activeTab === 'trends' && (
                      <motion.div
                        key="trends"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="h-full"
                      >
                        <ElementTrends
                          selectedElement={selectedElement}
                          allElements={fullElements}
                          lang={lang}
                          onSelectElement={(el) => setSelectedElement(el)}
                          accentColor={accentColor}
                        />
                      </motion.div>
                    )}

                    {/* MODEL TAB */}
                    {activeTab === 'model' && (
                      <motion.div
                        key="model"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex justify-center items-center py-4"
                      >
                        <BohrModel atomicNumber={selectedElement.number} symbol={selectedElement.symbol} lang={lang} />
                      </motion.div>
                    )}

                    {/* STORY TAB */}
                    {activeTab === 'story' && (
                      <motion.div
                        key="story"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-2 mb-3 text-[var(--text-secondary)]">
                          <BookOpen className="w-4 h-4 text-[var(--accent-color)]" />
                          <h3 className="text-xs font-bold uppercase tracking-wider">{tr.story}</h3>
                        </div>
                        <p className="text-lg leading-relaxed italic text-[var(--text-primary)] font-serif glass p-6 rounded-2xl border border-[var(--border-color)]">
                          "{selectedElement.translations[lang]?.story}"
                        </p>
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
      <footer className="mt-12 flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-2xl transition-all border border-[var(--border-color)] text-xs font-bold uppercase tracking-wider',
            !selectedCategory ? 'glass ring-2 ring-[var(--accent-color)] text-[var(--text-primary)]' : 'opacity-60 hover:opacity-100 text-[var(--text-secondary)]'
          )}
        >
          {tr.all}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={cn(
              'flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl transition-all border border-[var(--border-color)] text-xs font-medium',
              selectedCategory === cat
                ? 'glass ring-2 ring-[var(--accent-color)] text-[var(--text-primary)] shadow-md'
                : 'opacity-70 hover:opacity-100 text-[var(--text-secondary)]'
            )}
          >
            <div className={cn('w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm', `cat-${cat}`)} />
            <span>{tr[cat] || cat}</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass w-full max-w-md p-6 md:p-8 rounded-3xl relative overflow-hidden border border-[var(--border-color)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[var(--accent-color)] text-white shadow-md">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{tr.settingsTitle}</h2>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors text-[var(--text-secondary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-3 uppercase tracking-wider">
                    {tr.accentColor}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setAccentColor(color)}
                        className={cn(
                          'w-9 h-9 rounded-full transition-all hover:scale-110 active:scale-95 shadow-sm',
                          accentColor === color ? 'ring-4 ring-offset-2 ring-[var(--accent-color)]' : ''
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-3 uppercase tracking-wider">
                    {tr.language}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        className={cn(
                          'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border border-[var(--border-color)]',
                          lang === l.code
                            ? 'bg-[var(--accent-color)] text-white shadow-md'
                            : 'glass hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                        )}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-3 uppercase tracking-wider">
                    {tr.theme}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setTheme('light')}
                      className={cn(
                        'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-[var(--border-color)]',
                        theme === 'light'
                          ? 'bg-[var(--accent-color)] text-white shadow-md'
                          : 'glass hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                      )}
                    >
                      <Sun className="w-4 h-4" /> {tr.light}
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={cn(
                        'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-[var(--border-color)]',
                        theme === 'dark'
                          ? 'bg-[var(--accent-color)] text-white shadow-md'
                          : 'glass hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                      )}
                    >
                      <Moon className="w-4 h-4" /> {tr.dark}
                    </button>
                  </div>
                </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsHelpOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass w-full max-w-lg p-6 md:p-8 rounded-3xl relative overflow-hidden border border-[var(--border-color)] shadow-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[var(--accent-color)] text-white shadow-md">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{tr.howToUse}</h2>
                </div>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors text-[var(--text-secondary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5 overflow-y-auto pr-1">
                <section>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[var(--accent-color)]" /> {tr.filteringTitle}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                    {tr.filteringDesc}
                  </p>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[var(--accent-color)]" /> {tr.detailsTitle}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                    {tr.detailsDesc}
                  </p>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[var(--accent-color)]" /> {tr.shortcutsTitle}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass p-2.5 rounded-xl flex items-center justify-between border border-[var(--border-color)]">
                      <span className="text-xs font-medium text-[var(--text-secondary)]">{tr.shortcutsSearch}</span>
                      <kbd className="px-2 py-0.5 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)] text-[11px] font-mono">
                        /
                      </kbd>
                    </div>
                    <div className="glass p-2.5 rounded-xl flex items-center justify-between border border-[var(--border-color)]">
                      <span className="text-xs font-medium text-[var(--text-secondary)]">{tr.shortcutsClose}</span>
                      <kbd className="px-2 py-0.5 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)] text-[11px] font-mono">
                        Esc
                      </kbd>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                    <Shuffle className="w-4 h-4 text-[var(--accent-color)]" /> {tr.randomTitle}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                    {tr.randomDesc}
                  </p>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-[var(--accent-color)]" /> {tr.comparisonTitle}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                    {tr.comparisonDesc}
                  </p>
                </section>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                <p className="text-[11px] text-[var(--text-secondary)] opacity-70">
                  {tr.footerLove}
                </p>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="px-5 py-2 bg-[var(--accent-color)] text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
                >
                  {tr.gotIt}
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
            className="fixed bottom-6 right-6 z-40 p-3.5 bg-[var(--accent-color)] text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-transform group"
          >
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[var(--accent-color)] pointer-events-none z-[100] hidden md:block mix-blend-difference"
        animate={{
          x: mousePos.x - 16,
          y: mousePos.y - 16,
          scale: hoveredElement ? 1.8 : 1,
          backgroundColor: hoveredElement ? 'var(--accent-color)' : 'transparent',
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass w-full max-w-md p-6 md:p-8 rounded-3xl relative overflow-hidden border border-[var(--border-color)] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[var(--accent-color)] text-white shadow-md">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{tr.quizTitle}</h2>
                </div>
                <div className="text-[var(--accent-color)] font-mono font-bold text-sm bg-[var(--accent-color)]/10 px-3 py-1 rounded-xl">
                  {tr.score}: {quizScore}
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-2 font-medium">
                  {tr.whatIsSymbolFor}
                </p>
                <h3 className="text-3xl font-black text-[var(--text-primary)]">
                  {currentQuestion.element.translations[lang]?.name}?
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (opt === currentQuestion.element.symbol) {
                        setQuizScore((s) => s + 1);
                        playSound(880);
                        confetti({ particleCount: 50, spread: 35, origin: { y: 0.75 } });

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
                        alert(`${tr.gameOver} ${quizScore}`);
                        setQuizScore(0);
                      }
                    }}
                    className="glass p-5 rounded-2xl text-2xl font-black text-[var(--text-primary)] hover:bg-[var(--accent-color)] hover:text-white transition-all active:scale-95 border border-[var(--border-color)] shadow-sm"
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
                className="mt-6 w-full py-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs font-semibold"
              >
                {tr.quitQuiz}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass w-full max-w-4xl p-6 md:p-8 rounded-3xl relative overflow-hidden border border-[var(--border-color)] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[var(--accent-color)] text-white shadow-md">
                    <GitCompare className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{tr.elementComparison}</h2>
                </div>
                <button
                  onClick={() => {
                    setCompareElement(null);
                    setSelectedElement(null);
                  }}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors text-[var(--text-secondary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 items-center">
                {/* Element 1 */}
                <div className="space-y-4 text-center">
                  <div
                    className={cn(
                      'w-28 h-28 mx-auto rounded-2xl flex flex-col items-center justify-center shadow-xl border border-white/20',
                      `cat-${compareElement.category}`
                    )}
                  >
                    <span className="text-3xl font-black text-white">{compareElement.symbol}</span>
                    <span className="text-xs text-white/80 font-mono">#{compareElement.number}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {compareElement.translations[lang]?.name}
                  </h3>
                </div>

                {/* Comparison Center Labels */}
                <div className="flex flex-col justify-center space-y-6 pt-6">
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      {tr.weight}
                    </p>
                    <div className="h-px bg-[var(--border-color)] w-full" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      {tr.category}
                    </p>
                    <div className="h-px bg-[var(--border-color)] w-full" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      {tr.electrons}
                    </p>
                    <div className="h-px bg-[var(--border-color)] w-full" />
                  </div>
                </div>

                {/* Element 2 */}
                <div className="space-y-4 text-center">
                  <div
                    className={cn(
                      'w-28 h-28 mx-auto rounded-2xl flex flex-col items-center justify-center shadow-xl border border-white/20',
                      `cat-${selectedElement.category}`
                    )}
                  >
                    <span className="text-3xl font-black text-white">{selectedElement.symbol}</span>
                    <span className="text-xs text-white/80 font-mono">#{selectedElement.number}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {selectedElement.translations[lang]?.name}
                  </h3>
                </div>
              </div>

              {/* Data Rows */}
              <div className="grid grid-cols-3 gap-6 mt-3">
                <div className="text-center text-base font-mono font-bold text-[var(--text-primary)]">
                  {compareElement.weight}
                </div>
                <div className="text-center" />
                <div className="text-center text-base font-mono font-bold text-[var(--text-primary)]">
                  {selectedElement.weight}
                </div>

                <div className="text-center text-xs font-bold text-[var(--text-primary)]">
                  {tr[compareElement.category] || compareElement.category}
                </div>
                <div className="text-center" />
                <div className="text-center text-xs font-bold text-[var(--text-primary)]">
                  {tr[selectedElement.category] || selectedElement.category}
                </div>

                <div className="text-center text-xs font-mono font-bold text-[var(--text-primary)]">
                  {getElectronConfiguration(compareElement.number).join(', ')}
                </div>
                <div className="text-center" />
                <div className="text-center text-xs font-mono font-bold text-[var(--text-primary)]">
                  {getElectronConfiguration(selectedElement.number).join(', ')}
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    setCompareElement(null);
                    setSelectedElement(null);
                  }}
                  className="px-6 py-2.5 bg-[var(--accent-color)] text-white rounded-xl text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                >
                  {tr.closeComparison}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
