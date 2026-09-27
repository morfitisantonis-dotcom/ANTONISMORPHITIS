import { NextRequest, NextResponse } from "next/server";
import { firstName, sendTelegramMessage } from "@/lib/telegram";

async function sendToChat(chatId: string | number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is missing");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram API error: ${await response.text()}`);
  }
}

export async function POST(request: NextRequest) {
  const update = await request.json();
  const message = update?.message;
  const expectedChatId = process.env.TELEGRAM_START_ONLINE_CHAT_ID;

  const chatId = message?.chat?.id;
  const text = typeof message?.text === "string" ? message.text.trim() : "";

  // Utility command: reply with the ID of whichever Telegram group sent /chatid.
  if (chatId && /^\/chatid(?:@\w+)?$/i.test(text)) {
    await sendToChat(chatId, `Chat ID: ${chatId}`);
    return NextResponse.json({ ok: true });
  }

  if (chatId && String(chatId) === expectedChatId && Array.isArray(message.new_chat_members)) {
    for (const member of message.new_chat_members) {
      if (member?.is_bot) continue;
      await sendTelegramMessage(
        `Welcome ${firstName(member)} 👋\n\nWelcome to Morphitis | Start Online. This community is here to help you turn ideas into action, explore online business opportunities and keep moving forward.\n\n🌐 Explore my projects, services and ways to build online: https://morphitisantonis.live\n\nTell us: what would you like to build or improve online?`
      );
    }
  }

  return NextResponse.json({ ok: true });
}
