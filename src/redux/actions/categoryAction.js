export const fetchCategories = (categories) => {
    return {
        type: 'FETCH_CATEGORIES',
        payload: categories
    }
}