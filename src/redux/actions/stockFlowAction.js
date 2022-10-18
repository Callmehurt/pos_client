export const fetchStockRecord = (records) => {
    return {
        type: 'FETCH_STOCK_FLOWS',
        payload: records
    }
}