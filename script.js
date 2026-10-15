/* =========================================================
   script.js — ทุกอย่างเป็น Vanilla JavaScript ไม่มี backend
   ========================================================= */

// ตรวจว่าผู้ใช้ตั้งค่าให้ลดแอนิเมชันไว้หรือเปล่า
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ตัวช่วยสั้น ๆ ไว้เลือก element
const $ = (id) => document.getElementById(id);

/* ---------------------------------------------------------
   ตัวสุ่มข้อความ: สุ่มจากลิสต์ แต่ไม่ให้ซ้ำอันเดิมติดกัน
   --------------------------------------------------------- */
function makePicker(list) {
  let last = -1;
  return function () {
    if (list.length === 1) return list[0];
    let i;
    do { i = Math.floor(Math.random() * list.length); } while (i === last);
    last = i;
    return list[i];
  };
}

// เปลี่ยนข้อความใน element พร้อมเล่นเอฟเฟกต์ค่อย ๆ ปรากฏ
function showText(el, text) {
  el.textContent = text;
  el.classList.remove("fade-in");
  void el.offsetWidth;            // รีเซ็ตแอนิเมชันให้เล่นใหม่
  el.classList.add("fade-in");
}

/* =========================================================
   ข้อความปลอบใจ แยกตามความรู้สึก
   (อยากเพิ่มข้อความ ก็เติมในลิสต์ได้เลย โดยใส่เครื่องหมายคอมมาคั่น)
   ========================================================= */
