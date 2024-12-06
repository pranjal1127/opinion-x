import { poolABI } from "./abis/OpinionPool";
import { TokenAbi } from "./abis/Token";
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
      address: "0x04Cf4135B65e6B866F3eF9C6A2CD526779720EFA",
      abi: poolABI,
    },
    TOKEN: {
      address: "0x0F0277C11F77EB78aCECB1Bb3ef0ED4afb5CBA2e",
      abi: TokenAbi,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
