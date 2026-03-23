"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Cpu,
  Globe,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users2,
  Zap,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HomeHeader } from "@/components/home-header"

type Tone = "indigo" | "violet" | "cyan" | "emerald" | "amber" | "rose" | "fuchsia"

type ToneStyle = {
  glow: string
  iconBg: string
  iconBorder: string
  iconText: string
}

type Feature = {
  title: string
  desc: string
  kicker: string
  icon: LucideIcon
  tone: Tone
}

type WorkflowStep = {
  title: string
  desc: string
  icon: LucideIcon
}

type Signal = {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  tone: Tone
}

const toneStyles: Record<Tone, ToneStyle> = {
  indigo: {
    glow: "from-indigo-500/20 via-indigo-500/5 to-transparent",
    iconBg: "bg-indigo-500/10",
    iconBorder: "border-indigo-400/20",
    iconText: "text-indigo-300",
  },
  violet: {
    glow: "from-violet-500/20 via-violet-500/5 to-transparent",
    iconBg: "bg-violet-500/10",
    iconBorder: "border-violet-400/20",
    iconText: "text-violet-300",
  },
  cyan: {
    glow: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    iconBg: "bg-cyan-500/10",
    iconBorder: "border-cyan-400/20",
    iconText: "text-cyan-300",
  },
  emerald: {
    glow: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-400/20",
    iconText: "text-emerald-300",
  },
  amber: {
    glow: "from-amber-500/20 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-400/20",
    iconText: "text-amber-300",
  },
  rose: {
    glow: "from-rose-500/20 via-rose-500/5 to-transparent",
    iconBg: "bg-rose-500/10",
    iconBorder: "border-rose-400/20",
    iconText: "text-rose-300",
  },
  fuchsia: {
    glow: "from-fuchsia-500/20 via-fuchsia-500/5 to-transparent",
    iconBg: "bg-fuchsia-500/10",
    iconBorder: "border-fuchsia-400/20",
    iconText: "text-fuchsia-300",
  },
}

const heroBullets = [
  {
    title: "Generative layout",
    copy: "Explore options around constraints, circulation, and daylight without losing speed.",
  },
  {
    title: "Cost awareness",
    copy: "Keep budget and material tradeoffs visible as the plan evolves.",
  },
  {
    title: "Team-ready outputs",
    copy: "Share clean context with designers, builders, and owners in one workspace.",
  },
]

const dashboardSignals: Signal[] = [
  {
    label: "Risk confidence",
    value: "98.4%",
    detail: "verified against current scope and delivery assumptions",
    icon: TrendingUp,
    tone: "emerald",
  },
  {
    label: "Active collaborators",
    value: "12 teams",
    detail: "coordinating in one shared environment",
    icon: Users2,
    tone: "indigo",
  },
  {
    label: "Scope to review",
    value: "45 min",
    detail: "to the first polished, shareable plan",
    icon: Building2,
    tone: "violet",
  },
]

const workflowSteps: WorkflowStep[] = [
  {
    title: "Shape the brief",
    desc: "Capture goals, constraints, and references in one clear starting point.",
    icon: Sparkles,
  },
  {
    title: "Model the tradeoffs",
    desc: "Generate options, compare risk, and surface the consequences before approval.",
    icon: Target,
  },
  {
    title: "Deliver with confidence",
    desc: "Hand off a coordinated plan that designers, builders, and owners can act on.",
    icon: Users2,
  },
]

const proofStats = [
  {
    value: "2,500+",
    label: "projects modeled",
    detail: "across planning, design, and delivery",
  },
  {
    value: "$420M",
    label: "cost preserved",
    detail: "through earlier risk and scope decisions",
  },
  {
    value: "65%",
    label: "risk reduction",
    detail: "when teams follow platform recommendations",
  },
  {
    value: "3x",
    label: "faster iteration",
    detail: "between concept and review-ready output",
  },
]

