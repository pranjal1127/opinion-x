import { useState } from "react";
import { toast } from "react-toastify";
import { erc20Abi } from "viem";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

type TradeType = "BUY" | "SELL";

const tokenAddress = "0x0F0277C11F77EB78aCECB1Bb3ef0ED4afb5CBA2e";
export const useTradeHook = (contractAddress: `0x${string}`, poolABI: any[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { targetNetwork } = useTargetNetwork();
  const client = usePublicClient({ chainId: targetNetwork.id });

  const { address: connectedAddress } = useAccount();

  const { writeContract } = useWriteContract();

  // Check token allowance
  const { data: allowance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [connectedAddress ?? "0x", contractAddress],
  });

  const executeTrade = async (optionId: bigint, amount: bigint, cost: bigint, type: TradeType) => {
    setIsLoading(true);
    setError(null);

    return toast.promise(
      async () => {
        try {
          // Check if approval is needed
          const requiredAllowance = cost;
          const currentAllowance = allowance ?? 0n;

          let approveTxHash: `0x${string}` | undefined;
          if (currentAllowance < requiredAllowance) {
            // Perform token approval
            approveTxHash = await new Promise<`0x${string}`>((resolve, reject) => {
              writeContract(
                {
                  address: tokenAddress,
                  abi: erc20Abi,
                  functionName: "approve",
                  args: [contractAddress, requiredAllowance],
                },
                {
                  onSuccess: hash => resolve(hash),
                  onError: error => reject(error),
                },
              );
            });

            // Wait for approval transaction
            if (approveTxHash) {
              const approvalReceipt = await client?.waitForTransactionReceipt({
                hash: approveTxHash,
              });

              if (!approvalReceipt || approvalReceipt.status !== "success") {
                throw new Error("Approval transaction failed");
              }
            }
          }

          // Execute trade based on type
          const tradeFunctionName = type === "BUY" ? "buyOption" : "sellOption";

          const tradeTxHash = await new Promise<`0x${string}`>((resolve, reject) => {
            writeContract(
              {
                address: contractAddress,
                abi: poolABI,
                functionName: tradeFunctionName,
                args: [optionId, amount],
              },
              {
                onSuccess: hash => resolve(hash),
                onError: error => reject(error),
              },
            );
          });

          // Wait for trade transaction
          const tradeReceipt = await client?.waitForTransactionReceipt({
            hash: tradeTxHash,
          });

          if (!tradeReceipt || tradeReceipt.status !== "success") {
            throw new Error("Trade transaction failed");
          }

          return `${type} order completed successfully`;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";

          setError(errorMessage);
          throw new Error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      },
      {
        pending: `Executing ${type} order...`,
        success: `Transaction successful`,
        error: `Transaction failed: ${error}`,
      },
    );
  };

  return {
    executeTrade,
    isLoading,
    error,
  };
};
