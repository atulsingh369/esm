"use client";
import React, { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../src/app/config";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../src/store";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./load.css";
import GoogleButton from "react-google-button";

const Carousel = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const [curUser, setCurUser] = useState({
    email: "",
    password: "",
  });

  const provider = new GoogleAuthProvider();

  const [url, setURL] = useState("");
  const [role, setRole] = useState("");

  const user = useSelector((state) => state.user);

  const signIn = async () => {
    setLoading(true);
    if (!curUser.email || !curUser.password) {
      toast.error("Enter Credentials");
      setCurUser({
        email: "",
        password: "",
      });
      return;
    }
    try {
      //User is logined here
      const userCredential = await signInWithEmailAndPassword(
        auth,
        curUser.email,
        curUser.password
      );

      //User's data is fetched from firestroe
      const docRef = doc(db, "users", curUser.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setURL(docSnap.data().photoURL);
        setRole(docSnap.data().role);
      } else {
        toast.error("Data not Found");
      }

      //User's present profile is updated with URL got from firestore
      await updateProfile(userCredential.user, {
        photoURL: url,
        role: role,
      });

      //User is dispatched to redux to login
      const res = userCredential.user;
      dispatch(setUser(res));
      toast.success(`Welcome ${res.displayName}`);
      setCurUser({
        email: "",
        password: "",
      });
      setLoading(false);
    } catch (error) {
      toast.error(error.code);
      setCurUser({
        email: "",
        password: "",
      });
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      setDoc(doc(db, "users", user.email), {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        role: "user",
      });
      toast.success(`Welcome ${user.displayName}`);
      // IdP data available using getAdditionalUserInfo(result)
      dispatch(setUser(user));
    } catch (error) {
      // Handle Errors here.
      toast.error(error);

      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      setCurUser({
        email: "",
        password: "",
      });
    }
    //     await signInWithPopup(auth, provider)
    //       .then((result) => {
    //         // This gives you a Google Access Token. You can use it to access the Google API.
    //         const credential = GoogleAuthProvider.credentialFromResult(result);
    //         const token = credential.accessToken;
    //         // The signed-in user info.
    // 				const user = result.user;

    // //User's data is fetched from firestroe
    //       const docRef = doc(db, "users", curUser.email);
    //       const docSnap = await getDoc(docRef);
    //       if (docSnap.exists()) {
    //         setURL(docSnap.data().photoURL);
    //         setRole(docSnap.data().role);
    //       } else {
    //         toast.error("Data not Found");
    //       }

    //       //User's present profile is updated with URL got from firestore
    //       await updateProfile(userCredential.user, {
    //         photoURL: url,
    //         role: role,
    //       });

    //         toast.success(`Welcome ${user.displayName}`);
    //         // IdP data available using getAdditionalUserInfo(result)
    //         dispatch(setUser(user));

    //         setDoc(doc(db, "users", user.email), {
    //           uid: user.uid,
    //           displayName: user.displayName,
    //           photoURL: user.photoURL,
    //           email: user.email,
    //         });
    //       })
    //       .catch((error) => {
    //         // Handle Errors here.
    //         toast.error(error);
    //         // The email of the user's account used.
    //         const email = error.customData.email;
    //         // The AuthCredential type that was used.
    //         const credential = GoogleAuthProvider.credentialFromError(error);
    //         setCurUser({
    //           email: "",
    //           password: "",
    //         });
    //       });
  };

  // Getting data
  const docRef = doc(db, "carousel", "images");

  useEffect(() => {
    const unsub = onSnapshot(docRef, (doc) => {
      setData(doc.data().images);
    });

    return () => {
      unsub;
    };
  }, []);

  return (
    <>
      <div
        className={`${
          !user
            ? "grid grid-cols-1 md:grid-cols-2 gap-3 p-3 transition-all ease-in-out duration-300"
            : "flex justify-center p-3 my-5 items-center transition-all ease-in-out duration-300"
        }`}>
        <div className="carousel carousel-center p-4 space-x-8 border-4 border-white border-dashed rounded-xl">
          {data ? (
            <div className="moving-images items-center flex space-x-8">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="carousel-item h-80 hover:scale-105 transition-all ease-in-out duration-300 ">
                  <img src={item} className="rounded-box w-96" />
                </div>
              ))}
            </div>
          ) : (
            <div className="moving-images flex space-x-8">
              <div className="carousel-item hover:scale-105 transition-all ease-in-out duration-300 ">
                <img
                  src="https://ik.imagekit.io/e5ixuxrlb/esm/carousel-1.jpg?updatedAt=1684263033199"
                  className="rounded-box w-96"
                />
              </div>
              <div className="carousel-item hover:scale-105 transition-all ease-in-out duration-300  ">
                <img
                  src="https://ik.imagekit.io/e5ixuxrlb/esm/sa.jpg?updatedAt=1684843994819"
                  className="rounded-box w-96"
                />
              </div>
              <div className="carousel-item hover:scale-105 transition-all ease-in-out duration-300  ">
                <img
                  src="https://ik.imagekit.io/e5ixuxrlb/esm/sds.jpg?updatedAt=1684843998205"
                  className="rounded-box w-96"
                />
              </div>
              <div className="carousel-item hover:scale-105 transition-all ease-in-out duration-300  ">
                <img
                  src="https://ik.imagekit.io/e5ixuxrlb/esm/WhatsApp_Image_2023-04-28_at_10.06.28.jpg?updatedAt=1684844000866"
                  className="rounded-box w-96"
                />
              </div>
            </div>
          )}
        </div>

        {!user && (
          <div className="w-full border-4 border-[white] border-dashed rounded-lg flex flex-col gap-2 justify-center items-center p-5">
            <div className="form w-full space-y-5 rounded-md h-96">
              <p id="heading">Sign In Now</p>
              <div className="field">
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
                  autoComplete="off"
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
              <div className="field">
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
                  autoComplete="off"
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
              <button onClick={signIn} className="button1">
                {loading ? (
                  <div className="spinner mx-auto">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  "Log In"
                )}
              </button>
              {/* <div className="mx-auto"> -- OR -- </div>
              <GoogleButton className="mx-auto" onClick={googleLogin} /> */}
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default Carousel;
