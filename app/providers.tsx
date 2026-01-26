"use client";

import React, { useState} from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";


import { config } from "@/lib/config/configWagmi";


const Providers = ({ children }: { children: React.ReactNode }) => {
const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;
