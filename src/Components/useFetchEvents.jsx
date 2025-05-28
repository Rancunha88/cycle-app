import { useEffect, useState } from 'react';
import { db, collection, getDocs } from './firebase';
import { query, where, Timestamp } from 'firebase/firestore';

export default function useFetchEvents(selectedDate, today, refresh) {
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const fetchEvents = async (date = null) => {
			try {
				let q;
				if (date) {
					// Existing logic for specific date range
					const start = new Date(date);
					start.setHours(0, 0, 0, 0);
					const end = new Date(date);
					end.setHours(23, 59, 59, 999);
					const startOfDay = Timestamp.fromDate(start);
					const endOfDay = Timestamp.fromDate(end);
					q = query(
						collection(db, 'events'),
						where('date', '>=', startOfDay),
						where('date', '<=', endOfDay)
					);
				} else {
					// No date provided — fetch all events
					q = query(collection(db, 'events'));
				}

				const querySnapshot = await getDocs(q);
				const eventsList = querySnapshot.docs
					.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
					.sort((a, b) => {
						const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
						const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
						return dateA - dateB;
					});

				setEvents(eventsList);
			} catch (error) {
				console.error('Error fetching events:', error);
			}
		};

		fetchEvents(selectedDate ? selectedDate : today);
	}, [selectedDate, refresh]);

	return { events };
}
