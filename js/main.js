/* =========================================================
   AC Square — interactions
   Edit the CONFIG section below to change copy/data.
   Everything else is behaviour.
   ========================================================= */

/* ---------- CONFIG ---------- */

// Public contact email shown on the page (footer/contact-direct in index.html).
const CONTACT_EMAIL = "ac36693@gmail.com";

// Contact form submits here. Notifications land in the inbox set on the
// Formspree account (clafy.fit@gmail.com), independent of CONTACT_EMAIL above.
const FORM_ENDPOINT = "https://formspree.io/f/xjykwnlp";

// How long each trade stays on screen in the hero (ms).
const ROTATE_EVERY = 5500;

// Hero rotator + live example. Order = rotation order.
// `names[0]` is shown highlighted as "You". These are illustrative, not real clients.
const HERO_EXAMPLES = [
  { trade: "Plumbers",      question: "who should I call for a burst pipe tonight?",     names: ["Rideau Emergency Plumbing", "Capital Drain & Pipe", "Byward Mechanical"] },
  { trade: "Electricians",  question: "need an electrician for a panel upgrade",         names: ["Glebe Electric Co.", "Merivale Power & Light", "Orléans Wiring"] },
  { trade: "Dentists",      question: "dentist near Westboro taking new patients?",      names: ["Westboro Family Dental", "Parkdale Smiles", "Kitchissippi Dental"] },
  { trade: "Restaurants",   question: "good spot for a birthday dinner in the Market",   names: ["Maison Lowertown", "Sussex Street Grill", "The Clarence Room"] },
  { trade: "Roofers",       question: "who's reliable for a roof leak in Kanata?",       names: ["Kanata Roof Works", "Ottawa Valley Roofing", "Carp Ridge Exteriors"] },
  { trade: "Salons",        question: "salon in Centretown that does balayage",          names: ["Bank Street Studio", "Elgin Hair Co.", "Somerset Salon"] },
  { trade: "Contractors",   question: "contractor for a basement reno in Barrhaven",     names: ["Barrhaven Build Co.", "Jock River Renovations", "Strandherd Contracting"] },
  { trade: "Retail Stores", question: "where can I buy a proper winter coat downtown?",  names: ["Rideau Outfitters", "Wellington West Supply", "Preston Street Goods"] },
  { trade: "Chiropractors", question: "chiropractor near Hintonburg for back pain",      names: ["Hintonburg Chiropractic", "Parkdale Spine & Sport", "Holland Ave Wellness"] },
  { trade: "Law Firms",     question: "real estate lawyer for a first home purchase",    names: ["Laurier Law LLP", "Sparks Street Legal", "Rideau Canal Law"] }
];

/* ---------- BEHAVIOUR ---------- */

document.documentElement.classList.add("js");

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initHero();
  initTimeline();
  initPhone();
  initFaq();
  initContact();
  initStickyCta();
  $("#year").textContent = new Date().getFullYear();
});

/* Mobile menu */
function initNav() {
  const toggle = $(".nav-toggle");
  const nav = $("#site-nav");
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
}

/* Hero: rotating trade + matching example answer */
function initHero() {
  const word = $("#rotator-word");
  const chipsWrap = $("#trade-chips");
  const fades = [$("#example-question"), $("#example-answer")];
  let index = 0;
  let paused = false;

  const chips = HERO_EXAMPLES.map((ex, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = ex.trade;
    b.addEventListener("click", () => { paused = true; show(i); });
    chipsWrap.appendChild(b);
    return b;
  });

  const fill = (i) => {
    const ex = HERO_EXAMPLES[i];
    word.textContent = ex.trade;
    $("#example-question").textContent = ex.question;
    $("#example-first").textContent = ex.names[0];
    $("#example-second").textContent = ex.names[1];
    $("#example-third").textContent = ex.names[2];
    chips.forEach((c, k) => c.classList.toggle("is-active", k === i));
  };

  const show = (next) => {
    if (next === index) return;
    index = next;
    if (reduceMotion) return fill(next);
    word.classList.add("is-out");
    fades.forEach((el) => el.classList.add("is-hidden"));
    setTimeout(() => {
      fill(next);
      word.classList.remove("is-out");
      word.classList.add("is-pre");
      word.offsetHeight; // reflow so the next transition runs
      word.classList.remove("is-pre");
      fades.forEach((el) => el.classList.remove("is-hidden"));
    }, 600);
  };

  fill(0);
  setInterval(() => { if (!paused && !document.hidden) show((index + 1) % HERO_EXAMPLES.length); }, ROTATE_EVERY);
}

