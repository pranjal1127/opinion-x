import { useEffect, useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Abi, AbiEvent } from "abitype";
import { Address, GetLogsParameters, PublicClient } from "viem";
import { useBlockNumber, usePublicClient } from "wagmi";

// Type definitions for the hook
interface EventHistoryOptions {
  blockData?: boolean;
  transactionData?: boolean;
  receiptData?: boolean;
}

interface UseContractEventHistoryProps {
  contractAddress: Address;
  contractAbi: Abi;
  eventName: string;
  fromBlock?: bigint;
  filters?: Record<string, any>;
  watch?: boolean;
  enabled?: boolean;
  options?: EventHistoryOptions;
}

// Utility function to fetch events with optional additional data
const getEvents = async (
  publicClient: PublicClient,
  getLogsParams: GetLogsParameters,
  options?: EventHistoryOptions,
) => {
  const logs = await publicClient.getLogs({
    address: getLogsParams.address,
    fromBlock: getLogsParams.fromBlock,
    args: getLogsParams.args,
    event: getLogsParams.event,
  });

  // Fetch additional data for each log if requested
  const finalEvents = await Promise.all(
    logs.map(async log => {
      return {
        ...log,
        blockData:
          options?.blockData && log.blockHash ? await publicClient.getBlock({ blockHash: log.blockHash }) : null,
        transactionData:
          options?.transactionData && log.transactionHash
            ? await publicClient.getTransaction({ hash: log.transactionHash })
            : null,
        receiptData:
          options?.receiptData && log.transactionHash
            ? await publicClient.getTransactionReceipt({ hash: log.transactionHash })
            : null,
      };
    }),
  );

  return finalEvents;
};

// Utility to add indexed args to event
const addIndexedArgsToEvent = (event: any) => {
  if (event.args && !Array.isArray(event.args)) {
    return {
      ...event,
      args: {
        ...event.args,
        ...Object.values(event.args),
      },
    };
  }
  return event;
};

export const useEventHistory = ({
  contractAddress,
  contractAbi,
  eventName,
  fromBlock = 0n,
  filters = {},
  watch = false,
  enabled = true,
  options = {},
}: UseContractEventHistoryProps) => {
  const { targetNetwork } = useTargetNetwork();
  const publicClient = usePublicClient({ chainId: targetNetwork.id });

  const [isFirstRender, setIsFirstRender] = useState(true);
  const { data: blockNumber } = useBlockNumber({ watch });

  // Find the specific event in the ABI
  const event = (contractAbi as Abi).find(part => part.type === "event" && part.name === eventName) as AbiEvent;

  // Validate inputs
  const isReadyToFetch = Boolean(contractAddress) && Boolean(publicClient) && Boolean(event);

  // Infinite query for event history
  const query = useInfiniteQuery({
    queryKey: [
      "contractEventHistory",
      {
        contractAddress,
        eventName,
        fromBlock: fromBlock.toString(),
        filters: JSON.stringify(filters),
      },
    ],
    queryFn: async ({ pageParam }) => {
      if (!isReadyToFetch) return undefined;

      const data = await getEvents(
        // @ts-ignore
        publicClient,
        {
          address: contractAddress,
          event,
          fromBlock: pageParam,
          args: filters,
        },
        options,
      );

      return data;
    },
    enabled: enabled && isReadyToFetch,
    initialPageParam: fromBlock,
    getNextPageParam: () => blockNumber,
    select: data => {
      const events = data.pages.flat();
      const eventHistoryData = events?.map(addIndexedArgsToEvent);
      return {
        pages: eventHistoryData?.reverse(),
        pageParams: data.pageParams,
      };
    },
  });

  // Watch for new blocks if watch is enabled
  useEffect(() => {
    const shouldSkipEffect = !blockNumber || !watch || isFirstRender;
    if (shouldSkipEffect) {
      if (isFirstRender) setIsFirstRender(false);
      return;
    }

    query.fetchNextPage();
  }, [blockNumber, watch]);

  return {
    data: query.data?.pages,
    status: query.status,
    error: query.error,
    isLoading: query.isLoading,
    isFetchingNewEvent: query.isFetchingNextPage,
    refetch: query.refetch,
  };
};
