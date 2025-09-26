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
};

type HourlyData = {
  dt: number;
  temp: number;
  weather: { icon: string; description: string }[];
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
    if (icon.startsWith("01")) return <FaSun />;
    if (icon.startsWith("02")) return <FaCloudSun />;
    if (icon.startsWith("03") || icon.startsWith("04")) return <FaCloud />;
    if (icon.startsWith("09") || icon.startsWith("10")) return <FaCloudRain />;
    if (icon.startsWith("11")) return <FaBolt />;
    if (icon.startsWith("13")) return <FaSnowflake />;
    if (icon.startsWith("50")) return <FaCloud />;
    return <FaCloud />;
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
      );
      setWeather(weatherRes.data);

      const hourlyRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&units=metric&appid=${api_key}`
      );
      setHourly(hourlyRes.data.hourly.slice(0, 12));
    } catch (err) {
      console.error("Error fetching weather:", err);
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
      () => {
        console.warn("Geolocation not allowed");
      }
    );
  }, []);

  const formatHour = (dt: number) => {
    const date = new Date(dt * 1000);
    return date.getHours() + ":00";
  };

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen transition-colors`}>
      <div
        className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 to-gray-800"
            : "bg-gradient-to-br from-blue-400 to-blue-700"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-2xl shadow-xl p-6 space-y-6 relative transition-colors ${
            darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
          }`}
        >
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className={`absolute top-4 right-4 p-2 rounded-full shadow hover:scale-105 transition ${
              darkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {darkMode ? <FaMoon /> : <FaSun />}
          </button>

          {/* Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 transition ${
                darkMode
                  ? "border-gray-700 bg-gray-800 text-gray-100 focus:ring-blue-400"
                  : "border-gray-300 bg-gray-50 text-gray-900 focus:ring-blue-400"
              }`}
            />
            <button
              onClick={() => fetchWeatherByCity(city)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
            >
              <FaSearch />
            </button>
          </div>

          {/* Weather info */}
          <div className="text-center space-y-2">
            {loading ? (
              <h2 className="text-gray-500">Loading...</h2>
            ) : weather ? (
              <>
                <h1 className="text-2xl font-bold">{weather.name}</h1>
                <span
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {weather.sys.country}
                </span>
                <div className="flex justify-center text-5xl my-2">
                  {getWeatherIcon(weather.weather[0].icon)}
                </div>
                <h1 className="text-4xl font-bold">
                  {Math.round(weather.main.temp)}°C
                </h1>
                <h2
                  className={`capitalize ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {weather.weather[0].description}
                </h2>
              </>
            ) : (
              <h2 className="text-gray-500">Search a city or enable geolocation</h2>
            )}
          </div>

          {/* Bottom info */}
          {weather && (
            <div className="flex justify-around mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <WiHumidity className="text-blue-500 text-xl h-13 w-13" />
                <div>
                  <h1 className="font-bold">{weather.main.humidity}%</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Humidity</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaWind className="text-blue-500 text-3xl" />
                <div>
                  <h1 className="font-bold">{weather.wind.speed} km/h</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Wind Speed
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hourly forecast */}
          {hourly.length > 0 && (
            <div className="mt-6 overflow-x-auto flex gap-4 text-center">
              {hourly.map((h) => (
                <div
                  key={h.dt}
                  className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] transition-colors ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <span className="text-sm">{formatHour(h.dt)}</span>
                  <span className="text-xl font-bold">{Math.round(h.temp)}°C</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayWeather;
