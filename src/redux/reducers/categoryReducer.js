const initialState = {
    categories: []
}

export const categoryReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case 'FETCH_CATEGORIES':
            return {...state, categories: payload};
        default:
            return state;
    }
}