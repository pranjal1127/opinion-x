import React, { useState } from "react";

interface CardProps {
  title: string;
  description: string;
  betoption: string;
  betoption2: string;
}

const Card: React.FC<CardProps> = ({ title, description, betoption, betoption2 }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY - e.touches[0].clientY > 50) {
      setShowPopup(false);
    }
  };

  return (
    <>
      <div className="px-5 mx-4 my-4 bg-violet-950 text-violet-300 ease-in-out transition duration-300 flex flex-col justify-between w-80 h-[18vh] border border-violet-950 rounded-2xl hover:shadow-xl hover:shadow-violet-400 hover:scale-105">
        <div className="mx-2 mt-2">
          <h2 className="font-bold ">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="flex justify-between px-5 py-2">
          <button onClick={handleButtonClick} className="px-5 py-2 rounded-xl bg-green-500 text-white hover:scale-105">
            {betoption}
          </button>
          <button onClick={handleButtonClick} className="px-5 py-2 rounded-xl bg-red-500 text-white hover:scale-105">
            {betoption2}
          </button>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end">
          <div
            className="bg-white p-5 rounded-t-3xl w-full h-[50vh]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <h2>Popup Content</h2>
            <button onClick={() => setShowPopup(false)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
