export const fetchCashFlows = (data) => {
    return {
        type: 'FETCH_CASH_FLOWS',
        payload: data
    }
}

export const fetchRangedCashFlows = (data) => {
      return {
        type: 'FETCH_RANGED_CASH_FLOWS',
        payload: data
    }
}