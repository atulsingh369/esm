"use client";
import { db } from "@/app/config";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";

const EditDetails = () => {
	const [data, setData] = useState(null);

	// Getting data
	const docRef = doc(db, "gallery", "images");

	useEffect(() => {
		const unsub = onSnapshot(docRef, (doc) => {
			if (doc.data().images.length > 0) {
				setData(doc.data().images);
			}
		});

		return () => {
			unsub;
		};
	}, [docRef]);


	return (
		<>

			<FuncNavbar />

			<div className="p-5">
				<h1 id="heading1">
					Page is Under Construction
				</h1>

			</div>

			<Footer />
		</>
	);
};

export default EditDetails;