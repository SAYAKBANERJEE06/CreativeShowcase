
import React from 'react';
import { Artwork } from '../types';
import { Link } from 'react-router-dom';

interface MasonryGridProps {
  artworks: Artwork[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ artworks }) => {
  if (artworks.length === 0) {
    return (
      <div className="text-center py-20 bg-stone-100 rounded-3xl">
        <i className="fa-solid fa-cloud-moon text-4xl text-stone-300 mb-4"></i>
        <p className="text-stone-500">No masterpieces here yet.</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {artworks.map((art) => (
        <div 
          key={art.id} 
          className="break-inside-avoid group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100"
        >
          <img 
            src={art.imageUrl} 
            alt={art.title} 
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="p-4">
            <h3 className="font-semibold text-stone-800 text-lg">{art.title}</h3>
            <p className="text-sm text-stone-500 mb-2">{art.description}</p>
            <div className="flex items-center justify-between mt-4">
              <Link 
                to={`/profile/${art.username}`} 
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <i className="fa-solid fa-user text-[10px]"></i>
                {art.username}
              </Link>
              <span className="text-[10px] text-stone-400">
                {new Date(art.createdAt).toLocaleDateString()}
              </span>
            </div>
            {art.critique && (
              <div className="mt-3 pt-3 border-t border-stone-100 italic text-[11px] text-stone-500 leading-relaxed">
                <span className="font-bold text-stone-700 not-italic mr-1">AI Critique:</span>
                "{art.critique}"
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
