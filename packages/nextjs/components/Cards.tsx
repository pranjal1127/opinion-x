import React from "react";
import Link from "next/link";

interface CardProps {
  title: string;
  description: string;
  betoption: string;
  betoption2: string;
}

const Card: React.FC<CardProps> = ({ title, description, betoption, betoption2 }) => {
  // const [showPopup, setShowPopup] = useState(false);
  // const [touchStartY, setTouchStartY] = useState(0);
  const handleButtonClick = () => {
    // setShowPopup(true);
    console.log("Click Button");
  };

  // const handleTouchStart = (e: React.TouchEvent) => {
  //   setTouchStartY(e.touches[0].clientY);
  // };

  // const handleTouchMove = (e: React.TouchEvent) => {
  //   if (touchStartY - e.touches[0].clientY > 50) {
  //     setShowPopup(false);
  //   }
  // };

  return (
    <>
      <Link href={`/opinion/${description}`} passHref>
        <div className="px-5 mx-4 my-4 bg-primary text-accent ease-in-out transition duration-300 flex flex-col justify-between w-80  border border-violet-950 rounded-2xl hover:shadow-xl hover:shadow-secondary hover:scale-105">
          <div className="mx-2 mt-2">
            <h2 className="font-bold text-lg">{title}</h2>
          </div>
          <div className="flex justify-between px-2 py-2">
            <button
              onClick={handleButtonClick}
              className="px-4 py-2 rounded-xl bg-slate-400 hover:bg-slate-600  text-white hover:scale-105"
            >
              {betoption}
            </button>
            <button
              onClick={handleButtonClick}
              className="px-5 py-2 rounded-xl bg-slate-400 hover:bg-slate-600 text-white hover:scale-105"
            >
              {betoption2}
            </button>
          </div>
        </div>
      </Link>
      {/* {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end">
          <div
            className="bg-primary p-5 rounded-t-3xl w-full h-[50vh]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >

            <div className="flex justify-between items-center">
              <h2>{title}</h2>
              <button onClick={() => setShowPopup(false)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Close
              </button>
            </div>
            <p>{description}</p>
            <div className="flex justify-between items-center mx-10">
              <button className="px-10 py-2 bg-secondary rounded-lg">Sell</button>
              <button className="px-10 py-2 bg-secondary rounded-lg">Buy</button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default Card;
