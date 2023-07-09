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

const Navbar = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "forest"
  );

  const toggleTheme = (e) => {
    if (e.target.checked) {
      setTheme("light");
    } else {
      setTheme("forest");
    }
  };

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
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);

    const unsub = onSnapshot(docRef, (doc) => {
      setData(doc.data());
    });

    return () => {
      unsub;
    };
  }, [theme]);

  return (
    <>
      <div className="upper-bar flex flex-row items-center justify-between p-2 border-b-4 border-[#FF671F] ">
        <div className="bar-start-content ">
          <a className="text-sm font-bold hover:underline cursor-pointer">
            Home
          </a>
        </div>
        <div className="bar-end-content flex items-center gap-3 divide-x divide-double">
          <a className="text-sm font-bold hover:underline cursor-pointer">
            Skip To Main Content
          </a>
          <div className="flex ">
            <div className="flex gap-3 pl-1">
              <a>a-</a>
              <a>A</a>
              <a>A+</a>
            </div>
            <div className="toggle-switch scale-50 flex items-start">
              <label className="switch-label">
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={toggleTheme}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="pl-1">
            <select className="outline-none p-1 rounded-md">
              <option value="0">English</option>
              <option value="1">Hindi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="middle-bar bg-middle-bar bg-contain h-32 ">
        <div className="flex  justify-between">
          <div className="flex justify-center items-center gap-5">
            <Link href="/">
              <img
                src="https://ik.imagekit.io/e5ixuxrlb/esm/logo.png?updatedAt=1685270347657"
                alt=""
                className="h-32"
              />
            </Link>
            <Link href="/">
              <h1 className="text-4xl text-white font-semibold bg-[#FF671F] pl-5 pr-5 pt-2 pb-2">
                भूतपूर्व सैनिक जन कल्याण समिति
              </h1>
            </Link>
          </div>
          <div className="p-2 ">
            <img
              src="https://ik.imagekit.io/e5ixuxrlb/esm/emblem.png?updatedAt=1685270543927"
              alt=""
              className="h-28"
            />
          </div>
        </div>
      </div>

      <div className="bottom-bar flex justify-evenly items-center py-1 bg-white  border-b-4 border-[#FF671F] ">
        <Link
          href="/"
          className="btn bg-white border-none text-black font-semibold text-lg hover:bg-[#046A38] hover:text-white hover:font-normal">
          Home
        </Link>
        <Link
          href="/"
          className="btn bg-white border-none text-black font-semibold text-lg hover:bg-[#046A38] hover:text-white hover:font-normal">
          About Us
        </Link>
        <Link
          href="/Members"
          className="btn bg-white border-none text-black font-semibold text-lg hover:bg-[#046A38] hover:text-white hover:font-normal">
          Our Members
        </Link>
        <Link
          href="/Gallery"
          className="btn bg-white border-none text-black font-semibold text-lg hover:bg-[#046A38] hover:text-white hover:font-normal">
          Gallery
        </Link>
        {!user ? (
          <div className="flex ">
            <Link
              href="/Register"
              className="btn bg-white border-none text-black font-semibold text-lg hover:bg-[#046A38] hover:text-white hover:font-normal">
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="dropdown dropdown-hover">
            <label
              tabIndex={0}
              className="flex btn bg-white border-none text-black font-semibold text-lg hover:bg-[#046A38] hover:text-white hover:font-normal">
              <span id="hello">
                Hi&nbsp;{user.displayName}&nbsp;&nbsp;&nbsp;
              </span>
              <div className="avatar">
                <div className="w-9 rounded-full">
                  {data ? (
                    <img src={data.photoURL} />
                  ) : (
                    <img src="https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697" />
                  )}
                </div>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content space-y-4 flex flex-col z-[1] menu p-2 bg-base-100 rounded-box w-52">
              {data && (
                <div className="mx-auto">
                  {data.role == "admin" && (
                    <Link href="/Admin">
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
      </div>
    </>
  );
};

export default Navbar;
