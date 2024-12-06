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

export default function page({}: OpinionPageProps) {
  const isMounted = useIsMounted();
  // usePathname
  const path = usePathname();
  const address = path.split("/").pop() ?? "";

  const { address: connectedAddress, chainId } = useAccount();

  return <>{isMounted() && connectedAddress ? <OpinionCard id={address} /> : <div>Connect your wallet</div>}</>;
}

// export async function generateMetadata({ params }: OpinionPageProps): Promise<Metadata> {
//   return {
//     title: `Opinion ${params.id}`,
//   };
// }