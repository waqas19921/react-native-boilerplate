import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { api } from '../services/api';
import theme from './theme';
import { reduxStorage } from '../utils/storage';

const reducers = combineReducers({
  theme,
  [api.reducerPath]: api.reducer,
});

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['theme', 'auth'],
};

const persistedReducer = persistReducer(persistConfig, reducers);
const tronEnhancer = console.tron?.createEnhancer?.();

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware);

    if (__DEV__ && !process.env.JEST_WORKER_ID) {
      const createDebugger = require('redux-flipper').default;
      middlewares.push(createDebugger());
    }

    return middlewares;
  },
  // @ts-ignore
  enhancers: defaultEnhancers =>
    tronEnhancer ? [...defaultEnhancers, tronEnhancer] : defaultEnhancers,
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export { store, persistor };
