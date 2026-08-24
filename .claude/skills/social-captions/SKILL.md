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
script for it. The audio exists. Write the caption to complement what she
already said rather than repeat it, and make sure the search phrase she said
out loud is the one the caption targets, so both slots point the same way.

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
than landing a moral. Contradiction and small imperfection read as human -
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
