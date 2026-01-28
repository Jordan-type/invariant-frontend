"use client";

import * as React from "react";
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table";
import { ArrowUpDown, Copy, ExternalLink, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";

import type { WalletTxTableFilters, WalletTx } from "@/types/tx-types";
import { cn } from "@/lib/utils";

const shortAddr = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");

function statusBadge(status: WalletTx["status"]) {
  if (status === "confirmed")
    return (
      <Badge className="gap-1">
        <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
      </Badge>
    );
  if (status === "failed")
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3.5 w-3.5" /> Failed
      </Badge>
    );
  return <Badge variant="outline">Pending</Badge>;
}

export function WalletTxTable({
  walletAddress,
  rows,
  isLoading,
  filters,
  onFiltersChange,
  explorerTxUrl,
  tokensForFilter,
}: {
  walletAddress?: `0x${string}`;
  rows: WalletTx[];
  isLoading?: boolean;
  filters: WalletTxTableFilters;
  onFiltersChange: (next: WalletTxTableFilters) => void;
  explorerTxUrl: (chain: WalletTx["chain"], hash: `0x${string}`) => string;
  tokensForFilter?: { symbol: string }[];
}) {
  const data = React.useMemo(() => {
    const tab = filters.tab ?? "all";
    const search = (filters.search ?? "").toLowerCase().trim();
    const token = filters.token ?? "all";
    const kind = filters.kind ?? "all";

    return rows.filter((r) => {
      if (tab === "pending" && r.status !== "pending") return false;
      if (tab === "failed" && r.status !== "failed") return false;
      if (tab === "sent" && r.direction !== "sent") return false;
      if (tab === "received" && r.direction !== "received") return false;

      if (token !== "all" && r.token.symbol !== token) return false;
      if (kind !== "all" && r.kind !== kind) return false;

      if (search) {
        const hay = `${r.hash} ${r.from} ${r.to}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });
  }, [rows, filters]);



  const columns = React.useMemo<ColumnDef<WalletTx>[]>(() => [
    {
      id: "status",
      header: () => <div className="text-xs text-muted-foreground">Status</div>,
      cell: ({ row }) => statusBadge(row.original.status),
    },
    {
      id: "type",
      header: () => <div className="text-xs text-muted-foreground">Type</div>,
      cell: ({ row }) => {
        const r = row.original;
        const label =
          r.kind === "transfer"
            ? r.direction === "sent"
              ? "Send"
              : "Receive"
            : r.kind === "approval"
              ? "Approve"
              : r.kind === "swap"
                ? "Swap"
                : "Contract";

        return (
          <div className="flex items-center gap-2">
            <div className="font-medium">{label}</div>
            <Badge variant="outline" className="text-[10px]">
              {r.chain.toUpperCase()}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "asset",
      header: () => <div className="text-xs text-muted-foreground">Asset</div>,
      cell: ({ row }) => <div className="font-medium">{row.original.token.symbol}</div>,
    },
    {
      id: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 h-7"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
      accessorFn: (r) => Number(r.valueFormatted || 0),
      cell: ({ row }) => {
        const r = row.original;
        const sign = r.direction === "sent" ? "-" : "+";
        return (
          <div className="text-right">
            <div
              className={cn(
                "tabular-nums font-semibold",
                r.direction === "sent" && "text-muted-foreground"
              )}
            >
              {sign}
              {r.valueFormatted} {r.token.symbol}
            </div>
            {typeof r.valueUsd === "number" ? (
              <div className="text-xs text-muted-foreground tabular-nums">
                ${r.valueUsd.toFixed(2)}
              </div>
            ) : null}
          </div>
        );
      },
    },
    {
      id: "counterparty",
      header: () => <div className="text-xs text-muted-foreground">Counterparty</div>,
      cell: ({ row }) => {
        const r = row.original;
        const counter = r.direction === "sent" ? r.to : r.from;

        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs">{shortAddr(counter)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigator.clipboard.writeText(counter)}
              aria-label="Copy address"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
    {
      id: "time",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 h-7"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
      accessorFn: (r) => r.timestamp ?? Math.floor(r.createdAt / 1000),
      cell: ({ row }) => {
        const ts = row.original.timestamp ? row.original.timestamp * 1000 : row.original.createdAt;
        return <div className="text-sm text-muted-foreground">{new Date(ts).toLocaleString()}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-xs text-muted-foreground text-right">Actions</div>,
      cell: ({ row }) => {
        const r = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a href={explorerTxUrl(r.chain, r.hash)} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> View on explorer
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(r.hash)}>
                  <Copy className="mr-2 h-4 w-4" /> Copy hash
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ], [explorerTxUrl]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { sorting: [{ id: "time", desc: true }] },
  });

  const tokenOptions = React.useMemo(() => {
    const fromRows = rows.map((r) => r.token.symbol);
    const fromRegistry = (tokensForFilter ?? []).map((t) => t.symbol);
    const set = new Set([...fromRows, ...fromRegistry].filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [rows, tokensForFilter]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs value={filters.tab ?? "all"} onValueChange={(v) => onFiltersChange({ ...filters, tab: v as WalletTxTableFilters["tab"] })}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search hash / address…"
            value={filters.search ?? ""}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full md:w-[260px]"
          />
          <select
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
            value={filters.token ?? "all"}
            onChange={(e) => onFiltersChange({ ...filters, token: e.target.value })}
          >
            {tokenOptions.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All tokens" : t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((r) => (
                <TableRow key={r.id}>
                  {r.getVisibleCells().map((c) => (
                    <TableCell key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No transactions
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
