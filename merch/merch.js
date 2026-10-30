'use strict';
// superordinary merch storefront.
// Product images are concept mockups. Prices are preliminary.
// Checkout is intentionally NOT connected: no orders or payments are collected.
(() => {
  const ESV = 'esv';
  const products = [
    {id:'overlooked', group:'scripture', name:'overlooked tee', ref:'john 5:7', price:28, image:'john-front', sizes:true,
      verse:'“Sir, I have no one to put me into the pool when the water is stirred up, and while I am going another steps down before me.”',
      colors:[['washed black','#202020'],['muted teal','#24444b']]},
    {id:'heart', group:'scripture', name:'heart tee', ref:'1 samuel 16:7', price:28, image:'heart-front', sizes:true,
      verse:'“For the LORD sees not as man sees: man looks on the outward appearance, but the LORD looks on the heart.”',
      colors:[['warm cream','#e9e1d3'],['deep teal','#263d3f']]},
    {id:'seeing', group:'scripture', name:'seeing hoodie', ref:'genesis 16:13', price:60, image:'seen-front', sizes:true,
      verse:'“You are a God of seeing.”',
      colors:[['muted teal','#1c434d'],['charcoal','#283538']]},
    {id:'season', group:'scripture', name:'due season long sleeve', ref:'galatians 6:9', price:38, image:'due-front', sizes:true,
      verse:'“And let us not grow weary of doing good, for in due season we will reap, if we do not give up.”',
      colors:[['rust','#9b5036'],['charcoal','#2a2b28']]},
    {id:'known', group:'scripture', name:'known crewneck', ref:'psalm 139:1', price:52, image:'known-front', sizes:true,
      verse:'“O LORD, you have searched me and known me!”',
      colors:[['olive','#42483a'],['warm cream','#e5dfd1']]},
    {id:'vinyl', group:'music', name:'vinyl record', ref:'12-inch record', price:28, image:'vinyl', bg:'#241d16'},
    {id:'cd', group:'music', name:'compact disc', ref:'jewel case', price:14, image:'cd', bg:'#2c231a'},
    {id:'cassette', group:'music', name:'cassette tape', ref:'clear shell', price:12, image:'cassette', bg:'#2a2018'},
    {id:'hat', group:'extras', name:'dad hat', ref:'washed charcoal', price:28, image:'hat', bg:'#261d14'},
    {id:'beanie', group:'extras', name:'beanie', ref:'black knit', price:26, image:'beanie', bg:'#291f16'},
    {id:'tote', group:'extras', name:'canvas tote', ref:'natural cotton', price:20, image:'tote', bg:'#2f2219'},
    {id:'stickers', group:'extras', name:'sticker pack', ref:'assorted designs', price:8, image:'stickers', bg:'#b3a695'},
    {id:'picks', group:'extras', name:'guitar picks', ref:'3-pack', price:6, image:'picks', bg:'#b4a797'}
  ];
  const SIZES = ['S','M','L','XL','2XL'];
  const KEY = 'superordinary-cart-v1';
  const MAXQ = 10;
  const $ = id => document.getElementById(id);
  const byId = id => products.find(p => p.id === id);
  const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
  const img = p => `assets/${p.image}.webp`;
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  const load = () => {
    try {
      const x = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(x) ? x.filter(i => byId(i.id) && Number.isInteger(i.qty) && i.qty > 0)
        .map(i => ({id:i.id, size:String(i.size||'one size'), color:i.color ? String(i.color) : '', qty:Math.min(i.qty, MAXQ)})) : [];
    } catch { return []; }
  };
  let cart = load();

  const altFor = p => p.group === 'scripture'
    ? `Concept mockup of the ${p.name}: ${p.ref} printed large on the back, small superordinary wordmark on the front.`
    : `Concept mockup of the superordinary ${p.name}.`;

  function renderProduct(p, i) {
    const a = el('article', 'product');
    a.setAttribute('aria-labelledby', `name-${p.id}`);
    const im = el('img', 'product-image');
    im.src = img(p); im.alt = altFor(p); im.loading = 'lazy'; im.decoding = 'async';
    if (p.bg) { im.classList.add('fit'); im.style.backgroundColor = p.bg; }
    const top = el('div', 'product-top');
    const h = el('h3', null, p.name); h.id = `name-${p.id}`;
    top.append(h, el('span', 'number', String(i + 1).padStart(2, '0')));
    a.append(im, top, el('p', 'ref', p.group === 'scripture' ? `${p.ref} (${ESV})` : p.ref));
    if (p.verse) a.append(el('p', 'verse', p.verse));
    a.append(el('p', 'price', money(p.price)));

    const opts = el('div', 'options');
    if (p.colors) {
      const fs = el('fieldset', 'swatches');
      fs.append(el('legend', null, 'color'));
      p.colors.forEach(([name, hex], ci) => {
        const lab = el('label', 'swatch-label');
        const r = el('input'); r.type = 'radio'; r.name = `color-${p.id}`; r.value = name; r.checked = ci === 0;
        const sw = el('span', 'swatch'); sw.style.background = hex; sw.setAttribute('aria-hidden', 'true');
        lab.append(r, sw, el('span', 'sr-only', name)); lab.title = name;
        fs.append(lab);
      });
      const cur = el('span', 'swatch-name', p.colors[0][0]); cur.setAttribute('aria-hidden', 'true');
      fs.addEventListener('change', e => { cur.textContent = e.target.value; });
      fs.append(cur);
      opts.append(fs);
    }
    const row = el('div', 'selects');
    if (p.sizes) {
      const l = el('label', null, 'size'); l.htmlFor = `size-${p.id}`;
      const s = el('select'); s.id = `size-${p.id}`;
      SIZES.forEach(z => { const o = el('option', null, z); o.value = z; if (z === 'L') o.selected = true; s.append(o); });
      const ps = el('span', 'pair'); ps.append(l, s); row.append(ps);
    }
    const ql = el('label', null, 'qty'); ql.htmlFor = `qty-${p.id}`;
    const q = el('select'); q.id = `qty-${p.id}`;
    for (let n = 1; n <= MAXQ; n++) { const o = el('option', null, String(n)); o.value = n; q.append(o); }
    const pq = el('span', 'pair'); pq.append(ql, q); row.append(pq);
    opts.append(row);
    a.append(opts);

    const b = el('button', 'add', 'add to bag +'); b.type = 'button';
    b.setAttribute('aria-label', `add ${p.name} to bag`);
    b.addEventListener('click', () => {
      const size = p.sizes ? a.querySelector(`#size-${p.id}`).value : 'one size';
      const color = p.colors ? a.querySelector(`input[name="color-${p.id}"]:checked`).value : '';
      add(p.id, size, color, Number(q.value));
    });
    a.append(b);
    return a;
  }

  for (const group of ['scripture', 'music', 'extras'])
    products.filter(p => p.group === group).forEach((p, i) => $(group + '-grid').append(renderProduct(p, i)));

  const announce = t => { $('cart-status').textContent = ''; setTimeout(() => { $('cart-status').textContent = t; }, 50); };
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} renderCart(); }
  function add(id, size, color, qty) {
    const row = cart.find(x => x.id === id && x.size === size && x.color === color);
    if (row) row.qty = Math.min(MAXQ, row.qty + qty); else cart.push({id, size, color, qty});
    save();
    announce(`added ${qty} ${byId(id).name} to your bag.`);
    openCart();
  }
  function setQty(i, qty) {
    if (qty < 1) cart.splice(i, 1); else cart[i].qty = Math.min(MAXQ, qty);
    save();
  }
  function renderCart() {
    const count = cart.reduce((s, r) => s + r.qty, 0);
    $('cart-count').textContent = count;
    $('subtotal').textContent = money(cart.reduce((s, r) => s + byId(r.id).price * r.qty, 0));
    const list = $('cart-items'); list.replaceChildren();
    if (!cart.length) { list.append(el('p', 'cart-empty', 'your bag is empty.')); return; }
    cart.forEach((r, i) => {
      const p = byId(r.id);
      const d = el('div', 'cart-row');
      const im = el('img'); im.src = img(p); im.alt = '';
      const info = el('div');
      info.append(el('h3', null, p.name), el('p', null, [r.color, r.size].filter(Boolean).join(' · ')));
      const qty = el('div', 'cart-qty');
      const minus = el('button', null, '−'); minus.type = 'button'; minus.setAttribute('aria-label', `decrease ${p.name} quantity`);
      const val = el('span', null, String(r.qty)); val.setAttribute('aria-label', `quantity ${r.qty}`);
      const plus = el('button', null, '+'); plus.type = 'button'; plus.setAttribute('aria-label', `increase ${p.name} quantity`);
      plus.disabled = r.qty >= MAXQ;
      minus.addEventListener('click', () => { setQty(i, r.qty - 1); focusAfter(i, 'minus'); });
      plus.addEventListener('click', () => { setQty(i, r.qty + 1); focusAfter(i, 'plus'); });
      qty.append(minus, val, plus);
      const rm = el('button', 'remove', 'remove'); rm.type = 'button'; rm.setAttribute('aria-label', `remove ${p.name} from bag`);
      rm.addEventListener('click', () => { cart.splice(i, 1); save(); announce(`removed ${p.name}.`); $('cart-close').focus(); });
      info.append(qty, rm);
      d.append(im, info, el('span', 'line-total', money(p.price * r.qty)));
      list.append(d);
    });
  }
  function focusAfter(i, which) {
    const rows = $('cart-items').querySelectorAll('.cart-row');
    const row = rows[Math.min(i, rows.length - 1)];
    const btn = row && row.querySelector(which === 'plus' ? '.cart-qty button:last-child' : '.cart-qty button:first-child');
    (btn && !btn.disabled ? btn : $('cart-close')).focus();
  }

  let previousFocus = null;
  const panel = $('cart-panel');
  function openCart() {
    if (panel.classList.contains('open')) return;
    previousFocus = document.activeElement;
    panel.classList.add('open'); panel.removeAttribute('inert'); panel.setAttribute('aria-hidden', 'false');
    $('scrim').hidden = false; $('cart-toggle').setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; $('cart-close').focus();
  }
  function closeCart() {
    panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); panel.setAttribute('inert', '');
    $('scrim').hidden = true; $('cart-toggle').setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; previousFocus?.focus();
  }
  $('cart-toggle').addEventListener('click', openCart);
  $('cart-close').addEventListener('click', closeCart);
  $('scrim').addEventListener('click', closeCart);
  document.addEventListener('keydown', e => {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') closeCart();
    if (e.key === 'Tab') {
      const f = [...panel.querySelectorAll('button:not([disabled])')];
      const first = f[0], last = f.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  addEventListener('storage', e => { if (e.key === KEY) { cart = load(); renderCart(); } });
  renderCart();
})();
