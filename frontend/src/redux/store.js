import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import postSlice from "./postSlice";
import chatSlice from "./chatSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import rtnSlice from "./rtnSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  post:postSlice,
  chat:chatSlice,
  realTimeNotification:rtnSlice,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["chat"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'chat/setSocket'],
        ignoredPaths: ['chat.socket'],
      },
    }),
});

export default store;
