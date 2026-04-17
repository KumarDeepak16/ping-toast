// Internal CSS. Variable names and class names inside this string are NOT
// public API — they are shortened aggressively at build time for bundle size.
// Users style toasts via <PingToaster> props (background, foreground, radius,
// font) or with className / style options on individual toasts.
export const STYLES = `
:root,[data-pt-theme="light"]{
  --pb:#fff;--pf:#222;--ps:#6a6a6a;--pbd:rgba(0,0,0,.06);
  --psh:rgba(0,0,0,.02) 0 0 0 1px,rgba(0,0,0,.04) 0 2px 6px,rgba(0,0,0,.1) 0 4px 8px;
  --pSb:rgba(34,197,94,.08);--pEb:rgba(239,68,68,.08);
  --pWb:rgba(245,158,11,.08);--pIb:rgba(59,130,246,.08);--pLb:rgba(99,102,241,.08);
  --pr:14px;--pfm:-apple-system,system-ui,'Segoe UI',Roboto,sans-serif;--pz:99999;
  --pe:cubic-bezier(.22,1,.36,1);--pes:cubic-bezier(.34,1.56,.64,1);--peb:cubic-bezier(.34,1.8,.54,1);
  --pdi:.42s;--pdo:.32s
}
[data-pt-theme="dark"]{
  --pb:#1c1c1e;--pf:#f5f5f7;--ps:#a1a1a6;--pbd:rgba(255,255,255,.1);
  --psh:0 0 0 1px rgba(255,255,255,.05),0 8px 30px rgba(0,0,0,.5);
  --pSb:rgba(34,197,94,.15);--pEb:rgba(239,68,68,.15);
  --pWb:rgba(245,158,11,.15);--pIb:rgba(59,130,246,.15);--pLb:rgba(99,102,241,.15)
}
.pt-c{position:fixed;z-index:var(--pz);pointer-events:none;display:flex;flex-direction:column;gap:10px;padding:16px;max-width:420px;width:100%;box-sizing:border-box;top:auto;bottom:auto;left:auto;right:auto;transform:none;align-items:stretch}
.pt-c[data-pos^="top"]{top:0;flex-direction:column}
.pt-c[data-pos^="bottom"]{bottom:0;flex-direction:column-reverse}
.pt-c[data-pos$="left"]{left:0;align-items:flex-start}
.pt-c[data-pos$="right"]{right:0;align-items:flex-end}
.pt-c[data-pos$="center"]{left:50%;transform:translateX(-50%);align-items:center}
.pt-t{pointer-events:all;display:flex;align-items:flex-start;gap:12px;padding:14px 18px;background:var(--pb);color:var(--pf);border-radius:var(--pr);border:1px solid var(--pbd);box-shadow:var(--psh);font-family:var(--pfm);font-size:14px;font-weight:500;line-height:1.5;min-width:300px;max-width:400px;position:relative;overflow:hidden;cursor:default;will-change:transform,opacity;transform-origin:center;transition:transform var(--pdi) var(--pe),opacity var(--pdi) var(--pe),box-shadow .2s}
.pt-t:hover{box-shadow:0 6px 20px rgba(0,0,0,.12);transform:translateY(-1px)!important}
[data-pt-theme="dark"] .pt-t:hover{box-shadow:0 4px 24px rgba(0,0,0,.45)}
.pt-t::before{content:'';position:absolute;top:0;right:0;bottom:0;width:40%;pointer-events:none;opacity:.5;background:linear-gradient(90deg,transparent,var(--ptb,transparent))}
.pt-t[data-type="success"]{--ptb:var(--pSb)}
.pt-t[data-type="error"]{--ptb:var(--pEb)}
.pt-t[data-type="warning"]{--ptb:var(--pWb)}
.pt-t[data-type="info"]{--ptb:var(--pIb)}
.pt-t[data-type="loading"]{--ptb:var(--pLb)}
.pt-v{opacity:1;transform:translate3d(0,0,0) scale(1) rotateX(0)}
@keyframes pt-p{0%,100%{transform:scale(1);box-shadow:var(--psh)}40%{transform:scale(1.03);box-shadow:0 6px 24px rgba(0,0,0,.16)}}
.pt-pl{animation:pt-p .5s var(--pe)}
.pt-x{pointer-events:none;opacity:0!important;transition:transform var(--pdo) var(--pe),opacity calc(var(--pdo) - .05s) var(--pe),max-height var(--pdo) var(--pe) .05s,padding var(--pdo) var(--pe) .05s,margin var(--pdo) var(--pe) .05s,border-width var(--pdo) var(--pe) .05s!important;max-height:0!important;padding-top:0!important;padding-bottom:0!important;margin-top:0!important;margin-bottom:0!important;border-width:0!important;overflow:hidden!important}
.pt-c[data-anim="slide"] .pt-e,.pt-c:not([data-anim]) .pt-e{opacity:0}
.pt-c[data-anim="slide"][data-pos$="right"] .pt-e,.pt-c:not([data-anim])[data-pos$="right"] .pt-e,.pt-c[data-anim="slide"][data-pos$="right"] .pt-x{transform:translate3d(120%,0,0) scale(.96)}
.pt-c[data-anim="slide"][data-pos$="left"] .pt-e,.pt-c:not([data-anim])[data-pos$="left"] .pt-e,.pt-c[data-anim="slide"][data-pos$="left"] .pt-x{transform:translate3d(-120%,0,0) scale(.96)}
.pt-c[data-anim="slide"][data-pos$="center"][data-pos^="top"] .pt-e,.pt-c:not([data-anim])[data-pos$="center"][data-pos^="top"] .pt-e,.pt-c[data-anim="slide"][data-pos$="center"][data-pos^="top"] .pt-x{transform:translate3d(0,-28px,0) scale(.96)}
.pt-c[data-anim="slide"][data-pos$="center"][data-pos^="bottom"] .pt-e,.pt-c:not([data-anim])[data-pos$="center"][data-pos^="bottom"] .pt-e,.pt-c[data-anim="slide"][data-pos$="center"][data-pos^="bottom"] .pt-x{transform:translate3d(0,28px,0) scale(.96)}
.pt-c[data-anim="slide"][data-pos$="right"] .pt-x,.pt-c[data-anim="slide"][data-pos$="left"] .pt-x,.pt-c[data-anim="slide"][data-pos$="center"][data-pos^="top"] .pt-x,.pt-c[data-anim="slide"][data-pos$="center"][data-pos^="bottom"] .pt-x{opacity:0!important}
.pt-c[data-anim="fade"] .pt-t{transition:transform var(--pdi) var(--pe),opacity var(--pdi) var(--pe),box-shadow .2s}
.pt-c[data-anim="fade"] .pt-e,.pt-c[data-anim="fade"] .pt-x{transform:scale(.97)}
.pt-c[data-anim="scale"] .pt-t{transition:transform var(--pdi) var(--pes),opacity var(--pdi) var(--pe),box-shadow .2s}
.pt-c[data-anim="scale"] .pt-e{transform:scale(.72)}
.pt-c[data-anim="scale"] .pt-x{transform:scale(.82)}
.pt-c[data-anim="bounce"] .pt-t{transition:transform calc(var(--pdi) + .1s) var(--peb),opacity var(--pdi) var(--pe),box-shadow .2s}
.pt-c[data-anim="bounce"][data-pos$="right"] .pt-e,.pt-c[data-anim="bounce"][data-pos$="right"] .pt-x{transform:translate3d(120%,0,0) scale(.85)}
.pt-c[data-anim="bounce"][data-pos$="left"] .pt-e,.pt-c[data-anim="bounce"][data-pos$="left"] .pt-x{transform:translate3d(-120%,0,0) scale(.85)}
.pt-c[data-anim="bounce"][data-pos$="center"][data-pos^="top"] .pt-e,.pt-c[data-anim="bounce"][data-pos$="center"][data-pos^="top"] .pt-x{transform:translate3d(0,-34px,0) scale(.85)}
.pt-c[data-anim="bounce"][data-pos$="center"][data-pos^="bottom"] .pt-e,.pt-c[data-anim="bounce"][data-pos$="center"][data-pos^="bottom"] .pt-x{transform:translate3d(0,34px,0) scale(.85)}
.pt-c[data-anim="flip"]{perspective:1000px}
.pt-c[data-anim="flip"] .pt-t{transform-style:preserve-3d;transition:transform var(--pdi) var(--pe),opacity var(--pdi) var(--pe),box-shadow .2s}
.pt-c[data-anim="flip"][data-pos^="top"] .pt-t{transform-origin:top center}
.pt-c[data-anim="flip"][data-pos^="bottom"] .pt-t{transform-origin:bottom center}
.pt-c[data-anim="flip"][data-pos^="top"] .pt-e,.pt-c[data-anim="flip"][data-pos^="top"] .pt-x{transform:rotateX(-75deg) translate3d(0,-6px,0)}
.pt-c[data-anim="flip"][data-pos^="bottom"] .pt-e,.pt-c[data-anim="flip"][data-pos^="bottom"] .pt-x{transform:rotateX(75deg) translate3d(0,6px,0)}
.pt-c[data-anim="slide"] .pt-e,.pt-c[data-anim="fade"] .pt-e,.pt-c[data-anim="scale"] .pt-e,.pt-c[data-anim="bounce"] .pt-e,.pt-c[data-anim="flip"] .pt-e{opacity:0}
@media(prefers-reduced-motion:reduce){
  .pt-t{transition:opacity .15s linear!important}
  .pt-e{opacity:0!important;transform:none!important}
  .pt-x{transform:none!important;transition:opacity .15s linear,max-height .15s linear,padding .15s linear,margin .15s linear!important}
  .pt-pl{animation:none!important}
}
.pt-ic{flex-shrink:0;width:22px;height:22px;display:flex;align-items:center;justify-content:center;margin-top:1px}
.pt-ic svg{width:20px;height:20px;display:block}
@keyframes pt-cd{to{stroke-dashoffset:0}}
@keyframes pt-pop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}to{transform:scale(1);opacity:1}}
.pt-ia{animation:pt-pop .4s var(--pe) forwards}
.pt-ia .pt-ck{stroke-dasharray:20;stroke-dashoffset:20;animation:pt-cd .4s .15s var(--pe) forwards}
.pt-ia .pt-ci{stroke-dasharray:54;stroke-dashoffset:54;animation:pt-cd .4s var(--pe) forwards}
.pt-ia .pt-xl{stroke-dasharray:16;stroke-dashoffset:16;animation:pt-cd .3s .15s var(--pe) forwards}
.pt-b{flex:1;min-width:0;position:relative;z-index:1}
.pt-m{word-break:break-word;color:var(--pf)}
.pt-tt{font-weight:600;margin-bottom:1px;font-size:14px;color:var(--pf)}
.pt-d{font-size:13px;color:var(--ps);font-weight:400;margin-top:2px}
.pt-a{position:relative;z-index:1;flex-shrink:0;padding:6px 14px;border-radius:8px;border:1px solid var(--pbd);background:transparent;color:var(--pf);font-family:var(--pfm);font-size:13px;font-weight:500;cursor:pointer;transition:background .15s,border-color .15s;align-self:center}
.pt-a:hover{background:rgba(0,0,0,.04);border-color:rgba(0,0,0,.12)}
[data-pt-theme="dark"] .pt-a:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12)}
.pt-cl{position:relative;z-index:2;flex-shrink:0;background:none;border:none;cursor:pointer;color:var(--pf);opacity:.5;padding:5px;border-radius:6px;display:flex;align-items:center;justify-content:center;transition:opacity .15s,background .15s;width:24px;height:24px}
.pt-cl:hover{opacity:1;background:rgba(0,0,0,.06)}
[data-pt-theme="dark"] .pt-cl:hover{background:rgba(255,255,255,.08)}
.pt-pr{position:absolute;bottom:0;left:0;right:0;height:2px;background:currentColor;opacity:.15;transform-origin:left;animation:pt-pg linear forwards}
@keyframes pt-pg{to{transform:scaleX(0)}}
.pt-sp{width:18px;height:18px;border:2.5px solid currentColor;border-top-color:transparent;border-radius:50%;animation:pt-sn .8s cubic-bezier(.5,0,.5,1) infinite;opacity:.7}
@keyframes pt-sn{to{transform:rotate(360deg)}}
.pt-sw{transition:none!important;cursor:grab}
.pt-dl{padding:16px 20px;width:100%}
.pt-dm{font-weight:600;font-size:14px;color:var(--pf);margin-bottom:12px}
.pt-db{display:flex;gap:8px;justify-content:flex-end}
.pt-bt{padding:6px 16px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;font-family:var(--pfm);border:1px solid transparent}
.pt-bc{background:transparent;color:var(--pf);border-color:var(--pbd)}
.pt-bo{background:var(--pf);color:var(--pb);border:none}
`;