/* Timeline dots (count comes from data-dots in the HTML) */
function initTimeline() {
  $$(".era-dots").forEach((el) => {
    const n = Number(el.dataset.dots) || 0;
    const first = el.hasAttribute("data-highlight-first");
    el.innerHTML = Array.from({ length: n }, (_, k) => `<i${first && k === 0 ? ' class="is-you"' : ""}></i>`).join("");
  });
}

/* Scale the 430×932 phone mockup to fit its column */
function initPhone() {
  const frame = $("#phone-frame");
  if (!frame) return;
  const fit = () => {
    const available = Math.min(344, frame.parentElement.clientWidth);
    const scale = Math.max(0.5, Math.min(0.8, available / 430));
    frame.style.setProperty("--phone-scale", scale.toFixed(3));
  };
  fit();
  new ResizeObserver(fit).observe(frame.parentElement);
}

/* FAQ as a chat: reads questions/answers from the HTML */
function initFaq() {
  const items = $$("#faq-source .faq-item").map((el) => ({
    q: $(".faq-q", el).textContent.trim(),
    a: $(".faq-a", el).textContent.trim()
  }));
  const thread = $("#faq-thread");
  const options = $("#faq-options");
  const asked = [];
  thread.hidden = false;
  options.hidden = false;

  const addMessage = (i, instant) => {
    const msg = document.createElement("div");
    msg.className = "msg";
    msg.innerHTML = `<div class="msg-q"></div>`;
    $(".msg-q", msg).textContent = items[i].q;
    thread.appendChild(msg);

    const answer = () => {
      const a = document.createElement("div");
      a.className = "msg-a";
      a.textContent = items[i].a;
      msg.appendChild(a);
    };
    if (instant || reduceMotion) return answer();
    const typing = document.createElement("div");
    typing.className = "typing";
    typing.innerHTML = "<i></i><i></i><i></i>";
    msg.appendChild(typing);
    setTimeout(() => { typing.remove(); answer(); }, 800);
  };

  const renderOptions = () => {
    options.innerHTML = "";
    items.forEach((it, i) => {
      if (asked.includes(i)) return;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "faq-option";
      b.textContent = it.q;
      b.addEventListener("click", () => { asked.push(i); addMessage(i); renderOptions(); });
      options.appendChild(b);
    });
    if (asked.length === items.length) {
      options.innerHTML = `<a href="#contact" class="faq-done">That&rsquo;s everything. Book a call &rarr;</a>`;
    }
  };

  asked.push(0);
  addMessage(0, true);
  renderOptions();
}

/* Contact form → posts to Formspree via fetch (falls back to a native POST, see the form's action/method, if JS fails) */
function initContact() {
  const form = $("#contact-form");
  const note = $(".contact-note", form);
  const defaultNote = note.textContent;
  const btn = form.querySelector("button[type=submit]");
  const btnLabel = btn.textContent;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = "Sending…";

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      });
      if (!res.ok) throw new Error("Formspree error");
      $$("input", form).forEach((el) => (el.disabled = true));
      btn.textContent = "Sent";
      note.textContent = "Thanks — we got it and will be in touch shortly.";
    } catch (err) {
      btn.disabled = false;
      btn.textContent = btnLabel;
      note.textContent = `Something went wrong sending that — email us directly at ${CONTACT_EMAIL} instead.`;
    }
  });
}

/* Sticky "Book a free consultation" bar on phones, after the hero */
function initStickyCta() {
  const bar = $("#sticky-cta");
  const contact = $("#contact");
  let contactVisible = false;
  new IntersectionObserver(([e]) => { contactVisible = e.isIntersecting; update(); }).observe(contact);
  const update = () => bar.classList.toggle("is-visible", window.scrollY > 640 && !contactVisible);
  window.addEventListener("scroll", update, { passive: true });
  update();
}
