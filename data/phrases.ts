export type DeckItem = {
  id: string
  type: "phrase" | "phrasal"
  phrase: string
  meaning: string
  example: string
  source?: { slug: string; title: string }
}

export const PHRASES: DeckItem[] = [
  { id: "p-running-late", type: "phrase", phrase: "I'm running late", meaning: "I'll arrive later than planned", example: "Sorry, I'm running late — be there in 10 minutes." },
  { id: "p-rain-check", type: "phrase", phrase: "I'll take a rain check", meaning: "I'll pass for now, maybe later", example: "Thanks for the invite, but I'll take a rain check tonight." },
  { id: "p-its-up-to-you", type: "phrase", phrase: "It's up to you", meaning: "You decide", example: "We can cook or order in — it's up to you." },
  { id: "p-let-me-know", type: "phrase", phrase: "Let me know", meaning: "Tell me / keep me updated", example: "Let me know if you need any help." },
  { id: "p-no-worries", type: "phrase", phrase: "No worries", meaning: "That's okay / not a problem", example: "No worries — it happens to everyone." },
  { id: "p-what-up-to", type: "phrase", phrase: "What are you up to?", meaning: "What are you doing?", example: "Hey! What are you up to this weekend?" },
  { id: "p-grab-a-bite", type: "phrase", phrase: "Grab a bite", meaning: "Have something quick to eat", example: "Let's grab a bite after work." },
  { id: "p-heads-up", type: "phrase", phrase: "Heads up", meaning: "Warning / notice in advance", example: "Just a heads up — the train is delayed." },
  { id: "p-sounds-good", type: "phrase", phrase: "Sounds good", meaning: "That works for me", example: "Lunch at 1? — Sounds good." },
  { id: "p-works-for-me", type: "phrase", phrase: "Works for me", meaning: "It suits me / okay", example: "Tuesday morning works for me." },
  { id: "p-ill-get-back", type: "phrase", phrase: "I'll get back to you", meaning: "I'll reply later", example: "Let me check the schedule and I'll get back to you." },
  { id: "p-do-you-mind", type: "phrase", phrase: "Do you mind if…?", meaning: "Is it okay if…?", example: "Do you mind if I open the window?" },
  { id: "p-id-rather-not", type: "phrase", phrase: "I'd rather not", meaning: "I prefer not to", example: "I'd rather not go out tonight — I'm tired." },
  { id: "p-that-makes-sense", type: "phrase", phrase: "That makes sense", meaning: "I understand", example: "We need more time? That makes sense." },
  { id: "p-fair-enough", type: "phrase", phrase: "Fair enough", meaning: "That's reasonable", example: "We’ll postpone it — fair enough." },
  { id: "p-looking-forward", type: "phrase", phrase: "I'm looking forward to it", meaning: "I'm excited about it", example: "Our trip is next month — I'm looking forward to it." },
  { id: "p-on-my-way", type: "phrase", phrase: "I'm on my way", meaning: "I'm coming now", example: "Traffic was slow, but I'm on my way." },
  { id: "p-sorry-to-bother", type: "phrase", phrase: "Sorry to bother you", meaning: "Polite way to interrupt", example: "Sorry to bother you — could you sign this?" },
  { id: "p-by-the-way", type: "phrase", phrase: "By the way", meaning: "Changing topic / adding info", example: "By the way, did you get my email?" },
  { id: "p-at-the-end", type: "phrase", phrase: "At the end of the day", meaning: "Ultimately / in conclusion", example: "At the end of the day, health comes first." },
  // Episode 1 — Morning Coffee
  { id: "e1-i-make-mine-at-home", type: "phrase", phrase: "I make mine at home", meaning: "I prepare it in my house", example: "I make mine at home — it’s cheaper and quick.", source: { slug: "morning-coffee-1", title: "Episode 1 — Morning Coffee" } },
  { id: "e1-i-grab-one-on-my-way", type: "phrase", phrase: "I grab one on my way", meaning: "I buy it while going somewhere", example: "On busy days, I grab one on my way to work.", source: { slug: "morning-coffee-1", title: "Episode 1 — Morning Coffee" } },
  { id: "e1-first-thing-in-the-morning", type: "phrase", phrase: "First thing in the morning", meaning: "Immediately after waking up", example: "First thing in the morning, I drink a glass of water.", source: { slug: "morning-coffee-1", title: "Episode 1 — Morning Coffee" } },
  { id: "e1-it-helps-me-wake-up", type: "phrase", phrase: "It helps me wake up", meaning: "It makes me feel more awake", example: "A quick stretch helps me wake up.", source: { slug: "morning-coffee-1", title: "Episode 1 — Morning Coffee" } },
  // Episode 2 — Cooking Dinner
  { id: "e2-quick-go-to-meal", type: "phrase", phrase: "My quick go‑to meal", meaning: "A fast meal I often choose", example: "On weeknights, my quick go‑to meal is pasta and veggies.", source: { slug: "cooking-dinner-2", title: "Episode 2 — Cooking Dinner" } },
  { id: "e2-throw-something-together", type: "phrase", phrase: "Throw something together", meaning: "Prepare something fast without a plan", example: "I can throw something together with eggs and rice.", source: { slug: "cooking-dinner-2", title: "Episode 2 — Cooking Dinner" } },
  { id: "e2-prep-ahead", type: "phrase", phrase: "Prep ahead", meaning: "Prepare things in advance", example: "I like to prep ahead on Sundays.", source: { slug: "cooking-dinner-2", title: "Episode 2 — Cooking Dinner" } },
  { id: "e2-heat-up-leftovers", type: "phrase", phrase: "Heat up leftovers", meaning: "Warm food saved from before", example: "If I’m tired, I heat up leftovers.", source: { slug: "cooking-dinner-2", title: "Episode 2 — Cooking Dinner" } },
  // Episode 3 — Decisions… Decisions…
  { id: "e3-make-a-pros-and-cons-list", type: "phrase", phrase: "Make a pros and cons list", meaning: "Write positives and negatives to compare options", example: "When I'm stuck, I make a pros and cons list.", source: { slug: "decisions-decisions-3", title: "Episode 3 — Decisions… Decisions…" } },
  { id: "e3-second-guess-myself", type: "phrase", phrase: "Second‑guess myself", meaning: "Doubt my own decision after choosing", example: "I tend to second‑guess myself after big choices.", source: { slug: "decisions-decisions-3", title: "Episode 3 — Decisions… Decisions…" } },
  { id: "e3-keep-it-simple", type: "phrase", phrase: "Keep it simple", meaning: "Avoid overcomplicating the decision", example: "To avoid overthinking, I try to keep it simple.", source: { slug: "decisions-decisions-3", title: "Episode 3 — Decisions… Decisions…" } },
  { id: "e3-stick-with-it", type: "phrase", phrase: "Stick with it", meaning: "Continue with a decision once chosen", example: "Once I decide, I stick with it and move on.", source: { slug: "decisions-decisions-3", title: "Episode 3 — Decisions… Decisions…" } },
  // Episode 4 — One Bus an Hour
  { id: "e4-one-bus-an-hour", type: "phrase", phrase: "There's only one bus an hour", meaning: "The bus schedule is infrequent", example: "Out here there's only one bus an hour, so I set reminders.", source: { slug: "one-bus-an-hour-4", title: "Episode 4 — One Bus an Hour" } },
  { id: "e4-if-i-miss-it", type: "phrase", phrase: "If I miss it, I'm stuck", meaning: "Missing the bus leaves me waiting a long time", example: "If I miss it, I'm stuck for another sixty minutes.", source: { slug: "one-bus-an-hour-4", title: "Episode 4 — One Bus an Hour" } },
  { id: "e4-plan-a-backup", type: "phrase", phrase: "I plan a backup ride", meaning: "I prepare an alternative way to travel", example: "I plan a backup ride in case the bus never shows up.", source: { slug: "one-bus-an-hour-4", title: "Episode 4 — One Bus an Hour" } },
  { id: "e4-use-the-wait", type: "phrase", phrase: "I use the wait wisely", meaning: "I stay productive while waiting", example: "I use the wait wisely by clearing a couple of messages.", source: { slug: "one-bus-an-hour-4", title: "Episode 4 — One Bus an Hour" } },
]

