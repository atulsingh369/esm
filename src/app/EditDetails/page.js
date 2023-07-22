"use client";
import { db, storage } from "@/app/config";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from "react";
import "./load.css";
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditDetails = () => {
	const searchParams = useSearchParams()

	const [data, setData] = useState(null); // Store data of user
	const [loading, setLoading] = useState(false); // Loading/Unloading
	const [editDetails, setEditDetails] = useState(false); // Store permission to edit details

	const email = searchParams.get('email'); // Store user logined email

	const [avatar, setAvatar] = useState(null); // Store photo upload
	const [aadharPic1, setAadharPic1] = useState(null);
	const [aadharPic2, setAadharPic2] = useState(null);
	const [image, setImage] = useState(null);
	const [image1, setImage1] = useState(null);
	const [image2, setImage2] = useState(null);

	const [details, setDetails] = useState({
		phoneNo: "",
		secPhoneNo: "",
		serviceNo: "",
		serviceField: "",
		address: "",
		tempAdd: "",
		panNo: "",
		DOB: "",
		photoURL: "",
		aadharUrl1: "",
		aadharUrl2: "",
	})


	//Displaying Photo/Aadhar
	const handleChange = async (e) => {
		setImage(e.target.files[0]);
		setAvatar(URL.createObjectURL(e.target.files[0]));
	};
	const handleChange1 = async (e) => {
		setImage1(e.target.files[0]);
		setAadharPic1(URL.createObjectURL(e.target.files[0]));
	};
	const handleChange2 = async (e) => {
		setImage2(e.target.files[0]);
		setAadharPic2(URL.createObjectURL(e.target.files[0]));
	};

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
	}, [email, data, details]);

	const save = async () => {
		setLoading(true);
		try {

			if (image) {
				const imageRef = ref(storage, `Photo/${data.displayName}`);
				await deleteObject(imageRef)
				await uploadBytes(imageRef, image);
				const pic = await getDownloadURL(imageRef);
				setDetails({ ...details, photoURL: pic })
			}
			if (image1) {
				const imageRef1 = ref(storage, `AadharCard/${data.displayName}/AadharNo_${data.aadharNo}_front`);
				await deleteObject(imageRef1)
				await uploadBytes(imageRef1, image);
				const pic1 = await getDownloadURL(imageRef1);
				setDetails({ ...details, aadharUrl1: pic1 })
			}
			if (image2) {
				const imageRef2 = ref(storage, `AadharCard/${data.displayName}/AadharNo_${data.aadharNo}_back`);
				await deleteObject(imageRef2)
				await uploadBytes(imageRef2, image);
				const pic2 = await getDownloadURL(imageRef2);
				setDetails({ ...details, aadharUrl2: pic2 })
			}

			await updateDoc(doc(db, "users", email), {
				DOB: details.DOB ? details.DOB : data.DOB,
				phoneNo: details.phoneNo ? details.phoneNo : data.phoneNo,
				secPhoneNo: details.secPhoneNo ? details.secPhoneNo : data.secPhoneNo,
				serviceNo: details.serviceNo ? details.serviceNo : data.serviceNo,
				serviceField: details.serviceField ? details.serviceField : data.serviceField,
				address: details.address ? details.address : data.address,
				tempAdd: details.tempAdd ? details.tempAdd : data.tempAdd,
				panNo: details.panNo ? details.panNo : data.panNo,
				aadharUrl1: details.aadharUrl1 ? details.aadharUrl1 : data.aadharUrl1,
				aadharUrl2: details.aadharUrl2 ? details.aadharUrl2 : data.aadharUrl2,
				photoURL: details.photoURL ? details.photoURL : data.photoURL,
			});

			toast.success("Edited Succesfully");
			setEditDetails(false);

		} catch (error) {
			toast.error(error);
			setEditDetails(false);
		}
		setLoading(false);
	}


	return (
		<>

			<FuncNavbar />

			<div className="lg:px-56 px-5">
				<h1 id="heading1">
					Profile
				</h1>

				{data ?
					!editDetails ? (
						<div>
							<div className="flex flex-col-reverse lg:flex-row justify-between lg:items-center">
								<div className="space-y-4">
									<p className="text-xl lg:text-2xl font-semibold">
										Name : Mr. {data.displayName}
									</p>
									<p className="text-xl lg:text-2xl font-semibold">
										Father Name : Mr. {data.fatherName}
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
									<p className="text-xl lg:text-2xl font-semibold">
										Aadhar No : {data.aadharNo}
									</p>
									<p className="text-xl lg:text-2xl font-semibold">
										Pan No : {data.panNo ? data.panNo : "N/A"}
									</p>
									<p className="text-xl lg:text-2xl font-semibold">
										Email : {data.email}
									</p>
									<p className="text-xl lg:text-2xl font-semibold">
										Mobile No : {data.phoneNo}
									</p>
									<p className="text-xl lg:text-2xl font-semibold">
										Secondary Mobile No : {data.secPhoneNo ? data.secPhoneNo : "N/A"}
									</p>
									<p className="text-xl lg:text-2xl font-semibold">
										Temporary	Address : {data.tempAdd ? data.tempAdd : "N/A"}
									</p>
									<p className="text-xl lg:text-2xl font-semibold">
										Address : {data.address}
									</p>
								</div>

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
							</div>

							{/* Edit Details Button */}
							<div className="flex justify-center items-center lg:mt-10">
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
							<div className="flex flex-col-reverse lg:flex-row justify-between lg:items-center">
								<div className="space-y-4">

									<div disabled className="text-xl lg:text-2xl cursor-not-allowed font-semibold">
										Name : Mr. {data.displayName}
									</div>


									<div disabled className="text-xl lg:text-2xl cursor-not-allowed font-semibold">
										Father Name : Mr. {data.fatherName}
									</div>


									<div className="text-xl lg:text-2xl flex items-center font-semibold">
										<span className="mr-5">D.O.B. : </span>
										<div className="field">                              {/*DOB*/}
											<input
												required
												autoComplete='off'
												name="DOB"
												placeholder={data.DOB}
												className="input-field"
												type="date"
												value={details.DOB}
												onChange={(e) =>
													setDetails({ ...details, DOB: e.target.value })
												}
											/>
										</div>
									</div>


									<div className="text-xl lg:text-2xl flex items-center font-semibold">
										<span className="mr-5">Service No : </span>
										<div className="field">                              {/*Service No*/}
											<input
												required
												autoComplete='off'
												name="serviceNo"
												placeholder={data.serviceNo}
												className="input-field"
												type="text"
												value={details.serviceNo}
												onChange={(e) =>
													setDetails({ ...details, serviceNo: e.target.value })
												}
											/>
										</div>
									</div>


									<div className="text-xl lg:text-2xl flex items-center font-semibold">
										<span className="mr-5">Service Field : </span>
										<div className="field">                              {/*Service Field*/}
											<select
												value={details.serviceField}
												onChange={(e) =>
													setDetails({
														...details, serviceField: e.target.value
													})}
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
									</div>
								</div>


								<label htmlFor="avatar" className="overflow-hidden lg:w-96 lg:mb-0 mb-10 lg:h-96 w-80 h-80">

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
										onChange={handleChange}
										type="file"
										id="avatar"
										accept="image/jpeg,image/jpg,image/png"
										className="mx-auto hidden mt-8 text-sm text-white file:mr-4 file:py-2 file:px-4 file:bg-[#FF671F] file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:cursor-pointer"
									/>
								</label>

							</div>

							<div className="flex flex-col lg:mt-0 mt-4 lg:flex-row justify-between lg:items-center">
								<div className="space-y-4">

									<div disabled className="text-xl lg:text-2xl cursor-not-allowed font-semibold">
										Aadhar No : {data.aadharNo}
									</div>

									<div className="text-xl lg:text-2xl flex items-center font-semibold">
										<span className="mr-5">Pan No : </span>
										<div className="field">                              {/*Pan No*/}
											<input
												required
												autoComplete='off'
												name="panNO"
												placeholder={data.panNo}
												className="input-field"
												type="text"
												value={details.panNo}
												onChange={(e) =>
													setDetails({ ...details, panNo: e.target.value })
												}
											/>
										</div>
									</div>

									<div disabled className="text-xl lg:text-2xl cursor-not-allowed font-semibold">
										Email : {data.email}
									</div>

									<div className="text-xl lg:text-2xl flex items-center font-semibold">
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
												value={details.phoneNo}
												onChange={(e) =>
													setDetails({ ...details, phoneNo: e.target.value })
												}
											/>
										</div>
									</div>

									<div className="text-xl lg:text-2xl flex items-center font-semibold">
										<span className="mr-5">Secondary Mobile No : </span>
										<div className="field">                              {/* Secondary Mobile No*/}
											<input
												required
												autoComplete='off'
												name="secPhoneNo"
												placeholder={data.secPhoneNo}
												className="input-field"
												type="tel"
												maxLength="10"
												value={details.secPhoneNo}
												onChange={(e) =>
													setDetails({ ...details, secPhoneNo: e.target.value })
												}
											/>
										</div>
									</div>


									<div className="text-xl lg:text-2xl flex items-center font-semibold">
										<span className="mr-5">Temporary Address : </span>
										<div className="field">                              {/* Temp Address*/}
											<input
												required
												autoComplete='off'
												name="tempAdd"
												placeholder={data.tempAdd}
												className="input-field"
												type="text"
												value={details.tempAdd}
												onChange={(e) =>
													setDetails({ ...details, tempAdd: e.target.value })
												}
											/>
										</div>
									</div>


									<div className="text-xl lg:text-2xl flex items-center font-semibold">
										<span className="mr-5">Address : </span>
										<div className="field">                              {/*Address*/}
											<input
												required
												autoComplete='off'
												name="serviceNo"
												placeholder={data.address}
												className="input-field"
												type="text"
												value={details.address}
												onChange={(e) =>
													setDetails({ ...details, address: e.target.value })
												}
											/>
										</div>
									</div>

								</div>




								<div className="flex justify-between mt-10 items-center lg:w-1/2 w-full">

									<label htmlFor="aasdhar1" className="overflow-hidden w-36 lg:w-56 h-36 lg:h-56">

										<div className="shrink-0 relative overflow-hidden">
											{aadharPic1 !== null ?
												<img
													className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
													src={aadharPic1}
													alt="AadharFront"
												/> :
												<div>
													<img
														src={data.aadharUrl1}
														className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
														alt="AadharFront"
													/>
													<div className="overlay overlay_2">
														<h3>Upload</h3>
													</div>
												</div>
											}
										</div>
										<input
											onChange={handleChange1}
											type="file"
											id="aasdhar1"
											accept="image/jpeg,image/jpg,image/png"
											className="mx-auto hidden mt-8 text-sm text-white file:mr-4 file:py-2 file:px-4 file:bg-[#FF671F] file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:cursor-pointer"
										/>
									</label>

									<label htmlFor="aadhar2" className="overflow-hidden w-36 lg:w-56 h-36 lg:h-56">

										<div className="shrink-0 relative overflow-hidden">
											{aadharPic2 !== null ?
												<img
													className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
													src={aadharPic2}
													alt="AadharBack"
												/> :
												<div>
													<img
														src={data.aadharUrl2}
														className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box"
														alt="AadharBack"
													/>
													<div className="overlay overlay_2">
														<h3>Upload</h3>
													</div>
												</div>
											}
										</div>
										<input
											onChange={handleChange2}
											type="file"
											id="aadhar2"
											accept="image/jpeg,image/jpg,image/png"
											className="mx-auto hidden mt-8 text-sm text-white file:mr-4 file:py-2 file:px-4 file:bg-[#FF671F] file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:cursor-pointer"
										/>
									</label>


								</div>
							</div>

							{/* Save Button */}
							<div className="flex justify-center items-center lg:mt-10">
								<button onClick={save} className="button4 mt-10 w-full">
									<span className="circle1"></span>
									<span className="circle2"></span>
									<span className="circle3"></span>
									<span className="circle4"></span>
									<span className="circle5"></span>
									<span className="text">
										{loading ? (
											<div className="spinner">
												<div></div>
												<div></div>
												<div></div>
												<div></div>
												<div></div>
												<div></div>
											</div>
										) : ("Save")}
									</span>
								</button>
							</div>

						</div>
					) : (
						<p className="text-center text-2xl my-48">😕 Please Login to Continue 😕</p>
					)}
				<ToastContainer />
			</div>

			<Footer />
		</>
	);
};

export default EditDetails;