const moodMessages = {
  tired: [
    "เธอพยายามมามากแล้วนะ วันนี้จะพักบ้างก็ได้ ไม่จำเป็นต้องทำทุกอย่างให้เสร็จในวันเดียวเลย เค้าไม่ได้รักเธอเพราะเธอทำทุกอย่างเก่งนะ เค้ารักเธอเพราะเธอเป็นเธอต่างหาก",
    "วันนี้เหนื่อยมาเยอะเลยใช่ไหม ไม่ต้องอธิบายก็ได้นะ แค่วางทุกอย่างลงตรงนี้ก่อน ของที่ยังไม่เสร็จมันรอได้ เธอพักก่อนก็ได้เลย",
    "ทั้งร่างกายและใจของเธอทำงานหนักมาแล้วนะ ถ้ารู้สึกว่าไม่ไหว นั่นแปลว่าเธอควรได้พักจริง ๆ ไม่ได้แปลว่าเธออ่อนแอเลย"
  ],
  notgood: [
    "เธอไม่จำเป็นต้องเก่งที่สุดเลยนะ การที่วันนี้ทำไม่ได้ ไม่ได้แปลว่าเธอจะทำไม่ได้ตลอดไป แล้วถึงวันไหนเธอจะทำไม่ได้จริง ๆ เธอก็ยังมีคุณค่าในแบบของเธออยู่ดีนะ",
    "ความรู้สึกว่าตัวเองยังไม่ดีพอ มันแวะมาได้ในวันที่เหนื่อย แต่มันไม่ใช่ความจริงทั้งหมดของเธอนะ ตัวเธอใหญ่กว่าผลงานของวันนี้เยอะเลย",
    "เธอไม่ต้องพิสูจน์อะไรเลยนะ วันที่ทำได้ไม่เท่าที่หวัง ก็ยังเป็นวันของคนที่พยายามอยู่ดี"
  ],
  sad: [
    "ถ้าวันนี้เธอเศร้าโดยที่อธิบายไม่ได้ก็ไม่เป็นไรเลยนะ บางครั้งความรู้สึกก็ไม่จำเป็นต้องมีคำอธิบายก็ได้ เธอไม่ต้องรีบเข้าใจทุกอย่างในวันนี้นะคนดี",
    "ไม่ต้องฝืนยิ้มเพื่อให้ใครสบายใจเลยนะ ถ้าวันนี้เธออยากเงียบ อยากพัก หรืออยากร้องไห้ก็ไม่เป็นไร เค้าไม่ได้อยากเห็นเธอมีความสุขแค่ตอนที่ทุกอย่างดี เค้าอยากให้เธอรู้สึกปลอดภัยแม้ในวันที่ไม่โอเคด้วยนะ",
    "เศร้าได้นะ ไม่ต้องรีบหายก็ได้ ความเศร้าไม่ได้ทำให้เธอเป็นคนแย่หรือเป็นภาระเลย ค่อย ๆ ไปในจังหวะของเธอได้เลยนะ"
  ],
  beside: [
    "ถ้าไม่รู้จะพูดอะไร เราก็ไม่ต้องพูดกันก็ได้นะ เธอไม่ต้องหาคำพูดมาอธิบายทุกอย่างให้เค้าเข้าใจทันที แค่เธออยู่ตรงนี้ก็ได้ ค่อย ๆ เล่าตอนที่เธอพร้อมนะ",
    "ถ้าวันนี้อยากเงียบ ๆ ก็เงียบด้วยกันได้นะ ไม่ต้องคุย ไม่ต้องเล่า ไม่ต้องทำอะไรเลย อยู่ตรงนี้ด้วยกันเฉย ๆ ก็พอแล้ว",
    "เค้าอยู่ตรงนี้นะ นั่งอยู่ข้าง ๆ เธอเงียบ ๆ แบบไม่ต้องมีอะไรต้องพิสูจน์ ไม่ต้องรีบรู้สึกดีขึ้นด้วย"
  ],
  vent: [
    "ถ้ามีเรื่องอยากระบาย จะเล่าตอนไหนก็ได้นะ จะเล่าทั้งหมดหรือแค่นิดเดียวก็ได้ ไม่ต้องเรียงให้สวย ไม่ต้องมีเหตุผลครบ เล่าแบบที่มันออกมาเลยนะ",
    "ถ้าอยากเขียนมันออกมาก่อน ข้างล่างมีกล่องเล็ก ๆ ไว้ให้นะ จะเก็บไว้เฉย ๆ หรือลบทิ้งก็ได้ ไม่ต้องส่งให้ใครเลย",
    "ความรู้สึกของเธอไม่ต้องรอให้สมเหตุสมผลก่อนถึงจะเล่าได้นะ ตอนไหนที่เธอพร้อมค่อยเล่าก็ได้ ไม่ต้องรีบเลย"
  ],
  love: [
    "ขอให้เธอจำไว้อย่างหนึ่งนะ เธอไม่ต้องทำอะไรให้สมควรได้รับความรักเลย เธอไม่ต้องเก่ง ไม่ต้องน่ารักตลอดเวลา และไม่ต้องเป็นคนที่สมบูรณ์แบบเพื่อให้เค้ารัก เพราะเค้ารักเธอที่เธอเป็นเธอนะ",
    "วันนี้ไม่ต้องทำอะไรเลยนะ แค่รับความรักนี้ไว้ก็พอ มันเป็นของเธออยู่แล้ว ไม่ต้องแลกด้วยอะไรทั้งนั้น",
    "เค้ารักเธอตอนที่ยิ้ม ตอนที่เงียบ และตอนที่เหนื่อยจนไม่อยากทำอะไรเลย ความรักนี้ไม่ได้ขึ้นอยู่กับว่าวันนี้เธอทำได้กี่อย่างนะ"
  ],
  good: [
    "เย้ วันนี้มีเรื่องดี ๆ ด้วยเหรออ เล่าให้เค้าฟังหน่อยได้มั้ยย เค้าอยากรู้จักโลกของเธอทั้งวันที่มีความสุขและวันที่เหนื่อยเลยนะ 💗",
    "ดีใจจังเลย ที่วันนี้โอเค แวะมาหาเค้าเฉย ๆ ก็ได้นะ ไม่ต้องมีเหตุผลอะไรเลย 💗",
    "ได้ยินแล้วใจฟูเลย วันดี ๆ ก็ควรได้เก็บไว้เหมือนกันนะ อยากเล่าตอนไหนก็เล่าได้เลย"
  ]
};

