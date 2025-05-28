import React, { useEffect, useState } from 'react';
import { db, collection, getDocs } from './firebase';
import productList from './CSS/ProductList.module.css';

const ProductList = (props) => {
	const [products, setProducts] = useState([]);

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

	return (
		<div className={productList.productList}>
			<div className={productList.productList_wrapper}>
				{products.map((product) => (
					<div key={product.id} className={productList.productItem}>
						<div className={productList.productName}>{product.name}</div>
						<div className={productList.productBrand}>{product.brand}</div>
						<div className={productList.productQTY}>{product.quantity}</div>
						<span>ml</span>
						<div className={productList.productSize}>{product.size}</div>
						<span>mg</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProductList;
