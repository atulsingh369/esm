"use client";
import { db } from "@/app/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from "react";
import "./load.css";
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";

const EditDetails = () => {
	const searchParams = useSearchParams()

	const [data, setData] = useState(null); // Store data of user
	const [loading, setLoading] = useState(false); // Loading/Unloading
	const [editDetails, setEditDetails] = useState(false); // Store permission to edit details

	const email = searchParams.get('email'); // Store user logined email

	const [avatar, setAvatar] = useState(null); // Store photo upload

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

		return () => {
			unsubscribe;
		};
	}, [email]);

	return (
		<>

			<FuncNavbar />

			<div className="md:px-56 px-5">
				<h1 id="heading1">
					Profile
				</h1>

				{data ?
					!editDetails ? (
						<div>
							<div className="flex flex-col-reverse md:flex-row justify-between md:items-center">
								<div className="space-y-4">
									<p className="text-xl md:text-2xl font-semibold">
										Name : Mr. {data.displayName}
									</p>
									<p className="text-xl md:text-2xl font-semibold">
										Father Name : Mr. {data.fatherName}
									</p>
									<p className="text-xl md:text-2xl font-semibold">
										D.O.B. : {data.DOB}
									</p>
									<p className="text-xl md:text-2xl font-semibold">
										Service No : {data.serviceNo}
									</p>
									<p className="text-xl md:text-2xl font-semibold">
										Service Field : {data.serviceField}
									</p>
								</div>

								<div className="md:w-96 md:mb-0 mb-10 md:h-96 w-80 h-80">
									<img
										src={data.photoURL}
										className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
										alt="Profile"
									/>
								</div>
							</div>

							<div className="flex flex-col md:mt-0 mt-4 md:flex-row justify-between md:items-center">
								<div className="space-y-4">
									<p className="text-xl md:text-2xl font-semibold">
										Aadhar No : {data.aadharNo}
									</p>
									<p className="text-xl md:text-2xl font-semibold">
										Pan No : {data.panNo ? data.panNo : "N/A"}
									</p>
									<p className="text-xl md:text-2xl font-semibold">
										Email : {data.email}
									</p>
									<p className="text-xl md:text-2xl font-semibold">
										Mobile No : {data.phoneNo}
									</p>
									<p className="text-xl md:text-2xl font-semibold">
										Secondary Mobile No : {data.secPhoneNo ? data.secPhoneNo : "N/A"}
									</p>
									<p className="text-xl md:text-2xl font-semibold">
										Temporary	Address : {data.tempAdd ? data.tempAdd : "N/A"}
									</p>
									<p className="text-xl md:text-2xl font-semibold">
										Address : {data.address}
									</p>
								</div>

								<div className="flex justify-between mt-10 items-center md:w-1/2 w-full">
									<div className="w-36 md:w-56 h-36 md:h-56">
										<img
											src={data.aadharUrl1}
											className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
											alt="AadharFront"
										/>
									</div>
									<div className="w-36 md:w-56 h-36 md:h-56">
										<img
											src={data.aadharUrl2}
											className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
											alt="AadharBack"
										/>
									</div>
								</div>
							</div>

							{/* Edit Details Button */}
							<div className="flex justify-center items-center md:mt-10">
								<button
									className="button4"
									onClick={() => setEditDetails(true)}>
									<span className="circle1"></span>
									<span className="circle2"></span>
									<span className="circle3"></span>
									<span className="circle4"></span>
									<span className="circle5"></span>
									<span className="text">Edit Details</span>
								</button>
							</div>

						</div>
					) : (
						<div>
							<div className="flex flex-col-reverse md:flex-row justify-between md:items-center">
								<div className="space-y-4">

									<p disabled className="text-xl md:text-2xl cursor-not-allowed font-semibold">
										Name : Mr. {data.displayName}
									</p>


									<p disabled className="text-xl md:text-2xl cursor-not-allowed font-semibold">
										Father Name : Mr. {data.fatherName}
									</p>


									<p className="text-xl md:text-2xl flex items-center font-semibold">
										<span className="mr-5">D.O.B. : </span>
										<div className="field">                              {/*DOB*/}
											<input
												required
												autoComplete='off'
												name="DOB"
												placeholder={data.DOB}
												className="input-field"
												type="date"
											// value={curUser.name}
											// onChange={(e) =>
											// 	setCurUser({ ...curUser, name: e.target.value })
											// }
											/>
										</div>
									</p>


									<p className="text-xl md:text-2xl flex items-center font-semibold">
										<span className="mr-5">Service No : </span>
										<div className="field">                              {/*Service No*/}
											<input
												required
												autoComplete='off'
												name="serviceNo"
												placeholder={data.serviceNo}
												className="input-field"
												type="text"
											// value={curUser.name}
											// onChange={(e) =>
											// 	setCurUser({ ...curUser, name: e.target.value })
											// }
											/>
										</div>
									</p>


									<p className="text-xl md:text-2xl flex items-center font-semibold">
										<span className="mr-5">Service Field : </span>
										<div className="field">                              {/*Service Field*/}
											<select
												// value={details.serviceField}
												// onChange={(e) =>
												// 	setDetails({
												// 		...details, serviceField: e.target.value
												// 	})}
												className="w-full bg-[#171717] rounded-full outline-none ">
												<option value="0" key="0">
													Select Your Service Field
												</option>
												<option value="Army" key="1">
													Army
												</option>
												<option value="Air Force" key="2">
													Air Force
												</option>
												<option value="Navy" key="3">
													Navy
												</option>
											</select>
										</div>
									</p>
								</div>


								<label htmlFor="avatar" className="overflow-hidden md:w-96 md:mb-0 mb-10 md:h-96 w-80 h-80">

									<div className="shrink-0 relative overflow-hidden">
										{avatar !== null ?
											<img
												className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
												src={avatar}
												alt="Profile Pic"
											/> :
											<div>
												<img
													src={data.photoURL}
													alt="Profile" />
												<div className="overlay overlay_1">
													<h3>Upload</h3>
												</div>
											</div>
										}
									</div>
									<input
										// onChange={handleChange1}
										type="file"
										id="avatar"
										accept="image/jpeg,image/jpg,image/png"
										className="mx-auto hidden mt-8 text-sm text-white file:mr-4 file:py-2 file:px-4 file:bg-[#FF671F] file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:cursor-pointer"
									/>
								</label>

							</div>

							<div className="flex flex-col md:mt-0 mt-4 md:flex-row justify-between md:items-center">
								<div className="space-y-4">

									<p disabled className="text-xl md:text-2xl cursor-not-allowed font-semibold">
										Aadhar No : {data.aadharNo}
									</p>

									<p className="text-xl md:text-2xl flex items-center font-semibold">
										<span className="mr-5">Pan No : </span>
										<div className="field">                              {/*Pan No*/}
											<input
												required
												autoComplete='off'
												name="panNO"
												placeholder={data.panNo}
												className="input-field"
												type="text"
											// value={curUser.name}
											// onChange={(e) =>
											// 	setCurUser({ ...curUser, name: e.target.value })
											// }
											/>
										</div>
									</p>

									<p disabled className="text-xl md:text-2xl cursor-not-allowed font-semibold">
										Email : {data.email}
									</p>

									<p className="text-xl md:text-2xl flex items-center font-semibold">
										<span className="mr-5">Mobile No : </span>
										<div className="field">                              {/*Mobile No*/}
											<input
												required
												autoComplete='off'
												name="phoneNo"
												placeholder={data.phoneNo}
												className="input-field"
												type="tel"
												maxLength="10"
											// value={curUser.name}
											// onChange={(e) =>
											// 	setCurUser({ ...curUser, name: e.target.value })
											// }
											/>
										</div>
									</p>


									<p className="text-xl md:text-2xl flex items-center font-semibold">
										<span className="mr-5">Temporary Address : </span>
										<div className="field">                              {/* Temp Address*/}
											<input
												required
												autoComplete='off'
												name="tempAdd"
												placeholder={data.tempAdd}
												className="input-field"
												type="text"
											// value={curUser.name}
											// onChange={(e) =>
											// 	setCurUser({ ...curUser, name: e.target.value })
											// }
											/>
										</div>
									</p>


									<p className="text-xl md:text-2xl flex items-center font-semibold">
										<span className="mr-5">Address : </span>
										<div className="field">                              {/*Address*/}
											<input
												required
												autoComplete='off'
												name="serviceNo"
												placeholder={data.address}
												className="input-field"
												type="text"
											// value={curUser.name}
											// onChange={(e) =>
											// 	setCurUser({ ...curUser, name: e.target.value })
											// }
											/>
										</div>
									</p>

								</div>

								<div className="flex justify-between mt-10 items-center md:w-1/2 w-full">
									<div disabled className="w-36 cursor-not-allowed md:w-56 h-36 md:h-56">
										<img
											src={data.aadharUrl1}
											className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
											alt="AadharFront"
										/>
									</div>
									<div disabled className="w-36 cursor-not-allowed md:w-56 h-36 md:h-56">
										<img
											src={data.aadharUrl2}
											className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
											alt="AadharBack"
										/>
									</div>
								</div>
							</div>

							{/* Edit Details Button */}
							<div className="flex justify-center items-center md:mt-10">
								<button className="button4 mt-10 w-full">
									<span className="circle1"></span>
									<span className="circle2"></span>
									<span className="circle3"></span>
									<span className="circle4"></span>
									<span className="circle5"></span>
									<span className="text">
										{loading ? (
											<section className="dots-container">
												<div className="dot"></div>
												<div className="dot"></div>
												<div className="dot"></div>
												<div className="dot"></div>
												<div className="dot"></div>
											</section>
										) : ("Save")}
									</span>
								</button>
							</div>

						</div>
					) : (
						<p className="text-center text-2xl my-48">😕 Please Login to Continue 😕</p>
					)}

			</div>

			<Footer />
		</>
	);
};

export default EditDetails;