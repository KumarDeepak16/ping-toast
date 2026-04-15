export const STYLES = `
:root {
  --pt-bg: #ffffff;
  --pt-fg: #222222;
  --pt-fg-secondary: #6a6a6a;
  --pt-border: rgba(0,0,0,0.06);
  --pt-shadow: rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px;
  --pt-success: #22c55e;
  --pt-success-bg: rgba(34,197,94,0.08);
  --pt-error: #ef4444;
  --pt-error-bg: rgba(239,68,68,0.08);
  --pt-warning: #f59e0b;
  --pt-warning-bg: rgba(245,158,11,0.08);
  --pt-info: #3b82f6;
  --pt-info-bg: rgba(59,130,246,0.08);
  --pt-loading: #6366f1;
  --pt-loading-bg: rgba(99,102,241,0.08);
  --pt-radius: 14px;
  --pt-font: -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif;
  --pt-z: 99999;
}
@media(prefers-color-scheme:dark){
  :root {
    --pt-bg: #1c1c1e;
    --pt-fg: #f5f5f7;
    --pt-fg-secondary: #a1a1a6;
    --pt-border: rgba(255,255,255,0.1);
    --pt-shadow: 0 0 0 1px rgba(255,255,255,0.05), 0 8px 30px rgba(0,0,0,0.5);
    --pt-success-bg: rgba(34,197,94,0.15);
    --pt-error-bg: rgba(239,68,68,0.15);
    --pt-warning-bg: rgba(245,158,11,0.15);
    --pt-info-bg: rgba(59,130,246,0.15);
    --pt-loading-bg: rgba(99,102,241,0.15);
  }
}
[data-pt-theme="dark"]{
  --pt-bg: #1c1c1e;
  --pt-fg: #f5f5f7;
  --pt-fg-secondary: #a1a1a6;
  --pt-border: rgba(255,255,255,0.1);
  --pt-shadow: 0 0 0 1px rgba(255,255,255,0.05), 0 8px 30px rgba(0,0,0,0.5);
  --pt-success-bg: rgba(34,197,94,0.15);
  --pt-error-bg: rgba(239,68,68,0.15);
  --pt-warning-bg: rgba(245,158,11,0.15);
  --pt-info-bg: rgba(59,130,246,0.15);
  --pt-loading-bg: rgba(99,102,241,0.15);
}
[data-pt-theme="light"]{
  --pt-bg: #ffffff;
  --pt-fg: #222222;
  --pt-fg-secondary: #6a6a6a;
  --pt-border: rgba(0,0,0,0.06);
  --pt-shadow: rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px;
  --pt-success-bg: rgba(34,197,94,0.08);
  --pt-error-bg: rgba(239,68,68,0.08);
  --pt-warning-bg: rgba(245,158,11,0.08);
  --pt-info-bg: rgba(59,130,246,0.08);
  --pt-loading-bg: rgba(99,102,241,0.08);
}

/* Container */
.pt-container{
  position:fixed;
  z-index:var(--pt-z);
  pointer-events:none;
  display:flex;
  flex-direction:column;
  gap:10px;
  padding:16px;
  max-width:420px;
  width:100%;
  box-sizing:border-box;
}
.pt-container[data-pos^="top"]{top:0}
.pt-container[data-pos^="bottom"]{bottom:0;flex-direction:column-reverse}
.pt-container[data-pos$="left"]{left:0;align-items:flex-start}
.pt-container[data-pos$="right"]{right:0;align-items:flex-end}
.pt-container[data-pos$="center"]{left:50%;transform:translateX(-50%);align-items:center}

/* Toast */
.pt-toast{
  pointer-events:all;
  display:flex;
  align-items:flex-start;
  gap:12px;
  padding:14px 18px;
  background:var(--pt-bg);
  color:var(--pt-fg);
  border-radius:var(--pt-radius);
  border:1px solid var(--pt-border);
  box-shadow:var(--pt-shadow);
  font-family:var(--pt-font);
  font-size:14px;
  font-weight:500;
  line-height:1.5;
  min-width:300px;
  max-width:400px;
  position:relative;
  overflow:hidden;
  cursor:default;
  will-change:transform,opacity;
  transition:
    transform .4s cubic-bezier(.22,1,.36,1),
    opacity .3s cubic-bezier(.22,1,.36,1),
    box-shadow .2s ease;
}
.pt-toast:hover{
  box-shadow:0 4px 16px rgba(0,0,0,0.12);
  transform:translateY(-1px) !important;
}
[data-pt-theme="dark"] .pt-toast:hover{
  box-shadow:0 4px 20px rgba(0,0,0,0.4);
}

/* Type accent — no border, handled by gradient wash */

/* Gradient wash */
.pt-toast::before{
  content:'';
  position:absolute;
  top:0;right:0;bottom:0;
  width:40%;
  pointer-events:none;
  opacity:0.5;
  background:linear-gradient(90deg,transparent,var(--pt-type-bg,transparent));
}
.pt-toast[data-type="success"]{ --pt-type-bg:var(--pt-success-bg); }
.pt-toast[data-type="error"]{ --pt-type-bg:var(--pt-error-bg); }
.pt-toast[data-type="warning"]{ --pt-type-bg:var(--pt-warning-bg); }
.pt-toast[data-type="info"]{ --pt-type-bg:var(--pt-info-bg); }
.pt-toast[data-type="loading"]{ --pt-type-bg:var(--pt-loading-bg); }

/* Enter/exit animations */
.pt-toast--entering{opacity:0}
.pt-container[data-pos$="right"] .pt-toast--entering{transform:translateX(110%)}
.pt-container[data-pos$="left"] .pt-toast--entering{transform:translateX(-110%)}
.pt-container[data-pos$="center"] .pt-toast--entering{transform:translateY(-20px) scale(.95)}
.pt-container[data-pos^="bottom"] .pt-toast--entering{transform:translateY(20px) scale(.95)}
.pt-toast--visible{opacity:1;transform:translateX(0) translateY(0) scale(1)}
.pt-toast--exiting{
  opacity:0 !important;
  transform:scale(.95) translateY(-8px) !important;
  transition:
    all .35s cubic-bezier(.4,0,.2,1) !important;
  pointer-events:none;
  max-height:0 !important;
  padding-top:0 !important;
  padding-bottom:0 !important;
  margin-top:0 !important;
  margin-bottom:0 !important;
  border-width:0 !important;
  overflow:hidden !important;
}

/* Icon */
.pt-icon{
  flex-shrink:0;
  width:22px;
  height:22px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-top:1px;
}
.pt-icon svg{width:20px;height:20px;display:block}

/* Animated icon keyframes */
@keyframes pt-check-draw{
  from{stroke-dashoffset:20}
  to{stroke-dashoffset:0}
}
@keyframes pt-circle-draw{
  from{stroke-dashoffset:54}
  to{stroke-dashoffset:0}
}
@keyframes pt-x-draw{
  from{stroke-dashoffset:16}
  to{stroke-dashoffset:0}
}
@keyframes pt-pop{
  0%{transform:scale(0);opacity:0}
  60%{transform:scale(1.15)}
  100%{transform:scale(1);opacity:1}
}
.pt-icon--animated{animation:pt-pop .4s cubic-bezier(.22,1,.36,1) forwards}
.pt-icon--animated .pt-check{stroke-dasharray:20;stroke-dashoffset:20;animation:pt-check-draw .4s .15s cubic-bezier(.22,1,.36,1) forwards}
.pt-icon--animated .pt-circle{stroke-dasharray:54;stroke-dashoffset:54;animation:pt-circle-draw .4s cubic-bezier(.22,1,.36,1) forwards}
.pt-icon--animated .pt-x-line{stroke-dasharray:16;stroke-dashoffset:16;animation:pt-x-draw .3s .15s cubic-bezier(.22,1,.36,1) forwards}

/* Body */
.pt-body{flex:1;min-width:0;position:relative;z-index:1}
.pt-message{word-break:break-word;color:var(--pt-fg)}
.pt-title{font-weight:600;margin-bottom:1px;font-size:14px;color:var(--pt-fg)}
.pt-desc{font-size:13px;color:var(--pt-fg-secondary);font-weight:400;margin-top:2px}

/* Action button */
.pt-action{
  position:relative;z-index:1;
  flex-shrink:0;
  padding:6px 14px;
  border-radius:8px;
  border:1px solid var(--pt-border);
  background:transparent;
  color:var(--pt-fg);
  font-family:var(--pt-font);
  font-size:13px;
  font-weight:500;
  cursor:pointer;
  transition:background .15s,border-color .15s;
  align-self:center;
}
.pt-action:hover{background:rgba(0,0,0,0.04);border-color:rgba(0,0,0,0.12)}
[data-pt-theme="dark"] .pt-action:hover{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.12)}

/* Close */
.pt-close{
  position:relative;z-index:2;
  flex-shrink:0;
  background:none;
  border:none;
  cursor:pointer;
  color:var(--pt-fg);
  opacity:.5;
  padding:5px;
  border-radius:6px;
  display:flex;
  align-items:center;
  justify-content:center;
  transition:opacity .15s,background .15s;
  margin-top:0px;
  width:24px;
  height:24px;
}
.pt-close:hover{opacity:1;background:rgba(0,0,0,0.06)}
[data-pt-theme="dark"] .pt-close:hover{background:rgba(255,255,255,0.08)}

/* Progress */
.pt-progress{
  position:absolute;
  bottom:0;left:0;right:0;
  height:2px;
  background:currentColor;
  opacity:.15;
  transform-origin:left;
  animation:pt-progress linear forwards;
}
@keyframes pt-progress{from{transform:scaleX(1)}to{transform:scaleX(0)}}

/* Spinner */
.pt-spinner{
  width:18px;height:18px;
  border:2.5px solid currentColor;
  border-top-color:transparent;
  border-radius:50%;
  animation:pt-spin .8s cubic-bezier(.5,0,.5,1) infinite;
  opacity:.7;
}
@keyframes pt-spin{to{transform:rotate(360deg)}}

/* Swipe */
.pt-toast--swiping{transition:none !important;cursor:grab}
`;
