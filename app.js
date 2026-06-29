(() => {
  'use strict';

  const STORAGE_KEY = 'srbingo.progress.v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const app = $('#app');

  const alphabet = [
    ['A','А','a','auto'], ['B','Б','b','brat'], ['C','Ц','ts','cena'], ['Č','Ч','ч','čaj'], ['Ć','Ћ','мягкое ч','ćao'],
    ['D','Д','d','dan'], ['Dž','Џ','дж','džep'], ['Đ','Ђ','дьж','đak'], ['E','Е','e','ekipa'], ['F','Ф','f','film'],
    ['G','Г','g','grad'], ['H','Х','h','hleb'], ['I','И','i','ime'], ['J','Ј','й','ja'], ['K','К','k','kafa'],
    ['L','Л','l','lepo'], ['Lj','Љ','ль','ljubav'], ['M','М','m','mleko'], ['N','Н','n','noć'], ['Nj','Њ','нь','njegov'],
    ['O','О','o','oko'], ['P','П','p','pas'], ['R','Р','r','riba'], ['S','С','s','soba'], ['Š','Ш','ш','škola'],
    ['T','Т','t','taksi'], ['U','У','u','ulica'], ['V','В','v','voda'], ['Z','З','z','zdravo'], ['Ž','Ж','ж','žena']
  ].map(([lat, cyr, sound, example], i) => ({ id:`l${i}`, lat, cyr, sound, example }));

  const lessons = [
    { id:'alphabet', icon:'Ћ', title:'Азбука и чтение', subtitle:'Латиница ↔ кириллица, звуки Č/Ć/Đ/Lj/Nj', level:'A0', xp:35, tags:['letters'], locked:false },
    { id:'greetings', icon:'👋', title:'Приветствия', subtitle:'Поздороваться, попрощаться, поблагодарить', level:'A1', xp:45, tags:['greeting'], locked:false },
    { id:'basics', icon:'💬', title:'Базовые фразы', subtitle:'Я не понимаю, говорю немного, можно повторить', level:'A1', xp:55, tags:['basic'], locked:false },
    { id:'numbers', icon:'🔢', title:'Числа и цены', subtitle:'0–1000, сколько стоит, чек в кафе', level:'A1', xp:50, tags:['number'], locked:false },
    { id:'food', icon:'☕', title:'Еда и кафе', subtitle:'Заказ, напитки, ресторан, счёт', level:'A1', xp:55, tags:['food'], locked:false },
    { id:'travel', icon:'🧭', title:'Город и поездки', subtitle:'Отель, улица, автобус, направления', level:'A1', xp:60, tags:['travel'], locked:false },
    { id:'home', icon:'🏠', title:'Дом и вещи', subtitle:'Комната, ключи, телефон, мебель', level:'A1', xp:50, tags:['home'], locked:false },
    { id:'verbs', icon:'⚡', title:'Глаголы и мини-фразы', subtitle:'Быть, иметь, идти, хотеть, жить', level:'A1+', xp:70, tags:['verb'], locked:false },
    { id:'cases', icon:'🧠', title:'Первые падежи', subtitle:'u Beogradu, iz Rusije, u prodavnicu', level:'A2', xp:80, tags:['grammar'], locked:false }
  ];

  const vocab = [
    // greetings
    w('zdravo','здраво','привет','greetings','greeting','Zdravo, kako si?','Привет, как ты?'),
    w('ćao','ћао','пока / привет','greetings','greeting','Ćao, vidimo se!','Пока, увидимся!'),
    w('dobro jutro','добро јутро','доброе утро','greetings','greeting','Dobro jutro svima.','Доброе утро всем.'),
    w('dobar dan','добар дан','добрый день','greetings','greeting','Dobar dan, izvolite.','Добрый день, пожалуйста.'),
    w('dobro veče','добро вече','добрый вечер','greetings','greeting','Dobro veče, Ana.','Добрый вечер, Ана.'),
    w('laku noć','лаку ноћ','спокойной ночи','greetings','greeting','Laku noć i lepo spavaj.','Спокойной ночи и хорошо спи.'),
    w('doviđenja','довиђења','до свидания','greetings','greeting','Doviđenja, hvala vam.','До свидания, спасибо вам.'),
    w('hvala','хвала','спасибо','greetings','greeting','Hvala puno.','Большое спасибо.'),
    w('molim','молим','пожалуйста / прошу','greetings','greeting','Kafu, molim.','Кофе, пожалуйста.'),
    w('izvini','извини','извини','greetings','greeting','Izvini, gde je stanica?','Извини, где станция?'),
    w('izvolite','изволите','пожалуйста / вот, возьмите','greetings','greeting','Izvolite račun.','Вот счёт.'),
    w('drago mi je','драго ми је','рад познакомиться','greetings','greeting','Drago mi je, ja sam Efim.','Рад познакомиться, я Ефим.'),

    // basics
    w('kako si?','како си?','как ты?','basics','basic','Kako si danas?','Как ты сегодня?'),
    w('dobro sam','добро сам','я хорошо','basics','basic','Dobro sam, hvala.','Я хорошо, спасибо.'),
    w('ja sam','ја сам','я — / я есть','basics','basic','Ja sam student.','Я студент.'),
    w('ti si','ти си','ты — / ты есть','basics','basic','Ti si moj prijatelj.','Ты мой друг.'),
    w('kako se zoveš?','како се зовеш?','как тебя зовут?','basics','basic','Kako se zoveš?','Как тебя зовут?'),
    w('zovem se','зовем се','меня зовут','basics','basic','Zovem se Efim.','Меня зовут Ефим.'),
    w('ne razumem','не разумем','я не понимаю','basics','basic','Izvini, ne razumem.','Извини, я не понимаю.'),
    w('razumem','разумем','я понимаю','basics','basic','Sada razumem.','Теперь я понимаю.'),
    w('govorim malo srpski','говорим мало српски','я немного говорю по-сербски','basics','basic','Govorim malo srpski.','Я немного говорю по-сербски.'),
    w('možete li ponoviti?','можете ли поновити?','можете повторить?','basics','basic','Možete li ponoviti, molim?','Можете повторить, пожалуйста?'),
    w('šta znači?','шта значи?','что значит?','basics','basic','Šta znači ova reč?','Что значит это слово?'),
    w('gde je?','где је?','где находится?','basics','basic','Gde je toalet?','Где туалет?'),

    // numbers
    w('nula','нула','ноль','numbers','number','Nula problema.','Ноль проблем.'),
    w('jedan','један','один','numbers','number','Jedan čaj, molim.','Один чай, пожалуйста.'),
    w('dva','два','два','numbers','number','Dva hleba.','Два хлеба.'),
    w('tri','три','три','numbers','number','Tri karte.','Три билета.'),
    w('četiri','четири','четыре','numbers','number','Četiri osobe.','Четыре человека.'),
    w('pet','пет','пять','numbers','number','Pet minuta.','Пять минут.'),
    w('šest','шест','шесть','numbers','number','Šest dana.','Шесть дней.'),
    w('sedam','седам','семь','numbers','number','Sedam sati.','Семь часов.'),
    w('osam','осам','восемь','numbers','number','Osam evra.','Восемь евро.'),
    w('devet','девет','девять','numbers','number','Devet dinara.','Девять динаров.'),
    w('deset','десет','десять','numbers','number','Deset pitanja.','Десять вопросов.'),
    w('dvadeset','двадесет','двадцать','numbers','number','Dvadeset minuta.','Двадцать минут.'),
    w('sto','сто','сто','numbers','number','Sto dinara.','Сто динаров.'),
    w('hiljadu','хиљаду','тысяча','numbers','number','Hiljadu dinara.','Тысяча динаров.'),
    w('koliko košta?','колико кошта?','сколько стоит?','numbers','number','Koliko košta karta?','Сколько стоит билет?'),

    // food
    w('voda','вода','вода','food','food','Vodu, molim.','Воду, пожалуйста.'),
    w('kafa','кафа','кофе','food','food','Jedna kafa bez šećera.','Один кофе без сахара.'),
    w('čaj','чај','чай','food','food','Zeleni čaj, molim.','Зелёный чай, пожалуйста.'),
    w('mleko','млеко','молоко','food','food','Kafa sa mlekom.','Кофе с молоком.'),
    w('hleb','хлеб','хлеб','food','food','Svež hleb je ukusan.','Свежий хлеб вкусный.'),
    w('sir','сир','сыр','food','food','Volim sir.','Я люблю сыр.'),
    w('meso','месо','мясо','food','food','Ne jedem meso.','Я не ем мясо.'),
    w('riba','риба','рыба','food','food','Riba je dobra.','Рыба хорошая.'),
    w('supa','супа','суп','food','food','Hoću supu.','Я хочу суп.'),
    w('jabuka','јабука','яблоко','food','food','Jedem jabuku.','Я ем яблоко.'),
    w('restoran','ресторан','ресторан','food','food','Restoran je blizu.','Ресторан рядом.'),
    w('račun','рачун','счёт','food','food','Račun, molim.','Счёт, пожалуйста.'),
    w('ukusno','укусно','вкусно','food','food','Ovo je ukusno.','Это вкусно.'),
    w('gladan sam','гладан сам','я голоден','food','food','Gladan sam, idemo u restoran.','Я голоден, идём в ресторан.'),
    w('žedan sam','жедан сам','я хочу пить','food','food','Žedan sam, hoću vodu.','Я хочу пить, хочу воду.'),

    // travel
    w('autobus','аутобус','автобус','travel','travel','Autobus kasni.','Автобус опаздывает.'),
    w('voz','воз','поезд','travel','travel','Voz ide za Beograd.','Поезд идёт в Белград.'),
    w('aerodrom','аеродром','аэропорт','travel','travel','Aerodrom je daleko.','Аэропорт далеко.'),
    w('stanica','станица','станция / остановка','travel','travel','Gde je stanica?','Где станция?'),
    w('karta','карта','билет / карта','travel','travel','Imam kartu.','У меня есть билет.'),
    w('levo','лево','налево','travel','travel','Idite levo.','Идите налево.'),
    w('desno','десно','направо','travel','travel','Skrenite desno.','Поверните направо.'),
    w('pravo','право','прямо','travel','travel','Samo pravo.','Только прямо.'),
    w('grad','град','город','travel','travel','Beograd je veliki grad.','Белград — большой город.'),
    w('ulica','улица','улица','travel','travel','Ova ulica je lepa.','Эта улица красивая.'),
    w('hotel','хотел','отель','travel','travel','Hotel je ovde.','Отель здесь.'),
    w('taksi','такси','такси','travel','travel','Treba mi taksi.','Мне нужно такси.'),
    w('danas','данас','сегодня','travel','travel','Danas idem u grad.','Сегодня я иду в город.'),
    w('sutra','сутра','завтра','travel','travel','Sutra putujem.','Завтра я путешествую.'),

    // home
    w('kuća','кућа','дом','home','home','Moja kuća je mala.','Мой дом маленький.'),
    w('stan','стан','квартира','home','home','Živim u stanu.','Я живу в квартире.'),
    w('soba','соба','комната','home','home','Ova soba je svetla.','Эта комната светлая.'),
    w('vrata','врата','дверь','home','home','Vrata su otvorena.','Дверь открыта.'),
    w('prozor','прозор','окно','home','home','Prozor je zatvoren.','Окно закрыто.'),
    w('sto','сто','стол','home','home','Telefon je na stolu.','Телефон на столе.'),
    w('stolica','столица','стул','home','home','Ovo je stolica.','Это стул.'),
    w('krevet','кревет','кровать','home','home','Krevet je veliki.','Кровать большая.'),
    w('kupatilo','купатило','ванная','home','home','Gde je kupatilo?','Где ванная?'),
    w('kuhinja','кухиња','кухня','home','home','Kuhinja je mala.','Кухня маленькая.'),
    w('ključ','кључ','ключ','home','home','Gde je ključ?','Где ключ?'),
    w('telefon','телефон','телефон','home','home','Moj telefon je ovde.','Мой телефон здесь.'),
    w('torba','торба','сумка','home','home','Torba je na stolici.','Сумка на стуле.'),

    // verbs
    w('biti','бити','быть','verbs','verb','Hoću biti bolji.','Я хочу быть лучше.'),
    w('imati','имати','иметь','verbs','verb','Imam pitanje.','У меня есть вопрос.'),
    w('hteti','хтети','хотеть','verbs','verb','Hoću vodu.','Я хочу воду.'),
    w('ići','ићи','идти','verbs','verb','Idem kući.','Я иду домой.'),
    w('raditi','радити','работать / делать','verbs','verb','Radim danas.','Я работаю сегодня.'),
    w('učiti','учити','учить / учиться','verbs','verb','Učim srpski.','Я учу сербский.'),
    w('govoriti','говорити','говорить','verbs','verb','Govorim ruski.','Я говорю по-русски.'),
    w('razumeti','разумети','понимать','verbs','verb','Razumem srpski malo.','Я немного понимаю сербский.'),
    w('voleti','волети','любить','verbs','verb','Volim kafu.','Я люблю кофе.'),
    w('jesti','јести','есть / кушать','verbs','verb','Jedem jabuku.','Я ем яблоко.'),
    w('piti','пити','пить','verbs','verb','Pijem vodu.','Я пью воду.'),
    w('živeti','живети','жить','verbs','verb','Živim u Srbiji.','Я живу в Сербии.'),

    // grammar phrases
    w('ja sam iz Rusije','ја сам из Русије','я из России','cases','grammar','Ja sam iz Rusije.','Я из России.'),
    w('živim u Beogradu','живим у Београду','я живу в Белграде','cases','grammar','Živim u Beogradu.','Я живу в Белграде.'),
    w('idem u prodavnicu','идем у продавницу','я иду в магазин','cases','grammar','Idem u prodavnicu.','Я иду в магазин.'),
    w('ovo je moja karta','ово је моја карта','это мой билет / моя карта','cases','grammar','Ovo je moja karta.','Это мой билет.'),
    w('dajte mi vodu','дајте ми воду','дайте мне воду','cases','grammar','Dajte mi vodu, molim.','Дайте мне воду, пожалуйста.'),
    w('pričam sa prijateljem','причам са пријатељем','я разговариваю с другом','cases','grammar','Pričam sa prijateljem.','Я разговариваю с другом.'),
    w('bez šećera','без шећера','без сахара','cases','grammar','Kafa bez šećera.','Кофе без сахара.'),
    w('sa mlekom','са млеком','с молоком','cases','grammar','Kafa sa mlekom.','Кофе с молоком.')
  ];

  const guideCards = [
    {
      title:'1. Два письма: латиница и кириллица',
      body:'В Сербии ты встретишь оба варианта: Serbian Latin и Serbian Cyrillic. Для старта удобнее учить пары букв одновременно: Č = Ч, Ć = Ћ, Đ = Ђ, Lj = Љ, Nj = Њ, Dž = Џ.',
      points:['Принцип простой: обычно «пишется как слышится».','В приложении можно переключать режим Latin/Ћирилица сверху.','Для iPhone лучше добавить клавиатуру Serbian или Croatian ради č, ć, š, ž, đ.']
    },
    {
      title:'2. Произношение без боли',
      body:'Сербский для русскоязычного довольно логичен, но есть опасные пары: č/ć, dž/đ, lj/nj. В каждом слове нажимай 🔊 и повторяй вслух.',
      points:['č — ближе к русскому «ч».','ć — мягче, между «ть» и «ч».','đ — мягче, чем dž; lj и nj произносятся слитно.']
    },
    {
      title:'3. Мини-грамматика A1',
      body:'Для первых разговоров хватит связок: Ja sam, Ti si, Imam, Hoću, Idem, Živim. Порядок слов гибкий, но простая схема Subject + verb + object работает почти всегда.',
      points:['Ja sam student — Я студент.','Imam pitanje — У меня есть вопрос.','Hoću vodu — Я хочу воду.','Idem u grad — Я иду в город.']
    },
    {
      title:'4. Падежи: только самое нужное',
      body:'Падежи не нужно зубрить сразу. Начни с готовых шаблонов: из страны, в городе, в направление, с кем-то, без чего-то.',
      points:['iz Rusije — из России.','u Beogradu — в Белграде.','u prodavnicu — в магазин.','sa prijateljem — с другом.','bez šećera — без сахара.']
    }
  ];

  const defaultState = {
    xp: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    lastStudy: '',
    completed: {},
    reviews: {},
    script: 'latin',
    theme: 'dark',
    route: 'home',
    dailyGoal: 50,
    history: []
  };

  let state = loadState();
  let session = null;
  let currentCardIndex = 0;
  let currentCardSide = 'front';
  let selectedTag = 'all';

  function w(sr, cy, ru, lesson, tag, example, exampleRu) {
    return { id: `${lesson}-${sr.replace(/\s+/g,'-').replace(/[^\p{L}\p{N}-]+/gu,'')}`, sr, cy, ru, lesson, tag, example, exampleRu };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...defaultState, ...parsed, completed: parsed?.completed || {}, reviews: parsed?.reviews || {}, history: parsed?.history || [] };
    } catch {
      return { ...defaultState };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    applyTheme();
  }

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function updateStreak() {
    const today = todayKey();
    if (state.lastStudy === today) return;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = `${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,'0')}-${String(y.getDate()).padStart(2,'0')}`;
    state.streak = state.lastStudy === yesterday ? state.streak + 1 : 1;
    state.lastStudy = today;
  }

  function addHistory(text, xp = 0) {
    state.history = [{ date: new Date().toLocaleString('ru-RU'), text, xp }, ...(state.history || [])].slice(0, 20);
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    document.body.dataset.theme = state.theme;
    $('#themeToggle').textContent = state.theme === 'dark' ? '☀︎' : '☾';
    $('#scriptToggle').textContent = state.script === 'latin' ? 'Latin' : 'Ћир';
  }

  function setRoute(route) {
    state.route = route;
    saveState();
    $$('.bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.route === route));
    if (route === 'home') renderHome();
    if (route === 'cards') renderCards();
    if (route === 'guide') renderGuide();
    if (route === 'profile') renderProfile();
  }

  function displaySr(itemOrText) {
    const text = typeof itemOrText === 'string' ? itemOrText : itemOrText.sr;
    if (state.script === 'cyrillic') return typeof itemOrText === 'object' && itemOrText.cy ? itemOrText.cy : toCyrillic(text);
    return text;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function sample(arr, n) {
    return shuffle(arr).slice(0, n);
  }

  function escapeHtml(str='') {
    return String(str).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }

  function normalize(str='') {
    return str.toString().trim().toLowerCase()
      .replace(/[.,!?;:]/g,'')
      .replace(/\s+/g,' ')
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/đ/g,'dj')
      .replace(/ћ/g,'c').replace(/ч/g,'c').replace(/ђ/g,'dj').replace(/ш/g,'s').replace(/ж/g,'z')
      .replace(/љ/g,'lj').replace(/њ/g,'nj').replace(/џ/g,'dz')
      .replace(/[ј]/g,'j').replace(/[а]/g,'a').replace(/[б]/g,'b').replace(/[в]/g,'v').replace(/[г]/g,'g').replace(/[д]/g,'d')
      .replace(/[е]/g,'e').replace(/[з]/g,'z').replace(/[и]/g,'i').replace(/[к]/g,'k').replace(/[л]/g,'l').replace(/[м]/g,'m')
      .replace(/[н]/g,'n').replace(/[о]/g,'o').replace(/[п]/g,'p').replace(/[р]/g,'r').replace(/[с]/g,'s').replace(/[т]/g,'t')
      .replace(/[у]/g,'u').replace(/[ф]/g,'f').replace(/[х]/g,'h').replace(/[ц]/g,'c');
  }

  function toCyrillic(text='') {
    const pairs = [
      ['DŽ','Џ'], ['Dž','Џ'], ['dž','џ'], ['LJ','Љ'], ['Lj','Љ'], ['lj','љ'], ['NJ','Њ'], ['Nj','Њ'], ['nj','њ'],
      ['A','А'], ['B','Б'], ['C','Ц'], ['Č','Ч'], ['Ć','Ћ'], ['D','Д'], ['Đ','Ђ'], ['E','Е'], ['F','Ф'], ['G','Г'], ['H','Х'],
      ['I','И'], ['J','Ј'], ['K','К'], ['L','Л'], ['M','М'], ['N','Н'], ['O','О'], ['P','П'], ['R','Р'], ['S','С'], ['Š','Ш'],
      ['T','Т'], ['U','У'], ['V','В'], ['Z','З'], ['Ž','Ж'], ['a','а'], ['b','б'], ['c','ц'], ['č','ч'], ['ć','ћ'], ['d','д'], ['đ','ђ'],
      ['e','е'], ['f','ф'], ['g','г'], ['h','х'], ['i','и'], ['j','ј'], ['k','к'], ['l','л'], ['m','м'], ['n','н'], ['o','о'], ['p','п'],
      ['r','р'], ['s','с'], ['š','ш'], ['t','т'], ['u','у'], ['v','в'], ['z','з'], ['ž','ж']
    ];
    return pairs.reduce((acc, [lat, cyr]) => acc.replaceAll(lat, cyr), text);
  }

  function completionOf(lessonId) {
    return Math.min(100, state.completed[lessonId] || 0);
  }

  function totalCompleted() {
    const values = lessons.map(l => completionOf(l.id));
    return Math.round(values.reduce((a,b)=>a+b,0) / values.length);
  }

  function renderHome() {
    session = null;
    const progress = totalCompleted();
    const recommended = lessons.find(l => completionOf(l.id) < 100) || lessons[0];
    app.innerHTML = `
      <section class="hero">
        <div class="panel">
          <span class="kicker">🇷🇸 A0 → A2 • без регистрации</span>
          <h1>Сербский как мини-игра на каждый день</h1>
          <p>Карточки, угадывания слов, кириллица, набор фраз, аудио-повторение и прогресс сохраняются прямо в браузере. Всё работает локально на GitHub Pages.</p>
          <div class="hero-actions">
            <button class="btn primary" data-start="${recommended.id}">Продолжить: ${escapeHtml(recommended.title)}</button>
            <button class="btn" data-route="cards">Повторить карточки</button>
            <button class="btn" data-daily>Ежедневная тренировка</button>
          </div>
          <div class="stats-grid">
            <div class="stat-card"><span>XP</span><strong>${state.xp}</strong></div>
            <div class="stat-card"><span>Серия</span><strong>${state.streak}🔥</strong></div>
            <div class="stat-card"><span>Курс</span><strong>${progress}%</strong></div>
          </div>
        </div>
        <div class="panel">
          <span class="kicker">Быстрый старт</span>
          <h2>Сегодняшняя цель</h2>
          <p>Набери <b>${state.dailyGoal} XP</b>: один урок + несколько карточек. Начинай с латиницы, но постепенно включай кириллицу кнопкой сверху.</p>
          <div class="progress-bar" aria-label="Цель дня"><i style="width:${Math.min(100, Math.round((dailyXp()/state.dailyGoal)*100))}%"></i></div>
          <div class="hero-actions">
            <button class="btn small" data-start="alphabet">Азбука</button>
            <button class="btn small" data-start="greetings">Приветствия</button>
            <button class="btn small" data-start="travel">Путешествия</button>
          </div>
        </div>
      </section>
      <div class="section-title">
        <div><h2>Путь обучения</h2><p>Уроки короткие: выбор ответа, прослушивание, набор, пары, сбор фразы.</p></div>
        <span class="badge">${vocab.length} слов и фраз</span>
      </div>
      <section class="path">
        ${lessons.map(lessonCard).join('')}
      </section>
    `;
  }

  function dailyXp() {
    const today = todayKey();
    return (state.history || []).filter(h => h.date.includes(today.split('-').reverse().join('.')) || h.date.includes(today)).reduce((sum, h) => sum + (h.xp || 0), 0);
  }

  function lessonCard(lesson) {
    const pct = completionOf(lesson.id);
    const count = lesson.id === 'alphabet' ? alphabet.length : vocab.filter(v => v.lesson === lesson.id).length;
    return `
      <article class="lesson-card ${lesson.locked ? 'locked' : ''}">
        <div>
          <div class="lesson-top">
            <div class="lesson-icon">${lesson.icon}</div>
            <div>
              <h3>${escapeHtml(lesson.title)}</h3>
              <p>${escapeHtml(lesson.subtitle)}</p>
            </div>
          </div>
          <div class="lesson-meta">
            <span class="badge">${lesson.level}</span>
            <span class="badge">${count} элементов</span>
            <span class="badge">+${lesson.xp} XP</span>
          </div>
          <div class="progress-bar"><i style="width:${pct}%"></i></div>
        </div>
        <button class="btn primary full" data-start="${lesson.id}">${pct >= 100 ? 'Повторить' : 'Начать'}</button>
      </article>
    `;
  }

  function startLesson(lessonId, daily = false) {
    const lesson = lessons.find(l => l.id === lessonId) || lessons[0];
    const exercises = daily ? buildDailyExercises() : buildExercises(lesson);
    session = { lesson, exercises, index:0, score:0, wrong:0, daily, answered:false, pairSelected:null, pairDone:[], assembled:[] };
    renderExercise();
  }

  function buildDailyExercises() {
    const items = sample(vocab, 12);
    const ex = [];
    items.slice(0,3).forEach(item => ex.push(makeMcq(item, 'ru-to-sr')));
    items.slice(3,5).forEach(item => ex.push(makeListen(item)));
    items.slice(5,7).forEach(item => ex.push(makeType(item)));
    ex.push(makePair(sample(items,4)));
    items.slice(7,10).forEach(item => ex.push(makeScramble(item)));
    return shuffle(ex).slice(0,10);
  }

  function buildExercises(lesson) {
    if (lesson.id === 'alphabet') return buildAlphabetExercises();
    const words = vocab.filter(v => v.lesson === lesson.id);
    const chosen = sample(words, Math.min(10, words.length));
    const exercises = [];
    chosen.slice(0,2).forEach(item => exercises.push(makeFlash(item)));
    chosen.slice(2,5).forEach((item, i) => exercises.push(makeMcq(item, i % 2 ? 'sr-to-ru' : 'ru-to-sr')));
    if (chosen[5]) exercises.push(makeListen(chosen[5]));
    if (chosen[6]) exercises.push(makeType(chosen[6]));
    exercises.push(makePair(sample(words, Math.min(4, words.length))));
    chosen.slice(7,10).forEach(item => exercises.push(makeScramble(item)));
    return exercises;
  }

  function buildAlphabetExercises() {
    const letters = sample(alphabet, 14);
    const ex = [];
    letters.slice(0,4).forEach(letter => ex.push({ type:'letter', letter, direction:'lat-cyr' }));
    letters.slice(4,8).forEach(letter => ex.push({ type:'letter', letter, direction:'cyr-lat' }));
    letters.slice(8,10).forEach(letter => ex.push({ type:'letterSound', letter }));
    vocab.filter(v => ['greetings','basics'].includes(v.lesson)).slice(0,4).forEach(item => ex.push(makeType(item)));
    ex.push({ type:'alphabetTable' });
    return shuffle(ex);
  }

  function makeMcq(item, direction='ru-to-sr') {
    const pool = vocab.filter(v => v.lesson === item.lesson && v.id !== item.id);
    const wrongs = sample(pool.length >= 3 ? pool : vocab.filter(v => v.id !== item.id), 3);
    if (direction === 'ru-to-sr') {
      return { type:'mcq', item, prompt:`Как по-сербски: «${item.ru}»?`, answer:displaySr(item), options:shuffle([item, ...wrongs].map(displaySr)) };
    }
    return { type:'mcq', item, prompt:`Что значит «${displaySr(item)}»?`, answer:item.ru, options:shuffle([item.ru, ...wrongs.map(w => w.ru)]) };
  }

  function makeListen(item) {
    const pool = vocab.filter(v => v.lesson === item.lesson && v.id !== item.id);
    const wrongs = sample(pool.length >= 3 ? pool : vocab.filter(v => v.id !== item.id), 3);
    return { type:'listen', item, prompt:'Прослушай и выбери перевод', answer:item.ru, options:shuffle([item.ru, ...wrongs.map(w => w.ru)]) };
  }

  function makeType(item) {
    return { type:'type', item, prompt:`Напиши по-сербски: «${item.ru}»`, answers:[item.sr, item.cy] };
  }

  function makeFlash(item) {
    return { type:'flash', item, flipped:false };
  }

  function makePair(items) {
    return { type:'pair', items:items.map(item => ({ id:item.id, left:displaySr(item), right:item.ru, sr:item.sr })) };
  }

  function makeScramble(item) {
    const tokens = displaySr(item).split(' ');
    if (tokens.length < 2) return makeMcq(item, 'sr-to-ru');
    return { type:'scramble', item, prompt:`Собери фразу: «${item.ru}»`, tokens:shuffle(tokens), answer:displaySr(item) };
  }

  function renderExercise() {
    if (!session) return setRoute('home');
    const ex = session.exercises[session.index];
    const progress = Math.round((session.index / session.exercises.length) * 100);
    session.answered = false;
    session.pairSelected = null;
    session.pairDone = [];
    session.assembled = [];
    app.innerHTML = `
      <section class="exercise-wrap">
        <div class="lesson-header">
          <button class="btn small" data-route="home">← Уроки</button>
          <div style="flex:1">
            <div class="progress-bar"><i style="width:${progress}%"></i></div>
          </div>
          <span class="exercise-count">${session.index + 1}/${session.exercises.length}</span>
        </div>
        <article class="exercise-card" id="exerciseCard">
          ${renderExerciseBody(ex)}
          <div id="feedback" class="feedback"></div>
        </article>
      </section>
    `;
    if (ex.type === 'listen') setTimeout(() => speak(ex.item.sr), 250);
  }

  function renderExerciseBody(ex) {
    if (ex.type === 'flash') {
      return `
        <span class="kicker">Карточка</span>
        <div class="flash-stage">
          <button class="flash-card" data-flip type="button">
            <div>
              <div class="flash-word">${escapeHtml(displaySr(ex.item))}</div>
              <div class="flash-sub">${ex.flipped ? escapeHtml(ex.item.ru) : 'Нажми, чтобы перевернуть'}</div>
              ${ex.flipped ? `<p>${escapeHtml(ex.item.example)}<br>${escapeHtml(ex.item.exampleRu)}</p>` : ''}
            </div>
          </button>
        </div>
        <div class="sound-row">
          <button class="btn" data-speak="${escapeHtml(ex.item.sr)}">🔊 Обычная скорость</button>
          <button class="btn" data-speak-slow="${escapeHtml(ex.item.sr)}">🐢 Медленно</button>
        </div>
        <div class="hero-actions">
          <button class="btn" data-card-hard>Повторить позже</button>
          <button class="btn primary" data-card-known>Знаю</button>
        </div>
      `;
    }

    if (ex.type === 'mcq' || ex.type === 'listen') {
      return `
        <span class="kicker">${ex.type === 'listen' ? 'Аудирование' : 'Выбор ответа'}</span>
        <div class="prompt">${escapeHtml(ex.prompt)}${ex.type === 'listen' ? '<small>Нажми 🔊, если звук не включился автоматически.</small>' : ''}</div>
        ${ex.type === 'listen' ? `<button class="big-sound" data-speak="${escapeHtml(ex.item.sr)}" aria-label="Прослушать">🔊</button>` : ''}
        <div class="options">
          ${ex.options.map(opt => `<button class="option" data-option="${escapeHtml(opt)}"><span>${escapeHtml(opt)}</span><span>›</span></button>`).join('')}
        </div>
      `;
    }

    if (ex.type === 'type') {
      return `
        <span class="kicker">Набор слова</span>
        <div class="prompt">${escapeHtml(ex.prompt)}<small>Можно писать латиницей или кириллицей. Диакритика: č ć š ž đ.</small></div>
        <div class="sound-row">
          <button class="btn" data-speak="${escapeHtml(ex.item.sr)}">🔊 Послушать</button>
          <button class="btn" data-hint>Показать пример</button>
        </div>
        <div class="input-line">
          <input class="text-answer" id="typeInput" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Например: ${escapeHtml(ex.item.sr)}" />
          <button class="btn primary" data-check-type>Проверить</button>
        </div>
        <div class="keyboard">
          ${['č','ć','š','ž','đ','Č','Ć','Š','Ž','Đ'].map(ch => `<button class="key" data-insert="${ch}">${ch}</button>`).join('')}
        </div>
      `;
    }

    if (ex.type === 'pair') {
      const left = shuffle(ex.items);
      const right = shuffle(ex.items);
      return `
        <span class="kicker">Пары</span>
        <div class="prompt">Соедини сербское слово с переводом</div>
        <div class="match-grid">
          <div class="match-col">${left.map(p => `<button class="match-btn" data-side="left" data-id="${p.id}" data-sr="${escapeHtml(p.sr)}">${escapeHtml(p.left)}</button>`).join('')}</div>
          <div class="match-col">${right.map(p => `<button class="match-btn" data-side="right" data-id="${p.id}">${escapeHtml(p.right)}</button>`).join('')}</div>
        </div>
      `;
    }

    if (ex.type === 'scramble') {
      return `
        <span class="kicker">Сбор фразы</span>
        <div class="prompt">${escapeHtml(ex.prompt)}</div>
        <div class="scramble-answer" id="scrambleAnswer"><span class="muted">Твой ответ появится здесь…</span></div>
        <div class="scramble-bank">
          ${ex.tokens.map((t,i)=>`<button class="token" data-token-index="${i}" data-token="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('')}
        </div>
        <div class="hero-actions">
          <button class="btn" data-scramble-reset>Сбросить</button>
          <button class="btn primary" data-scramble-check>Проверить</button>
        </div>
      `;
    }

    if (ex.type === 'letter') {
      const opts = sample(alphabet.filter(a => a.id !== ex.letter.id), 3);
      const options = shuffle([ex.letter, ...opts]);
      const prompt = ex.direction === 'lat-cyr' ? `Какая кириллическая буква у «${ex.letter.lat}»?` : `Какая латинская буква у «${ex.letter.cyr}»?`;
      const answer = ex.direction === 'lat-cyr' ? ex.letter.cyr : ex.letter.lat;
      ex.answer = answer;
      return `
        <span class="kicker">Азбука</span>
        <div class="prompt">${prompt}<small>Пример: ${escapeHtml(ex.letter.example)}</small></div>
        <div class="options">
          ${options.map(o => {
            const opt = ex.direction === 'lat-cyr' ? o.cyr : o.lat;
            return `<button class="option" data-option="${escapeHtml(opt)}"><span>${escapeHtml(opt)}</span><span>${escapeHtml(o.sound)}</span></button>`;
          }).join('')}
        </div>
      `;
    }

    if (ex.type === 'letterSound') {
      ex.answer = ex.letter.example;
      const opts = sample(alphabet.filter(a => a.id !== ex.letter.id), 3).map(l => l.example);
      return `
        <span class="kicker">Звук буквы</span>
        <div class="prompt">В каком слове есть буква «${ex.letter.lat}/${ex.letter.cyr}»?<small>Звук: ${escapeHtml(ex.letter.sound)}</small></div>
        <div class="options">
          ${shuffle([ex.letter.example, ...opts]).map(opt => `<button class="option" data-option="${escapeHtml(opt)}"><span>${escapeHtml(opt)}</span><span>›</span></button>`).join('')}
        </div>
      `;
    }

    if (ex.type === 'alphabetTable') {
      return `
        <span class="kicker">Шпаргалка</span>
        <div class="prompt">Сербская азбука: 30 букв</div>
        <div class="table-wrap">
          <table><thead><tr><th>Latin</th><th>Ћирилица</th><th>Звук</th><th>Пример</th></tr></thead><tbody>
          ${alphabet.map(a => `<tr><td><b>${a.lat}</b></td><td><b>${a.cyr}</b></td><td>${escapeHtml(a.sound)}</td><td>${escapeHtml(a.example)}</td></tr>`).join('')}
          </tbody></table>
        </div>
        <div class="hero-actions"><button class="btn primary" data-next>Дальше</button></div>
      `;
    }
    return '';
  }

  function showFeedback(ok, text) {
    const fb = $('#feedback');
    fb.className = `feedback show ${ok ? 'good' : 'bad'}`;
    fb.innerHTML = `${ok ? '✅' : '❌'} ${escapeHtml(text)} <div class="hero-actions"><button class="btn primary" data-next>${ok ? 'Дальше' : 'Продолжить'}</button></div>`;
  }

  function markAnswer(ok) {
    if (session.answered) return;
    session.answered = true;
    if (ok) { session.score++; state.correct++; }
    else { session.wrong++; state.wrong++; }
    saveState();
  }

  function nextExercise() {
    if (!session) return;
    session.index++;
    if (session.index >= session.exercises.length) return finishLesson();
    renderExercise();
  }

  function finishLesson() {
    const lesson = session.lesson;
    const scorePct = Math.round((session.score / session.exercises.length) * 100);
    const earned = Math.max(10, Math.round((lesson.xp || 50) * (scorePct / 100)));
    state.xp += earned;
    updateStreak();
    if (!session.daily) state.completed[lesson.id] = Math.max(completionOf(lesson.id), scorePct >= 70 ? 100 : Math.max(35, scorePct));
    addHistory(`${session.daily ? 'Ежедневная тренировка' : lesson.title}: ${scorePct}%`, earned);
    saveState();
    confetti();
    app.innerHTML = `
      <section class="exercise-wrap">
        <article class="exercise-card" style="text-align:center">
          <span class="kicker">Урок завершён</span>
          <h1>${scorePct >= 70 ? 'Odlično!' : 'Повторим ещё раз'}</h1>
          <p>Результат: <b>${session.score}/${session.exercises.length}</b>. Получено <b>+${earned} XP</b>. Ошибки — это нормально: сербские č/ć/đ требуют тренировки.</p>
          <div class="stats-grid">
            <div class="stat-card"><span>Точность</span><strong>${scorePct}%</strong></div>
            <div class="stat-card"><span>Серия</span><strong>${state.streak}🔥</strong></div>
            <div class="stat-card"><span>Всего XP</span><strong>${state.xp}</strong></div>
          </div>
          <div class="hero-actions" style="justify-content:center">
            <button class="btn primary" data-route="home">К урокам</button>
            <button class="btn" data-start="${lesson.id}">Повторить урок</button>
            <button class="btn" data-route="cards">Карточки</button>
          </div>
        </article>
      </section>
    `;
    session = null;
  }

  function renderCards() {
    const tags = ['all', ...new Set(vocab.map(v => v.lesson))];
    const cards = selectedTag === 'all' ? vocab : vocab.filter(v => v.lesson === selectedTag);
    if (currentCardIndex >= cards.length) currentCardIndex = 0;
    const card = cards[currentCardIndex] || vocab[0];
    app.innerHTML = `
      <section class="panel">
        <span class="kicker">Карточки для запоминания</span>
        <h1>Повторяй, слушай, отмечай сложное</h1>
        <p>Карточки сохраняют отметки «знаю/сложно» в браузере. Для интервального повторения чаще открывай раздел «сложно» в профиле.</p>
        <div class="cards-toolbar">
          <div class="hero-actions">
            ${tags.map(tag => `<button class="btn small ${selectedTag === tag ? 'primary' : ''}" data-tag="${tag}">${tag === 'all' ? 'Все' : escapeHtml(lessons.find(l=>l.id===tag)?.title || tag)}</button>`).join('')}
          </div>
          <span class="badge">${currentCardIndex + 1}/${cards.length}</span>
        </div>
        <div class="flash-stage">
          <button class="flash-card" data-card-flip type="button">
            <div>
              <div class="flash-word">${escapeHtml(currentCardSide === 'front' ? displaySr(card) : card.ru)}</div>
              <div class="flash-sub">${currentCardSide === 'front' ? 'Нажми, чтобы увидеть перевод' : displaySr(card)}</div>
              <p>${escapeHtml(card.example)}<br>${escapeHtml(card.exampleRu)}</p>
            </div>
          </button>
        </div>
        <div class="hero-actions" style="justify-content:center">
          <button class="btn" data-speak="${escapeHtml(card.sr)}">🔊 Слушать</button>
          <button class="btn" data-review="hard" data-card-id="${card.id}">Сложно</button>
          <button class="btn primary" data-review="known" data-card-id="${card.id}">Знаю</button>
          <button class="btn" data-card-next>Следующая</button>
        </div>
      </section>
      <div class="section-title"><h2>Словарь</h2><span class="badge">${cards.length} карточек</span></div>
      <section class="word-grid">
        ${cards.map(item => `
          <article class="word-card">
            <b>${escapeHtml(displaySr(item))}</b>
            <small>${escapeHtml(item.ru)}</small>
            <small>${escapeHtml(item.example)}</small>
            <div class="actions"><button class="btn small" data-speak="${escapeHtml(item.sr)}">🔊</button><button class="btn small" data-open-card="${item.id}">Открыть</button></div>
          </article>
        `).join('')}
      </section>
    `;
  }

  function renderGuide() {
    app.innerHTML = `
      <section class="panel">
        <span class="kicker">Мини-учебник</span>
        <h1>Сначала фразы, потом грамматика</h1>
        <p>Это не академический курс, а компактный самоучитель: выучить частые фразы, привыкнуть к звучанию и не бояться кириллицы.</p>
      </section>
      <div class="section-title"><h2>Шпаргалки</h2><span class="badge">A0–A2</span></div>
      <section class="guide-grid">
        ${guideCards.map(card => `
          <article class="guide-card">
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.body)}</p>
            <ul>${card.points.map(p=>`<li>${escapeHtml(p)}</li>`).join('')}</ul>
          </article>
        `).join('')}
      </section>
      <div class="section-title"><h2>Азбука</h2><button class="btn small" data-start="alphabet">Тренировать</button></div>
      <div class="table-wrap"><table><thead><tr><th>Latin</th><th>Ћирилица</th><th>Звук</th><th>Пример</th></tr></thead><tbody>
        ${alphabet.map(a => `<tr><td><b>${a.lat}</b></td><td><b>${a.cyr}</b></td><td>${escapeHtml(a.sound)}</td><td>${escapeHtml(a.example)}</td></tr>`).join('')}
      </tbody></table></div>
    `;
  }

  function renderProfile() {
    const hard = Object.entries(state.reviews || {}).filter(([,v]) => v === 'hard').length;
    const known = Object.entries(state.reviews || {}).filter(([,v]) => v === 'known').length;
    app.innerHTML = `
      <section class="panel">
        <span class="kicker">Твой прогресс</span>
        <h1>${state.streak ? `${state.streak} дней серии 🔥` : 'Начни серию сегодня'}</h1>
        <p>Данные лежат в localStorage конкретного браузера. Для GitHub Pages не нужен сервер и база данных.</p>
        <div class="profile-grid">
          <div class="profile-block"><span class="muted">Всего XP</span><strong>${state.xp}</strong></div>
          <div class="profile-block"><span class="muted">Верно</span><strong>${state.correct}</strong></div>
          <div class="profile-block"><span class="muted">Сложных карточек</span><strong>${hard}</strong></div>
          <div class="profile-block"><span class="muted">Знаю</span><strong>${known}</strong></div>
        </div>
        <div class="hero-actions">
          <button class="btn primary" data-daily>Ежедневная тренировка</button>
          <button class="btn" data-route="cards">Повторить карточки</button>
          <button class="btn danger" data-reset-progress>Сбросить прогресс</button>
        </div>
      </section>
      <div class="section-title"><h2>История</h2><span class="badge">последние 20 действий</span></div>
      <div class="timeline">
        ${(state.history || []).length ? state.history.map(h => `<div class="timeline-item"><div class="timeline-dot">+${h.xp || 0}</div><div><b>${escapeHtml(h.text)}</b><br><span class="muted">${escapeHtml(h.date)}</span></div></div>`).join('') : '<div class="empty">Истории пока нет. Пройди первый урок.</div>'}
      </div>
    `;
  }

  function speak(text, slow = false) {
    if (!('speechSynthesis' in window)) {
      alert('В этом браузере нет Web Speech API. На iPhone открой сайт в Safari.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sr-RS';
    utterance.rate = slow ? 0.68 : 0.92;
    utterance.pitch = 1;
    const voices = speechSynthesis.getVoices();
    const srVoice = voices.find(v => /sr|serbian/i.test(v.lang + ' ' + v.name));
    if (srVoice) utterance.voice = srVoice;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  function insertAtCursor(input, text) {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.value = input.value.slice(0, start) + text + input.value.slice(end);
    input.focus();
    input.setSelectionRange(start + text.length, start + text.length);
  }

  function confetti() {
    const wrap = document.createElement('div');
    wrap.className = 'confetti';
    for (let i = 0; i < 50; i++) {
      const p = document.createElement('i');
      p.style.left = `${Math.random()*100}%`;
      p.style.animationDelay = `${Math.random()*0.25}s`;
      p.style.background = ['#58cc02','#20c997','#ffc857','#ff5c7a','#6dd5fa'][i % 5];
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 1600);
  }

  app.addEventListener('click', event => {
    const target = event.target.closest('button,a');
    if (!target) return;

    if (target.dataset.route) return setRoute(target.dataset.route);
    if (target.dataset.start) return startLesson(target.dataset.start);
    if (target.dataset.daily !== undefined) return startLesson('daily', true);
    if (target.dataset.speak) return speak(target.dataset.speak);
    if (target.dataset.speakSlow) return speak(target.dataset.speakSlow, true);
    if (target.dataset.next !== undefined) return nextExercise();

    if (target.dataset.flip !== undefined && session) {
      const ex = session.exercises[session.index];
      ex.flipped = !ex.flipped;
      $('#exerciseCard').innerHTML = `${renderExerciseBody(ex)}<div id="feedback" class="feedback"></div>`;
      return;
    }

    if (target.dataset.cardKnown !== undefined && session) {
      const ex = session.exercises[session.index];
      state.reviews[ex.item.id] = 'known';
      markAnswer(true);
      showFeedback(true, `${displaySr(ex.item)} — ${ex.item.ru}`);
      saveState();
      return;
    }

    if (target.dataset.cardHard !== undefined && session) {
      const ex = session.exercises[session.index];
      state.reviews[ex.item.id] = 'hard';
      markAnswer(false);
      showFeedback(false, `Запомни: ${displaySr(ex.item)} — ${ex.item.ru}`);
      saveState();
      return;
    }

    if (target.dataset.option && session) {
      const ex = session.exercises[session.index];
      const ok = normalize(target.dataset.option) === normalize(ex.answer || '');
      $$('.option').forEach(btn => {
        if (normalize(btn.dataset.option) === normalize(ex.answer || '')) btn.classList.add('correct');
        if (btn === target && !ok) btn.classList.add('wrong');
      });
      markAnswer(ok);
      const explanation = ex.item ? `${displaySr(ex.item)} — ${ex.item.ru}` : `Ответ: ${ex.answer}`;
      showFeedback(ok, ok ? explanation : `Правильно: ${explanation}`);
      return;
    }

    if (target.dataset.checkType !== undefined && session) {
      const ex = session.exercises[session.index];
      const input = $('#typeInput');
      const user = input?.value || '';
      const ok = ex.answers.some(ans => normalize(ans) === normalize(user));
      markAnswer(ok);
      showFeedback(ok, ok ? `${displaySr(ex.item)} — ${ex.item.ru}` : `Правильно: ${displaySr(ex.item)} / ${ex.item.sr}`);
      return;
    }

    if (target.dataset.insert) {
      const input = $('#typeInput');
      if (input) insertAtCursor(input, target.dataset.insert);
      return;
    }

    if (target.dataset.hint !== undefined && session) {
      const ex = session.exercises[session.index];
      showFeedback(false, `Подсказка: ${displaySr(ex.item)} — ${ex.item.example}`);
      return;
    }

    if (target.dataset.side && session) {
      const id = target.dataset.id;
      const side = target.dataset.side;
      if (target.classList.contains('done')) return;
      $$('.match-btn').filter(b => b.dataset.side === side).forEach(b => b.classList.remove('selected'));
      target.classList.add('selected');
      if (!session.pairSelected || session.pairSelected.side === side) {
        session.pairSelected = { id, side, el:target };
        if (target.dataset.sr) speak(target.dataset.sr);
        return;
      }
      const ok = session.pairSelected.id === id;
      if (ok) {
        target.classList.add('done');
        session.pairSelected.el.classList.add('done');
        session.pairDone.push(id);
        if (session.pairDone.length >= session.exercises[session.index].items.length) {
          markAnswer(true);
          showFeedback(true, 'Все пары собраны правильно.');
        }
      } else {
        session.wrong++;
        [target, session.pairSelected.el].forEach(el => {
          el.classList.add('wrong');
          setTimeout(() => el.classList.remove('wrong','selected'), 450);
        });
      }
      session.pairSelected = null;
      return;
    }

    if (target.dataset.tokenIndex !== undefined && session) {
      if (target.classList.contains('used')) return;
      target.classList.add('used');
      session.assembled.push(target.dataset.token);
      renderScrambleAnswer();
      return;
    }

    if (target.dataset.scrambleReset !== undefined && session) {
      session.assembled = [];
      $$('.token').forEach(t => t.classList.remove('used'));
      renderScrambleAnswer();
      return;
    }

    if (target.dataset.scrambleCheck !== undefined && session) {
      const ex = session.exercises[session.index];
      const user = session.assembled.join(' ');
      const ok = normalize(user) === normalize(ex.answer);
      markAnswer(ok);
      showFeedback(ok, ok ? `${ex.answer} — ${ex.item.ru}` : `Правильно: ${ex.answer}`);
      return;
    }

    if (target.dataset.tag) {
      selectedTag = target.dataset.tag;
      currentCardIndex = 0;
      currentCardSide = 'front';
      renderCards();
      return;
    }

    if (target.dataset.cardFlip !== undefined) {
      currentCardSide = currentCardSide === 'front' ? 'back' : 'front';
      renderCards();
      return;
    }

    if (target.dataset.cardNext !== undefined) {
      const cards = selectedTag === 'all' ? vocab : vocab.filter(v => v.lesson === selectedTag);
      currentCardIndex = (currentCardIndex + 1) % cards.length;
      currentCardSide = 'front';
      renderCards();
      return;
    }

    if (target.dataset.openCard) {
      const cards = selectedTag === 'all' ? vocab : vocab.filter(v => v.lesson === selectedTag);
      const idx = cards.findIndex(c => c.id === target.dataset.openCard);
      if (idx >= 0) currentCardIndex = idx;
      currentCardSide = 'front';
      window.scrollTo({ top:0, behavior:'smooth' });
      renderCards();
      return;
    }

    if (target.dataset.review) {
      state.reviews[target.dataset.cardId] = target.dataset.review;
      if (target.dataset.review === 'known') { state.xp += 2; state.correct++; addHistory('Карточка отмечена как известная', 2); }
      else { addHistory('Карточка отправлена на повторение', 0); }
      updateStreak();
      saveState();
      const cards = selectedTag === 'all' ? vocab : vocab.filter(v => v.lesson === selectedTag);
      currentCardIndex = (currentCardIndex + 1) % cards.length;
      currentCardSide = 'front';
      renderCards();
      return;
    }

    if (target.dataset.resetProgress !== undefined) {
      const ok = confirm('Сбросить весь прогресс Srbingo на этом устройстве?');
      if (!ok) return;
      localStorage.removeItem(STORAGE_KEY);
      state = { ...defaultState };
      saveState();
      setRoute('profile');
    }
  });

  function renderScrambleAnswer() {
    const box = $('#scrambleAnswer');
    if (!box) return;
    box.innerHTML = session.assembled.length ? session.assembled.map(t => `<span class="token">${escapeHtml(t)}</span>`).join('') : '<span class="muted">Твой ответ появится здесь…</span>';
  }

  app.addEventListener('keydown', event => {
    if (event.key === 'Enter' && $('#typeInput') && session) {
      $('[data-check-type]')?.click();
    }
  });

  document.body.addEventListener('click', event => {
    const routeBtn = event.target.closest('[data-route]');
    if (routeBtn && !app.contains(routeBtn)) setRoute(routeBtn.dataset.route);
  });

  $('#themeToggle').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveState();
  });

  $('#scriptToggle').addEventListener('click', () => {
    state.script = state.script === 'latin' ? 'cyrillic' : 'latin';
    saveState();
    if (session) renderExercise(); else setRoute(state.route);
  });

  $('#iphoneBtn').addEventListener('click', () => $('#installDialog').showModal());
  $('#closeInstall').addEventListener('click', () => $('#installDialog').close());

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  window.speechSynthesis?.getVoices?.();
  applyTheme();
  setRoute(state.route || 'home');
})();
