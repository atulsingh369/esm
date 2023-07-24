import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-transparent bottom-0 border-t-2 border-dashed rounded-5xl mt-16">
        <div className="flex flex-col space-y-4 lg:flex-row justify-evenly items-center my-5 text-neutral-200">
          <span></span>
          <span>© 2023 Copyright:</span>
          <Link href="/">
            <img
              src="https://ik.imagekit.io/e5ixuxrlb/esm/logo.png?updatedAt=1685270347657"
              alt="logo"
              className="h-14 lg:h-20"
            />
          </Link>
          <Link href="/">
            <p className="text-lg underline lg:text-xl font-semibold">
              भूतपूर्व सैनिक जन कल्याण समिति उ.प्र.
            </p>
          </Link>
        </div>

        <p className="font-semibold text-lg flex justify-center my-12">
          Built with ❤️ By Atul Singh
        </p>
      </footer>
    </>
  );
};

export default Footer;
