import React, { useEffect, useState } from "react";
import axios from "axios";
import { WiHumidity } from "react-icons/wi";
import {
  FaWind,
  FaSun,
  FaCloud,
  FaCloudSun,
  FaCloudRain,
  FaSnowflake,
  FaBolt,
  FaSearch,
  FaMoon,
} from "react-icons/fa";

type WeatherData = {
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
  coord: { lat: number; lon: number };
};

type HourlyData = {
  dt: number;
  temp: number;
  weather: { description: string; icon: string }[];
};

const DisplayWeather: React.FC = () => {
  const api_key = "a48bbc5ec6c9320927fdbe9bc68ed148";

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourly, setHourly] = useState<HourlyData[]>([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const getWeatherIcon = (icon: string) => {
    if (!icon) return <FaCloud />;
    if (icon.startsWith("01")) return <FaSun className="text-yellow-400" />;
    if (icon.startsWith("02")) return <FaCloudSun className="text-yellow-300" />;
    if (icon.startsWith("03") || icon.startsWith("04"))
      return <FaCloud className="text-gray-400" />;
    if (icon.startsWith("09") || icon.startsWith("10"))
      return <FaCloudRain className="text-blue-400" />;
    if (icon.startsWith("11")) return <FaBolt className="text-yellow-500" />;
    if (icon.startsWith("13")) return <FaSnowflake className="text-blue-200" />;
    if (icon.startsWith("50")) return <FaCloud className="text-gray-300" />;
    return <FaCloud />;
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
      );
      setWeather(weatherRes.data);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
      );

      const mappedHourly = forecastRes.data.list.slice(0, 12).map((h: any) => ({
        dt: h.dt,
        temp: h.main.temp,
        weather: h.weather,
      }));

      setHourly(mappedHourly);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeatherByCity = async (cityName: string) => {
    if (!cityName) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${api_key}`
      );
      setWeather(res.data);
      setCity("");
      fetchWeatherByCoords(res.data.coord.lat, res.data.coord.lon);
    } catch {
      alert("City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => console.warn("Geolocation not allowed")
    );
  }, []);

  const formatHour = (dt: number) => {
    const date = new Date(dt * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} transition-colors w-full`}>
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className={`absolute top-5 right-5 p-3 rounded-full shadow hover:scale-105 transition ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-800"
        }`}
      >
        {darkMode ? <FaMoon size={22} /> : <FaSun size={22} />}
      </button>

      {/* Search */}
      <div className="flex items-center gap-3 p-4">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`flex-1 p-3 rounded-lg border text-lg focus:outline-none focus:ring-2 transition ${
            darkMode
              ? "border-gray-700 bg-gray-800 text-gray-100 focus:ring-blue-400"
              : "border-gray-300 bg-gray-50 text-gray-900 focus:ring-blue-400"
          }`}
        />
        <button
          onClick={() => fetchWeatherByCity(city)}
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition"
        >
          <FaSearch size={20} />
        </button>
      </div>

      {/* Current weather info */}
      <div className="text-center space-y-4 p-4">
        {loading ? (
          <h2 className="text-gray-500">Loading...</h2>
        ) : weather ? (
          <>
            <h1 className="text-3xl font-bold">{weather.name}</h1>
            <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-lg`}>
              {weather.sys.country}
            </span>
            <div className="flex justify-center text-7xl my-4">
              {getWeatherIcon(weather.weather[0].icon)}
            </div>
            <h1 className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</h1>
            <h2 className={`capitalize text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {weather.weather[0].description}
            </h2>
          </>
        ) : (
          <h2 className="text-gray-500">Search a city or enable geolocation</h2>
        )}
      </div>

      {/* Bottom info */}
      {weather && (
        <div className="flex justify-around mt-6 border-t pt-6 border-gray-200 dark:border-gray-900 p-4">
          <div className="flex items-center gap-3">
            <WiHumidity className="text-blue-500 text-3xl h-12 w-12" />
            <div>
              <h1 className="font-bold text-xl">{weather.main.humidity}%</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Humidity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaWind className="text-blue-500 text-3xl h-12 w-12" />
            <div>
              <h1 className="font-bold text-xl">{weather.wind.speed} km/h</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm ">Wind Speed</p>
            </div>
          </div>
        </div>
      )}

      {/* Hourly forecast */}
      {hourly.length > 0 && (
        <div className="mt-8 p-4">
          <h2 className="font-bold text-2xl mb-4">Hourly Forecast</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
            {hourly.slice(0, 8).map((h) => (
              <div
                key={h.dt}
                className={`flex-shrink-0 w-36 flex flex-col items-center p-4 transition-colors ${
                  darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
                }`}
              >
                <span className="text-lg mb-2">{formatHour(h.dt)}</span>
                <div className="text-4xl mb-2">{getWeatherIcon(h.weather[0].icon)}</div>
                <span className="font-bold text-xl">{Math.round(h.temp)}°C</span>
                <span className="text-sm capitalize text-center">{h.weather[0].description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayWeather;
