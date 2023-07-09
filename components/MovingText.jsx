"use client";
import { db } from "@/app/config";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const MovingText = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "notices"),
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setData((data) => [...data, doc.data()]);
        });
      }
    );

    return () => {
      unsubscribe;
    };
  }, []);

  return (
    <>
      <div className="w-full h-10 text-white moving-text overflow-hidden flex justify-center items-center ">
        <h1 className="text-2xl font-semibold px-24 whitespace-nowrap">
          Notices
        </h1>
        {data.map((item, index) => (
          <li
            key={index}
            className="text-justify px-24 whitespace-nowrap text-lg tracking-wider  ">
            {item.Date} : {item.Notice}
            {/* Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem
            cumque tempore repudiandae, placeat quaerat sit suscipit fugit
            architecto illo totam. */}
          </li>
        ))}
      </div>
    </>
  );
};

export default MovingText;
