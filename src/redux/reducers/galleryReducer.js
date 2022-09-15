const initialState = {
    gallery: []
}

export const galleryReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case 'FETCH_MEDIAS':
            return {...state, gallery: payload};
        default:
            return state;
    }
}
