"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { db, auth, storage } from "../config";
import "./load.css"
import { FaServicestack } from 'react-icons/fa';
import { GiField } from 'react-icons/gi';
import { BiCurrentLocation } from 'react-icons/bi';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";
import Image from "next/image";
import Loader from "../../../components/Loader";
import { useEffect } from "react";
import Link from "next/link";

const RegisterForm = () => {
	const [loading, setLoading] = useState(false);
	const [passwordType, setPasswordType] = useState("password");
	const [aadharPic1, setAadharPic1] = useState(
		"https://ik.imagekit.io/xji6otwwkb/ESM/Adhaar-Card-Sample-Vector-File-sdfied.png?updatedAt=1688543664066"
	);
	const [aadharPic2, setAadharPic2] = useState(
		"https://ik.imagekit.io/xji6otwwkb/ESM/aahar_back.png?updatedAt=1689572887801"
	);
	const [avatar, setAvatar] = useState(
		"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697"
	);

	const [emails, setEmails] = useState("");
	const [name, setName] = useState("");
	const [image1, setImage1] = useState(null);
	const [image2, setImage2] = useState(null);
	const [curUser, setCurUser] = useState({
		email: "",
		password: "",
	});

	const initialValues = {
		phn: "",
		secPhn: "",
		serviceNo: "",
		serviceField: "",
		address: "",
		tempAdd: "",
		panNo: "",
		fatherName: "",
		DOB: "",
	}

	const [details, setDetails] = useState({
		phn: "",
		secPhn: "",
		serviceNo: "",
		serviceField: "",
		address: "",
		tempAdd: "",
		panNo: "",
		fatherName: "",
		DOB: "",
	})

	const timestamp = new Date().getTime();

	const [regNo1, setRegNo1] = useState(116);

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
				displayName: res.displayName,
				email: res.email,
			});

			setEmails(curUser.email);
			setName(curUser.name);
			setTimeout(() => {
				setEmailPass(true);
			}, 1500);
			toast.success("Registerd Succesfully");
		} catch (error) {
			toast.error(error.code);
		}
		setCurUser({
			name: "",
			email: "",
			password: "",
		});
		setLoading(false)
	};

	//Adding Details of User
	const add = async () => {
		try {
			setLoading(true)
			if (!details.phn || !details.DOB || !details.serviceNo || !details.serviceField || !details.address || !details.fatherName) {
				toast.error("Enter Details");
				setDetails(initialValues);
				setLoading(false);
				return;
			}
			else {
				await updateDoc(doc(db, "users", emails), {
					fatherName: details.fatherName,
					DOB: details.DOB,
					phoneNo: details.phn,
					secPhoneNo: details.secPhn,
					serviceNo: details.serviceNo,
					serviceField: details.serviceField,
					address: details.address,
					tempAdd: details.tempAdd,
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
	const handleChange1 = async (e) => {
		setImage1(e.target.files[0]);
		setAadharPic1(URL.createObjectURL(e.target.files[0]));
		setAvatar(URL.createObjectURL(e.target.files[0]));
	};
	const handleChange2 = async (e) => {
		setImage2(e.target.files[0]);
		setAadharPic2(URL.createObjectURL(e.target.files[0]));
	};

	//Uploading Aadhar
	const aadhar = async () => {
		try {
			setLoading(true)
			if (!aadharNo) {
				toast.error("Enter Details");
				setAadharNo("");
				setAadharPic1(
					"https://ik.imagekit.io/xji6otwwkb/ESM/Adhaar-Card-Sample-Vector-File-sdfied.png?updatedAt=1688543664066");
				setAadharPic2(
					"https://ik.imagekit.io/xji6otwwkb/ESM/aahar_back.png?updatedAt=1689572887801");
				setLoading(false);
				return;
			}
			else {
				if (image1) {
					const imageRef1 = ref(storage, `AadharCard/${name}_${aadharNo}/AadharNo_${aadharNo}_front`);
					await uploadBytes(imageRef1, image1);
					var url1 = await getDownloadURL(imageRef1);
				}
				else
					var url1 = aadharPic1;

				if (image2) {
					const imageRef2 = ref(storage, `AadharCard/${name}_${aadharNo}/AadharNo_${aadharNo}_back`);
					await uploadBytes(imageRef2, image2);
					var url2 = await getDownloadURL(imageRef2);
				}
				else
					var url2 = aadharPic2;


				await updateDoc(doc(db, "users", emails), {
					aadharNo: aadharNo,
					aadharUrl1: url1,
					aadharUrl2: url2,
				});

				setTimeout(() => {
					setPhotoDetail(true);
				}, 1500);
				toast.success("Aadhar Uploaded Succesfully");
			}
		} catch (error) {
			toast.error(error.message);
		}
		setAadharNo("");
		setAadharPic1(
			"https://ik.imagekit.io/xji6otwwkb/ESM/Adhaar-Card-Sample-Vector-File-sdfied.png?updatedAt=1688543664066");
		setAadharPic2(
			"https://ik.imagekit.io/xji6otwwkb/ESM/aahar_back.png?updatedAt=1689572887801");
		setLoading(false);
		setImage1(null);
		setImage2(null);
		setAvatar(
			"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697");
	}

	//Giving Registration Number
	useEffect(() => {
		var max = 0;
		onSnapshot(collection(db, "users"), (querySnapshot) => {
			querySnapshot.forEach((doc) => {
				if (max < doc.data().timeStamp) {
					max = doc.data().timeStamp;
					setRegNo1(doc.data().RegNo);
				}
			});
		});

	}, [])


	//Uploading Photo
	const photo = async () => {
		try {
			setLoading(true)
			if (image1) {
				const imageRef = ref(storage, `Photo/${name}_${aadharNo}`);
				await uploadBytes(imageRef, image1);
				var url = await getDownloadURL(imageRef);
			}
			else
				var url = avatar;

			await updateDoc(doc(db, "users", emails), {
				RegNo: regNo1 + 1,
				photoURL: url,
				timeStamp: timestamp,
			});

			setHome(true);
			toast.success("Photo Uploaded Succesfully");

		} catch (error) {
			toast.error(error.message);
		}
		setAvatar(
			"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697")
		setLoading(false);
	}

	// Slow Loading
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

	// Password Eye
	const togglePassword = () => {
		if (passwordType === "password") {
			setPasswordType("text");
			return;
		}
		setPasswordType("password");
	};

	return (
		<>
			{!loader ? (
				<>
					{!emailPass ? (
						<div className="flex flex-col justify-center items-center h-screen">
							<div className="w-screen lg:w-1/2">
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
											<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
										</svg>
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
											type={passwordType}
											name="password"
											value={curUser.password}
											onChange={(e) =>
												setCurUser({ ...curUser, password: e.target.value })
											}
											required
										/>
										{/* Eye button */}
										<button
											onClick={togglePassword}
											className="p-4">
											{passwordType === "password" ?
												<svg
													xmlns="http://www.w3.org/2000/svg"
													height="1em"
													fill="#fff"
													viewBox="0 0 640 512">
													<path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
												</svg> :
												<svg
													xmlns="http://www.w3.org/2000/svg"
													height="1em"
													fill="#fff"
													viewBox="0 0 576 512">
													<path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
												</svg>
											}
										</button>
									</div>

									<button onClick={signUp} className="button4 mt-10 w-full">
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
										<div className="w-screen lg:w-1/2">
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

												<div className="field">                              {/*Secondary Phone No*/}
													<svg
														xmlns="http://www.w3.org/2000/svg"
														height={8}
														width={8}
														className="input-icon"
														fill="currentColor"
														viewBox="0 0 512 512">
														<path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" /></svg>
													<input

														name="secPhn"
														placeholder="Secondary Mobile (Optional)"
														className="input-field"
														type="tel"
														maxLength="10"
														onChange={(e) => setDetails({
															...details, secPhn: e.target.value
														})}
														value={details.secPhn}
													/>
												</div>

												<div className="field">                              {/*Father Name*/}
													<svg
														className="input-icon"
														xmlns="http://www.w3.org/2000/svg"
														width="12"
														height="12"
														fill="currentColor"
														viewBox="0 0 448 512">
														<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
													</svg>

													<input
														name="fatherName"
														required
														placeholder="Father Name"
														className="input-field"
														type="text"
														onChange={(e) => setDetails({
															...details, fatherName: e.target.value
														})}
														value={details.fatherName}
													/>
												</div>

												<div className="field">                              {/* DOB */}
													<svg
														className="input-icon"
														xmlns="http://www.w3.org/2000/svg"
														width="12"
														height="12"
														fill="currentColor"
														viewBox="0 0 448 512">
														<path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z" />
													</svg>

													<input
														name="fatherName"
														required
														placeholder="Date of Birth"
														className="input-field"
														type="date"
														onChange={(e) => setDetails({
															...details, DOB: e.target.value
														})}
														value={details.DOB}
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

												<div className="field">                              {/* Temp Address*/}
													<BiCurrentLocation className="input-icon" />
													<input

														name="tempAdd"
														placeholder="Temporary Address"
														className="input-field"
														type="text"
														onChange={(e) => setDetails({
															...details, tempAdd: e.target.value
														})}
														value={details.tempAdd}
													/>
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
														viewBox="0 0 576 512">
														<path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
													</svg>

													<input

														name="Pan No"
														placeholder="Pan No (Optional)"
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
															<section className="dots-container">
																<div className="dot"></div>
																<div className="dot"></div>
																<div className="dot"></div>
																<div className="dot"></div>
																<div className="dot"></div>
															</section>
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
													<div className="w-screen lg:w-1/2">
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

															<div className="flex justify-between space-x-5">
																<label htmlFor="aadhar1" className="flex w-1/2 mt-10 flex-col p-5 items-center border-4 border-dashed border-white rounded-xl">
																	<div className="shrink-0">
																		<img
																			className="h-48 w-fit object-contain"
																			src={aadharPic1}
																			alt="Aadhar Pic"
																		/>
																	</div>
																	<input
																		onChange={handleChange1}
																		type="file"
																		id="aadhar1"
																		accept="image/jpeg,image/jpg,image/png"
																		className="mx-auto mt-8 text-sm text-white file:mr-4 file:py-2 file:px-4 file:bg-[#FF671F] file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:cursor-pointer"
																	/>
																</label>

																<label htmlFor="aadhar2" className="flex w-1/2 mt-10 flex-col p-5 items-center border-4 border-dashed border-white rounded-xl">
																	<div className="shrink-0">
																		<img
																			className="h-48 w-fit object-contain"
																			src={aadharPic2}
																			alt="Aadhar Pic"
																		/>
																	</div>
																	<input
																		onChange={handleChange2}
																		type="file"
																		id="aadhar2"
																		accept="image/jpeg,image/jpg,image/png"
																		className="mx-auto mt-8 text-sm text-white file:mr-4 file:py-2 file:px-4 file:bg-[#FF671F] file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:cursor-pointer"
																	/>
																</label>
															</div>
															<button onClick={aadhar} className="button4 mt-10 w-full">
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
														<div className="w-screen lg:w-1/2">
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
																		onChange={handleChange1}
																		type="file"
																		id="aad"
																		accept="image/jpeg,image/jpg,image/png"
																		className="mx-auto mt-8 text-sm text-white file:mr-4 file:py-2 file:px-4 file:bg-[#FF671F] file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:cursor-pointer"
																	/>
																</label>
																<button onClick={photo} className="button5 mt-10 type1">
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
															)
																: (
																	<>
																		<FuncNavbar />
																		<p className="text-2xl flex justify-center font-semibold">
																			Go back to
																			<Link href="/" className="text-secondary underline">&nbsp;Home&nbsp;</Link>
																			to Login
																		</p>
																	</>
																)}
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
			) : (
				<Loader />
			)}
		</>
	);
};

export default RegisterForm;
