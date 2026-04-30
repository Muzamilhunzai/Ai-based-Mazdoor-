'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar({ onSearch, showFilters = false }) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({ category: '', minRating: 0, maxPrice: '', verifiedOnly: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch(query, filters);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for plumber, electrician... / پلمبر، الیکٹریشن..."
            className="input-field pl-12"
          />
        </div>
        {showFilters && (
          <button type="button" onClick={() => setExpanded(!expanded)} className="px-3 py-3 glass-card hover:bg-gray-50">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}
        <button type="submit" className="btn-primary">Search <span className="font-urdu text-sm mr-2">تلاش</span></button>
      </form>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-2 gap-4 mt-4 p-4 glass-card">
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} className="input-field">
              <option value="">All</option>
              <option value="plumber">Plumber</option>
              <option value="electrician">Electrician</option>
              <option value="carpenter">Carpenter</option>
              <option value="painter">Painter</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Max Price (Rs/hr)</label>
            <input type="number" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Min Rating</label>
            <select value={filters.minRating} onChange={e => setFilters({...filters, minRating: Number(e.target.value)})} className="input-field">
              <option value="0">Any</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mt-5">
            <input type="checkbox" checked={filters.verifiedOnly} onChange={e => setFilters({...filters, verifiedOnly: e.target.checked})} id="verified" />
            <label htmlFor="verified" className="text-sm">Verified Only</label>
          </div>
        </div>
      </motion.div>
    </div>
  );
}