"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Abi } from "abitype";
import type { NextPage } from "next";
import { erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Card from "~~/components/Cards";
import PoolCard from "~~/components/PoolCard";
import { Address } from "~~/components/scaffold-eth";
import { poolABI } from "~~/contracts/abis/OpinionPool";
const Home: NextPage = () => {
  const { address: connectedAddress, chainId } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 ">
        <div className="px-5 h-[15vh]">
          {/* <HeroBanner/> */}
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">OpinionX</span>
          </h1>
        </div>
        <div>
        </div>
      </div>
    </>
  );
};

export default Home;
