import React, { useState, useEffect } from 'react';
import CountrySelector from './CountrySelector';
import DateRangeFilter from './DateRangeFilter';
import StatisticsCard from './StatisticsCard';
import LineChartComponent from './LineChart';
import PieChartComponent from './PieChart';
import { fetchCountries, fetchCovidData, fetchCovidSummary } from '../services/api';
import { Country, DateRange } from '../types/types';
import { formatNumber, calculatePercentage, prepareChartData, preparePieChartData } from '../utils/formatters';
import { Activity } from 'lucide-react';
import { sub } from 'date-fns';

const Dashboard: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: sub(new Date(), { years: 3 }),
    end: new Date()
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    cases: { value: 0, percentage: '0.00%' },
    deaths: { value: 0, percentage: '0.00%' },
    recovered: { value: 0, percentage: '0.00%' }
  });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await fetchCountries();
        setCountries(data);
        
        // Set default country to USA
        const usa = data.find(country => country.cca3 === 'USA');
        if (usa) {
          setSelectedCountry(usa);
        }
      } catch (err) {
        setError('Failed to load countries. Please try again.');
        setLoading(false);
      }
    };
    
    loadCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      loadCovidData(selectedCountry.cca3);
    }
  }, [selectedCountry, dateRange]);

  const loadCovidData = async (countryCode: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [historicalData, summaryData] = await Promise.all([
        fetchCovidData(countryCode),
        fetchCovidSummary(countryCode)
      ]);

      // Check if data is available for the country
      if (!historicalData || !summaryData) {
        setError(`COVID-19 data is not available for ${selectedCountry?.name.common || countryCode}`);
        setLoading(false);
        return;
      }
      
      // Process data for statistics cards
      const { cases, deaths, recovered } = historicalData.timeline;
      
      // Get the latest values
      const latestCases = Object.values(cases).pop() || 0;
      const latestDeaths = Object.values(deaths).pop() || 0;
      const latestRecovered = Object.values(recovered).pop() || 0;
      
      // Get the previous values (one month ago or earliest available)
      const caseEntries = Object.entries(cases);
      const deathsEntries = Object.entries(deaths);
      const recoveredEntries = Object.entries(recovered);
      
      const prevCases = caseEntries.length > 30 ? caseEntries[caseEntries.length - 30][1] : caseEntries[0][1];
      const prevDeaths = deathsEntries.length > 30 ? deathsEntries[deathsEntries.length - 30][1] : deathsEntries[0][1];
      const prevRecovered = recoveredEntries.length > 30 ? recoveredEntries[recoveredEntries.length - 30][1] : recoveredEntries[0][1];
      
      setStats({
        cases: { 
          value: latestCases, 
          percentage: calculatePercentage(latestCases, prevCases) 
        },
        deaths: { 
          value: latestDeaths, 
          percentage: calculatePercentage(latestDeaths, prevDeaths) 
        },
        recovered: { 
          value: latestRecovered, 
          percentage: calculatePercentage(latestRecovered, prevRecovered) 
        }
      });
      
      // Prepare line chart data
      const lineChartData = prepareChartData(
        cases,
        deaths,
        recovered,
        dateRange.start,
        dateRange.end
      );
      setChartData(lineChartData);
      
      // Prepare pie chart data
      const pieChartData = preparePieChartData(
        selectedCountry.population,
        latestCases,
        latestDeaths,
        latestRecovered
      );
      setPieData(pieChartData);
      
      setLoading(false);
    } catch (err) {
      setError(`Failed to load COVID-19 data for ${countryCode}. Please try again.`);
      setLoading(false);
    }
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 flex items-center justify-center">
        <Activity className="mr-2" /> COVID-19 and Population Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <CountrySelector 
            countries={countries} 
            selectedCountry={selectedCountry} 
            onChange={handleCountryChange} 
          />
        </div>
        <div>
          <DateRangeFilter 
            dateRange={dateRange} 
            onChange={handleDateRangeChange} 
          />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatisticsCard 
              title="Total Cases" 
              value={formatNumber(stats.cases.value)} 
              percentage={stats.cases.percentage}
              color="bg-violet-200"
              textColor="text-violet-800"
            />
            <StatisticsCard 
              title="Recoveries" 
              value={formatNumber(stats.recovered.value)} 
              percentage={stats.recovered.percentage}
              color="bg-green-200"
              textColor="text-green-800"
            />
            <StatisticsCard 
              title="Deaths" 
              value={formatNumber(stats.deaths.value)} 
              percentage={stats.deaths.percentage}
              color="bg-red-200"
              textColor="text-red-800"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Line Chart</h2>
              <LineChartComponent data={chartData} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Pie Chart</h2>
              <PieChartComponent 
                data={pieData} 
                population={selectedCountry?.population || 0} 
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;