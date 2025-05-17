import React, { useState, useRef, useEffect } from 'react';
import { Country } from '../types/types';
import { Search, ChevronDown, X } from 'lucide-react';

interface CountrySelectorProps {
  countries: Country[];
  selectedCountry: Country | null;
  onChange: (country: Country) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ 
  countries, 
  selectedCountry, 
  onChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCountry) {
      setSearchTerm(selectedCountry.name.common);
    }
  }, [selectedCountry]);

  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectCountry = (country: Country) => {
    onChange(country);
    setIsOpen(false);
    setSearchTerm(country.name.common);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex items-center justify-between bg-white p-3 rounded-full shadow cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center flex-1">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <input 
            type="text"
            className="outline-none w-full"
            placeholder="Search Country"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          />
        </div>
        {searchTerm && (
          <X 
            className="h-5 w-5 text-gray-400 mr-2 cursor-pointer hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              clearSearch();
            }}
          />
        )}
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredCountries.length === 0 ? (
            <div className="px-4 py-3 text-gray-500">No countries found</div>
          ) : (
            filteredCountries.map(country => (
              <div 
                key={country.cca3} 
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleSelectCountry(country)}
              >
                <img 
                  src={country.flags.png} 
                  alt={`${country.name.common} flag`} 
                  className="w-6 h-4 mr-3"
                />
                <span>{country.name.common}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CountrySelector;