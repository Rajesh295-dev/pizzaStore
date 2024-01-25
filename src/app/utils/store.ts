import { ActionTypes, CartType } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_STATE = {
  // products: [] as CartItemType[],
  products: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCartStore = create(
  persist<CartType & ActionTypes>(
    (set, get) => ({
      products: INITIAL_STATE.products,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,
      addToCart(item) {
        const products = get().products;
        const productInState = products.find(
          (product) => product.id === item.id
        );
        if (productInState) {
          const updatedProducts = products.map((product) =>
            product.id === productInState.id
              ? {
                  ...item,
                  quantity: item.quantity + product.quantity,
                  price: item.price + product.price,
                }
              : item
          );
          set((state) => ({
            products: updatedProducts,
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + item.price,
          }));
        } else {
          set((state) => ({
            products: [...state.products, item],
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + item.price,
          }));
        }
      },

      //remove all the  items from cart
      removeFromCart(item) {
        set((state) => ({
          products: state.products.filter((product) => product.id !== item.id),
          totalItems: state.totalItems - item.quantity,
          totalPrice: state.totalPrice - item.price,
        }));
      },

      // reduce or add up  items in the cart cart
      updateQuantity: (itemId: string, newQuantity: number) =>
        set((state) => {
          const updatedCartItems = state.products.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity: Math.max(1, newQuantity),

                  price: parseFloat(
                    (
                      (item.price * Math.max(1, newQuantity)) /
                      item.quantity
                    ).toFixed(2)
                  ),
                }
              : item
          );

          return {
            products: updatedCartItems,
            totalItems: updatedCartItems.reduce(
              (total, item) => total + item.quantity,
              0
            ),
            totalPrice: updatedCartItems.reduce(
              (total, item) => total + item.price,
              0
            ),
          };
        }),
    }),
    { name: "cart", skipHydration: true }
  )
);
