const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const AUTHOR = 'Maksym Melnychenko';

// Lista dostępnych krajów i odpowiadających im miast
const countriesCities = {
  Poland: ['Warsaw', 'Krakow', 'Gdansk', 'Lublin'],
  Germany: ['Berlin', 'Munich'],
  France: ['Paris', 'Lyon', 'Marseille'],
  Italy: ['Rome', 'Milan'],
  Spain: ['Madrid', 'Barcelona', 'Valencia'],
  UnitedKingdom: ['London', 'Manchester'],
  USA: ['New York', 'Los Angeles', 'Chicago'],
  Canada: ['Toronto', 'Vancouver'],
  Japan: ['Tokyo', 'Osaka', 'Kyoto'],
  Australia: ['Sydney', 'Melbourne']
};

// Konfiguracja silnika szablonów EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Obsługa przesyłania danych z formularzy
app.use(express.urlencoded({ extended: true }));

// Informacje wyświetlane przy starcie serwera
console.log(`Aplikacja uruchomiona: ${new Date().toISOString()}`);
console.log(`Autor aplikacji: ${AUTHOR}`);
console.log(`Aplikacja nasłuchuje na porcie: ${PORT}`);

// Definicja tras aplikacji
app.get('/', (req, res) => {
  res.render('index', { countriesCities });
});

app.post('/weather', async (req, res) => {
  const { country, city } = req.body;
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return res.send('Brak klucza API!');
  }
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.main) {
      const temp = data.main.temp;
      const desc = data.weather[0].description;
      res.send(`Aktualna pogoda w ${city}, ${country}: ${temp}°C, ${desc}`);
    } else {
      res.send('Nie udało się pobrać danych pogodowych.');
    }
  } catch (e) {
    res.send(`Błąd: ${e.message}`);
  }
});

app.listen(PORT); 