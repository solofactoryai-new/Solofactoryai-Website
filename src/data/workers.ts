/* The AI Workers and whether each exists today (the rebuild brief, part 7).

   "early": in the live product's early access. Checked against the product on 2026-11-22:
   research is the ICP Research, Customer Discovery and Prospect Discovery Agents; product is
   Features and the PRDs written from them.
   "planned": on the roadmap, not available. Never show a planned worker as available. */
import type { IconName } from "../components/Icon.astro";

export type Stage = "early" | "planned";

export const workers: {
  name: string;
  short: string;
  icon: IconName;
  stage: Stage;
  text: string;
}[] = [
  {
    name: "Research Worker",
    short: "Research",
    icon: "search",
    stage: "early",
    text: "Understand markets, customers, competitors and opportunities.",
  },
  {
    name: "Product Worker",
    short: "Product",
    icon: "package",
    stage: "early",
    text: "Turn ideas, requirements and research into product plans and deliverables.",
  },
  {
    name: "Marketing Worker",
    short: "Marketing",
    icon: "megaphone",
    stage: "planned",
    text: "Support brand positioning, content and campaign execution.",
  },
  {
    name: "Sales Worker",
    short: "Sales",
    icon: "target",
    stage: "planned",
    text: "Support prospecting, customer outreach and sales workflows.",
  },
  {
    name: "Finance Worker",
    short: "Finance",
    icon: "wallet",
    stage: "planned",
    text: "Help understand business finances and support financial planning.",
  },
  {
    name: "Operations Worker",
    short: "Operations",
    icon: "workflow",
    stage: "planned",
    text: "Coordinate recurring workflows and business processes.",
  },
  {
    name: "Customer Success Worker",
    short: "Customer Success",
    icon: "life-buoy",
    stage: "planned",
    text: "Support customer onboarding, communication and service.",
  },
];

export const stageLabel: Record<Stage, string> = {
  early: "Early Access",
  planned: "Planned",
};
