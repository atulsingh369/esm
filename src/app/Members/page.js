"use client";
import React, { useEffect, useState } from "react";
import { db } from "../config";
import { collection, onSnapshot } from "firebase/firestore";
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { useSearchParams } from 'next/navigation'
import Loader from "../../../components/Loader";


const Members = () => {

	const [data, setData] = useState([]);

	const searchParams = useSearchParams()

	const userEmail = searchParams.get('email');

	useEffect(() => {
		const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
			querySnapshot.forEach((doc) => {
				setData(data => [...data, doc.data()]);
			});
		});

		return () => {
			unsubscribe;
		}
	}, [])

	const [loader, setLoader] = useState(true);

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

					<h1 id="heading1">Our Members</h1>
					{data ? (
						<div className="flex justify-center items-center flex-wrap">
							{data.map((item, index) => (
								<Link
									key={index}
									href={{
										pathname: "/MemberDetails",
										query: {
											email: item.email,
											userEmail: userEmail,
										},
									}}>
									<div className="m-3 space-y-3 hover:scale-105 transition-all ease-in-out duration-300 p-2 border-4 items-center border-white rounded-box">
										<img
											src={item.photoURL}
											className="rounded-box h-64 mx-auto object-cover align-bottom"
											alt="Profile Pic"
										/>
										<p className="text-center">{item.displayName}</p>
										<p className="text-center">{item.serviceField}</p>
										<p className="text-center">{item.phoneNo}</p>
									</div>
								</Link>
							))}
						</div>) : (
						<p className="text-center text-2xl my-48">😕 No Data Found 😕</p>
					)}
					<Footer />
				</>
			) : (
				<Loader />
			)}
		</>
	)
}

export default Members;