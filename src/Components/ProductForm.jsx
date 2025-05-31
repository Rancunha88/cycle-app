import { useEffect, useState } from 'react';
import { db, collection, addDoc, getDocs } from './firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import productFormStyle from './CSS/ProductForm.module.css';
import useFetchProducts from './useFetchProducts';

const ProductForm = () => {
	// State for form fields
	const [productName, setProductName] = useState('');
	const [productBrand, setProductBrand] = useState('');
	const [productQTY, setProductQTY] = useState('');
	const [productSize, setProductSize] = useState('');
	const { products, fetchProducts } = useFetchProducts();

	// Input handlers with validation
	const handleProductQTY = (e) => {
		const value = e.target.value;
		if (/^\d*$/.test(value)) {
			setProductQTY(value);
		}
	};
	const handleProductSize = (e) => {
		const value = e.target.value;
		if (/^\d*$/.test(value)) {
			setProductSize(value);
		}
	};

	// Submit handler
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await addDoc(collection(db, 'products'), {
				name: productName,
				brand: productBrand,
				quantity: productQTY,
				size: productSize,
				timestamp: new Date(),
			});

			// Reset form fields after successful submission
			setProductName('');
			setProductBrand('');
			setProductQTY('');
			setProductSize('');
		} catch (error) {
			console.error('Error adding document: ', error);
			alert('Failed to add product. Please try again.');
		}
	};

	const deleteEvent = async (productID) => {
		try {
			console.log('Deleting product with ID:', productID);

			const product = products.find((p) => p.id === productID);
			if (!product) return;

			console.log('Deleting product:', product.name);

			const productRef = doc(db, 'products', productID);
			await deleteDoc(productRef);

			await fetchProducts();
		} catch (error) {
			console.error('Error deleting event:', error);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, [products]);

	return (
		<form className={productFormStyle.productForm} onSubmit={handleSubmit}>
			<div className={productFormStyle.productInput_wrapper}>
				<div className={productFormStyle.productName}>
					<textarea
						type="text"
						name="productName"
						placeholder="Enter product name"
						value={productName}
						onChange={(e) => {
							if (e.target.value.length <= 60) {
								setProductName(e.target.value);
							}
						}}
					/>
				</div>
				<div className={productFormStyle.productBrand}>
					<textarea
						type="text"
						name="productBrand"
						placeholder="Enter brand name"
						value={productBrand}
						onChange={(e) => {
							if (e.target.value.length <= 30) {
								setProductBrand(e.target.value);
							}
						}}
					/>
				</div>
			</div>
			<div style={{ display: 'flex', gap: '1rem' }}>
				<div>
					<input
						type="number"
						name="productQTY"
						placeholder="ml"
						className={productFormStyle.productQTY_input}
						value={productQTY}
						onChange={handleProductQTY}
					/>
				</div>
				<div>
					<input
						type="number"
						name="productSize"
						placeholder="mg"
						className={productFormStyle.productSize_input}
						value={productSize}
						onChange={handleProductSize}
					/>
				</div>
			</div>
			<button
				className={productFormStyle.productSubmit_button}
				type="button"
				onClick={handleSubmit}
			>
				<i className="bx bx-plus"></i>
				Add JUICE
			</button>
			<div className={productFormStyle.productList}>
				{products.map((prod) => (
					<div key={prod.id} className={productFormStyle.productItem}>
						<div className={productFormStyle.productName}>{prod.name}</div>
						<div className={productFormStyle.productListBrand}>{prod.brand}</div>
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<span style={{ width: 'max-content' }}>{prod.quantity} ml</span>
							<span style={{ width: 'max-content' }}>{prod.size} mg</span>
						</div>
						<button
							className={productFormStyle.deleteButton}
							type="button"
							onClick={() => {
								deleteEvent(prod.id);
							}}
						>
							<i className="bx bx-x" style={{ backgroundColor: 'black', color: 'white' }}></i>
						</button>
					</div>
				))}
			</div>
		</form>
	);
};

export default ProductForm;
