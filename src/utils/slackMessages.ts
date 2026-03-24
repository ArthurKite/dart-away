/**
 * 20 fun/mocking Slack message templates for requesting vacation.
 * Use {country}, {funFact}, {weather}, and {capital} as placeholders.
 */
const TEMPLATES = [
  `Hey boss, so I threw a dart at a map and it landed on {country}. I'm choosing to interpret this as a legally binding sign from the universe. Booking flights now, talk soon 🎯✈️`,

  `Hi boss, quick update: a dart just chose {country} for my next vacation. I didn't choose it, fate did. And you can't argue with fate. PTO request incoming 🤷‍♂️🎯`,

  `Hey boss, fun fact — {funFact} Anyway, totally unrelated, but I need some time off to go to {country}. For research purposes obviously 📚✈️`,

  `Boss, I just threw a dart at a world map and hit {country}. It's currently {weather} in {capital}, which sounds infinitely better than our office AC. I'll be filing my PTO request shortly 😎🌴`,

  `Dear esteemed manager, the dart gods have spoken and they said "{country}." I don't make the rules. Please approve my leave before the dart gods get angry 🎯🙏`,

  `Hey boss, remember when you said I should be more spontaneous? Well, a dart just picked {country} for me. {weather} in {capital} right now. I see no reason to resist destiny ✨🛫`,

  `Hi boss! So apparently {funFact} I feel morally obligated to verify this in person. Requesting 2 weeks off to conduct field research in {country} 🧳🔬`,

  `Hey boss, bad news: a dart landed on {country} and now I legally have to go there. I don't write the laws of dart-based travel planning. I just follow them 🎯⚖️`,

  `Boss, I need a vacation. Where? Glad you asked. I let a dart decide and it chose {country}. It's {weather} in {capital}. Even the weather wants me there. PTO please? 🌤️✈️`,

  `Hey boss, throwing a dart at a map is basically the same as strategic career development, right? Anyway, {country} it is. I'll bring you a fridge magnet 🧲🎯`,

  `Hi boss, just FYI, I'm spiritually, emotionally, and now geographically called to {country}. A dart confirmed it. {funFact} I need to see this for myself 🗺️😤`,

  `Boss, the dart has spoken: {country}. I know what you're thinking — "that's not how PTO works." But consider this: {funFact} You can't tell me that's not worth investigating 🕵️✈️`,

  `Hey boss, I threw a dart at a map and it landed on {country} where it's currently {weather} in {capital}. Meanwhile I'm sitting here under fluorescent lights. Surely you see the problem 💡➡️🌴`,

  `Dear boss, this is my formal resignation from being at the office next week. A dart chose {country} and I must honor the sacred dart covenant. Will send postcards 📮🎯`,

  `Hey boss, plot twist — a dart just picked {country} for my vacation. {funFact} That's one more fun fact than I learned in our last team meeting. Requesting time off to continue my education 📖🎓`,

  `Boss, I consulted my most trusted travel advisor (a dart) and it recommended {country}. It's {weather} in {capital}. My advisor has never steered me wrong. PTO form attached mentally 🧠✈️`,

  `Hey boss, I know this is unconventional but hear me out: dart + map = {country}. {funFact} I feel like if I DON'T go, I'm disrespecting history. And I would never do that 🏛️😇`,

  `Hi boss, quick question — is "a dart told me to" a valid reason on the PTO form? Asking for myself. The dart chose {country} and honestly? It's got better judgment than most of us 🎯😂`,

  `Hey boss, I've been doing some deep analytical work (throwing darts) and my findings suggest I urgently need to visit {country}. Current conditions: {weather} in {capital}. My analysis is bulletproof 📊🎯`,

  `Boss, I'll keep this short: dart → map → {country}. {funFact} If you need me, I'll be packing. If you don't need me, I'll also be packing. Either way: packing 🧳🫡`,
]

/**
 * Pick a random Slack message template and fill in the placeholders.
 */
export function getSlackMessage(
  country: string,
  funFact: string,
  weather?: string,
  capital?: string,
): string {
  const idx = Math.floor(Math.random() * TEMPLATES.length)
  return TEMPLATES[idx]
    .replace(/\{country\}/g, country)
    .replace(/\{funFact\}/g, funFact.replace(/^Did you know\?\s*/i, '').trim())
    .replace(/\{weather\}/g, weather ?? 'lovely')
    .replace(/\{capital\}/g, capital ?? 'the capital')
}
