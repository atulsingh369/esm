"use client";
import { db } from "@/app/config";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from "react";
import "./load.css";
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./load.css";

const EditDetails = () => {
	const [data, setData] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);

	// const [editDetails, setEditDetails] = useState(false); // Store permission to edit details

	const [confirm, setConfirm] = useState(false);

	const searchParams = useSearchParams()

	const email = searchParams.get('email');
	const userEmail = searchParams.get('userEmail');

	//Getting User Details
	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(collection(db, "users"), where("email", "==", email)),
			(querySnapshot) => {
				querySnapshot.forEach((doc) => {
					setData(doc.data());
				});
			}
		);

		const unsub = onSnapshot(
			query(collection(db, "users"), where("email", "==", userEmail)),
			(querySnapshot) => {
				querySnapshot.forEach((doc) => {
					setUser(doc.data());
				});
			}
		);

		return () => {
			unsubscribe;
			unsub;
		};
	}, [email, userEmail]);

	//Delete Member
	const deleteMember = async () => {
		setLoading(true);
		if (user.role !== "admin") {
			toast.error("No Permission to Delete");
			return;
		}
		try {
			await deleteDoc(doc(db, "users", data.email));
			toast.success("Member Deleted Succesfully")
			setTimeout(() => {
				window.location.href = `/Members?email=${userEmail}`;
			}, 1000);
		} catch (error) {
			toast.error(error);
		}
		setLoading(false)
	}


	return (
		<>

			<FuncNavbar />

			<div className="lg:px-56 px-5">
				<h1 id="heading1">
					Member
				</h1>

				{data ?
					// !editDetails ? (
					<div className="select-none">
						{user && user.role == "admin" &&
							<div className="flex flex-col justify-center lg:mb-0 mb-10">
								<p className="text-xl lg:text-2xl font-semibold">
									Registration No : {data.RegNo}
								</p>
								<p className="text-xl lg:text-2xl font-semibold">
									Type : {data.role}
								</p>
							</div>
						}
						<div className="flex flex-col-reverse lg:flex-row justify-between lg:items-center">
							<div className="space-y-4">
								<p className="text-xl lg:text-2xl font-semibold">
									Name : Mr. {data.displayName}
								</p>
								<p className="text-xl lg:text-2xl font-semibold">
									Father Name : Shri {data.fatherName}
								</p>
								<p className="text-xl lg:text-2xl font-semibold">
									D.O.B. : {data.DOB}
								</p>
								<p className="text-xl lg:text-2xl font-semibold">
									Service No : {data.serviceNo}
								</p>
								<p className="text-xl lg:text-2xl font-semibold">
									Service Field : {data.serviceField}
								</p>
							</div>

							<div className="lg:w-96 lg:mb-0 mb-10 lg:h-96 w-80 h-80">
								<img
									src={data.photoURL}
									className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
									alt="Profile"
								/>
							</div>
						</div>

						<div className="flex flex-col lg:mt-0 mt-4 lg:flex-row justify-between lg:items-center">
							<div className="space-y-4">
								{user && user.role == "admin" &&
									<div className="flex flex-col justify-center lg:mb-0 mb-10">
										<p className="text-xl lg:text-2xl font-semibold">
											Aadhar No : {data.aadharNo}
										</p>
										<p className="text-xl lg:text-2xl font-semibold">
											Pan No : {data.panNo}
										</p>
									</div>
								}

								<p className="text-xl lg:text-2xl font-semibold">
									Email : {data.email}
								</p>
								<p className="text-xl lg:text-2xl font-semibold">
									Mobile No : {data.phoneNo}
								</p>
								{data.secPhoneNo &&
									<p className="text-xl lg:text-2xl font-semibold">
										Secondary Mobile No : {data.secPhoneNo}
									</p>
								}
								{data.tempAdd &&
									<p className="text-xl lg:text-2xl font-semibold">
										Temporary Address : {data.tempAdd}
									</p>
								}
								<p className="text-xl lg:text-2xl font-semibold">
									Address : {data.address}
								</p>
							</div>

							{user && user.role == "admin" &&
								<div className="flex justify-between mt-10 items-center lg:w-1/2 w-full">
									<div className="w-36 lg:w-56 h-36 lg:h-56">
										<img
											src={data.aadharUrl1}
											className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
											alt="AadharFront"
										/>
									</div>
									<div className="w-36 lg:w-56 h-36 lg:h-56">
										<img
											src={data.aadharUrl2}
											className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
											alt="AadharBack"
										/>
									</div>
								</div>
							}

						</div>

						{/* {user && user.role == "admin" &&
								<div className="flex justify-center items-center lg:mt-10">
									<button
										onClick={() => setEditDetails(true)}
										className="button4">
										<span className="circle1"></span>
										<span className="circle2"></span>
										<span className="circle3"></span>
										<span className="circle4"></span>
										<span className="circle5"></span>
										<span className="text">Edit Details</span>
									</button>
								</div>
							} */}


						{user && user.role == "admin" &&
							<div className="flex justify-center items-center lg:mt-10">
								{!confirm ?
									<button
										onClick={() => setConfirm(true)}
										className="button4 ring-4 ring-[#dc3545]">
										<span className="circle1"></span>
										<span className="circle2"></span>
										<span className="circle3"></span>
										<span className="circle4"></span>
										<span className="circle5"></span>
										<span className="text">Delete Member</span>
									</button>
									:
									<button
										onClick={deleteMember}
										className="px-5 py-3 text-white rounded-xl bg-[#dc3545] scale-150 border-2 border-white">
										<span className="circle1"></span>
										<span className="circle2"></span>
										<span className="circle3"></span>
										<span className="circle4"></span>
										<span className="circle5"></span>
										<span className="text">
											{loading ?
												<div className="spinner">
													<div></div>
													<div></div>
													<div></div>
													<div></div>
													<div></div>
													<div></div>
												</div>
												: `Delete Mr. ${data.displayName} !!`}
										</span>
									</button>}

							</div>
						}

					</div>
					// 	) : (
					// 		<div className="select-none">
					// 			{user && user.role == "admin" &&
					// 				<div className="flex flex-col justify-center lg:mb-0 mb-10">
					// 					<p className="text-xl lg:text-2xl font-semibold">
					// 						Registration No : {data.RegNo}
					// 					</p>
					// 					<p className="text-xl lg:text-2xl font-semibold">
					// 						Type : {data.role}
					// 					</p>
					// 				</div>
					// 			}
					// 			<div className="flex flex-col-reverse lg:flex-row justify-between lg:items-center">
					// 				<div className="space-y-4">


					// 					<div disabled className="text-xl lg:text-2xl cursor-not-allowed font-semibold">
					// 						Name : Mr. {data.displayName}
					// 					</div>


					// 					<div disabled className="text-xl lg:text-2xl cursor-not-allowed font-semibold">
					// 						Father Name : Shri {data.fatherName}
					// 					</div>


					// 					<div disabled className="text-xl lg:text-2xl cursor-not-allowed font-semibold">
					// 						D.O.B. :  {data.DOB}
					// 					</div>
					// 					<p className="text-xl lg:text-2xl font-semibold">
					// 						Service No : {data.serviceNo}
					// 					</p>
					// 					<p className="text-xl lg:text-2xl font-semibold">
					// 						Service Field : {data.serviceField}
					// 					</p>
					// 				</div>

					// 				<div className="lg:w-96 lg:mb-0 mb-10 lg:h-96 w-80 h-80">
					// 					<img
					// 						src={data.photoURL}
					// 						className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
					// 						alt="Profile"
					// 					/>
					// 				</div>
					// 			</div>

					// 			<div className="flex flex-col lg:mt-0 mt-4 lg:flex-row justify-between lg:items-center">
					// 				<div className="space-y-4">
					// 					{user && user.role == "admin" &&
					// 						<div className="flex flex-col justify-center lg:mb-0 mb-10">
					// 							<p className="text-xl lg:text-2xl font-semibold">
					// 								Aadhar No : {data.aadharNo}
					// 							</p>
					// 							<p className="text-xl lg:text-2xl font-semibold">
					// 								Pan No : {data.panNo}
					// 							</p>
					// 						</div>
					// 					}

					// 					<p className="text-xl lg:text-2xl font-semibold">
					// 						Email : {data.email}
					// 					</p>
					// 					<p className="text-xl lg:text-2xl font-semibold">
					// 						Mobile No : {data.phoneNo}
					// 					</p>
					// 					{data.secPhoneNo &&
					// 						<p className="text-xl lg:text-2xl font-semibold">
					// 							Secondary Mobile No : {data.secPhoneNo}
					// 						</p>
					// 					}
					// 					{data.tempAdd &&
					// 						<p className="text-xl lg:text-2xl font-semibold">
					// 							Temporary Address : {data.tempAdd}
					// 						</p>
					// 					}
					// 					<p className="text-xl lg:text-2xl font-semibold">
					// 						Address : {data.address}
					// 					</p>
					// 				</div>

					// 				{user && user.role == "admin" &&
					// 					<div className="flex justify-between mt-10 items-center lg:w-1/2 w-full">
					// 						<div className="w-36 lg:w-56 h-36 lg:h-56">
					// 							<img
					// 								src={data.aadharUrl1}
					// 								className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
					// 								alt="AadharFront"
					// 							/>
					// 						</div>
					// 						<div className="w-36 lg:w-56 h-36 lg:h-56">
					// 							<img
					// 								src={data.aadharUrl2}
					// 								className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
					// 								alt="AadharBack"
					// 							/>
					// 						</div>
					// 					</div>
					// 				}

					// 			</div>

					// 			{user && user.role == "admin" &&
					// 				<div className="flex justify-center items-center lg:mt-10">
					// 					<button
					// 						onClick={() => setEditDetails(false)}
					// 						className="button4">
					// 						<span className="circle1"></span>
					// 						<span className="circle2"></span>
					// 						<span className="circle3"></span>
					// 						<span className="circle4"></span>
					// 						<span className="circle5"></span>
					// 						<span className="text">Go Back</span>
					// 					</button>
					// 				</div>
					// 			}
					// 		</div>
					// )
					:
					<p className="text-center text-2xl my-48">😕 No Data Found 😕</p>
				}
				<ToastContainer />
			</div >

			<Footer />
		</>
	);
};

export default EditDetails;