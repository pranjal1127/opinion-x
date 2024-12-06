import { type Address, createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

export async function readContractData(
  contractAddress: Address,
  abi: any[],
  functionName: string,
  functionArgs?: any[],
) {
  // Create a public client using Alchemy RPC URL
  const client = createPublicClient({
    chain: sepolia,
    transport: http("https://eth-sepolia.g.alchemy.com/v2/J07Y7BEk4YfDLUjm479JK7ccgwxHuO_m"),
  });

  try {
    // Read contract data
    const result = await client.readContract({
      address: contractAddress,
      abi: abi,
      functionName: functionName,
      args: functionArgs || [],
    });
    console.log("Contract data:", result);
    return result;
  } catch (error) {
    console.error("Error reading contract:", error);
    throw error;
  }
}
