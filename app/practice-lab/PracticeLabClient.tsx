"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

type Question = {
  id: string
  sentence: string
  options: string[]
  answer: string
  hint: string
}

type Category = {
  key: string
  title: string
  effect: string
  questions: Question[]
}

const CATEGORIES: Category[] = [
  {
    key: "off",
    title: "Off",
    effect: "Off often signals separation, cancellation, or stopping.",
    questions: [
      {
        id: "off-1",
        sentence: "I finally ____ the meeting because I was sick.",
        options: ["called off", "put off", "took off", "kept off"],
        answer: "called off",
        hint: "To cancel something that was planned.",
      },
      {
        id: "off-2",
        sentence: "Please ____ your shoes before you come in.",
        options: ["take off", "turn off", "cut off", "pay off"],
        answer: "take off",
        hint: "To remove clothing or accessories.",
      },
      {
        id: "off-3",
        sentence: "The noise really ____ me off during the call.",
        options: ["threw off", "set off", "let off", "got off"],
        answer: "threw off",
        hint: "To confuse or disrupt your focus.",
      },
      {
        id: "off-4",
        sentence: "We had to ____ the alarm because it was too loud.",
        options: ["turn off", "show off", "drop off", "hand off"],
        answer: "turn off",
        hint: "To stop something from running.",
      },
      {
        id: "off-5",
        sentence: "He decided to ____ the project until next month.",
        options: ["put off", "set off", "take off", "break off"],
        answer: "put off",
        hint: "To postpone or delay.",
      },
      {
        id: "off-6",
        sentence: "She will ____ the kids at school on her way.",
        options: ["drop off", "back off", "hold off", "pay off"],
        answer: "drop off",
        hint: "To leave someone at a place.",
      },
      {
        id: "off-7",
        sentence: "Please ____ the light when you leave.",
        options: ["switch off", "show off", "walk off", "write off"],
        answer: "switch off",
        hint: "To turn something off.",
      },
      {
        id: "off-8",
        sentence: "The boss told him to ____ during the meeting.",
        options: ["back off", "hand off", "kick off", "run off"],
        answer: "back off",
        hint: "To stop pressuring or step away.",
      },
      {
        id: "off-9",
        sentence: "Let's ____ the event with a short welcome.",
        options: ["kick off", "put off", "hand off", "turn off"],
        answer: "kick off",
        hint: "To start something.",
      },
      {
        id: "off-10",
        sentence: "She loves to ____ her new phone.",
        options: ["show off", "set off", "take off", "sign off"],
        answer: "show off",
        hint: "To display something proudly.",
      },
      {
        id: "off-11",
        sentence: "He finally ____ his credit card debt.",
        options: ["paid off", "cut off", "took off", "held off"],
        answer: "paid off",
        hint: "To finish paying a debt.",
      },
      {
        id: "off-12",
        sentence: "The dog ____ as soon as the gate opened.",
        options: ["ran off", "set off", "laid off", "turned off"],
        answer: "ran off",
        hint: "To run away quickly.",
      },
      {
        id: "off-13",
        sentence: "I need to ____ from work early today.",
        options: ["take off", "set off", "put off", "pay off"],
        answer: "take off",
        hint: "To leave or be absent from work.",
      },
      {
        id: "off-14",
        sentence: "Please ____ the forms to Maria.",
        options: ["hand off", "drop off", "log off", "show off"],
        answer: "hand off",
        hint: "To pass something to another person.",
      },
      {
        id: "off-15",
        sentence: "The system will ____ after 10 minutes of inactivity.",
        options: ["log off", "lay off", "hold off", "turn off"],
        answer: "log off",
        hint: "To sign out of a system.",
      },
      {
        id: "off-16",
        sentence: "The alarm ____ in the middle of the night.",
        options: ["went off", "put off", "cut off", "back off"],
        answer: "went off",
        hint: "To start ringing or making noise.",
      },
      {
        id: "off-17",
        sentence: "She was ____ from her job last week.",
        options: ["laid off", "paid off", "showed off", "took off"],
        answer: "laid off",
        hint: "To lose a job due to cuts.",
      },
      {
        id: "off-18",
        sentence: "He tried to ____ the old sticker from the window.",
        options: ["tear off", "turn off", "show off", "hand off"],
        answer: "tear off",
        hint: "To remove by pulling.",
      },
      {
        id: "off-19",
        sentence: "Let's ____ on ordering until everyone arrives.",
        options: ["hold off", "call off", "take off", "set off"],
        answer: "hold off",
        hint: "To wait or delay.",
      },
      {
        id: "off-20",
        sentence: "The company will ____ its unused assets.",
        options: ["sell off", "put off", "turn off", "show off"],
        answer: "sell off",
        hint: "To sell something quickly or in large amounts.",
      },
      {
        id: "off-21",
        sentence: "He tried to ____ the broken handle.",
        options: ["snap off", "turn off", "call off", "run off"],
        answer: "snap off",
        hint: "To break something off quickly.",
      },
      {
        id: "off-22",
        sentence: "She ____ the spilled coffee.",
        options: ["wiped off", "took off", "got off", "set off"],
        answer: "wiped off",
        hint: "To remove by wiping.",
      },
      {
        id: "off-23",
        sentence: "Please ____ the list.",
        options: ["cross off", "put off", "turn off", "sign off"],
        answer: "cross off",
        hint: "To mark an item as done.",
      },
      {
        id: "off-24",
        sentence: "They decided to ____ the old paint.",
        options: ["strip off", "take off", "call off", "set off"],
        answer: "strip off",
        hint: "To remove a layer or covering.",
      },
      {
        id: "off-25",
        sentence: "He ____ the dirt from his shoes.",
        options: ["brushed off", "ran off", "set off", "held off"],
        answer: "brushed off",
        hint: "To remove by brushing.",
      },
      {
        id: "off-26",
        sentence: "She ____ the offer politely.",
        options: ["turned down", "shut off", "broke off", "set off"],
        answer: "turned down",
        hint: "To refuse.",
      },
      {
        id: "off-27",
        sentence: "The team ____ a strong start.",
        options: ["kicked off", "set off", "took off", "ran off"],
        answer: "kicked off",
        hint: "To begin.",
      },
      {
        id: "off-28",
        sentence: "He ____ early from work.",
        options: ["signed off", "showed off", "set off", "ran off"],
        answer: "signed off",
        hint: "To finish or end work.",
      },
      {
        id: "off-29",
        sentence: "She ____ the call with a goodbye.",
        options: ["signed off", "took off", "paid off", "held off"],
        answer: "signed off",
        hint: "To end a message.",
      },
      {
        id: "off-30",
        sentence: "He ____ his friend with a joke.",
        options: ["wound up", "set off", "cheered up", "threw off"],
        answer: "wound up",
        hint: "To tease or upset someone.",
      },
    ],
  },
  {
    key: "up",
    title: "Up",
    effect: "Up often adds completion, intensity, or making something ready.",
    questions: [
      {
        id: "up-1",
        sentence: "We need to ____ a time to meet next week.",
        options: ["set up", "break up", "look up", "make up"],
        answer: "set up",
        hint: "To arrange or plan something.",
      },
      {
        id: "up-2",
        sentence: "Can you ____ me up from the station?",
        options: ["pick up", "pull up", "speed up", "catch up"],
        answer: "pick up",
        hint: "To collect someone by car.",
      },
      {
        id: "up-3",
        sentence: "She ____ a great point during lunch.",
        options: ["brought up", "gave up", "took up", "held up"],
        answer: "brought up",
        hint: "To mention a topic in conversation.",
      },
      {
        id: "up-4",
        sentence: "Please ____ the mess after the party.",
        options: ["clean up", "set up", "line up", "break up"],
        answer: "clean up",
        hint: "To make a place tidy.",
      },
      {
        id: "up-5",
        sentence: "I need to ____ with her about the changes.",
        options: ["follow up", "show up", "wake up", "take up"],
        answer: "follow up",
        hint: "To check or continue after a first contact.",
      },
      {
        id: "up-6",
        sentence: "He ____ late and missed the bus.",
        options: ["woke up", "set up", "picked up", "gave up"],
        answer: "woke up",
        hint: "To stop sleeping.",
      },
      {
        id: "up-7",
        sentence: "She tried to ____ for being late.",
        options: ["make up", "take up", "hold up", "dress up"],
        answer: "make up",
        hint: "To compensate for something.",
      },
      {
        id: "up-8",
        sentence: "A taxi ____ outside the building.",
        options: ["pulled up", "broke up", "ran up", "set up"],
        answer: "pulled up",
        hint: "To arrive by car and stop.",
      },
      {
        id: "up-9",
        sentence: "Let's ____ the word in the dictionary.",
        options: ["look up", "bring up", "call up", "heat up"],
        answer: "look up",
        hint: "To search for information.",
      },
      {
        id: "up-10",
        sentence: "They decided to ____ a small business.",
        options: ["start up", "pick up", "turn up", "step up"],
        answer: "start up",
        hint: "To begin a business or system.",
      },
      {
        id: "up-11",
        sentence: "You can ____ for the class online.",
        options: ["sign up", "add up", "show up", "mix up"],
        answer: "sign up",
        hint: "To register or enroll.",
      },
      {
        id: "up-12",
        sentence: "He needs to ____ his English before the interview.",
        options: ["brush up", "dress up", "hold up", "set up"],
        answer: "brush up",
        hint: "To improve a skill quickly.",
      },
      {
        id: "up-13",
        sentence: "They had to ____ the meeting to 2 pm.",
        options: ["move up", "pick up", "turn up", "hold up"],
        answer: "move up",
        hint: "To reschedule to an earlier time.",
      },
      {
        id: "up-14",
        sentence: "Everyone ____ to clap.",
        options: ["stood up", "gave up", "brought up", "set up"],
        answer: "stood up",
        hint: "To rise to your feet.",
      },
      {
        id: "up-15",
        sentence: "Let's ____ before the game.",
        options: ["warm up", "wake up", "wrap up", "hold up"],
        answer: "warm up",
        hint: "To prepare your body.",
      },
      {
        id: "up-16",
        sentence: "I always ____ my files to the cloud.",
        options: ["back up", "check up", "line up", "pick up"],
        answer: "back up",
        hint: "To make a copy for safety.",
      },
      {
        id: "up-17",
        sentence: "He ____ after hearing the good news.",
        options: ["cheered up", "caught up", "kept up", "held up"],
        answer: "cheered up",
        hint: "To become happier.",
      },
      {
        id: "up-18",
        sentence: "People ____ outside the store.",
        options: ["lined up", "set up", "made up", "ran up"],
        answer: "lined up",
        hint: "To form a queue.",
      },
      {
        id: "up-19",
        sentence: "He ____ the main points at the end.",
        options: ["summed up", "took up", "brought up", "showed up"],
        answer: "summed up",
        hint: "To give a short summary.",
      },
      {
        id: "up-20",
        sentence: "I need to ____ after dinner.",
        options: ["wash up", "dress up", "turn up", "hold up"],
        answer: "wash up",
        hint: "To wash dishes or clean yourself.",
      },
      {
        id: "up-21",
        sentence: "She ____ the meeting on time.",
        options: ["wrapped up", "set up", "backed up", "picked up"],
        answer: "wrapped up",
        hint: "To finish or conclude.",
      },
      {
        id: "up-22",
        sentence: "He ____ the chair for his mom.",
        options: ["pulled up", "set up", "held up", "took up"],
        answer: "pulled up",
        hint: "To move a seat closer.",
      },
      {
        id: "up-23",
        sentence: "We ____ the volume.",
        options: ["turned up", "picked up", "took up", "held up"],
        answer: "turned up",
        hint: "To increase.",
      },
      {
        id: "up-24",
        sentence: "She ____ the file on her laptop.",
        options: ["opened up", "set up", "took up", "held up"],
        answer: "opened up",
        hint: "To open.",
      },
      {
        id: "up-25",
        sentence: "He ____ his room before guests arrived.",
        options: ["tidied up", "set up", "picked up", "kept up"],
        answer: "tidied up",
        hint: "To make neat.",
      },
      {
        id: "up-26",
        sentence: "She ____ the phone call.",
        options: ["picked up", "took up", "set up", "held up"],
        answer: "picked up",
        hint: "To answer a call.",
      },
      {
        id: "up-27",
        sentence: "We ____ the mistake quickly.",
        options: ["fixed up", "made up", "took up", "set up"],
        answer: "fixed up",
        hint: "To repair or improve.",
      },
      {
        id: "up-28",
        sentence: "She ____ the topic again.",
        options: ["brought up", "held up", "took up", "turned up"],
        answer: "brought up",
        hint: "To mention.",
      },
      {
        id: "up-29",
        sentence: "He ____ at the wrong time.",
        options: ["showed up", "set up", "took up", "held up"],
        answer: "showed up",
        hint: "To arrive.",
      },
      {
        id: "up-30",
        sentence: "We ____ new chairs for the office.",
        options: ["picked up", "set up", "took up", "held up"],
        answer: "picked up",
        hint: "To buy or collect.",
      },
    ],
  },
  {
    key: "down",
    title: "Down",
    effect: "Down often signals reduction, slowing, or recording.",
    questions: [
      {
        id: "down-1",
        sentence: "Please ____ the music; I am on a call.",
        options: ["turn down", "bring down", "pull down", "knock down"],
        answer: "turn down",
        hint: "To reduce volume or intensity.",
      },
      {
        id: "down-2",
        sentence: "He ____ his thoughts in a notebook.",
        options: ["wrote down", "brought down", "laid down", "cut down"],
        answer: "wrote down",
        hint: "To record something in writing.",
      },
      {
        id: "down-3",
        sentence: "The server ____ at midnight.",
        options: ["went down", "fell down", "put down", "took down"],
        answer: "went down",
        hint: "To stop working or go offline.",
      },
      {
        id: "down-4",
        sentence: "Please ____ your voice in the library.",
        options: ["keep down", "bring down", "sit down", "set down"],
        answer: "keep down",
        hint: "To keep something low or controlled.",
      },
      {
        id: "down-5",
        sentence: "The room finally ____ once the baby fell asleep.",
        options: ["quieted down", "shut down", "took down", "held down"],
        answer: "quieted down",
        hint: "To become calmer or quieter.",
      },
      {
        id: "down-6",
        sentence: "He ____ the job offer because the salary was low.",
        options: ["turned down", "fell down", "set down", "laid down"],
        answer: "turned down",
        hint: "To refuse an offer.",
      },
      {
        id: "down-7",
        sentence: "The company will ____ on costs this year.",
        options: ["cut down", "shut down", "step down", "slow down"],
        answer: "cut down",
        hint: "To reduce or decrease.",
      },
      {
        id: "down-8",
        sentence: "Please ____ the computer before you leave.",
        options: ["shut down", "turn down", "break down", "sit down"],
        answer: "shut down",
        hint: "To turn off a machine.",
      },
      {
        id: "down-9",
        sentence: "The car ____ on the highway.",
        options: ["broke down", "knocked down", "put down", "got down"],
        answer: "broke down",
        hint: "To stop working due to a problem.",
      },
      {
        id: "down-10",
        sentence: "Please ____ while I explain.",
        options: ["sit down", "back down", "bring down", "hold down"],
        answer: "sit down",
        hint: "To take a seat.",
      },
      {
        id: "down-11",
        sentence: "He ____ after the argument.",
        options: ["calmed down", "brought down", "cut down", "turned down"],
        answer: "calmed down",
        hint: "To become less upset.",
      },
      {
        id: "down-12",
        sentence: "They plan to ____ the old building.",
        options: ["tear down", "hand down", "hold down", "bring down"],
        answer: "tear down",
        hint: "To demolish or remove a structure.",
      },
      {
        id: "down-13",
        sentence: "Please ____ your criticism; it sounds too harsh.",
        options: ["tone down", "break down", "shut down", "set down"],
        answer: "tone down",
        hint: "To make something less intense.",
      },
      {
        id: "down-14",
        sentence: "Please ____ your phone number.",
        options: ["jot down", "cut down", "turn down", "take down"],
        answer: "jot down",
        hint: "To write something quickly.",
      },
      {
        id: "down-15",
        sentence: "He refused to ____ during the debate.",
        options: ["back down", "sit down", "look down", "step down"],
        answer: "back down",
        hint: "To withdraw from a position.",
      },
      {
        id: "down-16",
        sentence: "The boss will ____ the rules for the team.",
        options: ["lay down", "hold down", "cut down", "turn down"],
        answer: "lay down",
        hint: "To establish or set rules.",
      },
      {
        id: "down-17",
        sentence: "These recipes were ____ through the family.",
        options: ["handed down", "turned down", "set down", "brought down"],
        answer: "handed down",
        hint: "To pass from older to younger.",
      },
      {
        id: "down-18",
        sentence: "The police worked to ____ the suspect.",
        options: ["track down", "bring down", "push down", "carry down"],
        answer: "track down",
        hint: "To find someone after a search.",
      },
      {
        id: "down-19",
        sentence: "We need to ____ the volume on the TV.",
        options: ["dial down", "turn down", "hand down", "take down"],
        answer: "dial down",
        hint: "To reduce a setting.",
      },
      {
        id: "down-20",
        sentence: "They ____ the building after the alert.",
        options: ["locked down", "slowed down", "sat down", "laid down"],
        answer: "locked down",
        hint: "To secure and restrict access.",
      },
    ],
  },
  {
    key: "out",
    title: "Out",
    effect: "Out often means completion, discovery, or moving outward.",
    questions: [
      {
        id: "out-1",
        sentence: "We should ____ the plan before we start.",
        options: ["work out", "hand out", "set out", "take out"],
        answer: "work out",
        hint: "To solve or figure out a problem.",
      },
      {
        id: "out-2",
        sentence: "I cannot ____ the password.",
        options: ["figure out", "give out", "hold out", "pick out"],
        answer: "figure out",
        hint: "To understand or discover the answer.",
      },
      {
        id: "out-3",
        sentence: "Let's ____ for dinner tonight.",
        options: ["eat out", "run out", "watch out", "clean out"],
        answer: "eat out",
        hint: "To have a meal at a restaurant.",
      },
      {
        id: "out-4",
        sentence: "We just ____ of milk.",
        options: ["ran out", "set out", "gave out", "put out"],
        answer: "ran out",
        hint: "To have no more of something.",
      },
      {
        id: "out-5",
        sentence: "Please ____ of the hotel by 11.",
        options: ["check out", "walk out", "hang out", "look out"],
        answer: "check out",
        hint: "To leave a hotel and return the key.",
      },
      {
        id: "out-6",
        sentence: "I finally ____ the truth.",
        options: ["found out", "put out", "set out", "broke out"],
        answer: "found out",
        hint: "To discover information.",
      },
      {
        id: "out-7",
        sentence: "She ____ the mistake during the review.",
        options: ["pointed out", "called out", "took out", "wore out"],
        answer: "pointed out",
        hint: "To draw attention to something.",
      },
      {
        id: "out-8",
        sentence: "They ____ the plan exactly as agreed.",
        options: ["carried out", "put out", "set out", "threw out"],
        answer: "carried out",
        hint: "To complete or execute a plan.",
      },
      {
        id: "out-9",
        sentence: "We ____ early in the morning.",
        options: ["set out", "brought out", "looked out", "held out"],
        answer: "set out",
        hint: "To begin a journey.",
      },
      {
        id: "out-10",
        sentence: "Firefighters ____ the fire quickly.",
        options: ["put out", "worked out", "figured out", "cut out"],
        answer: "put out",
        hint: "To extinguish something burning.",
      },
      {
        id: "out-11",
        sentence: "She ____ the trash after dinner.",
        options: ["took out", "brought out", "wore out", "gave out"],
        answer: "took out",
        hint: "To remove and carry outside.",
      },
      {
        id: "out-12",
        sentence: "We ____ at the cafe every Saturday.",
        options: ["hang out", "break out", "set out", "find out"],
        answer: "hang out",
        hint: "To spend time casually.",
      },
      {
        id: "out-13",
        sentence: "He ____ of college after one semester.",
        options: ["dropped out", "ruled out", "brought out", "filled out"],
        answer: "dropped out",
        hint: "To leave a course or program.",
      },
      {
        id: "out-14",
        sentence: "They will ____ the new update tomorrow.",
        options: ["roll out", "set out", "run out", "check out"],
        answer: "roll out",
        hint: "To release or introduce.",
      },
      {
        id: "out-15",
        sentence: "Can you ____ the chairs for the meeting?",
        options: ["bring out", "take out", "put out", "point out"],
        answer: "bring out",
        hint: "To bring something from inside.",
      },
      {
        id: "out-16",
        sentence: "The coach ____ the team for their mistakes.",
        options: ["called out", "brought out", "put out", "held out"],
        answer: "called out",
        hint: "To criticize or single out.",
      },
      {
        id: "out-17",
        sentence: "Everything ____ fine in the end.",
        options: ["turned out", "worked out", "set out", "took out"],
        answer: "turned out",
        hint: "To result or end in a certain way.",
      },
      {
        id: "out-18",
        sentence: "These shoes are completely ____.",
        options: ["worn out", "filled out", "checked out", "held out"],
        answer: "worn out",
        hint: "To be used until old or damaged.",
      },
      {
        id: "out-19",
        sentence: "Please ____ the application form.",
        options: ["fill out", "work out", "point out", "set out"],
        answer: "fill out",
        hint: "To complete a form with information.",
      },
      {
        id: "out-20",
        sentence: "They ____ that option immediately.",
        options: ["ruled out", "carried out", "put out", "took out"],
        answer: "ruled out",
        hint: "To eliminate from consideration.",
      },
      {
        id: "out-21",
        sentence: "She ____ a new dress for the party.",
        options: ["picked out", "ran out", "worked out", "put out"],
        answer: "picked out",
        hint: "To choose.",
      },
      {
        id: "out-22",
        sentence: "He ____ the candles.",
        options: ["blew out", "worked out", "took out", "set out"],
        answer: "blew out",
        hint: "To extinguish.",
      },
      {
        id: "out-23",
        sentence: "We ____ the details yesterday.",
        options: ["worked out", "put out", "ran out", "set out"],
        answer: "worked out",
        hint: "To solve.",
      },
      {
        id: "out-24",
        sentence: "She ____ her phone during the trip.",
        options: ["lost out", "ran out", "took out", "wore out"],
        answer: "lost out",
        hint: "To miss an opportunity.",
      },
      {
        id: "out-25",
        sentence: "He ____ his voice.",
        options: ["called out", "worked out", "put out", "set out"],
        answer: "called out",
        hint: "To speak loudly.",
      },
      {
        id: "out-26",
        sentence: "She ____ after the long hike.",
        options: ["passed out", "ran out", "wore out", "took out"],
        answer: "passed out",
        hint: "To faint.",
      },
      {
        id: "out-27",
        sentence: "We ____ the old furniture.",
        options: ["threw out", "worked out", "set out", "put out"],
        answer: "threw out",
        hint: "To discard.",
      },
      {
        id: "out-28",
        sentence: "She ____ the answers at the end.",
        options: ["handed out", "worked out", "ran out", "took out"],
        answer: "handed out",
        hint: "To distribute.",
      },
      {
        id: "out-29",
        sentence: "He ____ the best in his team.",
        options: ["brought out", "ran out", "put out", "set out"],
        answer: "brought out",
        hint: "To reveal or highlight.",
      },
      {
        id: "out-30",
        sentence: "We ____ the tools.",
        options: ["laid out", "ran out", "put out", "took out"],
        answer: "laid out",
        hint: "To arrange neatly.",
      },
    ],
  },
  {
    key: "in",
    title: "In",
    effect: "In often signals inclusion, arrival, or participation.",
    questions: [
      {
        id: "in-1",
        sentence: "Please ____ before you leave the office.",
        options: ["check in", "drop in", "bring in", "log in"],
        answer: "check in",
        hint: "To report or register your status.",
      },
      {
        id: "in-2",
        sentence: "We need to ____ the details on the form.",
        options: ["fill in", "cut in", "break in", "take in"],
        answer: "fill in",
        hint: "To complete missing information.",
      },
      {
        id: "in-3",
        sentence: "She ____ during the meeting with a helpful idea.",
        options: ["chimed in", "moved in", "turned in", "signed in"],
        answer: "chimed in",
        hint: "To add a quick comment to a conversation.",
      },
      {
        id: "in-4",
        sentence: "Feel free to ____ later this afternoon.",
        options: ["drop in", "turn in", "log in", "bring in"],
        answer: "drop in",
        hint: "To visit briefly without an appointment.",
      },
      {
        id: "in-5",
        sentence: "Please ____ your phone before the flight.",
        options: ["plug in", "check in", "cut in", "sign in"],
        answer: "plug in",
        hint: "To connect to a power source.",
      },
      {
        id: "in-6",
        sentence: "He ____ his homework on time.",
        options: ["turned in", "took in", "brought in", "checked in"],
        answer: "turned in",
        hint: "To submit work.",
      },
      {
        id: "in-7",
        sentence: "We ____ a new designer for the project.",
        options: ["brought in", "cut in", "filled in", "joined in"],
        answer: "brought in",
        hint: "To hire or include someone new.",
      },
      {
        id: "in-8",
        sentence: "He opened the door to ____ the dog.",
        options: ["let in", "drop in", "log in", "hand in"],
        answer: "let in",
        hint: "To allow someone to enter.",
      },
      {
        id: "in-9",
        sentence: "I need to ____ to the website.",
        options: ["log in", "call in", "tune in", "turn in"],
        answer: "log in",
        hint: "To access a system with credentials.",
      },
      {
        id: "in-10",
        sentence: "Everyone ____ the song at the end.",
        options: ["joined in", "checked in", "cut in", "filled in"],
        answer: "joined in",
        hint: "To participate together.",
      },
      {
        id: "in-11",
        sentence: "She ____ the meeting to take notes.",
        options: ["sat in", "moved in", "turned in", "signed in"],
        answer: "sat in",
        hint: "To attend as an observer.",
      },
      {
        id: "in-12",
        sentence: "He ____ to help when the manager was out.",
        options: ["stepped in", "dropped in", "plugged in", "checked in"],
        answer: "stepped in",
        hint: "To take over or help in a situation.",
      },
      {
        id: "in-13",
        sentence: "We had to ____ extra staff for the event.",
        options: ["call in", "log in", "turn in", "let in"],
        answer: "call in",
        hint: "To request someone to come to work.",
      },
      {
        id: "in-14",
        sentence: "Can everyone ____ for the gift?",
        options: ["chip in", "cut in", "drop in", "sign in"],
        answer: "chip in",
        hint: "To contribute money or help.",
      },
      {
        id: "in-15",
        sentence: "He ____ while she was speaking.",
        options: ["cut in", "join in", "fill in", "check in"],
        answer: "cut in",
        hint: "To interrupt a conversation.",
      },
      {
        id: "in-16",
        sentence: "Please ____ your assignment by Friday.",
        options: ["hand in", "call in", "plug in", "turn in"],
        answer: "hand in",
        hint: "To submit work to a teacher or boss.",
      },
      {
        id: "in-17",
        sentence: "They ____ last weekend.",
        options: ["moved in", "checked in", "signed in", "brought in"],
        answer: "moved in",
        hint: "To start living in a new place.",
      },
      {
        id: "in-18",
        sentence: "I could not ____ all the information.",
        options: ["take in", "fill in", "log in", "drop in"],
        answer: "take in",
        hint: "To understand or absorb.",
      },
      {
        id: "in-19",
        sentence: "Please ____ at the front desk.",
        options: ["sign in", "sit in", "join in", "turn in"],
        answer: "sign in",
        hint: "To write your name to register.",
      },
      {
        id: "in-20",
        sentence: "Please ____ your PIN on the keypad.",
        options: ["key in", "chime in", "bring in", "call in"],
        answer: "key in",
        hint: "To enter data using a keyboard.",
      },
      {
        id: "in-21",
        sentence: "Please ____ the form online.",
        options: ["fill in", "call in", "drop in", "join in"],
        answer: "fill in",
        hint: "To complete missing parts.",
      },
      {
        id: "in-22",
        sentence: "He ____ during the call with a question.",
        options: ["chimed in", "moved in", "turned in", "signed in"],
        answer: "chimed in",
        hint: "To add a comment.",
      },
      {
        id: "in-23",
        sentence: "We should ____ at the front desk.",
        options: ["check in", "chip in", "cut in", "join in"],
        answer: "check in",
        hint: "To register.",
      },
      {
        id: "in-24",
        sentence: "She ____ to help for a week.",
        options: ["pitched in", "checked in", "signed in", "turned in"],
        answer: "pitched in",
        hint: "To help voluntarily.",
      },
      {
        id: "in-25",
        sentence: "He ____ the box after moving.",
        options: ["taped in", "packed in", "checked in", "signed in"],
        answer: "packed in",
        hint: "To pack tightly or include.",
      },
      {
        id: "in-26",
        sentence: "We ____ the kids for dinner.",
        options: ["called in", "checked in", "signed in", "chimed in"],
        answer: "called in",
        hint: "To ask someone to come inside.",
      },
      {
        id: "in-27",
        sentence: "She ____ the complaint.",
        options: ["sent in", "checked in", "signed in", "chimed in"],
        answer: "sent in",
        hint: "To submit.",
      },
      {
        id: "in-28",
        sentence: "He ____ the application yesterday.",
        options: ["turned in", "signed in", "checked in", "dropped in"],
        answer: "turned in",
        hint: "To submit.",
      },
      {
        id: "in-29",
        sentence: "They ____ the discussion.",
        options: ["joined in", "checked in", "signed in", "cut in"],
        answer: "joined in",
        hint: "To participate.",
      },
      {
        id: "in-30",
        sentence: "She ____ the lights before leaving.",
        options: ["shut in", "turned in", "checked in", "closed in"],
        answer: "closed in",
        hint: "To close or make smaller.",
      },
    ],
  },
  {
    key: "about",
    title: "About",
    effect: "About often signals the topic, reason, or movement around something.",
    questions: [
      {
        id: "about-1",
        sentence: "We need to ____ the plan before we start.",
        options: ["talk about", "look about", "work about", "run about"],
        answer: "talk about",
        hint: "To discuss a topic.",
      },
      {
        id: "about-2",
        sentence: "I will ____ it tonight.",
        options: ["think about", "bring about", "hang about", "set about"],
        answer: "think about",
        hint: "To consider something.",
      },
      {
        id: "about-3",
        sentence: "She called to ____ the price.",
        options: ["ask about", "go about", "get about", "see about"],
        answer: "ask about",
        hint: "To request information.",
      },
      {
        id: "about-4",
        sentence: "Did you ____ the update?",
        options: ["hear about", "move about", "set about", "hang about"],
        answer: "hear about",
        hint: "To receive news.",
      },
      {
        id: "about-5",
        sentence: "I want to ____ local customs.",
        options: ["learn about", "run about", "look about", "put about"],
        answer: "learn about",
        hint: "To get information about something.",
      },
      {
        id: "about-6",
        sentence: "I ____ the article yesterday.",
        options: ["read about", "get about", "go about", "see about"],
        answer: "read about",
        hint: "To read information about something.",
      },
      {
        id: "about-7",
        sentence: "Try not to ____ it.",
        options: ["worry about", "carry about", "turn about", "walk about"],
        answer: "worry about",
        hint: "To feel concerned.",
      },
      {
        id: "about-8",
        sentence: "She really ____ her friends.",
        options: ["care about", "turn about", "look about", "set about"],
        answer: "care about",
        hint: "To value or like something.",
      },
      {
        id: "about-9",
        sentence: "The policy helped to ____ change.",
        options: ["bring about", "go about", "look about", "talk about"],
        answer: "bring about",
        hint: "To cause something to happen.",
      },
      {
        id: "about-10",
        sentence: "How did the accident ____?",
        options: ["come about", "go about", "set about", "run about"],
        answer: "come about",
        hint: "To happen or occur.",
      },
      {
        id: "about-11",
        sentence: "He ____ fixing the bike right away.",
        options: ["went about", "brought about", "read about", "hung about"],
        answer: "went about",
        hint: "To start doing something.",
      },
      {
        id: "about-12",
        sentence: "They ____ cleaning the garage.",
        options: ["set about", "turn about", "talk about", "run about"],
        answer: "set about",
        hint: "To begin a task.",
      },
      {
        id: "about-13",
        sentence: "News will ____ quickly.",
        options: ["get about", "go about", "come about", "read about"],
        answer: "get about",
        hint: "To spread or travel.",
      },
      {
        id: "about-14",
        sentence: "We just ____ outside for a while.",
        options: ["hung about", "brought about", "set about", "thought about"],
        answer: "hung about",
        hint: "To wait or spend time doing little.",
      },
      {
        id: "about-15",
        sentence: "She ____ the room for clues.",
        options: ["looked about", "talked about", "brought about", "heard about"],
        answer: "looked about",
        hint: "To look around.",
      },
      {
        id: "about-16",
        sentence: "People ____ during the break.",
        options: ["moved about", "went about", "read about", "came about"],
        answer: "moved about",
        hint: "To move around.",
      },
      {
        id: "about-17",
        sentence: "The car ____ and left.",
        options: ["turned about", "brought about", "set about", "thought about"],
        answer: "turned about",
        hint: "To turn around.",
      },
      {
        id: "about-18",
        sentence: "They often ____ the mistake.",
        options: ["joke about", "look about", "bring about", "set about"],
        answer: "joke about",
        hint: "To make fun of something.",
      },
      {
        id: "about-19",
        sentence: "I often ____ traveling.",
        options: ["dream about", "talk about", "run about", "get about"],
        answer: "dream about",
        hint: "To imagine or wish for something.",
      },
      {
        id: "about-20",
        sentence: "He will ____ his trip.",
        options: ["write about", "go about", "come about", "look about"],
        answer: "write about",
        hint: "To write on a topic.",
      },
    ],
  },
  {
    key: "across",
    title: "Across",
    effect: "Across often signals crossing or communicating from one side to another.",
    questions: [
      {
        id: "across-1",
        sentence: "I ____ an old photo yesterday.",
        options: ["came across", "moved across", "got across", "passed across"],
        answer: "came across",
        hint: "To find by chance.",
      },
      {
        id: "across-2",
        sentence: "Can you ____ your point clearly?",
        options: ["get across", "run across", "look across", "turn across"],
        answer: "get across",
        hint: "To communicate a message.",
      },
      {
        id: "across-3",
        sentence: "We need to ____ the street.",
        options: ["go across", "get across", "come across", "think across"],
        answer: "go across",
        hint: "To cross from one side to the other.",
      },
      {
        id: "across-4",
        sentence: "I ____ a mistake in the report.",
        options: ["ran across", "set across", "brought across", "put across"],
        answer: "ran across",
        hint: "To find or meet by chance.",
      },
      {
        id: "across-5",
        sentence: "He ____ the room in a hurry.",
        options: ["walked across", "talked across", "held across", "put across"],
        answer: "walked across",
        hint: "To move from one side to another.",
      },
      {
        id: "across-6",
        sentence: "They ____ the state in one day.",
        options: ["drove across", "ran across", "came across", "worked across"],
        answer: "drove across",
        hint: "To drive from one side to the other.",
      },
      {
        id: "across-7",
        sentence: "She ____ Europe last summer.",
        options: ["traveled across", "went across", "put across", "found across"],
        answer: "traveled across",
        hint: "To travel through and over a place.",
      },
      {
        id: "across-8",
        sentence: "Let's ____ to the other side.",
        options: ["move across", "come across", "get across", "go across"],
        answer: "move across",
        hint: "To shift from one side to another.",
      },
      {
        id: "across-9",
        sentence: "The cat ____ the fence easily.",
        options: ["jumped across", "looked across", "put across", "brought across"],
        answer: "jumped across",
        hint: "To jump from one side to the other.",
      },
      {
        id: "across-10",
        sentence: "He ____ the bridge carefully.",
        options: ["climbed across", "ran across", "got across", "held across"],
        answer: "climbed across",
        hint: "To climb from one side to the other.",
      },
      {
        id: "across-11",
        sentence: "She ____ the table to grab the salt.",
        options: ["reached across", "looked across", "cut across", "moved across"],
        answer: "reached across",
        hint: "To extend your arm across something.",
      },
      {
        id: "across-12",
        sentence: "We ____ the park to save time.",
        options: ["cut across", "came across", "brought across", "took across"],
        answer: "cut across",
        hint: "To cross directly.",
      },
      {
        id: "across-13",
        sentence: "They ____ the boxes together.",
        options: ["carried across", "went across", "ran across", "looked across"],
        answer: "carried across",
        hint: "To move something across a space.",
      },
      {
        id: "across-14",
        sentence: "Please ____ the notes.",
        options: ["pass across", "go across", "come across", "get across"],
        answer: "pass across",
        hint: "To hand something across.",
      },
      {
        id: "across-15",
        sentence: "He ____ his idea clearly.",
        options: ["put across", "ran across", "went across", "moved across"],
        answer: "put across",
        hint: "To present or communicate clearly.",
      },
      {
        id: "across-16",
        sentence: "The actor ____ the emotion well.",
        options: ["brought across", "came across", "cut across", "ran across"],
        answer: "brought across",
        hint: "To convey a feeling or idea.",
      },
      {
        id: "across-17",
        sentence: "She ____ the street before crossing.",
        options: ["looked across", "ran across", "brought across", "set across"],
        answer: "looked across",
        hint: "To look to the other side.",
      },
      {
        id: "across-18",
        sentence: "The crowd ____ the square.",
        options: ["spread across", "ran across", "came across", "got across"],
        answer: "spread across",
        hint: "To extend over an area.",
      },
      {
        id: "across-19",
        sentence: "He ____ the room and smiled.",
        options: ["glanced across", "ran across", "carried across", "brought across"],
        answer: "glanced across",
        hint: "To look quickly across a space.",
      },
      {
        id: "across-20",
        sentence: "The rain ____ the field.",
        options: ["swept across", "went across", "came across", "got across"],
        answer: "swept across",
        hint: "To move quickly across an area.",
      },
    ],
  },
  {
    key: "after",
    title: "After",
    effect: "After often signals following, caring for, or pursuing.",
    questions: [
      {
        id: "after-1",
        sentence: "She will ____ her niece on weekends.",
        options: ["look after", "take after", "go after", "run after"],
        answer: "look after",
        hint: "To take care of someone.",
      },
      {
        id: "after-2",
        sentence: "He really ____ his dad.",
        options: ["takes after", "goes after", "runs after", "looks after"],
        answer: "takes after",
        hint: "To resemble a family member.",
      },
      {
        id: "after-3",
        sentence: "They decided to ____ the new client.",
        options: ["go after", "look after", "take after", "ask after"],
        answer: "go after",
        hint: "To pursue or try to get.",
      },
      {
        id: "after-4",
        sentence: "The kids ____ the dog in the yard.",
        options: ["run after", "look after", "take after", "come after"],
        answer: "run after",
        hint: "To chase.",
      },
      {
        id: "after-5",
        sentence: "The cat will ____ the ball.",
        options: ["chase after", "go after", "ask after", "look after"],
        answer: "chase after",
        hint: "To chase quickly.",
      },
      {
        id: "after-6",
        sentence: "The Q&A will ____ the presentation.",
        options: ["come after", "go after", "run after", "ask after"],
        answer: "come after",
        hint: "To happen later.",
      },
      {
        id: "after-7",
        sentence: "Please ____ your aunt when you call.",
        options: ["ask after", "go after", "take after", "look after"],
        answer: "ask after",
        hint: "To ask about someone's health.",
      },
      {
        id: "after-8",
        sentence: "I am ____ the charger.",
        options: ["after", "over", "into", "about"],
        answer: "after",
        hint: "To be looking for something.",
      },
      {
        id: "after-9",
        sentence: "They ____ their grandmother.",
        options: ["named after", "called after", "took after", "went after"],
        answer: "named after",
        hint: "To give someone a name in honor.",
      },
      {
        id: "after-10",
        sentence: "He was ____ his uncle.",
        options: ["called after", "looked after", "ran after", "came after"],
        answer: "called after",
        hint: "To be named for someone.",
      },
      {
        id: "after-11",
        sentence: "Please ____ yourself when you are done.",
        options: ["clean up after", "take after", "go after", "run after"],
        answer: "clean up after",
        hint: "To tidy your mess.",
      },
      {
        id: "after-12",
        sentence: "Can you ____ the kitchen tonight?",
        options: ["pick up after", "look after", "ask after", "take after"],
        answer: "pick up after",
        hint: "To tidy and put things away.",
      },
      {
        id: "after-13",
        sentence: "Please ____ the kids while I am out.",
        options: ["check after", "go after", "come after", "ask after"],
        answer: "check after",
        hint: "To check on someone's safety.",
      },
      {
        id: "after-14",
        sentence: "The team ____ the guide through the forest.",
        options: ["followed after", "ran after", "took after", "looked after"],
        answer: "followed after",
        hint: "To follow behind someone.",
      },
      {
        id: "after-15",
        sentence: "He will ____ a new opportunity.",
        options: ["seek after", "look after", "take after", "ask after"],
        answer: "seek after",
        hint: "To search for something.",
      },
      {
        id: "after-16",
        sentence: "Could you ____ the house while we travel?",
        options: ["watch after", "go after", "take after", "run after"],
        answer: "watch after",
        hint: "To look after and protect.",
      },
      {
        id: "after-17",
        sentence: "Her style was ____ her mother.",
        options: ["modeled after", "looked after", "ran after", "came after"],
        answer: "modeled after",
        hint: "To copy or imitate.",
      },
      {
        id: "after-18",
        sentence: "The sequel was ____ the first film.",
        options: ["patterned after", "goes after", "takes after", "looks after"],
        answer: "patterned after",
        hint: "To be based on or copied from.",
      },
      {
        id: "after-19",
        sentence: "They ____ the missing keys for hours.",
        options: ["searched after", "looked after", "took after", "ran after"],
        answer: "searched after",
        hint: "To look for something.",
      },
      {
        id: "after-20",
        sentence: "She ____ her younger brother every day.",
        options: ["looks after", "runs after", "goes after", "takes after"],
        answer: "looks after",
        hint: "To take care of someone.",
      },
    ],
  },
  {
    key: "against",
    title: "Against",
    effect: "Against often signals opposition, contact, or protection.",
    questions: [
      {
        id: "against-1",
        sentence: "I ____ the idea because it is too risky.",
        options: ["go against", "run against", "look against", "hold against"],
        answer: "go against",
        hint: "To oppose or disagree with.",
      },
      {
        id: "against-2",
        sentence: "She is strongly ____ the plan.",
        options: ["against", "across", "about", "ahead"],
        answer: "against",
        hint: "To be opposed to something.",
      },
      {
        id: "against-3",
        sentence: "Most people ____ the proposal.",
        options: ["voted against", "moved against", "looked against", "turned against"],
        answer: "voted against",
        hint: "To vote in opposition.",
      },
      {
        id: "against-4",
        sentence: "They ____ discrimination every day.",
        options: ["fight against", "look against", "move against", "take against"],
        answer: "fight against",
        hint: "To struggle to stop something.",
      },
      {
        id: "against-5",
        sentence: "He ____ the policy in the meeting.",
        options: ["argued against", "ran against", "held against", "put against"],
        answer: "argued against",
        hint: "To present reasons to oppose.",
      },
      {
        id: "against-6",
        sentence: "The vaccine can ____ infection.",
        options: ["guard against", "bring against", "move against", "push against"],
        answer: "guard against",
        hint: "To protect from harm.",
      },
      {
        id: "against-7",
        sentence: "Wear a jacket to ____ the cold.",
        options: ["protect against", "run against", "turn against", "put against"],
        answer: "protect against",
        hint: "To defend from something.",
      },
      {
        id: "against-8",
        sentence: "He ____ the trip with travel insurance.",
        options: ["insured against", "stood against", "worked against", "set against"],
        answer: "insured against",
        hint: "To buy protection from risk.",
      },
      {
        id: "against-9",
        sentence: "Doctors ____ smoking.",
        options: ["warn against", "lean against", "rub against", "get against"],
        answer: "warn against",
        hint: "To advise not to do something.",
      },
      {
        id: "against-10",
        sentence: "Poor weather can ____ your plans.",
        options: ["work against", "run against", "stand against", "put against"],
        answer: "work against",
        hint: "To make something harder.",
      },
      {
        id: "against-11",
        sentence: "Your late arrival will ____ you.",
        options: ["count against", "look against", "move against", "push against"],
        answer: "count against",
        hint: "To be a disadvantage.",
      },
      {
        id: "against-12",
        sentence: "She ____ the wall to rest.",
        options: ["leaned against", "ran against", "worked against", "looked against"],
        answer: "leaned against",
        hint: "To rest by touching something.",
      },
      {
        id: "against-13",
        sentence: "He ____ the button by accident.",
        options: ["pressed against", "went against", "stood against", "worked against"],
        answer: "pressed against",
        hint: "To push with contact.",
      },
      {
        id: "against-14",
        sentence: "She ____ the door to close it.",
        options: ["pushed against", "stood against", "counted against", "went against"],
        answer: "pushed against",
        hint: "To push on something.",
      },
      {
        id: "against-15",
        sentence: "His sleeve ____ the wet paint.",
        options: ["rubbed against", "worked against", "turned against", "looked against"],
        answer: "rubbed against",
        hint: "To touch and move across.",
      },
      {
        id: "against-16",
        sentence: "She ____ the table and spilled her drink.",
        options: ["bumped against", "went against", "stood against", "counted against"],
        answer: "bumped against",
        hint: "To hit something lightly.",
      },
      {
        id: "against-17",
        sentence: "The car ____ the barrier.",
        options: ["crashed against", "stood against", "worked against", "looked against"],
        answer: "crashed against",
        hint: "To hit with force.",
      },
      {
        id: "against-18",
        sentence: "He decided to ____ the home team.",
        options: ["bet against", "go against", "stand against", "move against"],
        answer: "bet against",
        hint: "To bet that something will lose.",
      },
      {
        id: "against-19",
        sentence: "She ____ the new rule.",
        options: ["spoke against", "went against", "counted against", "ran against"],
        answer: "spoke against",
        hint: "To publicly oppose.",
      },
      {
        id: "against-20",
        sentence: "They ____ injustice together.",
        options: ["stood against", "went against", "worked against", "leaned against"],
        answer: "stood against",
        hint: "To resist or oppose.",
      },
    ],
  },
  {
    key: "ahead",
    title: "Ahead",
    effect: "Ahead often signals moving forward, leading, or preparing early.",
    questions: [
      {
        id: "ahead-1",
        sentence: "Please ____ and start without me.",
        options: ["go ahead", "look ahead", "get ahead", "move ahead"],
        answer: "go ahead",
        hint: "To proceed.",
      },
      {
        id: "ahead-2",
        sentence: "We need to ____ with the plan.",
        options: ["move ahead", "run ahead", "look ahead", "jump ahead"],
        answer: "move ahead",
        hint: "To make progress.",
      },
      {
        id: "ahead-3",
        sentence: "She wants to ____ at work.",
        options: ["get ahead", "go ahead", "look ahead", "push ahead"],
        answer: "get ahead",
        hint: "To advance or be successful.",
      },
      {
        id: "ahead-4",
        sentence: "We should ____ before deciding.",
        options: ["look ahead", "go ahead", "run ahead", "move ahead"],
        answer: "look ahead",
        hint: "To think about the future.",
      },
      {
        id: "ahead-5",
        sentence: "It helps to ____ for busy weeks.",
        options: ["plan ahead", "push ahead", "move ahead", "read ahead"],
        answer: "plan ahead",
        hint: "To prepare in advance.",
      },
      {
        id: "ahead-6",
        sentence: "Try to ____ and avoid surprises.",
        options: ["think ahead", "go ahead", "run ahead", "get ahead"],
        answer: "think ahead",
        hint: "To plan for what comes next.",
      },
      {
        id: "ahead-7",
        sentence: "I like to ____ in the textbook.",
        options: ["read ahead", "look ahead", "jump ahead", "move ahead"],
        answer: "read ahead",
        hint: "To read before a class or lesson.",
      },
      {
        id: "ahead-8",
        sentence: "Do not ____ to the last page.",
        options: ["jump ahead", "go ahead", "get ahead", "move ahead"],
        answer: "jump ahead",
        hint: "To skip forward.",
      },
      {
        id: "ahead-9",
        sentence: "I will ____ and save you a seat.",
        options: ["drive ahead", "run ahead", "look ahead", "push ahead"],
        answer: "drive ahead",
        hint: "To go in front by car.",
      },
      {
        id: "ahead-10",
        sentence: "She will ____ to meet us.",
        options: ["walk ahead", "go ahead", "look ahead", "move ahead"],
        answer: "walk ahead",
        hint: "To go in front on foot.",
      },
      {
        id: "ahead-11",
        sentence: "The kids ____ to the playground.",
        options: ["ran ahead", "went ahead", "looked ahead", "moved ahead"],
        answer: "ran ahead",
        hint: "To run in front.",
      },
      {
        id: "ahead-12",
        sentence: "Our team needs to ____ in the standings.",
        options: ["stay ahead", "run ahead", "move ahead", "look ahead"],
        answer: "stay ahead",
        hint: "To keep the lead.",
      },
      {
        id: "ahead-13",
        sentence: "The cyclist ____ near the finish.",
        options: ["pulled ahead", "moved ahead", "went ahead", "looked ahead"],
        answer: "pulled ahead",
        hint: "To take the lead.",
      },
      {
        id: "ahead-14",
        sentence: "We must ____ despite the delays.",
        options: ["push ahead", "run ahead", "look ahead", "go ahead"],
        answer: "push ahead",
        hint: "To continue with effort.",
      },
      {
        id: "ahead-15",
        sentence: "They decided to ____ with the launch.",
        options: ["press ahead", "run ahead", "look ahead", "move ahead"],
        answer: "press ahead",
        hint: "To continue despite difficulty.",
      },
      {
        id: "ahead-16",
        sentence: "The team will ____ with confidence.",
        options: ["forge ahead", "jump ahead", "go ahead", "look ahead"],
        answer: "forge ahead",
        hint: "To move forward steadily.",
      },
      {
        id: "ahead-17",
        sentence: "He tried to ____ of the competition.",
        options: ["keep ahead", "move ahead", "run ahead", "look ahead"],
        answer: "keep ahead",
        hint: "To maintain a lead.",
      },
      {
        id: "ahead-18",
        sentence: "Please ____ before you arrive.",
        options: ["call ahead", "go ahead", "look ahead", "move ahead"],
        answer: "call ahead",
        hint: "To phone in advance.",
      },
      {
        id: "ahead-19",
        sentence: "We should ____ for the holiday.",
        options: ["book ahead", "go ahead", "run ahead", "move ahead"],
        answer: "book ahead",
        hint: "To reserve early.",
      },
      {
        id: "ahead-20",
        sentence: "You can ____ online and pick it up later.",
        options: ["order ahead", "look ahead", "jump ahead", "move ahead"],
        answer: "order ahead",
        hint: "To place an order in advance.",
      },
    ],
  },
  {
    key: "along",
    title: "Along",
    effect: "Along often signals movement together, continuation, or agreement.",
    questions: [
      {
        id: "along-1",
        sentence: "Come ____ with us to the store.",
        options: ["along", "around", "away", "back"],
        answer: "along",
        hint: "To join someone.",
      },
      {
        id: "along-2",
        sentence: "How are you ____ with the project?",
        options: ["getting along", "coming along", "going along", "moving along"],
        answer: "getting along",
        hint: "To progress or manage.",
      },
      {
        id: "along-3",
        sentence: "The plans are ____ well.",
        options: ["coming along", "going along", "getting along", "moving along"],
        answer: "coming along",
        hint: "To develop or progress.",
      },
      {
        id: "along-4",
        sentence: "Just ____ with it for now.",
        options: ["go along", "run along", "move along", "tag along"],
        answer: "go along",
        hint: "To agree or accept.",
      },
      {
        id: "along-5",
        sentence: "He likes to ____ on trips.",
        options: ["tag along", "go along", "move along", "get along"],
        answer: "tag along",
        hint: "To join without being invited.",
      },
      {
        id: "along-6",
        sentence: "The meeting ____ faster than expected.",
        options: ["moved along", "got along", "ran along", "took along"],
        answer: "moved along",
        hint: "To progress steadily.",
      },
      {
        id: "along-7",
        sentence: "She ____ well with her coworkers.",
        options: ["gets along", "goes along", "moves along", "takes along"],
        answer: "gets along",
        hint: "To have a good relationship.",
      },
      {
        id: "along-8",
        sentence: "Please ____ your notes.",
        options: ["bring along", "take along", "carry along", "keep along"],
        answer: "bring along",
        hint: "To bring something with you.",
      },
      {
        id: "along-9",
        sentence: "We will ____ a map just in case.",
        options: ["take along", "bring along", "get along", "move along"],
        answer: "take along",
        hint: "To take something with you.",
      },
      {
        id: "along-10",
        sentence: "She ____ her friend to the party.",
        options: ["brought along", "went along", "got along", "moved along"],
        answer: "brought along",
        hint: "To bring someone with you.",
      },
      {
        id: "along-11",
        sentence: "The bus ____ the coast.",
        options: ["went along", "ran along", "came along", "moved along"],
        answer: "went along",
        hint: "To travel beside something.",
      },
      {
        id: "along-12",
        sentence: "He ____ the wall to find the switch.",
        options: ["felt along", "went along", "got along", "ran along"],
        answer: "felt along",
        hint: "To feel or touch while moving.",
      },
      {
        id: "along-13",
        sentence: "We just ____ and waited.",
        options: ["sat along", "hung along", "stayed along", "stood along"],
        answer: "stayed along",
        hint: "To remain with someone.",
      },
      {
        id: "along-14",
        sentence: "Please ____ this information to her.",
        options: ["pass along", "move along", "go along", "get along"],
        answer: "pass along",
        hint: "To share or transmit.",
      },
      {
        id: "along-15",
        sentence: "We ____ a small gift for her.",
        options: ["carried along", "took along", "brought along", "went along"],
        answer: "brought along",
        hint: "To bring with you.",
      },
      {
        id: "along-16",
        sentence: "The teacher said, \"____ now.\"",
        options: ["move along", "get along", "go along", "take along"],
        answer: "move along",
        hint: "To continue or keep moving.",
      },
      {
        id: "along-17",
        sentence: "The kids ____ on their bikes.",
        options: ["rode along", "ran along", "went along", "drove along"],
        answer: "rode along",
        hint: "To ride beside or with.",
      },
      {
        id: "along-18",
        sentence: "She ____ a snack for the trip.",
        options: ["packed along", "took along", "brought along", "went along"],
        answer: "packed along",
        hint: "To pack and bring with you.",
      },
      {
        id: "along-19",
        sentence: "He ____ without asking.",
        options: ["tagged along", "went along", "got along", "moved along"],
        answer: "tagged along",
        hint: "To join informally.",
      },
      {
        id: "along-20",
        sentence: "She told the story and ____ a joke.",
        options: ["threw in along", "tacked on along", "tacked along", "tacked on"],
        answer: "tacked on",
        hint: "To add something extra.",
      },
    ],
  },
  {
    key: "around",
    title: "Around",
    effect: "Around often signals movement, approximation, or flexibility.",
    questions: [
      {
        id: "around-1",
        sentence: "Can we ____ 3 pm?",
        options: ["meet around", "get around", "move around", "turn around"],
        answer: "meet around",
        hint: "To meet at an approximate time.",
      },
      {
        id: "around-2",
        sentence: "We should ____ the city today.",
        options: ["walk around", "go around", "look around", "run around"],
        answer: "walk around",
        hint: "To walk without a fixed plan.",
      },
      {
        id: "around-3",
        sentence: "She likes to ____ new places.",
        options: ["look around", "move around", "turn around", "run around"],
        answer: "look around",
        hint: "To explore by looking.",
      },
      {
        id: "around-4",
        sentence: "The kids ____ the house.",
        options: ["ran around", "moved around", "turned around", "walked around"],
        answer: "ran around",
        hint: "To run in different directions.",
      },
      {
        id: "around-5",
        sentence: "He ____ his chair to face her.",
        options: ["turned around", "moved around", "looked around", "went around"],
        answer: "turned around",
        hint: "To rotate or face the other way.",
      },
      {
        id: "around-6",
        sentence: "We can ____ the issue for now.",
        options: ["work around", "walk around", "get around", "come around"],
        answer: "work around",
        hint: "To find a solution despite a problem.",
      },
      {
        id: "around-7",
        sentence: "She ____ to the idea eventually.",
        options: ["came around", "got around", "went around", "turned around"],
        answer: "came around",
        hint: "To change your mind and agree.",
      },
      {
        id: "around-8",
        sentence: "News ____ quickly.",
        options: ["gets around", "goes around", "runs around", "moves around"],
        answer: "gets around",
        hint: "To spread among people.",
      },
      {
        id: "around-9",
        sentence: "We should ____ to visiting them.",
        options: ["get around", "come around", "go around", "look around"],
        answer: "get around",
        hint: "To finally do something after delays.",
      },
      {
        id: "around-10",
        sentence: "Please ____ the table and grab a seat.",
        options: ["go around", "move around", "come around", "turn around"],
        answer: "go around",
        hint: "To move to the other side.",
      },
      {
        id: "around-11",
        sentence: "She ____ the problem carefully.",
        options: ["worked around", "looked around", "moved around", "turned around"],
        answer: "worked around",
        hint: "To solve by using an alternate way.",
      },
      {
        id: "around-12",
        sentence: "He ____ to check the time.",
        options: ["looked around", "turned around", "moved around", "went around"],
        answer: "looked around",
        hint: "To glance around.",
      },
      {
        id: "around-13",
        sentence: "She ____ the room to find her keys.",
        options: ["searched around", "turned around", "ran around", "got around"],
        answer: "searched around",
        hint: "To look everywhere for something.",
      },
      {
        id: "around-14",
        sentence: "Let me ____ and see.",
        options: ["check around", "move around", "get around", "turn around"],
        answer: "check around",
        hint: "To look in different places.",
      },
      {
        id: "around-15",
        sentence: "We had to ____ the traffic.",
        options: ["go around", "get around", "move around", "run around"],
        answer: "go around",
        hint: "To avoid by taking another route.",
      },
      {
        id: "around-16",
        sentence: "He ____ a lot for work.",
        options: ["travels around", "moves around", "gets around", "walks around"],
        answer: "travels around",
        hint: "To visit many places.",
      },
      {
        id: "around-17",
        sentence: "We can ____ after lunch.",
        options: ["hang around", "run around", "move around", "go around"],
        answer: "hang around",
        hint: "To stay and wait.",
      },
      {
        id: "around-18",
        sentence: "He ____ to the front of the line.",
        options: ["moved around", "got around", "went around", "ran around"],
        answer: "moved around",
        hint: "To move to another position.",
      },
      {
        id: "around-19",
        sentence: "She ____ to pick up the package.",
        options: ["came around", "went around", "turned around", "got around"],
        answer: "came around",
        hint: "To visit or come by.",
      },
      {
        id: "around-20",
        sentence: "Please ____ and show the back.",
        options: ["turn around", "move around", "go around", "look around"],
        answer: "turn around",
        hint: "To rotate so the back faces the front.",
      },
    ],
  },
  {
    key: "away",
    title: "Away",
    effect: "Away often signals distance, removal, or continuing action.",
    questions: [
      {
        id: "away-1",
        sentence: "Please ____ the dishes after dinner.",
        options: ["put away", "take away", "get away", "wash away"],
        answer: "put away",
        hint: "To put something in its place.",
      },
      {
        id: "away-2",
        sentence: "He tried to ____ from the crowd.",
        options: ["get away", "give away", "run away", "take away"],
        answer: "get away",
        hint: "To escape or leave.",
      },
      {
        id: "away-3",
        sentence: "The thief ____ with the bag.",
        options: ["got away", "took away", "put away", "gave away"],
        answer: "got away",
        hint: "To escape.",
      },
      {
        id: "away-4",
        sentence: "The kids ____ their toys.",
        options: ["put away", "took away", "threw away", "kept away"],
        answer: "put away",
        hint: "To store something.",
      },
      {
        id: "away-5",
        sentence: "She ____ the old letters.",
        options: ["threw away", "gave away", "took away", "put away"],
        answer: "threw away",
        hint: "To discard.",
      },
      {
        id: "away-6",
        sentence: "Please ____ your shoes.",
        options: ["take away", "put away", "give away", "keep away"],
        answer: "put away",
        hint: "To put in the proper place.",
      },
      {
        id: "away-7",
        sentence: "He ____ the trash.",
        options: ["took away", "put away", "got away", "gave away"],
        answer: "took away",
        hint: "To remove from a place.",
      },
      {
        id: "away-8",
        sentence: "They ____ all the free samples.",
        options: ["gave away", "took away", "put away", "got away"],
        answer: "gave away",
        hint: "To give for free.",
      },
      {
        id: "away-9",
        sentence: "He ____ at the keyboard for hours.",
        options: ["typed away", "took away", "put away", "got away"],
        answer: "typed away",
        hint: "To keep typing continuously.",
      },
      {
        id: "away-10",
        sentence: "She ____ at the piano all evening.",
        options: ["played away", "took away", "put away", "gave away"],
        answer: "played away",
        hint: "To keep playing without stopping.",
      },
      {
        id: "away-11",
        sentence: "The sound faded ____.",
        options: ["away", "around", "along", "ahead"],
        answer: "away",
        hint: "To gradually disappear.",
      },
      {
        id: "away-12",
        sentence: "He ____ his savings on a new car.",
        options: ["blew away", "put away", "took away", "gave away"],
        answer: "blew away",
        hint: "To spend quickly or waste.",
      },
      {
        id: "away-13",
        sentence: "Please ____ the documents safely.",
        options: ["lock away", "give away", "run away", "wash away"],
        answer: "lock away",
        hint: "To store securely.",
      },
      {
        id: "away-14",
        sentence: "We ____ for the weekend.",
        options: ["got away", "ran away", "took away", "put away"],
        answer: "got away",
        hint: "To take a short trip.",
      },
      {
        id: "away-15",
        sentence: "She ____ the tears quickly.",
        options: ["wiped away", "took away", "put away", "got away"],
        answer: "wiped away",
        hint: "To remove by wiping.",
      },
      {
        id: "away-16",
        sentence: "The river ____ the footprints.",
        options: ["washed away", "took away", "put away", "gave away"],
        answer: "washed away",
        hint: "To remove with water.",
      },
      {
        id: "away-17",
        sentence: "He ____ his phone and focused.",
        options: ["put away", "took away", "gave away", "got away"],
        answer: "put away",
        hint: "To store and stop using.",
      },
      {
        id: "away-18",
        sentence: "She ____ her jacket at the door.",
        options: ["hung away", "put away", "took away", "gave away"],
        answer: "put away",
        hint: "To place in its proper spot.",
      },
      {
        id: "away-19",
        sentence: "He ____ the pain with rest.",
        options: ["kept away", "put away", "got away", "took away"],
        answer: "kept away",
        hint: "To prevent from happening.",
      },
      {
        id: "away-20",
        sentence: "She ____ the noise and kept working.",
        options: ["tuned away", "blocked away", "tuned out", "took away"],
        answer: "tuned out",
        hint: "To stop paying attention.",
      },
    ],
  },
  {
    key: "back",
    title: "Back",
    effect: "Back often signals returning, reversing, or supporting.",
    questions: [
      {
        id: "back-1",
        sentence: "Please ____ the book to the shelf.",
        options: ["put back", "take back", "go back", "hand back"],
        answer: "put back",
        hint: "To return something to its place.",
      },
      {
        id: "back-2",
        sentence: "I will ____ you later.",
        options: ["call back", "pay back", "hold back", "set back"],
        answer: "call back",
        hint: "To return a phone call.",
      },
      {
        id: "back-3",
        sentence: "She ____ the money she owed.",
        options: ["paid back", "took back", "brought back", "gave back"],
        answer: "paid back",
        hint: "To repay money.",
      },
      {
        id: "back-4",
        sentence: "He ____ his jacket before leaving.",
        options: ["put back on", "took back", "got back", "held back"],
        answer: "put back on",
        hint: "To wear again.",
      },
      {
        id: "back-5",
        sentence: "We ____ to the hotel after dinner.",
        options: ["went back", "came back", "took back", "brought back"],
        answer: "went back",
        hint: "To return to a place.",
      },
      {
        id: "back-6",
        sentence: "She ____ the package to the sender.",
        options: ["sent back", "took back", "got back", "held back"],
        answer: "sent back",
        hint: "To return by mail.",
      },
      {
        id: "back-7",
        sentence: "He ____ the story with photos.",
        options: ["backed up", "set up", "stood up", "turned up"],
        answer: "backed up",
        hint: "To support with evidence.",
      },
      {
        id: "back-8",
        sentence: "She ____ her decision after thinking.",
        options: ["went back on", "came back to", "took back", "moved back"],
        answer: "went back on",
        hint: "To break a promise.",
      },
      {
        id: "back-9",
        sentence: "He ____ his answer quickly.",
        options: ["took back", "put back", "brought back", "called back"],
        answer: "took back",
        hint: "To retract something said.",
      },
      {
        id: "back-10",
        sentence: "We ____ the meeting to Friday.",
        options: ["pushed back", "took back", "sent back", "went back"],
        answer: "pushed back",
        hint: "To delay.",
      },
      {
        id: "back-11",
        sentence: "Please ____ your seat.",
        options: ["sit back", "stand back", "hold back", "move back"],
        answer: "sit back",
        hint: "To sit and relax.",
      },
      {
        id: "back-12",
        sentence: "She ____ the curtains.",
        options: ["pulled back", "took back", "went back", "held back"],
        answer: "pulled back",
        hint: "To move away from the front.",
      },
      {
        id: "back-13",
        sentence: "He ____ at the last minute.",
        options: ["backed out", "backed up", "backed off", "backed in"],
        answer: "backed out",
        hint: "To cancel after agreeing.",
      },
      {
        id: "back-14",
        sentence: "Please ____ from the edge.",
        options: ["step back", "take back", "go back", "put back"],
        answer: "step back",
        hint: "To move away a short distance.",
      },
      {
        id: "back-15",
        sentence: "The crowd ____ to make space.",
        options: ["moved back", "came back", "took back", "pushed back"],
        answer: "moved back",
        hint: "To move away from a point.",
      },
      {
        id: "back-16",
        sentence: "He ____ and let her speak.",
        options: ["held back", "took back", "set back", "gave back"],
        answer: "held back",
        hint: "To restrain or hold in.",
      },
      {
        id: "back-17",
        sentence: "She ____ the files from the server.",
        options: ["backed up", "brought back", "took back", "called back"],
        answer: "backed up",
        hint: "To create a copy for safety.",
      },
      {
        id: "back-18",
        sentence: "He ____ the chair to the table.",
        options: ["pushed back", "put back", "took back", "got back"],
        answer: "pushed back",
        hint: "To move something backward.",
      },
      {
        id: "back-19",
        sentence: "We ____ the old photos.",
        options: ["looked back on", "took back", "put back", "went back"],
        answer: "looked back on",
        hint: "To remember the past.",
      },
      {
        id: "back-20",
        sentence: "She ____ her friend in the argument.",
        options: ["backed up", "backed out", "backed off", "backed in"],
        answer: "backed up",
        hint: "To support someone.",
      },
    ],
  },
  {
    key: "behind",
    title: "Behind",
    effect: "Behind often signals being late, following, or supporting from the back.",
    questions: [
      {
        id: "behind-1",
        sentence: "We are ____ schedule today.",
        options: ["behind", "back", "away", "along"],
        answer: "behind",
        hint: "Late or delayed.",
      },
      {
        id: "behind-2",
        sentence: "He ____ on his work.",
        options: ["fell behind", "got behind", "set behind", "ran behind"],
        answer: "fell behind",
        hint: "To become delayed.",
      },
      {
        id: "behind-3",
        sentence: "She ____ the team fully.",
        options: ["stood behind", "fell behind", "got behind", "ran behind"],
        answer: "stood behind",
        hint: "To support.",
      },
      {
        id: "behind-4",
        sentence: "He ____ the door to stay quiet.",
        options: ["closed behind", "left behind", "set behind", "kept behind"],
        answer: "closed behind",
        hint: "To close after passing through.",
      },
      {
        id: "behind-5",
        sentence: "She ____ her glasses at home.",
        options: ["left behind", "fell behind", "stood behind", "got behind"],
        answer: "left behind",
        hint: "To forget and not take.",
      },
      {
        id: "behind-6",
        sentence: "He ____ in the race.",
        options: ["lagged behind", "stood behind", "came behind", "looked behind"],
        answer: "lagged behind",
        hint: "To move more slowly than others.",
      },
      {
        id: "behind-7",
        sentence: "The kids ____ their friends.",
        options: ["ran behind", "fell behind", "went behind", "stood behind"],
        answer: "ran behind",
        hint: "To run after someone.",
      },
      {
        id: "behind-8",
        sentence: "We need to ____ the timeline.",
        options: ["get behind", "catch up", "fall behind", "stand behind"],
        answer: "catch up",
        hint: "To reach the same progress.",
      },
      {
        id: "behind-9",
        sentence: "He ____ the idea.",
        options: ["got behind", "fell behind", "ran behind", "put behind"],
        answer: "got behind",
        hint: "To support or agree with.",
      },
      {
        id: "behind-10",
        sentence: "She ____ the counter and waited.",
        options: ["stood behind", "fell behind", "went behind", "ran behind"],
        answer: "stood behind",
        hint: "To be in the back position.",
      },
      {
        id: "behind-11",
        sentence: "The team ____ in the second half.",
        options: ["was behind", "fell behind", "stood behind", "ran behind"],
        answer: "was behind",
        hint: "To be losing.",
      },
      {
        id: "behind-12",
        sentence: "He ____ with his payments.",
        options: ["got behind", "stood behind", "fell behind", "ran behind"],
        answer: "got behind",
        hint: "To become late.",
      },
      {
        id: "behind-13",
        sentence: "We ____ the car on the highway.",
        options: ["left behind", "fell behind", "stood behind", "got behind"],
        answer: "left behind",
        hint: "To move past and leave.",
      },
      {
        id: "behind-14",
        sentence: "She ____ her team in the interview.",
        options: ["spoke behind", "stood behind", "fell behind", "ran behind"],
        answer: "stood behind",
        hint: "To support or back up.",
      },
      {
        id: "behind-15",
        sentence: "He ____ on his reading.",
        options: ["fell behind", "stood behind", "ran behind", "left behind"],
        answer: "fell behind",
        hint: "To get late or not keep up.",
      },
      {
        id: "behind-16",
        sentence: "The house is ____ the trees.",
        options: ["behind", "across", "around", "along"],
        answer: "behind",
        hint: "At the back of something.",
      },
      {
        id: "behind-17",
        sentence: "He ____ the rest of the group.",
        options: ["stayed behind", "fell behind", "ran behind", "got behind"],
        answer: "stayed behind",
        hint: "To remain after others leave.",
      },
      {
        id: "behind-18",
        sentence: "The dog ____ the fence.",
        options: ["hid behind", "fell behind", "stood behind", "ran behind"],
        answer: "hid behind",
        hint: "To hide at the back of something.",
      },
      {
        id: "behind-19",
        sentence: "He ____ his friend for support.",
        options: ["looked behind", "got behind", "fell behind", "ran behind"],
        answer: "looked behind",
        hint: "To look to the back.",
      },
      {
        id: "behind-20",
        sentence: "She ____ with chores.",
        options: ["got behind", "stood behind", "ran behind", "fell behind"],
        answer: "got behind",
        hint: "To be late with tasks.",
      },
    ],
  },
  {
    key: "by",
    title: "By",
    effect: "By often signals passing, brief visits, or managing with what you have.",
    questions: [
      {
        id: "by-1",
        sentence: "I will ____ after work.",
        options: ["stop by", "stand by", "get by", "pass by"],
        answer: "stop by",
        hint: "To visit briefly.",
      },
      {
        id: "by-2",
        sentence: "Feel free to ____ anytime.",
        options: ["drop by", "go by", "run by", "live by"],
        answer: "drop by",
        hint: "To visit for a short time.",
      },
      {
        id: "by-3",
        sentence: "She will ____ the office later.",
        options: ["come by", "get by", "stand by", "pass by"],
        answer: "come by",
        hint: "To visit or stop in.",
      },
      {
        id: "by-4",
        sentence: "We can ____ the store on the way.",
        options: ["swing by", "stand by", "live by", "get by"],
        answer: "swing by",
        hint: "To stop briefly while traveling.",
      },
      {
        id: "by-5",
        sentence: "Time just ____ so fast.",
        options: ["goes by", "comes by", "gets by", "stands by"],
        answer: "goes by",
        hint: "To pass.",
      },
      {
        id: "by-6",
        sentence: "Cars ____ all night.",
        options: ["passed by", "got by", "stood by", "ran by"],
        answer: "passed by",
        hint: "To move past a place.",
      },
      {
        id: "by-7",
        sentence: "She can ____ on a tight budget.",
        options: ["get by", "go by", "stand by", "come by"],
        answer: "get by",
        hint: "To manage with little.",
      },
      {
        id: "by-8",
        sentence: "Please ____ until I call you.",
        options: ["stand by", "come by", "go by", "drop by"],
        answer: "stand by",
        hint: "To wait and be ready.",
      },
      {
        id: "by-9",
        sentence: "He will ____ and say hello.",
        options: ["stop by", "get by", "live by", "stand by"],
        answer: "stop by",
        hint: "To visit briefly.",
      },
      {
        id: "by-10",
        sentence: "We ____ the old house every day.",
        options: ["drive by", "get by", "come by", "stand by"],
        answer: "drive by",
        hint: "To pass in a car.",
      },
      {
        id: "by-11",
        sentence: "He ____ my desk and waved.",
        options: ["walked by", "stood by", "got by", "went by"],
        answer: "walked by",
        hint: "To pass on foot.",
      },
      {
        id: "by-12",
        sentence: "Can you ____ this idea with your manager?",
        options: ["run by", "go by", "come by", "pass by"],
        answer: "run by",
        hint: "To check or discuss quickly.",
      },
      {
        id: "by-13",
        sentence: "We ____ the bakery and picked up bread.",
        options: ["went by", "stood by", "got by", "came by"],
        answer: "went by",
        hint: "To pass a place.",
      },
      {
        id: "by-14",
        sentence: "She ____ the news to her parents.",
        options: ["passed by", "ran by", "got by", "stood by"],
        answer: "passed by",
        hint: "To let something go past.",
      },
      {
        id: "by-15",
        sentence: "He ____ with simple rules.",
        options: ["lives by", "comes by", "goes by", "passes by"],
        answer: "lives by",
        hint: "To follow as a rule.",
      },
      {
        id: "by-16",
        sentence: "We will ____ the details tomorrow.",
        options: ["go by", "run by", "get by", "stand by"],
        answer: "run by",
        hint: "To quickly check something.",
      },
      {
        id: "by-17",
        sentence: "The train ____ every hour.",
        options: ["goes by", "gets by", "comes by", "stands by"],
        answer: "goes by",
        hint: "To pass regularly.",
      },
      {
        id: "by-18",
        sentence: "He ____ and dropped off the papers.",
        options: ["stopped by", "stood by", "got by", "went by"],
        answer: "stopped by",
        hint: "To visit briefly.",
      },
      {
        id: "by-19",
        sentence: "She ____ to say thanks.",
        options: ["came by", "got by", "stood by", "went by"],
        answer: "came by",
        hint: "To visit for a short time.",
      },
      {
        id: "by-20",
        sentence: "The parade ____ at noon.",
        options: ["went by", "came by", "got by", "stood by"],
        answer: "went by",
        hint: "To pass in front of you.",
      },
    ],
  },
  {
    key: "for",
    title: "For",
    effect: "For often signals purpose, support, or seeking something.",
    questions: [
      {
        id: "for-1",
        sentence: "I am ____ my keys.",
        options: ["looking for", "waiting for", "hoping for", "calling for"],
        answer: "looking for",
        hint: "To search for something.",
      },
      {
        id: "for-2",
        sentence: "Please ____ me at the lobby.",
        options: ["wait for", "ask for", "pay for", "work for"],
        answer: "wait for",
        hint: "To stay until someone arrives.",
      },
      {
        id: "for-3",
        sentence: "She will ____ a refund.",
        options: ["ask for", "care for", "go for", "look for"],
        answer: "ask for",
        hint: "To request something.",
      },
      {
        id: "for-4",
        sentence: "We should ____ the tickets online.",
        options: ["pay for", "hope for", "look for", "wait for"],
        answer: "pay for",
        hint: "To give money in exchange.",
      },
      {
        id: "for-5",
        sentence: "She really ____ her family.",
        options: ["cares for", "stands for", "works for", "asks for"],
        answer: "cares for",
        hint: "To look after or love.",
      },
      {
        id: "for-6",
        sentence: "Are you ____ a coffee?",
        options: ["up for", "going for", "looking for", "waiting for"],
        answer: "up for",
        hint: "Willing to do something.",
      },
      {
        id: "for-7",
        sentence: "The situation ____ quick action.",
        options: ["calls for", "asks for", "waits for", "works for"],
        answer: "calls for",
        hint: "To require.",
      },
      {
        id: "for-8",
        sentence: "This letter ____ the manager.",
        options: ["is for", "stands for", "works for", "goes for"],
        answer: "is for",
        hint: "To be intended for.",
      },
      {
        id: "for-9",
        sentence: "He will ____ a better job.",
        options: ["look for", "wait for", "stand for", "call for"],
        answer: "look for",
        hint: "To search for.",
      },
      {
        id: "for-10",
        sentence: "She ____ her team in the finals.",
        options: ["cheered for", "stood for", "paid for", "went for"],
        answer: "cheered for",
        hint: "To support loudly.",
      },
      {
        id: "for-11",
        sentence: "I will ____ the package.",
        options: ["sign for", "work for", "ask for", "look for"],
        answer: "sign for",
        hint: "To sign to receive something.",
      },
      {
        id: "for-12",
        sentence: "He ____ a scholarship.",
        options: ["applied for", "looked for", "stood for", "called for"],
        answer: "applied for",
        hint: "To request formally.",
      },
      {
        id: "for-13",
        sentence: "We need to ____ a gift.",
        options: ["shop for", "wait for", "pay for", "call for"],
        answer: "shop for",
        hint: "To look for something to buy.",
      },
      {
        id: "for-14",
        sentence: "She ____ change at the counter.",
        options: ["asked for", "worked for", "stood for", "went for"],
        answer: "asked for",
        hint: "To request politely.",
      },
      {
        id: "for-15",
        sentence: "I will ____ you later.",
        options: ["send for", "look for", "wait for", "pay for"],
        answer: "send for",
        hint: "To request someone to come.",
      },
      {
        id: "for-16",
        sentence: "We should ____ the long line.",
        options: ["prepare for", "ask for", "stand for", "work for"],
        answer: "prepare for",
        hint: "To get ready.",
      },
      {
        id: "for-17",
        sentence: "She ____ her brother every day.",
        options: ["looks for", "cares for", "stands for", "pays for"],
        answer: "cares for",
        hint: "To take care of.",
      },
      {
        id: "for-18",
        sentence: "They ____ the new policy.",
        options: ["voted for", "stood for", "looked for", "asked for"],
        answer: "voted for",
        hint: "To support in a vote.",
      },
      {
        id: "for-19",
        sentence: "I ____ you to arrive soon.",
        options: ["hope for", "pay for", "stand for", "work for"],
        answer: "hope for",
        hint: "To want something to happen.",
      },
      {
        id: "for-20",
        sentence: "He ____ a walk after dinner.",
        options: ["went for", "asked for", "stood for", "waited for"],
        answer: "went for",
        hint: "To go and do something.",
      },
    ],
  },
  {
    key: "from",
    title: "From",
    effect: "From often signals origin, separation, or protection.",
    questions: [
      {
        id: "from-1",
        sentence: "Where do you ____?",
        options: ["come from", "go from", "get from", "move from"],
        answer: "come from",
        hint: "To be originally from a place.",
      },
      {
        id: "from-2",
        sentence: "I ____ my cousin yesterday.",
        options: ["heard from", "came from", "went from", "moved from"],
        answer: "heard from",
        hint: "To receive a message.",
      },
      {
        id: "from-3",
        sentence: "We can ____ her mistakes.",
        options: ["learn from", "go from", "take from", "move from"],
        answer: "learn from",
        hint: "To gain knowledge.",
      },
      {
        id: "from-4",
        sentence: "Can I ____ your pen?",
        options: ["borrow from", "take from", "get from", "go from"],
        answer: "borrow from",
        hint: "To take temporarily.",
      },
      {
        id: "from-5",
        sentence: "Please ____ the shelf.",
        options: ["take from", "come from", "learn from", "stand from"],
        answer: "take from",
        hint: "To remove from a place.",
      },
      {
        id: "from-6",
        sentence: "I ____ this shop.",
        options: ["buy from", "go from", "move from", "learn from"],
        answer: "buy from",
        hint: "To purchase at a place.",
      },
      {
        id: "from-7",
        sentence: "She ____ her phone.",
        options: ["got from", "came from", "went from", "moved from"],
        answer: "got from",
        hint: "To receive from someone.",
      },
      {
        id: "from-8",
        sentence: "We should ____ the noise.",
        options: ["protect from", "come from", "go from", "move from"],
        answer: "protect from",
        hint: "To keep safe.",
      },
      {
        id: "from-9",
        sentence: "He ____ his injury quickly.",
        options: ["recovered from", "moved from", "went from", "came from"],
        answer: "recovered from",
        hint: "To get well after something.",
      },
      {
        id: "from-10",
        sentence: "She ____ headaches.",
        options: ["suffers from", "goes from", "moves from", "comes from"],
        answer: "suffers from",
        hint: "To experience a problem.",
      },
      {
        id: "from-11",
        sentence: "Please ____ the wet floor.",
        options: ["stay away from", "come from", "go from", "move from"],
        answer: "stay away from",
        hint: "To avoid.",
      },
      {
        id: "from-12",
        sentence: "I ____ your example.",
        options: ["learned from", "got from", "moved from", "went from"],
        answer: "learned from",
        hint: "To gain knowledge.",
      },
      {
        id: "from-13",
        sentence: "She ____ the old apartment.",
        options: ["moved from", "came from", "went from", "learned from"],
        answer: "moved from",
        hint: "To leave and live elsewhere.",
      },
      {
        id: "from-14",
        sentence: "He ____ the library.",
        options: ["returned from", "went from", "came from", "moved from"],
        answer: "returned from",
        hint: "To come back from a place.",
      },
      {
        id: "from-15",
        sentence: "She ____ her parents.",
        options: ["heard from", "came from", "got from", "moved from"],
        answer: "heard from",
        hint: "To receive a message.",
      },
      {
        id: "from-16",
        sentence: "He ____ the class.",
        options: ["graduated from", "came from", "went from", "moved from"],
        answer: "graduated from",
        hint: "To finish a school program.",
      },
      {
        id: "from-17",
        sentence: "We ____ the bus stop.",
        options: ["walked from", "came from", "went from", "moved from"],
        answer: "walked from",
        hint: "To walk starting at a place.",
      },
      {
        id: "from-18",
        sentence: "He ____ a famous family.",
        options: ["comes from", "goes from", "moves from", "learns from"],
        answer: "comes from",
        hint: "To have origin in.",
      },
      {
        id: "from-19",
        sentence: "Please ____ the heat.",
        options: ["protect from", "come from", "go from", "move from"],
        answer: "protect from",
        hint: "To keep safe.",
      },
      {
        id: "from-20",
        sentence: "She ____ stress.",
        options: ["recovered from", "moved from", "came from", "went from"],
        answer: "recovered from",
        hint: "To get well again.",
      },
    ],
  },
  {
    key: "into",
    title: "Into",
    effect: "Into often signals entering, changing, or involving.",
    questions: [
      {
        id: "into-1",
        sentence: "I need to ____ the issue.",
        options: ["look into", "go into", "break into", "run into"],
        answer: "look into",
        hint: "To investigate.",
      },
      {
        id: "into-2",
        sentence: "I ____ an old friend at the mall.",
        options: ["ran into", "got into", "looked into", "went into"],
        answer: "ran into",
        hint: "To meet by chance.",
      },
      {
        id: "into-3",
        sentence: "Try not to ____ trouble.",
        options: ["get into", "go into", "look into", "turn into"],
        answer: "get into",
        hint: "To become involved in something bad.",
      },
      {
        id: "into-4",
        sentence: "They ____ the house quietly.",
        options: ["went into", "ran into", "broke into", "looked into"],
        answer: "went into",
        hint: "To enter.",
      },
      {
        id: "into-5",
        sentence: "Someone ____ the car.",
        options: ["broke into", "ran into", "went into", "looked into"],
        answer: "broke into",
        hint: "To enter illegally.",
      },
      {
        id: "into-6",
        sentence: "The caterpillar ____ a butterfly.",
        options: ["turned into", "went into", "ran into", "looked into"],
        answer: "turned into",
        hint: "To change into something else.",
      },
      {
        id: "into-7",
        sentence: "We ____ the hotel at noon.",
        options: ["checked into", "looked into", "ran into", "went into"],
        answer: "checked into",
        hint: "To register at a hotel.",
      },
      {
        id: "into-8",
        sentence: "She ____ a new apartment.",
        options: ["moved into", "ran into", "looked into", "went into"],
        answer: "moved into",
        hint: "To start living in a place.",
      },
      {
        id: "into-9",
        sentence: "Please ____ the numbers.",
        options: ["key into", "look into", "turn into", "run into"],
        answer: "key into",
        hint: "To type in data.",
      },
      {
        id: "into-10",
        sentence: "He ____ his savings in the business.",
        options: ["put into", "ran into", "looked into", "turned into"],
        answer: "put into",
        hint: "To invest or contribute.",
      },
      {
        id: "into-11",
        sentence: "She ____ him to helping.",
        options: ["talked into", "ran into", "looked into", "went into"],
        answer: "talked into",
        hint: "To persuade.",
      },
      {
        id: "into-12",
        sentence: "We ____ the hill slowly.",
        options: ["drove into", "ran into", "looked into", "turned into"],
        answer: "drove into",
        hint: "To drive into a place.",
      },
      {
        id: "into-13",
        sentence: "She ____ the room and smiled.",
        options: ["walked into", "ran into", "looked into", "turned into"],
        answer: "walked into",
        hint: "To enter on foot.",
      },
      {
        id: "into-14",
        sentence: "He ____ his phone after the fall.",
        options: ["checked into", "looked into", "ran into", "got into"],
        answer: "looked into",
        hint: "To examine or investigate.",
      },
      {
        id: "into-15",
        sentence: "She ____ the couch and relaxed.",
        options: ["sank into", "ran into", "went into", "looked into"],
        answer: "sank into",
        hint: "To sink down.",
      },
      {
        id: "into-16",
        sentence: "He ____ the computer system.",
        options: ["logged into", "ran into", "looked into", "went into"],
        answer: "logged into",
        hint: "To access with credentials.",
      },
      {
        id: "into-17",
        sentence: "We ____ the topic in class.",
        options: ["dove into", "ran into", "looked into", "turned into"],
        answer: "dove into",
        hint: "To start with energy.",
      },
      {
        id: "into-18",
        sentence: "She ____ the story details.",
        options: ["went into", "ran into", "looked into", "turned into"],
        answer: "went into",
        hint: "To explain in detail.",
      },
      {
        id: "into-19",
        sentence: "He ____ a wall while parking.",
        options: ["backed into", "ran into", "looked into", "went into"],
        answer: "backed into",
        hint: "To hit while reversing.",
      },
      {
        id: "into-20",
        sentence: "She ____ a lot of effort.",
        options: ["put into", "ran into", "looked into", "went into"],
        answer: "put into",
        hint: "To invest time or effort.",
      },
    ],
  },
  {
    key: "of",
    title: "Of",
    effect: "Of often signals connection, removal, or reference.",
    questions: [
      {
        id: "of-1",
        sentence: "I cannot ____ his name.",
        options: ["think of", "care of", "get rid of", "run out of"],
        answer: "think of",
        hint: "To remember or consider.",
      },
      {
        id: "of-2",
        sentence: "Have you ever ____ that movie?",
        options: ["heard of", "taken care of", "made fun of", "got rid of"],
        answer: "heard of",
        hint: "To know about something.",
      },
      {
        id: "of-3",
        sentence: "Please ____ the kids tonight.",
        options: ["take care of", "think of", "get rid of", "run out of"],
        answer: "take care of",
        hint: "To look after.",
      },
      {
        id: "of-4",
        sentence: "We need to ____ these boxes.",
        options: ["get rid of", "take care of", "think of", "hear of"],
        answer: "get rid of",
        hint: "To remove or throw away.",
      },
      {
        id: "of-5",
        sentence: "We ____ coffee this morning.",
        options: ["ran out of", "thought of", "heard of", "took care of"],
        answer: "ran out of",
        hint: "To use the last of something.",
      },
      {
        id: "of-6",
        sentence: "He likes to ____ his friends.",
        options: ["make fun of", "get rid of", "take care of", "hear of"],
        answer: "make fun of",
        hint: "To joke about someone.",
      },
      {
        id: "of-7",
        sentence: "She is ____ long meetings.",
        options: ["tired of", "heard of", "care of", "get rid of"],
        answer: "tired of",
        hint: "To be bored or annoyed with.",
      },
      {
        id: "of-8",
        sentence: "He is ____ his work.",
        options: ["proud of", "run out of", "take care of", "make fun of"],
        answer: "proud of",
        hint: "To feel pleased about.",
      },
      {
        id: "of-9",
        sentence: "I do not ____ that idea.",
        options: ["approve of", "run out of", "get rid of", "think of"],
        answer: "approve of",
        hint: "To agree or support.",
      },
      {
        id: "of-10",
        sentence: "The team ____ five people.",
        options: ["consists of", "takes care of", "gets rid of", "runs out of"],
        answer: "consists of",
        hint: "To be made up of.",
      },
      {
        id: "of-11",
        sentence: "I often ____ traveling.",
        options: ["dream of", "hear of", "care of", "run out of"],
        answer: "dream of",
        hint: "To imagine or wish for.",
      },
      {
        id: "of-12",
        sentence: "This song ____ our trip.",
        options: ["reminds me of", "takes care of", "gets rid of", "runs out of"],
        answer: "reminds me of",
        hint: "To make you remember.",
      },
      {
        id: "of-13",
        sentence: "He tried to ____ the situation.",
        options: ["make sense of", "get rid of", "take care of", "hear of"],
        answer: "make sense of",
        hint: "To understand.",
      },
      {
        id: "of-14",
        sentence: "Please ____ the details.",
        options: ["take note of", "run out of", "get rid of", "make fun of"],
        answer: "take note of",
        hint: "To pay attention to.",
      },
      {
        id: "of-15",
        sentence: "We should ____ the risks.",
        options: ["be aware of", "run out of", "get rid of", "care of"],
        answer: "be aware of",
        hint: "To know or notice.",
      },
      {
        id: "of-16",
        sentence: "He ____ control of the meeting.",
        options: ["took control of", "ran out of", "got rid of", "heard of"],
        answer: "took control of",
        hint: "To take charge.",
      },
      {
        id: "of-17",
        sentence: "She ____ a breath of fresh air.",
        options: ["took", "got rid", "ran out", "heard"],
        answer: "took",
        hint: "To take in air.",
      },
      {
        id: "of-18",
        sentence: "He ____ advantage of the sale.",
        options: ["took", "made", "ran", "went"],
        answer: "took",
        hint: "To use an opportunity.",
      },
      {
        id: "of-19",
        sentence: "We need to ____ care of this today.",
        options: ["take", "make", "get", "run"],
        answer: "take",
        hint: "To handle a task.",
      },
      {
        id: "of-20",
        sentence: "She ____ the idea.",
        options: ["let go of", "ran out of", "heard of", "took care of"],
        answer: "let go of",
        hint: "To release or stop holding on.",
      },
    ],
  },
  {
    key: "on",
    title: "On",
    effect: "On often signals continuation, activation, or dependence.",
    questions: [
      {
        id: "on-1",
        sentence: "Please ____ the lights.",
        options: ["turn on", "hold on", "go on", "carry on"],
        answer: "turn on",
        hint: "To switch something on.",
      },
      {
        id: "on-2",
        sentence: "Can you ____ a minute?",
        options: ["hold on", "turn on", "go on", "take on"],
        answer: "hold on",
        hint: "To wait briefly.",
      },
      {
        id: "on-3",
        sentence: "Let's ____ with the story.",
        options: ["go on", "turn on", "call on", "take on"],
        answer: "go on",
        hint: "To continue.",
      },
      {
        id: "on-4",
        sentence: "He ____ a new role at work.",
        options: ["took on", "went on", "held on", "turned on"],
        answer: "took on",
        hint: "To accept responsibility.",
      },
      {
        id: "on-5",
        sentence: "She ____ her friend for help.",
        options: ["called on", "went on", "held on", "turned on"],
        answer: "called on",
        hint: "To request someone to speak or help.",
      },
      {
        id: "on-6",
        sentence: "Keep ____ until you finish.",
        options: ["going on", "holding on", "turning on", "taking on"],
        answer: "going on",
        hint: "To continue moving or doing.",
      },
      {
        id: "on-7",
        sentence: "He ____ his coat.",
        options: ["put on", "took on", "held on", "turned on"],
        answer: "put on",
        hint: "To wear clothing.",
      },
      {
        id: "on-8",
        sentence: "She ____ the music.",
        options: ["turned on", "held on", "went on", "took on"],
        answer: "turned on",
        hint: "To switch on.",
      },
      {
        id: "on-9",
        sentence: "We ____ each other for support.",
        options: ["depend on", "go on", "hold on", "take on"],
        answer: "depend on",
        hint: "To rely on.",
      },
      {
        id: "on-10",
        sentence: "He ____ working despite the noise.",
        options: ["carried on", "held on", "turned on", "took on"],
        answer: "carried on",
        hint: "To continue.",
      },
      {
        id: "on-11",
        sentence: "She ____ the message.",
        options: ["passed on", "held on", "turned on", "took on"],
        answer: "passed on",
        hint: "To share or transmit.",
      },
      {
        id: "on-12",
        sentence: "The show ____ at 8.",
        options: ["goes on", "turns on", "holds on", "takes on"],
        answer: "goes on",
        hint: "To happen or continue.",
      },
      {
        id: "on-13",
        sentence: "Please ____ the form.",
        options: ["fill in", "sign on", "go on", "take on"],
        answer: "fill in",
        hint: "To complete missing information.",
      },
      {
        id: "on-14",
        sentence: "She ____ the blame.",
        options: ["took on", "went on", "held on", "turned on"],
        answer: "took on",
        hint: "To accept responsibility.",
      },
      {
        id: "on-15",
        sentence: "He ____ about the delay.",
        options: ["went on", "turned on", "held on", "took on"],
        answer: "went on",
        hint: "To continue talking.",
      },
      {
        id: "on-16",
        sentence: "We ____ the issue later.",
        options: ["touch on", "turn on", "hold on", "take on"],
        answer: "touch on",
        hint: "To mention briefly.",
      },
      {
        id: "on-17",
        sentence: "She ____ the task quickly.",
        options: ["took on", "went on", "held on", "turned on"],
        answer: "took on",
        hint: "To accept a task.",
      },
      {
        id: "on-18",
        sentence: "Please ____ the radio.",
        options: ["turn on", "go on", "hold on", "take on"],
        answer: "turn on",
        hint: "To switch on.",
      },
      {
        id: "on-19",
        sentence: "He ____ the news to his team.",
        options: ["passed on", "held on", "turned on", "took on"],
        answer: "passed on",
        hint: "To share information.",
      },
      {
        id: "on-20",
        sentence: "She ____ with her story.",
        options: ["went on", "held on", "turned on", "took on"],
        answer: "went on",
        hint: "To continue speaking.",
      },
      {
        id: "on-21",
        sentence: "Please ____ your phone.",
        options: ["switch on", "take on", "hold on", "carry on"],
        answer: "switch on",
        hint: "To turn on.",
      },
      {
        id: "on-22",
        sentence: "He ____ a friendly tone.",
        options: ["put on", "took on", "went on", "held on"],
        answer: "put on",
        hint: "To adopt or wear.",
      },
      {
        id: "on-23",
        sentence: "She ____ the project despite the delay.",
        options: ["pressed on", "turned on", "took on", "held on"],
        answer: "pressed on",
        hint: "To continue with effort.",
      },
      {
        id: "on-24",
        sentence: "We should ____ the rules.",
        options: ["agree on", "put on", "go on", "turn on"],
        answer: "agree on",
        hint: "To reach agreement.",
      },
      {
        id: "on-25",
        sentence: "He ____ the meeting to 5.",
        options: ["moved on", "went on", "put on", "held on"],
        answer: "moved on",
        hint: "To transition to something new.",
      },
      {
        id: "on-26",
        sentence: "She ____ the dishwasher.",
        options: ["turned on", "went on", "held on", "took on"],
        answer: "turned on",
        hint: "To switch on.",
      },
      {
        id: "on-27",
        sentence: "He ____ his coat.",
        options: ["put on", "took on", "went on", "held on"],
        answer: "put on",
        hint: "To wear.",
      },
      {
        id: "on-28",
        sentence: "The teacher ____ us to stay quiet.",
        options: ["called on", "went on", "held on", "took on"],
        answer: "called on",
        hint: "To request someone to speak.",
      },
      {
        id: "on-29",
        sentence: "She ____ the message.",
        options: ["passed on", "put on", "went on", "held on"],
        answer: "passed on",
        hint: "To relay.",
      },
      {
        id: "on-30",
        sentence: "We should ____ with the plan.",
        options: ["carry on", "turn on", "hold on", "take on"],
        answer: "carry on",
        hint: "To continue.",
      },
    ],
  },
  {
    key: "over",
    title: "Over",
    effect: "Over often signals repetition, review, or completion.",
    questions: [
      {
        id: "over-1",
        sentence: "Can we ____ the plan again?",
        options: ["go over", "get over", "turn over", "hand over"],
        answer: "go over",
        hint: "To review.",
      },
      {
        id: "over-2",
        sentence: "She finally ____ the flu.",
        options: ["got over", "went over", "handed over", "turned over"],
        answer: "got over",
        hint: "To recover from illness.",
      },
      {
        id: "over-3",
        sentence: "Please ____ the keys.",
        options: ["hand over", "go over", "get over", "turn over"],
        answer: "hand over",
        hint: "To give control or possession.",
      },
      {
        id: "over-4",
        sentence: "He ____ the idea to his team.",
        options: ["passed over", "went over", "handed over", "got over"],
        answer: "passed over",
        hint: "To skip or overlook.",
      },
      {
        id: "over-5",
        sentence: "Let's ____ the details.",
        options: ["go over", "get over", "turn over", "hand over"],
        answer: "go over",
        hint: "To review carefully.",
      },
      {
        id: "over-6",
        sentence: "The meeting ____ its time.",
        options: ["ran over", "went over", "got over", "turned over"],
        answer: "ran over",
        hint: "To exceed the time limit.",
      },
      {
        id: "over-7",
        sentence: "She ____ the work to her coworker.",
        options: ["handed over", "went over", "got over", "passed over"],
        answer: "handed over",
        hint: "To give control.",
      },
      {
        id: "over-8",
        sentence: "He ____ the report again.",
        options: ["read over", "got over", "turned over", "handed over"],
        answer: "read over",
        hint: "To read to check for errors.",
      },
      {
        id: "over-9",
        sentence: "She ____ the offer.",
        options: ["turned over", "got over", "went over", "passed over"],
        answer: "turned over",
        hint: "To consider or flip to the other side.",
      },
      {
        id: "over-10",
        sentence: "He ____ the question.",
        options: ["skipped over", "got over", "handed over", "went over"],
        answer: "skipped over",
        hint: "To omit or ignore.",
      },
      {
        id: "over-11",
        sentence: "Please ____ the summary.",
        options: ["look over", "get over", "hand over", "turn over"],
        answer: "look over",
        hint: "To examine quickly.",
      },
      {
        id: "over-12",
        sentence: "She ____ the event in her mind.",
        options: ["replayed over", "went over", "got over", "handed over"],
        answer: "replayed over",
        hint: "To think again about something.",
      },
      {
        id: "over-13",
        sentence: "Let's ____ it one more time.",
        options: ["go over", "get over", "turn over", "hand over"],
        answer: "go over",
        hint: "To review.",
      },
      {
        id: "over-14",
        sentence: "He ____ his notes before class.",
        options: ["went over", "got over", "turned over", "handed over"],
        answer: "went over",
        hint: "To review.",
      },
      {
        id: "over-15",
        sentence: "She ____ the phone to her sister.",
        options: ["handed over", "went over", "got over", "turned over"],
        answer: "handed over",
        hint: "To give to someone else.",
      },
      {
        id: "over-16",
        sentence: "He ____ the limit.",
        options: ["went over", "got over", "turned over", "handed over"],
        answer: "went over",
        hint: "To exceed.",
      },
      {
        id: "over-17",
        sentence: "She ____ the instructions again.",
        options: ["went over", "got over", "handed over", "turned over"],
        answer: "went over",
        hint: "To review.",
      },
      {
        id: "over-18",
        sentence: "The storm ____ the town.",
        options: ["passed over", "went over", "got over", "turned over"],
        answer: "passed over",
        hint: "To move across.",
      },
      {
        id: "over-19",
        sentence: "Can you ____ this note to her?",
        options: ["hand over", "go over", "get over", "turn over"],
        answer: "hand over",
        hint: "To give.",
      },
      {
        id: "over-20",
        sentence: "He ____ the problem and solved it.",
        options: ["thought over", "went over", "got over", "turned over"],
        answer: "thought over",
        hint: "To think carefully.",
      },
    ],
  },
  {
    key: "through",
    title: "Through",
    effect: "Through often signals completion, connection, or moving across.",
    questions: [
      {
        id: "through-1",
        sentence: "I will ____ the report tonight.",
        options: ["go through", "get through", "run through", "pull through"],
        answer: "go through",
        hint: "To review or examine.",
      },
      {
        id: "through-2",
        sentence: "We ____ the tunnel safely.",
        options: ["went through", "got through", "ran through", "looked through"],
        answer: "went through",
        hint: "To pass from one side to another.",
      },
      {
        id: "through-3",
        sentence: "She ____ a difficult time.",
        options: ["went through", "got through", "ran through", "looked through"],
        answer: "went through",
        hint: "To experience.",
      },
      {
        id: "through-4",
        sentence: "Can you ____ to customer support?",
        options: ["get through", "go through", "run through", "pull through"],
        answer: "get through",
        hint: "To connect by phone.",
      },
      {
        id: "through-5",
        sentence: "He ____ the list quickly.",
        options: ["ran through", "went through", "got through", "pulled through"],
        answer: "ran through",
        hint: "To review quickly.",
      },
      {
        id: "through-6",
        sentence: "She ____ the papers for errors.",
        options: ["looked through", "went through", "got through", "ran through"],
        answer: "looked through",
        hint: "To examine.",
      },
      {
        id: "through-7",
        sentence: "We ____ the finals!",
        options: ["made it through", "ran through", "looked through", "went through"],
        answer: "made it through",
        hint: "To finish successfully.",
      },
      {
        id: "through-8",
        sentence: "He ____ the noise and kept reading.",
        options: ["tuned out", "got through", "went through", "ran through"],
        answer: "tuned out",
        hint: "To ignore.",
      },
      {
        id: "through-9",
        sentence: "She ____ the application.",
        options: ["filled through", "went through", "got through", "ran through"],
        answer: "went through",
        hint: "To complete a process.",
      },
      {
        id: "through-10",
        sentence: "We ____ the details once more.",
        options: ["went through", "got through", "ran through", "pulled through"],
        answer: "went through",
        hint: "To review.",
      },
      {
        id: "through-11",
        sentence: "He ____ a tough recovery.",
        options: ["pulled through", "ran through", "went through", "got through"],
        answer: "pulled through",
        hint: "To survive a difficult situation.",
      },
      {
        id: "through-12",
        sentence: "Please ____ the documents.",
        options: ["go through", "get through", "run through", "pull through"],
        answer: "go through",
        hint: "To review carefully.",
      },
      {
        id: "through-13",
        sentence: "She ____ her contacts.",
        options: ["went through", "got through", "ran through", "pulled through"],
        answer: "went through",
        hint: "To check or review.",
      },
      {
        id: "through-14",
        sentence: "We ____ the woods at night.",
        options: ["went through", "got through", "ran through", "looked through"],
        answer: "went through",
        hint: "To pass inside an area.",
      },
      {
        id: "through-15",
        sentence: "He ____ to the manager.",
        options: ["got through", "went through", "ran through", "pulled through"],
        answer: "got through",
        hint: "To reach by phone.",
      },
      {
        id: "through-16",
        sentence: "She ____ the training quickly.",
        options: ["got through", "went through", "ran through", "pulled through"],
        answer: "got through",
        hint: "To finish.",
      },
      {
        id: "through-17",
        sentence: "We ____ a lot together.",
        options: ["went through", "got through", "ran through", "pulled through"],
        answer: "went through",
        hint: "To experience.",
      },
      {
        id: "through-18",
        sentence: "He ____ the queue fast.",
        options: ["got through", "went through", "ran through", "pulled through"],
        answer: "got through",
        hint: "To pass successfully.",
      },
      {
        id: "through-19",
        sentence: "She ____ the notes again.",
        options: ["went through", "got through", "ran through", "pulled through"],
        answer: "went through",
        hint: "To review.",
      },
      {
        id: "through-20",
        sentence: "We ____ the checklist and finished.",
        options: ["went through", "got through", "ran through", "pulled through"],
        answer: "went through",
        hint: "To complete a review.",
      },
    ],
  },
  {
    key: "to",
    title: "To",
    effect: "To often signals direction, purpose, or starting an action.",
    questions: [
      {
        id: "to-1",
        sentence: "We need to ____ a decision.",
        options: ["come to", "go to", "get to", "turn to"],
        answer: "come to",
        hint: "To reach a decision.",
      },
      {
        id: "to-2",
        sentence: "Please ____ the point.",
        options: ["get to", "come to", "go to", "turn to"],
        answer: "get to",
        hint: "To reach or arrive at.",
      },
      {
        id: "to-3",
        sentence: "He ____ the truth eventually.",
        options: ["came to", "went to", "got to", "turned to"],
        answer: "came to",
        hint: "To realize.",
      },
      {
        id: "to-4",
        sentence: "She ____ help for advice.",
        options: ["turned to", "came to", "got to", "went to"],
        answer: "turned to",
        hint: "To seek support.",
      },
      {
        id: "to-5",
        sentence: "We ____ the station late.",
        options: ["got to", "came to", "went to", "turned to"],
        answer: "got to",
        hint: "To arrive at.",
      },
      {
        id: "to-6",
        sentence: "He ____ speak clearly.",
        options: ["tried to", "came to", "got to", "went to"],
        answer: "tried to",
        hint: "To attempt.",
      },
      {
        id: "to-7",
        sentence: "She ____ call you later.",
        options: ["promised to", "came to", "got to", "went to"],
        answer: "promised to",
        hint: "To make a promise.",
      },
      {
        id: "to-8",
        sentence: "We ____ fix the issue.",
        options: ["need to", "came to", "got to", "went to"],
        answer: "need to",
        hint: "To have to do something.",
      },
      {
        id: "to-9",
        sentence: "He ____ apologize.",
        options: ["has to", "came to", "got to", "went to"],
        answer: "has to",
        hint: "To be required.",
      },
      {
        id: "to-10",
        sentence: "They ____ agree on a date.",
        options: ["managed to", "came to", "got to", "went to"],
        answer: "managed to",
        hint: "To succeed in doing.",
      },
      {
        id: "to-11",
        sentence: "She ____ help him move.",
        options: ["offered to", "came to", "got to", "went to"],
        answer: "offered to",
        hint: "To volunteer.",
      },
      {
        id: "to-12",
        sentence: "We ____ the store on foot.",
        options: ["went to", "came to", "got to", "turned to"],
        answer: "went to",
        hint: "To go to a place.",
      },
      {
        id: "to-13",
        sentence: "He ____ take a break.",
        options: ["decided to", "came to", "got to", "went to"],
        answer: "decided to",
        hint: "To choose a course of action.",
      },
      {
        id: "to-14",
        sentence: "She ____ ask a question.",
        options: ["wanted to", "came to", "got to", "went to"],
        answer: "wanted to",
        hint: "To desire to do something.",
      },
      {
        id: "to-15",
        sentence: "We ____ wait for the update.",
        options: ["have to", "came to", "got to", "went to"],
        answer: "have to",
        hint: "To be required.",
      },
      {
        id: "to-16",
        sentence: "He ____ the conclusion.",
        options: ["came to", "went to", "got to", "turned to"],
        answer: "came to",
        hint: "To reach an understanding.",
      },
      {
        id: "to-17",
        sentence: "She ____ stay late.",
        options: ["agreed to", "came to", "got to", "went to"],
        answer: "agreed to",
        hint: "To accept a request.",
      },
      {
        id: "to-18",
        sentence: "We ____ finish this today.",
        options: ["need to", "came to", "got to", "went to"],
        answer: "need to",
        hint: "To be necessary.",
      },
      {
        id: "to-19",
        sentence: "He ____ help with the plan.",
        options: ["asked to", "came to", "got to", "went to"],
        answer: "asked to",
        hint: "To request to do something.",
      },
      {
        id: "to-20",
        sentence: "She ____ join the team.",
        options: ["hoped to", "came to", "got to", "went to"],
        answer: "hoped to",
        hint: "To want to do something.",
      },
    ],
  },
  {
    key: "under",
    title: "Under",
    effect: "Under often signals lower position, pressure, or control.",
    questions: [
      {
        id: "under-1",
        sentence: "We are ____ a lot of pressure.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "In a state of pressure.",
      },
      {
        id: "under-2",
        sentence: "The city is ____ construction.",
        options: ["under", "over", "around", "behind"],
        answer: "under",
        hint: "Currently in a state.",
      },
      {
        id: "under-3",
        sentence: "He ____ the new manager.",
        options: ["works under", "runs under", "goes under", "stands under"],
        answer: "works under",
        hint: "To be supervised by.",
      },
      {
        id: "under-4",
        sentence: "We are ____ budget this month.",
        options: ["under", "over", "around", "through"],
        answer: "under",
        hint: "Below the limit.",
      },
      {
        id: "under-5",
        sentence: "She kept ____ the radar.",
        options: ["under", "over", "around", "through"],
        answer: "under",
        hint: "Not noticeable.",
      },
      {
        id: "under-6",
        sentence: "The plan is ____ review.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "Being reviewed.",
      },
      {
        id: "under-7",
        sentence: "He is ____ investigation.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "Being investigated.",
      },
      {
        id: "under-8",
        sentence: "Please keep ____ the limit.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "Below a maximum.",
      },
      {
        id: "under-9",
        sentence: "She feels ____ the weather.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "Slightly ill.",
      },
      {
        id: "under-10",
        sentence: "The report is ____ his name.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "Filed or listed as.",
      },
      {
        id: "under-11",
        sentence: "He kept the key ____ the mat.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "Below something.",
      },
      {
        id: "under-12",
        sentence: "We are ____ time.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "Limited time available.",
      },
      {
        id: "under-13",
        sentence: "The team works ____ tight deadlines.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "Within constraints.",
      },
      {
        id: "under-14",
        sentence: "He is ____ a lot of stress.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "Experiencing stress.",
      },
      {
        id: "under-15",
        sentence: "The ship went ____.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "To sink.",
      },
      {
        id: "under-16",
        sentence: "She kept her notes ____ the folder.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "Below or inside.",
      },
      {
        id: "under-17",
        sentence: "The kids are ____ 12.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "Younger than.",
      },
      {
        id: "under-18",
        sentence: "This issue is ____ control now.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "Managed or controlled.",
      },
      {
        id: "under-19",
        sentence: "Please keep it ____ 200 words.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "Below the maximum.",
      },
      {
        id: "under-20",
        sentence: "We are ____ the same roof.",
        options: ["under", "over", "around", "along"],
        answer: "under",
        hint: "In the same place.",
      },
    ],
  },
  {
    key: "at",
    title: "At",
    effect: "At often signals focus, target, or a point of contact.",
    questions: [
      {
        id: "at-1",
        sentence: "Please ____ the map closely.",
        options: ["look at", "get at", "pick at", "laugh at"],
        answer: "look at",
        hint: "To focus your eyes on something.",
      },
      {
        id: "at-2",
        sentence: "We need to ____ the root cause.",
        options: ["get at", "look at", "pick at", "point at"],
        answer: "get at",
        hint: "To reach or explain the main point.",
      },
      {
        id: "at-3",
        sentence: "Stop ____ your food.",
        options: ["picking at", "looking at", "getting at", "pointing at"],
        answer: "picking at",
        hint: "To eat in small amounts without finishing.",
      },
      {
        id: "at-4",
        sentence: "She ____ the mistake.",
        options: ["pointed at", "looked at", "got at", "laughed at"],
        answer: "pointed at",
        hint: "To indicate something.",
      },
      {
        id: "at-5",
        sentence: "He ____ my joke.",
        options: ["laughed at", "looked at", "got at", "aimed at"],
        answer: "laughed at",
        hint: "To find something funny.",
      },
      {
        id: "at-6",
        sentence: "Don't ____ her accent.",
        options: ["laugh at", "look at", "get at", "pick at"],
        answer: "laugh at",
        hint: "To mock or make fun of.",
      },
      {
        id: "at-7",
        sentence: "He ____ a solution.",
        options: ["arrived at", "looked at", "pointed at", "picked at"],
        answer: "arrived at",
        hint: "To reach a conclusion.",
      },
      {
        id: "at-8",
        sentence: "We should ____ the problem from another angle.",
        options: ["look at", "get at", "pick at", "aim at"],
        answer: "look at",
        hint: "To examine or consider.",
      },
      {
        id: "at-9",
        sentence: "He kept ____ the same topic.",
        options: ["going at", "looking at", "getting at", "pointing at"],
        answer: "going at",
        hint: "To continue doing something.",
      },
      {
        id: "at-10",
        sentence: "She ____ the kids to be quiet.",
        options: ["snapped at", "looked at", "got at", "picked at"],
        answer: "snapped at",
        hint: "To speak sharply or angrily.",
      },
      {
        id: "at-11",
        sentence: "He ____ his phone all day.",
        options: ["glanced at", "got at", "picked at", "arrived at"],
        answer: "glanced at",
        hint: "To look briefly.",
      },
      {
        id: "at-12",
        sentence: "She ____ the sign to show us.",
        options: ["pointed at", "laughed at", "picked at", "got at"],
        answer: "pointed at",
        hint: "To indicate with a finger.",
      },
      {
        id: "at-13",
        sentence: "He kept ____ the paint on the wall.",
        options: ["picking at", "looking at", "getting at", "aiming at"],
        answer: "picking at",
        hint: "To pull at in small bits.",
      },
      {
        id: "at-14",
        sentence: "She ____ the target.",
        options: ["aimed at", "looked at", "picked at", "laughed at"],
        answer: "aimed at",
        hint: "To direct toward a target.",
      },
      {
        id: "at-15",
        sentence: "He was ____ the clock all meeting.",
        options: ["looking at", "getting at", "picking at", "arriving at"],
        answer: "looking at",
        hint: "To watch or check.",
      },
      {
        id: "at-16",
        sentence: "She ____ my idea and improved it.",
        options: ["looked at", "got at", "picked at", "laughed at"],
        answer: "looked at",
        hint: "To review or consider.",
      },
      {
        id: "at-17",
        sentence: "He ____ the main point in his summary.",
        options: ["got at", "looked at", "picked at", "pointed at"],
        answer: "got at",
        hint: "To express the real meaning.",
      },
      {
        id: "at-18",
        sentence: "She ____ the crowd with a smile.",
        options: ["looked at", "got at", "picked at", "snapped at"],
        answer: "looked at",
        hint: "To direct your eyes toward.",
      },
      {
        id: "at-19",
        sentence: "He ____ the button by mistake.",
        options: ["pressed at", "got at", "looked at", "picked at"],
        answer: "pressed at",
        hint: "To push on something.",
      },
      {
        id: "at-20",
        sentence: "She ____ the problem all morning.",
        options: ["worked at", "looked at", "picked at", "laughed at"],
        answer: "worked at",
        hint: "To spend time doing.",
      },
    ],
  },
  {
    key: "onto",
    title: "Onto",
    effect: "Onto often signals moving to a surface or transition to a new state.",
    questions: [
      {
        id: "onto-1",
        sentence: "He ____ the stage confidently.",
        options: ["stepped onto", "fell onto", "jumped onto", "moved onto"],
        answer: "stepped onto",
        hint: "To step onto a surface.",
      },
      {
        id: "onto-2",
        sentence: "She ____ the bus quickly.",
        options: ["jumped onto", "stepped onto", "moved onto", "climbed onto"],
        answer: "jumped onto",
        hint: "To jump onto a surface.",
      },
      {
        id: "onto-3",
        sentence: "The cat ____ the table.",
        options: ["leaped onto", "moved onto", "got onto", "turned onto"],
        answer: "leaped onto",
        hint: "To jump onto.",
      },
      {
        id: "onto-4",
        sentence: "He ____ the next topic.",
        options: ["moved onto", "got onto", "turned onto", "went onto"],
        answer: "moved onto",
        hint: "To transition to a new subject.",
      },
      {
        id: "onto-5",
        sentence: "She ____ the highway.",
        options: ["merged onto", "moved onto", "turned onto", "got onto"],
        answer: "merged onto",
        hint: "To join traffic on a road.",
      },
      {
        id: "onto-6",
        sentence: "We should ____ the next task.",
        options: ["move onto", "get onto", "step onto", "turn onto"],
        answer: "move onto",
        hint: "To proceed to the next step.",
      },
      {
        id: "onto-7",
        sentence: "He ____ the chair to reach the shelf.",
        options: ["climbed onto", "moved onto", "turned onto", "got onto"],
        answer: "climbed onto",
        hint: "To climb to a surface.",
      },
      {
        id: "onto-8",
        sentence: "She ____ the couch and sat down.",
        options: ["sat onto", "fell onto", "got onto", "moved onto"],
        answer: "sat onto",
        hint: "To sit down on a surface.",
      },
      {
        id: "onto-9",
        sentence: "The dog ____ the bed.",
        options: ["hopped onto", "moved onto", "got onto", "turned onto"],
        answer: "hopped onto",
        hint: "To hop onto a surface.",
      },
      {
        id: "onto-10",
        sentence: "We ____ the next slide.",
        options: ["moved onto", "got onto", "stepped onto", "turned onto"],
        answer: "moved onto",
        hint: "To proceed to the next item.",
      },
      {
        id: "onto-11",
        sentence: "He ____ the roof to fix the antenna.",
        options: ["climbed onto", "moved onto", "got onto", "turned onto"],
        answer: "climbed onto",
        hint: "To climb onto a surface.",
      },
      {
        id: "onto-12",
        sentence: "She ____ the train just in time.",
        options: ["got onto", "moved onto", "stepped onto", "turned onto"],
        answer: "got onto",
        hint: "To board or get on.",
      },
      {
        id: "onto-13",
        sentence: "The child ____ the swing.",
        options: ["climbed onto", "moved onto", "turned onto", "got onto"],
        answer: "climbed onto",
        hint: "To climb onto.",
      },
      {
        id: "onto-14",
        sentence: "She ____ the topic about travel.",
        options: ["moved onto", "got onto", "turned onto", "went onto"],
        answer: "moved onto",
        hint: "To shift to a new subject.",
      },
      {
        id: "onto-15",
        sentence: "He ____ the sidewalk.",
        options: ["stepped onto", "moved onto", "got onto", "turned onto"],
        answer: "stepped onto",
        hint: "To step onto a surface.",
      },
      {
        id: "onto-16",
        sentence: "We ____ the final section.",
        options: ["moved onto", "got onto", "turned onto", "stepped onto"],
        answer: "moved onto",
        hint: "To proceed.",
      },
      {
        id: "onto-17",
        sentence: "She ____ the stage after the intro.",
        options: ["walked onto", "moved onto", "turned onto", "got onto"],
        answer: "walked onto",
        hint: "To walk onto a surface.",
      },
      {
        id: "onto-18",
        sentence: "He ____ the boat carefully.",
        options: ["stepped onto", "moved onto", "got onto", "turned onto"],
        answer: "stepped onto",
        hint: "To step onto something.",
      },
      {
        id: "onto-19",
        sentence: "They ____ the next point.",
        options: ["moved onto", "got onto", "turned onto", "stepped onto"],
        answer: "moved onto",
        hint: "To continue to the next point.",
      },
      {
        id: "onto-20",
        sentence: "She ____ the stool to reach the shelf.",
        options: ["stood onto", "moved onto", "got onto", "climbed onto"],
        answer: "stood onto",
        hint: "To stand on top of.",
      },
    ],
  },
  {
    key: "upon",
    title: "Upon",
    effect: "Upon often signals formal action, reliance, or immediate response.",
    questions: [
      {
        id: "upon-1",
        sentence: "We can ____ your support.",
        options: ["count upon", "call upon", "rely upon", "decide upon"],
        answer: "count upon",
        hint: "To depend on.",
      },
      {
        id: "upon-2",
        sentence: "Please ____ your manager for approval.",
        options: ["call upon", "count upon", "rely upon", "decide upon"],
        answer: "call upon",
        hint: "To request help.",
      },
      {
        id: "upon-3",
        sentence: "They ____ him to speak.",
        options: ["called upon", "counted upon", "relied upon", "decided upon"],
        answer: "called upon",
        hint: "To invite or request.",
      },
      {
        id: "upon-4",
        sentence: "We ____ the plan together.",
        options: ["agreed upon", "relied upon", "called upon", "counted upon"],
        answer: "agreed upon",
        hint: "To reach agreement.",
      },
      {
        id: "upon-5",
        sentence: "They ____ a new policy.",
        options: ["decided upon", "relied upon", "counted upon", "called upon"],
        answer: "decided upon",
        hint: "To choose or determine.",
      },
      {
        id: "upon-6",
        sentence: "We ____ the details yesterday.",
        options: ["touched upon", "called upon", "counted upon", "relied upon"],
        answer: "touched upon",
        hint: "To mention briefly.",
      },
      {
        id: "upon-7",
        sentence: "The plan ____ immediate action.",
        options: ["depends upon", "calls upon", "counts upon", "relies upon"],
        answer: "depends upon",
        hint: "To rely on.",
      },
      {
        id: "upon-8",
        sentence: "She ____ the chance to travel.",
        options: ["seized upon", "called upon", "counted upon", "relied upon"],
        answer: "seized upon",
        hint: "To take quickly.",
      },
      {
        id: "upon-9",
        sentence: "He ____ the opportunity to speak.",
        options: ["jumped upon", "called upon", "counted upon", "relied upon"],
        answer: "jumped upon",
        hint: "To react eagerly.",
      },
      {
        id: "upon-10",
        sentence: "We ____ your honesty.",
        options: ["rely upon", "call upon", "count upon", "decide upon"],
        answer: "rely upon",
        hint: "To trust and depend on.",
      },
      {
        id: "upon-11",
        sentence: "They ____ a solution.",
        options: ["hit upon", "call upon", "count upon", "rely upon"],
        answer: "hit upon",
        hint: "To discover by chance.",
      },
      {
        id: "upon-12",
        sentence: "The committee ____ a final vote.",
        options: ["settled upon", "called upon", "counted upon", "relied upon"],
        answer: "settled upon",
        hint: "To decide after discussion.",
      },
      {
        id: "upon-13",
        sentence: "She ____ the issue in her speech.",
        options: ["touched upon", "called upon", "counted upon", "relied upon"],
        answer: "touched upon",
        hint: "To mention briefly.",
      },
      {
        id: "upon-14",
        sentence: "We ____ an agreement.",
        options: ["reached upon", "agreed upon", "called upon", "counted upon"],
        answer: "agreed upon",
        hint: "To agree on something.",
      },
      {
        id: "upon-15",
        sentence: "He ____ his team for support.",
        options: ["called upon", "counted upon", "relied upon", "decided upon"],
        answer: "called upon",
        hint: "To ask for help.",
      },
      {
        id: "upon-16",
        sentence: "They ____ the final design.",
        options: ["decided upon", "called upon", "counted upon", "relied upon"],
        answer: "decided upon",
        hint: "To choose.",
      },
      {
        id: "upon-17",
        sentence: "She ____ a great idea.",
        options: ["hit upon", "called upon", "counted upon", "relied upon"],
        answer: "hit upon",
        hint: "To find suddenly.",
      },
      {
        id: "upon-18",
        sentence: "We ____ this only once.",
        options: ["agreed upon", "called upon", "counted upon", "relied upon"],
        answer: "agreed upon",
        hint: "To agree.",
      },
      {
        id: "upon-19",
        sentence: "The plan ____ good timing.",
        options: ["depends upon", "calls upon", "counts upon", "relies upon"],
        answer: "depends upon",
        hint: "To rely on a condition.",
      },
      {
        id: "upon-20",
        sentence: "They ____ the task quickly.",
        options: ["took upon", "decided upon", "relied upon", "counted upon"],
        answer: "took upon",
        hint: "To accept responsibility.",
      },
    ],
  },
  {
    key: "multiword",
    title: "Multi-word Particles",
    effect: "Multi-word particles like out of, up to, down on, and in on.",
    questions: [
      {
        id: "multiword-1",
        sentence: "We ____ milk again.",
        options: ["ran out of", "came out of", "looked out of", "got out of"],
        answer: "ran out of",
        hint: "To have no more of something.",
      },
      {
        id: "multiword-2",
        sentence: "He ____ a lot of the meeting.",
        options: ["tuned out of", "ran out of", "looked out of", "got out of"],
        answer: "tuned out of",
        hint: "To stop paying attention.",
      },
      {
        id: "multiword-3",
        sentence: "She ____ trouble as a teen.",
        options: ["got into", "got out of", "ran out of", "took out of"],
        answer: "got into",
        hint: "To become involved in something.",
      },
      {
        id: "multiword-4",
        sentence: "We ____ time to finish.",
        options: ["ran out of", "got out of", "came out of", "looked out of"],
        answer: "ran out of",
        hint: "To use the last of something.",
      },
      {
        id: "multiword-5",
        sentence: "He ____ the agreement.",
        options: ["got out of", "came out of", "ran out of", "looked out of"],
        answer: "got out of",
        hint: "To avoid or escape a duty.",
      },
      {
        id: "multiword-6",
        sentence: "She ____ the story.",
        options: ["made up", "made out of", "made up to", "made down on"],
        answer: "made out of",
        hint: "To be composed of.",
      },
      {
        id: "multiword-7",
        sentence: "We ____ it in time.",
        options: ["made it", "made it up to", "made it out of", "made it down on"],
        answer: "made it",
        hint: "To arrive or succeed.",
      },
      {
        id: "multiword-8",
        sentence: "The team is ____ the challenge.",
        options: ["up to", "out of", "down on", "in on"],
        answer: "up to",
        hint: "To be capable of.",
      },
      {
        id: "multiword-9",
        sentence: "I'm ____ a movie tonight.",
        options: ["up to", "out of", "down on", "in on"],
        answer: "up to",
        hint: "To plan or intend to.",
      },
      {
        id: "multiword-10",
        sentence: "He's been ____ himself lately.",
        options: ["down on", "up to", "out of", "in on"],
        answer: "down on",
        hint: "To feel negative about.",
      },
      {
        id: "multiword-11",
        sentence: "Don't be so ____ your teammates.",
        options: ["down on", "up to", "out of", "in on"],
        answer: "down on",
        hint: "To be critical of.",
      },
      {
        id: "multiword-12",
        sentence: "He let me ____ the secret.",
        options: ["in on", "up to", "out of", "down on"],
        answer: "in on",
        hint: "To include in information or plans.",
      },
      {
        id: "multiword-13",
        sentence: "We are ____ budget this month.",
        options: ["over", "under", "up to", "down on"],
        answer: "under",
        hint: "Below the limit.",
      },
      {
        id: "multiword-14",
        sentence: "He is ____ his old habits.",
        options: ["out of", "up to", "down on", "in on"],
        answer: "out of",
        hint: "No longer having.",
      },
      {
        id: "multiword-15",
        sentence: "She got ____ the meeting early.",
        options: ["out of", "up to", "down on", "in on"],
        answer: "out of",
        hint: "To avoid.",
      },
      {
        id: "multiword-16",
        sentence: "They brought me ____ the plan.",
        options: ["in on", "up to", "out of", "down on"],
        answer: "in on",
        hint: "To include in a plan.",
      },
      {
        id: "multiword-17",
        sentence: "We are ____ options.",
        options: ["out of", "up to", "down on", "in on"],
        answer: "out of",
        hint: "Having none left.",
      },
      {
        id: "multiword-18",
        sentence: "He is not ____ the task.",
        options: ["up to", "out of", "down on", "in on"],
        answer: "up to",
        hint: "Not capable.",
      },
      {
        id: "multiword-19",
        sentence: "She is ____ the game.",
        options: ["in on", "up to", "out of", "down on"],
        answer: "in on",
        hint: "Included or involved.",
      },
      {
        id: "multiword-20",
        sentence: "I'm ____ energy today.",
        options: ["out of", "up to", "down on", "in on"],
        answer: "out of",
        hint: "Having none left.",
      },
    ],
  },
  {
    key: "mock",
    title: "Mock Test",
    effect: "Mixed set from all categories.",
    questions: [],
  },
]

