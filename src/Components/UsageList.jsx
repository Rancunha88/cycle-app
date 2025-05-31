import { db } from './firebase';
import { doc, updateDoc, deleteDoc, } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import useFetchEvents from './useFetchEvents';
import usageListStyle from './CSS/UsageList.module.css';
import useFetchProducts from './useFetchProducts';

const UsageList = ({ updateCalendar }) => {
	const [refresh, setRefresh] = useState(0);
	const { events } = useFetchEvents( null, null, refresh ); // Fetch all events
	const { products, fetchProducts } = useFetchProducts( refresh );


	const deleteEvent = async (eventId) => {
		try {
			const eventToDelete = events.find((event) => event.id === eventId);		
			if (!eventToDelete) return;

			const { productName, userQuantity } = eventToDelete;

			const product = products.find((p) => p.name === productName);
			if (product) {
				const newQty = product.quantity + userQuantity;
				const productRef = doc(db, 'products', product.id);
				await updateDoc(productRef, { quantity: newQty });
			}

			const eventRef = doc(db, 'events', eventId);
			await deleteDoc(eventRef);

			await fetchProducts();
			setRefresh((prev) => prev + 1);
			updateCalendar(); // Call the updateCalendar passed from App.jsx
		} catch (error) {
			console.error('Error deleting event:', error);
		}
	};

	useEffect(() => {
		// setSelectedDate(); //
	}, []);

	return (
		<div className={usageListStyle.productList}>
			{events.map((event) => (
				<div key={event.id} className={usageListStyle.productItem}>
					<div className={usageListStyle.productName}>{event.productName}</div>
					<div className={usageListStyle.productQTY}>{event.userQuantity} ml</div>
					<div className={usageListStyle.productDate}>
						{event.date.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
					</div>
					<button
						className={usageListStyle.deleteButton}
						onClick={() => {
							deleteEvent(event.id);
						}}
					>
						<i className="bx bx-x" style={{ backgroundColor: 'black', color: 'white' }}></i>
					</button>
				</div>
			))}
		</div>
	);
};

export default UsageList;
