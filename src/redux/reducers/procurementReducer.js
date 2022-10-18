const initialState = {
    procurementList: []
}

export const procurementReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case 'FETCH_PROCUREMENTS':
            return {...state, procurementList: payload};
        default:
            return state;
    }
}