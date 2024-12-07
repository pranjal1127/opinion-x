"use client";

import React from "react";
import { usePathname } from "next/navigation";
import OpinionCard from "./OpinionCard";
import { useIsMounted } from "usehooks-ts";
import { useAccount } from "wagmi";

interface OpinionPageProps {
  params: {
    id: string;
  };
}

export default function Page({}: OpinionPageProps) {
  // usePathname
  const path = usePathname();
  const address = path.split("/").pop() ?? "";

  const { address: connectedAddress } = useAccount();

  return (
    <>
      {connectedAddress ? (
        <OpinionCard id={address} />
      ) : (
        <div className="flex justify-center items-center bg-red-500 px-5 py-2 rounded-xl">Connect your wallet</div>
      )}
    </>
  );
}

// export async function generateMetadata({ params }: OpinionPageProps): Promise<Metadata> {
//   return {
//     title: `Opinion ${params.id}`,
//   };
// }
