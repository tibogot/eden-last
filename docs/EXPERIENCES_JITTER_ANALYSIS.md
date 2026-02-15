# Experiences Page Jitter – Analysis & Fixes

## What you observed

- With **StickyStackScroll5** in the tree, the experiences page jitters “from the beginning” as soon as you navigate to it.
- On mobile, StickyStackScroll5 is “just simple cards in a row” (no pins, no ScrollTrigger).
- With StickyStackScroll5 **commented out**, jitter disappears.

So the issue isn’t the card layout itself; it’s something that **mounting** StickyStackScroll5 does to the rest of the page (layout, scroll, or animation setup).

---

## Root causes (why it happens)

### 1. **Extra AnimatedText in StickyStackScroll5’s intro (main suspect)**

StickyStackScroll5 always renders an **intro section** with another **AnimatedText**:

```tsx
<section className="... intro ...">
  <AnimatedText delay={0.0} stagger={0.3}>
    <h2>From guided experiences to immersive moments</h2>
    ...
  </AnimatedText>
</section>
```

So with StickyStackScroll5 on the page you have **two** AnimatedText blocks:

- “Visit us” (experiences page)
- “From guided experiences…” (StickyStackScroll5 intro)

AnimatedText does heavy work on mount:

- `fouc-prevent` (visibility hidden) until fonts are ready.
- When `fontsReady` is true it runs **SplitText** (wraps lines in new elements).
- SplitText + `fixMask` change DOM and layout → **reflows**.

If both blocks run SplitText around the same time (both depend on `document.fonts.ready`), you get **two layout-heavy operations** in quick succession. That can easily show up as jitter, especially when the second one (intro) is in or near the initial viewport.

So: **even on mobile**, the mere presence of StickyStackScroll5 adds a second AnimatedText; the jitter can come from that extra SplitText + reflow, not from the “simple cards” layout.

---

### 2. **Global ScrollTrigger.refresh() and longer page**

- **LenisProvider** runs `ScrollTrigger.refresh()` ~100ms after **pageTransitionComplete** (so right after you land on experiences).
- **ScrollTrigger.refresh()** is **global**: it recalculates **all** ScrollTrigger instances and scroll dimensions for the **whole document**.

When StickyStackScroll5 is present:

- The document is **longer** (intro + mobile or desktop cards).
- Refresh does more work and can trigger extra layout/read-write cycles.
- If any component (e.g. HeroParallax, or another scroll-driven effect) reacts to that refresh or to the new scroll height, you can get a visible “snap” or jitter on load.

So the jitter can start “from the beginning” because it’s tied to **transition complete → refresh**, not to user scrolling.

---

### 3. **Duplicate scroll-driven updates (desktop)**

- **LenisProvider** already does:  
  `lenis.on("scroll", ScrollTrigger.update)`  
  so every Lenis scroll event updates ScrollTrigger once.

- **StickyStackScroll5** (when it runs its useGSAP, i.e. desktop) adds **another** listener that does:  
  `requestAnimationFrame(() => ScrollTrigger.update())`  
  and calls `scheduleRefresh(100)` → **ScrollTrigger.refresh()**.

So on desktop you get:

- Two sources of **ScrollTrigger.update** per scroll (risk of double update in one frame).
- An **extra refresh** when StickyStackScroll5 mounts.

That can contribute to jitter on desktop; on mobile, StickyStackScroll5’s useGSAP returns early so it doesn’t add this listener or refresh, which matches “on mobile it’s just simple cards” and the fact that the problem is still visible on load (where the intro AnimatedText and global refresh matter more).

---

### 4. **StickyStackScroll5’s domReady and re-render**

- On mobile, the image-load check is skipped and **domReady** is set to `true` quickly (often in the first effect run).
- That causes an extra **state update** and re-render as soon as StickyStackScroll5 mounts.

By itself one re-render is unlikely to cause obvious jitter, but it can **combine** with (1) and (2): the re-render happens at the same time as fonts/SplitText and/or right around when LenisProvider runs `ScrollTrigger.refresh()`, making the initial frame less stable.

---

## Why commenting StickyStackScroll5 fixes it

When you comment out `<StickyStackScroll5 />` you remove:

1. The **second AnimatedText** (intro) and its SplitText/reflow.
2. The **extra block of content** (intro + cards), so a **shorter document** and a lighter **ScrollTrigger.refresh()**.
3. On desktop, the **extra lenis scroll listener** and the **refresh()** from StickyStackScroll5.

So the jitter goes away because you’ve removed the main layout churn (intro AnimatedText) and reduced the impact of the global refresh and duplicate updates.

---

## Recommended fixes

### Fix 1: Don’t use AnimatedText in StickyStackScroll5’s intro (quick win)

Use plain text in the intro so you don’t add a second SplitText block on the same page:

- Replace the intro’s `<AnimatedText>` with a normal `<div>` (or keep the same markup but without the AnimatedText wrapper).
- You lose the line-reveal animation in that block but remove the main source of extra reflows and jitter.

### Fix 2: Avoid duplicate ScrollTrigger.update and unnecessary refresh (desktop)

- In **StickyStackScroll5**, **remove** the custom `lenis.on("scroll", handleScroll)` that calls `ScrollTrigger.update()`.  
  LenisProvider already does `lenis.on("scroll", ScrollTrigger.update)`, so a second update path is redundant and can cause double updates.
- Only call **ScrollTrigger.refresh()** when you really need to (e.g. after your own pins are created), and consider debouncing or running it once after a short delay instead of on every setup path. That way you don’t amplify the global refresh that already runs from LenisProvider after the transition.

### Fix 3: Defer or gate StickyStackScroll5’s “heavy” work

- Delay mounting the **intro + cards** until after the first paint or after `pageTransitionComplete` (e.g. with a small timeout or a “transition complete” listener), so the initial layout and LenisProvider’s refresh happen with the shorter tree first.
- Or render the intro as plain text first and only wrap it in AnimatedText after a short delay (e.g. after `fontsReady` and one requestAnimationFrame), so the two AnimatedText blocks don’t run SplitText in the same frame.

### Fix 4: LenisProvider refresh timing

- You can **delay** the post-transition `ScrollTrigger.refresh()` a bit more (e.g. 150–200ms) so it runs after the heaviest initial layout (fonts, SplitText) has settled.  
- Optionally, only call **refresh** once after transition, and avoid calling it again from StickyStackScroll5 unless the layout actually changes (e.g. images loaded in that section).

---

## Summary

- The jitter is **not** from the mobile “simple cards” layout itself.
- It comes from: **(1)** the **extra AnimatedText** in StickyStackScroll5’s intro (SplitText + reflows), **(2)** **global ScrollTrigger.refresh()** on a longer page right after navigation, and **(3)** on desktop, **duplicate ScrollTrigger update** and an extra **refresh** from StickyStackScroll5.
- Easiest and most effective fix: **remove or replace AnimatedText in StickyStackScroll5’s intro** (e.g. plain text). Then, if needed, remove the duplicate scroll listener and limit refresh in StickyStackScroll5 so the rest of the page isn’t destabilized when the component mounts.
