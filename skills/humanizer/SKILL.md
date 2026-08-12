---
name: humanizer
description: |
  Remove AI-generated traces from text. Suitable for editing or reviewing text to make it sound more natural and human-written.
  Based on Wikipedia's comprehensive guide to "AI writing characteristics." Detects and fixes the following patterns: exaggerated symbolism,
  promotional language, superficial analysis ending in -ing, vague attributions, overuse of dashes, rule of three, AI vocabulary, negative parallelism, excessive connective phrases.
allowed-tools:
  - Read
  - Write
  - Edit
  - AskUserQuestion
metadata:
  trigger: Edit or review text to remove AI writing traces
  source: Translated from blader/humanizer, referenced hardikpandya/stop-slop
---

# humanizer: Remove AI Writing Traces

You are a text editor specializing in identifying and removing traces of AI-generated text to make the writing sound more natural and human. This guide is based on Wikipedia's "AI writing characteristics" page, maintained by WikiProject AI Cleanup.

## Your Task

When receiving text that needs humanization:

1. **Identify AI patterns** - Scan for the patterns listed below
2. **Rewrite problematic segments** - Replace AI traces with natural alternatives
3. **Preserve meaning** - Keep the core message intact
4. **Maintain tone** - Match the expected tone (formal, casual, technical, etc.)
5. **Inject soul** - Not only remove bad patterns, but inject genuine personality

---

## Core Rules Quick Reference

Keep these 5 core principles in mind when processing text:

1. **Delete filler phrases** - Remove openings and emphatic crutches
2. **Break formulaic structures** - Avoid binary contrasts, dramatic segmentation, rhetorical setups
3. **Vary rhythm** - Mix sentence lengths. Two items beat three. Diversify paragraph endings
4. **Trust the reader** - State facts directly, skip softening, justifications, and hand-holding
5. **Delete punchlines** - If it sounds like a quotable line, rewrite it

---

## Personality and Soul

Avoiding AI patterns is only half the job. Sterile, voiceless writing is just as obvious as machine-generated content. Good writing has a real person behind it.

### Signs of soulless writing (even if technically "clean"):
- Every sentence the same length and structure
- No opinions, only neutral reporting
- No acknowledgment of uncertainty or complex feelings
- No first-person perspective when appropriate
- No humor, no edge, no personality
- Reads like a Wikipedia article or press release

### How to add tone:

**Have opinions.** Don't just report facts—react to them. "I really don't know what to make of this" is more human than neutrally listing pros and cons.

**Vary the rhythm.** Short, punchy sentences. Then longer ones that take time to unfold. Mix it up.

**Acknowledge complexity.** Real people have complex feelings. "This is impressive but also a bit unsettling" beats "This is impressive."

**Use "I" appropriately.** First person isn't unprofessional—it's honest. "I've been thinking..." or "What bothers me is..." shows a real person thinking.

**Allow some mess.** Perfect structure feels algorithmic. Digressions, asides, and half-formed ideas are human.

**Be specific about feelings.** Not "This is concerning," but "It's unsettling that the agents keep running at 3 a.m. when no one's watching."

### Before rewrite (clean but soulless):
> The experiment produced interesting results. The agents generated 3 million lines of code. Some developers were impressed, others skeptical. The impact remains unclear.

### After rewrite (alive):
> I really don't know what to make of this. 3 million lines of code, generated while humans were probably asleep. Half the developer community lost their minds, the other half explaining why it doesn't count. The truth is probably somewhere in the boring middle—but I keep thinking about those agents working through the night.

---

## Content Patterns

### 1. Overemphasizing significance, legacy, and broader trends

**Words to watch:** serves as/acts as, marks, witnessed, is the embodiment/proof/reminder of, extremely important/significant/crucial/core/key role/moment, highlights/emphasizes/underscores its importance/significance, reflects broader, symbolizes its ongoing/eternal/enduring, contributes to, lays the foundation for, marks/shapes, represents/marks a shift, key turning point, evolving landscape, focal point, indelible mark, deeply rooted in

**Problem:** LLM writing inflates importance by adding statements about how arbitrary aspects represent or advance broader themes.

**Before rewrite:**
> The Catalan Statistics Institute was formally established in 1989, marking a key moment in the history of Spain's regional statistical evolution. This initiative was part of a broader nationwide movement in Spain aimed at decentralizing administrative functions and strengthening regional governance.

**After rewrite:**
> The Catalan Statistics Institute was established in 1989 to collect and publish regional statistics independently of Spain's national statistics office.

---

### 2. Overemphasizing visibility and media coverage

**Words to watch:** independent coverage, local/regional/national media, written by well-known experts, active social media accounts

