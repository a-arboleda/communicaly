import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllEpisodes, getEpisode } from "@/utils/episodes"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import EpisodeAudioWithTranscript from "@/components/EpisodeAudioWithTranscript"
import { displayTitle } from "@/utils/format"
import Details from "@/components/Details"
import EpisodeQuickNav from "@/components/EpisodeQuickNav"
import { getTranscript } from "@/utils/transcripts"
import PracticeTips from "@/components/PracticeTips"
import EpisodeHero from "@/components/EpisodeHero"
import EpisodeHighlights from "@/components/EpisodeHighlights"
import RespondCard from "@/components/RespondCard"
import { AUDIO_PROMPTS } from "@/data/audioPrompts"

type TextAnswerCat = "short" | "reflective" | "personal" | "conversation" | "summary"

const TEXT_ANSWER_OVERRIDE_MAP: Record<string, Partial<Record<TextAnswerCat, string>>> = {
  "morning-coffee-1": {
    short: "What stood out to you?",
    reflective: "Why do you think coffee (or any morning drink) matters in your day?",
    personal: "What’s your own little ritual that helps you wake up?",
    conversation: "So, do you usually make it at home, or do you like buying it outside?",
    summary: "If you had to describe your mornings in one sentence, what would you say?",
  },
  "cooking-dinner-2": {
    short: "What do you usually do in this situation?",
    reflective: "How does her planning-ahead routine make you feel?",
    personal: "Does this remind you of a memory or a moment from your own life?",
    conversation: "What clarifying question could you ask to keep the chat going?",
    summary: "If you had to explain your own version of the audio in one sentence, what would it be?",
  },
  "decisions-decisions-3": {
    short: "What decision are you putting off right now?",
    reflective: "How does indecision usually show up in your day?",
    personal: "Tell a quick story about a time you had to choose and finally did.",
    conversation: "What question could you ask the speaker to help them pick a direction?",
    summary: "In one or two sentences, what’s the lesson you hear in this audio?",
  },
  "one-bus-an-hour-4": {
    short: "How would you handle it if your bus came only once an hour?",
    reflective: "What does a long wait like that do to the rest of your schedule?",
    personal: "Share a moment when unreliable transport forced you to improvise.",
    conversation: "What question would you ask the speaker to keep the chat going while you both wait?",
    summary: "In a sentence or two, how would you sum up her commuting dilemma?",
  },
  "a-budget-dilemma-5": {
    short: "What’s one small upgrade that would make your place feel more like home right now?",
    reflective: "How do you decide between saving money and making your space comfortable?",
    personal: "Tell a quick story about a time you stretched your budget to improve your space.",
    conversation: "What could you ask the speaker to understand her plan for staying on budget?",
    summary: "How would you describe the trade-off at the heart of this episode in one or two sentences?",
  },
  "where-are-my-keys-6": {
    short: "What’s the first thing you do when you realize your keys are missing?",
    reflective: "How do those frantic pre-departure moments usually affect the rest of your day?",
    personal: "Share a quick story about a time a missing item almost made you late.",
    conversation: "What could you ask the speaker to help them track the keys down faster?",
    summary: "In one or two sentences, how would you retell this rush-hour scramble?",
  },
  "small-surprises-7": {
    short: "Which small surprise from her day caught your attention?",
    reflective: "How do little unexpected moments change the way your day feels?",
    personal: "Share a quick story about a day that shifted because of a tiny surprise.",
    conversation: "What question would you ask them about discovering that new bakery?",
    summary: "In a sentence or two, how would you sum up her string of small surprises?",
  },
  "tools-plans-patience-8": {
    short: "What’s the first thing you do when a squeaky hinge or shelf project pops up?",
    reflective: "How does planning your supplies change the way you feel about a repair?",
    personal: "Share a home project you prepared for and how it went.",
    conversation: "What could you ask them about making that hardware-store list?",
    summary: "In a sentence or two, how would you retell her plan-from-list-to-home moment?",
  },
  "trust-takes-time-9": {
    short: "Which small promise in the story would make you pay closer attention?",
    reflective: "How do you usually decide whether someone is earning your trust step by step?",
    personal: "Tell a quick story about someone who proved themselves to you over time.",
    conversation: "What follow-up question could you ask the speaker to understand how they balance fear and openness?",
    summary: "In one or two sentences, how would you retell her advice about letting trust take time?",
  },
  "when-meetings-run-long-10": {
    short: "What clue tells you a meeting is running longer than it should?",
    reflective: "How do stretched-out meetings change your focus or energy?",
    personal: "Share a quick story about a meeting that should have ended sooner. What happened?",
    conversation: "What question could you ask the speaker to help everyone wrap up without sounding rude?",
    summary: "In one or two sentences, how would you retell her meeting that ran long?",
  },
  "catching-up-11": {
    short: "Who was the last person you unexpectedly ran into, and what did you say first?",
    reflective: "How do surprise reunions change the way you think about old friendships?",
    personal: "Tell a quick story about catching up with someone after years apart.",
    conversation: "What question could you ask Sophie to keep the catching-up vibe going?",
    summary: "In one or two sentences, how would you retell this coffee-shop reunion?",
  },
  "when-you-hit-your-toe-12": {
    short: "What’s the first thing you do right after you slam your toe on a piece of furniture?",
    reflective: "How do tiny accidents like stubbing your toe change the way you move through your space?",
    personal: "Tell a quick story about the last time you hurt yourself doing something ordinary at home.",
    conversation: "What question could you ask the narrator to keep the chat light while you both laugh about the mishap?",
    summary: "In one or two sentences, how would you retell this whole stubbed-toe moment?",
  },
  "my-mind-was-racing-13": {
    short: "Which moment from his sleepless night felt most familiar to you?",
    reflective: "When your mind races after lights-out, what helps you slow it down?",
    personal: "Tell a quick story about the last time you lay awake overthinking everything.",
    conversation: "What could you ask him about letting his thoughts run wild at 2 a.m.?",
    summary: "In one or two sentences, how would you retell this can't-sleep, mind-racing moment?",
  },
  "laundry-day-thoughts-14": {
    short: "What part of her laundry routine sounded the most like yours?",
    reflective: "How do repetitive chores like folding clothes change your mood or focus?",
    personal: "Tell a quick story about a time a chore stirred up old memories for you.",
    conversation: "What question would you ask the speaker to hear more about the stories each item carries?",
    summary: "In one or two sentences, how would you retell this memory-filled laundry session?",
  },
  "waiting-in-line-15": {
    short: "What’s your go-to move when the checkout line stops moving?",
    reflective: "How do slow lines like this change the way you feel about running errands?",
    personal: "Tell a quick story about a time a stranger made a long wait easier for you.",
    conversation: "What question would you ask the speaker to keep the small talk going while you both inch forward?",
    summary: "In one or two sentences, how would you retell this stuck-in-line moment?",
  },
  "arguments-16": {
    short: "When did the argument in this story feel like it shifted from casual to serious for you?",
    reflective: "What does this episode remind you about the way you communicate when emotions run high?",
    personal: "Share a quick moment when you realized you were arguing harder because the person mattered to you.",
    conversation: "What could you ask the narrator so they feel heard instead of feeling like they have to win?",
    summary: "In one or two sentences, how would you restate her lesson about choosing when to speak up versus let it go?",
  },
  "the-one-that-got-away-17": {
    short: "Which detail from this missed opportunity felt most familiar to you?",
    reflective: "What does this story make you notice about your own hesitation habits?",
    personal: "Tell a quick story about a time you said “maybe later” and the chance disappeared.",
    conversation: "What question would you ask the narrator so she feels encouraged to trust her next yes?",
    summary: "In one or two sentences, how would you retell her reminder about moving before the moment passes?",
  },
  "forgot-what-i-was-saying-18": {
    short: "Which part of her mid-sentence blackout felt the most familiar to you?",
    reflective: "What does this story make you notice about how you react when your brain suddenly blanks?",
    personal: "Tell a quick story about the last time you forgot your point and how you handled it.",
    conversation: "Ask the speaker something that might help them remember—what would you ask right now?",
    summary: "In one or two sentences, how would you retell her reminder to slow down after a blank-out?",
  },
  "sunday-mornings-19": {
    short: "What’s the first little detail that tells you Sunday finally feels slow?",
    reflective: "When you listen to this, what do you learn about your own need for rest versus productivity?",
    personal: "Share a quick story about a Sunday morning you let yourself linger longer than planned.",
    conversation: "You’re chatting with the narrator—what would you ask them about protecting quiet time?",
    summary: "In one or two sentences, how would you retell her reminder that Sunday can just be about being?",
  },
  "did-i-flush-the-toilet-20": {
    short: "Which tiny moment in this story felt the most relatable to you?",
    reflective: "What does this episode make you notice about how small doubts can take over your focus?",
    personal: "Share a quick story about the last time you worried you messed up something minor at someone else’s place.",
    conversation: "If you were sitting next to the narrator, what would you ask them to help them calm down?",
    summary: "In one or two sentences, how would you retell her reminder that invisible worries can still hijack a night?",
  },
  "the-lost-remote-21": {
    short: "What’s the small thing you always seem to lose the moment you finally get comfortable?",
    reflective: "What does this lost-remote saga make you notice about how tiny hassles change the mood?",
    personal: "Tell a quick story about the last time you tore apart the living room searching for something basic like a remote or charger.",
    conversation: "If you were sitting with them, what question could you ask to help track down the remote faster?",
    summary: "In a sentence or two, how would you retell her couch-cushion scavenger hunt?",
  },
  "the-fridge-stare-22": {
    short: "What usually runs through your head when you open the fridge even though you’re not hungry?",
    reflective: "What does this episode make you notice about the habits you use to fill quiet late-night minutes?",
    personal: "Share a quick story about a time you kept reopening the fridge hoping something would magically appear.",
    conversation: "You’re standing beside the narrator—what would you ask them so you both laugh about the fridge stare?",
    summary: "In one or two sentences, how would you retell her late-night fridge ritual?",
  },
  "canceling-plans-23": {
    short: "What’s the first thought that hits you when plans suddenly disappear?",
    reflective: "What does this story make you notice about how your social battery drains and refills?",
    personal: "Tell a quick story about a time you were relieved when someone else canceled.",
    conversation: "You’re texting them back—what question could you ask so they know you still want to see them soon?",
    summary: "In a sentence or two, how would you retell her secretly-celebrated cancellation night?",
  },
  "doing-the-dishes-24": {
    short: "What runs through your mind when you’re sure a chore is done and then spot the one thing you missed?",
    reflective: "What does this dish saga make you notice about your own need to finish things completely?",
    personal: "Share a quick story about the last dish or task that pulled you back after you’d already declared victory.",
    conversation: "You’re standing beside them staring at that pot—what would you ask to keep the chat going while they scrub again?",
    summary: "In one or two sentences, how would you retell her clean-kitchen victory getting interrupted by a lone pot?",
  },
  "packing-for-a-trip-25": {
    short: "Which moment in her overstuffed packing session felt most familiar to you?",
    reflective: "What does her fold-roll-refold chaos make you notice about how you handle pre-trip stress?",
    personal: "Share a quick story about the last time you swore you'd pack light but still added \"options.\"",
    conversation: "Suitcase won't zip and she's ready to start over—what would you ask her so she feels okay leaving something behind?",
    summary: "In one or two sentences, how would you retell her journey from tidy checklist to sitting on the suitcase?",
  },
  "the-voice-message-26": {
    short: "How do you feel the moment you realize take four still doesn’t sound casual?",
    reflective: "How does listening to your own voice change the way you judge a message?",
    personal: "Tell a quick story about the last time background noise or self-consciousness made you start over.",
    conversation: "You’re beside her while she hovers over delete—what question could you ask that would calm her before she records again?",
    summary: "In one or two sentences, how would you retell her decision to ditch the voice note and send a text?",
  },
}

