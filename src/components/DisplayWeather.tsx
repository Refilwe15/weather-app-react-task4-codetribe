import React, { useEffect, useState } from "react";
import { MainWrapper } from "./styles.module"; // ✅ don't use styles.module with styled-components
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

  const fetchCurrentWeather = async (lat: number, lon: number) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    const response = await axios.get(url);
    return response.data;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchCurrentWeather(latitude, longitude).then((data) => {
        setWeather(data);
      });
    });
  }, []);

  return (
    <MainWrapper>
      <div className="container">
        {/* Search Area */}
        <div className="searchArea">
          <input type="text" placeholder="Enter city name" />
          <div className="searchCirle">
            <AiOutlineSearch className="searchIcon" />
          </div>
        </div>

        {/* Weather Info */}
        <div className="weatherInfo">
          {weather ? (
            <>
              <h1>{weather.name}</h1>
              <span>{weather.sys.country}</span>
              <div className="icon">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
              </div>
              <h1>{Math.round(weather.main.temp)}°C</h1>
              <h2>{weather.weather[0].description}</h2>
            </>
          ) : (
            <h2>Loading...</h2>
          )}
        </div>

        {/* Bottom Info */}
        {weather && (
          <div className="bottomInfoArea">
            <div className="humidityLevel">
              <WiHumidity className="windIcon" />
            </div>
            <div className="humidInfo">
              <h1>{weather.main.humidity}%</h1>
              <p>Humidity</p>
            </div>

            <div className="wind">
              <FaWind className="windIcon" />
              <div className="humidInfo">
                <h1>{weather.wind.speed} km/h</h1>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainWrapper>
  );
};

export default DisplayWeather;
