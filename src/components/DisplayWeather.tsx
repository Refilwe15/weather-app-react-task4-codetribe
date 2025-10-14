import React, { useEffect, useState } from "react";
import axios from "axios";
import { WiHumidity } from "react-icons/wi";
import { MdNotificationsActive } from "react-icons/md";
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
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
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
  const [offline, setOffline] = useState(false);
  const [savedCities, setSavedCities] = useState<string[]>([]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Cache weather data
  const cacheWeather = (data: WeatherData, forecast: HourlyData[]) => {
    localStorage.setItem("weatherCache", JSON.stringify({ weather: data, forecast }));
  };

  const loadCachedWeather = () => {
    const cached = localStorage.getItem("weatherCache");
    if (cached) {
      const parsed = JSON.parse(cached);
      setWeather(parsed.weather);
      setHourly(parsed.forecast || []);
      setOffline(true);
    }
  };

  // Save city to favorites
  const saveLocation = () => {
    if (!weather) return;
    const cityName = weather.name;
    if (!savedCities.includes(cityName)) {
      const updated = [...savedCities, cityName];
      setSavedCities(updated);
      localStorage.setItem("savedCities", JSON.stringify(updated));
    }
  };

  // Load saved cities from storage
  useEffect(() => {
    const stored = localStorage.getItem("savedCities");
    if (stored) setSavedCities(JSON.parse(stored));
  }, []);

  const getWeatherIcon = (icon: string) => {
    if (!icon) return <FaCloud />;
    if (icon.startsWith("01")) return <FaSun className="text-yellow-400" />;
    if (icon.startsWith("02")) return <FaCloudSun className="text-yellow-300" />;
    if (icon.startsWith("03") || icon.startsWith("04")) return <FaCloud className="text-gray-400" />;
    if (icon.startsWith("09") || icon.startsWith("10")) return <FaCloudRain className="text-blue-400" />;
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
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
      );

      const mappedHourly = forecastRes.data.list.slice(0, 12).map((h: any) => ({
        dt: h.dt,
        temp: h.main.temp,
        weather: h.weather,
      }));

      setWeather(weatherRes.data);
      setHourly(mappedHourly);
      cacheWeather(weatherRes.data, mappedHourly);
      setOffline(false);
    } catch (err) {
      console.error("API error, loading cached data...", err);
      loadCachedWeather();
    }
  };

  const fetchWeatherByCity = async (cityName: string) => {
    if (!cityName) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${api_key}`
      );
      const coords = res.data.coord;
      await fetchWeatherByCoords(coords.lat, coords.lon);
      setCity("");
    } catch {
      alert("City not found. Loading cached data if available.");
      loadCachedWeather();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.onLine) {
      console.warn("Offline mode: loading cached data...");
      loadCachedWeather();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        console.warn("Geolocation not allowed, loading cached data...");
        loadCachedWeather();
      }
    );
  }, []);

  const formatHour = (dt: number) => {
    const date = new Date(dt * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`min-h-screen w-screen flex flex-col items-center font-mono transition-colors ${
        darkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-gray-900"
      }`}
    >
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className={`absolute top-5 right-5 p-3 rounded-full shadow hover:scale-105 transition ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-800"
        }`}
      >
        {darkMode ? <FaMoon size={22} /> : <FaSun size={22} />}
      </button>

      {/* Search Section */}
      <div className="flex items-center gap-3 p-4 w-full max-w-[800px] mt-8">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`flex-1 p-3 rounded-lg border text-lg focus:outline-none focus:ring-2 transition ${
            darkMode
              ? "border-gray-700 bg-gray-800 text-gray-100 focus:ring-blue-400"
              : "border-gray-300 bg-white text-gray-900 focus:ring-blue-400"
          }`}
        />
        <button
          onClick={() => fetchWeatherByCity(city)}
          className={`p-3 rounded-full transition ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <FaSearch size={20} />
        </button>
      </div>

      {/* Saved Locations */}
      {savedCities.length > 0 && (
        <div className="mt-3 text-center">
          <p className="text-sm mb-2">Saved Cities:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {savedCities.map((cityName) => (
              <button
                key={cityName}
                onClick={() => fetchWeatherByCity(cityName)}
                className={`px-3 py-1 rounded-full text-sm ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                    : "bg-blue-200 hover:bg-blue-300 text-gray-900"
                }`}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Weather */}
      <div className="text-center space-y-4 p-4 w-full max-w-[800px]">
        {loading ? (
          <h2 className="text-gray-500">Loading...</h2>
        ) : weather ? (
          <>
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <FaMapMarkerAlt />
              {weather.name}, {weather.sys.country}
              <button
                onClick={saveLocation}
                className="ml-2 hover:scale-110 transition"
              >
                {savedCities.includes(weather.name) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-400" />
                )}
              </button>
            </h1>

            <div className="flex justify-center text-7xl my-4">
              {getWeatherIcon(weather.weather[0].icon)}
            </div>

            <h1 className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</h1>
            <h2 className="capitalize text-xl">{weather.weather[0].description}</h2>

            {offline && (
              <p className="text-red-500 text-sm font-semibold">Offline Mode (Cached)</p>
            )}
          </>
        ) : (
          <h2 className="text-gray-500">Search a city or enable location</h2>
        )}
      </div>

      {/* Buttons (Hourly / Daily) */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          className={`font-bold text-2xl px-5 py-2 rounded-md transition-all ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
              : "bg-blue-400 hover:bg-blue-500 text-white"
          }`}
        >
          Hourly
        </button>
        <button
          className={`font-bold text-2xl px-5 py-2 rounded-md transition-all ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
              : "bg-blue-400 hover:bg-blue-500 text-white"
          }`}
        >
          Daily
        </button>
      </div>

      {/* Hourly Forecast Grid */}
      {hourly.length > 0 && (
        <div className="mt-8 p-4 w-full max-w-[800px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {hourly.slice(0, 8).map((h) => (
            <div
              key={h.dt}
              className={`flex flex-col items-center p-4 rounded-lg transition ${
                darkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-blue-100 text-gray-900"
              }`}
            >
              <span className="text-lg mb-2">{formatHour(h.dt)}</span>
              <div className="text-4xl mb-2">{getWeatherIcon(h.weather[0].icon)}</div>
              <span className="font-bold text-xl">{Math.round(h.temp)}°C</span>
              <span className="text-sm capitalize text-center">{h.weather[0].description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayWeather;
