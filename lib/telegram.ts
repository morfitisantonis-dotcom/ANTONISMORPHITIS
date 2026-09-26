const TELEGRAM_API = "https://api.telegram.org";

export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_START_ONLINE_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram environment variables are missing");

  const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: false,
    }),
  });

  if (!response.ok) throw new Error(`Telegram API error: ${await response.text()}`);
  return response.json();
}

export function firstName(user: { first_name?: string; username?: string }) {
  return user.first_name?.trim() || (user.username ? `@${user.username}` : "there");
}
