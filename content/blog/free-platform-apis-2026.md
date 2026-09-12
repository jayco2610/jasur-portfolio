---
title: "Which platforms you can actually automate for free in 2026"
date: "2026-09-10"
description: "I wanted one window to post everywhere from. Checked ten platforms against their own docs. Half of them drop out, not over price, but because there is nothing to connect to."
lang: "en"
rubric: "ai"
cover: "/blog/api-ploshchadok.jpg"
tags: ["Automation", "Content", "API"]
translation: "besplatnye-api-ploshchadok-2026"
draft: false
---

I am building myself a personal admin panel: one window where I write a piece and send it everywhere at once. Before building anything I checked what is technically possible for free. Below is the result for ten platforms, verified on 10 September 2026.

Short version: out of ten platforms, five can be posted to automatically, four give back numbers, and the single most valuable platform for me cannot be automated at all.

## What works for free

**Telegram.** [Bot API](https://core.telegram.org/bots/api), simple, you add the bot as a channel admin. Posting has no limits. Numbers are worse: a bot does not get post views, and full channel stats need separate access from an admin account.

**VK, community page.** [Posting](https://dev.vk.com/ru/method/wall.post) works, per-post views and follower count come back normally. A personal page cannot do this, it needs a user token.

**LinkedIn.** The [posting permission](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api) is granted without manual review. But their API terms of use say plainly that automated posting is not allowed. So technically you can, formally you are in a grey zone. There is no free post analytics.

**Threads.** [Free](https://developers.facebook.com/docs/threads), up to 250 posts a day, and it returns numbers: views, likes, replies, followers. Meta has to verify your app, expect about a week of waiting.

**YouTube.** A free quota of 10,000 units a day, one video upload costs 1,600, so roughly six videos a day. [Analytics](https://developers.google.com/youtube/v3/determine_quota_cost) for your own channel is free too. One catch: while the app is in test mode, access expires every seven days, you have to move it to production.

## What does not work

**X.** Since 6 February 2026 [there is no free tier](https://docs.x.com/x-api/introduction). Now you pay per call: around one and a half cents per post, half a cent per read. For a personal blog that is pocket change, but it breaks the "free only" rule.

![Work a machine cannot take off your hands, you carry yourself](/blog/ruchnoy-trud.jpg)

**VC.ru, Habr, Medium, Dzen.** Not one of them has a public posting interface. [Medium](https://github.com/Medium/medium-api-docs) stopped handing out access back in 2023. Habr exposes reading only. Dzen opens import to partners, not to a regular author.

This is the painful part. My best text ever came out on VC.ru and collected nineteen thousand interactions. That is exactly the platform I cannot connect.

## Aggregators do not save you

I checked the free tiers of [Buffer](https://buffer.com/pricing), Publer and [SMMplanner](https://smmplanner.com/). All three have the same hole: no Russian-language article platforms. Buffer does neither VK nor Telegram. Publer dropped analytics from its free tier. SMMplanner comes closest, it has VK, Telegram and Dzen, but VC.ru, Habr and Medium are covered by nobody.

## What I will build out of this

The publishing section of the admin panel will be split in two.

Telegram, VK and LinkedIn go out automatically. Threads and YouTube come in a second pass, after verification.

For VC.ru, Habr, Medium and Dzen there will be no publish button, there is nothing to wire it to. Instead there will be a screen with the text already shaped for that platform, a copy button and a "published" checkbox. Two minutes by hand instead of imaginary automation.

Same honesty with the numbers: Telegram, VK, Threads and YouTube report themselves, LinkedIn and the article platforms I enter by hand once a week. A dashboard pretending to pull everything on its own would be lying to me.

![One window for everything that can actually be sent automatically](/blog/odno-okno.jpg)

Read the docs before you build. I set out to automate five platforms and I am automating three.
