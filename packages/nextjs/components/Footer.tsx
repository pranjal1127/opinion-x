import React from "react";
import Link from "next/link";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full h-[5vh] grid grid-cols-2 items-center justify-between px-5 py-2 bg-primary text-violet-300">

      <Link href={"/"}>
        <button className="flex items-center gap-3">
          <span className="text-sm">Home</span>
        </button>
      </Link>
      <Link href={"/PredictionHistory"} passHref>
        <button className="flex items-center gap-3">
          <span className="text-sm">Predictions</span>
        </button>
      </Link>
    </footer>
  );
};
