"use client";
import React, { useEffect, useState } from "react";
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
	collection,
	doc,
	getDoc,
	onSnapshot,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import { db, storage } from "../config";
import "./load.css";
import Image from "next/image";

const Admin = () => {
	const [loading, setLoading] = useState(false);  // Loading/Unloading
	const [image, setImage] = useState(null);  // Store image uploaded
	const [photo, setPhoto] = useState(
		"https://ik.imagekit.io/xji6otwwkb/ESM/bg.jpg?updatedAt=1689049226559"
	);                                     // Store location of image in local device before uploading
	const [name, setName] = useState("");  // Store name of image uploaded
	const [delName, setDelName] = useState([]);  // Store name of image to be deleted
	const [adminData, setAdminData] = useState([]);  // Store Admin Details
	const [note, setNote] = useState("");  // Store Notice uploaded by Admin

	const [gallery, setGalery] = useState(false); // Store Admin prmission to upload in Gallery
	const [delgallery, setDelGallery] = useState(false); // Store Admin prmission to delete in Gallery
	const [carousel, setCarousel] = useState(false); // Store Admin prmission to upload in Carousel
	const [delcarousel, setDelCarousel] = useState(false); // Store Admin prmission to delete in Carousel
	const [notice, setNotice] = useState(false); // Store Admin prmission to upload in Notice
	const [delnotice, setDelNotice] = useState(false); // Store Admin prmission to delete in Notice

	const [data, setData] = useState(null) // Store Current data of Gallery/Carousel/Notice
	const [checked, setChecked] = useState(false) // Check whether checkbox is checked or not


	
	//Displaying Photo
	const handleChange = async (e) => {
		setImage(e.target.files[0]);
		setPhoto(URL.createObjectURL(e.target.files[0]));
		setName(e.target.files[0].name);
	};



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
			var today = new Date();
			var date =
				today.getFullYear() +
				"-" +
				(today.getMonth() + 1) +
				"-" +
				today.getDate();

			await setDoc(doc(db, "notices", date), {
				Notice: note,
				Date: date,
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

	//Cancel all Business
	const cancel = () => {
		setGalery(false);
		setDelGallery(false);
		setCarousel(false);
		setDelCarousel(false);
		setNotice(false);
		setDelNotice(false);
		setData(null);
		setName(null);
		setChecked(false);
		setPhoto("https://ik.imagekit.io/xji6otwwkb/ESM/bg.jpg?updatedAt=1689049226559");
	}

	useEffect(() => {
		//Getting Admin Data
		const unsubscribe = onSnapshot(
			query(collection(db, "users"), where("role", "==", "admin")),
			(querySnapshot) => {
				querySnapshot.forEach((doc) => {
					setAdminData(doc.data());
				});
			}
		);

		return () => {
			unsubscribe;
		};
	}, []);

	return (
		<>
			<FuncNavbar />
			<div>
				<h1 id="heading1">Admin Panel</h1>

				{/* Admin Info */}
				{adminData ? (
					<div className="flex flex-col-reverse md:flex-row justify-center items-center">
						<div className="flex hover:scale-105 transition-all ease-in-out duration-300 flex-col space-y-4 justify-center items-center">
							<p className="text-xl md:text-2xl font-semibold">
								Mr. {adminData.displayName}
							</p>
							<p className="text-xl md:text-2xl font-semibold">
								{adminData.serviceField}
							</p>
							<p className="text-xl md:text-2xl font-semibold">
								{adminData.phoneNo}
							</p>
							<p className="text-xl md:text-2xl font-semibold">{adminData.email}</p>
						</div>

						<div className="md:w-96 md:h-96 w-48 h-48 m-5 mx-12">
							<img
								src={adminData.photoURL}
								className="max-h-full hover:scale-105 transition-all ease-in-out duration-300 min-w-full rounded-box md:rounded-full"
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
						<div className="flex justify-around flex-col md:flex-row space-y-6 items-center">
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
								<div className="space-y-6 mx-auto mt-10 w-full md:w-1/2">
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
								<div className="space-y-6 mt-12 mx-auto md:w-1/2 w-full">
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
										}</button>

								</div>
							)}
						</div>
					</div>

					{/* Carousel */}
					<div>
						<p className="text-3xl text-center">Carousel</p>
						<div className="flex justify-around flex-col md:flex-row space-y-6 items-center">
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
								<div className="space-y-6 mx-auto w-full md:w-1/2">
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
								<div className="space-y-6 mt-12 mx-auto md:w-1/2 w-full">
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

									<button
										onClick={delCar}
										className="button5 content2 mt-10 type1">{loading &&
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
						</div>
					</div>

					{/* Notice */}
					<div>
						<p className="text-3xl text-center">Notice</p>
						<div className="flex justify-around flex-col md:flex-row space-y-6 items-center">
							{/* Upload Notice */}
							{!notice ? (
								<button
									onClick={() => setNotice(true)}
									className="button4 mx-auto mt-10">
									<span className="circle1"></span>
									<span className="circle2"></span>
									<span className="circle3"></span>
									<span className="circle4"></span>
									<span className="circle5"></span>
									<span className="text">Upload Notice</span>
								</button>
							) : (
								<div className="space-y-6 mt-12 mx-auto md:w-1/2 w-full">
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
									onClick={() => setDelNotice(true)}
									className="button4 mx-auto mt-10">
									<span className="circle1"></span>
									<span className="circle2"></span>
									<span className="circle3"></span>
									<span className="circle4"></span>
									<span className="circle5"></span>
									<span className="text">Delete Notice</span>
								</button>
							) : (
								<div className="space-y-6 mt-12 mx-auto md:w-1/2 w-full">
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
											name="name"
											required
											placeholder="Enter name of Photo"
											className="input-field"
											type="text"
											onChange={(e) => setName(e.target.value)}
											value={name}
										/>
									</div>

									<button
										onClick={delGal}
										className="button5 content2 mt-10 type1"></button>

								</div>
							)}
						</div>
					</div>
				</section >

				<ToastContainer />
			</div >

			<Footer />
		</>
	);
};

export default Admin;
