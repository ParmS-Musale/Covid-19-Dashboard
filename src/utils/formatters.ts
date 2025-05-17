import { ChartData, PieChartData } from '../types/types';
import { format, parse, isWithinInterval } from 'date-fns';

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const calculatePercentage = (current: number, previous: number): string => {
  if (previous === 0) return '0.00%';
  const percentage = ((current - previous) / previous) * 100;
  return percentage >= 0 ? `+${percentage.toFixed(2)}%` : `${percentage.toFixed(2)}%`;
};

export const processTimelineData = (
  data: Record<string, number>,
  startDate: Date,
  endDate: Date
): [ChartData[], number] => {
  const chartData: ChartData[] = [];
  let latestValue = 0;
  
  Object.entries(data).forEach(([dateStr, value]) => {
    const date = parse(dateStr, 'M/d/yy', new Date());
    
    if (isWithinInterval(date, { start: startDate, end: endDate })) {
      latestValue = value;
      chartData.push({
        date: format(date, 'yyyy'),
        value,
      });
    }
  });
  
  return [chartData, latestValue];
};

export const prepareChartData = (
  cases: Record<string, number>,
  deaths: Record<string, number>,
  recovered: Record<string, number>,
  startDate: Date,
  endDate: Date
): ChartData[] => {
  const combinedData: Record<string, ChartData> = {};
  
  // Process cases
  Object.entries(cases).forEach(([dateStr, value]) => {
    const date = parse(dateStr, 'M/d/yy', new Date());
    const yearStr = format(date, 'yyyy');
    
    if (isWithinInterval(date, { start: startDate, end: endDate })) {
      if (!combinedData[yearStr]) {
        combinedData[yearStr] = {
          date: yearStr,
          cases: 0,
          deaths: 0,
          recovered: 0
        };
      }
      combinedData[yearStr].cases = value;
    }
  });
  
  // Process deaths
  Object.entries(deaths).forEach(([dateStr, value]) => {
    const date = parse(dateStr, 'M/d/yy', new Date());
    const yearStr = format(date, 'yyyy');
    
    if (isWithinInterval(date, { start: startDate, end: endDate })) {
      if (combinedData[yearStr]) {
        combinedData[yearStr].deaths = value;
      }
    }
  });
  
  // Process recovered
  Object.entries(recovered).forEach(([dateStr, value]) => {
    const date = parse(dateStr, 'M/d/yy', new Date());
    const yearStr = format(date, 'yyyy');
    
    if (isWithinInterval(date, { start: startDate, end: endDate })) {
      if (combinedData[yearStr]) {
        combinedData[yearStr].recovered = value;
      }
    }
  });
  
  return Object.values(combinedData).sort((a, b) => 
    parseInt(a.date) - parseInt(b.date)
  );
};

export const preparePieChartData = (
  totalPopulation: number,
  cases: number,
  deaths: number,
  recovered: number
): PieChartData[] => {
  const activeCases = cases - deaths - recovered;
  const unaffected = totalPopulation - cases;
  
  return [
    {
      name: 'Unaffected',
      value: unaffected,
      color: '#FBEC85'
    },
    {
      name: 'Active',
      value: activeCases,
      color: '#B8B5FF'
    },
    {
      name: 'Recovered',
      value: recovered,
      color: '#4ADE80'
    },
    {
      name: 'Deaths',
      value: deaths,
      color: '#FD6E6A'
    }
  ];
};