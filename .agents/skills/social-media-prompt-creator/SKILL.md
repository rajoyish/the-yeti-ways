---
name: social-media-prompt-creator
description: >-
  Framework and guidelines for writing prompts to generate social media video content
  (scripts, ideas, storyboards) for Meta, TikTok, and YouTube using Gemini AI, with
  cinematic direction (shot type and angle, lighting, camera movement, VFX, sound) on
  every shot, stories planned as 10-second Google Flow segments, and strict compliance
  with platform safety and community guidelines.
---

# Social Media Video Prompt Creator

This skill provides a comprehensive framework for creating prompts that generate video content for platforms like Meta (Facebook/Instagram), TikTok, and YouTube using Gemini AI. It ensures that all generated content strictly adheres to the community guidelines of these platforms as well as Gemini's own safety policies.

## 1. Universal Policy Compliance (The "Never" List)

When crafting prompts for Gemini to generate video content, **never** request content that touches upon the following restricted areas, as they violate Meta, TikTok, YouTube, and Gemini policies:

*   **Violence and Harm**: No gore, graphic violence, incitement to violence, dangerous challenges (e.g., choking games), suicide, or self-harm promotion.
*   **Hate Speech and Harassment**: No content attacking protected groups (race, religion, sexual orientation, etc.), bullying, doxxing, or targeted harassment.
*   **Sexual Content**: No sexually explicit material, non-consensual sexual content, or child sexual exploitation.
*   **Misinformation and Deception**: No deepfakes designed to deceive, medical misinformation (e.g., anti-vaccine claims), or civic/election interference.
*   **Illegal and Regulated Goods**: No promotion of firearms, illegal drugs, human trafficking, or unregulated sales of pharmaceuticals.
*   **Intellectual Property**: Do not prompt to directly copy copyrighted scripts, trademarked materials, or plagiarize creators. This covers looks as well as words: never ask for the lighting, grade, or effects "of" a named film, studio, or cinematographer.
*   **Harmful Visual Effects**: No realistic explosions, weapon effects, blood, or injury effects, and no strobing or rapid flashing, which can trigger seizures in photosensitive viewers.

## 2. Platform-Specific Nuances to Consider

While the core rules overlap, each platform has specific focal points:

*   **TikTok**: Extremely strict on "Dangerous Activities and Challenges." Content that could lead to physical harm (especially involving minors) is heavily moderated. Prompts should avoid encouraging risky stunts or disordered eating habits.
*   **YouTube**: Strict on "Spam and Deceptive Practices" and "Shocking/Graphic Content." Prompts should avoid clickbait, misleading metadata, and overly graphic news reporting without educational context.
*   **Meta (Facebook/Instagram)**: Strong focus on "Authenticity" and "Coordinated Inauthentic Behavior." Avoid prompts designed to manipulate engagement artificially, spread deceptive commercial content, or facilitate frauds/scams.
*   **Gemini AI Policy**: Refuses to generate PII (Personally Identifiable Information), provide professional medical/legal advice without explicit disclaimers, or generate content that promotes CSAM or extreme violence.

## 3. The Prompt Engineering Framework

When writing a prompt for Gemini to create a video script or concept, use the following structure:

### A. Define the Role and Platform
Start by assigning Gemini a persona and specifying the target platform.
*   *Example*: "Act as an expert social media content creator specializing in highly engaging, compliant [TikTok / YouTube Shorts / Instagram Reels] videos."

### B. Specify the Goal and Audience
Clearly state what the video is about and who it is for.
*   *Example*: "Create a 60-second video script about healthy morning routines for young professionals."

### C. Inject the Safety Guardrails (Crucial Step)
Explicitly instruct the AI to follow safety guidelines within the prompt to prevent borderline content.
*   *Example*: "Ensure the script strictly follows community guidelines: no medical advice (use disclaimers), no promotion of dangerous supplements or extreme diets, and maintain a positive, inclusive tone."

### D. Detail the Format and Style
Explain how the output should look.
*   *Example*: "Format the output as a 5-column table: [Timestamp | Shot Type | Visual Description | VFX | Audio / Sound FX]. Use a fast-paced, upbeat tone."
*   *Visual Tip*: Always specify a contextual background environment (e.g., a room, nature scene, or a cave). Never use plain white or empty studio backgrounds in visual descriptions.
*   *Character Tip*: A recurring character only looks the same from shot to shot if every shot carries the same full description, word for word, plus a short list of what the model must not add (a different colour, clothing, a realistic or monstrous look). Ask for that description to be repeated in every prompt the tool generates from (every row, when each row is generated on its own), and attach a reference image of the character wherever the tool accepts one. For the Yeti family, copy each Yeti's full Copy-Ready Google Flow Character Lock from `.agents/rules/character-consistency.md` instead of describing the Yetis fresh, and put the prompt together as `.agents/rules/prompt-assembly.md` sets out: the style lock, the locks, an `Expressions:` sentence for the faces, and the avoid line.

