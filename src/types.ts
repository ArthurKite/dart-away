import type { WeatherData } from './utils/weather'

export interface HistoryEntry {
  id: number
  country: string
  countryCode: string | null
  weather: WeatherData | null
  funFact: string | null
  slackMessage: string | null
  isRepeat: boolean
  timestamp: number
}
