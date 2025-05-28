import { useEffect, useState } from 'react';
import calendarStyle from './CSS/Calendar.module.css';
import useFetchEvents from './useFetchEvents';

	const CycleCalendar = ({ onSelectDate }) => {
		const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		const monthOfYear = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];

		const currentDate = new Date();
		const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
		const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
		const [selectedDate, setSelectedDate] = useState(currentDate);
		const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
		const firstDayOfMonth = new Date(currentYear, currentMonth, 0).getDay();
		const [selectedDay, setSelectedDay] = useState(currentDate);
		const [highlightedDates, setHighlightedDates] = useState([]);
		const { events } = useFetchEvents();

		const prevMonth = () => {
			setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
			setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
		};

		const nextMonth = () => {
			setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
			setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
		};

		const handleDayClick = (day) => {
			const clickedDate = new Date(currentYear, currentMonth, day);
			setSelectedDate(clickedDate);
			onSelectDate(clickedDate);
		};

		// Extracting event day and month from events
		const handleEventsDate = (events) => {
			return events.map((event) => {
				const eventDate = event.date.toDate();
				const year = eventDate.getFullYear();
				const month = String(eventDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
				const day = String(eventDate.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			});
		};

		
		useEffect(() => {
			setHighlightedDates(handleEventsDate(events));
		}, [events]);

		return (
			<div className={calendarStyle.calendar_wrapper}>
				<div className={calendarStyle.calendar}>
					<h1 className={calendarStyle.heading}>Cycle Calendar</h1>
					<div className={calendarStyle.navigate_date}>
						<h2 className={calendarStyle.month}>{monthOfYear[currentMonth]},</h2>
						<h2 className={calendarStyle.year}>{currentYear}</h2>
						<div className={calendarStyle.buttons}>
							<i className={`bx bx-chevron-left ${calendarStyle.button}`} onClick={prevMonth}></i>
							<i className={`bx bx-chevron-right ${calendarStyle.button}`} onClick={nextMonth}></i>
						</div>
					</div>
					<div className={calendarStyle.weekdays}>
						{daysOfWeek.map((day) => (
							<span key={day}>{day}</span>
						))}
					</div>
					<div className={calendarStyle.days}>
						{[...Array(firstDayOfMonth).keys()].map((_, index) => (
							<span key={`empty-${index}`} />
						))}
						{[...Array(daysInMonth).keys()].map((day) => {
							const dayNumber = day + 1;
							const dayString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
								dayNumber
							).padStart(2, '0')}`;
							const isHighlighted = highlightedDates?.includes(dayString);

							return (
								<span
									key={dayNumber}
									className={`${calendarStyle.day} ${
										dayNumber === currentDate.getDate() &&
										currentMonth === currentDate.getMonth() &&
										currentYear === currentDate.getFullYear()
											? calendarStyle.current_day
											: ''
									} ${selectedDay === dayNumber ? calendarStyle.selected_day : ''} ${
										isHighlighted ? calendarStyle.highlighted_day : ''
									}`}
									onClick={() => {
										setSelectedDay((prev) => (prev === dayNumber ? null : dayNumber));
										handleDayClick(dayNumber);
									}}
								>
									{dayNumber}
								</span>
							);
						})}
					</div>
				</div>
			</div>
		);
	};

export default CycleCalendar;
