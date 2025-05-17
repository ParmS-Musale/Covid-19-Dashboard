export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca3: string;
  flags: {
    svg: string;
    png: string;
  };
  population: number;
}

export interface CovidData {
  country: string;
  timeline: {
    cases: Record<string, number>;
    deaths: Record<string, number>;
    recovered: Record<string, number>;
  };
}

export interface StatisticCardProps {
  title: string;
  value: string;
  percentage: string;
  color: string;
  textColor: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ChartData {
  date: string;
  cases: number;
  deaths: number;
  recovered: number;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}