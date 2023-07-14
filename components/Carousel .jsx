"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import "./movingText.css";
import { auth, db } from "../src/app/config";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../src/store";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./load.css";
import GoogleButton from "react-google-button";
import Image from "next/image";

const Carousel = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const [curUser, setCurUser] = useState({
    email: "",
    password: "",
  });
  const containerRef = useRef(null);

  const provider = new GoogleAuthProvider();

  const [url, setURL] = useState("");
  const [role, setRole] = useState("");
  const [logIn, setLogIn] = useState(false);

  const user = useSelector((state) => state.user);

  const signIn = async () => {
    setLoading(true);
    if (!curUser.email || !curUser.password) {
      toast.error("Enter Credentials");
      setCurUser({
        email: "",
        password: "",
      });
      setLoading(false);
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
      window.scrollTo(0, 0);
      toast.success(`Welcome ${res.displayName}`);
    } catch (error) {
      window.scrollTo(0, 0);
      toast.error(error.code);
    }
    setCurUser({
      email: "",
      password: "",
    });
    setLoading(false);
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
  }, [docRef]);

  useEffect(() => {
    const container = containerRef.current;
    const handleAnimation = () => {
      {
        data && (container.style.transform = "translateX(100%)");
      } // Adjust the translation distance as needed
    };

    // Start the animation
    const animationId = setInterval(handleAnimation, 3000); // Adjust the animation duration as needed

    // Clean up the animation on component unmount
    return () => clearInterval(animationId);
  }, [data]);

  return (
    <>
      <div
        className={`${
          !user
            ? "grid grid-cols-1 md:grid-cols-2 gap-3 p-3 transition-all ease-in-out duration-300 mt-10"
            : "flex justify-center p-3 my-5 items-center transition-all ease-in-out duration-300 mt-10"
        }`}>
        <div className="border-4 border-white border-dashed rounded-xl">
          <div className="logo-parent-container">
            {data && (
              <div
                className="logo-container1 flex justify-center items-center"
                ref={containerRef}>
                {data.map((item, index) => (
                  <img
                    src={item}
                    key={index}
                    alt="carousel"
                    className="rounded-box max-h-full"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {!user && (
          <div className="w-full hidden border-4 border-[white] border-dashed rounded-lg md:flex flex-col gap-2 justify-center items-center p-5">
            <div className="form w-full space-y-5 rounded-md h-96">
              <p id="heading">SIGN IN</p>
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
              <button onClick={signIn} className="button4 w-full">
                <span className="circle1"></span>
                <span className="circle2"></span>
                <span className="circle3"></span>
                <span className="circle4"></span>
                <span className="circle5"></span>
                <span className="text">
                  {loading ? (
                    <div class="spinner">
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
                </span>
              </button>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>

      {!user && (
        <div className="md:hidden my-5">
          {logIn ? (
            <div className="w-full border-4 border-[white] border-dashed rounded-lg flex flex-col gap-2 justify-center items-center p-5">
              <span
                onClick={() => setLogIn(false)}
                className="justify-self-end m-5 cursor-pointer">
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
              <div className="form w-full space-y-5 rounded-md h-auto">
                <p id="heading">SIGN IN</p>
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
                <button onClick={signIn} className="button4 w-full">
                  <span className="circle1"></span>
                  <span className="circle2"></span>
                  <span className="circle3"></span>
                  <span className="circle4"></span>
                  <span className="circle5"></span>
                  <span className="text">
                    {loading ? (
                      <div class="spinner">
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
                  </span>
                </button>
                <button
                  onClick={() => setLogIn(false)}
                  className="button4 w-full">
                  <span className="circle1"></span>
                  <span className="circle2"></span>
                  <span className="circle3"></span>
                  <span className="circle4"></span>
                  <span className="circle5"></span>
                  <span className="text">Log In Later</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <button className="button4" onClick={() => setLogIn(true)}>
                <span className="circle1"></span>
                <span className="circle2"></span>
                <span className="circle3"></span>
                <span className="circle4"></span>
                <span className="circle5"></span>
                <span className="text">SIGN IN</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Carousel;
