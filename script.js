// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme') || 'light-mode';

if (savedTheme === 'dark-mode') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const currentTheme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark-mode' ? '☀️' : '🌙';
});

// Background Menu Toggle
const bgMenuToggle = document.getElementById('bgMenuToggle');
const bgMenu = document.getElementById('bgMenu');

bgMenuToggle.addEventListener('click', () => {
    bgMenu.classList.toggle('active');
});

// Background Selection
const bgOptions = document.querySelectorAll('.bg-option');
const savedBg = localStorage.getItem('background') || 'gradient-blue';

body.setAttribute('data-bg', savedBg);

bgOptions.forEach(option => {
    option.addEventListener('click', () => {
        const bgClass = option.getAttribute('data-bg');
        body.setAttribute('data-bg', bgClass);
        localStorage.setItem('background', bgClass);
        bgMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!bgMenu.contains(e.target) && !bgMenuToggle.contains(e.target)) {
        bgMenu.classList.remove('active');
    }
});

// Time Update
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('timeDisplay').textContent = `${hours}:${minutes}:${seconds}`;
    
    const period = now.getHours() >= 12 ? 'PM' : 'AM';
    document.getElementById('timePeriod').textContent = period;
}

setInterval(updateTime, 1000);
updateTime();

// Date Update
function updateDate() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    
    document.getElementById('dateDay').textContent = dayName;
    document.getElementById('dateFull').textContent = `${monthName} ${date}, ${year}`;
}

updateDate();

// Weather Widget
async function getWeather() {
    try {
        const response = await fetch('https://wttr.in/?format=j1');
        const data = await response.json();
        const current = data.current_condition[0];
        
        const weatherContent = document.getElementById('weatherContent');
        weatherContent.innerHTML = `
            <div class="weather-temp">${current.temp_C}°C</div>
            <div class="weather-desc">${current.weatherDesc[0].value}</div>
            <div class="weather-desc" style="margin-top: 5px;">Humidity: ${current.humidity}%</div>
        `;
    } catch (error) {
        document.getElementById('weatherContent').innerHTML = `
            <p class="weather-desc">Weather unavailable</p>
        `;
    }
}

getWeather();
setInterval(getWeather, 600000); // Update every 10 minutes

// Calendar
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar() {
    const monthYearElement = document.getElementById('monthYear');
    const calendarDaysElement = document.getElementById('calendarDays');
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    monthYearElement.textContent = `${months[currentMonth]} ${currentYear}`;
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    calendarDaysElement.innerHTML = '';
    
    // Previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = daysInPrevMonth - i;
        calendarDaysElement.appendChild(day);
    }
    
    // Current month's days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day current-month';
        
        if (i === today.getDate() && 
            currentMonth === today.getMonth() && 
            currentYear === today.getFullYear()) {
            day.classList.add('today');
        }
        
        day.textContent = i;
        calendarDaysElement.appendChild(day);
    }
    
    // Next month's days
    const totalCells = calendarDaysElement.children.length;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        calendarDaysElement.appendChild(day);
    }
}

document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

renderCalendar();

// Browser Functionality
const urlInput = document.getElementById('urlInput');
const goButton = document.getElementById('goButton');
const browserFrame = document.getElementById('browserFrame');

function loadUrl() {
    let url = urlInput.value.trim();
    
    if (!url) return;
    
    // Add https:// if no protocol is specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // Check if it looks like a search query
        if (!url.includes('.')) {
            url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
        } else {
            url = `https://${url}`;
        }
    }
    
    browserFrame.src = url;
}

goButton.addEventListener('click', loadUrl);
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadUrl();
    }
});