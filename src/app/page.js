"use client";
import Carousel from "../../components/Carousel ";
import Footer from "../../components/Footer";
import MovingLogo from "../../components/MovingLogo";
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
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";

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

	const [loader, setLoader] = useState(true);

	useEffect(() => {
		const onPageLoad = () => {
			setTimeout(() => {
				setLoader(false);
			}, 3000);
		};

		// Check if the page has already loaded
		if (document.readyState === "complete") {
			onPageLoad();
		} else {
			window.addEventListener("load", onPageLoad);
			// Remove the event listener when component unmounts
			return () => window.removeEventListener("load", onPageLoad);
		}
	}, []);

	return (
		<>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistStore(store)}>
					{!loader ? (
						<div>
							<Navbar />
							<Carousel />
							<MovingLogo />
							<Footer />
						</div>
					) : (
						<Loader />
					)}
				</PersistGate>
			</Provider>

		</>
	);
}
