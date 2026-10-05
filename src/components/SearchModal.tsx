'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, Flame, Sparkles, ArrowRight, Tag, CornerDownLeft, Loader2, AlertCircle } from 'lucide-react';

const TRENDING_SEARCHES = [
  'Air Jordan 1',
  'Chunky Kicks',
  'Under $100',
  'Nike Dunk Panda',
  'Adidas Samba',
  'Anime Edition',
  'New Balance 550',
];

const LOCAL_STORAGE_KEY = 'kicks_recent_searches';

interface SearchProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  images: string;
  stock: number;
}

interface SearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SearchModal({ isOpen: controlledIsOpen, onClose: controlledOnClose }: SearchModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isFallback, setIsFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleClose = useCallback(() => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
    setQuery('');
    setResults([]);
    setIsFallback(false);
    setSelectedIndex(-1);
  }, [controlledOnClose]);

  const handleOpen = useCallback(() => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(true);
    }
  }, [controlledIsOpen]);

  // Global Keyboard Shortcuts (Ctrl + K / Cmd + K / Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          handleOpen();
        }
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose, handleOpen]);

  // Listen to custom open event from anywhere (e.g. Navbar search click)
  useEffect(() => {
    const handleCustomOpen = () => handleOpen();
    window.addEventListener('open-search-modal', handleCustomOpen);
    return () => window.removeEventListener('open-search-modal', handleCustomOpen);
  }, [handleOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch (e) {
        setRecentSearches([]);
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Save query to recent searches
  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const removeRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== termToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {}
  };

  // Debounced API Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsFallback(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setIsFallback(Boolean(data.isFallback));
        }
      } catch (err) {
        console.error('[SearchModal] Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Navigate to product
  const handleSelectProduct = (product: SearchProduct) => {
    saveRecentSearch(query || product.name);
    handleClose();
    router.push(`/products/${product.id}`);
  };

  // Submit full search page
  const handleFullSearch = (term: string) => {
    saveRecentSearch(term);
    handleClose();
    router.push(`/products?search=${encodeURIComponent(term.trim())}`);
  };

  // Helper to parse image
  const getImage = (imagesString: string) => {
    try {
      if (imagesString?.startsWith('[')) {
        const arr = JSON.parse(imagesString);
        return arr[0] || '/placeholder-shoe.svg';
      }
      return imagesString || '/placeholder-shoe.svg';
    } catch {
      return '/placeholder-shoe.svg';
    }
  };

  // Keyboard navigation for arrow up/down
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        e.preventDefault();
        handleFullSearch(query);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelectProduct(results[selectedIndex]);
      } else if (query.trim()) {
        handleFullSearch(query);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-12 sm:pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Command Palette Modal Box */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-zinc-900 overflow-hidden z-10 flex flex-col max-h-[80vh] animate-in zoom-in-95 fade-in duration-200"
      >
        {/* Search Header Bar */}
        <div className="relative flex items-center px-5 py-4 border-b-2 border-zinc-100 bg-[#FAFAFA]">
          <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search brand, model, 'under $100', 'chunky', 'anime'..."
            className="w-full bg-transparent text-sm sm:text-base font-bold text-zinc-900 placeholder-zinc-400 focus:outline-none"
          />

          {isLoading && <Loader2 className="w-4 h-4 text-zinc-500 animate-spin mr-2 shrink-0" />}

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsFallback(false);
                inputRef.current?.focus();
              }}
              className="p-1 text-zinc-400 hover:text-black rounded-lg hover:bg-zinc-200 transition-colors mr-2"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleClose}
            className="text-[11px] font-black uppercase tracking-wider bg-zinc-200 text-zinc-700 hover:bg-black hover:text-white px-2.5 py-1 rounded-lg transition-colors shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Modal Body / Results Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* STATE 1: Empty Query State (Recent & Trending Searches) */}
          {!query.trim() && (
            <div className="space-y-6">
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs font-black uppercase tracking-wider text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Recent Searches
                    </span>
                    <button
                      onClick={clearAllRecent}
                      className="text-[10px] text-zinc-400 hover:text-red-600 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        onClick={() => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        className="group flex items-center gap-2 bg-zinc-100 hover:bg-[#FEE715] text-zinc-800 hover:text-black px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all border border-zinc-200 hover:border-black shadow-sm"
                      >
                        <span>{term}</span>
                        <button
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="text-zinc-400 group-hover:text-black hover:bg-black/10 rounded p-0.5"
                          aria-label="Remove search"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-1.5 mb-3 text-xs font-black uppercase tracking-wider text-zinc-500">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  Trending Drops &amp; Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setQuery(tag);
                        inputRef.current?.focus();
                      }}
                      className="flex items-center gap-1.5 bg-white hover:bg-black text-zinc-700 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold border-2 border-zinc-200 hover:border-black transition-all shadow-sm"
                    >
                      <Tag className="w-3 h-3 text-zinc-400" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STATE 2: Active Results with Zero-Results Fallback Notice */}
          {query.trim() && (
            <div className="space-y-4">
              
              {/* Fallback Bestsellers Banner */}
              {isFallback && (
                <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-wide">
                      No exact matches for &quot;{query}&quot;
                    </h4>
                    <p className="text-xs text-amber-800/90 font-medium mt-0.5">
                      Check out these recommended bestsellers and trending heat drops instead!
                    </p>
                  </div>
                </div>
              )}

              {/* Product Match List */}
              {results.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-[11px] font-black uppercase tracking-widest text-zinc-400 px-1">
                    {isFallback ? '🔥 RECOMMENDED BESTSELLERS' : `MATCHING DROPS (${results.length})`}
                  </div>

                  {results.map((product, idx) => {
                    const isSelected = selectedIndex === idx;
                    const imgUrl = getImage(product.images);

                    return (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border-2 ${
                          isSelected
                            ? 'bg-[#FEE715]/20 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white hover:bg-zinc-50 border-zinc-100 hover:border-zinc-300'
                        }`}
                      >
                        {/* Left Info with Thumbnail */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                              src={imgUrl}
                              alt={product.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-shoe.svg';
                              }}
                            />
                          </div>
                          
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-[10px] font-black uppercase tracking-wider bg-black text-[#FEE715] px-1.5 py-0.5 rounded">
                                {product.brand}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                                {product.category}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-sm text-zinc-900 truncate">
                              {product.name}
                            </h4>
                          </div>
                        </div>

                        {/* Right Price & Select Hint */}
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          <div className="text-right">
                            <span className="font-black text-base text-zinc-950">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-black text-[#FEE715]' : 'bg-zinc-100 text-zinc-400'
                            }`}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                !isLoading && (
                  <div className="text-center py-10 text-zinc-500">
                    <p className="font-bold text-sm">Searching our sneaker vault...</p>
                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* Footer Shortcut & View All Bar */}
        <div className="px-5 py-3.5 bg-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold border-t-2 border-zinc-800">
          {query.trim() ? (
            <button
              onClick={() => handleFullSearch(query)}
              className="flex items-center gap-1.5 text-[#FEE715] hover:underline font-black uppercase tracking-wider"
            >
              <span>View all results for &quot;{query}&quot;</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-zinc-400">Quickly jump to any sneaker, brand, or collection</span>
          )}

          <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1">
              <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-[10px] text-zinc-300 font-mono">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-[10px] text-zinc-300 font-mono">↵</kbd> select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-[10px] text-zinc-300 font-mono">ESC</kbd> close
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