// ตัวสุ่มของแต่ละหมวด (แยกกัน เพื่อจำข้อความล่าสุดของแต่ละหมวด)
const moodPickers = {};
for (const key in moodMessages) moodPickers[key] = makePicker(moodMessages[key]);

let currentMood = null;

function setMood(mood) {
  currentMood = mood;
  showText($("moodText"), moodPickers[mood]());
  $("moodAgain").hidden = false;
  // ปุ่มพาไปกล่องเขียน แสดงเฉพาะหมวด "อยากระบาย"
  $("gotoWrite").hidden = mood !== "vent";
  // อัปเดตสถานะปุ่มที่ถูกเลือก (accessibility)
  document.querySelectorAll(".mood-btn").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.mood === mood));
  });
}

document.querySelectorAll(".mood-btn").forEach((btn) => {
  btn.addEventListener("click", () => setMood(btn.dataset.mood));
});
$("moodAgain").addEventListener("click", () => { if (currentMood) setMood(currentMood); });
$("gotoWrite").addEventListener("click", () => {
  $("writeSection").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  $("noteBox").focus({ preventScroll: true });
});

/* =========================================================
   เอฟเฟกต์ประกายหัวใจ/ดาวเล็ก ๆ (กระจายออกจากปุ่มที่กด)
   ========================================================= */
function burst(fromEl, count = 12) {
  if (reduceMotion) return;
  const layer = $("burstLayer");
  const r = fromEl.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const icons = ["💗", "✨", "⭐", "🌼", "💛"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = icons[Math.floor(Math.random() * icons.length)];
    s.style.left = cx + "px";
    s.style.top = cy + "px";
    const angle = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 90;
    s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    s.style.setProperty("--dy", Math.sin(angle) * dist - 30 + "px");
    layer.appendChild(s);
    setTimeout(() => s.remove(), 1700);   // ลบทิ้งหลังเล่นจบ
  }
}

/* =========================================================
   จดหมายจากเค้า
   ========================================================= */
// แต่ละบรรทัดในอาร์เรย์คือหนึ่งย่อหน้า (class ใช้ตกแต่งชื่อผู้รับ/ผู้ส่ง)
const letterLines = [
  { t: "ถึงคุนสามีของเค้า", c: "to" },
  { t: "เค้าไม่รู้หรอกนะว่าในแต่ละวันเธอต้องเจอกับอะไรบ้าง มีเรื่องไหนที่ทำให้เธอเหนื่อย หรือมีเรื่องไหนที่เธอเก็บเอาไว้คนเดียว" },
  { t: "แต่เค้าอยากให้เธอรู้ว่า เธอไม่จำเป็นต้องรับมือกับทุกอย่างให้เก่งตลอดเวลาก็ได้" },
  { t: "เธอมีวันที่อ่อนแอได้ มีวันที่ไม่มั่นใจในตัวเองได้ มีวันที่ไม่อยากพูดกับใครได้ และมีวันที่ทำอะไรไม่สำเร็จได้เหมือนกันนะ" },
  { t: "เค้าไม่ได้คาดหวังให้เธอเป็นคนที่สมบูรณ์แบบเลย เค้าอยากเห็นเธอเป็นตัวเอง อยากให้เธอได้พักโดยไม่ต้องรู้สึกผิด และอยากให้เธอใจดีกับตัวเองให้มาก ๆ" },
  { t: "ถ้าวันไหนเธอรู้สึกว่าโลกใจร้ายกับเธอมากเกินไป ขอให้เธออย่าลืมว่าเธอก็สมควรได้รับความอ่อนโยนเหมือนกันนะ" },
  { t: "เธอไม่จำเป็นต้องเก่งทุกวันหรอก เพราะสำหรับเค้า เธอไม่เคยต้องเก่งก่อนถึงจะได้รับความรักเลย" },
  { t: "รักเธอนะ ไม่ใช่แค่ในวันที่เธอยิ้ม แต่รวมถึงวันที่เธอเหนื่อย วันที่เธอสับสน และวันที่เธอแค่ต้องการพักด้วย" },
  { t: "ค่อย ๆ เติบโตไปในแบบของเธอนะ เค้าไม่ได้อยากเร่งให้เธอเป็นอะไรเลย" },
  { t: "เค้าแค่อยากอยู่ข้าง ๆ และเรียนรู้จักเธอไปเรื่อย ๆ" },
  { t: "จากเค้า คนที่รักเธอในแบบที่เธอเป็น 💗", c: "from" }
];

