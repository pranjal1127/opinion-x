import React, { useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { readContractData } from "~~/app/helpers";
import { poolABI } from "~~/contracts/abis/OpinionPool";

type Props = {};

export default function PoolCard({}: Props) {
  const { address: connectedAddress, chainId } = useAccount();

  const { data, status, error } = useReadContract({
    address: "0x04Cf4135B65e6B866F3eF9C6A2CD526779720EFA",
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
    // readContractData("0x04Cf4135B65e6B866F3eF9C6A2CD526779720EFA", poolABI, "name");
    console.log(data, status, error);
    console.log(error);
  }, [data, status, error]);
  return <div>PoolCard</div>;
}
