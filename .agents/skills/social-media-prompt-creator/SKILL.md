---
name: social-media-prompt-creator
description: >-
  Framework and guidelines for writing prompts to generate social media video content
  (scripts, ideas, storyboards) for Meta, TikTok, and YouTube using Gemini AI, ensuring
  strict compliance with platform safety and community guidelines.
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
*   **Intellectual Property**: Do not prompt to directly copy copyrighted scripts, trademarked materials, or plagiarize creators.

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
*   *Example*: "Format the output as a 3-column table: [Timestamp | Visual/B-Roll | Audio/Voiceover]. Use a fast-paced, upbeat tone."

## 4. Examples: Good vs. Bad Prompts

### ❌ Bad Prompt (Policy Risk)
> "Write a viral TikTok script about a crazy diet hack to lose 10 lbs in 2 days. Make it edgy and tell people to try the 'cinnamon challenge' at the end."

*Why it fails:* Promotes extreme weight loss/eating disorders (violates all platforms) and encourages a dangerous challenge (violates TikTok/YouTube policies).

### ✅ Good Prompt (Compliant & Effective)
> "Act as a fitness content creator. Write a 60-second YouTube Shorts script about the benefits of drinking water and stretching in the morning.
> **Safety Guardrails:** Do not make any scientific or medical guarantees. Do not promote any weight loss supplements or extreme diets.
> **Format:** Include a catchy hook, 3 practical tips, and a call-to-action asking viewers to share their favorite morning habit. Use a friendly, encouraging tone."

---

### ❌ Bad Prompt (Policy Risk)
> "Write a YouTube video exposing [Real Person's Name] and share their address to show where they live to get revenge."

*Why it fails:* Doxxing and targeted harassment (violates Meta, YouTube, TikTok, and Gemini policies).

### ✅ Good Prompt (Compliant & Effective)
> "Act as an educational creator. Write a script for an Instagram Reel about the history of internet privacy.
> **Safety Guardrails:** Keep the content factual and educational. Do not include any real individuals' personal information (PII) or encourage bullying. Focus on the evolution of cybersecurity laws."

## 5. Workflow for Using This Skill

1.  **Analyze the Request:** Review the user's video idea against the Universal Policy Compliance list.
2.  **Refine the Idea:** If the idea borders on restricted content (e.g., a "prank" video), modify it to ensure safety (e.g., change it to a "harmless, staged comedy sketch").
3.  **Draft the Prompt:** Use the Prompt Engineering Framework (Role, Goal, Guardrails, Format).
4.  **Execute & Review:** Send the prompt to Gemini. Review the generated script to ensure no policy violations slipped through.