const envelope = $("envelope");

// สร้างข้อความในจดหมายทีละบรรทัด โดยหน่วงเวลาให้ค่อย ๆ โผล่
function renderLetter() {
  const body = $("letterBody");
  body.innerHTML = "";
  letterLines.forEach((line, i) => {
    const p = document.createElement("p");
    p.textContent = line.t;
    if (line.c) p.className = line.c;
    p.style.setProperty("--delay", reduceMotion ? "0s" : i * 1.3 + 0.6 + "s");
    body.appendChild(p);
  });
}

function openLetter() {
  envelope.setAttribute("aria-expanded", "true");
  $("keptNote").hidden = true;
  renderLetter();
  // รอให้ฝาซองเปิดก่อนนิดหนึ่ง แล้วค่อยโชว์กระดาษจดหมาย
  setTimeout(() => {
    $("letterPaper").hidden = false;
    $("letterActions").hidden = false;
    $("letterPaper").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  }, reduceMotion ? 0 : 500);
}

envelope.addEventListener("click", () => {
  if (envelope.getAttribute("aria-expanded") === "true") return;  // เปิดอยู่แล้ว
  openLetter();
});

// อ่านจดหมายอีกครั้ง: เล่นข้อความใหม่ตั้งแต่บรรทัดแรก
$("letterAgain").addEventListener("click", renderLetter);

// เก็บจดหมายไว้ในใจ: มีประกาย แล้วปิดซองลง
$("letterKeep").addEventListener("click", () => {
  burst($("letterKeep"), 16);
  $("letterPaper").hidden = true;
  $("letterActions").hidden = true;
  envelope.setAttribute("aria-expanded", "false");
  $("keptNote").hidden = false;
});

/* =========================================================
   มุมพักใจ: ดาวบนท้องฟ้า, แมว, ปุ่มต่าง ๆ
   ========================================================= */
// สร้างดาวกระพริบเบา ๆ ในหน้าต่าง
const skyStars = $("skyStars");
function addStar(extraClass) {
  const s = document.createElement("span");
  s.className = "star" + (extraClass ? " " + extraClass : "");
  s.style.left = 8 + Math.random() * 84 + "%";
  s.style.top = 6 + Math.random() * 72 + "%";
  s.style.setProperty("--d", (Math.random() * 4).toFixed(1) + "s");
  skyStars.appendChild(s);
}
for (let i = 0; i < 22; i++) addStar();

