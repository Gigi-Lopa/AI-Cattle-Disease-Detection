import React, {useState, useEffect} from 'react'
import {Wind, CloudRain} from "lucide-react"

function Weather() {
    let [weather, setWeather] = useState(null)
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState(null)
    let [dateTime, setdateTime ] = useState({
        date : "",
        time : ""
    })
    let apiKey = import.meta.env.VITE_WEATHER_API_KEY
    let cachedWeather = localStorage.getItem("cachedWeather")
 
    let fetchWeather = async (lat, lon) => {
        const url = `https://yahoo-weather5.p.rapidapi.com/weather?lat=${lat}&long=${lon}&format=json&u=f`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'yahoo-weather5.p.rapidapi.com'
          }
        };
        try{
            let res = await fetch(url, options)
            let data = await res.json()

            let weather_data = {
                todayData : {
                    temp : (parseFloat(data.current_observation.condition.temperature) - 32) * 5 / 9,
                    humidity  : data.current_observation.atmosphere.humidity,
                    windSpeed  : Math.round(data.current_observation.wind.speed * 1.60934),
                    label   :data.current_observation.condition.text
                }
            }
            let forecasts_temp =  data.forecasts.slice(0,6)
            let forecasts = []

            forecasts_temp.map((forecast)=>{
                let avgTemp = (forecast.high + forecast.low) / 2
                forecasts.push({
                    label : forecast.text,
                    temp : (avgTemp - 32) * (5/9),
                    day : forecast.day
                })
            })
            weather_data.forecasts = forecasts
            setWeather(weather_data)
            console.log(data)
            localStorage.setItem("cachedWeather", JSON.stringify(weather_data))
        } 
        catch (err) {
            setError(err.message || "Failed to fetch weather.")
            if (cachedWeather) {
                setWeather(JSON.parse(cachedWeather))
            }
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        let now = new Date();
        let time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let date = now.getDate();
        let weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
        let formattedDate = `${date} ${weekday}`;

        setdateTime({ date: formattedDate, time });

        if (!navigator.geolocation) {
            setError("Geolocation not supported.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
            const { latitude, longitude } = position.coords;

            const lastFetch = localStorage.getItem("weatherLastFetch");
            const nowTimestamp = Date.now();

            if (lastFetch && nowTimestamp - parseInt(lastFetch) < 30 * 60 * 1000) {
                if (cachedWeather) {
                    console.log("Using cached")
                    setWeather(JSON.parse(cachedWeather));
                    setLoading(false);
                }
            } else {
               //fetchWeather(latitude, longitude);
                localStorage.setItem("weatherLastFetch", nowTimestamp.toString());
            }
            },
            (err) => {
            setError("Location access denied.");
            if (cachedWeather) {
                setWeather(JSON.parse(cachedWeather));
            }
            setLoading(false);
            }
        );
    }, []);


  return (
    <div className='weather-container'>
        <div className="container">
            <div className="row flex-r justify-content-between weather-main">
                <div className="col-md-12 weather-main-cp">
                    {
                        weather === null ?
                            <div className='c-p flex flex-c flex-center'>
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        : <>
                                <div className='flex justify-content-between'>
                                    <h1 className='dt_stamp'>{dateTime.date}</h1>
                                    <h1 className='dt_stamp'>{dateTime.time}</h1>
                                </div>
                                <div className='main-temp'>
                                    <div className='flex flex-r flex-center'>
                                        <div className='temp'>
                                            <h1>{Math.round(weather.todayData.temp)}°</h1>
                                            <h6>{weather.todayData.label}</h6>
                                        </div>
                                        <div className='other-stats gap-3'>
                                            <div className='flex flex-r gap-3'>
                                                <Wind color='#494949'/>
                                                <p>{Math.round(weather.todayData.windSpeed)} km/h</p>
                                            </div>
                                            <div className='flex flex-r gap-3'>
                                                <CloudRain color='#494949'/>
                                                <p>{weather.todayData.humidity}%</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className='days'>
                                    <div className='flex flex-r gap-3 flex-center'>
                                        {
                                            weather?.forecasts.map((forecast, Index)=>(
                                            <div className='day gap-3'>
                                                <span className='text-center text-upper'>{forecast.day}</span>
                                                <div className='day-temp'>
                                                    <h1 className='text-center'>{Math.round(forecast.temp)}°</h1>
                                                </div>
                                                <div className='temp-label'>
                                                    <p className='text-center'>{forecast.label}</p>
                                                </div>
                                            </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Weather