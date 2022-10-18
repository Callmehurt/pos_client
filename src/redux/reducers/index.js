import { combineReducers } from "redux";
import {authReducer} from "./authReducer";
import {galleryReducer} from "./galleryReducer";
import {unitReducer} from "./unitReducer";
import {categoryReducer} from "./categoryReducer";
import {productReducer} from "./productReducer";
import {loaderReducer} from "./loaderReducer";
import {stockFlowReducer} from "./stockFlowReducer";
import {providerReducer} from "./providerReducer";
import {procurementReducer} from "./procurementReducer";

const reducers = combineReducers({
    authentication: authReducer,
    gallery: galleryReducer,
    units: unitReducer,
    categories: categoryReducer,
    products: productReducer,
    loading: loaderReducer,
    stockFlowRecords: stockFlowReducer,
    providersList: providerReducer,
    procurements: procurementReducer
});

export default reducers;