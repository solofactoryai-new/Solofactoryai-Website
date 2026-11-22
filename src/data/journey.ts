/* The eight-stage journey (the rebuild brief, page 3), with what SoloFactory does at each stage
   today. Checked against the live product on 2026-11-22:
   - Discover: the ICP Research Agent proposes customer segments and an ideal customer profile
     from the public web; the Prospect Discovery Agent lists companies to approach.
   - Validate: the Customer Discovery Agent prepares interview guides and turns conversation
     notes into statements that become evidence only when the founder accepts them.
   - Build: Features (each small enough to build in a day) and a PRD for each, to give to the
     founder's own build tool; marking a feature ready teaches the Brain what shipped.
   Everything else is planned. Never mark a stage early without checking the product. */
import type { Stage } from "./workers";

export const journey: {
  name: string;
  short: string;
  about: string;
  today?: string;
  planned: string;
  stage: Stage;
}[] = [
  {
    name: "Discover",
    short: "Find meaningful problems, opportunities and customers.",
    about: "Start from what you know and the problem you care about. Find out who has that problem, and how much it matters to them.",
    today: "The Research Worker studies the public web and proposes customer segments and an ideal customer profile, with its sources. It can also list companies worth approaching. Nothing is sent to anyone.",
    planned: "Deeper market and competitor research, kept up to date as your business grows.",
    stage: "early",
  },
  {
    name: "Validate",
    short: "Test assumptions and understand whether a real market exists.",
    about: "Talk to real people before you build. Turn what they say into evidence, and let the evidence decide.",
    today: "SoloFactory prepares interview guides for your customer conversations, then turns your notes into statements you can accept as evidence. Nothing becomes evidence without you.",
    planned: "Clearer signals of demand across many conversations and experiments.",
    stage: "early",
  },
  {
    name: "Build",
    short: "Turn validated ideas into products and services.",
    about: "Decide what to build first, in small pieces, and build only what the evidence supports.",
    today: "The Product Worker turns evidence into features small enough to build in a day, and writes a product requirements document (PRD) for each, ready for your own build tool. When a feature is ready, the Brain learns what you shipped.",
    planned: "More of the build itself, for software and for products and services that are not software.",
    stage: "early",
  },
  {
    name: "Connect",
    short: "Bring business tools, data and systems together.",
    about: "Your business already lives in many places: email, documents, payments, customer lists.",
    planned: "Connect the tools you already use, so the Brain sees the whole business, only with your permission.",
    stage: "planned",
  },
  {
    name: "Acquire",
    short: "Reach customers and build demand.",
    about: "Tell the right people about what you have built, and turn interest into customers.",
    planned: "The Marketing and Sales Workers help with positioning, content, outreach and your pipeline. You approve what is sent.",
    stage: "planned",
  },
  {
    name: "Operate",
    short: "Coordinate the activities that keep a business running.",
    about: "Every business has recurring work: orders, invoices, follow-ups, reports.",
    planned: "The Operations and Finance Workers take on recurring workflows and keep an eye on the numbers.",
    stage: "planned",
  },
  {
    name: "Grow",
    short: "Understand performance and identify opportunities to improve.",
    about: "Know what is working, what is not, and where the next opportunity is.",
    planned: "The Brain connects results back to decisions, so each choice is better informed than the last.",
    stage: "planned",
  },
  {
    name: "Sustain",
    short: "Build a business capable of creating lasting value.",
    about: "A sustainable business pays its way, serves its customers well and keeps going.",
    planned: "The Customer Success Worker helps you look after customers, and the whole workforce supports a business built to last.",
    stage: "planned",
  },
];
