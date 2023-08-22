"use client";
import React, { useEffect, useState } from "react";
import { db } from "../config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { useSearchParams } from 'next/navigation'
import Loader from "../../../components/Loader";
import "./search.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fade } from "react-awesome-reveal";

const Members = () => {

	const [data, setData] = useState([]);
	const [user, setUser] = useState(null);
	const [queryData, setQueryData] = useState([]);
	const [search, setSearch] = useState("");

	const searchParams = useSearchParams()

	const userEmail = searchParams.get('email');

	const searchData = (e) => {
		setSearch(e.target.value);
		setQueryData([]);
		data.forEach((item) => {
			if (item.displayName.toUpperCase().includes(search.trim().toUpperCase())) {
				setQueryData((queryData) => [...queryData, item]);
			}
		})
		search === "" && setQueryData([]);
	}

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


					{/* Search Members */}
					<div className="group lg:w-2/6 w-10/12">
						<input
							className="input text-lg lg:text-xl"
							value={search}
							onChange={(e) => searchData(e)}
							type="search"
							placeholder="Search Members by Name" />
						<svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
							<g>
								<path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
							</g>
						</svg>
					</div>


					<div className="flex items-center justify-center lg:justify-end lg:mx-32 mb-12 lg:text-2xl text-xl">
						Total Members : {queryData.length > 0 ? queryData.length : data.length}
						{/* Members List */}
						{user && user.role == "admin" &&
							<Link
								href={{
									pathname: "/Data",
									query: {
										userEmail: userEmail,
									},
								}}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="36"
									height="36"
									viewBox="0 0 24 24"
									className="ml-5"
								>
									<path
										fill="currentColor"
										d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11l-5 5Zm-6 4q-.825 0-1.413-.588T4 18v-3h2v3h12v-3h2v3q0 .825-.588 1.413T18 20H6Z"
									/>
								</svg>
							</Link>
						}
					</div>

					{queryData.length > 0 ? (
						<div className="flex justify-center items-center flex-wrap">
							{queryData.map((item, index) => (
								item.RegNo !== 0 &&
								<Fade delay={10} key={index}>
									<Link
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
								</Fade>
							))}
						</div>
					) : data ? (
						<div className="flex justify-center items-center flex-wrap">
							{data.map((item, index) => (
								<Fade delay={10} key={index}>
									<Link
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
								</Fade>
							))}
						</div>
					) : (
						<p className="text-center text-2xl my-48">😕 No Data Found 😕</p>
					)}

					<Footer />
					<ToastContainer />
				</>
			) : (
				<Loader />
			)}
		</>
	)
}

export default Members;