const restMsgs = makePicker([
  "หายใจเข้าช้า ๆ แล้วปล่อยออกมาตามสบายนะ ดาวพวกนี้อยู่ตรงนี้เป็นเพื่อนเธอ ไม่ต้องทำอะไรเลย",
  "ตรงนี้เงียบ ๆ และปลอดภัยนะ ไหล่ลดลงนิดนึง ปล่อยให้ใจได้วางลงบ้าง",
  "ดาวดวงใหม่โผล่มาแล้ว ไม่ต้องรีบไปไหน อยู่ตรงนี้นานเท่าที่อยากอยู่ได้เลยนะ",
  "พักด้วยกันนะ ไม่ต้องคิดอะไร ไม่ต้องตอบอะไร แค่นั่งมองดาวเฉย ๆ ก็พอแล้ว"
]);
const noRushMsgs = makePicker([
  "วันนี้เธอเก่งมากๆแล้วนะ",
  "อะไรที่ยังไม่เสร็จ พรุ่งนี้ค่อยทำต่อได้ วันนี้เท่านี้ก็เยอะแล้วนะ",
  "ไม่ต้องรีบหายเหนื่อย ไม่ต้องรีบดีขึ้น ใจของเธอมีจังหวะของมันเองนะ^^",
  "ที่ยังทำไม่ได้ ยังทำไม่ถึง วันนี้ปล่อยไว้ก่อนก็ได้นะ ",
  "ไม่ต้องคอยดูแลความรู้สึกของใครตอนนี้ ดูแลตัวเองก่อนก็พอนะะ"
]);
const hugMsgs = makePicker([
  "กอดแน่น ๆ เลยนะ 🫂",
  "ส่งกอดอุ่น ๆ ไปให้ ไม่ต้องทำอะไรเลยก็ได้",
  "กอดยาว ๆ แบบไม่ต้องพูดอะไรนะ",
  "วันนี้ให้กอดแทนคำพูดแล้วกันนะ",
  "กอดเบา ๆ ให้หัวใจได้พักนะ",
  "กอดนี้ไม่มีเงื่อนไขนะ ไม่ต้องเก่งก่อนถึงจะรับได้",
  "ขอกอดสักทีนะ แล้วค่อยพักต่อ",
  "กอดนุ่ม ๆ ให้ไว้ ตอนนี้ไม่ต้องคิดอะไรแล้วนะ"
]);
const catMsgs = makePicker([
  "เมี้ยว~ แมวน้อยบอกว่าวันนี้นอนพักก่อนก็ได้นะ 🐱",
  "แมวน้อยนั่งเงียบ ๆ อยู่ข้างเธอนะ ไม่ไปไหนเลย",
  "ครืด ๆ ๆ… (แมวน้อยกำลังครางเบา ๆ อยู่)",
  "แมวน้อยว่า วันนี้พักก่อนนะ ดาวยังอยู่ตรงนั้นเสมอ",
  "เมี้ยว~ ไม่ต้องรีบเลยนะ"
]);

$("restTogether").addEventListener("click", () => {
  // ดาวดวงใหม่ค่อย ๆ ปรากฏขึ้นในท้องฟ้า
  for (let i = 0; i < 5; i++) addStar("new");
  showText($("restText"), restMsgs());
});
$("noRush").addEventListener("click", () => showText($("restText"), noRushMsgs()));
$("hugBtn").addEventListener("click", (e) => {
  showText($("restText"), hugMsgs());
  burst(e.currentTarget, 8);
});
$("cat").addEventListener("click", () => showText($("catText"), catMsgs()));

/* ---------------------------------------------------------
   เพลงบรรเลงเบา ๆ: สร้างเสียงเองด้วย Web Audio API
   (ไม่ต้องมีไฟล์เสียง และจะไม่เล่นเองตอนเปิดเว็บ ต้องกดปุ่มก่อนเท่านั้น)
   --------------------------------------------------------- */
// เพลงประกอบเว็บไซต์ 💗
const bgMusic = new Audio("music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;

$("musicBtn").addEventListener("click", async () => {
  if (bgMusic.paused) {
    try {
      await bgMusic.play();
      $("musicBtn").setAttribute("aria-pressed", "true");
      $("musicBtn").textContent = "🔇 ปิดเพลง";
    } catch (error) {
      $("musicBtn").textContent = "ลองกดเปิดเพลงอีกครั้ง 🎵";
    }
  } else {
    bgMusic.pause();
    $("musicBtn").setAttribute("aria-pressed", "false");
    $("musicBtn").textContent = "🎵 เปิดเพลงบรรเลงเบา ๆ";
  }
});
/* =========================================================
   กล่องข้อความ: บันทึก/ลบด้วย localStorage (อยู่ในเครื่องนี้เท่านั้น)
   ========================================================= */
const NOTE_KEY = "safeSpaceNote";
const noteBox = $("noteBox");
const noteStatus = $("noteStatus");

// ห่อ localStorage ด้วย try/catch เผื่อเบราว์เซอร์ปิดการเก็บข้อมูลไว้
function readNote() {
  try { return JSON.parse(localStorage.getItem(NOTE_KEY)); } catch (e) { return null; }
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
  } catch (e) { return ""; }
}

