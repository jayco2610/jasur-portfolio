import { COMMANDS } from "@/lib/workshopBot";
import {
  WEBHOOK_URL,
  getAdminChatId,
  setAdminCommands,
  tg,
  webhookSecret,
} from "@/lib/workshopBotRuntime";

// Установка вебхука бота заявок Мастерской. Открыть в браузере после
// выкладки: https://jasur-portfolio-pied.vercel.app/api/workshop-bot/setup
//
// Что делает по порядку:
//   1. getMe: проверяет, что токен из WORKSHOP_BOT_TOKEN живой;
//   2. setWebhook: велит Telegram слать обновления на /api/workshop-bot с
//      секретом в заголовке;
//   3. setMyCommands: меню команд на русском и английском;
//   4. getWebhookInfo: что Telegram думает о вебхуке сейчас.
//
// Вызывать можно сколько угодно раз: адрес и секрет каждый раз те же.
// Токен в ответ не попадает. Telegram при этом ничего не теряет:
// обновления, накопившиеся до установки, остаются в очереди.

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Русское меню получают те же языки, которым бот задаёт вопросы по-русски.
const RU_MENU_LANGS = ["ru", "uk", "be", "kk", "uz"];

type Me = { username?: string };
type WebhookInfo = {
  url?: string;
  pending_update_count?: number;
  last_error_message?: string;
  last_error_date?: number;
};

export async function GET() {
  const token = process.env.WORKSHOP_BOT_TOKEN;
  if (!token) {
    return Response.json(
      {
        ok: false,
        error:
          "WORKSHOP_BOT_TOKEN is not set in this deployment. Add it in Vercel for Production and redeploy.",
      },
      { status: 500 }
    );
  }

  const me = await tg<Me>(token, "getMe");
  if (!me.ok) {
    return Response.json(
      {
        ok: false,
        getMe: "failed",
        description: me.description ?? null,
        hint: "The token in WORKSHOP_BOT_TOKEN is wrong or revoked.",
      },
      { status: 502 }
    );
  }

  const hook = await tg(token, "setWebhook", {
    url: WEBHOOK_URL,
    secret_token: webhookSecret(token),
    allowed_updates: ["message", "callback_query"],
  });

  const menus = [
    await tg(token, "setMyCommands", { commands: COMMANDS.en }),
    ...(await Promise.all(
      RU_MENU_LANGS.map((language_code) =>
        tg(token, "setMyCommands", { commands: COMMANDS.ru, language_code })
      )
    )),
  ];
  const adminId = await getAdminChatId();
  const adminMenu = adminId != null ? await setAdminCommands(token, adminId) : null;

  const info = await tg<WebhookInfo>(token, "getWebhookInfo");
  const wi = info.result ?? {};

  return Response.json({
    ok: hook.ok,
    bot: me.result?.username ?? null,
    getMe: "ok",
    setWebhook: hook.ok ? "ok" : hook.description ?? "failed",
    webhook: WEBHOOK_URL,
    setMyCommands: menus.every((m) => m.ok) ? "ok" : "failed",
    adminKnown: adminId != null,
    adminMenu: adminMenu == null ? "admin has not pressed /start yet" : adminMenu ? "ok" : "failed",
    url: wi.url ?? null,
    pending_update_count: wi.pending_update_count ?? null,
    last_error_message: wi.last_error_message ?? null,
    last_error_date: wi.last_error_date ? new Date(wi.last_error_date * 1000).toISOString() : null,
  });
}
