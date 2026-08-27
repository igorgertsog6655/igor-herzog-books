'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Lang = 'ru' | 'en';
type FilterId = 'all' | '5-7' | '8-10' | 'family';
type TopicId = 'personal' | 'books' | 'pdf' | 'rights' | 'other';

const assetRoot = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const asset = (path: string) => `${assetRoot}${path}`;

const books = [
  {
    id: 'pocket-moon',
    filters: ['5-7', '8-10', 'family'] as FilterId[],
    pages: 27,
    cover: { ru: '/books/pocket-moon-ru.webp', en: '/books/pocket-moon-en.webp' },
    scene: '/scenes/moon-chase.webp',
    links: {
      litres: 'https://www.litres.ru/book/igor-gercog/tayna-karmannoy-luny-74218963/',
      amazon: 'https://www.amazon.com/dp/B0HG1TD2HC',
    },
    ru: {
      title: 'Тайна карманной луны',
      type: 'Приключенческая сказка',
      age: '6–10 лет',
      hook: 'Что будет, если сердце Луны окажется в кармане старого пальто?',
      description: 'Девятилетняя Лиза приезжает в город Сонные Крыши и находит механическое сердце Луны. Вместе с котом Фонариком и мальчиком Тимой она должна вернуть его домой, пока город не лишился времени и снов.',
      themes: ['дружба', 'смелость', 'принятие перемен'],
    },
    en: {
      title: 'The Mystery of the Pocket Moon',
      type: 'Illustrated adventure',
      age: 'Ages 7–10',
      hook: 'What if the Moon’s heart was hidden in the pocket of an old coat?',
      description: 'Nine-year-old Lisa arrives in the town of Sleepy Rooftops and finds the Moon’s tiny mechanical heart. With a talking cat named Sparky and a boy named Tim, she must return it before the town loses all its time—and all its dreams.',
      themes: ['friendship', 'courage', 'accepting change'],
    },
  },
  {
    id: 'old-suitcase',
    filters: ['5-7', '8-10', 'family'] as FilterId[],
    pages: 27,
    cover: { ru: '/books/old-suitcase-ru.webp', en: '/books/old-suitcase-en.webp' },
    scene: '/scenes/suitcase-letter.webp',
    links: {
      litres: 'https://www.litres.ru/book/igor-gercog/shepot-iz-starogo-chemodana-74246704/',
      amazon: 'https://www.amazon.com/dp/B0HG4XD9PD',
    },
    ru: {
      title: 'Шёпот из старого чемодана',
      type: 'Добрая семейная тайна',
      age: '5–10 лет',
      hook: 'А что, если старый чемодан хранит слова, которые люди когда-то не решились сказать?',
      description: 'Мия находит на чердаке потёртый синий чемодан с тремя замками. Вместе с котом Пикселем она оказывается на вокзале, откуда поезда уходят во «Вчера», «Если бы» и «Когда я вырасту».',
      themes: ['семейная тайна', 'несказанные слова', 'дорога друг к другу'],
    },
    en: {
      title: 'Whispers from the Old Suitcase',
      type: 'A warm family mystery',
      age: 'Ages 5–10',
      hook: 'What if an old suitcase kept the words people were once too afraid to say?',
      description: 'Mia finds a worn blue suitcase with three unusual locks. With her cat, Pixel, she steps into a magical station whose trains leave for Yesterday, What If, and When I Grow Up—and follows a family secret back home.',
      themes: ['family secrets', 'unspoken words', 'finding one another'],
    },
  },
  {
    id: 'thirteenth-step',
    filters: ['8-10', 'family'] as FilterId[],
    pages: 30,
    cover: { ru: '/books/thirteenth-step-ru.webp', en: '/books/thirteenth-step-en.webp' },
    scene: '/scenes/unknown-step.webp',
    links: {
      litres: 'https://www.litres.ru/book/igor-gercog/sekret-trinadcatoy-stupenki-74280498/',
      amazon: 'https://www.amazon.com/dp/B0HFZMRFSX',
    },
    ru: {
      title: 'Секрет тринадцатой ступеньки',
      type: 'Фантастическая повесть-загадка',
      age: 'Для детей и взрослых',
      hook: 'В городе, где всё подчинено числу двенадцать, появляется ступенька, которой не должно быть.',
      description: 'Мира находит тринадцать мокрых следов и вместе с ворчливым котом Минусом попадает в Междуэтажье — мир, где несказанные слова растут на деревьях, а Может Быть стережёт все «а что, если».',
      themes: ['любопытство', 'право на ошибку', 'шаг в неизвестность'],
    },
    en: {
      title: 'The Secret of the 13th Step',
      type: 'A fantasy mystery',
      age: 'For children and grown-ups',
      hook: 'In a city ruled by twelve, a step appears that should not exist.',
      description: 'Mira finds thirteen wet footprints and, with her grumpy cat Minus, enters the In-Between Floors—where unsaid words grow on trees and a creature named Maybe watches over every “what if.”',
      themes: ['curiosity', 'the freedom to fail', 'stepping into the unknown'],
    },
  },
];

