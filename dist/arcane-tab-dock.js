/* Arcane Tab Dock 1.0.0
 * https://github.com/deekay2153/arcane-tab-dock
 *
 * Restyles the dashboard tab bar: the tabs sit in one frosted capsule, the
 * open tab is a glowing pill, and the tabs shrink to share the space so they
 * fit a phone without sideways scrolling. Nothing changes while a dashboard is
 * being edited.
 *
 * Settings are theme variables (all optional):
 *   tab-dock-accent        colour of the open tab   (default: primary colour)
 *   tab-dock-tab-width     width of one tab         (default: 54px)
 *   tab-dock-hide-buttons  none | touch | always    (default: none)
 *                          hides the menu button and the three dots.
 *                          "touch" = only on phones and tablets.
 *   tab-dock-disable       true turns the dock off for that theme
 *
 * Home Assistant has no setting for this, so a style sheet is added to the
 * dashboard header. If a frontend update renames the parts it uses, the tab
 * bar simply goes back to the stock look.
 */
(() => {
  if (window.__arcaneTabDock) return;
  window.__arcaneTabDock = '1.0.0';

  const ID = 'arcane-tab-dock-style';
  const T = ':not(.edit-mode) > .header .toolbar';

  const css = (opts) => `
${T} ha-tab-group{align-self:center;height:auto;min-width:0;--ha-tab-indicator-color:transparent;--ha-tab-track-color:transparent}
${T} ha-tab-group::part(tabs){flex:0 1 auto;min-width:0;margin:0 auto;padding:4px;gap:2px;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:22px;
  background:color-mix(in srgb,currentColor 7%,transparent);-webkit-backdrop-filter:blur(16px) saturate(1.3);backdrop-filter:blur(16px) saturate(1.3);
  box-shadow:inset 0 1px 0 color-mix(in srgb,currentColor 10%,transparent),0 10px 24px -16px #000}
${T} ha-tab-group-tab{flex:0 1 auto;width:var(--tab-dock-tab-width,54px);min-width:0;height:40px;--ha-tab-group-tab-height:40px;border:0;margin:0;border-radius:18px;opacity:.6;
  transition:opacity .35s ease,background .35s ease,box-shadow .35s ease,transform .2s ease}
${T} ha-tab-group-tab::part(base){width:100%;height:100%;box-sizing:border-box;padding:0 6px;justify-content:center}
${T} ha-tab-group-tab:not(.icon-only){width:auto}
${T} ha-tab-group-tab:not(.icon-only)::part(base){padding:0 14px}
${T} ha-tab-group-tab:active{transform:scale(.92)}
${T} ha-tab-group-tab[active]{opacity:1;--_acc:var(--tab-dock-accent,var(--primary-color));
  background:linear-gradient(160deg,color-mix(in srgb,var(--_acc) 46%,transparent),color-mix(in srgb,var(--_acc) 18%,transparent));
  box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--_acc) 62%,transparent),inset 0 1px 0 rgba(255,255,255,.22),0 0 18px -3px color-mix(in srgb,var(--_acc) 70%,transparent)}
${T} ha-tab-group-tab.hide-tab{display:none}
${opts.hide === 'always' ? `${T} > ha-menu-button,${T} > .action-items{display:none}` : ''}
${opts.hide === 'touch' ? `@media (pointer:coarse){${T} > ha-menu-button,${T} > .action-items{display:none}}` : ''}
@media (prefers-reduced-motion:reduce){${T} ha-tab-group-tab{transition:none}}
`;

  const huiRoot = () => {
    try {
      const main = document.querySelector('home-assistant').shadowRoot
        .querySelector('home-assistant-main').shadowRoot;
      const panel = main.querySelector('ha-panel-lovelace');
      const hui = panel && panel.shadowRoot && panel.shadowRoot.querySelector('hui-root');
      return hui || null;
    } catch (e) {
      return null;
    }
  };

  const options = (host) => {
    const cs = getComputedStyle(host);
    const v = (n) => cs.getPropertyValue(n).trim().replace(/^["']|["']$/g, '').toLowerCase();
    const hide = v('--tab-dock-hide-buttons');
    return {
      off: v('--tab-dock-disable') === 'true',
      hide: hide === 'touch' || hide === 'always' ? hide : 'none',
    };
  };

  const apply = () => {
    const host = huiRoot();
    if (!host || !host.shadowRoot) return;
    const r = host.shadowRoot;
    const opts = options(host);
    const key = `${opts.off}|${opts.hide}`;
    let s = r.getElementById(ID);
    if (s && s.dataset.key === key) return;
    if (opts.off) {
      if (s) s.remove();
      return;
    }
    if (!s) {
      s = document.createElement('style');
      s.id = ID;
      r.appendChild(s);
    }
    s.dataset.key = key;
    s.textContent = css(opts);
  };

  apply();
  window.addEventListener('location-changed', () => setTimeout(apply, 50));
  // The header is rebuilt when you switch dashboards or themes.
  setInterval(apply, 1500);
  console.info('%c ARCANE-TAB-DOCK %c 1.0.0 ', 'color:#fff;background:#3b82f6;font-weight:700', 'color:#3b82f6;background:#fff');
})();
