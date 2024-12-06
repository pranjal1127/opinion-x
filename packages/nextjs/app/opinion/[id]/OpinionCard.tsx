import React, { useEffect } from "react";
import { formatEther } from "viem";
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
      {/* {options?.reduce((acc, ele, index) => `${acc}${index} ${ele.name} - $ ${formatEther(ele?.shares)} <br/>`, "")} */}
    </div>
  );
};

export default OpinionCard;
