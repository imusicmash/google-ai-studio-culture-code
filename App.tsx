import React, { useState, useEffect } from 'react';
import { MAXIMS } from './constants';
import type { MaximContent } from './types';
import { fetchMaximExplanation } from './services/geminiService';
import MaximList from './components/MaximList';
import MaximDetail from './components/MaximDetail';

function App(): React.ReactNode {
  const [selectedMaxim, setSelectedMaxim] = useState<string | null>(null);
  const [maximContent, setMaximContent] = useState<MaximContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0); // Used to trigger retries

  useEffect(() => {
    // Don't fetch if no maxim is selected.
    if (!selectedMaxim) {
      return;
    }

    let isStale = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      // We don't clear maximContent here to avoid content flashing.
      // The MaximDetail component will show a spinner based on isLoading.
      try {
        const content = await fetchMaximExplanation(selectedMaxim);
        if (!isStale) {
          setMaximContent(content);
        }
      } catch (err) {
        console.error(err);
        if (!isStale) {
          const message = (err instanceof Error) ? err.message : 'An unknown error occurred.';
          setError(message);
          setMaximContent(null); // Clear content on error
        }
      } finally {
        if (!isStale) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function: if dependencies change before fetch completes,
    // mark the current fetch as stale to prevent race conditions.
    return () => {
      isStale = true;
    };
  }, [selectedMaxim, nonce]);

  const handleSelectMaxim = (maxim: string) => {
    // Case 1: Clicking the currently-loading item should do nothing.
    if (isLoading && maxim === selectedMaxim) {
      return;
    }

    // Case 2: Clicking an item that has already loaded successfully should do nothing.
    if (!isLoading && maxim === selectedMaxim && maximContent) {
      return;
    }

    // Case 3: Retrying a failed load (or a fresh click on the same item)
    if (maxim === selectedMaxim) {
      setNonce(n => n + 1);
    } else {
    // Case 4: A new selection (or switching during another item's load).
      setSelectedMaxim(maxim);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">The Culture Code</h1>
            <p className="text-sm sm:text-md text-cyan-400">Maxim Explorer</p>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <MaximList 
              maxims={MAXIMS} 
              selectedMaxim={selectedMaxim} 
              onSelect={handleSelectMaxim}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            <MaximDetail 
              content={maximContent} 
              isLoading={isLoading} 
              error={error} 
            />
          </div>
        </div>
      </main>

      <footer className="text-center p-4 mt-8 text-xs text-gray-500 border-t border-gray-800">
        <p>Powered by Google Gemini. Content inspired by "The Culture Code" by Daniel Coyle.</p>
      </footer>
    </div>
  );
}

export default App;