import Link from "next/link";
import { ArrowRight, Shield, Sparkles, Waves, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="bg-card/60 backdrop-blur border-border/60">
    <CardContent className="p-6 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl border border-border/60 bg-background/40 flex items-center justify-center">
          {icon}
        </div>
        <div className="font-semibold">{title}</div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Subtle background */}
      {/* Hero */}
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-12">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Badge variant="outline" className="border-border/70 bg-card/40">
                AI strategies • Onchain constraints • Adaptive liquidity
              </Badge>

              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Adaptive liquidity,
                <span className="block text-muted-foreground">
                  without breaking the math.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Invariant is a Uniswap v4 hook-native protocol that uses AI-driven strategies to
                optimize liquidity ranges, fees, and risk—while preserving onchain invariants.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    Launch App <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/hooks">
                  <Button size="lg" variant="outline" className="border-border/70 bg-card/40">
                    Explore Hooks
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Risk-aware fee logic
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Strategy execution engine
                </div>
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4" />
                  Liquidity regime detection
                </div>
              </div>
            </div>

            {/* Hero card */}
            <div className="lg:col-span-5">
              <Card className="bg-card/60 backdrop-blur border-border/60">
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Protocol Status</div>
                      <div className="text-xl font-semibold">Ready</div>
                    </div>
                    <Badge className="bg-[hsl(var(--secondary))] text-black">Live UI</Badge>
                  </div>

                  <Separator className="bg-border/60" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                      <div className="text-xs text-muted-foreground">Tracked Pools</div>
                      <div className="text-2xl font-semibold">12</div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                      <div className="text-xs text-muted-foreground">Strategies</div>
                      <div className="text-2xl font-semibold">4</div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                      <div className="text-xs text-muted-foreground">Risk Regime</div>
                      <div className="text-2xl font-semibold">Low</div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                      <div className="text-xs text-muted-foreground">Next Action</div>
                      <div className="text-2xl font-semibold">Rebalance</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-background/30 p-4">
                    <div className="flex items-center gap-2 font-semibold">
                      <Sparkles className="h-4 w-4" />
                      Strategy Loop
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Observe pool state → generate signal → simulate → execute via hook guards.
                    </p>
                  </div>

                  <Link href="/strategies">
                    <Button variant="secondary" className="w-full gap-2">
                      View Strategies <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features */}
          <div className="pt-14">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-sm text-muted-foreground">What Invariant does</div>
                <h2 className="text-2xl font-semibold mt-1">Hook-native primitives</h2>
              </div>
              <Link href="/pools" className="text-sm text-muted-foreground hover:text-foreground transition">
                Browse pools →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <FeatureCard
                icon={<Waves className="h-5 w-5" />}
                title="Adaptive Liquidity"
                description="AI suggests range adjustments based on volatility and depth. Hooks enforce constraints and execution rules."
              />
              <FeatureCard
                icon={<Zap className="h-5 w-5" />}
                title="Dynamic Fees"
                description="Fee curves respond to risk regimes and order flow. Protect LPs during spikes, stay competitive during calm."
              />
              <FeatureCard
                icon={<Shield className="h-5 w-5" />}
                title="Risk Guardrails"
                description="Onchain invariants and configurable limits prevent strategy drift, oracle shock, and unsafe execution."
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="pt-16 pb-10 text-sm text-muted-foreground">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Invariant</span>
                <span>·</span>
                <span>Uniswap v4 hook-native protocol</span>
              </div>
              <div className="flex gap-4">
                <Link href="/dashboard" className="hover:text-foreground transition">
                  Dashboard
                </Link>
                <Link href="/hooks" className="hover:text-foreground transition">
                  Hooks
                </Link>
                <Link href="/strategies" className="hover:text-foreground transition">
                  Strategies
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
