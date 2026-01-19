import { MOCK_NEWS, LATEST_UPDATES } from './newsData.js';
interface AppConfig {
  WEATHER: {
    API_KEY: string;
    BASE_URL: string;
    DEFAULT_CITY: string;
    FORECAST_DAYS: number;
  };
  NEWS: {
    API_KEY: string;
    BASE_URL: string;
    MAX_ARTICLES: number;
  };
  DAYS: string[];
  MONTHS: string[];
}

const CONFIG: AppConfig = {
  WEATHER: {
    API_KEY: "7d77b96c972b4d119a3151101212704",
    BASE_URL: "https://api.weatherapi.com/v1/forecast.json",
    DEFAULT_CITY: "Cairo",
    FORECAST_DAYS: 3
  },
  NEWS: {
    API_KEY: "18b0be64ee1842acb707c09995172518",
    BASE_URL: "https://newsapi.org/v2/top-headlines?sources=techcrunch",
    MAX_ARTICLES: 5
  },
  DAYS: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

interface WeatherData {
  location: { name: string };
  current: {
    last_updated: string;
    temp_c: number;
    condition: { text: string; icon: string };
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: { text: string; icon: string };
      };
    }>;
  };
}

/* --- Weather Logic --- */
async function getWeatherData(city: string): Promise<void> {
  if (!city) return;
  try {
    const response = await fetch(`${CONFIG.WEATHER.BASE_URL}?key=${CONFIG.WEATHER.API_KEY}&q=${city}&days=${CONFIG.WEATHER.FORECAST_DAYS}`);
    if (response.ok && response.status !== 400) {
      const data: WeatherData = await response.json();
      renderWeather(data);
    }
  } catch (error) {
    console.error("Weather error:", error);
  }
}

function renderWeather(data: WeatherData): void {
  const container = document.getElementById("forecast");
  if (!container) return;

  const current = data.current;
  const location = data.location;
  const forecast = data.forecast.forecastday;
  const date = new Date(current.last_updated.replace(" ", "T"));

  let html = `
        <div class="today forecast">
            <div class="forecast-header">
                <div class="day">${CONFIG.DAYS[date.getDay()]}</div>
                <div class="date">${date.getDate()} ${CONFIG.MONTHS[date.getMonth()]}</div>
            </div>
            <div class="forecast-content">
                <div class="location">${location.name}</div>
                <div class="degree">
                    <div class="num">${current.temp_c}<sup>o</sup>C</div>
                    <div class="forecast-icon"><img src="https:${current.condition.icon}" width="90"></div>
                </div>
                <div class="custom">${current.condition.text}</div>
                <span><img src="images/icon-umberella.png"> 20%</span>
                <span><img src="images/icon-wind.png"> 18km/h</span>
                <span><img src="images/icon-compass.png"> East</span>
            </div>
        </div>`;

  for (let i = 1; i < forecast.length; i++) {
    const dayData = forecast[i];
    if (!dayData) continue;
    const d = new Date(dayData.date.replace(" ", "T"));
    html += `
            <div class="forecast">
                <div class="forecast-header"><div class="day">${CONFIG.DAYS[d.getDay()]}</div></div>
                <div class="forecast-content">
                    <div class="forecast-icon"><img src="https:${dayData.day.condition.icon}" width="48"></div>
                    <div class="degree">${dayData.day.maxtemp_c}<sup>o</sup>C</div>
                    <small>${dayData.day.mintemp_c}<sup>o</sup></small>
                    <div class="custom">${dayData.day.condition.text}</div>
                </div>
            </div>`;
  }
  container.innerHTML = html;
}

function getLatestNews(): void {
  const container = document.getElementById("news-container");
  if (!container || typeof MOCK_NEWS === 'undefined') return;
  renderNews(MOCK_NEWS.articles);
}

function renderNews(articles: any[]): void {
  const container = document.getElementById("news-container");
  if (!container) return;

  let newsHtml = "";
  articles.slice(0, 5).forEach(art => {
    newsHtml += `
            <div class="post">
                <h2 class="entry-title"><a href="${art.url}">${art.title}</a></h2>
                <div class="featured-image"><img src="${art.urlToImage || 'images/default-news.jpg'}"></div>
                <p>${art.description || 'No description available for this article.'}</p>
                <a href="${art.url}" class="button">Read More</a>
            </div><hr style="opacity:0.1; margin:20px 0;">`;
  });
  container.innerHTML = newsHtml;
}

function renderLatestUpdates(): void {
  const sidebarContainer = document.getElementById("sidebar-news");
  if (!sidebarContainer || typeof LATEST_UPDATES === 'undefined') return;

  let htmlContent = "";
  LATEST_UPDATES.forEach(item => {
    htmlContent += `
            <li>
                <small style="color: #009ad8; display: block;">${item.time}</small>
                <a href="#" style="pointer-events: none;">${item.title}</a>
            </li>`;
  });
  sidebarContainer.innerHTML = htmlContent;
}

/* --- Initialization --- */
document.addEventListener("DOMContentLoaded", () => {
  // Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle") as HTMLElement;
  const navigation = document.querySelector(".main-navigation") as HTMLElement;
  if (menuToggle && navigation) {
    menuToggle.onclick = () => navigation.classList.toggle("opened");
  }

  // Search Logic
  const searchInput = document.getElementById("search") as HTMLInputElement;
  const submitBtn = document.getElementById("submit") as HTMLElement;

  if (searchInput) {
    searchInput.onkeyup = (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement;
      getWeatherData(target.value);
    };
    if (submitBtn) {
      submitBtn.onclick = () => getWeatherData(searchInput.value);
    }
    getWeatherData(CONFIG.WEATHER.DEFAULT_CITY);
  }

  getLatestNews();
  renderLatestUpdates();
});