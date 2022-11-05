const initialState = {
    staffList: []
}

export const staffReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case 'FETCH_STAFFS':
            return {...state, staffList: payload};
        default:
            return state;

    }
}