import React from 'react';

interface MaximListProps {
  maxims: string[];
  selectedMaxim: string | null;
  onSelect: (maxim: string) => void;
  isLoading: boolean;
}

const MaximList: React.FC<MaximListProps> = ({ maxims, selectedMaxim, onSelect, isLoading }) => {
  return (
    <div className="bg-gray-800/70 rounded-lg shadow-lg p-2 sm:p-4 h-full">
      <h2 className="text-lg font-semibold mb-4 px-2 text-cyan-300">Choose a Maxim</h2>
      <ul className="space-y-1">
        {maxims.map((maxim) => {
          const isSelected = maxim === selectedMaxim;
          const isItemLoading = isSelected && isLoading;

          return (
            <li key={maxim}>
              <button
                onClick={() => onSelect(maxim)}
                disabled={isItemLoading}
                className={`w-full text-left p-3 rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 flex justify-between items-center ${
                  isSelected
                    ? 'bg-cyan-600 text-white font-semibold shadow-md'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                } ${isItemLoading ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
                aria-busy={isItemLoading}
              >
                <span>{maxim}</span>
                {isItemLoading && (
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MaximList;