const TEXT_HELPER_OVERRIDE_MAP: Record<string, Partial<Record<TextAnswerCat, string[]>>> = {
  "cooking-dinner-2": {
    short: [
      "Usually, I…",
      "For me, the easiest is…",
      "It depends on the day…",
    ],
    reflective: [
      "It makes me feel…",
      "On busy days, I…",
      "When I plan ahead, I…",
    ],
    personal: [
      "I remember when…",
      "In my family, we…",
      "Back then, I used to…",
    ],
    conversation: [
      "Could you tell me more about…?",
      "Why do you …?",
      "How do you usually …?",
      "What made you decide to …?",
      "When do you usually …?",
      "Have you ever tried …?",
    ],
    summary: [
      "In one sentence: …",
      "Basically, …",
      "Overall, I think …",
    ],
  },
  "one-bus-an-hour-4": {
    short: [
      "With only one bus an hour, I…",
      "If I miss it, I…",
      "My quick fix is…",
    ],
    reflective: [
      "A long wait usually makes me…",
      "It changes my plan because…",
      "I notice that I…",
    ],
    personal: [
      "One time I waited because…",
      "I keep a backup plan like…",
      "Usually I text…",
    ],
    conversation: [
      "Do you ever…?",
      "Would it help if…?",
      "What if we…?",
      "Should we call…?",
    ],
    summary: [
      "Bottom line: …",
      "In short, they…",
      "It all comes down to…",
    ],
  },
  "a-budget-dilemma-5": {
    short: [
      "A quick win for me is…",
      "Even with a tight budget, I…",
      "If friends are coming over, I focus on…",
    ],
    reflective: [
      "It makes me rethink how I balance…",
      "When money is limited, I remind myself…",
      "I notice that comfort usually comes from…",
    ],
    personal: [
      "Last time I moved, I…",
      "I once borrowed…",
      "My go-to DIY trick is…",
    ],
    conversation: [
      "Could you walk me through how you…?",
      "Would it help if we shared…?",
      "Have you considered swapping…?",
    ],
    summary: [
      "Bottom line: …",
      "It’s really a choice between…",
      "The dilemma is balancing…",
    ],
  },
  "where-are-my-keys-6": {
    short: [
      "First, I check…",
      "My quick move is…",
      "I always retrace…",
    ],
    reflective: [
      "Moments like this remind me…",
      "When I misplace things, I notice…",
      "It throws off my morning because…",
    ],
    personal: [
      "One time I almost left without…",
      "I once tore apart the couch because…",
      "My worst rush-hour search was when…",
    ],
    conversation: [
      "Did you check…?",
      "Could it be in…?",
      "Want me to call your phone so we can listen for it?",
    ],
    summary: [
      "Quick recap: …",
      "Basically, they…",
      "The whole scene is…",
    ],
  },
  "small-surprises-7": {
    short: [
      "The surprise that stood out was…",
      "It’s funny how…",
      "My favorite tiny moment was…",
    ],
    reflective: [
      "Little surprises usually make me…",
      "When a day starts rough, I…",
      "I notice that unexpected moments…",
    ],
    personal: [
      "One morning I…",
      "I once bumped into…",
      "My version of a small win is…",
    ],
    conversation: [
      "Did the bakery…?",
      "How often do you…?",
      "What made you stop when…?",
      "Should we compare notes on…?",
    ],
    summary: [
      "Overall, their day…",
      "In short, they…",
      "The thread linking everything is…",
    ],
  },
  "tools-plans-patience-8": {
    short: [
      "My first step is…",
      "I always write down…",
      "Before I head out, I…",
    ],
    reflective: [
      "Planning ahead usually makes me…",
      "When I’m in a hardware store, I…",
      "I notice that getting advice…",
    ],
    personal: [
      "One small fix I remember is…",
      "I once asked an employee…",
      "My version of prepping is…",
    ],
    conversation: [
      "Could you show me how you…?",
      "What made you pick…?",
      "Do you think I should…?",
      "Should we compare our lists for…?",
    ],
    summary: [
      "Overall, their plan…",
      "In short, they…",
      "The key link is…",
    ],
  },
  "trust-takes-time-9": {
    short: [
      "The small promise that stood out was…",
      "I notice trust building when…",
      "Usually, I wait to see if…",
    ],
    reflective: [
      "Letting trust take time makes me…",
      "I tend to watch for…",
      "Balancing caution and openness means…",
    ],
    personal: [
      "One time someone proved themselves by…",
      "I used to hold back because…",
      "What changed my mind was…",
    ],
    conversation: [
      "How do you decide who earns your trust?",
      "What helps you stay open while careful?",
      "Could you tell me more about the small promises you mentioned?",
    ],
    summary: [
      "In short, they’re saying…",
      "Overall, their message is…",
      "The main takeaway for me is…",
    ],
  },
  "when-meetings-run-long-10": {
    short: [
      "I can tell it’s running long when…",
      "My first clue is…",
      "Usually I start to…",
    ],
    reflective: [
      "Long meetings usually make me…",
      "I notice my focus…",
      "When the agenda drifts, I…",
    ],
    personal: [
      "One meeting dragged because…",
      "I remember glancing at the clock when…",
      "Back at my old job, we…",
    ],
    conversation: [
      "Could we park that for later?",
      "Do you think we should wrap soon?",
      "What if we summarize the next steps?",
      "Should we set a follow-up for that?",
    ],
    summary: [
      "In short, the meeting…",
      "Overall, they realized…",
      "The main point is…",
    ],
  },
  "catching-up-11": {
    short: [
      "I ran into…",
      "I almost didn’t recognize…",
      "The first thing I said was…",
    ],
    reflective: [
      "Surprise reunions make me…",
      "I notice old memories…",
      "It reminds me that…",
    ],
    personal: [
      "One time an old friend and I…",
      "We used to…",
      "Back in school, we…",
    ],
    conversation: [
      "How have you been since…?",
      "Where did you end up after…?",
      "Do you still keep in touch with…?",
      "Should we plan a call or…?",
    ],
    summary: [
      "In short, they…",
      "Overall, it felt like…",
      "The main memory is…",
    ],
  },
  "when-you-hit-your-toe-12": {
    short: [
      "I always freeze for a second…",
      "First, I grab my foot and…",
      "My quick fix is to breathe and…",
    ],
    reflective: [
      "Moments like this remind me…",
      "It makes me rethink where…",
      "I notice the pain fades once…",
    ],
    personal: [
      "One time I smacked my toe on…",
      "I remember hopping around because…",
      "Back at my old apartment, I…",
    ],
    conversation: [
      "Does that corner get you often?",
      "Should we add a night-light so…?",
      "What’s the worst toe-hit you’ve had?",
      "Want to rearrange things so…?",
    ],
    summary: [
      "Quick recap: …",
      "Basically, they…",
      "Bottom line: one toe-hit led to…",
    ],
  },
  "my-mind-was-racing-13": {
    short: [
      "When my mind won't slow down, I…",
      "I catch myself staring at the clock because…",
      "Eventually I just…",
    ],
    reflective: [
      "Nights like this remind me…",
      "I notice my thoughts jump from… to…",
      "If I try to force sleep, it usually…",
    ],
    personal: [
      "One night I kept replaying…",
      "Back in college I would…",
      "I finally drifted off after…",
    ],
    conversation: [
      "Does your brain always sprint like that at night?",
      "Have you tried letting the thoughts run out?",
      "What kept looping in your head?",
      "Want to trade late-night tricks so we both get some sleep?",
    ],
    summary: [
      "Bottom line: …",
      "In short, it's a restless night that…",
      "Basically, his mind ran laps until…",
    ],
  },
  "laundry-day-thoughts-14": {
    short: [
      "When the machine starts humming, I…",
      "Folding clothes puts me in the mood to…",
      "I speed up the process by…",
    ],
    reflective: [
      "Sorting laundry usually reminds me…",
      "When the room gets quiet, I notice…",
      "It helps me think through…",
    ],
    personal: [
      "One shirt that brings back memories is…",
      "I still laugh about the time…",
      "Growing up, we used to…",
    ],
    conversation: [
      "Does any piece have a story behind it?",
      "Which item took you the longest to fold?",
      "Want to swap laundry hacks while we work?",
      "Should we pair socks or tackle the shirts first?",
    ],
    summary: [
      "Quick recap: …",
      "In short, the chore turned into…",
      "Basically, they sorted clothes and…",
    ],
  },
  "waiting-in-line-15": {
    short: [
      "When the line stalls, I…",
      "My quick calm-down is to…",
      "If the register slows, I…",
    ],
    reflective: [
      "Moments like this remind me…",
      "I notice my patience shift when…",
      "Long waits usually make me…",
    ],
    personal: [
      "One time I was stuck behind…",
      "I remember chatting with…",
      "My longest wait was when…",
    ],
    conversation: [
      "Did you see that headline about…?",
      "How often do you get stuck in lines like this?",
      "Want to swap weekend plans while we wait?",
      "Should we guess how many coins she has left?",
    ],
    summary: [
      "Quick recap: …",
      "In short, the line…",
      "Basically, we both…",
    ],
  },
  "arguments-16": {
    short: [
      "When an argument heats up, I…",
      "If it suddenly feels serious, I…",
      "My quick gut check is…",
    ],
    reflective: [
      "Moments like this remind me…",
      "I notice my tone shifts when…",
      "It teaches me that…",
    ],
    personal: [
      "I once argued with someone close when…",
      "Back then I realized…",
      "My toughest disagreement was…",
    ],
    conversation: [
      "How do you want me to listen right now?",
      "What would help you feel heard before we keep going?",
      "Could we pause so we don’t talk in circles?",
      "Should we come back to this after a breather?",
    ],
    summary: [
      "Bottom line: …",
      "In short, it’s about…",
      "The lesson is knowing when to…",
    ],
  },
  "the-one-that-got-away-17": {
    short: [
      "I keep replaying the moment when…",
      "Looking back, the clue was…",
      "My easy yes would have been…",
    ],
    reflective: [
      "This reminds me that hesitation usually…",
      "I notice my brain stalls when…",
      "It teaches me to trust…",
    ],
    personal: [
      "Once, I hesitated because…",
      "I still think about the time I…",
      "The opportunity I skipped was…",
    ],
    conversation: [
      "What made you so sure this was worth trying?",
      "How did you know it was low risk?",
      "What would you ask me to help me say yes sooner?",
      "Could you walk me through the part I missed?",
    ],
    summary: [
      "Bottom line: …",
      "In short, the lesson is…",
      "Basically, hesitating meant…",
    ],
  },
  "forgot-what-i-was-saying-18": {
    short: [
      "That blank stare moment reminded me…",
      "When my mind suddenly empties, I…",
      "The most relatable part was…",
    ],
    reflective: [
      "It makes me notice that I…",
      "Moments like this remind me to…",
      "I realize my brain shuts down when…",
    ],
    personal: [
      "One time I froze mid-sentence because…",
      "My coworker watched me stumble when…",
      "What helped me recover was…",
    ],
    summary: [
      "In short, it’s about…",
      "Basically, forgetting gave them…",
      "Overall, I hear a reminder to…",
    ],
  },
  "sunday-mornings-19": {
    short: [
      "Sunday feels real when…",
      "The first calm detail I notice is…",
      "My slow start begins with…",
    ],
    reflective: [
      "It reminds me that I need…",
      "I notice my energy shifts when…",
      "This makes me rethink how I…",
    ],
    personal: [
      "One Sunday I decided to…",
      "My favorite lazy ritual is…",
      "Usually I linger by…",
    ],
    summary: [
      "In short, Sundays are…",
      "Basically, their morning shows…",
      "Overall, it’s a reminder that…",
    ],
  },
  "did-i-flush-the-toilet-20": {
    short: [
      "The moment that hooked me was…",
      "I’d probably panic when…",
      "The funniest part is…",
    ],
    reflective: [
      "It shows me that my brain tends to…",
      "I notice I spiral when…",
      "This reminds me to check…",
    ],
    personal: [
      "One time at a friend’s place I…",
      "I still cringe when I remember…",
      "Usually I double-check by…",
    ],
    summary: [
      "Bottom line: …",
      "In short, a tiny doubt…",
      "Overall, it’s about…",
    ],
  },
  "the-lost-remote-21": {
    short: [
      "Every time I get comfy, the remote…",
      "The smallest thing I always misplace is…",
      "My first instinct is to pat around because…",
    ],
    reflective: [
      "Little hunts like this remind me…",
      "When tiny hassles steal my night, I notice…",
      "It usually tells me I need to…",
    ],
    personal: [
      "Once I ended up kneeling on the floor because…",
      "My funniest lost-remote story was when…",
      "I finally found it hiding…",
    ],
    summary: [
      "Bottom line: …",
      "In short, a missing remote turned into…",
      "Overall, it shows how quickly…",
    ],
  },
  "the-fridge-stare-22": {
    short: [
      "Every so often I open the fridge just to…",
      "I end up staring at the shelf because…",
      "Nothing looks good and yet I still…",
    ],
    reflective: [
      "Late-night fridge checks usually mean I’m…",
      "I notice the quiet feels different when…",
      "It reminds me that boredom often sounds like…",
    ],
    personal: [
      "One night I kept reopening the door because…",
      "I still laugh about the time I found…",
      "My default move is to grab the handle when…",
    ],
    summary: [
      "Bottom line: …",
      "In short, a fridge stare became…",
      "Overall, the episode shows…",
    ],
  },
  "canceling-plans-23": {
    short: [
      "When plans fall through, I usually…",
      "My first reaction is…",
      "Honestly, I think…",
    ],
    reflective: [
      "It reminds me that my energy…",
      "I notice I need rest when…",
      "Moments like this make me rethink…",
    ],
    personal: [
      "One rainy night I…",
      "I remember replying with…",
      "I ended up spending the evening…",
    ],
    summary: [
      "Bottom line: …",
      "In short, their night turned from… to…",
      "Overall, it’s about…",
    ],
  },
  "doing-the-dishes-24": {
    short: [
      "Right when I thought I was done…",
      "That one last dish always…",
      "My brain instantly goes to…",
    ],
    reflective: [
      "Moments like this remind me that…",
      "I can’t relax unless…",
      "It shows me how much I value…",
    ],
    personal: [
      "Last time it was a pan that…",
      "I still remember scrubbing…",
      "My usual compromise is…",
    ],
    summary: [
      "Bottom line: even one dish…",
      "In short, their victory turned into…",
      "The whole scene proves that…",
    ],
  },
  "packing-for-a-trip-25": {
    short: [
      "The most relatable part was…",
      "When I try to pack light, I…",
      "Honestly, my suitcase always…",
    ],
    reflective: [
      "It makes me think about why I…",
      "I notice my brain assumes…",
      "Moments like this remind me that preparation…",
    ],
    personal: [
      "One trip I…",
      "I still laugh about the time…",
      "My go-to workaround is…",
    ],
    summary: [
      "Bottom line: packing turned into…",
      "In short, their checklist became…",
      "Overall, it shows how…",
    ],
  },
  "the-voice-message-26": {
    short: [
      "Halfway through I usually restart because…",
      "When the red dot appears, I…",
      "A “quick” voice note turns complicated when…",
    ],
    reflective: [
      "Moments like this remind me that…",
      "I notice I want my recordings to sound…",
      "It tells me I’m trying to control…",
    ],
    personal: [
      "Once I deleted five takes because…",
      "My background-noise nemesis is…",
      "Usually I give up and text when…",
    ],
    summary: [
      "Bottom line: sending the message turned into…",
      "In short, perfection made her…",
      "Overall, it proves that…",
    ],
  },
}

