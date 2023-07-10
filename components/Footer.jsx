import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-transparent bottom-0 border-t-2 border-dashed rounded-5xl mt-16">
        <div className="flex flex-col space-y-4 md:flex-row justify-evenly items-center my-5 text-neutral-200">
          © 2023 Copyright:
          <Link href="/">
            <img
              src="https://ik.imagekit.io/e5ixuxrlb/esm/logo.png?updatedAt=1685270347657"
              alt="logo"
              className="h-14 md:h-20"
            />
          </Link>
          <Link href="/">
            <p className="text-lg underline md:text-xl font-semibold">
              भूतपूर्व सैनिक जन कल्याण समिति
            </p>
          </Link>
				</div>
				
        <div className="flex text-md font-semibold items-center justify-between">
          <p>Made with 💓</p>
          <p>-By Atul Singh</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
