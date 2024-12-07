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
    data : shareCost,
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

  const formatCost = (num : bigint)=>{
    const numEth = formatEther(num);
    return formatEther(BigInt(numEth));
  }

  return (
    <div className="mx-auto my-auto">
      <h1>Opinion Details</h1>
      <p>Opinion Address: {id}</p>
      <p>Name: {name}</p>
      <p>Options: </p>
      {options?.map((ele, index) => (
        <p key={index}>
          {ele.name} - $ {formatEther(ele?.shares)}
        </p>
      ))}
      <button
        className="btn btn-secondary btn-sm self-end md:self-start"
        onClick={async () => {
          console.log("BUY");
          await executeTrade(0n, parseEther(share), BigInt(formatEther(shareCost ?? BigInt(0))), "BUY");
        }}
        disabled={isLoading}
      >
        {isLoading && <span className="loading loading-spinner loading-xs"></span>}
        Buy 💹
      </button>

      <button
        className="btn btn-danger btn-sm self-end md:self-start"
        onClick={async () => {
          console.log("SELL");
          await executeTrade(0n, parseEther(share), BigInt(formatEther(shareCost ?? BigInt(0))), "SELL");
        }}
        disabled={isLoading}
      >
        {isLoading && <span className="loading loading-spinner loading-xs"></span>}
        Sell 🔻
      </button>

      <label>Text input: <input name="myInput" value={share} onChange={(e) => setShare(e.target.value)}/></label>
      {/* {options?.reduce((acc, ele, index) => `${acc}${index} ${ele.name} - $ ${formatEther(ele?.shares)} <br/>`, "")} */}
      <p>If the Share Status is pending!</p>
      <div className="mt-4">
      {shareCostStatus === "pending" ? (
        <div className="loading loading-spinner loading-lg"></div> // Replace with your loading component or spinner class
      ) : shareCostStatus === "success" ? (
        <p>Share Cost: {formatCost(shareCost || BigInt(0))}</p>
      ) : (
        <p>Error: {shareCostError?.message || "Failed to fetch share cost"}</p>
      )}
    </div>
    </div>
  );
};

export default OpinionCard;
