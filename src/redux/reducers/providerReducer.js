const initialState = {
    providers: []
}

export const providerReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case 'FETCH_PROVIDERS':
            return {...state, providers: payload};
        default:
            return state;
    }
}