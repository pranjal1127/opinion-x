"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Card from "~~/components/Cards";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">OpinionX</span>
          </h1>
        </div>
        <div>
          <Card title="Card Title" description="Card Description" betoption="Bet Option 1" betoption2="Bet Option 2" />
        </div>
      </div>
    </>
  );
};

export default Home;
