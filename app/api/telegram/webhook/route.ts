import { NextRequest, NextResponse } from "next/server";
import { firstName, sendTelegramMessage } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  const update = await request.json();
  const message = update?.message;
  const expectedChatId = process.env.TELEGRAM_START_ONLINE_CHAT_ID;

  if (message?.chat?.id && String(message.chat.id) === expectedChatId && Array.isArray(message.new_chat_members)) {
    for (const member of message.new_chat_members) {
      if (member?.is_bot) continue;
      await sendTelegramMessage(
        `Welcome ${firstName(member)} 👋\n\nWelcome to Morphitis | Start Online. This community is here to help you turn ideas into action, explore online business opportunities and keep moving forward.\n\n🌐 Explore my projects, services and ways to build online: https://morphitisantonis.live\n\nTell us: what would you like to build or improve online?`
      );
    }
  }

  return NextResponse.json({ ok: true });
}