const ui = {
  ru: {
    nav: [
      ['Книги', '#books'],
      ['Книга о вашем ребёнке', '#personal'],
      ['Об авторе', '#author'],
      ['Связаться', '#contact'],
    ],
    hero: {
      eyebrow: 'Авторские сказки Игоря ГЕРЦОГА',
      title1: 'Истории, которые',
      title2: 'остаются с нами',
      text: 'Таинственные города, мудрые коты и дети, которые разгадывают невозможные тайны — и учатся верить в себя.',
      primary: 'Выбрать приключение',
      secondary: 'Сказка о Вашем ребенке или друге',
      count: '3 мира уже открыты',
      scroll: 'Листайте, чтобы войти в историю',
    },
    trust: [
      ['03', 'авторские истории'],
      ['02', 'языка изданий'],
      ['84', 'красочные страницы'],
      ['5–10', 'лет — возраст открытий'],
    ],
    catalog: {
      eyebrow: 'Коллекция',
      title: 'Выберите мир, куда хочется вернуться',
      intro: 'Каждая книга — самостоятельное путешествие, полное юмора, загадок и волшебных деталей.',
      filters: { all: 'Все книги', '5-7': '5–7 лет', '8-10': '8–10 лет', family: 'Семейное чтение' },
      details: 'Открыть книгу',
      pages: 'страниц',
      directTitle: 'Хотите PDF напрямую от автора?',
      directText: 'Напишите нам — поможем с выбором формата. Моментальная оплата на сайте появится следующим этапом.',
      directCta: 'Запросить PDF',
    },
    modal: {
      buy: 'Где купить',
      litres: 'Купить на ЛитРес',
      amazon: 'Buy on Amazon',
      direct: 'Запросить PDF у автора',
      close: 'Закрыть',
      note: 'Вы перейдёте на официальную страницу издания.',
    },
    motion: {
      eyebrow: 'Истории в движении',
      title: 'Скоро герои сойдут со страниц',
      text: 'Мы готовим анимационные тизеры и развиваем идеи целых мультсериалов. Пока — маленький пролог: фрагменты иллюстраций уже оживают на этой странице.',
      badge1: 'Анимационные тизеры',
      badge2: 'Миры для мультсериалов',
      state: 'В разработке',
    },
    personal: {
      eyebrow: 'Персональная история',
      title: 'Книга, где главный герой — ваш ребёнок',
      lead: 'Представьте подарок, который невозможно перерасти. Ваш сын и его любимый пёс спасают город от пропавших цветов. Ваша дочь и её кот находят дверь в город незаданных вопросов. Или вся семья отправляется за картой будущего.',
      promise: 'Мы создадим не шаблон с подставленным именем, а настоящую авторскую историю — с характером ребёнка, его шутками, мечтами и узнаваемыми деталями.',
      steps: [
        ['01', 'Знакомимся', 'Вы рассказываете о ребёнке, его питомце, семье и важных мелочах.'],
        ['02', 'Придумываем мир', 'Согласовываем жанр, сюжетную завязку и визуальное настроение.'],
        ['03', 'Создаём книгу', 'Пишем историю, создаём иллюстрации и собираем их в цельное издание.'],
        ['04', 'Дарим чудо', 'Вы получаете готовую цифровую книгу; варианты печати обсуждаются отдельно.'],
      ],
      cta: 'Обсудить вашу историю',
      note: 'Срок, объём и стоимость определяются после короткого обсуждения замысла.',
      visualTitle: 'Приключение, которого не было ни у кого',
      visualTag: 'Один экземпляр во вселенной',
    },
    author: {
      eyebrow: 'Об авторе',
      title: 'Игорь ГЕРЦОГ создаёт миры, где волшебство начинается с вопроса',
      p1: 'Игорь ГЕРЦОГ — автор сказок и приключенческих повестей для детей, в которых мягкий юмор соседствует с загадками, а яркие приключения — с серьёзными вопросами.',
      p2: 'В его историях привычные вещи открываются с неожиданной стороны, а герои учатся дружить, выбирать, ошибаться и оставаться собой. Каждая книга завершается на светлой ноте, но оставляет место для собственной мысли.',
      p3: 'Особое внимание автор уделяет визуальному миру: иллюстрации не просто сопровождают текст, а продолжают рассказ. В них прячутся подсказки, знаки и вторые сюжеты. И, конечно, важную роль играют коты — наблюдательные, остроумные и иногда подозрительно мудрые.',
      quote: '«Хорошая детская книга не даёт готовый ответ. Она даёт ребёнку смелость задать свой вопрос».',
      role: 'Писатель · Создатель визуальных миров',
      link: 'Все книги на ЛитРес',
    },
    contact: {
      eyebrow: 'Начнём с одной идеи',
      title: 'Расскажите, какой мир вы хотите подарить',
      text: 'Напишите автору о персональной книге, правах на экранизацию, покупке PDF или просто поделитесь впечатлениями.',
      privateLabel: 'Связь с автором',
      privateCta: 'Напишите через форму',
      response: 'Обычно отвечаем в течение 1–2 рабочих дней.',
      name: 'Ваше имя',
      email: 'Email для ответа',
      topic: 'Тема',
      topics: {
        personal: 'Персональная книга',
        books: 'Вопрос о книгах',
        pdf: 'Покупка PDF',
        rights: 'Анимация и права',
        other: 'Другое',
      },
      message: 'Расскажите о вашей идее',
      placeholder: 'Например: Артёму 7 лет, он обожает космос и везде ходит с таксой Буней…',
      attach: 'Прикрепить фото или файлы',
      attachNote: 'JPG, PNG, PDF, DOC · всего до 10 МБ',
      consent: 'Я согласен(на) на обработку данных и передачу сообщения через сервис доставки почты.',
      submit: 'Отправить письмо',
      sending: 'Отправляем…',
      success: 'Спасибо! Письмо отправлено. Мы ответим на указанный email.',
      error: 'Не удалось отправить форму. Попробуйте ещё раз немного позже.',
      tooLarge: 'Общий размер вложений не должен превышать 10 МБ.',
    },
    footer: {
      line: 'Истории для детей. Вопросы — для всех.',
      rights: 'Все права защищены.',
      privacy: 'Конфиденциальность',
    },
  },
  en: {
    nav: [
      ['Books', '#books'],
      ['A book about your child', '#personal'],
      ['About the author', '#author'],
      ['Contact', '#contact'],
    ],
    hero: {
      eyebrow: 'Original stories by Igor Herzog',
      title1: 'Stories that',
      title2: 'stay with us',
      text: 'Mysterious cities, wise cats, and children who solve impossible riddles—while finding the courage to believe in themselves.',
      primary: 'Choose an adventure',
      secondary: 'Create a book about your child',
      count: '3 worlds are open',
      scroll: 'Scroll to enter the story',
    },
    trust: [
      ['03', 'original stories'],
      ['02', 'publishing languages'],
      ['84', 'illustrated pages'],
      ['5–10', 'ages of discovery'],
    ],
    catalog: {
      eyebrow: 'The collection',
      title: 'Choose a world you will want to revisit',
      intro: 'Every book is a complete journey filled with gentle humor, mysteries, and small details that reward a second look.',
      filters: { all: 'All books', '5-7': 'Ages 5–7', '8-10': 'Ages 8–10', family: 'Family reading' },
      details: 'Open the book',
      pages: 'pages',
      directTitle: 'Would you like a PDF directly from the author?',
      directText: 'Write to us and we will help with the right format. Instant checkout on this site is planned for the next stage.',
      directCta: 'Request a PDF',
    },
    modal: {
      buy: 'Where to buy',
      litres: 'Buy the Russian edition on LitRes',
      amazon: 'Buy the English edition on Amazon',
      direct: 'Request a PDF from the author',
      close: 'Close',
      note: 'You will continue to the official edition page.',
    },
    motion: {
      eyebrow: 'Stories in motion',
      title: 'Soon the characters will step off the page',
      text: 'Animated teasers are in development, along with ideas for full series. For now, this is a small prologue: fragments from the books are already coming alive across this page.',
      badge1: 'Animated teasers',
      badge2: 'Worlds for future series',
      state: 'In development',
    },
    personal: {
      eyebrow: 'A personal story',
      title: 'A book where your child is the hero',
      lead: 'Imagine a gift no one can outgrow. Your son and his beloved dog save a city that has lost all its colors. Your daughter and her cat discover a door into the City of Unasked Questions. Or the whole family sets out to find a map of the future.',
      promise: 'This is not a template with a name dropped in. We create an original story shaped by your child’s personality, jokes, dreams, favorite places, and the tiny details only your family knows.',
      steps: [
        ['01', 'We meet', 'You tell us about the child, their pet, family, interests, and the details that make them unique.'],
        ['02', 'We invent the world', 'Together we agree on the genre, the story premise, and the visual mood.'],
        ['03', 'We create the book', 'We write the story, develop the illustrations, and compose them into a complete edition.'],
        ['04', 'You give wonder', 'You receive the finished digital book; print options can be discussed separately.'],
      ],
      cta: 'Discuss your story',
      note: 'Timeline, scope, and price are set after a short conversation about the idea.',
      visualTitle: 'An adventure no one else has',
      visualTag: 'One copy in the universe',
    },
    author: {
      eyebrow: 'About the author',
      title: 'Igor Herzog creates worlds where wonder begins with a question',
      p1: 'Igor Herzog writes illustrated fairy tales and adventure stories for children, blending gentle humor and tightly woven mysteries with ideas that invite a deeper conversation.',
      p2: 'In his stories, familiar things reveal an unexpected side. Children learn to be brave, make choices, get things wrong, and remain themselves. Each journey ends on a bright note, but leaves space for a thought of one’s own.',
      p3: 'The visual world matters just as much as the words. Illustrations continue the story with clues, symbols, and second narratives hidden inside them. And, naturally, there are cats—observant, witty, and occasionally far too wise.',
      quote: '“A good children’s book does not hand over a ready-made answer. It gives a child the courage to ask their own question.”',
      role: 'Writer · Creator of visual worlds',
      link: 'All books on LitRes',
    },
    contact: {
      eyebrow: 'It starts with one idea',
      title: 'Tell us what kind of world you want to give',
      text: 'Write about a personal book, screen rights, a direct PDF purchase, or simply share what the stories made you feel.',
      privateLabel: 'Contact the author',
      privateCta: 'Write using the form',
      response: 'We usually reply within 1–2 business days.',
      name: 'Your name',
      email: 'Email for our reply',
      topic: 'Topic',
      topics: {
        personal: 'A personal book',
        books: 'Question about the books',
        pdf: 'Direct PDF purchase',
        rights: 'Animation and rights',
        other: 'Other',
      },
      message: 'Tell us about your idea',
      placeholder: 'For example: Leo is seven, loves outer space, and goes everywhere with his dachshund, Bunya…',
      attach: 'Attach photos or files',
      attachNote: 'JPG, PNG, PDF, DOC · 10 MB total',
      consent: 'I agree to the processing of the submitted data and its transfer through the email delivery service.',
      submit: 'Send the message',
      sending: 'Sending…',
      success: 'Thank you! Your message has been sent. We will reply to the email you provided.',
      error: 'The form could not be sent. Please try again a little later.',
      tooLarge: 'The combined attachment size must not exceed 10 MB.',
    },
    footer: {
      line: 'Stories for children. Questions for everyone.',
      rights: 'All rights reserved.',
      privacy: 'Privacy',
    },
  },
} as const;

