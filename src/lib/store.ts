import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/es/storage";
import authSlice from "@/lib/features/authentication/authSlice";
import cartSlice from "@/lib/features/cart/cartSlice";
import wishlistsSlice from "@/lib/features/wishlists/wistlistSlice";

const persistConfig = {
  key: "persist",
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  cart: cartSlice,
  wishlist: wishlistsSlice,
});

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

export const makeStore = () => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return makeConfiguredStore();
  } else {
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store: any = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });
    store.__persistor = persistStore(store);
    return store;
  }
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
