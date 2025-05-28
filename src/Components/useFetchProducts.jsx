import { useEffect, useState } from 'react';
import { db, collection, getDocs } from './firebase';

export default function useFetchProducts(refresh) {
    const [products, setProducts] = useState([]);

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

	useEffect(() => {
		fetchProducts();
	}, [refresh]);

    return { products, fetchProducts };
}
