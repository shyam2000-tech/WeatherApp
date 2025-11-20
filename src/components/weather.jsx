import React, { useState } from "react";

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
    if (e.key === "Enter") getWeather();
  };

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{ background: getBackgroundStyle() }}
    >
      {/* Animated weather effects (rain, snow, etc.) */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {weather?.weather[0].main === "Rain" && (
          <div className="rain-container">
            {[...Array(100)].map((_, i) => (
              <div key={i} className="rain" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${0.5 + Math.random() * 0.5}s` }}></div>
            ))}
          </div>
        )}
        {weather?.weather[0].main === "Snow" && (
          <div className="snow-container">
            {[...Array(80)].map((_, i) => (
              <div key={i} className="snowflake" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 8}s`, animationDuration: `${8 + Math.random() * 7}s`, fontSize: `${12 + Math.random() * 16}px`, opacity: Math.random() * 0.7 + 0.3 }}>❄</div>
            ))}
          </div>
        )}
        {/* ... other effects remain the same (thunder, stars, clouds, fog, etc.) */}
      </div>

      {/* SEARCH SCREEN – centered (looks perfect on mobile & desktop) */}
      {!weather ? (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-12">
              <div className="text-8xl mb-6 animate-float">🌤️</div>
              <h1 className="text-5xl sm:text-7xl font-bold mb-4">Weather</h1>
              <p className="text-lg text-white/70">Discover the weather in any city</p>
            </div>

            <div className="space-y-4">
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <div className="flex items-center gap-3 px-5 py-4">
                  <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input
                    type="text"
                    placeholder="Search for a city..."
                    className="flex-1 bg-transparent text-lg placeholder-white/50 focus:outline-none"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoFocus
                  />
                  {city && (
                    <button onClick={() => setCity("")} className="text-white/60 hover:text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={getWeather}
                disabled={loading || !city.trim()}
                className="w-full py-4 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Searching..." : "Get Weather"}
              </button>
            </div>

            <p className="text-center text-white/50 text-sm mt-10">
              Try: London, Tokyo, New York, Dubai, Sydney
            </p>
          </div>
        </div>
      ) : (
        /* WEATHER RESULT SCREEN – full height, no huge gaps */
        <div className="min-h-screen flex flex-col px-4 pt-4 pb-8"> {/* ← important */}
          {/* Back button */}
          <button
            onClick={() => {
              setWeather(null);
              setCity("");
            }}
            className="text-white/80 hover:text-white flex items-center gap-2 mb-6 text-lg"
          >
            ← Back
          </button>

          {/* Main card – takes needed height, centered horizontally */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">

                {/* City + Icon */}
                <div className="text-center mb-8">
                  <div className="text-8xl mb-4 animate-bounce-slow">
                    {getIcon(weather.weather[0].main)}
                  </div>
                  <h2 className="text-4xl font-bold mb-2">{weather.name}</h2>
                  <p className="text-white/70 capitalize text-lg">
                    {weather.weather[0].description}
                  </p>
                </div>

                {/* Temperature */}
                <div className="text-center mb-10">
                  <div className="text-8xl font-bold mb-2">
                    {Math.round(weather.main.temp)}°
                  </div>
                  <div className="flex justify-center gap-6 text-white/70">
                    <span>H: {Math.round(weather.main.temp_max)}°</span>
                    <span>L: {Math.round(weather.main.temp_min)}°</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/20 my-8"></div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-black/30 backdrop-blur rounded-2xl p-5 text-center border border-white/10">
                    <div className="text-4xl mb-2">💧</div>
                    <div className="text-2xl font-bold">{weather.main.humidity}%</div>
                    <div className="text-white/60 text-sm">Humidity</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur rounded-2xl p-5 text-center border border-white/10">
                    <div className="text-4xl mb-2">💨</div>
                    <div className="text-2xl font-bold">{Math.round(weather.wind.speed)}</div>
                    <div className="text-white/60 text-sm">km/h</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur rounded-2xl p-5 text-center border border-white/10">
                    <div className="text-4xl mb-2">☁️</div>
                    <div className="text-2xl font-bold">{weather.clouds.all}%</div>
                    <div className="text-white/60 text-sm">Cloudiness</div>
                  </div>
                </div>

                {/* Feels like */}
                <div className="text-center bg-black/30 backdrop-blur rounded-2xl p-4 border border-white/10">
                  <p className="text-white/80">
                    Feels like <span className="text-2xl font-bold">{Math.round(weather.main.feels_like)}°C</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global styles (same as before) */}
      <style jsx>{`
        /* ... all your existing keyframes and animation classes ... */
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes bounce-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .rain { position:absolute; width:2px; height:50px; background:linear-gradient(transparent,#fff); animation:fall linear infinite; }
        @keyframes fall { to { transform:translateY(100vh); } }
        /* ... rest of your animations ... */
      `}</style>
    </div>
  );
}