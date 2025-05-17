import React, { useState } from 'react';
import { DateRange } from '../types/types';
import { Calendar, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

interface DateRangeFilterProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ dateRange, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const predefinedRanges = [
    { label: 'Last 6 months', start: new Date(new Date().setMonth(new Date().getMonth() - 6)), end: new Date() },
    { label: 'Last year', start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), end: new Date() },
    { label: 'Last 2 years', start: new Date(new Date().setFullYear(new Date().getFullYear() - 2)), end: new Date() },
    { label: 'Last 3 years', start: new Date(new Date().setFullYear(new Date().getFullYear() - 3)), end: new Date() },
    { label: 'All time', start: new Date('2019-01-01'), end: new Date() }
  ];
  
  const handleRangeSelect = (range: DateRange) => {
    onChange(range);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Filter by Date Range:</span>
      </div>
      <div 
        className="flex items-center justify-between bg-white p-3 rounded-full shadow cursor-pointer mt-1"
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
          <span>
            {format(dateRange.start, 'dd-MM-yyyy')} - {format(dateRange.end, 'dd-MM-yyyy')}
          </span>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg">
          {predefinedRanges.map((range, index) => (
            <div 
              key={index} 
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleRangeSelect(range)}
            >
              {range.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;