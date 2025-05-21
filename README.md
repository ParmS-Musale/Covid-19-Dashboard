# COVID-19 Dashboard

A responsive COVID-19 dashboard built with React.js that visualizes pandemic statistics with interactive charts, showing total cases, recoveries, and deaths by country.


## Features

* **Real-time COVID-19 statistics** - View up-to-date numbers for cases, recoveries, and deaths
* **Country selection** - Choose from a dropdown list of countries to view specific data
* **Interactive charts** - Visualize data through:
  * Line chart showing historical trends
  * Bar chart displaying monthly cases
  * Pie chart illustrating current status distribution
* **Responsive design** - Works seamlessly across desktop and mobile devicess

## APIs Used

The dashboard integrates two RESTful APIs:

1. **COVID-19 Data API**
   * Endpoint: `https://disease.sh/v3/covid-19/historical/{country}?lastdays=1500`
   * Purpose: Fetches historical COVID-19 data for the selected country

2. **Country List API**
   * Endpoint: `https://restcountries.com/v3.1/all`
   * Purpose: Retrieves list of countries for the dropdown menu

## Tech Stack

* **React.js** - Frontend library
* **Recharts** - For creating interactive charts
* **Lucide React** - For icons
* **Lodash** - For data manipulation
* **Tailwind CSS** - For styling

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/covid-dashboard.git
   cd covid-dashboard