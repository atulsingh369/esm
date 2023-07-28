"use client";
import { db } from "@/app/config";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";
import Loader from "../../../components/Loader";
import { Fade } from "react-awesome-reveal";

const Notices = () => {
	const [data, setData] = useState(null);

	// Getting data
	const docRef = doc(db, "Notice Media", "Media");

	useEffect(() => {
		const unsub = onSnapshot(docRef, (doc) => {
			if (doc.data().media.length > 0) {
				setData(doc.data().media);
			}
		});

		return () => {
			unsub;
		};
	}, [docRef]);

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

					<div className="py-5">
						<h1 id="heading1">
							Notices
						</h1>
						{data ? (
							<div className="flex space-y-12 md:space-y-0 md:space-x-24 items-justify-evenly justify-center flex-wrap">
								{data.map((item, index) => (
									<Fade delay={10} key={index}>
										<div className="flex flex-col justify-evenly rounded-box h-96  items-center space-y-4">
											<object
												data={item.MediaURL}
												className="rounded-box"
												type="application/pdf"
												width="100%"
												height="100%">
											</object>
											<p className="font-semibold text-2xl">{item.Name}</p>
											<p className="font-semibold text-xl">Uploaded On : {item.Date ? item.Date : "N/A"}</p>
										</div>
									</Fade>
								))}

							</div>
						) : (
							<p className="text-center text-2xl my-48">😕 No Data Found 😕</p>
						)}
					</div>

					<Footer />
				</>
			) : (
				<Loader />
			)
			}
		</>
	);
};

export default Notices;