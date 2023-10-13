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
import axios from "axios";

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
			(querySnapshot) => querySnapshot.forEach((doc) => {
				setData(data => [...data, doc.data()]);
				// axios.post("https://sheet.best/api/sheets/b37ad7c9-f3f0-44a9-9752-b995b2986b56",
				// 	{
				// 		"REG NO": doc.data().RegNO,
				// 		SERVICE: doc.data().serviceField,
				// 		"SERVICE NO": doc.data().serviceNo,
				// 		NAME: doc.data().name,
				// 		"FATHER NAME": doc.data().fatherName,
				// 		EMAIL: doc.data().email,
				// 		DOB: doc.data().DOB,
				// 		"JOINING DATE": doc.data().DOJ,
				// 		"MBL NO": doc.data().phoneNo,
				// 		"CURRENT EMP": doc.data().currentEMP,
				// 		"AADHAR NO": doc.data().aadharNo,
				// 		ADDRESS: doc.data().address,
				// 		"TEMP ADD": doc.data().tempAdd,
				// 		"PAN NO": doc.data().panNo,
				// 	}, {
				// 	headers: {
				// 		"Content-Type": "application/json",
				// 	},
				// 	mode: "cors",
				// })
				// 	.then((res) => {
				// 		// The response comes here
				// 		console.log(res);
				// 	})
				// 	.catch((error) => {
				// 		// Errors are reported there
				// 		console.log(error);
				// 	});
			})
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
		let printDiv = document.getElementById('print');
		let originalContents = document.body.innerHTML;
		printC.children[2].children[2].classList.remove("overflow-y-scroll");
		printC.children[2].children[2].classList.remove("border-4");
		printC.children[2].children[1].classList.add("hidden");
		document.body.innerHTML = printC.innerHTML;
		window.print();
		printC.children[2].children[2].classList.add("overflow-y-scroll");
		printC.children[2].children[2].classList.add("border-4");
		printC.children[2].children[1].classList.remove("hidden");
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

					{user || user.role != "admin" ?
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
								<div className="space-y-12 mx-2">
									{data.length > 0 && <div className="text-2xl font-semibold flex justify-end">Total Count : {data.length}</div>}

									<div id="print" className="flex justify-center">
										<button className="button4 w-full lg:w-1/4" onClick={print}>
											<span className="circle1"></span>
											<span className="circle2"></span>
											<span className="circle3"></span>
											<span className="circle4"></span>
											<span className="circle5"></span>
											<span className="text flex justify-center items-center text-xl">
												Print &nbsp;&nbsp;
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="24"
													height="24"
													viewBox="0 0 24 24"
												>
													<path
														fill="currentColor"
														d="M18 7H6V3h12v4Zm0 5.5q.425 0 .713-.288T19 11.5q0-.425-.288-.713T18 10.5q-.425 0-.713.288T17 11.5q0 .425.288.713T18 12.5ZM16 19v-4H8v4h8Zm2 2H6v-4H2v-6q0-1.275.875-2.138T5 8h14q1.275 0 2.138.863T22 11v6h-4v4Z"
													/>
												</svg>
											</span>
										</button>
									</div>

									<div className="h-[65rem] rounded-box border-4 border-t-orange-600 border-b-green-600 overflow-y-scroll scroll bg-logo/10 bg-repeat-y bg-auto bg-center">
										<table className="w-full text-lg rounded-box backdrop-opacity-10">
											<tr>
												<th className="py-4 border-2 border-white">Reg No</th>
												<th className="py-4 border-2 border-white">Name</th>
												<th className="py-4 border-2 border-white">Father&apos;s Name</th>
												<th className="py-4 border-2 border-white">Service No</th>
												<th className="py-4 border-2 border-white">Service Field</th>
												<th className="py-4 border-2 border-white">Current EMP</th>
												<th className="py-4 border-2 border-white">Date of Joining</th>
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
														<td className="text-center py-4 border-2 border-white">{item.currentEMP}</td>
														<td className="text-center py-4 border-2 border-white">{item.DOJ}</td>
														<td className="text-center py-4 border-2 border-white">{item.phoneNo}</td>
														<td className="text-center py-4 border-2 border-white">{item.aadharNo}</td>
														<td className="text-center py-4 border-2 border-white">{item.address}</td>
													</tr>
												)
											})}
										</table>
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
