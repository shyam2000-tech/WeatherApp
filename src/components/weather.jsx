import React, { useState, useEffect } from "react";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiKey = "78db41c5e443576ba4cb8c333dc3dce9";

  const getWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod !== 200) {
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch {
      setWeather(null);
    }
    setLoading(false);
  };

  const getIcon = (main) => {
    switch (main) {
      case "Thunderstorm": return "⛈️";
      case "Rain": return "🌧️";
      case "Clouds": return "☁️";
      case "Clear": return "☀️";
      case "Snow": return "❄️";
      case "Drizzle": return "🌦️";
      default: return "🌫️";
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 20) return "evening";
    return "night";
  };

  const getBackgroundStyle = () => {
    if (!weather) {
      const timeOfDay = getTimeOfDay();
      const backgrounds = {
        morning: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        afternoon: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        evening: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        night: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)"
      };
      return backgrounds[timeOfDay];
    }

    const weatherType = weather.weather[0].main;
    const timeOfDay = getTimeOfDay();
    
    const backgrounds = {
      Clear: {
        morning: "linear-gradient(135deg, #FFB75E 0%, #ED8F03 100%)",
        afternoon: "linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)",
        evening: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)",
        night: "linear-gradient(135deg, #000428 0%, #004e92 100%)"
      },
      Clouds: {
        morning: "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)",
        afternoon: "linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)",
        evening: "linear-gradient(135deg, #636363 0%, #a2ab58 100%)",
        night: "linear-gradient(135deg, #232526 0%, #414345 100%)"
      },
      Rain: "linear-gradient(135deg, #373B44 0%, #4286f4 50%, #373B44 100%)",
      Drizzle: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
      Thunderstorm: "linear-gradient(135deg, #141E30 0%, #243B55 100%)",
      Snow: "linear-gradient(135deg, #E6DADA 0%, #274046 100%)",
      Mist: "linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)",
      Fog: "linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)",
      Haze: "linear-gradient(135deg, #f3904f 0%, #3b4371 100%)"
    };

    if (backgrounds[weatherType]) {
      if (typeof backgrounds[weatherType] === "object") {
        return backgrounds[weatherType][timeOfDay] || backgrounds[weatherType].afternoon;
      }
      return backgrounds[weatherType];
    }
    
    return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-1000 relative overflow-hidden"
      style={{ background: weather ? getBackgroundStyle() : '#000000' }}
    >
      {/* Animated overlay effects */}
      <div className="absolute inset-0 opacity-30" style={{ display: weather ? 'block' : 'none' }}>
        {weather?.weather[0].main === "Rain" && (
          <div className="rain-container">
            {[...Array(100)].map((_, i) => (
              <div key={i} className="rain" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }}></div>
            ))}
          </div>
        )}
        {weather?.weather[0].main === "Drizzle" && (
          <div className="rain-container">
            {[...Array(60)].map((_, i) => (
              <div key={i} className="drizzle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 0.5}s`
              }}></div>
            ))}
          </div>
        )}
        {(weather?.weather[0].main === "Snow" || (weather && weather.main.temp < 0)) && (
          <div className="snow-container">
            {[...Array(80)].map((_, i) => (
              <div key={i} className="snowflake" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 7}s`,
                fontSize: `${12 + Math.random() * 16}px`,
                opacity: Math.random() * 0.7 + 0.3
              }}>❄</div>
            ))}
          </div>
        )}
        {weather?.weather[0].main === "Thunderstorm" && (
          <>
            <div className="rain-container">
              {[...Array(120)].map((_, i) => (
                <div key={i} className="rain heavy" style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1}s`,
                  animationDuration: `${0.3 + Math.random() * 0.3}s`
                }}></div>
              ))}
            </div>
            <div className="lightning"></div>
          </>
        )}
        {weather?.weather[0].main === "Clear" && getTimeOfDay() === "night" && (
          <div className="stars-container">
            {[...Array(150)].map((_, i) => (
              <div key={i} className="star" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`
              }}></div>
            ))}
          </div>
        )}
        {weather?.weather[0].main === "Clear" && getTimeOfDay() !== "night" && (
          <div className="clouds-container">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="cloud" style={{
                top: `${Math.random() * 30}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${30 + Math.random() * 20}s`,
                opacity: 0.3 + Math.random() * 0.3
              }}>☁️</div>
            ))}
          </div>
        )}
        {(weather?.weather[0].main === "Mist" || weather?.weather[0].main === "Fog" || weather?.weather[0].main === "Haze") && (
          <div className="fog-container">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="fog-layer" style={{
                animationDelay: `${i * 2}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}></div>
            ))}
          </div>
        )}
      </div>

      {!weather ? (
        // Initial Search Screen
        <div className="w-full max-w-2xl relative z-10">
          <div className="text-center mb-12 space-y-4">
            <div className="text-7xl sm:text-9xl mb-6 animate-float">🌤️</div>
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-4 tracking-tight">
              Weather
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl px-4">
              Discover the weather in any city around the world
            </p>
          </div>

          <div className="relative">
            <div className="relative bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-5 py-4">
                <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for a city..."
                  className="flex-1 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
                {city && (
                  <button
                    onClick={() => setCity("")}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <button
              onClick={getWeather}
              disabled={loading || !city.trim()}
              className="w-full mt-4 px-8 py-4 bg-white hover:bg-gray-100 text-black rounded-2xl font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-2xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Searching...
                </span>
              ) : (
                "Get Weather"
              )}
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm">
              Try: London, Tokyo, New York, Paris, Mumbai
            </p>
          </div>
        </div>
      ) : (
        // Weather Display Screen
        <div className="w-full h-full flex flex-col max-w-md px-4 relative z-10">
          <button
            onClick={() => {
              setWeather(null);
              setCity("");
            }}
            className="mb-4 text-white/80 hover:text-white transition-colors flex items-center gap-2 text-sm drop-shadow"
          >
            ← Back to search
          </button>

          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-4 sm:p-8 shadow-2xl border border-white/20 flex-1 flex flex-col justify-center">
            {/* City & Icon */}
            <div className="text-center mb-4">
              <div className="text-6xl sm:text-8xl mb-2 animate-bounce-slow drop-shadow-2xl">
                {getIcon(weather.weather[0].main)}
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-1 drop-shadow-lg">
                {weather.name}
              </h2>
              <p className="text-white/80 text-base sm:text-xl capitalize drop-shadow">
                {weather.weather[0].description}
              </p>
            </div>

            {/* Temperature */}
            <div className="text-center mb-4">
              <div className="text-6xl sm:text-8xl font-bold text-white mb-2 drop-shadow-2xl">
                {Math.round(weather.main.temp)}°
              </div>
              <div className="flex justify-center gap-4 text-white/80 text-base sm:text-lg drop-shadow">
                <span>H: {Math.round(weather.main.temp_max)}°</span>
                <span>•</span>
                <span>L: {Math.round(weather.main.temp_min)}°</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/20 my-4"></div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center border border-white/20 hover:border-white/40 transition-colors">
                <div className="text-2xl sm:text-4xl mb-1 sm:mb-3">💧</div>
                <div className="text-xl sm:text-3xl font-bold text-white mb-1 drop-shadow">
                  {weather.main.humidity}%
                </div>
                <div className="text-white/70 text-xs sm:text-sm drop-shadow">Humidity</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center border border-white/20 hover:border-white/40 transition-colors">
                <div className="text-2xl sm:text-4xl mb-1 sm:mb-3">💨</div>
                <div className="text-xl sm:text-3xl font-bold text-white mb-1 drop-shadow">
                  {Math.round(weather.wind.speed)}
                </div>
                <div className="text-white/70 text-xs sm:text-sm drop-shadow">km/h</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center border border-white/20 hover:border-white/40 transition-colors">
                <div className="text-2xl sm:text-4xl mb-1 sm:mb-3">☁️</div>
                <div className="text-xl sm:text-3xl font-bold text-white mb-1 drop-shadow">
                  {weather.clouds.all}%
                </div>
                <div className="text-white/70 text-xs sm:text-sm drop-shadow">Clouds</div>
              </div>
            </div>

            {/* Feels Like */}
            <div className="mt-4 text-center p-3 sm:p-4 bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20">
              <p className="text-white/80 text-sm sm:text-base drop-shadow">
                Feels like <span className="font-bold text-white text-lg sm:text-xl">{Math.round(weather.main.feels_like)}°C</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }
        @keyframes snowfall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes drift {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100vw);
          }
        }
        @keyframes lightning-flash {
          0%, 10%, 20%, 100% {
            opacity: 0;
          }
          5%, 15% {
            opacity: 0.8;
          }
        }
        @keyframes fog-drift {
          0% {
            transform: translateX(-20%) translateY(0);
          }
          50% {
            transform: translateX(20%) translateY(-10px);
          }
          100% {
            transform: translateX(-20%) translateY(0);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .rain {
          position: absolute;
          width: 2px;
          height: 20px;
          background: linear-gradient(transparent, rgba(255, 255, 255, 0.8));
          animation: fall linear infinite;
        }
        .rain.heavy {
          width: 3px;
          height: 30px;
          background: linear-gradient(transparent, rgba(255, 255, 255, 0.9));
        }
        .drizzle {
          position: absolute;
          width: 1px;
          height: 12px;
          background: linear-gradient(transparent, rgba(255, 255, 255, 0.6));
          animation: fall linear infinite;
        }
        .snowflake {
          position: absolute;
          color: white;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          animation: snowfall linear infinite;
          pointer-events: none;
        }
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
          animation: twinkle 3s ease-in-out infinite;
        }
        .cloud {
          position: absolute;
          font-size: 60px;
          animation: drift linear infinite;
          filter: blur(2px);
        }
        .lightning {
          position: fixed;
          inset: 0;
          background: rgba(255, 255, 255, 0.9);
          animation: lightning-flash 4s ease-in-out infinite;
          pointer-events: none;
        }
        .fog-layer {
          position: absolute;
          width: 200%;
          height: 100%;
          background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          animation: fog-drift ease-in-out infinite;
        }
        .fog-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}