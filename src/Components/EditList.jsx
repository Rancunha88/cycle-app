import editListStyle from './CSS/EditList.module.css';
import React, { useEffect, useState } from 'react';
import { db, collection, getDocs } from './firebase';
import { doc, updateDoc, increment, setDoc, query, where } from 'firebase/firestore';

const EditList = ({ selectedDate }) => {
	const [products, setProducts] = useState([]);
	const [dayEvents, setDayEvents] = useState([]); // New state for day events

	// Fetch products from Firestore
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

	// Fetch day events for the selected date
	const fetchDayEvents = async (selectedDate) => {
        if (!selectedDate) selectedDate = new Date().getDate();

		try {
            const startOfDay = new Date(selectedDate);
			startOfDay.setHours(0, 0, 0, 0);
			const endOfDay = new Date(selectedDate);
			endOfDay.setHours(23, 59, 59, 999);
            
			const dayEventsRef = collection(db, 'dayEvents');
			const q = query(
                dayEventsRef,
				where('date', '>=', startOfDay.toISOString()),
				where('date', '<', endOfDay.toISOString())
			);
            
			const snapshot = await getDocs(q);
			const dayEventsList = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
            
			// Map product names to day events
			const dayEventsWithNames = dayEventsList.map((event) => {
                const product = products.find((p) => p.id === event.productId);
				const productName = product ? product.name : 'Unknown Product';
				return { ...event, productName };
			});
            
			setDayEvents(dayEventsWithNames);
		} catch (error) {
            console.error('Error fetching day events:', error);
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
    }, []);

	useEffect(() => {
		fetchProducts();
		if (selectedDate) {
			fetchDayEvents(selectedDate);
		}
	}, [selectedDate]);

	function formatDate(isoDateString) {
		const date = new Date(isoDateString);
		return date.toLocaleDateString('en-GB', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	}


	return (
		<div className={editListStyle.productList}>
			<div className={editListStyle.productList_wrapper}>
				{dayEvents.map((event) => (
					<div key={event.id} className={editListStyle.productItem}>
						<span className={editListStyle.date}>
							{formatDate(event.date)}
							<span className={editListStyle.eventDay_wrapper}>
								<span className={editListStyle.productName}>{event.productName}</span>
								<span className={editListStyle.productQTY}>{event.quantity}</span>
								<span>ml</span>
								<span className={editListStyle.productSize}>{event.size}</span>
								<span>mg</span>
							</span>
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default EditList;
