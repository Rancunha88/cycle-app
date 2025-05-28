import React, { useRef, useEffect, useState } from 'react';
import { doc, updateDoc, increment, setDoc, query, where } from 'firebase/firestore';
import { db, collection, getDocs } from './firebase';
import { serverTimestamp } from 'firebase/firestore';
import styles from './ProductList.module.css';
import './cycleCalendarApp.css';

// import home from '../assets/icons8-home-48.png';
// import calendar from '../assets/icons8-calendar-48.png';
// import addDatabase from '../assets/icons8-add-database-48.png';
// import editProperty from '../assets/icons8-edit-property-48.png';

// const CycleCalendar = () => {
// 	const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// 	const monthOfYear = [
// 		'January',
// 		'February',
// 		'March',
// 		'April',
// 		'May',
// 		'June',
// 		'July',
// 		'August',
// 		'September',
// 		'October',
// 		'November',
// 		'December',
// 	];

	// const currentDate = new Date();

	// const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
	// const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
	// const [selectedDate, setSelectedDate] = useState(currentDate);

	// const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
	// const firstDayOfMonth = new Date(currentYear, currentMonth, 0).getDay();

	const [showList, setShowLlist] = useState(false);
	const [products, setProducts] = useState([]); // Array to store product data

	const [dayUsageQTY, setDayUsageQTY] = useState({}); // Object to store day usage quantities for each product

	const [dayEvents, setDayEvents] = useState([]); // Array to store day events

	const [selectedDay, setSelectedDay] = useState(null); // Array to store selected days

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, 'products'));
				const productsList = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setProducts(productsList);
			} catch (error) {
				console.error('Error fetching products:', error);
			}
		};

		fetchProducts();
	}, []);

	// const prevMonth = () => {
	// 	setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
	// 	setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
	// };

	// const nextMonth = () => {
	// 	setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
	// 	setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
	// };

	// const handleDayClick = (day) => {
	// 	const clickedDate = new Date(currentYear, currentMonth, day);
	// 	const today = new Date();

	// 	if (clickedDate >= today || isSameDay(clickedDate, today)) {
	// 		setSelectedDate(clickedDate);
	// 		setShowLlist(true);
	// 	}
	// };

	// const isSameDay = (date1, date2) => {
	// 	return (
	// 		date1.getDate() === date2.getDate() &&
	// 		date1.getMonth() === date2.getMonth() &&
	// 		date1.getFullYear() === date2.getFullYear()
	// 	);
	// };

	// function formatDate(isoDateString) {
	// 	const date = new Date(isoDateString);
	// 	return date.toLocaleDateString('en-GB', {
	// 		year: 'numeric',
	// 		month: 'long',
	// 		day: 'numeric',
	// 	});
	// }

	const handleDayUsageQTY = (productID, e) => {
		const value = e.target.value;
		if (/^[0-9](\.[0-9])?$/.test(value)) {
			setDayUsageQTY((prev) => ({
				...prev,
				[productID]: parseFloat(value),
			}));

			console.log(`Product ID: ${productID}, Day Usage QTY: ${parseFloat(value)}`);
			return parseFloat(value);
		}
	};

	const updateProductQTY = async (productID, dayUsage, day) => {
		try {
			const productRef = doc(db, 'products', productID);
			await updateDoc(productRef, {
				quantity: increment(-dayUsage),
			});
		} catch (error) {
			console.error('Error updating product quantity:', error);
		}

		// Reset the input field after updating
		setDayUsageQTY((prev) => ({
			...prev,
			[productID]: 0,
		}));
	};

	const dayEvent = async (productId, quantity, date) => {
		try {
			// Create a unique ID for the event document using productId and date
			const eventId = `${productId}_${date.toISOString()}`;
			const eventRef = doc(db, 'dayEvents', eventId);

			console.log('date :', date);

			// Save the event data
			await setDoc(eventRef, {
				productId,
				date: date.toISOString(), // Store as ISO string for consistency
				quantity,
				timestamp: serverTimestamp(), // Use Firebase's server-side timestamp
			});
			console.log(`Event recorded for product ${productId} on ${date}`);
		} catch (error) {
			console.error('Error creating day event:', error);
		}
	};

	useEffect(() => {
		const loadEvents = async () => {
			try {
				const events = await fetchDayEvents(selectedDate);
				setDayEvents(events);
			} catch (error) {
				console.error('Failed to fetch day events:', error);
			}
		};
		loadEvents();
	}, [selectedDate]);

	// const fetchDayEvents = async (selectedDate) => {

	// 	const startOfDay = new Date(selectedDate);
	// 	startOfDay.setHours(0, 0, 0, 0);
	// 	const endOfDay = new Date(selectedDate);
	// 	endOfDay.setHours(23, 59, 59, 999);

	// 	const dayEventsRef = collection(db, 'dayEvents');
	// 	const q = query(
	// 		dayEventsRef,
	// 		where('date', '>=', startOfDay.toISOString()),
	// 		where('date', '<', endOfDay.toISOString())
	// 	);
	// 	const snapshot = await getDocs(q);
	// 	const dayEvents = snapshot.docs.map((doc) => ({
	// 		id: doc.id,
	// 		...doc.data(),
	// 	}));

	// 	const dayEventsWithNames = dayEvents.map((event) => {
	// 		const product = products.find((p) => p.id === event.productId);
	// 		const productName = product ? product.name : 'Unknown Product';
	// 		return { ...event, productName };
	// 	});

	// 	return dayEventsWithNames;
	// };

	// Handle fetch events when the button is clicked
	// This function will be called when the user clicks the "Add Day Usage" button
	const handleFetch = async () => {
		const events = fetchDayEvents(selectedDate);
		setDayEvents(events);
	};

	// Handle toggle for product list
	const productList = () => {
		return (
			<div className={styles.productList} style={{ display: showList ? 'block' : 'none' }}>
				<div className={styles.productList_wrapper}>
					{products.map((product) => (
						<div key={product.id} className={styles.productItem}>
							<div className={styles.productName}>{product.name}</div>
							<div className={styles.productBrand}>{product.brand}</div>
							<div className={styles.productQTY}>{product.qty}</div>
							<input
								type="number"
								className={styles.productQTYInput}
								value={dayUsageQTY[product.id] || '0'}
								onChange={(e) => handleDayUsageQTY(product.id, e)}
							/>
							<span>ml</span>
						</div>
					))}
				</div>
				<button
					className={styles.productSubmit_button}
					onClick={() => {
						// Loop through each product and update the quantity based on day usage
						products.forEach((product) => {
							const dayUsage = dayUsageQTY[product.id];
							if (typeof dayUsage === 'number' && dayUsage > 0 && !isNaN(dayUsage)) {
								updateProductQTY(product.id, dayUsage, selectedDate);
								dayEvent(product.id, dayUsage, selectedDate); // Call dayEvent here
								handleFetch(); // Fetch events after updating
							} else {
								console.log(
									'Day: ' + selectedDate + ', No change in quantity for product:',
									product.name
								);
							}
						});
						setShowLlist((prev) => !prev);
					}}
				>
					Add Day Usage
				</button>
			</div>
		);
	};

	return (
		<div className="cycleCalendar-app">
			<div className="header_wrapper">
				<div className="header">
					<img src={home} alt="" />
					<img src={calendar} alt="" />
					<img src={addDatabase} alt="" />
					<img src={editProperty} alt="" />
				</div>
			</div>
			<div className="events">
				{showList && productList()}{' '}
				<div className="event-list">
					{dayEvents.length > 0 ? (
						dayEvents.map((event) => (
							<div key={event.id} className="event-item">
								<h1>{event.productName} -</h1>
								<h1>{event.quantity}ml</h1>
								<h1>- {formatDate(event.date)} </h1>
							</div>
						))
					) : (
						<h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							No juice for this date.
						</h1>
					)}
				</div>
			</div>
			<div className="calendar_wrapper">
				<div className="calendar">
					<h1 className="heading">Cycle Calendar</h1>
					<div className="navigate-date">
						<h2 className="month">{monthOfYear[currentMonth]},</h2>
						<h2 className="year">{currentYear}</h2>
						<div className="buttons">
							<i className="bx bx-chevron-left" onClick={prevMonth}></i>
							<i className="bx bx-chevron-right" onClick={nextMonth}></i>
						</div>
					</div>
					<div className="weekdays">
						{daysOfWeek.map((day) => (
							<span key={day}>{day}</span>
						))}
					</div>
					<div className="days">
						{[...Array(firstDayOfMonth).keys()].map((_, index) => (
							<span key={`empty-${index}`} />
						))}
						{[...Array(daysInMonth).keys()].map((day) => (
							<span
								key={day + 1}
								className={`
											${
												day + 1 === currentDate.getDate() &&
												currentMonth === currentDate.getMonth() &&
												currentYear === currentDate.getFullYear()
													? 'current-day'
													: ''
											}
											${selectedDay === day + 1 ? 'selected-day' : ''}
											`}
								// onClick={() => handleDayClick(day + 1)}
								onClick={() => {
									const dayNumber = day + 1;
									setSelectedDay((prev) => (prev === dayNumber ? null : dayNumber));
									handleDayClick(day + 1);
								}}
							>
								{day + 1}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CycleCalendar;