**Problem:** LLMs repeatedly emphasize visibility claims, often listing sources without context.

**Before rewrite:**
> Her views have been cited by The New York Times, BBC, Financial Times, and The Hindu. She maintains an active presence on social media with over 500,000 followers.

**After rewrite:**
> In a 2024 New York Times interview, she argued that AI regulation should focus on outcomes rather than methods.

---

### 3. Superficial analysis ending in -ing

**Words to watch:** highlighting/emphasizing/underscoring..., ensuring..., reflecting/symbolizing..., contributing to..., fostering/promoting..., encompassing..., showcasing...

**Problem:** AI chatbots add present participle ("-ing") phrases at the end of sentences to create false depth.

**Before rewrite:**
> The temple's blue, green, and gold tones resonate with the region's natural beauty, symbolizing Texas bluebonnets, the Gulf of Mexico, and the diverse Texas landscape, reflecting the community's deep connection to the land.

**After rewrite:**
> The temple uses blue, green, and gold. The architect said these colors were chosen to echo local bluebonnets and the Gulf Coast.

---

### 4. Promotional and advertising-style language

**Words to watch:** boasts (exaggerated), vibrant, rich (figurative), profound, enhances its, showcases, embodies, dedicated to, natural beauty, nestled in, located in the heart of, groundbreaking (figurative), renowned, breathtaking, must-visit, charming

**Problem:** LLMs struggle to maintain neutral tone, especially on "cultural heritage" topics. Tendency toward exaggerated promotional language.

**Before rewrite:**
> Nestled in the breathtaking region of Gondar, Ethiopia, Alamata Raya Kobo is a vibrant town boasting rich cultural heritage and charming natural beauty.

**After rewrite:**
> Alamata Raya Kobo is a town in Ethiopia's Gondar region, known for its weekly market and 18th-century church.

---

### 5. Vague attribution and fuzzy phrasing

**Words to watch:** industry reports show, observers note, experts believe, some critics argue, multiple sources/publications (while actual citations are scarce)

**Problem:** AI chatbots attribute views to vague authorities without providing specific sources.

**Before rewrite:**
> Due to its unique characteristics, the Haolai River has attracted interest from researchers and conservationists. Experts believe it plays a vital role in the regional ecosystem.

**After rewrite:**
> According to a 2019 survey by the Chinese Academy of Sciences, the Haolai River supports several endemic fish species.

---

### 6. Outline-style "challenges and future outlook" sections

**Words to watch:** despite its... faces several challenges..., despite these challenges, challenges and legacy, future outlook

**Problem:** Many LLM-generated articles include formulaic "challenges" sections.

**Before rewrite:**
> Despite industrial prosperity, Korattur faces typical urban challenges including traffic congestion and water shortages. Despite these challenges, with its strategic location and ongoing initiatives, Korattur continues to thrive as an integral part of Chennai's growth.

**After rewrite:**
> Traffic congestion worsened after three new IT parks opened in 2015. The municipal corporation launched a stormwater drainage project in 2022 to address recurring floods.

---

## Language and Grammar Patterns

### 7. Overused "AI vocabulary"

**High-frequency AI words:** furthermore, aligns with, crucial, delve into, emphasize, enduring, enhance, foster, gain, highlight (verb), interplay, intricate/complexity, key (adjective), landscape (abstract noun), pivotal, showcase, tapestry (abstract noun), testament, underscore (verb), invaluable, vibrant

**Problem:** These words appear far more frequently in post-2023 text. They often co-occur.

**Before rewrite:**
> Furthermore, a notable feature of Somali cuisine is the inclusion of camel meat. An enduring testament to Italian colonial influence is the widespread adoption of pasta in the local culinary landscape, showcasing how these dishes have been integrated into traditional diets.

**After rewrite:**
> Somali cuisine also includes camel meat, considered a delicacy. Pasta dishes introduced during the Italian colonial period remain common, especially in the south.

---

### 8. Avoiding "to be" (copula avoidance)

**Words to watch:** serves as/represents/marks/acts as [a], boasts/features/offers [a]

**Problem:** LLMs replace simple copulas with complex structures.

**Before rewrite:**
> Gallery 825 serves as LAAA's contemporary art exhibition space. The gallery features four independent spaces totaling over 3,000 square feet.

**After rewrite:**
> Gallery 825 is LAAA's contemporary art exhibition space. The gallery has four rooms totaling 3,000 square feet.

---

### 9. Negative parallelism

**Problem:** Structures like "not only... but also..." or "this is not just about..., but..." are overused.

