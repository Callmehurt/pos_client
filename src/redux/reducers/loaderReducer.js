const initialState = {
    isLoading: false
}

export const loaderReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case 'SET_LOADING_TRUE':
            return {...state, isLoading: true};
        case 'SET_LOADING_FALSE':
            return {...state, isLoading: false}
        default:
            return state;
    }
}