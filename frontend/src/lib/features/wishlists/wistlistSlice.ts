import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WishlistType } from "@/types/wishlist";

export interface WishlistsState {
  wishlists: WishlistType[];
}

const initialState: WishlistsState = {
  wishlists: [],
};

const wishlistsSlice = createSlice({
  name: "wishlists",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistType>) => {
      state.wishlists.push(action.payload);
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.wishlists = state.wishlists.filter(
        (wishlist) => wishlist.id !== action.payload
      );
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistsSlice.actions;
export default wishlistsSlice.reducer;
