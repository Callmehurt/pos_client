
const initialState = {
    availableTables: []
}

export const tableReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case 'FETCH_AVAILABLE_TABLES':
            return {...state, availableTables: payload};
        default:
            return state;
    }
}