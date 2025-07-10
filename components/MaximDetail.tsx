
import React from 'react';
import type { MaximContent } from '../types';
import SpinnerIcon from './icons/SpinnerIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import BookOpenIcon from './icons/BookOpenIcon';

interface MaximDetailProps {
  content: MaximContent | null;
  isLoading: boolean;
  error: string | null;
}

const MaximDetail: React.FC<MaximDetailProps> = ({ content, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-800/50 rounded-lg p-8">
        <SpinnerIcon className="w-12 h-12 text-cyan-400" />
        <p className="mt-4 text-lg text-gray-400">Analyzing the code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-red-900/20 border border-red-500/50 rounded-lg p-8">
        <AlertTriangleIcon className="w-12 h-12 text-red-400" />
        <p className="mt-4 text-lg font-semibold text-red-300">An Error Occurred</p>
        <p className="mt-2 text-center text-red-400">{error}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-800/50 rounded-lg p-8 text-center">
        <BookOpenIcon className="w-16 h-16 text-gray-500" />
        <h3 className="mt-4 text-2xl font-bold text-white">Welcome</h3>
        <p className="mt-2 text-lg text-gray-400">Select a maxim from the list to explore its meaning and see examples from "The Culture Code".</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-xl p-6 sm:p-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-white mb-2">{content.maxim}</h2>
      <p className="text-cyan-400 mb-6 text-lg">What It Means</p>
      <div className="prose prose-invert prose-lg max-w-none text-gray-300 mb-8">
        <p>{content.meaning}</p>
      </div>

      <h3 className="text-2xl font-bold text-white mb-4 border-b-2 border-cyan-500/30 pb-2">Stories from the Code</h3>
      <div className="space-y-8 mt-6">
        {content.stories.map((story, index) => (
          <div key={index} className="bg-gray-900/50 rounded-lg p-6 ring-1 ring-gray-700">
            <h4 className="text-xl font-semibold text-cyan-300 mb-2">{story.title}</h4>
            <p className="text-gray-300 mb-4">{story.narrative}</p>
            <blockquote className="border-l-4 border-cyan-500 pl-4 py-2 bg-gray-800/50 rounded-r-md">
              <p className="text-gray-200 italic">"{story.quote}"</p>
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaximDetail;
