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
  const array1 = [
    {
      title: "Will there be more than 10 winners at ETH India 2024?",
      description: "Bet on whether ETH India 2024 will have over 10 winners in its competition.",
      betoption1: "YES",
      betoption2: "NO",
    },
    {
      title: "Will India play their next cricket match against Denver?",
      description: "Predict if India's cricket team will face Denver in the upcoming match.",
      betoption1: "YES",
      betoption2: "NO",
    },
    {
      title: "Will Salman Khan get married in the next 5 years?",
      description: "Place your bet on whether Salman Khan will tie the knot within the next five years.",
      betoption1: "YES",
      betoption2: "NO",
    },
    {
      title: "Will Bangalore support 5,000 startups in the next decade?",
      description: "Forecast if Bangalore will fund or support 5,000 startups within the next 10 years.",
      betoption1: "YES",
      betoption2: "NO",
    },
    {
      title: "Who is going to win Gujarat Elections this year?",
      description: "Make your prediction on the winner of this year's Gujarat elections.",
      betoption1: "YES",
      betoption2: "NO",
    },
    {
      title: "Will AI surpass human intelligence by 2035?",
      description: "Forecast if AI will exceed human intelligence by the year 2035.",
      betoption1: "YES",
      betoption2: "NO",
    },
    {
      title: "Will Tesla launch a fully self-driving car by 2026?",
      description: "Predict if Tesla will release a completely self-driving car by 2026.",
      betoption1: "YES",
      betoption2: "NO",
    },
    {
      title: "Will India host the FIFA World Cup before 2030?",
      description: "Guess if India will host the FIFA World Cup before the year 2030.",
      betoption1: "YES",
      betoption2: "NO",
    },
    {
      title: "Will the stock market reach a new all-time high in the next year?",
      description: "Bet on whether the stock market will hit a record high within the next year.",
      betoption1: "YES",
      betoption2: "NO",
    },
    {
      title: "Will renewable energy surpass fossil fuels by 2040?",
      description: "Predict if renewable energy sources will dominate over fossil fuels by 2040.",
      betoption1: "YES",
      betoption2: "NO",
    },
  ];

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
          {array1.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              description={item.description}
              betoption={item.betoption1}
              betoption2={item.betoption2}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
