import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import axios from "axios";

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
  const [city, setCity] = useState(""); // input state
  const [loading, setLoading] = useState(false);

  // Fetch weather by coordinates
  const fetchCurrentWeather = async (lat: number, lon: number) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    const response = await axios.get(url);
    return response.data;
  };

  // Fetch weather by city name
  const fetchWeatherByCity = async (cityName: string) => {
    if (!cityName) return;
    setLoading(true);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${api_key}`;
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (error) {
      alert("City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // On mount → detect user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchCurrentWeather(latitude, longitude).then((data) =>
        setWeather(data)
      );
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-700 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">
        {/* Search Area */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => fetchWeatherByCity(city)}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
          >
            <AiOutlineSearch className="w-5 h-5" />
          </button>
        </div>

        {/* Weather Info */}
        <div className="text-center space-y-2">
          {loading ? (
            <h2 className="text-gray-500">Searching...</h2>
          ) : weather ? (
            <>
              <h1 className="text-2xl font-bold">{weather.name}</h1>
              <span className="text-gray-600">{weather.sys.country}</span>
              <div className="flex justify-center">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
              </div>
              <h1 className="text-4xl font-bold">
                {Math.round(weather.main.temp)}°C
              </h1>
              <h2 className="capitalize text-gray-700">
                {weather.weather[0].description}
              </h2>
            </>
          ) : (
            <h2 className="text-gray-500">Loading...</h2>
          )}
        </div>

        {/* Bottom Info */}
        {weather && (
          <div className="flex justify-around mt-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <WiHumidity className="w-15 h-15 text-blue-500" />
              <div>
                <h1 className="font-bold">{weather.main.humidity}%</h1>
                <p className="text-gray-500 text-sm">Humidity</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaWind className="w-10 h-10 text-blue-500" />
              <div>
                <h1 className="font-bold">{weather.wind.speed} km/h</h1>
                <p className="text-gray-500 text-sm">Wind Speed</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayWeather;
