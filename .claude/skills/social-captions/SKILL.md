---
name: social-captions
description: Write Instagram and TikTok captions, hashtag sets, alt text, on-screen text, and teleprompter scripts for a fashion and fitness creator, in her own plain casual voice, built to get found in in-app search. Use this skill whenever she is making a post, reel, story, carousel, or video and needs the words that go with it - meals, workouts, outfits, gym check-ins, what-I-eat-in-a-day, day-in-the-life, product mentions, or talking-to-camera videos. Trigger it even when she never says the word "caption" - phrases like "I'm posting my dinner tomorrow", "need something to go with this gym pic", "what do I say on this reel", or "write the script for my video about protein" all mean this skill. Output is finished text she pastes straight into the app with nothing left to edit.
---

# Social captions

Write the words for a post so they sound like her and get found in search.

Two jobs at once, and they are not in conflict:

1. **Sound like her.** She writes short and plain. Her captions are lists, not
   essays. No lesson at the end, no "drop a 🙌 if you agree." If a caption
   sounds like a brand wrote it, it has failed, no matter how well it ranks.
2. **Get found.** Instagram and TikTok both index caption text, and TikTok also
   indexes the words spoken aloud in the video. A huge share of her reach comes
   from people searching "healthy dinner ideas" or "high protein african food,"
   not from followers scrolling. Captions that name things plainly are already
   good for search. The work is to be deliberate about it.

These reconcile because **the search term is usually the true, plain name of
the thing.** "Japanese sweet potatoes" is both how she talks and what people
type. "Nourishing golden bowl ✨" is neither. When voice and search seem to
pull apart, pick the phrasing a real person would say out loud in conversation
and would also type into a search bar. That phrase almost always exists.

## Before writing

Read `references/voice-profile.md` every time. It holds her real captions and
the patterns pulled from them. It is the ground truth for how she sounds, and
she updates it as she posts more, so it drifts closer to her over time. Nothing
in this file overrides it.

Then get the facts straight. **Never invent a detail and never leave a
placeholder.** She pastes this output directly into the app, so a stray
`[restaurant name]` or a guessed macro count is worse than useless - it means
she has to rewrite it, which is the whole thing this skill exists to avoid.

If something is missing, ask in one short message, then write. Things worth
asking about when they are not obvious:

- What is actually in the frame or on the plate
- Whether it is a photo, carousel, or video, and if video, whether she talks
- Anything specific and true worth naming: a number, a place, a brand, a time

If she gives you enough to work with, do not interrogate her. Write.

## Working from a voice note or transcript

She often talks through a post before or while filming it, and a rough
transcript of that is the single best input this skill can get. Claude cannot
listen to audio, so the transcript has to arrive as text - dictated into the
app, copied from her phone's voice-memo transcription, or lifted from
TikTok's or Instagram's auto-captions on an already-filmed video.

When she pastes one, treat it as raw material rather than a draft to polish.
Transcripts are messy by nature - false starts, repeated words, "mhmm,"
sentences that never land. That mess is the most valuable thing in the file,
because it is literally how she talks. Mine it for three things:

- **The facts.** What is actually on the plate, the real numbers, the place,
  the brand. This is what stops the skill from guessing.
- **Her phrasing.** If she says "that will help me bring a bit of this
  calorie," that is her sentence and it beats anything you would write. Lift
  her actual words into the caption wherever they fit.
- **The point she was making.** Usually buried in the middle, after she has
  talked herself into it. The thing she circles back to is the caption.

Auto-transcripts are also **unreliable in a way that matters**. Speech-to-text
mangles exactly the words that carry the meaning - a dish name, a number, the
one noun the whole post turns on - and a mangled transcript can invert the
message without looking wrong. A transcript that reads as a post about sweet
potatoes may be a post about African food in which sweet potatoes are the
counter-example.

So before drafting from a transcript, say back in one sentence what you think
the post is arguing, and let her confirm or correct it. That one exchange
costs a few seconds and prevents a caption that is fluent, well-formed, and
about the wrong thing.

Then cut hard. A minute of talking becomes four lines. Resist the pull to
summarise what she said - summarising is what makes captions sound written by
a machine. Pick the one true sentence out of it and let the rest go.

If the transcript is from an already-filmed video, do not write a teleprompter
script for it - the audio exists. Do write the caption to **cover the same
ground the audio covers.** This is worth being deliberate about, because the
instinct to avoid repeating yourself is wrong here: the platforms index the
spoken words and the caption text separately, so a term appearing in both is
reinforced rather than wasted. A caption that carefully avoids repeating the
video throws away the strongest signal available about what the post is about.

