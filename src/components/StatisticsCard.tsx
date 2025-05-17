import React from 'react';
import { StatisticCardProps } from '../types/types';

const StatisticsCard: React.FC<StatisticCardProps> = ({ 
  title, 
  value, 
  percentage, 
  color, 
  textColor 
}) => {
  const isPositive = percentage.startsWith('+');
  
  return (
    <div className={`${color} rounded-lg overflow-hidden shadow transition-transform duration-300 hover:transform hover:scale-105`}>
      <div className="flex justify-between items-center p-4">
        <div>
          <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
          <p className="text-sm text-gray-600">
            {isPositive ? (
              <span className="text-red-600">{percentage}</span>
            ) : (
              <span className="text-green-600">{percentage}</span>
            )}
          </p>
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default StatisticsCard;