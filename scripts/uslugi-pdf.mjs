#!/usr/bin/env node
/* Сборка PDF «Услуги»: public/new/uslugi-ru.pdf и public/new/uslugi-en.pdf.

   Запуск из корня репозитория, одной командой:

     node scripts/uslugi-pdf.mjs

   Когда пересобирать: поменялись кадры демо (public/new/demos/*.jpg), их
   названия и описания (app/demos/list.ts), услуги и цены
   (app/uslugi/services.ts) или контакты (app/strings.ts). После
   пересборки закоммитить оба PDF и запушить.

   Что делает:
   1. Собирает сайт (npm run build). Пропустить: SKIP_BUILD=1, если сборка
      свежая.
   2. Поднимает собранный сайт (next start) на свободном порту.
   3. Ставит Playwright во временную папку вне проекта: package.json
      проекта не меняется, в node_modules ничего не попадает. Браузер берётся
      из общего кэша Playwright (~/Library/Caches/ms-playwright), если его
      там нет, скачивается туда же.
   4. Открывает /uslugi/ru и /uslugi/en, ждёт шрифты и картинки и
      печатает каждую страницу в PDF: лист 1280 × 720 точек (16:9), поля
      нулевые, фон печатается.
   5. Гасит сервер и удаляет временную папку с Playwright.

   Переменные:
     BASE=http://localhost:3000   печатать с уже запущенного сервера, без
                                  сборки и без своего next start;
     ROUTE=/uslugi                путь к исходнику, если он переехал (после
                                  переноса макета на главную будет /uslugi).

   Нужен Node 20+ (fetch встроен). */

import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, statSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { createServer } from "node:net";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "new");
const ROUTE = process.env.ROUTE || "/uslugi";
const LANGS = ["ru", "en"];
/* Версия закреплена: 1.63.0 работает со сборкой браузера 1243, которая уже
   лежит в кэше. Новая версия потянула бы новый браузер на 100+ МБ. */
const PLAYWRIGHT = "playwright@1.63.0";
const MAX_BYTES = 3 * 1024 * 1024;

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function log(msg) {
  console.log(`[uslugi] ${msg}`);
}

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.once("error", reject);
    srv.listen(0, () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

async function waitFor(url, ms = 60000) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      // сервер ещё поднимается
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Сервер не ответил за ${ms / 1000} с: ${url}`);
}

async function main() {
  let base = process.env.BASE;
  let server = null;
  const pwDir = mkdtempSync(join(tmpdir(), "uslugi-pw-"));

  try {
    if (!base) {
      if (process.env.SKIP_BUILD !== "1") {
        log("сборка сайта: npm run build");
        execFileSync(npm, ["run", "build"], { cwd: ROOT, stdio: "inherit" });
      }
      const port = await freePort();
      base = `http://localhost:${port}`;
      log(`next start на ${base}`);
      server = spawn(join(ROOT, "node_modules", ".bin", "next"), ["start", "-p", String(port)], {
        cwd: ROOT,
        stdio: ["ignore", "ignore", "inherit"],
      });
    }
    await waitFor(`${base}${ROUTE}/ru`);

    log(`Playwright во временную папку ${pwDir}`);
    execFileSync(npm, ["install", "--no-save", "--no-audit", "--no-fund", "--silent", PLAYWRIGHT], {
      cwd: pwDir,
      stdio: "inherit",
    });
    const require = createRequire(join(pwDir, "package.json"));
    execFileSync(process.execPath, [join(pwDir, "node_modules", "playwright", "cli.js"), "install", "chromium-headless-shell"], {
      stdio: "inherit",
    });
    const { chromium } = require("playwright");

    const browser = await chromium.launch();
    try {
      mkdirSync(OUT, { recursive: true });
      for (const lang of LANGS) {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
        const page = await ctx.newPage();
        // Счётчик посещений и аналитика Vercel: печать документа не визит.
        await page.route(/\/api\/hit|\/_vercel\//, (r) => r.abort());
        const url = `${base}${ROUTE}/${lang}`;
        const res = await page.goto(url, { waitUntil: "networkidle" });
        if (!res || !res.ok()) throw new Error(`${url} ответил ${res ? res.status() : "ничем"}`);

        // Шрифты и все картинки должны быть на месте до печати: битая
        // картинка в PDF превратилась бы в серую заглушку.
        await page.evaluate(async () => {
          await document.fonts.ready;
          const imgs = [...document.images];
          await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => i.addEventListener("load", r, { once: true })))));
          const broken = imgs.filter((i) => i.naturalWidth === 0).map((i) => i.src);
          if (broken.length) throw new Error(`не загрузились картинки: ${broken.join(", ")}`);
          if (document.querySelector(".nm-ph-note")) throw new Error("на странице заглушка вместо картинки");
        });

        const file = join(OUT, `uslugi-${lang}.pdf`);
        await page.pdf({
          path: file,
          width: "1280px",
          height: "720px",
          margin: { top: "0", right: "0", bottom: "0", left: "0" },
          printBackground: true,
        });
        const size = statSync(file).size;
        log(`${file.replace(ROOT + "/", "")}: ${(size / 1024).toFixed(0)} КБ`);
        if (size > MAX_BYTES) throw new Error(`${file} больше 3 МБ`);
        await ctx.close();
      }
    } finally {
      await browser.close();
    }
  } finally {
    if (server) server.kill();
    rmSync(pwDir, { recursive: true, force: true });
  }
  log("готово");
}

main().catch((e) => {
  console.error(`[uslugi] ошибка: ${e.message}`);
  process.exit(1);
});
