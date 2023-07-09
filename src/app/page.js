"use client";
import Carousel from "../../components/Carousel ";
import Footer from "../../components/Footer";
import MovingText from "../../components/MovingText";
import Navbar from "../../components/Navbar";
import authReducer from "../store";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PURGE,
	REGISTER,
	PERSIST,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export default function Home() {
	return (
		<>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistStore(store)}>
					<Navbar />
					<Carousel />
					<MovingText />
					<Footer />
				</PersistGate>
			</Provider>
		</>
	);
}
