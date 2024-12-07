"use client";

import { useEffect } from "react";
import type { NextPage } from "next";
import Card from "~~/components/Cards";
import { Footer } from "~~/components/Footer";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

type OpinionPoolCreatedEvent = {
  args: [string, string, string[]];
  // Add other properties if needed
};

const transformQuestions = (eventData: OpinionPoolCreatedEvent[] = []) => {
  return eventData.map(event => {
    const { args } = event;
    const poolAddress = args[0];
    const question = args[1];
    const options = args[2];
    return {
      poolAddress,
      question,
      options,
    };
  });
};

const Home: NextPage = () => {
  // const { address: connectedAddress, chainId } = useAccount();
  const {
    data: events,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "FACTORY",
    eventName: "OpinionPoolCreated",
    fromBlock: 7220425n,
    watch: true,
    blockData: true,
    transactionData: true,
    receiptData: true,
  });

  useEffect(() => {
    console.log("Events");
    console.log(
      transformQuestions(events as unknown as OpinionPoolCreatedEvent[]),
      isLoadingEvents,
      errorReadingEvents,
    );
  }, [events, isLoadingEvents, errorReadingEvents]);

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
        <div className="mb-10">
          {transformQuestions(events as unknown as OpinionPoolCreatedEvent[])?.map((question, index) => (
            <Card
              title={question.question}
              description={question.poolAddress}
              key={index}
              betoption={question.options[0]}
              betoption2={question.options[1]}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
