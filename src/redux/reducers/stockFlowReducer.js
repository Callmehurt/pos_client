const initialState = {
    stockFlows: []
}

export const stockFlowReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case 'FETCH_STOCK_FLOWS':
            return {...state, stockFlows: payload};
        default:
            return state;
    }
}