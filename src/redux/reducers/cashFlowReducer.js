const initialState = {
    cashFlows: []
}


export const cashFlowReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case 'FETCH_CASH_FLOWS':
            return {...state, cashFlows: payload};
        default:
            return state;
    }
}