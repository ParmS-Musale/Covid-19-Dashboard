import axios from 'axios';
import { CovidData, Country } from '../types/types';

const COVID_API_BASE_URL = 'https://disease.sh/v3/covid-19';
const COUNTRIES_API_URL = 'https://restcountries.com/v3.1/all';

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await axios.get(COUNTRIES_API_URL, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please check your internet connection.');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
    }
    throw new Error('Failed to load countries. Please try again.');
  }
};

export const fetchCovidData = async (countryCode: string): Promise<CovidData | null> => {
  try {
    const response = await axios.get(
      `${COVID_API_BASE_URL}/historical/${countryCode}?lastdays=1500`,
      {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching COVID data for ${countryCode}:`, error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const fetchCovidSummary = async (countryCode: string) => {
  try {
    const response = await axios.get(
      `${COVID_API_BASE_URL}/countries/${countryCode}`,
      {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching COVID summary for ${countryCode}:`, error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};