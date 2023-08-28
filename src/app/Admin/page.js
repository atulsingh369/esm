"use client";
import React, { useEffect, useState } from "react";
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, deleteDoc, doc, getDoc, } from "firebase/firestore";
import { onSnapshot, query, setDoc, where, } from "firebase/firestore";
import { db, storage } from "../config";
import "./load.css";
import { useSearchParams } from "next/navigation";
import Loader from "../../../components/Loader";
import Link from "next/link";
import moment from "moment";

const Admin = () => {
	const [loading, setLoading] = useState(false);  // Loading/Unloading
	const [image, setImage] = useState(null);  // Store image uploaded
	const [noticeMedia, setNoticeMedia] = useState(null);  // Store notice media uploaded
	const [photo, setPhoto] = useState(
		"https://ik.imagekit.io/xji6otwwkb/ESM/bg.jpg?updatedAt=1689049226559"
	);                                     // Store location of image in local device before uploading
	const [PDF, setPDF] = useState("");    // Store Notice Media URL in local device before uploading
	const [name, setName] = useState("");  // Store name of image uploaded
	const [delName, setDelName] = useState([]);  // Store name of image to be deleted
	const [adminData, setAdminData] = useState([]);  // Store Admin Details
	const [note, setNote] = useState("");  // Store Notice uploaded by Admin

	const [gallery, setGalery] = useState(false); // Store Admin prmission to upload in Gallery
	const [delgallery, setDelGallery] = useState(false); // Store Admin prmission to delete in Gallery
	const [carousel, setCarousel] = useState(false); // Store Admin prmission to upload in Carousel
	const [delcarousel, setDelCarousel] = useState(false); // Store Admin prmission to delete in Carousel
	const [notice, setNotice] = useState(false); // Store Admin prmission to upload note in Notice
	const [delnotice, setDelNotice] = useState(false); // Store Admin prmission to delete note in Notice
	const [noticeUpload, setNoticeUpload] = useState(false); // Store Admin prmission to upload media in Notice
	const [delNoticeUpload, setDelNoticeUpload] = useState(false); // Store Admin prmission to delete media in Notice

	const [data, setData] = useState(null) // Store Current data of Gallery/Carousel/Notice
	const [checked, setChecked] = useState(false) // Check whether checkbox is checked or not

	const [dateNotice, setDateNotice] = useState("") // Store Date of Notice to be deleted

	const searchParams = useSearchParams()

	const user = searchParams.get('email');


	//Displaying Photo
	const handleChange = async (e) => {
		setImage(e.target.files[0]);
		setPhoto(URL.createObjectURL(e.target.files[0]));
		setName(e.target.files[0].name);
	};

	// Displaying Media
	const handleChange1 = async (e) => {
		setPDF(URL.createObjectURL(e.target.files[0]));
		setNoticeMedia(e.target.files[0]);
		setName(e.target.files[0].name);
	}


	//Displaying Gallery Data
	const dispGal = async () => {
		setLoading(true);

		const docRef = doc(db, "gallery", "images");
		try {
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setData(docSnap.data().images)

			} else {
				console.log("No such document!");
			}

			setDelGallery(true);
			setGalery(false);

		} catch (error) {
			toast.error(error)
		}
		setLoading(false);
	}

	//Uploading Gallery
	const upload = async () => {
		setLoading(true);
		try {
			if (!image) {
				toast.error("Photo not Selected");
				setPhoto(
					"https://ik.imagekit.io/xji6otwwkb/ESM/bg.jpg?updatedAt=1689049226559"
				);
				return;
			}

			// Getting data
			const docRef = doc(db, "gallery", "images");
			const docSnap = await getDoc(docRef);

			// uploading Photo
			const imageRef = ref(storage, `Gallery/${name}`);
			await uploadBytes(imageRef, image);
			const url = await getDownloadURL(imageRef);

			//Saving URL of photo in JSON format
			var imgData = { Name: name, URL: url }
			// Checking for Data
			if (!imgData) {
				toast.error("Photo not Uploaded");
				setImage(null);
				setName("");
				setGalery(false);
				setLoading(false);
				return;
			}
			// If data exist save it to array otherwise create new
			if (docSnap.exists()) {
				await setDoc(doc(db, "gallery", "images"), {
					images: [...docSnap.data().images, imgData]
				});
			} else {
				await setDoc(doc(db, "gallery", "images"), {
					images: [imgData],
				});
			}
			toast.success("Photo Uploaded Succesfully");
		} catch (error) {
			toast.error(error.code);
		}
		setPhoto(
			"https://ik.imagekit.io/xji6otwwkb/ESM/bg.jpg?updatedAt=1689049226559"
		);
		setImage(null);
		setName("");
		setGalery(false);
		setLoading(false);
	};

	//Delete Gallery
	const delGal = async () => {
		setLoading(true);

		try {
			var myArray = data.filter((item) => !delName.includes(item.Name));

			await setDoc(doc(db, "gallery", "images"), {
				images: [...myArray],
			});
			toast.success("Photo Deleted Succesfully")

		} catch (error) {
			toast.error(error)
		}
		setName("");
		setDelName([]);
		setDelGallery(false);
		setLoading(false);
		setData(null);
		setChecked(false);
		myArray = null;
	}



	//Displaying Carousel Data
	const dispCar = async () => {
		setLoading(true);

		const docRef = doc(db, "carousel", "images");
		try {
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setData(docSnap.data().images)

			} else {
				console.log("No such document!");
			}

			setDelCarousel(true);
			setCarousel(false);

		} catch (error) {
			toast.error(error)
		}
		setLoading(false);
	}

	//Uploading Carousel
	const carusl = async () => {
		try {
			if (!image) {
				toast.error("Photo not Selected");
				setPhoto(
					"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697"
				);
				return;
			}

			// Getting data
			const docRef = doc(db, "carousel", "images");
			const docSnap = await getDoc(docRef);

			// uploading Photo
			const imageRef = ref(storage, `Carousel/${name}`);
			await uploadBytes(imageRef, image);
			const url = await getDownloadURL(imageRef);

			//Saving URL of photo in JSON format
			var imgData = { Name: name, URL: url }
			// Checking for Data
			if (!imgData) {
				toast.error("Photo not Uploaded");
				setImage(null);
				setName("");
				setCarousel(false);
				setLoading(false);
				return;
			}
			// If data exist save it to array otherwise create new
			if (docSnap.exists()) {
				await setDoc(doc(db, "carousel", "images"), {
					images: [...docSnap.data().images, imgData]
				});
			} else {
				await setDoc(doc(db, "carousel", "images"), {
					images: [imgData],
				});
			}
			toast.success("Photo Uploaded Succesfully");
			setTimeout(() => {
				setCarousel(false);
			}, 1500);
		} catch (error) {
			toast.error(error.code);
			setPhoto(
				"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697"
			);
			setCarousel(false);
		}
	};

	//Delete Carousel
	const delCar = async () => {
		setLoading(true);

		try {
			var myArray = data.filter((item) => !delName.includes(item.Name));

			await setDoc(doc(db, "carousel", "images"), {
				images: [...myArray],
			});
			toast.success("Photo Deleted Succesfully")

		} catch (error) {
			toast.error(error)
		}
		setName("");
		setDelName([]);
		setDelCarousel(false);
		setLoading(false);
		setData(null);
		setChecked(false);
		myArray = null;
	}



	//Uploading Notice
	const notices = async () => {
		try {
			if (!note) {
				toast.error("Enter Notice");
				setNote("");
				return;
			}

			// Getting Date
			var date = new Date();

			await setDoc(doc(db, "notices", date.toISOString().split("T")[0]), {
				Notice: note,
				Date: moment().format("Do MMM YYYY"),
				timeStamp: date.getTime(),
			});

			setNote("");
			toast.success("Notice Uploaded Succesfully");
			setTimeout(() => {
				setNotice(false);
			}, 1500);
		} catch (error) {
			toast.error(error.code);
			setNote("");
			setNotice(false);
		}
	};

	//Delete Notice
	const delNote = async () => {
		if (!dateNotice) {
			toast.error("Enter Date");
			return;
		}
		setLoading(true);
		try {

			const docRef = doc(db, "notices", dateNotice);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				await deleteDoc(doc(db, "notices", dateNotice));
				toast.success("Notice Deleted Sucessfully")
			} else {
				toast.error("No Such Notice !")
			}
		} catch (error) {
			toast.error(error);
		}
		setDateNotice("");
		setDelNotice(false);
		setLoading(false);
	}



	//Displaying Notice Media
	const dispNoticeMedia = async () => {
		setLoading(true);

		const docRef = doc(db, "Notice Media", "Media");
		try {
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setData(docSnap.data().media)

			} else {
				console.log("No such document!");
			}

			setNoticeUpload(false);
			setDelNoticeUpload(true);

		} catch (error) {
			toast.error(error)
		}
		setLoading(false);
	}

	//Uploading Notice Media
	const Noticeupload = async () => {
		setLoading(true);
		if (!noticeMedia) {
			toast.error("Media not Selected");
			return;
		}

		try {
			// Getting data
			const docRef = doc(db, "Notice Media", "Media");
			const docSnap = await getDoc(docRef);

			// uploading Photo
			const mediaRef = ref(storage, `Notices/${name}`);
			await uploadBytes(mediaRef, noticeMedia);
			const url = await getDownloadURL(mediaRef);

			const date = new Date().toLocaleDateString();

			//Saving URL of photo in JSON format
			var mediaData = { Name: name, MediaURL: url, Date: date }
			// Checking for Data
			if (!mediaData) {
				toast.error("Media not Uploaded");
				setNoticeMedia(null)
				setName("");
				setNoticeUpload(false);
				setLoading(false);
				return;
			}
			// If data exist save it to array otherwise create new
			if (docSnap.exists()) {
				await setDoc(doc(db, "Notice Media", "Media"), {
					media: [...docSnap.data().media, mediaData]
				});
			} else {
				await setDoc(doc(db, "Notice Media", "Media"), {
					media: [mediaData],
				});
			}
			toast.success("Media Uploaded Succesfully");
		} catch (error) {
			toast.error(error.code);
		}
		setNoticeMedia(null)
		setName("");
		setNoticeUpload(false);
		setLoading(false);
	};

	//Delete Notice Media
	const delNoticeMedia = async () => {
		setLoading(true);

		try {
			var myArray = data.filter((item) => !delName.includes(item.Name));

			await setDoc(doc(db, "Notice Media", "Media"), {
				media: [...myArray],
			});
			toast.success("Media Deleted Succesfully")

		} catch (error) {
			toast.error(error)
		}
		setName("");
		setDelName([]);
		setDelNoticeUpload(false);
		setLoading(false);
		setData(null);
		setChecked(false);
		myArray = null;
	}



	//Cancel all Business
	const cancel = () => {
		setGalery(false);
		setDelGallery(false);
		setCarousel(false);
		setDelCarousel(false);
		setNotice(false);
		setDelNotice(false);
		setNoticeUpload(false);
		setDelNoticeUpload(false);
		setData(null);
		setName(null);
		setChecked(false);
		setPhoto("https://ik.imagekit.io/xji6otwwkb/ESM/bg.jpg?updatedAt=1689049226559");
	}

	//Getting Admin Data
	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(collection(db, "users"), where("email", "==", user)),
			(querySnapshot) => {
				querySnapshot.forEach((doc) => {
					setAdminData(doc.data());
				});
			}
		);

		return () => {
			unsubscribe;
		};
	}, [user]);

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

					{user ? (
						<div>
							<h1 id="heading1">Admin Panel</h1>

							{/* Admin Info */}
							{adminData ? (
								<div className="flex flex-col-reverse lg:flex-row justify-center items-center">
									<div className="flex hover:scale-105 transition-all ease-in-out duration-300 flex-col space-y-4 justify-center items-center">
										<p className="text-xl lg:text-2xl font-semibold">
											Mr. {adminData.displayName}
										</p>
										{adminData.RegNo !== 0 &&
											<p className="text-xl lg:text-2xl font-semibold">
												{adminData.serviceField}
											</p>
										}
										<p className="text-xl lg:text-2xl font-semibold">
											{adminData.phoneNo}
										</p>
										<p className="text-xl lg:text-2xl font-semibold">{adminData.email}</p>
									</div>

									<div className="lg:w-96 lg:h-96 w-48 h-48 m-5 mx-12">
										<img
											src={adminData.photoURL}
											className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box lg:rounded-full"
											alt="Profile"
										/>
									</div>
								</div>
							) : (
								<p className="text-center text-2xl my-48">😕 No Data Found 😕</p>
							)}


							<section className="flex flex-col space-y-40 justify-evenly m-10 mt-72 text-xl">

								{/* Gallery */}
								<div>
									<p className="text-3xl text-center">Gallery</p>
									<div className="flex justify-around flex-col lg:flex-row space-y-6 items-center">
										{/* Upload Gallery Images */}
										{!gallery ? (
											<button
												onClick={() => {
													setGalery(true);
													setDelGallery(false);
												}}
												className="button4 mx-auto mt-10">
												<span className="circle1"></span>
												<span className="circle2"></span>
												<span className="circle3"></span>
												<span className="circle4"></span>
												<span className="circle5"></span>
												<span className="text">Upload Images</span>
											</button>
										) : (
											<div className="space-y-6 mx-auto mt-10 w-full lg:w-1/2">
												<span onClick={cancel} className="float-right m-5 cursor-pointer">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														fill="currentColor"
														className="input-icon"
														viewBox="0 0 384 512">
														<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
													</svg>
												</span>
												<label
													htmlFor="aad"
													className="flex mt-10 flex-col p-5 items-center border-4 border-dashed border-white rounded-xl">
													<div className="shrink-0">
														<img
															className="h-48 w-fit object-contain"
															src={photo}
															alt="Upload in Gallery"
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

												<button
													onClick={upload}
													className="button5 mt-10 content1 type1">
													{loading &&
														<div className="spinner">
															<div></div>
															<div></div>
															<div></div>
															<div></div>
															<div></div>
															<div></div>
														</div>
													}</button>


											</div>
										)}
										{/* Delete Gallery Images */}
										{!delgallery ? (
											<button
												onClick={dispGal}
												className="button4 mx-auto mt-10">
												<span className="circle1"></span>
												<span className="circle2"></span>
												<span className="circle3"></span>
												<span className="circle4"></span>
												<span className="circle5"></span>
												<span className="text">Delete Images</span>
											</button>
										) : (
											<div className="space-y-6 mt-12 mx-auto lg:w-1/2 w-full">
												<span onClick={cancel} className="float-right m-5 cursor-pointer">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														fill="currentColor"
														className="input-icon"
														viewBox="0 0 384 512">
														<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
													</svg>
												</span>

												<div className="h-96 overflow-y-scroll scroll">
													{data ? (
														data.map((item, index) => (
															<label
																htmlFor={item.Name}
																key={index}
																onChange={(e) => { e.target.checked ? setChecked(true) : index }}
															>
																<div className="flex w-full cursor-pointer justify-between rounded-xl mt-10 items-center border-2 border-dashed p-2 flex-row">
																	<p>{item.Name}</p>
																	<input
																		id={item.Name}
																		type="checkbox"
																		onChange={(e) => {
																			delName.length > 0 ?
																				setDelName([...delName, e.target.id]) : setDelName([e.target.id]);
																		}}
																		className={`${checked ? "w-7 h-7 rounded-xl" : "hidden"} accent-blue-500`}
																	/>
																	<div className="h-24 w-24 items-center">
																		<img
																			src={item.URL}
																			alt="Gallery"
																			className="max-h-full min-w-full rounded-box object-cover"
																		/>
																	</div>
																</div>
															</label>
														))
													) : (
														<p className="text-center text-2xl my-48">😕 No Data Found 😕</p>
													)}
												</div>

												<button
													onClick={delGal}
													className="button5 content2 mt-10 type1">{loading &&
														<div className="spinner">
															<div></div>
															<div></div>
															<div></div>
															<div></div>
															<div></div>
															<div></div>
														</div>
													}
												</button>

											</div>
										)}
									</div>
								</div>

								{/* Carousel */}
								<div>
									<p className="text-3xl text-center">Carousel</p>
									<div className="flex justify-around flex-col lg:flex-row space-y-6 items-center">
										{/* Upload Carousel Images */}
										{!carousel ? (
											<button
												onClick={() => {
													setCarousel(true);
													setDelCarousel(false);
												}}
												className="button4 mx-auto mt-10">
												<span className="circle1"></span>
												<span className="circle2"></span>
												<span className="circle3"></span>
												<span className="circle4"></span>
												<span className="circle5"></span>
												<span className="text">Upload Images</span>
											</button>
										) : (
											<div className="space-y-6 mx-auto w-full lg:w-1/2">
												<span onClick={cancel} className="float-right m-5 cursor-pointer">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														fill="currentColor"
														className="input-icon"
														viewBox="0 0 384 512">
														<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
													</svg>
												</span>
												<label
													htmlFor="aad"
													className="flex mt-10 flex-col p-5 items-center border-4 border-dashed border-white rounded-xl">
													<div className="shrink-0">
														<img
															className="h-48 w-fit object-contain"
															src={photo}
															alt="Upload in Carousel"
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

												<button
													onClick={carusl}
													className="button5 mt-10 content1 type1"></button>


											</div>
										)}
										{/* Delete Carousel Images */}
										{!delcarousel ? (
											<button
												onClick={dispCar}
												className="button4 mx-auto mt-10">
												<span className="circle1"></span>
												<span className="circle2"></span>
												<span className="circle3"></span>
												<span className="circle4"></span>
												<span className="circle5"></span>
												<span className="text">Delete Images</span>
											</button>
										) : (
											<div className="space-y-6 mt-12 mx-auto lg:w-1/2 w-full">
												<span onClick={cancel} className="float-right m-5 cursor-pointer">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														fill="currentColor"
														className="input-icon"
														viewBox="0 0 384 512">
														<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
													</svg>
												</span>

												<div className="h-96 overflow-y-scroll scroll">
													{data ? (
														data.map((item, index) => (
															<label
																htmlFor={item.Name}
																key={index}
																onChange={(e) => { e.target.checked ? setChecked(true) : index }}
															>
																<div className="flex w-full cursor-pointer justify-between rounded-xl mt-10 items-center border-2 border-dashed p-2 flex-row">
																	<p>{item.Name}</p>
																	<input
																		id={item.Name}
																		type="checkbox"
																		onChange={(e) => {
																			delName.length > 0 ?
																				setDelName([...delName, e.target.id]) : setDelName([e.target.id]);
																		}}
																		className={`${checked ? "w-7 h-7 rounded-xl" : "hidden"} accent-blue-500`} />
																	<div className="h-24 w-24 items-center">
																		<img
																			src={item.URL}
																			alt="Gallery"
																			className="max-h-full min-w-full rounded-box object-cover"
																		/>
																	</div>
																</div>
															</label>
														))
													) : (
														<p className="text-center text-2xl my-48">😕 No Data Found 😕</p>
													)}
												</div>

												<button
													onClick={delCar}
													className="button5 content2 mt-10 type1">
													{loading &&
														<div className="spinner">
															<div></div>
															<div></div>
															<div></div>
															<div></div>
															<div></div>
															<div></div>
														</div>
													}
												</button>

											</div>
										)}
									</div>
								</div>

								{/* Notice */}
								<div>
									<p className="text-3xl text-center">Notice</p>
									<div className="flex justify-around flex-col lg:flex-row space-y-6 items-center">
										{/* Upload Notice */}
										{!notice ? (
											<button
												onClick={() => {
													setNotice(true);
													setDelNotice(false);
												}}
												className="button4 mx-auto mt-10">
												<span className="circle1"></span>
												<span className="circle2"></span>
												<span className="circle3"></span>
												<span className="circle4"></span>
												<span className="circle5"></span>
												<span className="text">Upload Notice</span>
											</button>
										) : (
											<div className="space-y-6 mt-12 mx-auto lg:w-1/2 w-full">
												<span onClick={cancel} className="float-right m-5 cursor-pointer">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														fill="currentColor"
														className="input-icon"
														viewBox="0 0 384 512">
														<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
													</svg>
												</span>
												<div className="field">
													<input
														name="note"
														required
														placeholder="Notice"
														className="input-field"
														type="text"
														onChange={(e) => setNote(e.target.value)}
														value={note}
													/>
												</div>

												<button
													onClick={notices}
													className="button5 mt-10 content1 type1"></button>


											</div>
										)}
										{/* Delete Notice */}
										{!delnotice ? (
											<button
												onClick={() => {
													setNotice(false);
													setDelNotice(true);
												}}
												className="button4 mx-auto mt-10">
												<span className="circle1"></span>
												<span className="circle2"></span>
												<span className="circle3"></span>
												<span className="circle4"></span>
												<span className="circle5"></span>
												<span className="text">Delete Notice</span>
											</button>
										) : (
											<div className="space-y-6 mt-12 mx-auto lg:w-1/2 w-full">
												<span onClick={cancel} className="float-right m-5 cursor-pointer">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														fill="currentColor"
														className="input-icon"
														viewBox="0 0 384 512">
														<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
													</svg>
												</span>
												<div className="field flex flex-col">
													<label htmlFor="note" className="py-2 my-1 w-full text-center font-semibold text-2xl bg-[#ff671f] rounded-xl">
														Enter Date of Notice to be Deleted
													</label>
													<input
														id="note"
														name="date"
														required
														placeholder="Enter Date of Notice"
														className="input-field"
														type="date"
														onChange={(e) => setDateNotice(e.target.value)}
														value={dateNotice}
													/>
												</div>

												<button
													onClick={delNote}
													className="button5 content2 mt-10 type1"></button>

											</div>
										)}
									</div>
								</div>

								{/* Notice Upload */}
								<div>
									<p className="text-3xl text-center">Notice Upload</p>
									<div className="flex justify-around flex-col lg:flex-row space-y-6 items-center">
										{/* Upload Notice Media */}
										{!noticeUpload ? (
											<button
												onClick={() => {
													setNoticeUpload(true);
													setDelNoticeUpload(false);
												}}
												className="button4 mx-auto mt-10">
												<span className="circle1"></span>
												<span className="circle2"></span>
												<span className="circle3"></span>
												<span className="circle4"></span>
												<span className="circle5"></span>
												<span className="text">Upload Media</span>
											</button>
										) : (
											<div className="space-y-6 mx-auto mt-10 w-full lg:w-1/2">
												<span onClick={cancel} className="float-right m-5 cursor-pointer">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														fill="currentColor"
														className="input-icon"
														viewBox="0 0 384 512">
														<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
													</svg>
												</span>
												<label
													htmlFor="aad"
													className="flex mt-10 flex-col p-5 items-center border-4 border-dashed border-white rounded-xl">
													<object
														data={PDF}
														type="application/pdf"
														width="100%"
														height="100%">
													</object>
													<input
														onChange={handleChange1}
														type="file"
														id="aad"
														accept=".pdf"
														className="mx-auto mt-8 text-sm text-white file:mr-4 file:py-2 file:px-4 file:bg-[#FF671F] file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:cursor-pointer"
													/>
												</label>

												<button
													onClick={Noticeupload}
													className="button5 mt-10 content1 type1">
													{loading &&
														<div className="spinner">
															<div></div>
															<div></div>
															<div></div>
															<div></div>
															<div></div>
															<div></div>
														</div>
													}</button>


											</div>
										)}
										{/* Delete Notice Media */}
										{!delNoticeUpload ? (
											<button
												onClick={dispNoticeMedia}
												className="button4 mx-auto mt-10">
												<span className="circle1"></span>
												<span className="circle2"></span>
												<span className="circle3"></span>
												<span className="circle4"></span>
												<span className="circle5"></span>
												<span className="text">Delete Media</span>
											</button>
										) : (
											<div className="space-y-6 mt-12 mx-auto lg:w-1/2 w-full">
												<span onClick={cancel} className="float-right m-5 cursor-pointer">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														fill="currentColor"
														className="input-icon"
														viewBox="0 0 384 512">
														<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
													</svg>
												</span>

												<div className="h-96 overflow-y-scroll scroll">
													{data ? (
														data.map((item, index) => (
															<label
																htmlFor={item.Name}
																key={index}
																onChange={(e) => { e.target.checked ? setChecked(true) : index }}
															>
																<div className="flex w-full cursor-pointer justify-between rounded-xl mt-10 items-center border-2 border-dashed p-2 flex-row">
																	<p>{item.Name}</p>
																	<input
																		id={item.Name}
																		type="checkbox"
																		onChange={(e) => {
																			delName.length > 0 ?
																				setDelName([...delName, e.target.id]) : setDelName([e.target.id]);
																		}}
																		className={`${checked ? "w-7 h-7 rounded-xl" : "hidden"} accent-blue-500`} />
																	<div className="h-24 w-24 items-center">
																		<object
																			data={item.MediaURL}
																			type="application/pdf"
																			width="100%"
																			height="100%">
																		</object>
																	</div>
																</div>
															</label>
														))
													) : (
														<p className="text-center text-2xl my-48">😕 No Data Found 😕</p>
													)}
												</div>

												<button
													onClick={delNoticeMedia}
													className="button5 content2 mt-10 type1">
													{loading &&
														<div className="spinner">
															<div></div>
															<div></div>
															<div></div>
															<div></div>
															<div></div>
															<div></div>
														</div>
													}
												</button>

											</div>
										)}
									</div>
								</div>
							</section >

							<ToastContainer />
						</div >
					) : (
						<p className="text-center text-2xl my-48">👿 You are not an Admin 👿</p >
					)}

					<Footer />
				</>
			) : (
				<Loader />
			)}
		</>
	);
};

export default Admin;