const features: Feature[] = [
  {
    title: "Generative Design",
    desc: "Explore thousands of optimized design possibilities based on your specific requirements and constraints.",
    kicker: "Design intelligence",
    icon: Cpu,
    tone: "indigo",
  },
  {
    title: "Predictive Analytics",
    desc: "Identify potential delays and cost overruns before they occur with advanced risk-modeling engines.",
    kicker: "Risk modeling",
    icon: Target,
    tone: "fuchsia",
  },
  {
    title: "Unified AEC Data",
    desc: "Connect BIM, scheduling, and financial data into a single source of truth for seamless collaboration.",
    kicker: "Shared context",
    icon: Globe,
    tone: "cyan",
  },
  {
    title: "Eco-Optimization",
    desc: "Reduce the carbon footprint of your projects through AI-driven material and energy analysis.",
    kicker: "Sustainability",
    icon: Zap,
    tone: "emerald",
  },
  {
    title: "Smart Compliance",
    desc: "Automate regulatory checks and ensure your projects meet local codes and standards instantly.",
    kicker: "Code readiness",
    icon: Shield,
    tone: "amber",
  },
  {
    title: "Real-time Insight",
    desc: "Dynamic dashboards that provide a pulse on every aspect of your project lifecycle.",
    kicker: "Live operations",
    icon: TrendingUp,
    tone: "rose",
  },
]

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.1),transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-white selection:bg-indigo-500/30 selection:text-white">
      <HomeHeader />

      <main>
        <section id="product" className="relative isolate overflow-hidden pb-20 pt-28 sm:pt-32 md:pt-36 lg:pb-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[-10rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]"
          />

          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
            <motion.div variants={reveal} initial="hidden" animate="show" className="relative z-10">
              <span className="eyebrow">
                <Sparkles className="size-3.5 text-indigo-300" />
                AI-native planning for ambitious AEC teams
              </span>

              <h1 className="mt-7 max-w-3xl text-5xl font-semibold tracking-tight leading-[1.02] sm:text-6xl lg:text-7xl xl:text-8xl">
                Turn project complexity into a clear path to build.
              </h1>

              <p className="mt-6 max-w-2xl section-copy">
                BuildWise.ai combines generative design, risk intelligence, and material guidance so teams can move from concept to confident execution faster.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-full border border-indigo-400/20 bg-indigo-600 px-6 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500">
                  <Link href="/sign-up">
                    Start your workspace
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/10 bg-white/5 px-6 text-base text-white hover:bg-white/10">
                  <Link href="#features">See the platform</Link>
                </Button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {heroBullets.map((bullet, index) => (
                  <motion.div
                    key={bullet.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.08 }}
                    className="surface-panel rounded-3xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{bullet.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">{bullet.copy}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={reveal}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.12 }}
              className="relative mx-auto w-full max-w-xl"
            >
              <div className="absolute -inset-8 rounded-[2.5rem] bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.35),transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.18),transparent_45%)] blur-3xl" />
              <div className="surface-panel-strong relative overflow-hidden rounded-[2rem] p-6 sm:p-7">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.12),rgba(15,23,42,0.75))]" />

                <div className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/75 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-xl">
                  <Sparkles className="size-3.5 text-indigo-300" />
                  Live design ops
                </div>

                <div className="relative mt-4 hidden rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-xl sm:block">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Risk signal</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-300">98.4% confidence</p>
                </div>

                <div className="relative mt-4 grid gap-3 sm:grid-cols-3">
                  {dashboardSignals.map((signal) => {
                    const tone = toneStyles[signal.tone]
                    return (
                      <div key={signal.label} className="rounded-2xl border border-white/10 bg-slate-950/80 p-3 backdrop-blur-xl">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${tone.iconBg} ring-1 ${tone.iconBorder}`}>
                            <signal.icon className={`size-4 ${tone.iconText}`} />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{signal.label}</p>
                            <p className="text-sm font-semibold text-white">{signal.value}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-slate-400">{signal.detail}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="platform" className="border-y border-white/5 bg-white/[0.02] py-8">
          <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div className="space-y-3">
              <span className="eyebrow">Platform workflow</span>
              <h2 className="section-title">A focused operating system for every project stage.</h2>
              <p className="section-copy">
                From initial feasibility to designer handoff, BuildWise keeps the next decision obvious.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.08 }}
                  className="surface-panel card-lift rounded-[1.5rem] p-5"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <step.icon className="size-5 text-indigo-300" />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">0{index + 1}</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="proof" className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="eyebrow">Measured impact</span>
                <h2 className="mt-5 section-title">Built to show value before the first permit is filed.</h2>
                <p className="mt-4 section-copy">
                  The platform surfaces cost, risk, and collaboration signals in a format teams can act on quickly.
                </p>
              </div>

              <Button asChild variant="ghost" className="rounded-full border border-white/10 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white">
                <Link href="/dashboard">Open the dashboard</Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {proofStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ delay: index * 0.08 }}
                  className="surface-panel card-lift rounded-[1.5rem] p-6"
                >
                  <p className="metric-value">{stat.value}</p>
                  <p className="metric-label mt-4">{stat.label}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{stat.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="pb-24 md:pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="eyebrow">Capabilities</span>
              <h2 className="mt-5 section-title">The tools feel integrated, not assembled.</h2>
              <p className="mt-4 section-copy">
                Each module feeds the next one so teams can keep momentum instead of switching context.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature, index) => {
                const tone = toneStyles[feature.tone]

                return (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ delay: index * 0.08 }}
                    className="group surface-panel card-lift relative overflow-hidden rounded-[1.75rem] p-7"
                  >
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.glow} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                    <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${tone.iconBg} ring-1 ${tone.iconBorder}`}>
                      <feature.icon className={`size-7 ${tone.iconText}`} />
                    </div>
                    <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      {feature.kicker}
                    </p>
                    <h3 className="relative mt-3 text-2xl font-semibold tracking-tight text-white">
                      {feature.title}
                    </h3>
                    <p className="relative mt-3 text-sm leading-6 text-slate-400">
                      {feature.desc}
                    </p>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="pb-24 md:pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="surface-panel-strong relative overflow-hidden rounded-[2.25rem] px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.15),transparent_28%)]" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-2xl">
                  <span className="eyebrow">Ready to move faster?</span>
                  <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                    Bring your next project into one calm, high-confidence workspace.
                  </h2>
                  <p className="mt-4 section-copy">
                    Create a sharper handoff between planning, design, and procurement with one shared source of truth.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="h-12 rounded-full border border-white/10 bg-white px-6 text-base font-semibold text-slate-950 hover:bg-slate-100">
                    <Link href="/sign-up">Get started free</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/10 bg-white/5 px-6 text-base text-white hover:bg-white/10">
                    <Link href="/contact">Talk to sales</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-slate-950/70">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.9fr_0.9fr] lg:px-8">
          <div>
            <Link href="/" className="inline-flex items-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold tracking-wide text-white">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" />
                BuildWise.ai
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              BuildWise.ai helps construction and design teams make confident decisions with clearer planning, faster iteration, and better delivery signals.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Product</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><Link href="#product" className="transition-colors hover:text-white">Overview</Link></li>
              <li><Link href="#platform" className="transition-colors hover:text-white">Workflow</Link></li>
              <li><Link href="#features" className="transition-colors hover:text-white">Capabilities</Link></li>
              <li><Link href="/dashboard" className="transition-colors hover:text-white">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><Link href="/about" className="transition-colors hover:text-white">About</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
              <li><Link href="/sign-in" className="transition-colors hover:text-white">Sign In</Link></li>
              <li><Link href="/sign-up" className="transition-colors hover:text-white">Sign Up</Link></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 border-t border-white/5 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright {new Date().getFullYear()} BuildWise.ai. All rights reserved.</p>
          <p>Designed for focused project planning and delivery.</p>
        </div>
      </footer>
    </div>
  )
}
