import { createStore } from 'redux';
import { Product } from '../interfaces/product-interface';


/**
 * Se define el tipo de estado. Product
 *
 * @interface State
 */
interface State {
  products: Product[];
  selectedProducts: Product[];
}


/** @type {*} Estado Inicial */
const initialState: State = {
  products: [],
  selectedProducts: [],
};


/**
 *Tipos de reducer.
 *
 * @param {*} [state=initialState]
 * @param {*} action
 * @return {*}  {State}
 */
const rootReducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, selectedProducts: [...state.selectedProducts, action.payload] };
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        selectedProducts: state.selectedProducts.filter(product => product.id !== action.payload),
      };
    case 'REMOVE_PRODUCTALL':
      return {
        ...state,
        selectedProducts: [],
      };
    default:
      return state;
  }
};


const store = createStore(rootReducer);

export default store;
