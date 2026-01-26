"use client";

import * as React from "react";
import { useAccount, useChainId, useSwitchChain, useSendTransaction, useWriteContract } from "wagmi";
import { parseUnits, isAddress } from "viem";
import type { Token, ChainKey } from "@/types/token-types";
import { chainKeyFromChainId } from "@/lib/protocol/tokens-registry";
import { erc20Abi } from "@/lib/abis/erc20Abi";

function chainIdFromKey(key: ChainKey) {
  if (key === "celo") return 42220;
  if (key === "base") return 8453;
  // add others if you support them
  return 42220;
}

function tokenAddressOnChain(token: Token, chain: ChainKey) {
  const addr = token.addresses?.[chain];
  if (!addr) return undefined;
  if (addr === ("0x0000000000000000000000000000000000000000" as `0x${string}`)) return undefined;
  return addr as `0x${string}`;
}

export function useSendToken(chain?: ChainKey) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const derivedChain = chain ?? chainKeyFromChainId(chainId);

  const { switchChainAsync } = useSwitchChain();
  const sendTx = useSendTransaction();
  const write = useWriteContract();

  const ensureChain = React.useCallback(
    async (target: ChainKey) => {
      const want = chainIdFromKey(target);
      if (chainId !== want) await switchChainAsync({ chainId: want });
    },
    [chainId, switchChainAsync]
  );

  const send = React.useCallback(
    async (args: { token: Token; to: string; amount: string; chain?: ChainKey }) => {
      const targetChain = args.chain ?? derivedChain;

      if (!isConnected) throw new Error("Connect a wallet first.");
      if (!isAddress(args.to)) throw new Error("Invalid recipient address.");
      if (!args.amount || Number(args.amount) <= 0) throw new Error("Enter a valid amount.");

      // Switch network if needed
      await ensureChain(targetChain);

      const value = parseUnits(args.amount, args.token.decimals);

      if (args.token.isNative) {
        // Native send
        const hash = await sendTx.sendTransactionAsync({
          to: args.to as `0x${string}`,
          value,
        });
        return hash;
      }

      // ERC20 send
      const tokenAddr = tokenAddressOnChain(args.token, targetChain);
      if (!tokenAddr) throw new Error(`Token not available on ${targetChain}.`);

      const hash = await write.writeContractAsync({
        abi: erc20Abi,
        address: tokenAddr,
        functionName: "transfer",
        args: [args.to as `0x${string}`, value],
      });

      return hash;
    },
    [derivedChain, ensureChain, isConnected, sendTx, write]
  );

  return {
    send,
    isPending: sendTx.isPending || write.isPending,
  };
}
