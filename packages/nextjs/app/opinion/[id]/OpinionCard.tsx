import React, { useEffect } from "react";
import { useTradeHook } from "./useTradeHook";
import { formatEther, parseEther } from "viem";
import { useReadContract } from "wagmi";
import { poolABI } from "~~/contracts/abis/OpinionPool";

const OpinionCard = ({ id }: { id: string }) => {
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

  useEffect(() => {
    console.log(options, optionStatus, optionError);
  }, [options, optionStatus, optionError]);

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
          await executeTrade(0n, parseEther("5"), "BUY");
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
          await executeTrade(0n, parseEther("5"), "SELL");
        }}
        disabled={isLoading}
      >
        {isLoading && <span className="loading loading-spinner loading-xs"></span>}
        Sell 🔻
      </button>
      {/* {options?.reduce((acc, ele, index) => `${acc}${index} ${ele.name} - $ ${formatEther(ele?.shares)} <br/>`, "")} */}
    </div>
  );
};

export default OpinionCard;
