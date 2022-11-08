export const fetchAllExpenses = (data) => {
    return{
        type: 'FETCH_EXPENSES',
        payload: data
    }
}