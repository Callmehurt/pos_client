const initialState = {
    unitGroup: [],
    units: []
}


export const unitReducer = (state=initialState, {type, payload}) => {
    switch (type){
        case 'FETCH_UNIT_GROUP':
            return {...state, unitGroup: payload};
        case 'FETCH_UNITS':
            return {...state, units: payload};
        default:
            return state;
    }
}