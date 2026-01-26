"use client";

import * as React from "react";
import { useAccount, useBalance, useReadContract, useChainId } from "wagmi";
import { formatUnits } from "viem";
import { erc20Abi } from "@/lib/abis/erc20Abi";
import type { Token, ChainKey } from "@/types/token-types";
import { chainKeyFromChainId } from "@/lib/protocol/tokens-registry";

function tokenAddressOnChain(token: Token, chain: ChainKey) {
  const addr = token.addresses?.[chain];
  if (!addr) return undefined;
  if (addr === ("0x0000000000000000000000000000000000000000" as `0x${string}`)) return undefined;
  return addr as `0x${string}`;
}

export function useTokenBalance(token?: Token, chain?: ChainKey) {
  const { address } = useAccount();
  const chainId = useChainId();
  const derivedChain = chain ?? chainKeyFromChainId(chainId);

  const isNative = !!token?.isNative;
  const erc20Addr = token ? tokenAddressOnChain(token, derivedChain) : undefined;

  // Native
  const nativeBal = useBalance({
    address,
    query: { enabled: !!address && !!token && isNative },
  });

  // ERC20
  const erc20Bal = useReadContract({
    abi: erc20Abi,
    address: erc20Addr,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!token && !isNative && !!erc20Addr },
  });

  const raw = React.useMemo(() => {
    if (!token) return 0n;
    if (isNative) return (nativeBal.data?.value ?? 0n) as bigint;
    return (erc20Bal.data ?? 0n) as bigint;
  }, [token, isNative, nativeBal.data?.value, erc20Bal.data]);

  const formatted = React.useMemo(() => {
    if (!token) return "0";
    return formatUnits(raw, token.decimals);
  }, [raw, token]);

  const isLoading = nativeBal.isLoading || erc20Bal.isLoading;

  return { raw, formatted, isLoading, chain: derivedChain };
}
