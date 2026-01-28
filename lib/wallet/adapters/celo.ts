
import { BaseScanErc20Transfer } from "./base";

// CeloScan-like ERC20 transfer item (often identical fields)
export type CeloScanErc20Transfer = BaseScanErc20Transfer;

// Normal tx list (native)
export type ExplorerNormalTx = {
  hash: string;
  from: string;
  to: string;
  timeStamp: string;
  value: string;         // wei
  isError?: string;
  blockNumber: string;
};