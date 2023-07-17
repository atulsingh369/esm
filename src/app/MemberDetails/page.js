"use client";
import { db } from "@/app/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from "react";
import "./load.css";
import FuncNavbar from "../../../components/FuncNavabr";
import Footer from "../../../components/Footer";

const EditDetails = () => {
	const [data, setData] = useState(null);
	const [user, setUser] = useState(null);

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


	return (
		<>

			<FuncNavbar />

			<div className="md:px-56 px-5">
				<h1 id="heading1">
					Profile
				</h1>

				{data ? (
					<div>
						{user && user.role == "admin" &&
							<div className="flex flex-col justify-center md:mb-0 mb-10">
								<p className="text-xl md:text-2xl font-semibold">
									Registration No : {data.RegNo}
								</p>
								<p className="text-xl md:text-2xl font-semibold">
									Type : {data.role}
								</p>
							</div>
						}
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
									Pan No : {data.panNo}
								</p>
								<p className="text-xl md:text-2xl font-semibold">
									Email : {data.email}
								</p>
								<p className="text-xl md:text-2xl font-semibold">
									Mobile No : {data.phoneNo}
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

						{user && user.role == "admin" &&
							<div className="flex justify-center items-center md:mt-10">
								<button
									className="button4">
									<span className="circle1"></span>
									<span className="circle2"></span>
									<span className="circle3"></span>
									<span className="circle4"></span>
									<span className="circle5"></span>
									<span className="text">Edit Details</span>
								</button>
							</div>
						}
					</div>
				) : (
					<p className="text-center text-2xl my-48">😕 No Data Found 😕</p>
				)}

			</div>

			<Footer />
		</>
	);
};

export default EditDetails;