// เปิดเว็บมา ถ้ามีข้อความที่เคยบันทึกไว้ ให้แสดงกลับมา
(function loadNote() {
  const saved = readNote();
  if (saved && saved.text) {
    noteBox.value = saved.text;
    noteStatus.textContent = "มีข้อความที่บันทึกไว้เมื่อ " + formatDate(saved.time);
  }
})();

$("saveNote").addEventListener("click", () => {
  const text = noteBox.value.trim();
  if (!text) {
    noteStatus.textContent = "ยังไม่ได้เขียนอะไรเลยนะ ไม่เป็นไร เขียนตอนพร้อมก็ได้";
    return;
  }
  try {
    localStorage.setItem(NOTE_KEY, JSON.stringify({ text: text, time: new Date().toISOString() }));
    noteStatus.textContent = "บันทึกไว้ในเครื่องนี้แล้วนะ (ยังไม่ได้ส่งให้ใครทั้งนั้น)";
  } catch (e) {
    noteStatus.textContent = "บันทึกไม่สำเร็จ เบราว์เซอร์อาจปิดการเก็บข้อมูลไว้อยู่นะ";
  }
});

$("deleteNote").addEventListener("click", () => {
  if (!window.confirm("ลบข้อความที่บันทึกไว้ในเครื่องนี้ใช่ไหม? ลบแล้วเอากลับมาไม่ได้นะ")) return;
  try { localStorage.removeItem(NOTE_KEY); } catch (e) { /* ไม่ต้องทำอะไร */ }
  noteBox.value = "";
  noteStatus.textContent = "ลบข้อความเรียบร้อยแล้วนะ";
});

/* =========================================================
   การ์ดข้อความสั้น ๆ แบบสุ่ม
   ========================================================= */
const cardPicker = makePicker([
  "วันนี้ไม่เก่งก็ไม่เป็นไรนะะ  ",
  "เธอพักได้โดยไม่ต้องรู้สึกผิดนะ",
  "ไม่ต้องฝืนยิ้มให้เค้าก็ได้",
  "เธอไม่ได้มีคุณค่าน้อยลงเพราะวันที่ไม่ไหวหรอกนะ",
  "เค้าอยากให้เธอรักตัวเองและใจดีกับตัวเองเยอะ ๆ เลย",
  "ไม่ต้องรีบหายเหนื่อยนะ ค่อย ๆ ไปก็ได้",
  "วันนี้ทำได้แค่นี้ก็ไม่เป็นไรเลย",
  "เธอไม่ต้องผ่านทุกอย่างด้วยตัวเองเสมอไปนะ",
  "ไม่ว่าเธอจะรู้สึกยังไง ความรู้สึกของเธอก็สำคัญนะ",
  "เค้าไม่ได้ต้องการให้เธอเป็นคนที่ดีที่สุด เค้าอยากให้เธอได้เป็นตัวเองอย่างสบายใจ"
]);
$("cardAgain").addEventListener("click", () => showText($("cardText"), cardPicker()));

/* =========================================================
   ตกแต่งพื้นหลัง: ดาว ดอกเดซี่ ทานตะวัน พระจันทร์ เมฆ แมว (ลอยช้า ๆ)
   ========================================================= */
(function buildDeco() {
  const deco = $("deco");
  const items = ["⭐", "🌼", "🌻", "🌙", "☁️", "✨", "🐱", "🌼", "☁️", "⭐", "🌷", "🌻"];
  items.forEach((icon, i) => {
    const s = document.createElement("span");
    s.textContent = icon;
    s.style.left = (i % 2 === 0 ? 2 + Math.random() * 14 : 82 + Math.random() * 12) + "%";
    s.style.top = (4 + i * 8 + Math.random() * 4) + "%";
    s.style.fontSize = 1.1 + Math.random() * 0.9 + "rem";
    s.style.setProperty("--d", -Math.random() * 18 + "s");
    deco.appendChild(s);
  });
})();
