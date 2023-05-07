const weather = async (lat, lon) => {
  const key = process.env.WEATHER_API_KEY;
  let endPoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${key}`;
  console.log("here")
  try {
    const response = await fetch(endPoint);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default weather;