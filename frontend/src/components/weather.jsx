import { useState, useEffect } from 'react';
import { Wind, Droplets, Thermometer } from "lucide-react";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateTime, setDateTime] = useState(() => {
    const now = new Date();
    return {
      date: `${now.getDate()} ${now.toLocaleDateString('en-US', { weekday: 'long' })}`,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  });

  const diseaseRisks = [
    { maxHumidity: 40, disease: "Ringworm", description: "Dry conditions can favor fungal infections like ringworm.", colorClass: "alert-warning" },
    { maxHumidity: 60, disease: "Papillomatosis", description: "Moderate humidity increases the risk of skin warts and papillomas.", colorClass: "alert-info" },
    { maxHumidity: 75, disease: "Ocular infections", description: "Higher humidity can promote bacterial growth, causing eye infections.", colorClass: "alert-primary" },
    { maxHumidity: 90, disease: "Photosensitization", description: "Very humid environments combined with sunlight can worsen photosensitivity.", colorClass: "alert-secondary" },
    { maxHumidity: Infinity, disease: "Foot and Mouth Disease", description: "Extremely humid conditions encourage spread of viral infections like FMD and other prothomalo cases.", colorClass: "alert-danger" },
  ];


  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (lat, lon) => {
    const url = `https://yahoo-weather5.p.rapidapi.com/weather?lat=${lat}&long=${lon}&format=json&u=f`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'yahoo-weather5.p.rapidapi.com'
      }
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      console.log(data)
      const weatherData = {
        todayData: {
          temp: Math.round((parseFloat(data.current_observation.condition.temperature) - 32) * 5 / 9),
          humidity: data.current_observation.atmosphere.humidity,
          windSpeed: Math.round(data.current_observation.wind.speed * 1.60934),
          label: data.current_observation.condition.text
        },
        forecasts: data.forecasts.slice(0, 6).map(forecast => ({
          label: forecast.text,
          temp: Math.round(((forecast.high + forecast.low) / 2 - 32) * 5 / 9),
          day: forecast.day
        }))
      };

      setWeather(weatherData);
      localStorage.setItem("cachedWeather", JSON.stringify(weatherData));
      localStorage.setItem("weatherLastFetch", Date.now().toString());
    } catch (err) {
      setError(err.message || "Failed to fetch weather.");
      const cached = localStorage.getItem("cachedWeather");
      if (cached) setWeather(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoading(false);
      return;
    }

    const cached = localStorage.getItem("cachedWeather");
    const lastFetch = parseInt(localStorage.getItem("weatherLastFetch") || "0");
    const THIRTY_MINUTES = 30 * 60 * 1000;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;

        if (cached && Date.now() - lastFetch < THIRTY_MINUTES) {
          setWeather(JSON.parse(cached));
          console.log(cached)
          setLoading(false);
        } else {
          //fetchWeather(latitude, longitude);
        }
      },
      () => {
        setError("Location access denied.");
        if (cached) setWeather(JSON.parse(cached));
        setLoading(false);
      }
    );
  }, []);

  function getDiseaseRisk(humidity) {
    return diseaseRisks.find(risk => humidity <= risk.maxHumidity) || diseaseRisks[diseaseRisks.length - 1];
  }

  if (loading) return (
    <div className=' weather-main-cp flex flex-c flex-center'>
        <div className='c-p flex flex-c flex-center'>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            </div>
    </div>
   
  );

  if (error) return <p>{error}</p>;

  return (
    <div className='weather-container'>
      <div className="container">
        <div className="row flex-r justify-content-between weather-main">
          <div className="col-md-12 weather-main-cp">
            <div className='flex justify-content-between'>
              <h1 className='dt_stamp'>{dateTime.date}</h1>
              <h1 className='dt_stamp'>{dateTime.time}</h1>
            </div>

            <div className='main-temp'>
              <div className='flex flex-r flex-center'>
                <div className='temp'>
                  <div className='humidity flex flex-r gap-2'>
                    <h1>{weather.todayData.humidity}</h1>
                    <span className='text-sm'>%</span>
                  </div>
                  <h6 className='title-sm text-center'>{weather.todayData.label}</h6>
                </div>
                <div className='other-stats gap-3 mt-4'>
                  <div className='flex flex-r gap-3'>
                    <Wind color='#494949'/>
                    <p>{weather.todayData.windSpeed} km/h</p>
                  </div>
                  <div className='flex flex-r gap-3'>
                    <Thermometer color='#494949'/>
                    <p>{weather.todayData.temp}°</p>
                  </div>
                </div>
              </div>
            </div>

            {/*
             <div className='days'>
              <div className='flex flex-r gap-3 flex-center'>
                {weather.forecasts.map((forecast, index) => (
                  <div key={index} className='day gap-3'>
                    <span className='text-center text-upper'>{forecast.day}</span>
                    <div className='day-temp'>
                      <h1 className='text-center'>{forecast.humidity}°</h1>
                    </div>
                    <div className='temp-label'>
                      <p className='text-center'>{forecast.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> 
            */}

            {weather.todayData.humidity !== null && (() => {
              const risk = getDiseaseRisk(weather.todayData.humidity);
              return (
                <div className={`alert flex flex-c flex-center mt-4 ${risk.colorClass}`}>
                  <strong className="d-block mb-1">{risk.disease}</strong>
                  <p className="mb-0">{risk.description}</p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;
