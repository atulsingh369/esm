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

  const user = useSelector((state) => state.user);

  const logOut = async () => {
    await signOut(auth)
      .then(() => {
        toast.success("Loged Out sucessfuly");
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
      <div className="border-t-8 w-full border-b-8 border-t-[#FF671F] border-b-[#046A38] top-0 bg-white text-black z-50">
        <div className="navbar">
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
                  <Link target="_blank" rel="noopener noreferrer" href="/">
                    ABOUT US
                  </Link>
                </li>

                <li>
                  {user ? (
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={{
                        pathname: "/Members",
                        query: { email: user.email },
                      }}>
                      MEMBERS
                    </Link>
                  ) : (
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="/Members">
                      MEMBERS
                    </Link>
                  )}
                </li>

                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="/Gallery">
                    GALLERY
                  </Link>
                </li>

                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="/Notices">
                    NOTICES
                  </Link>
                </li>
              </ul>
            </div>

            {/* Logo */}
            <Link href="/">
              <div className="flex ml-2 lg:ml-0 justify-start items-center">
                <img
                  src="https://ik.imagekit.io/e5ixuxrlb/esm/logo.png?updatedAt=1685270347657"
                  alt="logo"
                  className="h-20 mx-0 lg:mx-2 lg:h-32"
                />
                <p className="text-lg hidden lg:block lg:text-2xl text-[#FF671F] font-semibold">
                  भूतपूर्व सैनिक जन कल्याण समिति उ.प्र.
                </p>
              </div>
            </Link>
          </div>

          {/* Main Navbar */}
          <div className="navbar-center lg:ml-2 hidden lg:flex font-semibold">
            <ul className="menu menu-horizontal px-1 items-center font-semibold lg:gap-5">
              <li>
                <Link
                  href="/"
                  className="hover:scale-105 transition-all ease-in-out duration-300 rounded-md font-semibold text-lg ">
                  ABOUT US
                </Link>
              </li>

              <li>
                {user ? (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={{
                      pathname: "/Members",
                      query: { email: user.email },
                    }}
                    className="hover:scale-105 transition-all ease-in-out duration-300 rounded-md font-semibold text-lg ">
                    MEMBERS
                  </Link>
                ) : (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="/Members"
                    className="hover:scale-105 transition-all ease-in-out duration-300 rounded-md font-semibold text-lg ">
                    MEMBERS
                  </Link>
                )}
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

              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/Notices"
                  className="hover:scale-105 transition-all ease-in-out duration-300 rounded-md font-semibold text-lg ">
                  NOTICES
                </Link>
              </li>
            </ul>
          </div>

          <div className="navbar-end lg:-ml-36 lg:mr-16 font-semibold">
            {!user ? (
              <div className="flex">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/Register"
                  className="glass hover:scale-105 transition-all ease-in-out duration-300 px-5 py-3 font-semibold rounded-md items-center">
                  SIGN UP
                </Link>
              </div>
            ) : (
              <div className="flex justify-evenly items-center">
                {data && data.role == "admin" && (
                  <div className="dropdown dropdown-hover lg:mr-6 cursor-pointer">
                    <span
                      tabIndex={0}
                      className="hover:scale-105 animate-ping transition-all ease-in-out duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24">
                        <g fill="none">
                          <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
                          <path
                            fill="currentColor"
                            d="M15 19a2 2 0 0 1-1.85 1.995L13 21h-2a2 2 0 0 1-1.995-1.85L9 19h6ZM12 2a7 7 0 0 1 6.996 6.76L19 9v3.764l1.822 3.644a1.1 1.1 0 0 1-.869 1.586l-.115.006H4.162a1.1 1.1 0 0 1-1.03-1.487l.046-.105L5 12.764V9a7 7 0 0 1 7-7Z"
                          />
                        </g>
                      </svg>
                    </span>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-white border-2 border-slate-400 divide-y-2 divide-base-300 shadow rounded-box w-52">
                      <li className="mx-auto">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={{
                            pathname: "/requests",
                            query: { email: user.email },
                          }}>
                          Request 1
                        </Link>
                      </li>
                      <li className="mx-auto">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={{
                            pathname: "/requests",
                            query: { email: user.email },
                          }}>
                          Request 2
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}

                <div className="dropdown dropdown-hover cursor-pointer">
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
                    className="dropdown-content border-2 border-slate-400 menu bg-white divide-y-2 divide-base-300 shadow rounded-box w-52">
                    {data && (
                      <li className="mx-auto">
                        {data.role == "admin" && (
                          <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href={{
                              pathname: "/Admin",
                              query: { email: user.email },
                            }}>
                            Admin Panel
                          </Link>
                        )}
                      </li>
                    )}

                    <li className="mx-auto">
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={{
                          pathname: "/EditDetails",
                          query: { email: user.email },
                        }}>
                        Profile
                      </Link>
                    </li>

                    <li className="mx-auto">
                      <span onClick={logOut}>Logout</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          <ToastContainer />
        </div>

        <p className="text-xl text-center lg:hidden block lg:text-2xl text-[#FF671F] font-semibold">
          भूतपूर्व सैनिक जन कल्याण समिति उ.प्र.
        </p>
      </div>
    </>
  );
};

export default Navbar;