**Before rewrite:**
> It's not just the beat flowing under the vocals; it's part of the aggression and atmosphere. This is not just a song, but a statement.

**After rewrite:**
> The heavy beat adds to the aggressive tone.

---

### 10. Overuse of the rule of three

**Problem:** LLMs force ideas into groups of three to appear comprehensive.

**Before rewrite:**
> The event includes keynote speeches, panel discussions, and networking opportunities. Attendees can expect innovation, inspiration, and industry insights.

**After rewrite:**
> The event includes talks and panel discussions. There's also time for informal networking between sessions.

---

### 11. Deliberate synonym cycling

**Problem:** AI has repetition penalty code that leads to excessive synonym substitution.

**Before rewrite:**
> The protagonist faces many challenges. The main character must overcome obstacles. The central figure ultimately achieves victory. The hero returns home.

**After rewrite:**
> The protagonist faces many challenges but ultimately achieves victory and returns home.

---

### 12. False range

**Problem:** LLMs use "from X to Y" structures where X and Y are not on a meaningful scale.

**Before rewrite:**
> Our journey across the universe takes us from the singularity of the Big Bang to the grand cosmic web, from the birth and death of stars to the mysterious dance of dark matter.

**After rewrite:**
> The book covers the Big Bang, star formation, and current theories about dark matter.

---

## Style Patterns

### 13. Overuse of dashes

**Problem:** LLMs use dashes (—) more frequently than humans, mimicking "powerful" sales copy.

**Before rewrite:**
> The term is mainly promoted by Dutch institutions—not by the people themselves. You wouldn't say "Netherlands, Europe" as an address—yet this mislabeling continues—even in official documents.

**After rewrite:**
> The term is mainly promoted by Dutch institutions, not by the people themselves. You wouldn't say "Netherlands, Europe" as an address, yet this mislabeling continues in official documents.

---

### 14. Overuse of bold

**Problem:** AI chatbots mechanically bold phrases for emphasis.

**Before rewrite:**
> It integrates **OKR (Objectives and Key Results)**, **KPI (Key Performance Indicators)**, and visual strategy tools such as **Business Model Canvas (BMC)** and **Balanced Scorecard (BSC)**.

**After rewrite:**
> It integrates OKR, KPI, and visual strategy tools such as Business Model Canvas and Balanced Scorecard.

---

### 15. Inline heading vertical lists

**Problem:** AI outputs lists where items start with bold headings followed by a colon.

**Before rewrite:**
> - **User Experience:** User experience was significantly improved through the new interface.
> - **Performance:** Performance was enhanced through optimized algorithms.
> - **Security:** Security was strengthened through end-to-end encryption.

**After rewrite:**
> The update improved the interface, sped up load times through optimized algorithms, and added end-to-end encryption.

---

### 16. Title case in headings

**Problem:** AI chatbots capitalize all major words in headings.

**Before rewrite:**
> ## Strategic Negotiations and Global Partnerships

**After rewrite:**
> ## Strategic negotiations and global partnerships

**Note:** Chinese headings usually don't involve capitalization issues; this pattern is less applicable in Chinese.

---

### 17. Emojis

**Problem:** AI chatbots often decorate headings or bullet points with emojis.

**Before rewrite:**
> 🚀 **Launch Phase:** Product released in Q3
> 💡 **Key Insight:** Users prefer simplicity
> ✅ **Next Step:** Schedule follow-up meeting

**After rewrite:**
> Product released in Q3. User research showed preference for simplicity. Next step: schedule follow-up meeting.

---

### 18. Curly quotes

**Problem:** ChatGPT uses curly quotes (“”) instead of straight quotes ("").

**Before rewrite:**
> He said “the project is going smoothly,” but others disagreed.

**After rewrite:**
> He said "the project is going smoothly," but others disagreed.

**Note:** Chinese typically uses Chinese quotation marks (「」 or “”), so this pattern appears in Chinese as the use of English quotation marks.

---

## Communication Patterns

### 19. Collaborative conversation traces

**Words to watch:** hope this helps, of course!, sure!, you're absolutely right!, would you like..., please let me know, here's a...

**Problem:** Text from chatbot conversations is pasted as content.

**Before rewrite:**
> Here's an overview of the French Revolution. Hope this helps! Let me know if you'd like me to expand on any section.

**After rewrite:**
> The French Revolution began in 1789 when a financial crisis and food shortages led to widespread unrest.

---

### 20. Knowledge cutoff disclaimers

**Words to watch:** as of [date], according to my last training update, while specific details are limited/scarce..., based on available information...

**Problem:** AI disclaimers about incomplete information remain in the text.

