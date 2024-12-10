import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: '',
        end: '',
    });
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month');

    useEffect(() => {
        axios
            .get('http://127.0.0.1:8000/api/events')
            .then((response) => setEvents(response.data))
            .catch((error) => console.error(error));
    }, []);

    const handleAddEvent = () => {
        if (!newEvent.title || !newEvent.start || !newEvent.end) {
            alert('Please fill all fields before adding the event.');
            return;
        }

        axios
            .post('http://127.0.0.1:8000/api/events', newEvent)
            .then((response) => setEvents([...events, response.data]))
            .catch((error) => console.error(error));
    };

    const handleEventEdit = (event) => {
        const action = prompt(
            `Edit event title or type 'delete' to remove this event:\nCurrent title: ${event.title}`
        );

        if (action === 'delete') {
            if (window.confirm('Are you sure you want to delete this event?')) {
                axios
                    .delete(`http://127.0.0.1:8000/api/events/${event.id}`)
                    .then(() => {
                        setEvents((prev) => prev.filter((e) => e.id !== event.id));
                    })
                    .catch((error) => console.error(error));
            }
        } else if (action) {
            axios
                .put(`http://127.0.0.1:8000/api/events/${event.id}`, {
                    ...event,
                    title: action,
                })
                .then(() => {
                    setEvents((prev) =>
                        prev.map((e) =>
                            e.id === event.id ? { ...e, title: action } : e
                        )
                    );
                })
                .catch((error) => console.error(error));
        }
    };

    const handleSelectSlot = (slotInfo) => {
        const title = prompt('Enter event title:');
        if (title) {
            const newEvent = {
                title,
                start: slotInfo.start,
                end: slotInfo.end,
            };
            axios
                .post('http://127.0.0.1:8000/api/events', newEvent)
                .then((response) => setEvents([...events, response.data]))
                .catch((error) => console.error(error));
        }
    };

    const eventPropGetter = (event) => ({
        style: { backgroundColor: '#3174ad', color: 'white' },
    });

    const handleNavigate = (date) => {
        setCurrentDate(date);
    };

    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Enhanced Calendar Scheduling</h1>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Event Title"
                    value={newEvent.title}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="datetime-local"
                    value={newEvent.start}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, start: e.target.value })
                    }
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="datetime-local"
                    value={newEvent.end}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, end: e.target.value })
                    }
                    style={{ marginRight: '10px' }}
                />
                <button onClick={handleAddEvent}>Add Event</button>
            </div>
            <div className="calendar-container">
                <Calendar
                    localizer={localizer}
                    events={events.map((event) => ({
                        ...event,
                        start: new Date(event.start),
                        end: new Date(event.end),
                    }))}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    style={{ height: 600 }}
                    onSelectEvent={handleEventEdit}
                    onSelectSlot={handleSelectSlot}
                    eventPropGetter={eventPropGetter}
                    views={['month', 'week', 'day']}
                    defaultView="month"
                    date={currentDate}
                    onNavigate={handleNavigate}
                    onView={handleViewChange}
                    view={currentView}
                    toolbar
                />
            </div>
        </div>
    );
};

export default MyCalendar;
