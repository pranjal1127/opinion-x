import React from "react";
import { useReadContract } from "wagmi";
import { poolABI } from "~~/contracts/abis/OpinionPool";

const OpinionCard = ({ id }: { id: string }) => {
  const {
    data: name,
    status,
    error,
  } = useReadContract({
    address: "0x8aDb7Ca8ba24a1fDCea74fED0a32F158d6d82Ad7", // params
    abi: poolABI,
    functionName: "name",
    args: [],
  });

  const { data: options } = useReadContract({
    address: "0x8aDb7Ca8ba24a1fDCea74fED0a32F158d6d82Ad7", // params
    abi: poolABI,
    functionName: "getAllOptionQuotes",
    args: [true],
  });

  return (
    <div>
      <h1>Opinion Details</h1>
      <p>Opinion Address: {id}</p>
      <p>Name: {name}</p>
      <p>Options: {options}</p>
    </div>
  );
};

export default OpinionCard;
