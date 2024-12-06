import { poolABI } from "./abis/OpinionPool";
import * as chains from "viem/chains";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
  [chains.sepolia.id]: {
    POOL_CONTRACT: {
      address: "0x8aDb7Ca8ba24a1fDCea74fED0a32F158d6d82Ad7",
      abi: poolABI,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
