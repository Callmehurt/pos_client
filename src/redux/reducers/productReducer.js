const initialState = {
    products: []
}


export const productReducer = (state=initialState, {type, payload}) => {
    switch (type) {
        case 'FETCH_PRODUCTS':
            return {...state, products: payload};
        default:
            return state;
    }
}