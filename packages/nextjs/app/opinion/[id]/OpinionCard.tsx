import React, { useEffect } from "react";
import { useTradeHook } from "./useTradeHook";
import { formatEther, parseEther } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { poolABI } from "~~/contracts/abis/OpinionPool";
import { useEventHistory } from "~~/hooks/scaffold-eth/useEventHistory";

const OpinionCard = ({ id }: { id: string }) => {
  const { address, chain } = useAccount();
  const [share, setShare] = React.useState("");
  const [isBuy, setIsBuy] = React.useState(true);
  const [activeOption, setActiveOption] = React.useState<number | null>(null);

  const {
    data: eventHistory,
    isLoading: isLoadingEvent,
    error,
  } = useEventHistory({
    contractAddress: id, // Your contract address
    contractAbi: poolABI, // Your contract's ABI
    eventName: "SharesBought",
    fromBlock: chain?.id == 137 ? 65223012n : 7220425n, // Optional starting block
    filters: {
      // Optional filters for the event
      user: address,
    },
    watch: true, // Optional: watch for new events
    options: {
      blockData: true,
      transactionData: true,
      receiptData: true,
    },
  });

  const { data: name } = useReadContract({
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
  const { executeTrade, isLoading } = useTradeHook(id as `0x${string}`, mutablePoolABI);

  const {
    data: shareCost,
    status: shareCostStatus,
    error: shareCostError,
  } = useReadContract({
    address: id, // params
    abi: poolABI,
    functionName: "quote",
    args: [BigInt(activeOption ?? 0), parseEther(share), isBuy],
  });

  useEffect(() => {
    console.log(options, optionStatus, optionError);
  }, [options, optionStatus, optionError]);

  useEffect(() => {
    console.log(eventHistory, isLoadingEvent, error);
  }, [eventHistory, isLoadingEvent, error]);

  const formatCost = (num: bigint) => {
    const numEth = formatEther(num);
    return formatEther(BigInt(numEth));
  };

  return (
    <div className="flex flex-col w-auto w-max-[300px] bg-primary  mx-auto my-auto rounded-2xl p-5">
      <h1 className="text-xl mx-auto">Monetize your Opinion</h1>
      {/* <p>
        <span className="font-bold">Opinion Address:</span> {id}
      </p>
      <p className="overflow-hidden   ">
        <span className="font-bold">Question: </span>
      </p> */}
      <p className="text-xl font-bold overflow-hidden">
        {/* <span className="font-bold"></span> */}
        {name}
      </p>

      {/* Options */}
      {/* <p>
        <span className="font-bold">Options: </span>
      </p> */}
      {options?.map((ele, index) => (
        <div key={index} className="">
          <button
            className={`px-5 py-2 mb-2 w-full overflow-hidden rounded-lg ${activeOption === index ? "bg-blue-400 border-2 text-white" : "bg-accent"}`}
            key={index}
            onClick={() => {
              setActiveOption(index);
            }}
          >
            {ele.name} - $ {formatEther(ele?.shares)}
          </button>
        </div>
      ))}

      {activeOption !== null && (
        <div className="my-5">
          <div className="grid grid-cols-2 px-3 mb-3">
            <div className={`border-b-2 border-secondary ${isBuy === true ? "border-white text-white" : ""}`}>
              <button
                className=""
                onClick={async () => {
                  console.log("BUY");
                  setIsBuy(true);
                }}
              >
                🟢 Buy
              </button>
            </div>
            <div className={`border-b-2 border-secondary ${isBuy === false ? "border-white text-white" : ""} `}>
              <button
                className=""
                onClick={async () => {
                  console.log("SELL");
                  setIsBuy(false);
                }}
              >
                🔴 Sell
              </button>
            </div>
          </div>
          {isBuy !== null && (
            <div className="gmt-4">
              <label className="block font-bold text-sm mb-2" htmlFor="shareInput">
                Enter number of shares:
              </label>
              <input
                type="number"
                id="shareInput"
                className="w-full px-3 py-2 border rounded-lg mb-2"
                value={share}
                onChange={e => setShare(e.target.value)}
              />
              <div className="mt-4">
                {shareCostStatus === "pending" ? (
                  <div className="loading loading-spinner loading-lg"></div>
                ) : shareCostStatus === "success" ? (
                  <p className="text-green-500 font-bold">Share Cost: {formatCost(shareCost || BigInt(0))}</p>
                ) : (
                  <p className="text-red-500 font-bold">
                    Error: {shareCostError?.message || "Failed to fetch share cost"}
                  </p>
                )}
              </div>
              <button
                className="bg-secondary w-full px-5 py-2 rounded-lg text-white"
                onClick={async () => {
                  console.log(isBuy ? "BUY" : "SELL");
                  await executeTrade(
                    BigInt(activeOption),
                    parseEther(share),
                    parseEther(formatCost(shareCost ?? BigInt(0))),
                    isBuy ? "BUY" : "SELL",
                  );
                }}
                disabled={isLoading}
              >
                {isLoading && <span className="loading loading-spinner loading-xs"></span>}
                {isBuy ? "Buy" : "Sell"}
              </button>
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold mb-2 mt-10">Trade History</h2>
        {eventHistory && eventHistory.length > 0 ? (
          <table className="table-auto border-collapse border border-gray-200 w-full mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border text-gray-800 border-gray-300 px-4 py-2">Option</th>
                <th className="border text-gray-800  te-gray-300 px-4 py-2">Shares</th>
                <th className="border text-gray-800 border-gray-300 px-4 py-2">Cost</th>
              </tr>
            </thead>
            <tbody>
              {eventHistory.map((event, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{index == 0 ? "Yes" : "No"}</td>
                  <td className="border border-gray-300 px-4 py-2">{formatEther(event.args[2])}</td>
                  <td className="border border-gray-300 px-4 py-2">{formatEther(event.args[3])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-4">No events to display</p>
        )}
      </div>
    </div>
  );
};

export default OpinionCard;
