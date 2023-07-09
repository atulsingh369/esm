import React from "react";

const Footer = () => {
  return (
    <>
      <div className="py-3">
        <div className="bg-black h-36 flex flex-col justify-center items-center gap-3">
          <div className="w-full">
            <ul className="flex justify-evenly items-center border-b-4 p-2 border-dashed text-white">
              <li>
                <a href="#!" className="hover:underline  ">
                  Home
                </a>
              </li>
              <li>
                <a href="#!" className="hover:underline  ">
                  About Us
                </a>
              </li>
              <li>
                <a href="#!" className="hover:underline  ">
                  How Are We
                </a>
              </li>
              <li>
                <a href="#!" className="hover:underline  ">
                  Why Are We
                </a>
              </li>
              <li>
                <a href="#!" className="hover:underline  ">
                  Contact
                </a>
              </li>
              <li>
                <a href="#!" className="hover:underline  ">
                  FeedBack
                </a>
              </li>
              <li>
                <a href="#!" className="hover:underline  ">
                  Tenders
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-gray-600">
              All Rights Are Reserved By ESM &#64; 2024
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
