var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MOCK_NEWS, LATEST_UPDATES } from './newsData.js';
const CONFIG = {
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
/* --- Weather Logic --- */
function getWeatherData(city) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!city)
            return;
        try {
            const response = yield fetch(`${CONFIG.WEATHER.BASE_URL}?key=${CONFIG.WEATHER.API_KEY}&q=${city}&days=${CONFIG.WEATHER.FORECAST_DAYS}`);
            if (response.ok && response.status !== 400) {
                const data = yield response.json();
                renderWeather(data);
            }
        }
        catch (error) {
        }
    });
}
function renderWeather(data) {
    const container = document.getElementById("forecast");
    if (!container)
        return;
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
        if (!dayData)
            continue;
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
function getLatestNews() {
    const container = document.getElementById("news-container");
    if (!container || typeof MOCK_NEWS === 'undefined')
        return;
    renderNews(MOCK_NEWS.articles);
}
function renderNews(articles) {
    const container = document.getElementById("news-container");
    if (!container)
        return;
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
function renderLatestUpdates() {
    const sidebarContainer = document.getElementById("sidebar-news");
    if (!sidebarContainer || typeof LATEST_UPDATES === 'undefined')
        return;
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
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const searchInput = document.getElementById("search");
        const submitBtn = document.getElementById("submit");
        if (searchInput) {
            searchInput.onkeyup = (e) => {
                const target = e.target;
                getWeatherData(target.value);
            };
            if (submitBtn) {
                submitBtn.onclick = () => getWeatherData(searchInput.value);
            }
            getWeatherData(CONFIG.WEATHER.DEFAULT_CITY);
        }
        getLatestNews();
        renderLatestUpdates();
    }, 100);
});
//# sourceMappingURL=main.js.map