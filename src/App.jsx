import { useState } from 'react';
import CycleCalendar from './Components/Calendar';
import Events from './Components/Events';
import UsageList from './Components/UsageList';
import ProductForm from './Components/ProductForm';

import home from './assets/icons8-home-48.png';
import list from './assets/icons8-calendar-48.png';
import addProperty from './assets/icons8-add-database-48.png';
import steroid from './assets/steroid_white.png';

const App = () => {
	console.log('App component rendered'); // For debugging purposes

	const [activeComponent, setActiveComponent] = useState('home');
	const [today, setToday] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(today);
	const [updateCalendar, setUpdateCalendar] = useState(0);
	const [introPage, setIntroPage] = useState(true);

	const titleMap = {
		home: 'ADD USAGE',
		usageList: 'USAGE LIST',
		addProperty: 'ADD JUICE',
	};

	const eventTitle = activeComponent ? titleMap[activeComponent] : '';

	const handleHomeSelect = () => {
		setActiveComponent('home');
		handleIntroPage();
	};

	const handleAddPropertySelect = () => {
		setActiveComponent('addProperty');
		handleIntroPage();
	};

	const handleListSelect = () => {
		setActiveComponent('usageList');
		handleIntroPage();
	};

	const handleDateSelect = (selectedDate) => {
		setSelectedDate(selectedDate);
	};

	const handleToday = () => {
		setToday(new Date().getDate());
	};

	const handleUpdateCalendar = () => {
		setUpdateCalendar((prev) => prev + 1); // Increment to trigger re-render
	};

	const handleIntroPage = () => {
		setIntroPage(false);
	};

	return (
		<div className="container">
			<div className="header-corner-bottom-right"></div>
			<div className="header-corner-bottom-left"></div>
			<div className="header">
				<img src={home} onClick={handleHomeSelect} alt="" />
				<img src={list} onClick={handleListSelect} alt="" />
				<img src={addProperty} onClick={handleAddPropertySelect} alt="" />
				<div className="header-corner-right"></div>
				<div className="header-corner-left"></div>
			</div>
			<div className="calendar_wrapper">
				<CycleCalendar onSelectDate={handleDateSelect} key={updateCalendar} />
			</div>
			<div className="events_wrapper">
				<div className="inner_wrapper">
					<h1>{eventTitle}</h1>
					<div className="event_area">
						{activeComponent === 'home' && (
							<Events
								selectedDate={selectedDate}
								today={today}
								updateCalendar={handleUpdateCalendar}
							/>
						)}
						{activeComponent === 'usageList' && <UsageList updateCalendar={handleUpdateCalendar} />}
						{activeComponent === 'addProperty' && (
							<ProductForm updateCalendar={handleUpdateCalendar} />
						)}
						{activeComponent === 'productList' && (
							<h2
								style={{
									color: 'var(--color-white)',
									marginBlock: '2rem',
									textAlign: 'center',
								}}
							>
								Add Full Events List
							</h2>
						)}
					</div>
				</div>
			</div>
			<div>
				{introPage && (
					<div
						className="intro_page"
						style={{
							zIndex: '15',
							position: 'absolute',
							bottom: '0',
							left: '0',
							backgroundColor: 'Black',
							width: '100vw',
							height: '90vh',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							color: 'white',
							gap: '2rem',
							fontFamily: 'Bebas Neue, sans-serif',
							fontSize: '1.5rem',
							textAlign: 'center',
							transition: 'opacity ease-out 1s',
							opacity: introPage ? '1' : '0.5',
							
						}}
					>
						<img src={steroid} alt="" style={{ width: '200px', height: '200px' }} />
						<h1>Cycle Calendar</h1>
						<p style={{ width: '60%', margin: '0 auto' }}>Personal juice tracker.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
