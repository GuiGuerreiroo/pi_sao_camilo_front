import { useState, useEffect } from 'react';

// Tipagem exata do que a Open-Meteo retorna para o current
export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  is_day: number;
  time: string;
  relative_humidity: number;
}

export function useWeather(latitude: number | null | undefined, longitude: number | null | undefined) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude == null || longitude == null) {
      setLoading(true);
      return;
    }

    async function fetchWeather() {
      try {
        setLoading(true);
        // open-meteo api com parâmetros atuais e relativos
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day`
        );
        
        if (!response.ok) throw new Error('Erro ao buscar dados climáticos');
        
        const data = await response.json();
        const current = data.current;
        setWeather({
          temperature: current.temperature_2m,
          windspeed: current.wind_speed_10m,
          weathercode: current.weather_code,
          is_day: current.is_day,
          time: current.time,
          relative_humidity: current.relative_humidity_2m,
        });

      } catch (err: any) {
        setError(err.message);
        console.log("Ocorreu um erro" + err)
        
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [latitude, longitude]);

  return { weather, loading, error };
}