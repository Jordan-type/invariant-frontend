// BaseScan-like ERC20 transfer item
export type BaseScanErc20Transfer = {
  hash: string;
  from: string;
  to: string;
  timeStamp: string;     // unix string
  tokenSymbol: string;
  tokenDecimal: string;
  contractAddress: string;
  value: string;         // atomic
  blockNumber: string;
  isError?: string;      // sometimes present
};