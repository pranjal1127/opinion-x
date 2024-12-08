import { factoryABI } from "./abis/OpinionFactory";
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
  [chains.baseSepolia.id]: {
    POOL_CONTRACT: {
      address: "0x71cfFa1C994D0A469DEBC8feB37f0391712Be796",
      abi: poolABI,
    },
    TOKEN: {
      address: "0x0F0277C11F77EB78aCECB1Bb3ef0ED4afb5CBA2e",
      abi: TokenAbi,
    },
    FACTORY: {
      address: "0x9EaD9b18cC8ad171a36afa565054791b5E147FBB",
      abi: factoryABI,
    },
  },
  [chains.polygon.id]: {
    POOL_CONTRACT: {
      address: "0x1FBcAfd31924AAd4BA996F4f4dd4aAA6377509CB",
      abi: poolABI,
    },
    TOKEN: {
      address: "0x0F0277C11F77EB78aCECB1Bb3ef0ED4afb5CBA2e",
      abi: TokenAbi,
    },
    FACTORY: {
      address: "0x9EaD9b18cC8ad171a36afa565054791b5E147FBB",
      abi: factoryABI,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
