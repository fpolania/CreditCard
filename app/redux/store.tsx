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
  encryptedCardData: null,
}


/** @type {*} Estado Inicial */
const initialState: State = {
  products: [],
  selectedProducts: [],
  encryptedCardData: null,
};


/**
 *Tipos de reducer.
 *
 * @param {*} [state=initialState]
 * @param {*} action
 * @return {*}  {State}
 */
export const rootReducer = (state = initialState, action: any): State => {
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
    case 'STORE_CREDIT_CARD':
      return { ...state, encryptedCardData: action.payload };
    case 'CLEAR_CREDIT_CARD_DATA':
      return {
        ...state,
        encryptedCardData: null,
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