const JOURNAL_REFLECTION_OVERRIDE_MAP: Record<string, string[] | undefined> = {
  "morning-coffee-1": [
    "What do you usually drink in the morning, and why?",
    "Where do you normally have your first drink of the day?",
    "How does that small routine set the tone for the rest of your day?",
    "If you didn’t have your usual drink, how would your morning feel different?",
    "What small change would make your mornings even better?",
  ],
  "cooking-dinner-2": [
    "What’s the easiest part of this routine for you?",
    "What makes it harder on some days?",
    "How do you usually feel before and after doing it?",
    "Is there something you’d like to change about it?",
    "Does this remind you of a childhood memory?",
    "How would you explain this habit to someone from another country?",
  ],
  "decisions-decisions-3": [
    "What decision have you postponed lately, and why?",
    "How does overthinking usually feel in your body?",
    "Who helps you choose when you’re stuck, and how?",
    "What’s a small step you could take to move forward this week?",
    "How would you encourage a friend who can’t decide?",
  ],
  "one-bus-an-hour-4": [
    "How do long gaps between buses or trains affect your energy?",
    "What backup plan do you keep for late or missing transport?",
    "Who could you call if you needed a ride, and why them?",
    "What small habit keeps you calm while you wait?",
    "If you redesigned this bus schedule, what would you change first?",
  ],
  "a-budget-dilemma-5": [
    "What feelings come up when your space doesn’t match the home you imagine?",
    "Which small purchases or swaps give you the most comfort per dollar?",
    "Who do you turn to for home or budget advice, and what do they usually suggest?",
    "How do you track ‘nice-to-have’ items so they don’t derail your savings?",
    "What’s one hosting tip that makes people feel welcome without spending much?",
  ],
  "where-are-my-keys-6": [
    "What routine helps you keep essentials where they belong before you head out?",
    "How do you steady yourself when a missing item throws off your schedule?",
    "Who do you text or call when you need a quick rescue, and why them?",
    "What backup plans keep you from arriving late if the search takes too long?",
    "What change could make hectic mornings feel calmer next week?",
  ],
  "small-surprises-7": [
    "When a morning starts messy, what helps you reset the tone of your day?",
    "How do you notice and remember the small surprises that happen between tasks?",
    "Who usually pops up in your day unexpectedly, and how do you respond?",
    "What’s a recent discovery in your neighborhood that made you smile?",
    "How do you wind down on days that felt ordinary but still held little wins?",
  ],
  "tools-plans-patience-8": [
    "How do you decide which tools or supplies to buy before starting a project?",
    "What smells, sounds, or sights in a hardware store energize you?",
    "Who do you ask for help when you’re unsure about what part or tool you need?",
    "Which small fix taught you the most about patience and planning?",
    "How do you celebrate finishing a low-key home repair or setup?",
  ],
  "trust-takes-time-9": [
    "What slows you down when you decide whether to trust someone new?",
    "Which small promises or actions help you feel ready to rely on someone?",
    "How do you protect yourself without closing off possible connections?",
    "Who has earned your trust over time, and what did they consistently do?",
    "What risk could strengthen a relationship if you took it this month?",
  ],
  "when-meetings-run-long-10": [
    "What signals tell you a meeting has already lost the room?",
    "How does an overrunning meeting affect the rest of your tasks or energy?",
    "Who could help you call time politely, and how would you ask them?",
    "What phrase or tool keeps side topics from taking over the agenda?",
    "What boundary will you set before the next long meeting so it ends on time?",
  ],
  "catching-up-11": [
    "What usually triggers old memories when you reunite with someone?",
    "How do you balance swapping updates with listening to theirs?",
    "Who would you like to reconnect with next, and what would you say first?",
    "What detail would show them that you still remember your shared history?",
    "How will you follow up after an unexpected reunion so it doesn’t fade again?",
  ],
  "when-you-hit-your-toe-12": [
    "When you bump into furniture at home, how do you calm down once the shock hits?",
    "What reminder helps you stop a tiny pain from controlling the rest of your mood?",
    "Which spot in your home always seems to catch your toes, and why?",
    "Who do you text or call when you need to laugh off a clumsy moment?",
    "What small change could make your space safer for bare feet this week?",
  ],
  "my-mind-was-racing-13": [
    "What usually triggers your mind to start racing right when you want to sleep?",
    "Which bedtime habits help you slow the mental spiral when it shows up?",
    "Who or what do you reach for when you need comfort during a sleepless stretch?",
    "How does a night of tossing and turning change the way your next day unfolds?",
    "What experiment will you try this week to quiet your thoughts before bed?",
  ],
  "arguments-16": [
    "What usually sparks disagreements for you when the other person really matters?",
    "How do you know whether you’re still listening or only defending your point?",
    "Who helps you cool down after an argument, and what do they typically say?",
    "What phrase or pause helps you signal that you need a break before things escalate?",
    "What will you try next time so the conversation ends with more understanding than tension?",
  ],
  "the-one-that-got-away-17": [
    "What kinds of opportunities tend to slip by you because you wait too long?",
    "How can you tell the difference between healthy caution and plain hesitation?",
    "Who could you ask for a quick gut check before you pass on something small?",
    "What promise could you make to yourself so the next easy yes doesn’t sit on your someday list?",
    "How will you remind yourself of this episode the next time a trusted friend shares an idea?",
  ],
  "forgot-what-i-was-saying-18": [
    "What clues tell you a thought is about to disappear mid-sentence?",
    "How do you usually buy yourself a few seconds when your mind goes blank?",
    "Who helps you get back on track when you forget your point, and how?",
    "What phrases or breaths help you settle before the idea returns?",
    "What would “handling it gracefully” look like the next time it happens?",
  ],
  "sunday-mornings-19": [
    "What tells you it’s finally a slow morning and not just another rushed day?",
    "How do you want your body to feel before you start moving on Sundays?",
    "Which chores can wait so that resting actually feels intentional?",
    "Who or what usually interrupts your quiet time, and how could you set a boundary?",
    "What tiny ritual will you protect next Sunday so the calm sticks around?",
  ],
  "did-i-flush-the-toilet-20": [
    "Which small social what-ifs tend to hijack your attention the fastest?",
    "How does your body signal that a harmless doubt is turning into anxiety?",
    "What double-check routine helps you calm down before you rejoin the group?",
    "Who could you text or glance at for reassurance when you’re spiraling quietly?",
    "What will you tell yourself next time so you return to the moment sooner?",
  ],
  "the-lost-remote-21": [
    "Which small item disappears most often when you finally sit down, and what chain reaction does it start?",
    "How does your mood shift from cozy to frantic while you’re tearing apart the couch?",
    "Who do you loop into the hunt (or secretly blame), and what does that reveal about your habits?",
    "What simple ritual could keep remotes, chargers, or other gadgets parked in one predictable spot?",
    "How could you turn the next lost-remote search into something playful instead of stressful?",
  ],
  "the-fridge-stare-22": [
    "What usually sends you to the fridge when you know you’re not hungry?",
    "How does the cold light or hum of the fridge make the late-night quiet feel different?",
    "What else could you reach for (tea, water, journal, stretch) before opening the door again?",
    "Who or what often interrupts your fridge staring, and how do you react?",
    "What gentle boundary could you set so bedtime boredom doesn’t start in the kitchen?",
  ],
  "canceling-plans-23": [
    "What usually drains you enough that you secretly wish plans would cancel?",
    "How does your body feel when you want to stay home but say yes anyway?",
    "Who do you feel comfortable asking for a rain check, and what makes that trust work?",
    "What could you offer instead—a new date, a quick call, a message—so connection still exists?",
    "How can you plan a cozy backup so canceled plans feel intentional instead of awkward?",
  ],
  "doing-the-dishes-24": [
    "Which chores keep calling you back even when they’re 95% done, and why do they bug you the most?",
    "How do you decide whether to leave a mess for tomorrow or power through the final stretch?",
    "What smell, shine, or quiet cue tells you a kitchen (or task) is truly finished?",
    "Whose voice do you hear reminding you to finish what you start, and how does it influence your choices now?",
    "What tiny reward could you plan after the next surprise chore so finishing feels worth it?",
  ],
  "packing-for-a-trip-25": [
    "What do you lay out first when you promise yourself you'll pack light?",
    "Which items always tempt you to overpack, and what fear are they solving?",
    "How do you calm that buzz that says you forgot something once the zipper finally closes?",
    "Who keeps you accountable (or eggs you on) when you start tossing in extra outfits?",
    "If you had only ten minutes to pack, what would stay, what would go, and why?",
  ],
  "the-voice-message-26": [
    "What usually makes you hit delete on a voice note even when the words are fine?",
    "How does hearing your recorded voice change the way you pace or phrase your thoughts?",
    "Which background noises or interruptions instantly pull you out of the message?",
    "What reminder could help you accept a slightly imperfect recording as more human?",
    "How would it feel to send the next voice message without listening back first?",
  ],
}

