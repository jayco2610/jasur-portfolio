---
title: "The best thing my assistant can do is say “I don't know”"
date: "2026-09-14"
description: "In a clinic, a neural network that answers everything is more dangerous than one that sometimes stays silent. Two of my own systems, and where the machine is supposed to stop."
lang: "en"
rubric: "ai"
cover: "/blog/i-dont-know.jpg"
ogImage: "/og-i-dont-know.jpg"
tags: ["AI", "Assistants"]
translation: "ne-znayu"
draft: false
---

## The confident intern

The most unpleasant thing about a language model isn't stupidity, it's confidence. Ask, and it answers. It doesn't know, and it answers anyway, in the same even voice. A model tells the truth and talks complete shit with exactly the same calm, and you can't tell them apart by the tone.

People call it hallucination. The word is far too gentle. In plain terms it's lying without malice.

Picture an intern. Polite, fast, never says "I don't know". The first week everyone loves him. In the second he quotes a client a price he made up himself, and for some reason you're the one who has to answer for it.

## What happens when that intern works in a clinic

A patient writes in the chat: how much is a cleaning, does an implant hurt, are you open on Sundays. A model with no limits will answer all three. Beautifully, confidently and possibly wrong.

A wrong price means a scene at the reception desk. "Open on Sundays" means a person who drove to a locked door. A wrong "it doesn't hurt" is worse still.

**Every answer like that costs the clinic money and trust, and costs the model nothing.**

## How Mia works

[Mia](https://jasur-portfolio-pied.vercel.app/demos/mia) is an assistant for a dental clinic. She has one rule: answer only from the clinic's documents. The price list, the service descriptions, the doctors' schedule, patients' frequent questions. Nothing of her own.

Under every answer there's a source: "Price list, page 2". The receptionist opens it and checks in five seconds.

And the main thing. If the documents don't have the answer, Mia says so. She doesn't guess, doesn't write "most likely", she honestly declines and sends you to a living person.

## "I don't know" sells badly

In a demo it looks weaker than you'd like. Someone came for a magic box, and the box says "that's not in the documents".

The market sells the opposite. Every other pitch deck has an assistant that answers any question. Nobody makes a slide that says "and here it honestly kept quiet".

The difference comes down to one question: who's responsible when it's wrong. Nobody is going to call the model into court.

## The same logic in my own system

[My job search system](https://jasur-portfolio-pied.vercel.app/demos/career) takes a vacancy link and produces a cover letter in eighty seconds. Forty-seven vacancies.

Not one letter went out on its own. Each one waits in Telegram until I read it and press the button.

That step could be removed, and the system would become "fully automatic", which sounds nicer. I'm not removing it. The letter goes out in my name, and if it says something wrong, I'm the one who'll be embarrassed.

**The machine writes. A person sends.**

## Where the line runs

A rule I use myself. Let the machine work where a mistake is visible and cheap to fix: a draft, a summary, a search through documents, a first read. And let it stop where a mistake goes out into the world under your name: an answer to a client, a price, a diagnosis, a letter, money.

A good sign of a system: you can say exactly where it will stop. If you can't, it will stop on its own, at the worst possible moment and without warning.

## Three questions for whoever is selling you an assistant

**Where does it get its answer.** If you hear "it's smart, it'll figure it out", you can stop listening.

**Can it show the source of every answer.** Not "from your documents in general", but a specific file and a specific place.

**What does it say when there's no answer.** Ask them to show you right there in the meeting. Ask a question you know for certain isn't in your documents.

If it answered cheerfully, congratulations: you've just watched how it will lie to your clients.
