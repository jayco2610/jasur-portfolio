import { upstashConfigured } from "@/lib/upstash";
import { decide, parseUpdate } from "@/lib/workshopBot";
import { loadState, runEffects, secretMatches, tg } from "@/lib/workshopBotRuntime";

// Вебхук бота заявок Мастерской (@jasur_workshop_bot). Сюда Telegram
// присылает каждое сообщение и нажатие кнопки. Адрес и секрет ставит
// /api/workshop-bot/setup. Логика разговора в lib/workshopBot.ts.
//
// Ответы:
//   503  в сборке нет WORKSHOP_BOT_TOKEN, бот выключен;
//   401  нет заголовка с секретом или он неверный (запрос не от Telegram);
//   200  всё остальное, даже если обработка упала. На любой другой код
//        Telegram повторяет то же обновление снова и снова.

export const maxDuration = 30;

export async function POST(req: Request) {
  const token = process.env.WORKSHOP_BOT_TOKEN;
  if (!token) {
    return Response.json({ error: "bot is not configured" }, { status: 503 });
  }
  if (!secretMatches(req.headers.get("x-telegram-bot-api-secret-token"), token)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const input = parseUpdate(await req.json());
    if (input) {
      if (!upstashConfigured()) {
        // Без хранилища бот не помнит, на каком вопросе человек, и не может
        // сохранить заявку. Честнее сказать сразу.
        console.error("workshop-bot: Upstash is not configured");
        if (input.kind === "text") {
          await tg(token, "sendMessage", {
            chat_id: input.chatId,
            text: "Бот временно не принимает заявки. Напишите Жасуру напрямую: @biznesmind",
          });
        }
      } else {
        const state = await loadState(input.chatId);
        await runEffects(token, decide(input, { state, now: Date.now() }));
      }
    }
  } catch (e) {
    console.error(`workshop-bot: update failed: ${e instanceof Error ? e.message : "unknown"}`);
  }

  return Response.json({ ok: true });
}