void JOURNAL_REFLECTION_OVERRIDE_MAP

export const dynamic = "force-static"
export const runtime = "nodejs"

export async function generateStaticParams() {
  return getAllEpisodes().map((e) => ({ slug: e.slug }))
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const ep = getEpisode(slug)
  if (!ep) return notFound()

  const { frontmatter, content } = ep

  const textAnswerOverrides = TEXT_ANSWER_OVERRIDE_MAP[slug]
  const textHelperOverrides = TEXT_HELPER_OVERRIDE_MAP[slug]
  return (
    <article className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <Link href="/episodes">Episodes</Link> • Episode
        </p>
      </div>

      <header className="space-y-2">
        <h1 className="font-serif text-3xl font-bold">{displayTitle(frontmatter.title)}</h1>
        <EpisodeHero slug={slug} imageUrl={frontmatter.imageUrl} imageAlt={frontmatter.imageAlt} />
      </header>

      <section id="listen" className="card scroll-mt-20">
        <div className="card-body">
          {(() => {
            const t = getTranscript(slug)
            return (
              <EpisodeAudioWithTranscript
                src={frontmatter.audioUrl}
                start={frontmatter.youtubeStart}
                end={frontmatter.youtubeEnd}
                cues={t?.cues ?? undefined}
                timeOffset={t?.offset ?? 0}
                collapsible
                defaultOpen={false}
              />
            )
          })()}
          {(() => {
            const src = frontmatter.audioUrl
            const s = frontmatter.youtubeStart
            const e = frontmatter.youtubeEnd
            if (!src) return null
            // Minimal YouTube detection + ID extraction (server-safe)
            let videoId: string | undefined
            let baseStart: number | undefined
            try {
              const u = new URL(src)
              const host = u.hostname
              if (host.includes("youtu.be")) {
                videoId = u.pathname.replace(/^\//, "") || undefined
                const t = u.searchParams.get("t")
                if (t) {
                  if (/^\d+$/.test(t)) baseStart = Number(t)
                  else if (/^\d+:\d{1,2}$/.test(t)) {
                    const [mm, ss] = t.split(":").map(Number)
                    baseStart = mm * 60 + ss
                  } else {
                    const m = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/.exec(t)
                    if (m) {
                      const h = Number(m[1] || 0), mm = Number(m[2] || 0), ss = Number(m[3] || 0)
                      baseStart = h * 3600 + mm * 60 + ss
                    }
                  }
                }
              } else if (host.includes("youtube.com")) {
                if (u.pathname === "/watch") {
                  videoId = u.searchParams.get("v") || undefined
                  const t = u.searchParams.get("t")
                  if (t) {
                    if (/^\d+$/.test(t)) baseStart = Number(t)
                    else if (/^\d+:\d{1,2}$/.test(t)) {
                      const [mm, ss] = t.split(":").map(Number)
                      baseStart = mm * 60 + ss
                    } else {
                      const m = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/.exec(t)
                      if (m) {
                        const h = Number(m[1] || 0), mm = Number(m[2] || 0), ss = Number(m[3] || 0)
                        baseStart = h * 3600 + mm * 60 + ss
                      }
                    }
                  }
                } else if (u.pathname.startsWith("/embed/")) {
                  videoId = u.pathname.split("/").pop() || undefined
                }
              }
            } catch {}

            if (!videoId) return null

            function fmt(sec?: number) {
              if (typeof sec !== "number" || isNaN(sec)) return ""
              const t = Math.max(0, Math.floor(sec))
              const mm = String(Math.floor(t / 60)).padStart(2, "0")
              const ss = String(t % 60).padStart(2, "0")
              return `${mm}:${ss}`
            }

            const startSeconds = typeof s === "number" ? s : baseStart
            const startHref = typeof startSeconds === "number"
              ? `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&rel=0`
              : undefined
            const endHref = typeof e === "number"
              ? `https://www.youtube.com/embed/${videoId}?start=${e}&rel=0`
              : undefined

            if (!startHref && !endHref) return null

            return (
              <p className="mt-3 text-sm text-gray-700">
                {startHref && (
                  <>
                    Starts at <a className="text-brand-900" href={startHref} target="yt-player" rel="noreferrer">{fmt(s)}</a>
                  </>
                )}
                {startHref && endHref && <span> • </span>}
                {endHref && (
                  <>
                    Stops at <a className="text-brand-900" href={endHref} target="yt-player" rel="noreferrer">{fmt(e)}</a>
                  </>
                )}
              </p>
            )
          })()}
        </div>
      </section>

      <section className="prose max-w-none card prose-hr:my-2">
        <div className="card-body">
          <MDXRemote
            source={content}
            components={{ Details, EpisodeQuickNav, PracticeTips }}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>
      </section>

      <RespondCard
        episodeId={slug}
        audioTitle={frontmatter.title}
        textAnswerQuestionsOverride={textAnswerOverrides}
        textHelperOverrides={textHelperOverrides}
        audioPrompt={AUDIO_PROMPTS[slug]}
      />

      <EpisodeHighlights
        slug={slug}
        story={frontmatter.story}
        keyDetails={frontmatter.keyDetails}
        tryThis={frontmatter.tryThis}
        practiceQuiz={frontmatter.practiceQuiz}
      />
    </article>
  )
}
