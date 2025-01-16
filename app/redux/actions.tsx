import { Product } from '../interfaces/product-interface';


export const SET_PRODUCTS = 'SET_PRODUCTS';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export const REMOVE_PRODUCTALL = 'REMOVE_PRODUCTALL';


export const setProducts = (products: Product[]) => ({
  type: SET_PRODUCTS,
  payload: products,
});

export const addProduct = (product: Product) => ({
  type: ADD_PRODUCT,
  payload: product,
});

export const removeProduct = (productId: string) => ({
  type: REMOVE_PRODUCT,
  payload: productId,
});
export const clearSelectedProducts = () => {
  return {
      type: REMOVE_PRODUCTALL
  };
};
