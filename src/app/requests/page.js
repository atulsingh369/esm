"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FuncNavbar from "../../../components/FuncNavabr";
import { db } from "../config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Footer from "../../../components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../components/Loader";

const Request = () => {
	const [data, setData] = useState([]);
	const [user, setUser] = useState(null);
	const [more, setMore] = useState(false);

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

					<h1 id="heading1">Requests</h1>

					{user && user.role == "admin" ?
						data ?
							<>
								<div className="flex items-center justify-center lg:justify-end lg:mx-32 mb-12 lg:text-2xl text-xl">
									Total Requests : 5
								</div>

								<div className="flex justify-center items-center">
									{/* Card */}
									<div className="lg:p-5 p-2 lg:w-1/3 w-full mx-5 lg:mx-0 border-2 border-white rounded-box">
										<div className="flex lg:flex-row flex-col-reverse justify-between lg:items-center">
											{/* Details */}
											<div className="text-xl font-semibold space-y-4">
												<p className="text-3xl">User Name</p>
												<p>User Service</p>
												<p>User Mbl No</p>
												<p>Payment : <span>Done</span></p>
											</div>
											{/* Avatar */}
											<div className="w-56 h-56 lg:mx-0 mx-auto">
												<img
													src="https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697"
													className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
													alt="Avatar"
												/>
											</div>
										</div>

										{/* More */}
										{!more ?
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="30"
												height="30"
												className="mx-auto hover:cursor-pointer animate-bounce"
												onClick={() => setMore(!more)}
												viewBox="0 0 15 15">
												<path
													fill="none"
													stroke="currentColor"
													stroke-linecap="square"
													d="m14 5l-6.5 7L1 5" />
											</svg>
											:
											<div className="flex-col lg:block my-2 lg:my-0">
												{/* Details */}
												<div className="text-xl font-semibold space-y-4">
													<p>Father&apos;s Name : Name</p>
													<p>Aadhar No : 123456789012356</p>
													<p>Address : XYZ</p>
												</div>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="30"
													height="30"
													className="mx-auto hover:cursor-pointer animate-bounce"
													onClick={() => setMore(!more)}
													viewBox="0 0 15 15">
													<path
														fill="none"
														stroke="currentColor"
														stroke-linecap="square"
														d="m1 10l6.5-7l6.5 7" />
												</svg>
											</div>
										}

										{/*buttons*/}
										<div className="flex justify-evenly items-center my-5">
											<button className="bg-green-600 text-white hover:bg-green-900 p-2 px-5 text-xl rounded-box">Accept</button>
											<button className="bg-red-600 text-white hover:bg-red-900 p-2 px-5 text-xl rounded-box">Decline</button>
										</div>

									</div>
								</div>
							</>
							:
							<p className="text-center text-2xl my-48">😕 No Data Found 😕</p>
						:
						<p className="text-center text-2xl my-48">👿 You are not an Admin 👿</p >
					}

					<Footer />
					<ToastContainer />
				</>
			) : (
				<Loader />
			)
			}
		</>
	)
}

export default Request;