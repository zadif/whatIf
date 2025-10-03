// src/components/SharePromptButton.jsx
import React, { useCallback, useState } from "react";

/**
 * SharePromptButton
 *
 * Props:
 * - prompt (string)    : required prompt text to render into the image
 * - postUrl (string)   : url to include/copy (defaults to window.location.href)
 * - width (number)     : canvas width (default 1200)
 * - height (number)    : canvas height (default 630)
 * - fontFamily (string): font-family name to use on canvas (default 'Kaushan Script')
 * - className (string) : optional button className
 * - children (node)    : optional button children (defaults to "Share")
 * - onResult (fn)      : optional callback receiving the result object
 * - onClick (fn)       : optional callback called immediately when button is clicked
 * - panel (bool)       : optional subtle panel behind text (default true)
 */
export default function SharePromptButton({
  prompt,
  postUrl,
  width = 1200,
  height = 630,
  fontFamily = "Fjalla One",
  className,
  children = "Share",
  onResult,
  onClick,
  panel = true,
}) {
  const [busy, setBusy] = useState(false);

  // helper: wrap text to fit width - IMPROVED for better line breaks
  const wrapTextLines = useCallback((ctx, text, maxWidth) => {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";

    // Use 80% of maxWidth to encourage more line breaks
    const targetWidth = maxWidth * 0.8;

    for (let i = 0; i < words.length; i++) {
      const test = line ? line + " " + words[i] : words[i];
      const testWidth = ctx.measureText(test).width;

      if (testWidth > targetWidth && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }, []);

  // create canvas with centered prompt; does NOT draw footer filename
  const canvasFromPromptCentered = useCallback(
    (promptText, opts = {}) => {
      const w = opts.width || width;
      const h = opts.height || height;
      const padding = opts.padding || Math.round(Math.min(w, h) * 0.08);
      const maxTextWidth = w - padding * 2;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      // Solid elegant background
      ctx.fillStyle = opts.bgColor || "#0f172a";
      ctx.fillRect(0, 0, w, h);

      // Enhanced translucent panel with border
      if (opts.panel) {
        const panelPadding = padding * 0.8;
        const panelX = panelPadding;
        const panelY = panelPadding;
        const panelW = w - panelPadding * 2;
        const panelH = h - panelPadding * 2;
        const borderRadius = 20;

        // Panel shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;

        // Draw rounded rectangle panel
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.moveTo(panelX + borderRadius, panelY);
        ctx.lineTo(panelX + panelW - borderRadius, panelY);
        ctx.quadraticCurveTo(
          panelX + panelW,
          panelY,
          panelX + panelW,
          panelY + borderRadius
        );
        ctx.lineTo(panelX + panelW, panelY + panelH - borderRadius);
        ctx.quadraticCurveTo(
          panelX + panelW,
          panelY + panelH,
          panelX + panelW - borderRadius,
          panelY + panelH
        );
        ctx.lineTo(panelX + borderRadius, panelY + panelH);
        ctx.quadraticCurveTo(
          panelX,
          panelY + panelH,
          panelX,
          panelY + panelH - borderRadius
        );
        ctx.lineTo(panelX, panelY + borderRadius);
        ctx.quadraticCurveTo(panelX, panelY, panelX + borderRadius, panelY);
        ctx.closePath();
        ctx.fill();

        // Panel border
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      // auto-scale font so prompt fits - FURTHER INCREASED SIZE
      const fontWeight = 400; // Regular weight for better readability
      let fontSize = opts.fontSize || Math.round(Math.min(w, h) * 0.12); // Increased to 0.12 (from 0.10)
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      let lines = [];
      while (fontSize > 32) {
        // Increased minimum to 32
        ctx.font = `${fontWeight} ${fontSize}px "Fjalla One", sans-serif`;
        lines = wrapTextLines(ctx, promptText, maxTextWidth);
        const lineHeight = fontSize * 1.5; // Increased line spacing
        const totalTextHeight = lines.length * lineHeight;
        // More available space since no logo
        const availableHeight = h - padding * 2;
        if (totalTextHeight <= availableHeight && lines.length <= 12) break; // Allow more lines
        fontSize -= 2;
      }

      // clamp lines if still too many
      const maxLines = 12; // Increased from 8
      if (lines.length > maxLines) {
        const clipped = lines.slice(0, maxLines);
        let last = clipped[clipped.length - 1];
        while (ctx.measureText(last + "…").width > maxTextWidth) {
          last = last.replace(/\W*\w$/, "");
        }
        clipped[clipped.length - 1] = last + "…";
        lines = clipped;
      }

      // draw centered text with subtle shadow
      const lineHeight = fontSize * 1.5; // Match increased line spacing
      const totalTextHeight = lines.length * lineHeight;
      const startY = Math.round((h - totalTextHeight) / 2);
      const centerX = Math.round(w / 2);

      // Text shadow for depth
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;

      ctx.fillStyle = opts.textColor || "#ffffff";
      ctx.font = `${fontWeight} ${fontSize}px "Fjalla One", sans-serif`;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], centerX, startY + i * lineHeight);
      }

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Add subtle footer text in BOTTOM RIGHT (lowered position)
      const footerSize = Math.round(h * 0.03);
      ctx.font = `400 ${footerSize}px "Fjalla One", sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.textAlign = "right"; // Right aligned
      ctx.textBaseline = "bottom";
      ctx.fillText("whatif.qzz.io", w - padding * 1.5, h - padding * 1.2); // Lowered from 1.8 to 1.2

      return canvas;
    },
    [fontFamily, height, width, wrapTextLines]
  );

  // canvas -> Blob
  const canvasToBlob = useCallback(
    (canvas, type = "image/png", quality = 0.95) =>
      new Promise((resolve) =>
        canvas.toBlob((blob) => resolve(blob), type, quality)
      ),
    []
  );

  // main click handler
  const handleClick = useCallback(
    async (e) => {
      // Call onClick callback immediately BEFORE any async work
      if (onClick) {
        onClick();
        // Give the UI a moment to update (show toast) before starting heavy work
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      try {
        if (!prompt) {
          onResult && onResult({ success: false, reason: "no-prompt" });
          return;
        }

        // user gesture begins
        setBusy(true);
        const url =
          postUrl ||
          (typeof window !== "undefined" ? window.location.href : "");

        // ensure clipboard API present
        const hasClipboard = !!navigator.clipboard;
        const hasClipboardItem = typeof window.ClipboardItem === "function";

        // try to load the font first so measurements are accurate
        try {
          if (
            typeof document !== "undefined" &&
            document.fonts &&
            document.fonts.load
          ) {
            // request a weight/size to ensure glyphs are loaded; size here is arbitrary but helps
            await document.fonts.load(
              `400 ${Math.max(
                24,
                Math.round(Math.min(width, height) * 0.06)
              )}px "${fontFamily}"`
            );
            // wait for other fonts if needed
            await document.fonts.ready;
          }
        } catch (err) {
          // ignore — we'll still try to draw (may use fallback font briefly)
          console.warn("Font load issue, using fallback:", err);
        }

        // If clipboard isn't available, fallback to copy URL text if possible
        if (!hasClipboard) {
          try {
            await navigator.clipboard.writeText(url);
            onResult && onResult({ success: true, fallback: "text-only" });
          } catch (err) {
            onResult &&
              onResult({
                success: false,
                reason: "no-clipboard-and-copy-failed",
                error: err,
              });
          } finally {
            setBusy(false);
          }
          return;
        }

        // draw canvas and create blobs
        let canvas, imageBlob, dataUrl;
        try {
          canvas = canvasFromPromptCentered(prompt, {
            width,
            height,
            panel,
            fontFamily,
          });
          imageBlob = await canvasToBlob(canvas, "image/png", 0.95);
          if (!imageBlob) throw new Error("canvas.toBlob returned null");
          dataUrl = canvas.toDataURL("image/png");
        } catch (err) {
          // If canvas generation fails, try copying URL only
          console.warn(
            "Canvas generation failed, falling back to URL copy:",
            err
          );
          try {
            await navigator.clipboard.writeText(url);
            onResult &&
              onResult({
                success: true,
                fallback: "text-only",
                reason: "canvas-failed",
                error: err,
              });
          } catch (err2) {
            onResult &&
              onResult({
                success: false,
                reason: "canvas-failed-and-copy-failed",
                error: err2 || err,
              });
          } finally {
            setBusy(false);
          }
          return;
        }

        // create html and text blobs
        const html = `<img src="${dataUrl}" alt="prompt image" /><br/><a href="${url}">${url}</a>`;
        const htmlBlob = new Blob([html], { type: "text/html" });
        const textBlob = new Blob([url], { type: "text/plain" });

        if (!hasClipboardItem) {
          // browser can't create ClipboardItem; fallback to text-only
          try {
            await navigator.clipboard.writeText(url);
            onResult && onResult({ success: true, fallback: "text-only" });
          } catch (err) {
            onResult && onResult({ success: false, reason: err });
          } finally {
            setBusy(false);
          }
          return;
        }

        // create a single ClipboardItem with multiple MIME types (image + html + plain)
        try {
          const item = new ClipboardItem({
            "image/png": imageBlob,
            "text/html": htmlBlob,
            "text/plain": textBlob,
          });

          await navigator.clipboard.write([item]);
          onResult && onResult({ success: true, method: "image+html+text" });
          setBusy(false);
          return;
        } catch (err) {
          // try image-only then text fallback
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": imageBlob }),
            ]);
            // copy url as text as well (some apps prefer text)
            await navigator.clipboard.writeText(url).catch(() => {});
            onResult &&
              onResult({ success: true, method: "image-only + text" });
            setBusy(false);
            return;
          } catch (err2) {
            // final fallback: text only
            try {
              await navigator.clipboard.writeText(url);
              onResult &&
                onResult({
                  success: true,
                  fallback: "text-only",
                  reason: err2 || err,
                });
            } catch (err3) {
              onResult &&
                onResult({ success: false, reason: err3 || err2 || err });
            } finally {
              setBusy(false);
              return;
            }
          }
        }
      } catch (globalErr) {
        // Final safety net - if anything unexpected crashes, copy URL only
        console.error("Unexpected error in share handler:", globalErr);
        setBusy(false);
        try {
          await navigator.clipboard.writeText(
            postUrl ||
              (typeof window !== "undefined" ? window.location.href : "")
          );
          onResult &&
            onResult({
              success: true,
              fallback: "text-only",
              reason: "unexpected-error",
              error: globalErr,
            });
        } catch (finalErr) {
          onResult &&
            onResult({
              success: false,
              reason: "all-methods-failed",
              error: finalErr,
            });
        }
      }
    },
    [
      prompt,
      postUrl,
      width,
      height,
      fontFamily,
      canvasFromPromptCentered,
      canvasToBlob,
      onResult,
      onClick,
      panel,
    ]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={className}
      aria-label="Share prompt as image and link"
    >
      {children}
    </button>
  );
}