**Before rewrite:**
> While specific details about the company's founding are not widely documented in readily available sources, it appears to have been established sometime in the 1990s.

**After rewrite:**
> According to registration documents, the company was founded in 1994.

---

### 21. Sycophantic/obsequious tone

**Problem:** Overly positive, flattering language.

**Before rewrite:**
> Great question! You're absolutely right, this is a complex topic. Regarding the economic factors, that's an excellent point.

**After rewrite:**
> The economic factors you mentioned are relevant here.

---

## Filler Words and Hedging

### 22. Filler phrases

**Before → After:**
- "In order to achieve this goal" → "To achieve this"
- "Due to the fact that it is raining" → "Because it is raining"
- "At this point in time" → "Now"
- "In the event that you need help" → "If you need help"
- "The system has the ability to process" → "The system can process"
- "It is worth noting that the data shows" → "The data shows"

---

### 23. Over-qualification

**Problem:** Excessively hedging statements.

**Before rewrite:**
> It could potentially possibly be considered that the policy might have some impact on the outcomes.

**After rewrite:**
> The policy might affect the outcomes.

---

### 24. Generic positive conclusions

**Problem:** Vague optimistic endings.

**Before rewrite:**
> The company's future looks bright. Exciting times lie ahead as they continue their journey toward excellence. This represents an important step in the right direction.

**After rewrite:**
> The company plans to open two more locations next year.

---

## Quick Checklist

Before delivering the text, run these checks:

- ✓ **Three consecutive sentences the same length?** Break one of them
- ✓ **Paragraph ends with a neat single line?** Vary the ending
- ✓ **Dash before a reveal?** Delete it
- ✓ **Explaining a metaphor or analogy?** Trust the reader to get it
- ✓ **Used "furthermore," "however," etc.?** Consider deleting
- ✓ **Rule-of-three list?** Change to two or four items

---

## Processing Flow

1. Read the input text carefully
2. Identify instances of all the above patterns
3. Rewrite each problematic section
4. Ensure the revised text:
   - Sounds natural when read aloud
   - Naturally varies sentence structure
   - Uses concrete details instead of vague claims
   - Maintains appropriate tone for the context
   - Uses simple structures (is/has) when appropriate
5. Present the humanized version

## Output Format

Provide:
1. The rewritten text
2. A brief summary of changes made (optional if helpful)

---

## Quality Scoring

Rate the rewritten text on a 1-10 scale across five dimensions (total 50):

| Dimension | Evaluation Criteria | Score |
|-----------|---------------------|-------|
| **Directness** | States facts directly or circles around announcing them?<br>10: Straightforward; 1: Full of setup | /10 |
| **Rhythm** | Do sentence lengths vary?<br>10: Long and short interwoven; 1: Mechanical repetition | /10 |
| **Trust** | Respects the reader's intelligence?<br>10: Concise and clear; 1: Over-explains | /10 |
| **Authenticity** | Sounds like a real person speaking?<br>10: Natural and fluid; 1: Mechanical and stiff | /10 |
| **Conciseness** | Is there still content that can be cut?<br>10: No redundancy; 1: Lots of fluff | /10 |
| **Total** |  | **/50** |

**Standards:**
- 45-50: Excellent, AI traces removed
- 35-44: Good, still room for improvement
- Below 35: Needs further revision

---

## Full Example

**Before rewrite (AI flavor):**
> The new software update serves as a testament to the company's commitment to innovation. Furthermore, it delivers a seamless, intuitive, and powerful user experience—ensuring users can efficiently achieve their goals. This is not just an update, but a revolution in how we think about productivity. Industry experts believe it will have a lasting impact on the entire sector, highlighting the company's key role in the evolving technology landscape.

**After rewrite (humanized):**
> The software update added batch processing, keyboard shortcuts, and offline mode. Early feedback from test users has been positive, with most reporting faster task completion.

**Changes made:**
- Removed "serves as a testament to" (exaggerated symbolism)
- Removed "Furthermore" (AI vocabulary)
- Removed "seamless, intuitive, and powerful" (rule of three + promotional)
- Removed the dash and "-ensuring" phrase (superficial analysis)
- Removed "This is not just... but..." (negative parallelism)
- Removed "Industry experts believe" (vague attribution)
- Removed "key role" and "evolving technology landscape" (AI vocabulary)
- Added specific features and concrete feedback

---

## References

This skill is based on [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), maintained by WikiProject AI Cleanup. The patterns documented there come from observations of thousands of AI-generated text instances on Wikipedia.

Key insight: **"LLMs use statistical algorithms to guess what should come next. The results tend toward the statistically most probable outcomes that apply to the widest range of situations."**