Summarise the audio in her voice, keep the key nouns intact, and let the
caption and the spoken words point at the same search phrase.

## Pick the search phrase first

Before drafting, decide the **one primary phrase** this post should get found
for. Make it something a real person would type - 2 to 5 words, specific enough
to be findable, broad enough that people search it.

Good: `high protein african dinner`, `japanese sweet potato recipe`,
`what i eat in a day fitness`, `gym outfit for short girls`
Too vague: `healthy food`, `fitness`
Too narrow: `egusi with exactly 40g protein on a tuesday`

Then place that phrase in as many indexed slots as it fits naturally:

- **First line of the caption** - the highest-value slot on both platforms
- **Spoken aloud in the first few seconds** of any video, because TikTok
  transcribes audio and indexes it. This is the slot most people miss.
- **On-screen text / cover text**
- **One hashtag**
- **Alt text** on Instagram

Pick 2 or 3 secondary phrases too and let them fall naturally into the item
lines. Naturally is the operative word - a caption that reads like it was
built around keywords loses her voice, and the algorithm is not the one
deciding whether to follow her.

## Caption architecture

Default to **three short paragraphs**, in this order, with a blank line between
each. The structure exists because each layer does a different job, and a
caption missing one of them underperforms in a specific way.

**1. The concrete anchor.** For a meal post this is the dishes, named plainly -
"amala" and "egusi" are exactly what someone types, and almost nobody in the
fitness space writes those words, so specific names beat category words like
"African food" every time.

For a post with nothing physical in it - a mindset or habit post - the anchor
is the claim itself, stated flat: "I eat the same things every day, I just
rotate them." Same job either way: give the reader and the search index
something specific in the first line rather than a windup.

Worth knowing which kind of post you have, because it changes what reach looks
like. Posts naming real things (dishes, products) get found through those
nouns, which is the strongest and most durable search traffic available to
her. Mindset posts have no such nouns and rank on phrases instead - "how to
make fitness a lifestyle," "getting back on track" - which is a thinner
market. Both are worth posting, but if growth is the goal, the noun-carrying
posts are the ones that compound.

**2. The teaching, told about herself.** This is the layer people get wrong,
and it is worth being careful about, because the difference is invisible in a
summary and obvious in the caption.

Write it in **first person, about what she does** - not in second person about
what the audience should do. "I eat this way sometimes even though I know how
calorie dense it can be, I just try to portion it properly and walk after"
teaches exactly the same thing as "you have to portion this or you'll undo your
progress," except one is a person describing her own life and the other is
someone being told off. The audience draws the lesson themselves, which is
both more persuasive and the reason they stay.

Practical version of the rule:

- Keep the verbs hers. "I try to," "I usually," "for me it's about."
- Hedge and soften. "Sometimes," "I try," "helps offset," "that's been enough
  for me." Certainty reads as a brand; hedging reads as a person.
- Cut anything accusatory. "Nobody wants to hear this," "you'll keep wondering
  why nothing is changing," "you're doing it wrong" - all of it goes. She is
  not correcting anyone.
- Second person is fine when it is permission rather than instruction: "you
  can still eat this and lose weight" opens a door. "You have to portion it"
  closes one.

She is showing them it is possible by doing it, not telling them what to do.

The teaching layer earns the save and the share, which move reach more than
likes do - and people save things that feel useful, not things that feel like
a scolding.

**3. The call to action.** She wants a real one now, because she is building a
community rather than an audience. Keep it warm, and keep it an offer.

Two kinds, and the difference matters:

- **The invite.** "More of what actually works for me if you want it." Low
  pressure, gives a reason to stay, says what someone is signing up for.
- **The comment keyword.** "Comment LIST and I'll send you my grocery list."
  This one is worth using often. It gets a reply, replies are the strongest
  engagement signal there is, and it starts an actual conversation in the DMs -
  which is how a following turns into the accountability community she is
  after. Only promise something that genuinely exists and that she will
  actually send.

Still avoid "double tap," "like if you agree," and engagement bait with nothing
behind it. The test is whether the reader gets something real for responding.
A keyword CTA that delivers a useful list is generous; one that harvests a
comment for the algorithm is not, and people can tell.

Then the hashtag block.

Not every post needs all three. A plain meal photo with nothing to teach is
fine as the bare list, which is her older format. But when there is a point to
make, the three layers are the shape.

