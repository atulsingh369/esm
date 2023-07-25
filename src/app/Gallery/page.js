"use client";
import { db } from "@/app/config";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";
import Loader from "../../../components/Loader";
import { Fade } from "react-awesome-reveal";

const Gallery = () => {
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

					<div className="p-5">
						<h1 id="heading1">
							Our Memories
						</h1>
						{data ? (
							<ul className="flex items-center justify-center flex-wrap">
								{data.map((item, index) => (
									<Fade delay={10} key={index}>
										<li className="h-72 m-3 hover:scale-105 transition-all ease-in-out duration-300 grow p-2 border-4 items-center border-white rounded-box">
											<img
												src={item.URL}
												alt="Gallery"
												className="max-h-full min-w-full rounded-box object-cover align-bottom"
											/>
										</li>
									</Fade>
								))}

								<li className="flex grow-10"></li>
							</ul>
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

export default Gallery;