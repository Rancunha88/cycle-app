import { useEffect, useState } from 'react';
import { db, collection } from './firebase';
import { doc, updateDoc, addDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import eventsStyle from './CSS/Events.module.css';
import useFetchEvents from './useFetchEvents';
import useFetchProducts from './useFetchProducts';

const Events = ({ selectedDate, today, updateCalendar }) => {
	const [userQTY, setUserQTY] = useState({});
	const [refresh, setRefresh] = useState(0);
	const { events } = useFetchEvents(selectedDate, today, refresh);
	const { products, fetchProducts } = useFetchProducts(refresh);

	const handleUserQTY = (e, productName) => {
		const value = e.target.value;
		console.log('Product Name:', productName, 'QTY:', value);
		setUserQTY((prev) => ({
			...prev,
			[productName]: value, // Store quantity by product name
		}));
	};

	// Function to update product quantities in Firestore
	const updateDB = async () => {
		const eventDate = selectedDate ? selectedDate : today;

		try {
			for (const product of products) {
				const userQty = userQTY[product.name];
				if (!userQty || userQty === '' || isNaN(userQty)) continue;
				const newQty = product.quantity - parseFloat(userQty);
				if (newQty < 0) continue;

				// Update product quantity
				const productRef = doc(db, 'products', product.id);
				await updateDoc(productRef, { quantity: newQty });

				// Add event with Timestamp
				await addDoc(collection(db, 'events'), {
					productName: product.name,
					userQuantity: parseFloat(userQty),
					date: Timestamp.fromDate(eventDate), // ✅ Fix: Convert to Timestamp
				});
			}
		} catch (error) {
			console.error('Error updating product quantities:', error);
		}
	};

	const handleUpdateDB = async () => {
		try {
			await updateDB(); // ✅ Wait for Firestore updates to finish
			setRefresh((prev) => prev + 1); // Increment refreshKey to force re-fetch
			setUserQTY({}); // Clear input
			updateCalendar(); // Call the updateCalendar passed from App.jsx
		} catch (error) {
			console.error('Failed to update event:', error);
		}
	};

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

			// Refresh products and events
			await fetchProducts();
			setRefresh((prev) => prev + 1);
			updateCalendar(); // Call the updateCalendar passed from App.jsx
		} catch (error) {
			console.error('Error deleting event:', error);
		}
	};

	useEffect(() => {
		setUserQTY({});
	}, [selectedDate]);

	return (
		<div className={eventsStyle.productList}>
			<div className={eventsStyle.productList_wrapper}>
				<div>
					<h2 style={{ color: 'var(--color-white)', textAlign: 'left' }}>
						{selectedDate && selectedDate.toLocaleDateString('en-us', { weekday:"long", month:"short", day:"numeric"}) }
					</h2>
				</div>
				<div
					style={{
						maxHeight: '10vh',
						overflowY: 'auto',
						display: 'flex',
						flexDirection: 'column',
						gap: '1rem',
					}}
				>
					{products.map((product) => (
						<div key={product.id} className={eventsStyle.productItem}>
							<div className={eventsStyle.productName}>{product.name}</div>
							<div className={eventsStyle.productQTY}>{product.quantity}</div>
							<span>ml</span>
							<div className={eventsStyle.productSize}>{product.size}</div>
							<span>mg</span>
							<input
								style={{
									width: '4rem',
									height: '30px',
									border: '1px solid black',
									borderRadius: '5px',
								}}
								type="number"
								placeholder="ml"
								value={userQTY[product.name] || ''} // Get quantity for specific product
								onChange={(e) => handleUserQTY(e, product.name)} // Pass product name to handleUserQTY
							/>
						</div>
					))}
				</div>
			</div>
			<button className={eventsStyle.productSubmit_button} type="submit" onClick={handleUpdateDB}>
				Add JUICE
			</button>
			<div className={eventsStyle.productList}>
				{events.map((event) => (
					<div key={event.id} className={eventsStyle.productItemList}>
						<div className={eventsStyle.productName}>{event.productName}</div>
						<div className={eventsStyle.productQTY}>{event.userQuantity} ml</div>
						<div className={eventsStyle.productDate}>
							{event.date.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
						</div>
						<button
							className="close-usage-event"
							onClick={() => {
								deleteEvent(event.id);
							}}
						>
							<i className="bx bx-x" style={{ backgroundColor: 'black', color: 'white' }}></i>
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default Events;
