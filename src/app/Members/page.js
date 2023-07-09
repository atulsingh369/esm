"use client";
import React, { useEffect, useState } from "react";
import { db } from "../config";
import { collection, onSnapshot } from "firebase/firestore";
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";


const Members = () => {

	const [data, setData] = useState([]);

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
	return (
		<>
			<FuncNavbar />

			<h1 id="heading1">Our Members</h1>
			{data ? (
				<div className="flex justify-center items-center flex-wrap">
					{data.map((item, index) => (
						<div key={index} className="m-3 space-y-3 hover:scale-105 transition-all ease-in-out duration-300 p-2 border-4 items-center border-white rounded-box">
							<img
								src={item.photoURL}
								className="rounded-box h-64 mx-auto object-cover align-bottom"
							/>
							<p className="text-center">{item.displayName}</p>
							<p className="text-center">{item.serviceNo}</p>
							<p className="text-center">{item.serviceField}</p>
							<p className="text-center">{item.phoneNo}</p>
							<p className="text-center">{item.email}</p>
						</div>

					))}
				</div>) : (
				<p className="text-center text-2xl my-48">😕 No Data Found 😕</p>
			)}
			<Footer />
		</>
	)
}

export default Members;