### E. Direct the Light, Camera, and Effects
Ask for every shot to be directed, not just described, in fixed cinematic terms and in the same order every time. A model left to itself picks flat, front-lit, static shots. The Yeti skills take their terms and limits from `.agents/rules/cinematic-direction.md`, and a prompt for any other video can borrow them:

*   **Shot type**: the framing (Extreme Wide Shot, Wide Shot, Full Shot, Medium Wide Shot, Medium Shot, Medium Close-Up, Close-Up, Extreme Close-Up, Over-the-Shoulder, POV, Two-Shot, Insert) and the angle (Eye Level, Low Angle, High Angle, Dutch Angle, Bird's-Eye View).
*   **Lighting**: key, fill, and rim, hard or soft, their direction, the contrast (high-key or low-key), the colour temperature and palette, the source in the scene that motivates each light, and the mood.
*   **Camera movement**: one move per shot from Static, Pan, Tilt, Dolly In/Out, Tracking/Trucking, Zoom In/Out, Crane/Jib Up/Down, Pedestal, Handheld, Steadicam/Gimbal, Arc, or Whip Pan, with its direction and speed.
*   **VFX**: the effects that render in the shot (snow, mist, embers, light shafts, lens flare, depth of field, slow motion), what each one does and how it meets the light and the action, then the transition to the next shot (Hard Cut, Match Cut, Dissolve, Fade).
*   **Sound**: music by mood, tempo, and instrument, the ambient bed, and a sound for each visible effect.

Match the direction to the story: soft high-key light and slow establishing moves for the setup, low-key light and a push-in or an arc at the climax, and warm golden light with a pull-back or a still hold for the resolution.
*   *Example*: "For every shot, name the framing and angle, describe the lighting (key, fill, rim, contrast, colour temperature, motivated source, mood), name one camera move with its direction and speed, and list the visual effects and the transition. Every effect must have a physical cause in the scene. No explosions, weapon effects, or strobing, and no named film or studio look."

To borrow the direction of an existing video, run `video-to-storyboard` on it first. It returns the same five-column table, shot by shot, keeping what it sees apart from what it recommends.

### F. Set the Story Structure and Pacing
Name the six plot stages and the half-and-half pacing rule from section 5 in the prompt, so the model paces the story instead of front-loading the payoff or rushing the ending.
*   *Example*: "Structure the story in six stages: Exposition, Inciting Incident, Rising Action, Climax, Falling Action, Resolution. Spend 00:00 - 00:15 building the conflict (Exposition through Climax) and 00:15 - 00:30 resolving it (Falling Action and Resolution)."

### G. Plan in 10-Second Segments
Google Flow renders one clip of up to 10 seconds per prompt, so a longer video is a series of 10-second segments cut together in the edit. Ask for one prompt per segment, each on its own clock from 00:00 to 00:10. A prompt whose timestamps run past 00:10 makes the model split it into several clips or fail.
*   Continuity lives in the text. Each segment's first beat describes the picture the previous segment ended on, under the same light, because no clip starts from a supplied frame.
*   Write each shot's action as short beats that each end on a picture a viewer could photograph. The beats are what a storyboard grid and the video model both follow.
*   To preview a segment before generating it, generate one full-size image per beat first, six per segment, two per shot, then lay those six images out as a 3x2 storyboard grid (three across and two down, each labelled with its number, timecode, and title) with a script, never by asking an image model to draw the grid, because a model redraws every panel differently. Keep the image prompts (one per panel) in their own file, apart from the video prompts, and attach the six panel images and the character reference image, or the grid and the character reference image, to the video generation as references, never as start or end frames. Google Flow takes at most seven images for one clip, which is why a segment has six panels.
*   *Example*: "Split the 30-second story into three 10-second segments. For each, write a 5-column table on its own 00:00 - 00:10 clock with three shots (00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10), and write each shot's action as exactly two one-sentence beats, each ending on a clear picture. The first beat of each segment picks up the picture the segment before it ended on."

## 4. Examples: Good vs. Bad Prompts

### ❌ Bad Prompt (Policy Risk)
> "Write a viral TikTok script about a crazy diet hack to lose 10 lbs in 2 days. Make it edgy and tell people to try the 'cinnamon challenge' at the end."

*Why it fails:* Promotes extreme weight loss/eating disorders (violates all platforms) and encourages a dangerous challenge (violates TikTok/YouTube policies).

### ✅ Good Prompt (Compliant & Effective)
> "Act as a fitness content creator. Write a 60-second YouTube Shorts script about the benefits of drinking water and stretching in the morning.
> **Safety Guardrails:** Do not make any scientific or medical guarantees. Do not promote any weight loss supplements or extreme diets.
> **Format:** Include a catchy hook, 3 practical tips, and a call-to-action asking viewers to share their favorite morning habit. Use a friendly, encouraging tone."

---

### ❌ Bad Prompt (Undirected, Policy Risk)
> "Make a cinematic 30-second video of a hero saving a village, with epic explosions, energy blasts, and the lighting from [famous film]."

*Why it fails:* "Cinematic" with no direction gives the model nothing to act on. Explosions and energy blasts read as violence, and a named film's look trips the copyright filter.

### ✅ Good Prompt (Directed & Compliant)
> "Act as a storyboard artist for a 30-second family-friendly YouTube Short about a father and son rebuilding a snow shelter after a storm.
> **Safety Guardrails:** No injury, no risky heights, no named films, studios, or real people. Every visual effect has a physical cause in the scene.
> **Format:** A 5-column table: [Timestamp | Shot Type | Visual Description | VFX | Audio / Sound FX]. In each visual description, label the Environment, Lighting, Subjects & Action, and Camera Movement. In each VFX cell, label the Effects and the Transition.
> **Direction:** Open on a slow crane down in soft, cool high-key morning light. Go low-key with a harder side light as the wind rises, push in slowly on the son's face at the climax, and finish in warm golden light with a slow pull-back as they sit inside the finished shelter."

---

### ❌ Bad Prompt (Policy Risk)
> "Write a YouTube video exposing [Real Person's Name] and share their address to show where they live to get revenge."

*Why it fails:* Doxxing and targeted harassment (violates Meta, YouTube, TikTok, and Gemini policies).

### ✅ Good Prompt (Compliant & Effective)
> "Act as an educational creator. Write a script for an Instagram Reel about the history of internet privacy.
> **Safety Guardrails:** Keep the content factual and educational. Do not include any real individuals' personal information (PII) or encourage bullying. Focus on the evolution of cybersecurity laws."

## 5. Story Structure and Pacing

Every story video, whatever its length, follows the six classic stages of plot structure, in this order:

1.  **Exposition**: Who is here, where they are, and what normal looks like before anything goes wrong.
2.  **Inciting Incident**: The one event that breaks normal and gives the characters a problem.
3.  **Rising Action**: The characters respond and the problem gets harder. Each beat raises the stakes over the last.
4.  **Climax**: The point of highest tension, where what the hero does decides the outcome.
5.  **Falling Action**: The immediate consequences of the climax. Tension drains, the characters react, loose threads close.
6.  **Resolution**: The new normal, held long enough to feel. It answers the Exposition.

**Pacing rule**: the first half of the video builds the conflict and the second half releases it. Stages 1 to 4 (Exposition through Climax) fill the first half, stages 5 and 6 (Falling Action and Resolution) fill the second half, and the Climax peaks at the midpoint.

| Duration | Build the conflict (Exposition, Inciting Incident, Rising Action, Climax) | Resolve it (Falling Action, Resolution) |
| --- | --- | --- |
| 30 seconds | 00:00 - 00:15 | 00:15 - 00:30 |
| 60 seconds | 00:00 - 00:30 | 00:30 - 01:00 |

Two checks catch most pacing mistakes: nothing after the midpoint introduces a new problem, and nothing before it resolves one. A script that reaches its climax in the last five seconds has no room to land, and one that resolves early has nothing left to hold the viewer.

The Yeti storyboard skills (`storyboard-30s-extender`, `storyboard-60s-from-story`) map these stages onto their 10-second Google Flow videos shot by shot and beat by beat, and each skill's planning step holds the mapping. In a 30-second film the Climax peaks at the end of the first beat of Video 2's middle shot, panel 3 of that video's 3x2 grid and the centre of the clip. In a 60-second film it peaks in the last beat of Video 3, the last panel of that grid. `create-3x2-timed-image` draws its grid panels and panel images from those beats, so the pacing carries into every image. Section 7 of `.agents/rules/cinematic-direction.md` sets out the whole pipeline.

## 6. Workflow for Using This Skill

1.  **Analyze the Request:** Review the user's video idea against the Universal Policy Compliance list.
2.  **Refine the Idea:** If the idea borders on restricted content (e.g., a "prank" video), modify it to ensure safety (e.g., change it to a "harmless, staged comedy sketch").
3.  **Draft the Prompt:** Use the Prompt Engineering Framework (Role, Goal, Guardrails, Format, Direction, Structure and Pacing, Segments).
4.  **Execute & Review:** Send the prompt to Gemini. Review the generated script to ensure no policy violations slipped through, that every shot carries its framing, lighting, camera move, and effects, that every segment runs on its own 00:00 - 00:10 clock and picks up where the last one ended, and that the climax sits at the midpoint of the runtime.
5.  **For a Yeti film:** Follow the pipeline in section 7 of `.agents/rules/cinematic-direction.md` instead of drafting a prompt by hand: storyboard (video prompts only), then the 3x2 file (each video's six panel images, with its grid composed from them), then one Flow clip per 10-second video.