### List posts

Recommendation videos - "five things worth every penny, gym edition" - do not
take the three-layer shape, because the list is the teaching. Use her older
format instead: a title line, then the numbered items with a blank line
between each, then the soft invite.

Two things carry these posts:

- **Name the products plainly.** "Weighted vest," "walking pad," "glass air
  fryer" are all high-intent searches, and someone looking one up is close to
  buying. A caption that says "my top five fitness essentials" without listing
  them is invisible to every one of those searches. The list is the SEO.
- **Keep her one-line reasons attached.** "I've had mine four years and it's
  still going" is worth more than the item name alone, and it is where the
  first-person rule still applies - she says what each thing did for her, not
  what the audience should buy.

If she frames a post as an "edition" of something, she is running a series.
Series are the strongest growth pattern available to her - same format, same
phrase family, posted repeatedly - so keep the title format consistent between
them and say so when a post looks like part of one.

## Output format

Give her **three caption options**, labeled by their angle so she can pick
fast, then the shared extras below them. Different angles, not three shuffles
of the same sentence - for example: the plain list, the one with a bit of
attitude, the one that names the tension in what she is doing.

Deliver each piece in its own copy-paste block with nothing in it but the text
she is pasting. No markdown bold inside a caption, no explanatory asides mixed
in, no numbering she would have to delete.

Use this structure:

```
OPTION 1 - [angle]
[caption text]

OPTION 2 - [angle]
[caption text]

OPTION 3 - [angle]
[caption text]

HASHTAGS
[the tag block]

ON-SCREEN TEXT
[3-6 words for the cover frame]

ALT TEXT (Instagram)
[one plain sentence describing the image, keyword included]

TELEPROMPTER  <- only when it is a video where she speaks
[the script]
```

Close with one short line naming the search phrase you targeted, so she knows
what the post is aiming at. Keep it to a sentence, outside the copy blocks.

### Instagram vs TikTok

Mostly the same caption works for both. Adjust when it matters:

- **Instagram** truncates around 125 characters, so the hook and the keyword
  have to land before the cutoff. Longer captions are fine below that line.
- **TikTok** is tighter. Keep it under about 150 characters. The spoken words
  and on-screen text do more work than the caption does.

If she is posting to both and the difference matters, give her both. If it
does not, give her one and say it works for both.

## Tone

Read `references/anti-ai-tells.md` before writing the first draft, and again
before you hand it over. It lists the specific constructions that make writing
read as AI-generated, and why each one gives the game away. That file is doing
most of the work of this skill.

The short version of what she does: short lines, plain nouns, real specifics,
occasional fragment, one emoji at most, and she stops when she is done rather
than landing a moral. Loose and a bit rambly beats trimmed and punchy - if a
sentence sounds like it was built to land, it will read as written. Contradiction and small imperfection read as human -
"I said one plate. It was three." is her. "Balance is about grace, not
restriction" is not.

## Hashtags

Read `references/search-and-reach.md` for the tag banks and the sizing logic.

Her habit is five lowercase tags at the end of the caption, and the shape of
her set is worth keeping: roughly three topic tags, one lifestyle tag, one
identity tag. Keep that shape, but spread the sizes - one broad, two or three
mid, one or two niche. A set where every tag has ten million posts is a set
where she is invisible in all of them.

Do not build walls of thirty tags. It looks like reach-chasing, it reads as
spam to the people she wants, and it is not how she posts.

## Teleprompter scripts

Written when she is talking to camera. This is a different craft from captions:
it has to survive being read out loud while she looks into a lens.

- **Say the search phrase in the first few seconds.** TikTok transcribes and
  indexes it, and it also tells the viewer they are in the right place.
- **One idea per line, one breath per line.** She is reading this while
  cooking, lifting, or looking at a camera. Long sentences strand her.
- **Write how she talks, not how she writes.** Her spoken voice repeats for
  emphasis, starts with "so," trails off, and does not finish every sentence.
  Leave that in. A script with perfect grammar sounds read.
- **No tongue-twisters, no words she would stumble on.** Read it back in your
  head. If it snags, rewrite it.
- **Budget the time.** About 140 words a minute, so roughly 35 words for 15
  seconds and 70 for 30. Say the target length in a note above the script, not
  inside the copy block.

Mark natural pauses with a line break rather than punctuation gymnastics. Do
not add stage directions unless she asks - she knows how to be on camera.