export const PHRASAL_VERBS: DeckItem[] = [
  { id: "pv-pick-up", type: "phrasal", phrase: "pick up", meaning: "collect or learn", example: "I’ll pick up the kids at 5." },
  { id: "pv-drop-off", type: "phrasal", phrase: "drop off", meaning: "take and leave somewhere", example: "Can you drop me off at the station?" },
  { id: "pv-figure-out", type: "phrasal", phrase: "figure out", meaning: "find the answer / understand", example: "We need to figure out a better plan." },
  { id: "pv-find-out", type: "phrasal", phrase: "find out", meaning: "discover information", example: "I'll find out and let you know." },
  { id: "pv-work-out", type: "phrasal", phrase: "work out", meaning: "exercise or solve", example: "It took a while to work out the issue." },
  { id: "pv-set-up", type: "phrasal", phrase: "set up", meaning: "arrange / establish", example: "Let's set up a meeting for Friday." },
  { id: "pv-turn-on", type: "phrasal", phrase: "turn on/off", meaning: "switch a device", example: "Please turn off the lights when you leave." },
  { id: "pv-put-off", type: "phrasal", phrase: "put off", meaning: "postpone / delay", example: "We had to put off the presentation." },
  { id: "pv-bring-up", type: "phrasal", phrase: "bring up", meaning: "mention a topic", example: "She brought up an interesting point." },
  { id: "pv-look-after", type: "phrasal", phrase: "look after", meaning: "take care of", example: "Can you look after the cat?" },
  { id: "pv-look-for", type: "phrasal", phrase: "look for", meaning: "try to find", example: "I'm looking for my keys." },
  { id: "pv-run-out-of", type: "phrasal", phrase: "run out of", meaning: "have none left", example: "We ran out of milk." },
  { id: "pv-come-up-with", type: "phrasal", phrase: "come up with", meaning: "think of / create", example: "Can we come up with another idea?" },
  { id: "pv-get-along", type: "phrasal", phrase: "get along", meaning: "have a good relationship", example: "They get along really well." },
  { id: "pv-get-over", type: "phrasal", phrase: "get over", meaning: "recover from", example: "It took time to get over the flu." },
  { id: "pv-give-up", type: "phrasal", phrase: "give up", meaning: "stop trying", example: "Don't give up — you're close!" },
  { id: "pv-go-on", type: "phrasal", phrase: "go on", meaning: "continue", example: "Please, go on — I'm listening." },
  { id: "pv-hang-out", type: "phrasal", phrase: "hang out", meaning: "spend time relaxing", example: "We usually hang out on weekends." },
  { id: "pv-keep-up", type: "phrasal", phrase: "keep up (with)", meaning: "continue at the same pace", example: "It's hard to keep up with all the news." },
  { id: "pv-look-forward-to", type: "phrasal", phrase: "look forward to", meaning: "be excited about", example: "I look forward to seeing you." },
  { id: "pv-make-up", type: "phrasal", phrase: "make up", meaning: "invent or reconcile", example: "He made up an excuse for being late." },
  { id: "pv-pay-off", type: "phrasal", phrase: "pay off", meaning: "bring good results / finish paying", example: "Your hard work will pay off." },
  // Phrasal verbs from episodes
  { id: "pv-wake-up", type: "phrasal", phrase: "wake up", meaning: "stop sleeping / become alert", example: "Coffee helps me wake up.", source: { slug: "morning-coffee-1", title: "Episode 1 — Morning Coffee" } },
  { id: "pv-head-out", type: "phrasal", phrase: "head out", meaning: "leave / depart", example: "I head out around 8:30.", source: { slug: "morning-coffee-1", title: "Episode 1 — Morning Coffee" } },
  { id: "pv-cut-back-on", type: "phrasal", phrase: "cut back on", meaning: "reduce the amount of", example: "I’m trying to cut back on sugar.", source: { slug: "morning-coffee-1", title: "Episode 1 — Morning Coffee" } },
  { id: "pv-clean-up", type: "phrasal", phrase: "clean up", meaning: "make a place tidy", example: "I clean up the kitchen after dinner.", source: { slug: "cooking-dinner-2", title: "Episode 2 — Cooking Dinner" } },
  { id: "pv-heat-up", type: "phrasal", phrase: "heat up", meaning: "make food warm", example: "I heat up leftovers on busy nights.", source: { slug: "cooking-dinner-2", title: "Episode 2 — Cooking Dinner" } },
  // From Episode 3 — Decisions… Decisions…
  { id: "pv-decide-on", type: "phrasal", phrase: "decide on", meaning: "choose from options", example: "I need to decide on one option and move on.", source: { slug: "decisions-decisions-3", title: "Episode 3 — Decisions… Decisions…" } },
  { id: "pv-stick-with", type: "phrasal", phrase: "stick with", meaning: "continue with a choice", example: "Once I choose, I try to stick with it.", source: { slug: "decisions-decisions-3", title: "Episode 3 — Decisions… Decisions…" } },
  { id: "pv-let-go-of", type: "phrasal", phrase: "let go of", meaning: "stop holding or stop worrying about", example: "I’m learning to let go of perfection.", source: { slug: "decisions-decisions-3", title: "Episode 3 — Decisions… Decisions…" } },
  { id: "pv-move-forward", type: "phrasal", phrase: "move forward", meaning: "make progress / continue", example: "Choosing helps me move forward.", source: { slug: "decisions-decisions-3", title: "Episode 3 — Decisions… Decisions…" } },
  // From Episode 4 — One Bus an Hour
  { id: "pv-plan-around", type: "phrasal", phrase: "plan around", meaning: "organize plans considering a limitation", example: "I plan around the bus by leaving fifteen minutes early.", source: { slug: "one-bus-an-hour-4", title: "Episode 4 — One Bus an Hour" } },
  { id: "pv-kill-time", type: "phrasal", phrase: "kill time", meaning: "do something to make the wait feel shorter", example: "I kill time by walking to the corner shop.", source: { slug: "one-bus-an-hour-4", title: "Episode 4 — One Bus an Hour" } },
  { id: "pv-check-in-with", type: "phrasal", phrase: "check in with", meaning: "contact someone to update or ask for help", example: "I check in with a friend to see if she’s driving past.", source: { slug: "one-bus-an-hour-4", title: "Episode 4 — One Bus an Hour" } },
  { id: "pv-set-a-timer", type: "phrasal", phrase: "set a timer", meaning: "use a timer to manage waiting", example: "I set a timer so I don’t stare at the road for an hour.", source: { slug: "one-bus-an-hour-4", title: "Episode 4 — One Bus an Hour" } },
]

export const ALL_ITEMS: DeckItem[] = [...PHRASES, ...PHRASAL_VERBS]
