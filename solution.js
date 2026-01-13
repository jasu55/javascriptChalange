const getWeatherData = async () => {
  try {
    const res = await fetch(
      "https://pub-54904ef3b9374b6c9f80cf1763a31f5b.r2.dev/cc-datas/weather-data.json"
    );
    if (!res.ok) {
      console.log("Дата авахад алдаа гарлаа");
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Дата авахад алдаа гарлаа", error);
    return null;
  }
};

function parseWeather(raw) {
  function cleanNumber(val) {
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  }

  const air = raw.current.air_quality;
  const current = {
    city: raw.location.name,
    country: raw.location.country,
    current: {
      temp: cleanNumber(raw.current.temp_c),
      condition: raw.current.condition.text,
      humidity: cleanNumber(raw.current.humidity),
      airQuality: {
        pm2_5: cleanNumber(air.pm2_5),
        pm10: cleanNumber(air.pm10),
        o3: cleanNumber(air.o3),
        no2: cleanNumber(air.no2),
        so2: cleanNumber(air.so2),
        co: cleanNumber(air.co),
      },
    },
  };

  const forecast = [];
  if (raw.forecast.forecastday) {
    for (let i = 0; i < 3; i++) {
      let day = raw.forecast.forecastday[i];
      forecast.push({
        date: day.date,
        min: cleanNumber(day.day.mintemp_c),
        max: cleanNumber(day.day.maxtemp_c),
        condition: day.day.condition.text,
      });
    }
  }

  let hourly = null;
  if (raw.forecast.forecastday[0].hour) {
    let hours = raw.forecast.forecastday[0].hour;

    let temps = [];
    for (let i = 0; i < hours.length; i++) {
      let t = cleanNumber(hours[i].temp_c);
      if (t !== null) temps.push(t);
    }

    let avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;

    let maxWind = 0;
    for (let i = 0; i < hours.length; i++) {
      let wind = cleanNumber(hours[i].wind_kph);
      if (wind > maxWind) maxWind = wind;
    }

    let total = 0;
    for (let i = 0; i < hours.length; i++) {
      let p = cleanNumber(hours[i].precip_mm);
      if (p) total += p;
    }

    hourly = {
      date: raw.forecast.forecastday[0].date,
      avgTemp: Math.round(avgTemp * 10) / 10,
      maxWind: maxWind,
      precipTotal: Math.round(total * 10) / 10,
    };
  }
  return { current, forecast, hourly };
}
module.exports = { getWeatherData, parseWeather };
