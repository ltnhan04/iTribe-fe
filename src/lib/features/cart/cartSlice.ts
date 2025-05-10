import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartType } from "@/types/cart";

export interface CartState {
  cart: CartType[];
  total: number;
}

const initialState: CartState = {
  cart: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartType>) => {
      const itemIndex = state.cart.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex === -1) {
        state.cart.push(action.payload);
        state.total += action.payload.quantity * action.payload.price;
      }
    },
    removeToCart: (state, action: PayloadAction<string>) => {
      const index = state.cart.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.total -= state.cart[index].quantity * state.cart[index].price;
        state.cart.splice(index, 1);
      }
    },
    updateCart: (state, action: PayloadAction<CartType[]>) => {
      state.cart = action.payload;
      state.total = state.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    clearCart: (state) => {
      state.cart = [];
      state.total = 0;
    },
  },
});

export const { addToCart, removeToCart, updateCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
