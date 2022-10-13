import { combineReducers } from "redux";
import {authReducer} from "./authReducer";
import {galleryReducer} from "./galleryReducer";
import {unitReducer} from "./unitReducer";
import {categoryReducer} from "./categoryReducer";

const reducers = combineReducers({
    authentication: authReducer,
    gallery: galleryReducer,
    units: unitReducer,
    categories: categoryReducer
})

export default reducers;