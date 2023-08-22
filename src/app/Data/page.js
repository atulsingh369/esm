"use client";

import React, { useEffect, useState } from "react";
import { db } from "../config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";
import { useSearchParams } from 'next/navigation'
import Loader from "../../../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Data = () => {

	const [data, setData] = useState([]);
	const [user, setUser] = useState(null);
	const [loader, setLoader] = useState(true);

	const searchParams = useSearchParams()

	const userEmail = searchParams.get('email');

	// Getting Members Data
	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(collection(db, "users"), where("RegNo", "!=", 0)),
			(querySnapshot) => querySnapshot.forEach((doc) => setData(data => [...data, doc.data()]))
		);

		const unsub = onSnapshot(
			query(collection(db, "users"), where("email", "==", userEmail)),
			(querySnapshot) => querySnapshot.forEach((doc) => setUser(doc.data()))
		);

		return () => {
			unsubscribe;
			unsub;
		}
	}, [userEmail])


	useEffect(() => {
		const onPageLoad = () => {
			setTimeout(() => {
				setLoader(false);
			}, 2000);
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
			{!loader ? (
				<>

					<FuncNavbar />

					<div className=" px-5">
						<h1 id="heading1">
							Members Data
						</h1>

						{data ?
							<div className="flex justify-center items-center flex-wrap">
								{data.map((item, index) => (

									<div key={index} className="">
										<img
											src={item.photoURL}
											className="rounded-box h-64 mx-auto object-cover align-bottom"
											alt="Profile Pic"
										/>
									</div>
								))}
							</div>
							:
							<p className="text-center text-2xl my-48">😕 No Data Found 😕</p>
						}
						<ToastContainer />
					</div >

					<Footer />
				</>
			)
				: <Loader />
			}
		</>
	);
}

export default Data;