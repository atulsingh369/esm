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
import "./load.css";

const Data = () => {

	const [data, setData] = useState([]);
	const [user, setUser] = useState(null);
	const [loader, setLoader] = useState(true);
	const searchParams = useSearchParams()
	const userEmail = searchParams.get('userEmail');

	// User is currently on this page
	const [currentPage, setCurrentPage] = useState(1);
	// No of Records to be displayed on each page   
	const [recordsPerPage] = useState(10);

	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;


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

	const print = () => {
		let printC = document.getElementById('data');
		let originalContents = document.body.innerHTML;
		printC.children[2].children[1].classList.remove("overflow-scroll");
		document.body.innerHTML = printC.innerHTML;
		window.print();
		printC.children[2].children[1].classList.add("overflow-scroll");
		document.body.innerHTML = originalContents;
	}

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

					{user && user.role == "admin" ?
						<div id="data" className="px-5 print:text-black">
							<div className="flex justify-evenly items-center">
								<img
									src="https://ik.imagekit.io/e5ixuxrlb/esm/logo.png?updatedAt=1685270347657"
									alt="logo"
									className="h-20 mx-0 lg:mx-2 lg:h-32"
								/>
								<p className="text-lg underline underline-offset-4 lg:text-2xl font-semibold">
									भूतपूर्व सैनिक जन कल्याण समिति, उत्तर प्रदेश
								</p>
							</div>
							<h1 id="heading1">
								Members Data
							</h1>

							{data ?
								<div className="space-y-12">
									{data.length > 0 && <div className="text-2xl font-semibold flex justify-end">Total Count : {data.length}</div>}
									<div className="h-96 overflow-scroll bg-logo/10 bg-repeat-y bg-auto bg-center">
										<table className="w-full text-xl rounded-box backdrop-opacity-10">
											<tr>
												<th className="py-4 border-2 border-white">Reg No</th>
												<th className="py-4 border-2 border-white">Name</th>
												<th className="py-4 border-2 border-white">Father&apos;s Name</th>
												<th className="py-4 border-2 border-white">Service No</th>
												<th className="py-4 border-2 border-white">Service Field</th>
												<th className="py-4 border-2 border-white">Mobile No</th>
												<th className="py-4 border-2 border-white">Aadhar No</th>
												<th className="py-4 border-2 border-white">Address</th>
											</tr>
											{data.map((item, index) => {
												return (
													<tr key={index} className={index % 2 == 0 && "bg-green-900"}>
														<td className="text-center py-4 border-2 border-white">{item.RegNo}</td>
														<td className="text-center py-4 border-2 border-white">{item.displayName}</td>
														<td className="text-center py-4 border-2 border-white">{item.fatherName}</td>
														<td className="text-center py-4 border-2 border-white">{item.serviceNo}</td>
														<td className="text-center py-4 border-2 border-white">{item.serviceField}</td>
														<td className="text-center py-4 border-2 border-white">{item.phoneNo}</td>
														<td className="text-center py-4 border-2 border-white">{item.aadharNo}</td>
														<td className="text-center py-4 border-2 border-white">{item.address}</td>
													</tr>
												)
											})}
										</table>
									</div>

									<div className="flex justify-center">
										<button className="button4 w-full lg:w-1/4" onClick={print}>
											<span className="circle1"></span>
											<span className="circle2"></span>
											<span className="circle3"></span>
											<span className="circle4"></span>
											<span className="circle5"></span>
											<span className="text">Print</span>
										</button>
									</div>
								</div>
								:
								<p className="text-center text-2xl my-48">😕 No Data Found 😕</p>
							}
							<ToastContainer />
						</div >
						: <p className="text-center text-2xl my-48">👿 You are not an Admin 👿</p >
					}

					<Footer />
				</>
			)
				: <Loader />
			}
		</>
	);
}

export default Data;