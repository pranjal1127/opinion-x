import React, { useEffect } from "react";
import { useTradeHook } from "./useTradeHook";
import { formatEther, parseEther } from "viem";
import { useReadContract } from "wagmi";
import { poolABI } from "~~/contracts/abis/OpinionPool";

const OpinionCard = ({ id }: { id: string }) => {
  const [share, setShare] = React.useState("");

  const [isBuy, setIsBuy] = React.useState(true);
  const [activeOption, setActiveOption] = React.useState(0);
  const {
    data: name,
    status,
    error,
  } = useReadContract({
    address: id, // params
    abi: poolABI,
    functionName: "name",
    args: [],
  });

  const {
    data: options,
    status: optionStatus,
    error: optionError,
  } = useReadContract({
    address: id, // params
    abi: poolABI,
    functionName: "getAllOptionQuotes",
    args: [true],
  });
  const mutablePoolABI = [...poolABI];
  const { executeTrade, isLoading, error: tradeError } = useTradeHook(id as `0x${string}`, mutablePoolABI);

  const {
    data: shareCost,
    status: shareCostStatus,
    error: shareCostError,
  } = useReadContract({
    address: id, // params
    abi: poolABI,
    functionName: "quote",
    args: [BigInt(activeOption), parseEther(share), isBuy],
  });

  useEffect(() => {
    console.log(options, optionStatus, optionError);
  }, [options, optionStatus, optionError]);

  return (
    <div className="flex flex-col w-auto bg-primary  mx-auto my-auto rounded-2xl p-5">
      <h1 className="text-xl">Opinion Details</h1>
      <p>
        <span className="font-bold">Opinion Address:</span> {id}
      </p>
      <p className="overflow-hidden">
        <span className="font-bold">Question: </span>
        {name}
      </p>

      {/* Options */}
      <p>
        <span className="font-bold">Options: </span>
      </p>
      {options?.map((ele, index) => (
        <button
          className="px-5 py-2 mb-2 bg-secondary rounded-lg"
          key={index}
          onClick={() => {
            setActiveOption(index);
          }}
        >
          {ele.name} - $ {formatEther(ele?.shares)}
        </button>
      ))}
      <div className="mt-4"></div>

      <div className="flex justify-between px-3">
        <div>
          <button
            className="bg-secondary px-5 py-2 rounded-lg text-white"
            onClick={async () => {
              console.log("BUY");
              setIsBuy(true);
              await executeTrade(BigInt(activeOption), parseEther(share), "BUY");
            }}
            disabled={isLoading}
          >
            {isLoading && <span className="loading loading-spinner loading-xs"></span>}
            Buy 💹
          </button>
        </div>
        <div>
          <button
            className="bg-secondary px-5 py-2 rounded-lg text-white"
            onClick={async () => {
              console.log("SELL");
              setIsBuy(false);
              await executeTrade(BigInt(activeOption), parseEther(share), "SELL");
            }}
            disabled={isLoading}
          >
            {isLoading && <span className="loading loading-spinner loading-xs"></span>}
            Sell 🔻
          </button>
        </div>
        <label className="block font-bold mb-2" htmlFor="shareInput">
          Enter number of shares:
        </label>
        <input
          type="number"
          id="shareInput"
          className="w-full px-3 py-2 border rounded-lg mb-2"
          value={share}
          onChange={e => setShare(e.target.value)}
        />
      </div>
      {/* {options?.reduce((acc, ele, index) => `${acc}${index} ${ele.name} - $ ${formatEther(ele?.shares)} <br/>`, "")} */}
    </div>
    
  );
};

export default OpinionCard;
