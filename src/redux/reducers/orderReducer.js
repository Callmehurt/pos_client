const initialState = {
    orders: []
}

export const orderReducer = (state = initialState, {type, payload}) => {
    switch (type){
        case 'FETCH_ALL_ORDERS':
            return {...state, orders: payload};
        default:
            return state;
    }
}