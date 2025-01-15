import { createStore } from 'redux';
import { Product } from '../interfaces/product-interface';

// Definir el tipo para el estado
interface State {
  products: Product[];
  selectedProducts: Product[];
}

// Estado inicial
const initialState: State = {
  products: [],
  selectedProducts: [],
};

// Reducer
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
    default:
      return state;
  }
};

const store = createStore(rootReducer);

export default store;
