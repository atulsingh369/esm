"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { db, auth, storage } from "../config";
import "./load.css"
import { FaServicestack } from 'react-icons/fa';
import { GiField } from 'react-icons/gi';
import { BiCurrentLocation } from 'react-icons/bi';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";

const RegisterForm = () => {
	const [loading, setLoading] = useState(false);
	const [aadharPic, setAadharPic] = useState(
		"https://ik.imagekit.io/xji6otwwkb/ESM/Adhaar-Card-Sample-Vector-File-sdfied.png?updatedAt=1688543664066"
	);
	const [avatar, setAvatar] = useState(
		"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697"
	);

	const [emails, setEmails] = useState("");
	const [name, setName] = useState("");
	const [image, setImage] = useState(null);
	const [curUser, setCurUser] = useState({
		email: "",
		password: "",
	});

	const initialValues = {
		phn: "",
		serviceNo: "",
		serviceField: "",
		address: "",
		panNo: "",
	}

	const [details, setDetails] = useState({
		phn: "",
		serviceNo: "",
		serviceField: "",
		address: "",
		panNo: "",
	})

	const [aadharNo, setAadharNo] = useState("");


	const [emailPass, setEmailPass] = useState(false);
	const [aadharDetail, setAadharDetail] = useState(false);
	const [photoDetail, setPhotoDetail] = useState(false);
	const [home, setHome] = useState(false);


	// Registering User
	const signUp = async () => {
		setLoading(true);
		if (!curUser.email || !curUser.password || !curUser.name) {
			toast.error("Enter Required Details");
			setCurUser({
				name: "",
				email: "",
				password: "",
			});

			setLoading(false);
			return;
		}
		try {
			const credential = await createUserWithEmailAndPassword(
				auth,
				curUser.email,
				curUser.password
			);
			const res = credential.user;
			await updateProfile(res, {
				displayName: curUser.name,
			});
			await sendEmailVerification(res);
			await setDoc(doc(db, "users", res.email), {
				uid: res.uid,
				displayName: res.displayName,
				email: res.email,
			});
			setCurUser({
				name: "",
				email: "",
				password: "",
			});

			setLoading(false);
			setEmails(curUser.email);
			setName(curUser.name);
			setTimeout(() => {
				setEmailPass(true);
			}, 1500);
			toast.success("Registerd Succesfully");
		} catch (error) {
			toast.error(error.code);
			setLoading(false)
			setCurUser({
				name: "",
				email: "",
				password: "",
			});
		}
	};

	//Adding Details of User
	const add = async () => {
		try {
			setLoading(true)
			if (!details.phn || !details.serviceNo || !details.serviceField || !details.address || !details.panNo) {
				toast.error("Enter Details");
				setDetails(initialValues);
				setLoading(false);
				return;
			}
			else {
				await updateDoc(doc(db, "users", emails), {
					phoneNo: details.phn,
					serviceNo: details.serviceNo,
					serviceField: details.serviceField,
					address: details.address,
					panNo: details.panNo,
					role: "user",
				});
				setDetails(initialValues);
				setLoading(false);
				setTimeout(() => {
					setAadharDetail(true);
				}, 1500);
				toast.success("Details Saved Succesfully");
			}
		} catch (error) {
			toast.error(error.message);
			setDetails(initialValues);
			setLoading(false);
		}
	}

	//Displaying Photo/Aadhar
	const handleChange = async (e) => {
		setImage(e.target.files[0]);
		setAadharPic(URL.createObjectURL(e.target.files[0]));
		setAvatar(URL.createObjectURL(e.target.files[0]));
	};

	//Uploading Aadhar
	const aadhar = async () => {
		try {
			setLoading(true)
			if (!image || !aadharNo) {
				toast.error("Enter Details");
				setAadharNo("");
				setAadharPic(
					"https://ik.imagekit.io/xji6otwwkb/ESM/Adhaar-Card-Sample-Vector-File-sdfied.png?updatedAt=1688543664066")
				setLoading(false);
				return;
			}
			else {
				const imageRef = ref(storage, `AadharCard/AadharNo_${name}_${aadharNo}`);
				await uploadBytes(imageRef, image);
				const url = await getDownloadURL(imageRef);
				await updateDoc(doc(db, "users", emails), {
					aadharNo: aadharNo,
					aadharUrl: url,
				});
				setAadharNo("");
				setAadharPic(
					"https://ik.imagekit.io/xji6otwwkb/ESM/Adhaar-Card-Sample-Vector-File-sdfied.png?updatedAt=1688543664066")
				setLoading(false);
				setImage(null);
				setAvatar(
					"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697");
				setTimeout(() => {
					setPhotoDetail(true);
				}, 1500);
				toast.success("Aadhar Uploaded Succesfully");
			}
		} catch (error) {
			toast.error(error.message);
			setAadharNo("");
			setAadharPic(
				"https://ik.imagekit.io/xji6otwwkb/ESM/Adhaar-Card-Sample-Vector-File-sdfied.png?updatedAt=1688543664066")
			setLoading(false);
			setImage(null);
		}
	}
	//Uploading Photo
	const photo = async () => {
		try {
			setLoading(true)
			if (!image) {
				toast.error("Enter Details");
				setAvatar(
					"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697");
				setLoading(false);
				return;
			}
			else {
				const imageRef = ref(storage, `Photo/${name}`);
				await uploadBytes(imageRef, image);
				const url = await getDownloadURL(imageRef);
				await updateDoc(doc(db, "users", emails), {
					photoURL: url,
				});
				setAvatar(
					"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697")
				setLoading(false);
				setHome(true);
				toast.success("Photo Uploaded Succesfully");
			}
		} catch (error) {
			toast.error(error.message);
			setAvatar(
				"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697")
			setLoading(false);
		}
	}

	return (
		<>
			{!emailPass ? (
				<div className="flex flex-col justify-center items-center h-screen">
					<div className="w-screen md:w-1/2">
						<div className='form space-y-4 rounded-md'>
							<p id="heading">Sign Up</p>
							<div className="field">                              {/*Name*/}
								<svg
									className="input-icon"
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									fill="currentColor"
									viewBox="0 0 448 512">
									<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
								<input
									required
									autoComplete='off'
									name="name"
									placeholder="Name"
									className="input-field"
									type="text"
									value={curUser.name}
									onChange={(e) =>
										setCurUser({ ...curUser, name: e.target.value })
									}
								/>
							</div>
							<div className="field">                              {/*Email*/}
								<svg
									className="input-icon"
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16">
									<path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
								</svg>
								<input
									autoComplete='off'
									required
									placeholder="Email"
									className="input-field"
									type="email"
									name="email"
									value={curUser.email}
									onChange={(e) =>
										setCurUser({ ...curUser, email: e.target.value })
									}
								/>
							</div>
							<div className="field">                              {/*Password*/}
								<svg
									className="input-icon"
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16">
									<path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
								</svg>
								<input
									autoComplete='off'
									placeholder="Password"
									className="input-field"
									type="password"
									name="password"
									value={curUser.password}
									onChange={(e) =>
										setCurUser({ ...curUser, password: e.target.value })
									}
									required
								/>
							</div>

							<button onClick={signUp} className="button4 mt-10 w-full">
								<span className="circle1"></span>
								<span className="circle2"></span>
								<span className="circle3"></span>
								<span className="circle4"></span>
								<span className="circle5"></span>
								<span className="text">
									{loading ? (
										<div className="wrapper">
											<div className="circle" />
											<div className="circle" />
											<div className="circle" />
											<div className="shadow" />
											<div className="shadow" />
											<div className="shadow" />
										</div>
									) : ("Sign Up")}
								</span>
							</button>

						</div>
					</div>
					<ToastContainer />
				</div>
			)
				: (
					<div>
						{!aadharDetail ? (
							<div className="flex flex-col justify-center items-center h-screen">
								<div className="w-screen md:w-1/2">
									<div className='form space-y-4 rounded-md'>
										<p id="heading">Fill Up Your Details</p>

										<div className="field">                              {/*Phone No*/}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height={8}
												width={8}
												className="input-icon"
												fill="currentColor"
												viewBox="0 0 512 512">
												<path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" /></svg>
											<input

												name="phn"
												required
												placeholder="Mobile No"
												className="input-field"
												type="tel"
												maxLength="10"
												onChange={(e) => setDetails({
													...details, phn: e.target.value
												})}
												value={details.phn}
											/>
										</div>
										<div className="field">                              {/*Service No*/}
											<FaServicestack className="input-icon" />
											<input

												name="serviceNo"
												required
												placeholder="Service No"
												className="input-field"
												type="text"
												onChange={(e) => setDetails({
													...details, serviceNo: e.target.value
												})}
												value={details.serviceNo}
											/>
										</div>
										<div className="field">                              {/*Service*/}
											<GiField className="input-icon" />
											<select value={details.serviceField}
												onChange={(e) =>
													setDetails({
														...details, serviceField: e.target.value
													})}
												className="w-full h-5 bg-[#171717] rounded-full outline-none ">
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
										<div className="field">                              {/*Address*/}
											<BiCurrentLocation className="input-icon" />
											<input

												name="Address"
												required
												placeholder="Address"
												className="input-field"
												type="text"
												onChange={(e) => setDetails({
													...details, address: e.target.value
												})}
												value={details.address}
											/>
										</div>
										<div className="field">                              {/*Pan No*/}
											<svg
												className="input-icon"
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												fill="currentColor"
												viewBox="0 0 16 16"
											>
												<path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
											</svg>
											<input

												name="Pan No"
												required
												placeholder="Pan No"
												className="input-field"
												type="text"
												onChange={(e) => setDetails({
													...details, panNo: e.target.value
												})}
												value={details.panNo}
											/>
										</div>
										<button onClick={add} className="button4 mt-10 w-full">
											<span className="circle1"></span>
											<span className="circle2"></span>
											<span className="circle3"></span>
											<span className="circle4"></span>
											<span className="circle5"></span>
											<span className="text">
												{loading ? (
													<div className="wrapper">
														<div className="circle" />
														<div className="circle" />
														<div className="circle" />
														<div className="shadow" />
														<div className="shadow" />
														<div className="shadow" />
													</div>
												) : ("Save & Next")}
											</span>
										</button>
									</div>
								</div>
								<ToastContainer />
							</div >
						)
							: (
								<div>
									{!photoDetail ? (
										<div className="flex flex-col justify-center items-center h-screen">
											<div className="w-screen md:w-1/2">
												<div className="form">
													<p id="heading">Upload Your Aadhar Card</p>
													<div className="field">
														<svg
															className="input-icon"
															xmlns="http://www.w3.org/2000/svg"
															width="16"
															height="16"
															fill="currentColor"
															viewBox="0 0 16 16"
														>
															<path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
														</svg>
														<input
															required
															autocomplete="off"
															placeholder="Aadhar No."
															className="input-field"
															type="tel"
															maxLength="12"
															value={aadharNo}
															onChange={(e) => setAadharNo(e.target.value)}
														/>
													</div>

													<label htmlFor="aad" className="flex mt-10 flex-col p-5 items-center border-4 border-dashed border-white rounded-xl">

														<div className="shrink-0">
															<img
																className="h-48 w-fit object-contain"
																src={aadharPic}
																alt="Aadhar Pic"
															/>
														</div>
														<input
															onChange={handleChange}
															type="file"
															id="aad"
															accept="image/jpeg,image/jpg,image/png"
															className="mx-auto mt-8 text-sm text-white file:mr-4 file:py-2 file:px-4 file:bg-[#FF671F] file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:cursor-pointer"
														/>
													</label>
													<button onClick={aadhar} className="button4 mt-10 w-full">
														<span className="circle1"></span>
														<span className="circle2"></span>
														<span className="circle3"></span>
														<span className="circle4"></span>
														<span className="circle5"></span>
														<span className="text">
															{loading ? (
																<div className="wrapper">
																	<div className="circle" />
																	<div className="circle" />
																	<div className="circle" />
																	<div className="shadow" />
																	<div className="shadow" />
																	<div className="shadow" />
																</div>
															) : ("Save & Next")}
														</span>
													</button>
												</div>
											</div>
											<ToastContainer />
										</div>
									)
										: (
											<div className="flex flex-col justify-center items-center h-screen">
												<div className="w-screen md:w-1/2">
													{!home ? (<div className="form">
														<p id="heading">Upload Your Photo</p>

														<label htmlFor="aad" className="flex mt-10 flex-col p-5 items-center border-4 border-dashed border-white rounded-xl">

															<div className="shrink-0">
																<img
																	className="h-48 w-fit object-contain"
																	src={avatar}
																	alt="Profile Pic"
																/>
															</div>
															<input
																onChange={handleChange}
																type="file"
																id="aad"
																accept="image/jpeg,image/jpg,image/png"
																className="mx-auto mt-8 text-sm text-white file:mr-4 file:py-2 file:px-4 file:bg-[#FF671F] file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:cursor-pointer"
															/>
														</label>
														<button onClick={photo} className="button5 mt-10 type1">
														</button>
													</div>
													)
														: (
															<FuncNavbar />)}
												</div>
												<ToastContainer />
											</div>)}
								</div>
							)}
						<ToastContainer />
					</div>
				)}
			<Footer />
		</>
	);
};

export default RegisterForm;
