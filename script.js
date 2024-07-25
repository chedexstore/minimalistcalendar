document.addEventListener("DOMContentLoaded", () => {
    const calendarContainer = document.querySelector(".container");
    const calendar = document.getElementById("calendar");
    const header = document.getElementById("header");
    const calendarHeader = document.getElementById("calendar-header");
    const eventInput = document.getElementById("event-input");
    const addEventButton = document.getElementById("add-event");
    // Remove the clearEventsButton reference
    const eventList = document.getElementById("event-list");
    let events = JSON.parse(localStorage.getItem('events')) || {};
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    const now = new Date();
    let selectedDate = null;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const backgroundImages = [
        'url("images/jan.jpg")',
        'url("images/feb.jpg")',
        'url("images/mar.jpg")',
        'url("images/apr.jpg")',
        'url("images/may.jpg")',
        'url("images/jun.jpg")',
        'url("images/jul.jpg")',
        'url("images/aug.jpg")',
        'url("images/sep.jpg")',
        'url("images/oct.jpg")',
        'url("images/nov.jpg")',
        'url("images/dec.jpg")'
    ];
 const eventDialog = document.getElementById("event-dialog");
    const dialogDateSpan = document.getElementById("dialog-date");
    const dialogEventInput = document.getElementById("dialog-event-input");
    const dialogAddEventButton = document.getElementById("dialog-add-event");
    const dialogEventList = document.getElementById("dialog-event-list");
    const closeDialogButton = document.getElementById("close-dialog");

    function openDialog(date) {
        selectedDate = date;
        dialogDateSpan.textContent = date;
        renderDialogEvents(date);
        eventDialog.style.display = "flex";
        eventInput.placeholder = `Add event on ${date}`;
        eventInput.disabled = true; // Disable main input when dialog is open
    }

    function closeDialog() {
        eventDialog.style.display = "none";
        eventInput.disabled = false; // Re-enable main input when dialog is closed
    }

    function renderDialogEvents(date) {
        dialogEventList.innerHTML = '';
        if (events[date]) {
            events[date].forEach((event, index) => {
                const eventItem = document.createElement("li");
                eventItem.className = "dialog-event-item";
                eventItem.innerHTML = 
                    `<input type="checkbox" ${event.done ? 'checked' : ''} data-date="${date}" data-index="${index}" />
                     <span>${index + 1}. ${event.text}</span>
                     <button class="dialog-delete-event" data-date="${date}" data-index="${index}">x</button>`;
                dialogEventList.appendChild(eventItem);
            });
        }
    }

    function addDialogEvent() {
        if (selectedDate && dialogEventInput.value.trim()) {
            if (!events[selectedDate]) {
                events[selectedDate] = [];
            }
            events[selectedDate].push({ text: dialogEventInput.value.trim(), done: false, dueDate: selectedDate });
            localStorage.setItem('events', JSON.stringify(events));
            renderDialogEvents(selectedDate);
            dialogEventInput.value = '';
        }
    }

    calendar.addEventListener('click', (event) => {
        if (event.target.classList.contains('day')) {
            const date = event.target.dataset.date;
            openDialog(date);
        }
    });

    dialogAddEventButton.addEventListener('click', addDialogEvent);

    dialogEventInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addDialogEvent();
        }
    });

    dialogEventList.addEventListener('click', (event) => {
        if (event.target.classList.contains('dialog-delete-event')) {
            const date = event.target.dataset.date;
            const index = event.target.dataset.index;
            events[date].splice(index, 1);
            if (events[date].length === 0) {
                delete events[date];
            }
            localStorage.setItem('events', JSON.stringify(events));
            renderDialogEvents(date);
        } else if (event.target.type === 'checkbox') {
            const date = event.target.dataset.date;
            const index = event.target.dataset.index;
            events[date][index].done = event.target.checked;
            localStorage.setItem('events', JSON.stringify(events));
            renderDialogEvents(date);
        }
    });

    closeDialogButton.addEventListener('click', closeDialog);
    function updateCalendarHeader() {
        const day = now.getDate();
        const currentDay = `${monthNames[month]} ${day}, ${year}`;
        calendarHeader.textContent = currentDay;
    }

    function updateBackgroundImage() {
        document.body.style.backgroundImage = backgroundImages[month];
        document.body.style.backgroundSize = 'cover'; 
    }

    function renderCalendar() {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        calendar.innerHTML = '';

        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement("div");
            calendar.appendChild(emptyDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.className = "day";
            dayElement.innerText = day;
            dayElement.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            if (day === now.getDate() && month === now.getMonth() && year === now.getFullYear()) {
                dayElement.classList.add("current-day");
            }

            if (events[dayElement.dataset.date] && events[dayElement.dataset.date].some(event => new Date(event.dueDate).toDateString() === now.toDateString())) {
                dayElement.classList.add("due-event");
            }

            calendar.appendChild(dayElement);
        }
    }

    function renderEvents(date) {
        eventList.innerHTML = '';
        if (events[date]) {
            let allChecked = true;
            events[date].forEach((event, index) => {
                const eventItem = document.createElement("li");
                eventItem.className = "event-item";
                eventItem.innerHTML = `
                    <input type="checkbox" ${event.done ? 'checked' : ''} data-date="${date}" data-index="${index}" />
                    <span>${index + 1}. ${event.text}</span>
                    <button class="delete-event" data-date="${date}" data-index="${index}">x</button>
                `;
                eventList.appendChild(eventItem);

                if (!event.done) {
                    allChecked = false;
                }
            });

            if (allChecked) {
                document.querySelectorAll(".day[data-date='" + date + "']").forEach(day => {
                    day.classList.remove("due-event");
                });
            } else {
                document.querySelectorAll(".day[data-date='" + date + "']").forEach(day => {
                    day.classList.add("due-event");
                });
            }
        }
    }

    function addEvent() {
        if (selectedDate && eventInput.value.trim()) {
            if (!events[selectedDate]) {
                events[selectedDate] = [];
            }
            events[selectedDate].push({ text: eventInput.value.trim(), done: false, dueDate: selectedDate });
            localStorage.setItem('events', JSON.stringify(events));
            renderEvents(selectedDate);
            eventInput.value = '';
            renderCalendar();
        }
    }

    // Remove the clearAllEvents function
    // function clearAllEvents() {
    //     if (confirm("Are you sure you want to clear all events?")) {
    //         events = {};
    //         localStorage.setItem('events', JSON.stringify(events));
    //         renderEvents(selectedDate);
    //         renderCalendar();
    //     }
    // }

    calendar.addEventListener('click', (event) => {
        if (event.target.classList.contains('day')) {
            document.querySelectorAll('.day').forEach(day => day.classList.remove('selected'));
            event.target.classList.add('selected');
            selectedDate = event.target.dataset.date;
            renderEvents(selectedDate);
            eventInput.placeholder = `add event on ${selectedDate}`;
            eventInput.disabled = false; // Ensure input is enabled
        }
    });

    eventList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-event')) {
            const date = event.target.dataset.date;
            const index = event.target.dataset.index;
            events[date].splice(index, 1);
            if (events[date].length === 0) {
                delete events[date];
            }
            localStorage.setItem('events', JSON.stringify(events));
            renderEvents(date);
            renderCalendar();
        } else if (event.target.type === 'checkbox') {
            const date = event.target.dataset.date;
            const index = event.target.dataset.index;
            events[date][index].done = event.target.checked;
            localStorage.setItem('events', JSON.stringify(events));
            renderEvents(date);
        }
    });

    addEventButton.addEventListener('click', addEvent);

    eventInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addEvent();
        }
    });

    // Remove the clearEventsButton event listener
    // clearEventsButton.addEventListener('click', clearAllEvents);

    const savedEvents = JSON.parse(localStorage.getItem('events')) || {};
    events = { ...events, ...savedEvents };

    header.addEventListener('click', () => {
        header.classList.toggle('active');
    });

    document.getElementById('prev-year').addEventListener('click', (event) => {
        event.stopPropagation();
        year--;
        updateCalendarHeader();
        updateBackgroundImage();
            renderCalendar();
    });

    document.getElementById('next-year').addEventListener('click', (event) => {
        event.stopPropagation();
        year++;
        updateCalendarHeader();
        updateBackgroundImage();
        renderCalendar();
    });

    document.getElementById('prev-month').addEventListener('click', (event) => {
        event.stopPropagation();
        if (month === 0) {
            month = 11;
            year--;
        } else {
            month--;
        }
        updateCalendarHeader();
        updateBackgroundImage();
        renderCalendar();
    });

    document.getElementById('next-month').addEventListener('click', (event) => {
        event.stopPropagation();
        if (month === 11) {
            month = 0;
            year++;
        } else {
            month++;
        }
        updateCalendarHeader();
        updateBackgroundImage();
        renderCalendar();
    });

    // Initialize the calendar and header
    updateCalendarHeader();
    updateBackgroundImage();
    renderCalendar();
});
