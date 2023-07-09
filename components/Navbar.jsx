"use client";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../src/app/config";
import { setUser } from "../src/store";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, onSnapshot } from "firebase/firestore";
import Image from "next/image";

const Navbar = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "forest"
  );

  const user = useSelector((state) => state.user);

  const logOut = async () => {
    await signOut(auth)
      .then(() => {
        toast.success("Log Out sucessfuly");
      })
      .catch((error) => {
        toast.error(error.code);
      });
    dispatch(setUser(null));
    setData(null);
  };

  const docRef = user
    ? doc(db, "users", user.email)
    : doc(db, "users", "sample@gmail.com");

  useEffect(() => {
    const unsub = onSnapshot(docRef, (doc) => {
      setData(doc.data());
    });

    return () => {
      unsub;
    };
  }, [docRef]);

  return (
    <>
      {/* <div className="bottom-bar flex justify-evenly items-center py-1 bg-white  border-b-4 border-[#FF671F] ">
        <Link
          href="/"
          className=" bg-white border-none text-black font-semibold text-lg hover:bg-[#046A38] hover:text-white hover:font-normal">
          Home
        </Link>
        <Link
          href="/"
          className=" bg-white border-none text-black font-semibold text-lg hover:bg-[#046A38] hover:text-white hover:font-normal">
          About Us
        </Link>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="/Members"
          className=" bg-white border-none text-black font-semibold text-lg hover:bg-[#046A38] hover:text-white hover:font-normal">
          Our Members
        </Link>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="/Gallery"
          className=" bg-white border-none text-black font-semibold text-lg hover:bg-[#046A38] hover:text-white hover:font-normal">
          Gallery
        </Link>
        {!user ? (
          <div className="flex ">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="/Register"
              className=" bg-white border-none text-black font-semibold text-lg hover:bg-[#046A38] hover:text-white hover:font-normal">
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="dropdown dropdown-hover">
            <label
              tabIndex={0}
              className="flex  bg-white border-none text-black font-semibold text-lg hover:bg-[#046A38] hover:text-white hover:font-normal">
              <span id="hello">
                Hi&nbsp;{user.displayName}&nbsp;&nbsp;&nbsp;
              </span>
              <div className="avatar">
                <div className="w-9 rounded-full">
                  {data ? (
                    <img src={data.photoURL} alt="profile" />
                  ) : (
                    <img
                      src="https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697"
                      alt="profile"
                    />
                  )}
                </div>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content space-y-4 flex flex-col z-[1] menu p-2 bg-white rounded-box w-52">
              {data && (
                <div className="mx-auto">
                  {data.role == "admin" && (
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="/Admin">
                      <li className="cursor-pointer hover:scale-105 transition-all my-1 mx-auto ease-in-out duration-300">
                        Admin Panel
                      </li>
                    </Link>
                  )}
                </div>
              )}

              <li
                className="cursor-pointer hover:scale-105 transition-all my-1 mx-auto ease-in-out duration-300"
                onClick={logOut}>
                Logout
              </li>
            </ul>
          </div>
        )}
        <ToastContainer />
      </div> */}

      <div className="navbar w-full border-t-8 border-b-8 border-t-[#FF671F] border-b-[#046A38] top-0 bg-white text-black z-50">
        <div className="navbar-start">
          {/* dropdown hamburger  */}
          <div className="dropdown">
            <label tabIndex={0} className="bg-white btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-white rounded-box w-52">
              <li>
                <Link href="/">ABOUT US</Link>
              </li>

              <li>
                <Link target="_blank" rel="noopener noreferrer" href="/Members">
                  OUR MEMBERS
                </Link>
              </li>

              <li>
                <Link target="_blank" rel="noopener noreferrer" href="/Gallery">
                  GALLERY
                </Link>
              </li>
            </ul>
          </div>
          <Link href="/">
            <div className="flex justify-start items-center">
              <img
                src="https://ik.imagekit.io/e5ixuxrlb/esm/logo.png?updatedAt=1685270347657"
                alt="logo"
                className="h-20 md:h-32"
              />
              <p className="text-lg md:text-2xl text-[#FF671F] font-semibold p-2">
                भूतपूर्व सैनिक जन कल्याण समिति
              </p>
            </div>
          </Link>
        </div>

        {/* Main Navbar */}
        <div className="navbar-center hidden lg:flex font-semibold">
          <ul className="menu menu-horizontal px-1 items-center font-semibold lg:gap-5">
            <li>
              <Link
                href="/"
                className="bg-white first border-none hover:scale-105 transition-all ease-in-out duration-300 text-black font-semibold text-lg hover:font-normal">
                <button className="btn1">ABOUT US</button>
              </Link>
            </li>

            <li>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="/Members"
                className="bg-white second border-none hover:scale-105 transition-all ease-in-out duration-300 text-black font-semibold text-lg hover:font-normal">
                <button className="btn1">OUR MEMBERS</button>
              </Link>
            </li>

            <li>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="/Gallery"
                className="bg-white third border-none hover:scale-105 transition-all ease-in-out duration-300 text-black font-semibold text-lg hover:font-normal">
                <button className="btn1">GALLERY</button>
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end md:mr-10 font-semibold">
          {!user ? (
            <div className="flex ">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="/Register"
                className="bg-white hover:scale-120 transition-all ease-in-out duration-300 border-none text-black font-semibold text-lg hover:text-[#046A38] hover:font-normal">
                <button className="button4">SIGN UP</button>
              </Link>
            </div>
          ) : (
            <div className="dropdown dropdown-hover">
              <label
                tabIndex={0}
                className="flex hover:scale-120 transition-all ease-in-out duration-300 bg-white border-none text-black font-semibold text-lg hover:text-[#046A38] hover:font-normal">
                <span id="hello">
                  Hi&nbsp;{user.displayName}&nbsp;&nbsp;&nbsp;
                </span>
                <div className="avatar">
                  <div className="w-9 rounded-full">
                    {data ? (
                      <img src={data.photoURL} alt="profile" />
                    ) : (
                      <img
                        src="https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697"
                        alt="profile"
                      />
                    )}
                  </div>
                </div>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content space-y-4 flex flex-col z-[1] menu p-2 bg-white rounded-box w-52">
                {data && (
                  <div className="mx-auto">
                    {data.role == "admin" && (
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href="/Admin">
                        <li className="cursor-pointer hover:scale-120 transition-all my-1 mx-auto ease-in-out duration-300">
                          Admin Panel
                        </li>
                      </Link>
                    )}
                  </div>
                )}

                <li
                  className="cursor-pointer hover:scale-120 transition-all my-1 mx-auto ease-in-out duration-300"
                  onClick={logOut}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Navbar;

{
  /*
 import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config";
import { setUser } from "../store";
import MainLoader from "./MainLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const logOut = async () => {
    setLoading(true);
    await signOut(auth)
      .then(() => {
        toast.success("Logout Succesfully");
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Error while logging out");
      });
    dispatch(setUser(null));
    navigate("/");
  };

  return (
    <>
      {loading ? (
        <MainLoader />
      ) : (
        <div className="navbar w-full fixed top-0 bg-base-100 text-white z-50">
          <div className="navbar-start">
            <div className="dropdown">
              <label tabIndex={0} className=" -ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                {user && (
                  <li>
                    <Link to="/tour">IERT TOUR</Link>
                  </li>
                )}
                {user && (
                  <li>
                    <Link to="/events">EVENTS</Link>
                  </li>
                )}
                {user && (
                  <li tabIndex={0}>
                    <Link to="#!" className="justify-between">
                      COMPETITION
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24">
                        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                      </svg>
                    </Link>
                    <ul className="p-2 ">
                      <li className="">
                        <Link to="/forms" className="font-semibold">
                          LOGO
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}

                <li>
                  <Link to="/contact-us">CONTACT US</Link>
                </li>
              </ul>
            </div>
            <Link to="/" className=" -ghost normal-case text-xl">
              UDBHAV
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex font-semibold">
            <ul className="menu menu-horizontal px-1 items-center font-semibold lg:gap-5">
              {user && (
                <li>
                  <Link to="/tour">IERT TOUR</Link>
                </li>
              )}
              {user && (
                <li>
                  <Link to="/events">EVENTS</Link>
                </li>
              )}
              {user && (
                <li tabIndex={0}>
                  <Link to="#!">
                    COMPETITION
                    <svg
                      className="fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24">
                      <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                    </svg>
                  </Link>
                  <ul className="p-2">
                    <li className="">
                      <Link to="/forms" className="text-white font-semibold ">
                        LOGO
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

              {user && (
                <li>
                  <Link to="/contact-us">CONTACT US</Link>
                </li>
              )}
            </ul>
          </div>
          <div className="navbar-end font-semibold">
            {!user ? (
              <div className="flex flex-row items-center justify-between gap-10">
                <ul className="hidden lg:flex">
                  <li>
                    <Link to="/contact-us">CONTACT US</Link>
                  </li>
                </ul>
                <button
                  className=" glass "
                  onClick={() => navigate("/register")}>
                  Register
                </button>
              </div>
            ) : (
              <div className="dropdown dropdown-hover dropdown-end">
                <span
                  tabIndex={0}
                  className="flex glass p-1  rounded-md items-center justify-center m-1">
                  <span id="hello">
                    {" "}
                    Hi&nbsp;{user.displayName}&nbsp;&nbsp;&nbsp;
                  </span>
                  <div className="avatar">
                    <div className="w-9 rounded-full">
                      {user.photoURL && <img src={user.photoURL} />}
                      {!user.photoURL && (
                        <img src="https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697" />
                      )}
                    </div>
                  </div>
                </span>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu divide-y-2 divide-base-300 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <span onClick={logOut}>Logout</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
 */
}
