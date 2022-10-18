
export const fetchProducts = (products) => {
    return {
        type: 'FETCH_PRODUCTS',
        payload: products
    }
}