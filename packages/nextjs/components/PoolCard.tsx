import React, { useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { readContractData } from "~~/app/helpers";
import { poolABI } from "~~/contracts/abis/OpinionPool";

type Props = {};

export default function PoolCard({}: Props) {
  const { address: connectedAddress, chainId } = useAccount();

  const { data, status, error } = useReadContract({
    address: "0x8aDb7Ca8ba24a1fDCea74fED0a32F158d6d82Ad7",
    abi: poolABI,
    functionName: "name",
    args: [],
  });

  //   const { data: tokenData } = useReadContract({
  //     address: "0x0F0277C11F77EB78aCECB1Bb3ef0ED4afb5CBA2e",
  //     abi: erc20Abi,
  //     functionName: "name",
  //     args: [],
  //   });

  useEffect(() => {
    // readContractData("0x8aDb7Ca8ba24a1fDCea74fED0a32F158d6d82Ad7", poolABI, "name");
    console.log(data, status, error);
    console.log(error);
  }, [data, status, error]);
  return <div>PoolCard</div>;
}
