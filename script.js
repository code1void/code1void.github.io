// Background Management
const bgBtns = document.querySelectorAll('.bg-btn');
const background = document.getElementById('background');
const savedBg = localStorage.getItem('background') || 'spring';

// Set initial background
background.classList.add(savedBg);
bgBtns.forEach(btn => {
    if (btn.dataset.bg === savedBg) {
        btn.classList.add('active');
    }
});

// Background selection
bgBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const bgName = btn.dataset.bg;
        
        // Remove all background classes
        bgBtns.forEach(b => b.classList.remove('active'));
        background.className = 'background';
        
        // Add new background
        background.classList.add(bgName);
        btn.classList.add('active');
        localStorage.setItem('background', bgName);
    });
});

// Time Update
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    document.getElementById('timeDisplay').textContent = `${hours}:${minutes}`;
}

// Date Update
function updateDate() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    
    document.getElementById('dateDisplay').textContent = `${dayName}, ${monthName} ${date}`;
}

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

// Update on load and every minute
updateTime();
updateDate();
setInterval(updateTime, 60000); // Update every minute
setInterval(updateDate, 60000);