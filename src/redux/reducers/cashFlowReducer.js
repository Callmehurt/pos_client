const initialState = {
    cashFlows: [],
    rangedCashFlows: []
}


export const cashFlowReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case 'FETCH_CASH_FLOWS':
            return {...state, cashFlows: payload};
        case 'FETCH_RANGED_CASH_FLOWS':
            return {...state, rangedCashFlows: payload}
        default:
            return state;
    }
}