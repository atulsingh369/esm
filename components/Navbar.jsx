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
      <div className="navbar w-full border-t-8 border-b-8 border-t-[#FF671F] border-b-[#046A38] top-0 bg-white text-black z-50">
        <div className="navbar-start">
          {/* dropdown hamburger  */}
          <div className="dropdown">
            <label tabIndex={0} className="bg-white btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
            <div className="flex flex-col md:flex-row justify-start items-center">
              <img
                src="https://ik.imagekit.io/e5ixuxrlb/esm/logo.png?updatedAt=1685270347657"
                alt="logo"
                className="h-20 mr-8 md:mr-0 md:h-32"
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
                className="hover:scale-105 transition-all ease-in-out duration-300 rounded-md font-semibold text-lg ">
                ABOUT US
              </Link>
            </li>

            <li>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="/Members"
                className="hover:scale-105 transition-all ease-in-out duration-300 rounded-md font-semibold text-lg ">
                OUR MEMBERS
              </Link>
            </li>

            <li>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="/Gallery"
                className="hover:scale-105 transition-all ease-in-out duration-300 rounded-md font-semibold text-lg ">
                GALLERY
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
                className="glass hover:scale-105 transition-all ease-in-out duration-300 px-5 py-3 font-semibold rounded-md items-center m-1">
                SIGN UP
              </Link>
            </div>
          ) : (
            <div className="dropdown dropdown-hover">
              <span
                tabIndex={0}
                className="flex glass p-1 rounded-md items-center justify-center m-1">
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
              </span>
              <ul
                tabIndex={0}
                className="dropdown-content menu divide-y-2 divide-base-300 shadow rounded-box w-52">
                {data && (
                  <div className="mx-auto">
                    {data.role == "admin" && (
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href="/Admin">
                        <li>Admin Panel</li>
                      </Link>
                    )}
                  </div>
                )}
                <li className="mx-auto">
                  <span onClick={logOut}>Logout</span>
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
