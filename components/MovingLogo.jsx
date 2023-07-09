"use client";
import React, { useEffect, useRef, useState } from "react";
import "./movingText.css";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/config";

const MovingLogo = () => {
  const containerRef = useRef(null);
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

  useEffect(() => {
    const container = containerRef.current;
    const handleAnimation = () => {
      container.style.transform = "translateX(100%)"; // Adjust the translation distance as needed
    };

    // Start the animation
    const animationId = setInterval(handleAnimation, 3000); // Adjust the animation duration as needed

    // Clean up the animation on component unmount
    return () => clearInterval(animationId);
  }, []);

  return (
    <div className="logo-parent-container">
      <div className="logo-container" ref={containerRef}>
        <h1 className="text-2xl font-semibold px-24 whitespace-nowrap">
          Notices
        </h1>
        {data.map((item, index) => (
          <li
            key={index}
            className="text-justify px-24 whitespace-nowrap text-lg tracking-wider  ">
            {item.Date}&nbsp;&nbsp;:&nbsp;&nbsp;{item.Notice}
          </li>
        ))}
      </div>
    </div>
  );
};

export default MovingLogo;