function shuffle<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function PracticeLabPage() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<"list" | "setup" | "quiz" | "result">("list")
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [questionCount, setQuestionCount] = useState(5)
  const [displayCount, setDisplayCount] = useState(5)
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [maxIndexReached, setMaxIndexReached] = useState(0)
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [shownHints, setShownHints] = useState<Record<string, boolean>>({})
  const [finalScore, setFinalScore] = useState(0)
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null)
  const [quizDurationMs, setQuizDurationMs] = useState(0)
  const categoryLimits = useMemo(() => ({
    off: 30,
    up: 30,
    out: 30,
    in: 30,
    on: 30,
  }), [])

  const questionPool = useMemo(() => {
    if (!activeCategory) return []
    if (activeCategory.key === "mock") {
      return CATEGORIES.filter((cat) => cat.key !== "mock").flatMap((cat) => cat.questions)
    }
    return activeCategory.questions
  }, [activeCategory])

  const maxPerCategory = useMemo(() => {
    if (!activeCategory) return 0
    if (activeCategory.key === "mock") return Math.min(20, questionPool.length)
    const limit = categoryLimits[activeCategory.key as keyof typeof categoryLimits] || 20
    return Math.min(limit, questionPool.length)
  }, [activeCategory, categoryLimits, questionPool])

  const answeredCount = useMemo(() => {
    if (view !== "quiz") return 0
    return quizQuestions.filter((q) => selected[q.id]).length
  }, [currentIndex, quizQuestions.length, view])

  useEffect(() => {
    if (displayCount === questionCount) return
    let rafId = 0
    const step = () => {
      setDisplayCount((prev) => {
        if (prev === questionCount) return prev
        const diff = questionCount - prev
        const next = prev + Math.sign(diff) * Math.max(1, Math.ceil(Math.abs(diff) / 6))
        return next
      })
      rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [questionCount, displayCount])

  useEffect(() => {
    if (view === "quiz") return
    setQuizStartTime(null)
  }, [view])

  useEffect(() => {
    const resetToken = searchParams.get("reset")
    if (!resetToken) return
    setSelected({})
    setShownHints({})
    setQuizQuestions([])
    setFinalScore(0)
    setActiveCategory(null)
    setView("list")
  }, [searchParams])

  function handlePick(questionId: string, option: string) {
    setSelected((prev) => ({ ...prev, [questionId]: option }))
  }

  function resetAllToList() {
    setSelected({})
    setShownHints({})
    setQuizQuestions([])
    setFinalScore(0)
    setActiveCategory(null)
    setView("list")
  }

  function chooseCategory(cat: Category) {
    setActiveCategory(cat)
    const pool = cat.key === "mock"
      ? CATEGORIES.filter((item) => item.key !== "mock").flatMap((item) => item.questions)
      : cat.questions
    const limit = cat.key === "mock" ? 20 : (categoryLimits[cat.key as keyof typeof categoryLimits] || 20)
    const maxQuestions = Math.min(limit, pool.length)
    const initialCount = Math.min(5, maxQuestions)
    setQuestionCount(initialCount)
    setDisplayCount(initialCount)
    setSelected({})
    setShownHints({})
    setQuizQuestions([])
    setFinalScore(0)
    setView("setup")
  }

  function startQuiz() {
    if (!activeCategory) return
    const pool = activeCategory.key === "mock"
      ? CATEGORIES.filter((item) => item.key !== "mock").flatMap((item) => item.questions)
      : activeCategory.questions
    const limit = activeCategory.key === "mock"
      ? 20
      : (categoryLimits[activeCategory.key as keyof typeof categoryLimits] || 20)
    const maxQuestions = Math.min(limit, pool.length)
    const count = Math.max(1, Math.min(questionCount, maxQuestions))
    const selectedQuestions = shuffle(pool)
      .slice(0, count)
      .map((q) => ({ ...q, options: shuffle(q.options) }))
    setSelected({})
    setShownHints({})
    setFinalScore(0)
    setQuizQuestions(selectedQuestions)
    setCurrentIndex(0)
    setMaxIndexReached(0)
    setQuizDurationMs(0)
    setQuizStartTime(Date.now())
    setView("quiz")
  }

  function retryCategory() {
    if (!activeCategory) return
    startQuiz()
  }

  function goToNext() {
    setCurrentIndex((prev) => Math.min(prev + 1, quizQuestions.length - 1))
    setMaxIndexReached((prev) => Math.max(prev, currentIndex + 1))
  }

  function goToPrevious() {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  function finishQuiz() {
    const score = quizQuestions.reduce((sum, q) => (selected[q.id] === q.answer ? sum + 1 : sum), 0)
    setFinalScore(score)
    if (quizStartTime) {
      setQuizDurationMs(Date.now() - quizStartTime)
    }
    setView("result")
  }

  return (
    <main className="min-h-screen">
      <section className="py-10 sm:py-14">
        <div className="rounded-[2rem] bg-white/80 shadow-card">
          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-4xl text-brand-900">Everyday Phrasal Verbs</h1>
            <p className="text-sm sm:text-base text-gray-700 max-w-2xl">
              Fill in the blank with the best option. Each category shows how the particle (off, up, down, etc.)
              shifts the overall meaning.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        {view === "list" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-700">Category</p>
              <span className="text-xs text-gray-500">{CATEGORIES.length} options</span>
            </div>
            <ul className="space-y-3">
            {CATEGORIES.map((cat) => (
              <li key={cat.key}>
                <button
                  type="button"
                  onClick={() => chooseCategory(cat)}
                  className="w-full cursor-pointer text-left rounded-2xl border border-brand-200/60 bg-white/85 p-4 sm:p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-serif text-xl text-brand-900">{cat.title}</h2>
                      <p className="mt-2 inline-flex rounded-md px-0 py-0 text-xs font-medium text-gray-600">
                        {cat.effect}
                      </p>
                    </div>
                    <div className="inline-flex items-center rounded-lg border border-brand-200/70 bg-brand-100/40 px-3 py-1.5 text-xs font-medium text-brand-900">
                      Start
                    </div>
                  </div>
                </button>
              </li>
            ))}
            </ul>
          </div>
        )}

        {view === "setup" && activeCategory && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={resetAllToList}
              className="inline-flex cursor-pointer items-center rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-900 hover:bg-brand-100/50"
            >
              <span className="mr-2 text-base leading-none">←</span>
              Go back
            </button>
            <div className="rounded-[1.5rem] border border-brand-200/60 bg-white/85 p-4 sm:p-5 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-700">Selected Category</p>
                <h2 className="mt-2 font-serif text-2xl text-brand-900">{activeCategory.title}</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <label htmlFor="question-count" className="text-sm font-medium text-gray-700">
                  How many questions do you want to answer?
                </label>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <input
                      id="question-count"
                      type="range"
                      min={1}
                      max={maxPerCategory}
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full question-slider transition-all duration-200"
                    />
                    <span className="min-w-[3rem] text-sm font-semibold text-brand-900">{displayCount}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Max per category: {maxPerCategory}.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={startQuiz}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-emerald-500 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:from-emerald-500 hover:to-emerald-700"
              >
                Start quiz
                <span aria-hidden className="text-base">→</span>
              </button>
            </div>
          </div>
          </div>
        )}

        {view === "quiz" && activeCategory && (
          <div className="space-y-6">
            <div className="space-y-2">
              <button
                type="button"
                onClick={resetAllToList}
                className="inline-flex cursor-pointer items-center rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-900 hover:bg-brand-100/50"
              >
                Back to categories
              </button>
              <div className="rounded-[2rem] border border-brand-200/60 bg-white/85 p-6 sm:p-8 shadow-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-700">Category</p>
                  <h2 className="mt-2 font-serif text-2xl text-brand-900">{activeCategory.title}</h2>
                  <p className="mt-2 inline-flex rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white">
                    {activeCategory.effect}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900">
                  <div className="font-semibold">Progress</div>
                  <div className="text-xl font-semibold">
                    {answeredCount} / {quizQuestions.length}
                  </div>
                </div>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-100/60">
                <div
                  className="h-full rounded-full bg-brand-900 transition-all"
                  style={{ width: `${quizQuestions.length ? (answeredCount / quizQuestions.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            </div>

            <div className="rounded-2xl border border-brand-200/60 bg-white p-4 sm:p-5">
              {quizQuestions.length > 0 && (
                (() => {
                  const q = quizQuestions[currentIndex]
                  const selectedOption = selected[q.id]
                  const isAnswered = Boolean(selectedOption)
                  const isCorrect = selectedOption === q.answer
                  const isLast = currentIndex === quizQuestions.length - 1
                  const isHintShown = Boolean(shownHints[q.id])
                  const isReviewing = currentIndex < maxIndexReached && Boolean(selectedOption)
                  return (
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Question {currentIndex + 1} of {quizQuestions.length}</span>
                        <span>{activeCategory.title}</span>
                      </div>
                      <p className="mt-2 text-base font-semibold text-gray-800">{q.sentence}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShownHints((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                          className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          {isHintShown ? "Hide hint" : "Show hint"}
                        </button>
                        {isHintShown && <span className="text-xs text-gray-600">{q.hint}</span>}
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {q.options.map((option, idx) => {
                          const isChosen = selectedOption === option
                          const showCorrect = isAnswered && option === q.answer
                          const showWrong = isAnswered && isChosen && option !== q.answer
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handlePick(q.id, option)}
                              disabled={isReviewing}
                              className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                                showCorrect
                                  ? "border-emerald-400 bg-emerald-100 text-emerald-900 shadow-sm"
                                  : showWrong
                                    ? "border-rose-300 bg-rose-50 text-rose-700 shadow-sm"
                                    : isChosen
                                      ? "border-brand-500 bg-brand-200/40 text-brand-900 shadow-sm"
                                      : "border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-100/50"
                              }`}
                            >
                              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-current text-[11px]">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              {option}
                            </button>
                          )
                        })}
                      </div>
                      {isAnswered && (
                        <p className={`mt-2 text-sm ${isCorrect ? "text-emerald-700" : "text-rose-600"}`}>
                          {isCorrect ? "Correct." : `Not quite. The correct answer is "${q.answer}".`}
                        </p>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {isReviewing ? "Review mode." : "Choose one option to continue."}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={goToPrevious}
                            disabled={currentIndex === 0}
                            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition ${
                              currentIndex > 0
                                ? "cursor-pointer border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-100/50"
                                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <span aria-hidden>←</span>
                            Previous
                          </button>
                        {isLast ? (
                          <button
                            type="button"
                            onClick={finishQuiz}
                            disabled={!isAnswered}
                            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition ${
                              isAnswered
                                ? "cursor-pointer border-[var(--color-brand-900)] bg-[var(--color-brand-900)] text-white hover:bg-[var(--color-brand-700)]"
                                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Finish quiz
                            <span aria-hidden>→</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={goToNext}
                            disabled={!isAnswered}
                            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition ${
                              isAnswered
                                ? "cursor-pointer border-[var(--color-brand-900)] bg-[var(--color-brand-900)] text-white hover:bg-[var(--color-brand-700)]"
                                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Next question
                            <span aria-hidden>→</span>
                          </button>
                        )}
                        </div>
                      </div>
                    </div>
                  )
                })()
              )}
            </div>
          </div>
        )}

        {view === "result" && activeCategory && (
          <div className="rounded-[2rem] border border-brand-200/60 bg-white/85 p-6 sm:p-8 shadow-card">
            {(() => {
              const total = quizQuestions.length || 1
              const correctPct = Math.round((finalScore / total) * 100)
              const incorrectPct = 100 - correctPct
              const seconds = Math.max(0, Math.round(quizDurationMs / 1000))
              const minutes = Math.floor(seconds / 60)
              const remaining = seconds % 60
              const timeLabel = minutes > 0 ? `${minutes}m ${String(remaining).padStart(2, "0")}s` : `${remaining}s`
              return (
                <div className="space-y-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-brand-700">Result</p>
                      <h2 className="mt-2 font-serif text-2xl text-brand-900">{activeCategory.title}</h2>
                      <p className="mt-2 text-sm text-gray-700">
                        Completed: {quizQuestions.length} questions • Time: {timeLabel}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900">
                      <div className="font-semibold">Score</div>
                      <div className="text-xl font-semibold">
                        {finalScore} / {quizQuestions.length}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Accuracy</p>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className="flex h-full w-full">
                        <div className="h-full bg-emerald-400" style={{ width: `${correctPct}%` }} />
                        <div className="h-full bg-rose-300" style={{ width: `${incorrectPct}%` }} />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="inline-flex items-center gap-2 text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Correct: {correctPct}%
                      </span>
                      <span className="inline-flex items-center gap-2 text-rose-600">
                        <span className="h-2 w-2 rounded-full bg-rose-300" />
                        Incorrect: {incorrectPct}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })()}
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={retryCategory}
                className="inline-flex cursor-pointer items-center rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-900 hover:bg-brand-100/50"
              >
                Retry category
              </button>
              <button
                type="button"
                onClick={resetAllToList}
                className="inline-flex cursor-pointer items-center rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-900 hover:bg-brand-100/50"
              >
                Back to categories
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
