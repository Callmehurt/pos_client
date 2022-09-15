import { combineReducers } from "redux";
import {authReducer} from "./authReducer";
import {galleryReducer} from "./galleryReducer";

const reducers = combineReducers({
    authentication: authReducer,
    gallery: galleryReducer
})

export default reducers;