export default function Home() {
  const [lang, setLang] = useState<Lang>('ru');
  const [filter, setFilter] = useState<FilterId>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [topic, setTopic] = useState<TopicId>('personal');
  const [files, setFiles] = useState<File[]>([]);
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error' | 'too-large'>('idle');

  const t = ui[lang];
  const selectedBook = books.find((book) => book.id === selectedId) ?? null;
  const visibleBooks = useMemo(
    () => books.filter((book) => filter === 'all' || book.filters.includes(filter)),
    [filter],
  );

  useEffect(() => {
    const queryLang = new URLSearchParams(window.location.search).get('lang');
    const savedLang = window.localStorage.getItem('story-language');
    const nextLang = queryLang === 'en' || (!queryLang && savedLang === 'en') ? 'en' : 'ru';
    setLang(nextLang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem('story-language', lang);
  }, [lang]);

  useEffect(() => {
    document.body.style.overflow = selectedBook ? 'hidden' : '';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedId(null);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedBook]);

  const changeLanguage = (nextLang: Lang) => {
    setLang(nextLang);
    const url = new URL(window.location.href);
    if (nextLang === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    window.history.replaceState({}, '', url);
  };

  const openContact = (nextTopic: TopicId) => {
    setTopic(nextTopic);
    setSelectedId(null);
    window.setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }), 20);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    if (totalBytes > 10 * 1024 * 1024) {
      setFormState('too-large');
      return;
    }

    setFormState('sending');
    const data = new FormData(form);
    data.set('_subject', lang === 'ru' ? 'Новое письмо с сайта Игоря ГЕРЦОГА' : 'New message from Igor Herzog website');
    data.set('_template', 'table');
    data.set('_captcha', 'false');
    data.set('language', lang === 'ru' ? 'Русский' : 'English');

    try {
      const response = await fetch('https://formsubmit.co/ajax/64c15179829d5c6b816fba3384bacb44', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (!response.ok) throw new Error('Submission failed');
      setFormState('success');
      setFiles([]);
      form.reset();
      setTopic('personal');
    } catch {
      setFormState('error');
    }
  };

  return (
    <main>
      <section className="hero" id="top">
        <img className="heroWorld" src={asset('/backgrounds/hero-fantasy-cosmos.webp')} alt="" />
        <div className="heroShade" />
        <div className="aurora auroraOne" />
        <div className="aurora auroraTwo" />
        <div className="motionFragments" aria-hidden="true">
          <img className="fragment fragmentOne" src={asset('/scenes/moon-chase.webp')} alt="" />
          <img className="fragment fragmentTwo" src={asset('/scenes/suitcase-stairs.webp')} alt="" />
          <img className="fragment fragmentThree" src={asset('/scenes/counted-city.webp')} alt="" />
        </div>

        <header className="siteHeader">
          <a className="brand" href="#top" aria-label={lang === 'ru' ? 'Игорь ГЕРЦОГ — главная' : 'Igor Herzog — home'}>
            <span className="brandMark"><img src={asset('/author/fonarik-mascot.webp')} alt="" /></span>
            <span><b>{lang === 'ru' ? 'Игорь ГЕРЦОГ' : 'IGOR HERZOG'}</b><small>{lang === 'ru' ? 'ФАНТАСТИЧЕСКИЕ МИРЫ' : 'STORY WORLDS'}</small></span>
          </a>
          <nav className={menuOpen ? 'open' : ''} aria-label="Main navigation">
            {t.nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          </nav>
          <div className="headerActions">
            <div className="langSwitch" aria-label="Language">
              <button aria-pressed={lang === 'ru'} className={lang === 'ru' ? 'active' : ''} onClick={() => changeLanguage('ru')}>RU</button>
              <button aria-pressed={lang === 'en'} className={lang === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>EN</button>
            </div>
            <button className="menuButton" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><span /><span /></button>
          </div>
        </header>

        <div className="heroGrid">
          <div className="heroCopy">
            <div className="eyebrow"><span />{t.hero.eyebrow}</div>
            <h1><span>{t.hero.title1}</span><span>{t.hero.title2}</span></h1>
            <p>{t.hero.text}</p>
            <div className="heroActions">
              <a className="button buttonPrimary" href="#books">{t.hero.primary}<i>→</i></a>
              <a className="button buttonGhost" href="#personal">{t.hero.secondary}</a>
            </div>
            <div className="worldCount"><b>03</b><span>{t.hero.count}</span></div>
          </div>

          <div className="bookStage" aria-label="Book collection">
            <div className="orbit orbitOne" />
            <div className="orbit orbitTwo" />
            <img className="cover coverLeft" src={asset(books[1].cover[lang])} alt={books[1][lang].title} />
            <img className="cover coverRight" src={asset(books[2].cover[lang])} alt={books[2][lang].title} />
            <img className="cover coverCenter" src={asset(books[0].cover[lang])} alt={books[0][lang].title} />
            <span className="spark sparkOne">✦</span>
            <span className="spark sparkTwo">✦</span>
            <span className="spark sparkThree">·</span>
          </div>
        </div>

        <a className="scrollCue" href="#books"><span />{t.hero.scroll}</a>
      </section>

      <section className="trustStrip" aria-label="Collection facts">
        <div className="trustInner">
          {t.trust.map(([value, label]) => <div className="trustItem" key={label}><b>{value}</b><span>{label}</span></div>)}
        </div>
      </section>

      <section className="catalog sectionLight" id="books">
        <div className="sectionWrap">
          <div className="sectionIntro catalogIntro">
            <div><span className="sectionEyebrow">{t.catalog.eyebrow}</span><h2>{t.catalog.title}</h2></div>
            <p>{t.catalog.intro}</p>
          </div>
          <div className="filterBar" role="group" aria-label="Book filters">
            {(Object.keys(t.catalog.filters) as FilterId[]).map((id) => (
              <button key={id} className={filter === id ? 'active' : ''} aria-pressed={filter === id} onClick={() => setFilter(id)}>{t.catalog.filters[id]}</button>
            ))}
          </div>
          <div className="bookGrid">
            {visibleBooks.map((book, index) => {
              const bookText = book[lang];
              return (
                <article className="bookCard" key={book.id} style={{ '--card-delay': `${index * 90}ms` } as React.CSSProperties}>
                  <button className="bookVisual" onClick={() => setSelectedId(book.id)} aria-label={`${t.catalog.details}: ${bookText.title}`}>
                    <img className="bookScene" src={asset(book.scene)} alt="" />
                    <img className="bookCover" src={asset(book.cover[lang])} alt={bookText.title} />
                    <span className="bookNumber">0{index + 1}</span>
                  </button>
                  <div className="bookBody">
                    <div className="bookMeta"><span>{bookText.type}</span><span>{bookText.age}</span></div>
                    <h3>{bookText.title}</h3>
                    <p className="bookHook">{bookText.hook}</p>
                    <div className="themeList">{bookText.themes.map((theme) => <span key={theme}>{theme}</span>)}</div>
                    <div className="bookFooter"><span>{book.pages} {t.catalog.pages}</span><button onClick={() => setSelectedId(book.id)}>{t.catalog.details}<i>↗</i></button></div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="directPdf">
            <div className="pdfIcon"><span>PDF</span></div>
            <div><h3>{t.catalog.directTitle}</h3><p>{t.catalog.directText}</p></div>
            <button className="button buttonInk" onClick={() => openContact('pdf')}>{t.catalog.directCta}<i>→</i></button>
          </div>
        </div>
      </section>

      <section className="motionSection sectionDark">
        <div className="sectionWrap motionHeader">
          <div><span className="sectionEyebrow sectionEyebrowLight">{t.motion.eyebrow}</span><h2>{t.motion.title}</h2></div>
          <div className="motionCopy"><p>{t.motion.text}</p><div className="motionBadges"><span>● {t.motion.badge1}</span><span>● {t.motion.badge2}</span></div></div>
        </div>
        <div className="filmRail" aria-hidden="true">
          <div className="filmTrack">
            {[...books, ...books].map((book, index) => <figure key={`${book.id}-${index}`}><img src={asset(book.scene)} alt="" /><figcaption><span>0{(index % 3) + 1}</span>{t.motion.state}</figcaption></figure>)}
          </div>
        </div>
      </section>

      <section className="personal sectionWarm" id="personal">
        <div className="sectionWrap personalGrid">
          <div className="personalVisual">
            <div className="personalHalo" />
            <div className="memory memoryOne"><img src={asset('/scenes/moon-reflection.webp')} alt="" /></div>
            <div className="memory memoryTwo"><img src={asset('/scenes/suitcase-letter.webp')} alt="" /></div>
            <div className="memory memoryThree"><img src={asset('/scenes/counted-city.webp')} alt="" /></div>
            <div className="personalSeal"><b>1/1</b><span>{t.personal.visualTag}</span></div>
            <div className="personalCaption">✦ <span>{t.personal.visualTitle}</span></div>
          </div>
          <div className="personalCopy">
            <span className="sectionEyebrow">{t.personal.eyebrow}</span>
            <h2>{t.personal.title}</h2>
            <p className="personalLead">{t.personal.lead}</p>
            <p>{t.personal.promise}</p>
            <a className="button buttonPrimary" href="#contact" onClick={() => setTopic('personal')}>{t.personal.cta}<i>→</i></a>
            <small>{t.personal.note}</small>
          </div>
        </div>
        <div className="sectionWrap stepsGrid">
          {t.personal.steps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="author sectionLight" id="author">
        <div className="sectionWrap authorGrid">
          <div className="authorPortrait">
            <img src={asset('/author/igor-herzog-7.webp')} alt={lang === 'ru' ? 'Игорь ГЕРЦОГ' : 'Igor Herzog'} />
            <div className="authorTag"><b>{lang === 'ru' ? 'Игорь ГЕРЦОГ' : 'IGOR HERZOG'}</b><span>{t.author.role}</span></div>
          </div>
          <div className="authorCopy">
            <span className="sectionEyebrow">{t.author.eyebrow}</span>
            <h2>{t.author.title}</h2>
            <div className="authorText"><p>{t.author.p1}</p><p>{t.author.p2}</p><p>{t.author.p3}</p></div>
            <blockquote>{t.author.quote}</blockquote>
            <a className="textLink" href="https://www.litres.ru/author/igor-gercog/" target="_blank" rel="noreferrer">{t.author.link}<i>↗</i></a>
          </div>
        </div>
      </section>

      <section className="contact sectionDark" id="contact">
        <div className="contactGlow" />
        <div className="sectionWrap contactGrid">
          <div className="contactCopy">
            <span className="sectionEyebrow sectionEyebrowLight">{t.contact.eyebrow}</span>
            <h2>{t.contact.title}</h2>
            <p>{t.contact.text}</p>
            <div className="emailCard"><span>{t.contact.privateLabel}</span><strong>{t.contact.privateCta}</strong><small>{t.contact.response}</small></div>
          </div>
          <form className="contactForm" onSubmit={handleSubmit} encType="multipart/form-data">
            <input className="honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="fieldRow">
              <label><span>{t.contact.name}</span><input name="name" type="text" required autoComplete="name" /></label>
              <label><span>{t.contact.email}</span><input name="email" type="email" required autoComplete="email" /></label>
            </div>
            <label><span>{t.contact.topic}</span><select name="topic" value={topic} onChange={(event) => setTopic(event.target.value as TopicId)}>{(Object.keys(t.contact.topics) as TopicId[]).map((id) => <option value={id} key={id}>{t.contact.topics[id]}</option>)}</select></label>
            <label><span>{t.contact.message}</span><textarea name="message" required rows={6} placeholder={t.contact.placeholder} /></label>
            <label className="fileField">
              <input name="attachment" type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx" onChange={(event) => { setFiles(Array.from(event.target.files ?? [])); setFormState('idle'); }} />
              <span className="fileButton"><i>+</i>{t.contact.attach}</span>
              <small>{files.length ? files.map((file) => file.name).join(', ') : t.contact.attachNote}</small>
            </label>
            <label className="consent"><input type="checkbox" required /><span>{t.contact.consent}</span></label>
            <button className="button buttonPrimary submitButton" type="submit" disabled={formState === 'sending'}>{formState === 'sending' ? t.contact.sending : t.contact.submit}<i>→</i></button>
            {formState === 'success' && <p className="formMessage success" role="status">{t.contact.success}</p>}
            {formState === 'too-large' && <p className="formMessage error" role="alert">{t.contact.tooLarge}</p>}
            {formState === 'error' && <p className="formMessage error" role="alert">{t.contact.error}</p>}
          </form>
        </div>
      </section>

      <footer>
        <div className="sectionWrap footerTop">
          <a className="brand" href="#top"><span className="brandMark"><img src={asset('/author/fonarik-mascot.webp')} alt="" /></span><span><b>{lang === 'ru' ? 'Игорь ГЕРЦОГ' : 'IGOR HERZOG'}</b><small>{lang === 'ru' ? 'ФАНТАСТИЧЕСКИЕ МИРЫ' : 'STORY WORLDS'}</small></span></a>
          <p>{t.footer.line}</p>
          <a className="backTop" href="#top">↑</a>
        </div>
        <div className="sectionWrap footerBottom"><span>© 2026 {lang === 'ru' ? 'Игорь ГЕРЦОГ' : 'Igor Herzog'}. {t.footer.rights}</span><a href="#contact" id="privacy">{t.footer.privacy}</a></div>
      </footer>

      {selectedBook && (
        <div className="modalBackdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelectedId(null); }}>
          <section className="bookModal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modalClose" onClick={() => setSelectedId(null)} aria-label={t.modal.close}>×</button>
            <div className="modalVisual"><img className="modalScene" src={asset(selectedBook.scene)} alt="" /><img className="modalCover" src={asset(selectedBook.cover[lang])} alt={selectedBook[lang].title} /></div>
            <div className="modalCopy">
              <span className="sectionEyebrow">{selectedBook[lang].type} · {selectedBook[lang].age}</span>
              <h2 id="modal-title">{selectedBook[lang].title}</h2>
              <p className="modalHook">{selectedBook[lang].hook}</p>
              <p>{selectedBook[lang].description}</p>
              <div className="themeList">{selectedBook[lang].themes.map((theme) => <span key={theme}>{theme}</span>)}</div>
              <h3>{t.modal.buy}</h3>
              <div className="storeLinks">
                <a className="store storeLitres" href={selectedBook.links.litres} target="_blank" rel="noreferrer"><b>Л</b><span>{t.modal.litres}<small>{t.modal.note}</small></span><i>↗</i></a>
                <a className="store storeAmazon" href={selectedBook.links.amazon} target="_blank" rel="noreferrer"><b>a</b><span>{t.modal.amazon}<small>{t.modal.note}</small></span><i>↗</i></a>
              </div>
              <button className="textLink modalDirect" onClick={() => openContact('pdf')}>{t.modal.direct}<i>→</i></button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
