const { getWeatherData, parseWeather } = require("./solution");

(async () => {
  const data = await getWeatherData();
  const result = parseWeather(data);
  console.log("Weather data:", result);
})();
