export function createHUD() {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;color:#cdd0d6;'
    + 'font:16px ui-monospace,monospace';
  wrap.innerHTML = `
    <div style="position:absolute;top:16px;left:18px" id="dist">距离 0 m</div>
    <div style="position:absolute;top:16px;right:18px;color:#8b9098" id="kills">碾过 0</div>
    <div id="card" style="position:absolute;inset:0;display:none;align-items:center;
      justify-content:center;flex-direction:column;gap:14px;background:#0e1014cc;
      pointer-events:auto;text-align:center">
      <div style="font-style:italic;color:#aeb2ba">这趟到此为止。下一趟照常发车。</div>
      <div id="cardstats" style="color:#8b9098"></div>
      <div style="color:#6b7078;font-size:13px">点击 / 按任意键 重开</div>
    </div>`;
  document.body.appendChild(wrap);
  const $ = (id) => wrap.querySelector('#' + id);
  return {
    set(distance, kills) {
      $('dist').textContent = `距离 ${distance} m`;
      $('kills').textContent = `碾过 ${kills}`;
    },
    showCard(distance, kills) {
      $('cardstats').textContent = `距离 ${distance} m · 碾过 ${kills}`;
      $('card').style.display = 'flex';
    },
    hideCard() { $('card').style.display = 'none'; },
  };
}
