"use client";

import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

import type { Token } from "@/types/token-types";
import { cn } from "@/lib/utils";


export function TokenPicker({tokens, value, onChange, align = "start"}: {
tokens: Token[];
  value: Token;
  onChange: (t: Token) => void;
  align?: "start" | "end" | "center";
}) {
  const [open, setOpen] = React.useState(false);

  const selectedId = value?.id ?? `${value.symbol}:${value.name}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="justify-between w-full border-border/70 bg-background/40"
        >
          <span className="flex items-center gap-2">

            {/* optional logo */}
            {value.logoURI ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value.logoURI}
                alt={value.symbol}
                className="h-5 w-5 rounded-full"
              />
            ) : (
              <div className="h-5 w-5 rounded-full border border-border/60 bg-background/50" />
            )}



            <Badge variant="secondary" className="bg-[hsl(var(--secondary))] text-black">
              {value.symbol}
            </Badge>
            <span className="text-sm text-muted-foreground">{value.name}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align={align} className="p-0 w-[320px]">
        <Command>
          <CommandInput placeholder="Search token..." />
          <CommandEmpty>No token found.</CommandEmpty>
          <CommandGroup>
            {tokens.map((t) => {
              const id = t.id ?? `${t.symbol}:${t.name}`;
              const selected = id === selectedId;

              return (
                <CommandItem
                  key={id}
                  value={`${t.symbol} ${t.name}`}
                  onSelect={() => {
                    onChange(t);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {t.logoURI ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={t.logoURI}
                          alt={t.symbol}
                          className="h-5 w-5 rounded-full"
                        />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-border/60 bg-background/50" />
                      )}

                      <Badge variant={selected ? "default" : "outline"} className={cn(
                        "border-border/70",
                        selected && "bg-[hsl(var(--primary))] text-black"
                      )}>
                        {t.symbol}
                      </Badge>
                      <span className="text-sm">{t.name}</span>
                    </div>
                    {selected && <Check className="h-4 w-4" />}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
