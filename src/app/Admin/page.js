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

const Admin = () => {
	const [image, setImage] = useState(null);
	const [photo, setPhoto] = useState(
		"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697"
	);
	const [name, setName] = useState("");
	const [data, setData] = useState([]);
	const [note, setNote] = useState("");

	const [gallery, setGalery] = useState(false);
	const [carousel, setCarousel] = useState(false);
	const [notice, setNotice] = useState(false);

	//Displaying Photo
	const handleChange = async (e) => {
		setImage(e.target.files[0]);
		setPhoto(URL.createObjectURL(e.target.files[0]));
		setName(e.target.files[0].name);
	};

	//Uploading Gallery
	const upload = async () => {
		try {
			if (!image) {
				toast.error("Photo not Selected");
				setPhoto(
					"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697"
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

			// If data exist save it to array otherwise create new
			if (docSnap.exists()) {
				await setDoc(doc(db, "gallery", "images"), {
					images: [...docSnap.data().images, url],
				});
			} else {
				await setDoc(doc(db, "gallery", "images"), {
					images: [url],
				});
			}

			setPhoto(
				"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697"
			);
			toast.success("Photo Uploaded Succesfully");
			setTimeout(() => {
				setGalery(false);
			}, 1500);
		} catch (error) {
			toast.error(error.code);
			setPhoto(
				"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697"
			);
			setGalery(false);
		}
	};

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

			// If data exist save it to array otherwise create new
			if (docSnap.exists()) {
				await setDoc(doc(db, "carousel", "images"), {
					images: [...docSnap.data().images, url],
				});
			} else {
				await setDoc(doc(db, "carousel", "images"), {
					images: [url],
				});
			}

			setPhoto(
				"https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697"
			);
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

	//Getting Data
	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(collection(db, "users"), where("role", "==", "admin")),
			(querySnapshot) => {
				querySnapshot.forEach((doc) => {
					setData(doc.data());
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
				{data ? (
					<div className="flex flex-col-reverse md:flex-row justify-center items-center">
						<div className="flex hover:scale-105 transition-all ease-in-out duration-300 flex-col space-y-4 justify-center items-center">
							<p className="text-xl md:text-2xl font-semibold">
								Mr. {data.displayName}
							</p>
							<p className="text-xl md:text-2xl font-semibold">
								{data.serviceField}
							</p>
							<p className="text-xl md:text-2xl font-semibold">
								{data.phoneNo}
							</p>
							<p className="text-xl md:text-2xl font-semibold">{data.email}</p>
						</div>

						<div className="md:w-96 md:h-96 w-48 h-48 m-5 mx-12">
							<img
								src={data.photoURL}
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
							{!gallery ? (
								<button
									onClick={() => setGalery(true)}
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
										className="button5 mt-10 type1"></button>

									<ToastContainer />
								</div>
							)}
							<button
								onClick={() => setGalery(true)}
								className="button4 mx-auto mt-10">
								<span className="circle1"></span>
								<span className="circle2"></span>
								<span className="circle3"></span>
								<span className="circle4"></span>
								<span className="circle5"></span>
								<span className="text">Delete Images</span>
							</button>
						</div>
					</div>

					{/* Carousel */}
					<div>
						<p className="text-3xl text-center">Carousel</p>
						<div className="flex justify-around flex-col md:flex-row space-y-6 items-center">
							{!carousel ? (
								<button
									onClick={() => setCarousel(true)}
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
										className="button5 mt-10 type1"></button>

									<ToastContainer />
								</div>
							)}
							<button
								onClick={() => setNotice(true)}
								className="button4 mx-auto mt-10">
								<span className="circle1"></span>
								<span className="circle2"></span>
								<span className="circle3"></span>
								<span className="circle4"></span>
								<span className="circle5"></span>
								<span className="text">Delete Images</span>
							</button>
						</div>
					</div>

					{/* Notice */}
					<div>
						<p className="text-3xl text-center">Notice</p>
						<div className="flex justify-around flex-col md:flex-row space-y-6 items-center">
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
										className="button5 mt-10 type1"></button>

									<ToastContainer />
								</div>
							)}
							<button
								onClick={() => setNotice(true)}
								className="button4 mx-auto mt-10">
								<span className="circle1"></span>
								<span className="circle2"></span>
								<span className="circle3"></span>
								<span className="circle4"></span>
								<span className="circle5"></span>
								<span className="text">Delete Images</span>
							</button>
						</div>
					</div>
				</section>

				<ToastContainer />
			</div>

			<Footer />
		</>
	);
};

export default Admin;
