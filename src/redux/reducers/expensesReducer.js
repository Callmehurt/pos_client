const initialState = {
    expenseList: []
}

export const expensesReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case 'FETCH_EXPENSES':
            return {...state, expenseList: payload};
        default:
            return state;
    }
}