import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

const portfolio = "https://morphitisantonis.live";

const messages = {
  business: [
    `💡 BUSINESS IDEA — Local Lead Website\n\nBuild a simple website for one local service — cleaning, beauty, car detailing, photography or repairs — and focus it on generating enquiries. Instead of needing thousands of visitors, the goal is to connect a small number of people who already need the service with a business that can serve them.\n\nA simple model: choose one niche → build a clear website → attract local visitors → turn enquiries into customers.\n\nQuestion for the group: which local service would you choose, and how would you get the first 10 visitors?`,
    `💡 BUSINESS IDEA — Digital Service Package\n\nChoose one result a small business needs online: a landing page, menu website, booking page, portfolio or social profile setup. Package the result clearly and sell the finished outcome instead of selling “hours”.\n\nStart with one example project, one clear price and one type of customer.\n\nQuestion: what business near you still has a weak online presence, and what would you improve first?`,
    `💡 BUSINESS IDEA — Niche Directory\n\nCreate a focused website that lists businesses or professionals in one niche or location. Start small, make the directory genuinely useful, then explore featured listings, lead generation or sponsorship once it has visitors.\n\nQuestion: if you launched a directory this week, what niche and city would you choose — and why?`
  ],
  motivation: [
    `🚀 TODAY'S PUSH\n\nYou do not need the perfect business idea before you begin. Pick one useful problem, create the smallest version of a solution and put it in front of real people. Feedback from 5 real users is worth more than another week of thinking.\n\nToday's challenge: write one idea you can test before the day ends.`,
    `📈 SMALL ACTION > PERFECT PLAN\n\nA website, service or online project becomes valuable when somebody actually uses it. Today, move one step closer to a real customer: improve an offer, publish a page, contact a potential client or ask for feedback.\n\nWhat is the one action you will complete today?`,
    `🔥 BUILD MOMENTUM\n\nDo not measure progress only by money. Your first useful page, first enquiry, first customer conversation and first failed test are all data. Use them to make the next version better.\n\nWhat did you learn from your latest attempt?`
  ],
  portfolio: [
    `🌐 FROM IDEA TO ONLINE PROJECT\n\nA website can do more than look professional. It can present an offer, collect enquiries, sell a service, take payments or become the foundation of a new online business.\n\nExplore real project examples and services here: ${portfolio}\n\nLook at the examples and ask yourself: which model could you adapt to your own skills or market?`,
    `💼 YOUR ONLINE ASSET\n\nSocial media can bring attention, but a website gives your offer a permanent home. Use it to explain what you do, show proof, capture leads and give customers a clear next step.\n\nSee projects and ways we can build it together: ${portfolio}\n\nWhich part is missing from your current online presence?`,
    `🛠️ TURN A SKILL INTO AN OFFER\n\nStart with a skill or service you can provide. Give it a clear outcome, create a simple page around it, and make contacting or paying you easy. That is already the beginning of an online business system.\n\nExamples, services and mentoring: ${portfolio}\n\nWhat skill could you package into a clear offer?`
  ],
  engage: [
    `❓ GROUP QUESTION\n\nIf you had to earn your first €100 online using only one skill you already have, what would you sell and who would you sell it to?\n\nWrite your answer below — even if the idea is not fully developed yet.`,
    `🎯 MINI STRATEGY CHALLENGE\n\nChoose one customer, one problem and one offer. Complete this sentence:\n\n“I help ______ solve ______ by providing ______.”\n\nPost yours in the group. Keeping it simple often reveals whether an idea is clear enough to sell.`,
    `🤔 THINK LIKE A CUSTOMER\n\nOpen your current website, profile or business idea as if you had never seen it before. In 10 seconds, can you understand what is being offered, who it is for and what to do next?\n\nWhich of those three is currently the weakest?`
  ]
} as const;

type Kind = keyof typeof messages;

function pick(kind: Kind) {
  const list = messages[kind];
  const day = Math.floor(Date.now() / 86_400_000);
  return list[day % list.length];
}

export async function GET(request: NextRequest) {
  const secret = process.env.TELEGRAM_CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kind = request.nextUrl.searchParams.get("kind") as Kind | null;
  if (!kind || !(kind in messages)) {
    return NextResponse.json({ error: "Use kind=business, motivation, portfolio or engage" }, { status: 400 });
  }

  await sendTelegramMessage(pick(kind));
  return NextResponse.json({ ok: true, kind });
}
