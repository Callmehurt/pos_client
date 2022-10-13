
export const fetchUnitGroup = (data) => {
    return {
        type: 'FETCH_UNIT_GROUP',
        payload: data
    }
}

export const fetchAllUnits = (data) => {
    return {
        type: 'FETCH_UNITS',
        payload: data
    }
}
