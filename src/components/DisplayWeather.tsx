import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faWind,
  faDroplet,
  faMoon,
  faSun,
  faCloud,
  faCloudSun,
  faCloudRain,
  faSnowflake,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

// Weather data type
type WeatherData = {
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
};

const DisplayWeather: React.FC = () => {
  const api_key = "a48bbc5ec6c9320927fdbe9bc68ed148";

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Map OpenWeather icons to Font Awesome
  const getWeatherIcon = (icon: string) => {
    if (icon.startsWith("01")) return faSun;
    if (icon.startsWith("02")) return faCloudSun;
    if (icon.startsWith("03") || icon.startsWith("04")) return faCloud;
    if (icon.startsWith("09") || icon.startsWith("10")) return faCloudRain;
    if (icon.startsWith("11")) return faBolt;
    if (icon.startsWith("13")) return faSnowflake;
    if (icon.startsWith("50")) return faCloud; // mist/fog
    return faCloud;
  };

  // Fetch weather by coordinates
  const fetchCurrentWeather = async (lat: number, lon: number) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    const response = await axios.get(url);
    return response.data;
  };

  // Fetch weather by city
  const fetchWeatherByCity = async (cityName: string) => {
    if (!cityName) return;
    setLoading(true);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${api_key}`;
      const response = await axios.get(url);
      setWeather(response.data);
      setCity("");
    } catch (error) {
      alert("City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load current location weather
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchCurrentWeather(latitude, longitude).then((data) =>
        setWeather(data)
      );
    });
  }, []);

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen`}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-700 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 space-y-6 text-gray-900 dark:text-gray-100 relative">
          {/* Toggle button */}
          <button
            onClick={toggleDarkMode}
            className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-full shadow hover:scale-105 transition"
          >
            <FontAwesomeIcon icon={darkMode ? faMoon : faSun} />
          </button>

          {/* Search Area */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => fetchWeatherByCity(city)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>

          {/* Weather Info */}
          <div className="text-center space-y-2">
            {loading ? (
              <h2 className="text-gray-500">Searching...</h2>
            ) : weather ? (
              <>
                <h1 className="text-2xl font-bold">{weather.name}</h1>
                <span className="text-gray-600 dark:text-gray-400">
                  {weather.sys.country}
                </span>
                <div className="flex justify-center text-5xl my-2">
                  <FontAwesomeIcon
                    icon={getWeatherIcon(weather.weather[0].icon)}
                    className="text-blue-500"
                  />
                </div>
                <h1 className="text-4xl font-bold">
                  {Math.round(weather.main.temp)}°C
                </h1>
                <h2 className="capitalize text-gray-700 dark:text-gray-300">
                  {weather.weather[0].description}
                </h2>
              </>
            ) : (
              <h2 className="text-gray-500">Loading...</h2>
            )}
          </div>

          {/* Bottom Info */}
          {weather && (
            <div className="flex justify-around mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faDroplet}
                  className="text-blue-500 text-xl"
                />
                <div>
                  <h1 className="font-bold">{weather.main.humidity}%</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Humidity
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faWind}
                  className="text-blue-500 text-xl"
                />
                <div>
                  <h1 className="font-bold">{weather.wind.speed} km/h</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Wind Speed
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayWeather;
