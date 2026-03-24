import { getCapitalInfo } from './capitals'

export interface WeatherData {
  temperature: number
  capital: string
  emoji: string
  description: string
}

/**
 * Maps WMO weather codes to emoji + description.
 * See https://open-meteo.com/en/docs → weathercode
 */
function weatherCodeToInfo(code: number): { emoji: string; description: string } {
  if (code === 0) return { emoji: '☀️', description: 'Clear sky' }
  if (code <= 3) return { emoji: '⛅', description: 'Partly cloudy' }
  if (code <= 49) return { emoji: '🌫️', description: 'Foggy' }
  if (code <= 59) return { emoji: '🌧️', description: 'Drizzle' }
  if (code <= 69) return { emoji: '🌧️', description: 'Rainy' }
  if (code <= 79) return { emoji: '❄️', description: 'Snowy' }
  if (code <= 84) return { emoji: '🌧️', description: 'Rain showers' }
  if (code <= 86) return { emoji: '❄️', description: 'Snow showers' }
  if (code <= 99) return { emoji: '⛈️', description: 'Thunderstorm' }
  return { emoji: '☁️', description: 'Cloudy' }
}

export async function fetchWeather(countryName: string): Promise<WeatherData> {
  const info = getCapitalInfo(countryName)
  if (!info) {
    throw new Error(`No capital data for ${countryName}`)
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${info.lat}&longitude=${info.lon}&current_weather=true`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`)
  }

  const data = await res.json()
  const current = data.current_weather
  const { emoji, description } = weatherCodeToInfo(current.weathercode)

  return {
    temperature: Math.round(current.temperature),
    capital: info.capital,
    emoji,
    description,
  }
}
