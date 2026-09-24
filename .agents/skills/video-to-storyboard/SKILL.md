---
name: video-to-storyboard
description: >-
  Trigger when the user attaches or links a video and asks for a shot-by-shot storyboard,
  a shot list, or a cinematic breakdown of it, says "analyze this video", "storyboard
  this video", "break this video down shot by shot", or runs "/video-to-storyboard".
  Watches the whole video and writes one markdown table, one row per shot, with columns
  Timestamp, Shot Type, Visual Description (environment, lighting, subjects and action,
  camera movement), VFX (observed, transition, recommended), and Audio / Sound FX. The
  table is the source storyboard that `storyboard-30s-extender` and
  `storyboard-60s-from-story` turn into Yeti films.
---

# Video to storyboard

This skill turns an existing video into a shot-by-shot cinematic storyboard. The prompt below is the whole job. Run it as written on the video the user gives you.

It needs a model that can watch the video and hear its audio, such as Gemini in Antigravity. If you cannot watch the video, say so and stop. Do not build a storyboard from the file name, a thumbnail, or a description of the video, because every row of this table is supposed to be observed, and the storyboard skills treat it that way.

In this project, save the table to `prompts/<kebab-case-title>-source-storyboard.md` under a single `# <Title> Source Storyboard` heading, with nothing else in the file, and tell the user the next step: `/storyboard-30s-extender` on that file for a 30-second Yeti film, or `/storyboard-60s-from-story` for a 60-second one. Those skills recast the source's characters around Papa Yeti, Mama Yeti, and Babu Yeti, turn its dialogue into gestures, and filter its effects through `.agents/rules/cinematic-direction.md`. Outside this project, output only the table, as the prompt says.

## The prompt

Analyze the attached video and produce a shot-by-shot cinematic storyboard of the entire video, from the first frame to the last.
Treat every cut or significant change in framing as a new shot, with one row per shot. Do not merge shots, and do not skip any part of the video.

Output a single markdown table with exactly these five columns:
| Timestamp | Shot Type | Visual Description | VFX | Audio / Sound FX |

Column requirements:

1. Timestamp
   - Give the start and end time of the shot in MM:SS–MM:SS format (use HH:MM:SS if the video is longer than an hour).
   - Consecutive shots must connect without gaps or overlaps.

2. Shot Type
   - Name the framing using standard terms, such as Extreme Wide Shot, Wide Shot, Full Shot, Medium Wide Shot, Medium Shot, Medium Close-Up, Close-Up, Extreme Close-Up, Over-the-Shoulder, POV, Two-Shot, or Insert.
   - Add the camera angle when it is notable, such as Low Angle, High Angle, Eye Level, Dutch Angle, or Bird's-Eye View.

3. Visual Description

   Write a highly detailed description, organized with these bold labels in this order and separated by `<br>`:
   - **Environment:** the setting, set dressing, time of day, weather, and atmosphere.
   - **Lighting:** describe the lighting in cinematic terms, including key, fill, and rim or back light, hard or soft quality, direction, contrast ratio (high-key or low-key), color temperature and palette, practical or motivated sources, and the mood it creates.
   - **Subjects & Action:** who or what is in frame, their positions, facial expressions, body language, and the specific actions taking place.
   - **Camera Movement:** state the movement you see, using one of these terms: Static, Pan, Tilt, Dolly In/Out, Tracking/Trucking, Zoom In/Out, Crane/Jib Up/Down, Pedestal, Handheld, Steadicam/Gimbal, Arc, or Whip Pan. If the movement is unclear, or the shot is static but the moment would benefit from motion, add a recommended cinematic movement that suits the scene's mood and story, and label it "(Recommended)" so it stays separate from what is actually on screen.

4. VFX

   Organize this cell with these bold labels in this order, separated by `<br>`:
   - **Observed:** any visual effects actually present in the shot, such as CGI elements or creatures, compositing or green/blue screen replacement, set extensions or matte paintings, digital environments, particle effects (fire, smoke, sparks, rain, snow, dust, debris), explosions, energy or magic effects, screen or hologram inserts, crowd multiplication, de-aging or digital makeup, wire or rig removal, slow motion or speed ramps, time-lapse, freeze frames, motion blur, lens flares, light leaks, film grain, chromatic aberration, glitch effects, stylized color grades or LUTs, split screens, and on-screen text, titles, or motion graphics. Describe what each effect does and how it interacts with the lighting and action. If there are none, write "None".
   - **Transition:** how the shot ends and hands off to the next one, such as Hard Cut, Match Cut, J-Cut, L-Cut, Dissolve, Fade In/Out, Wipe, Whip-Pan Transition, Morph, or Smash Cut.
   - **Recommended:** where a VFX element would strengthen the scene's mood, realism, or storytelling, suggest a specific effect and briefly say why. Keep it consistent with the lighting, color palette, and tone of the shot. If nothing would help, write "None".

   Never present a recommended effect as something that is on screen.

5. Audio / Sound FX
   - Put dialogue in quotation marks and name the speaker, for example: Man: "We need to leave."
   - Note music (genre, tempo, mood, and whether it is diegetic or non-diegetic), ambient sound, and distinct sound effects, including sounds tied to VFX moments such as impacts, whooshes, or energy hums.
   - If there is no audio, write "[No audio]". If something is unclear, write "[Inaudible]". Do not invent dialogue or sounds.

Formatting rules:

- Output only the markdown table, with no introduction or closing summary.
- Do not use the pipe character (|) inside a cell. Use `<br>` for line breaks within a cell.
- Keep the same terminology and label order in every row.
