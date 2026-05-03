# DESIGN — эстетический контракт деки

> Anti-slop правила + проектная палитра/тон. Загружается, когда нужны решения по визуалу. Не редактировать в активной сессии — ломает prompt cache.

## DISTILLED_AESTHETICS_PROMPT (дословно, Anthropic Frontend Aesthetics Cookbook)

Источник: `platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics` (Притви Раджасекаран, Anthropic, 21 октября 2025).

```
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!
</frontend_aesthetics>
```

---

## Проектное направление

**Тон:** editorial, доверительный, slightly warm. Презентация — заявка на федеральный грант, аудитория = жюри + индустриальные эксперты. Не «стартап-питч на Bay Area-сайте», не «корпоративный шаблон». Ближе к редакционному развороту делового издания: воздух, типографика как структура, числа звучат громче слов.

**Голос:** уверенный без бахвальства, конкретные цифры (не «кратный рост», а «+63% YoY 1Q 2026»), без эмодзи и канцеляризмов.

## Палитра

Базируется на продуктовой (`styles/tokens.css` наследует значения).

| Токен | Значение | Назначение |
|---|---|---|
| `--bg` | `#f6f5f1` | основной фон деки (тёплый бумажный off-white) |
| `--surface` | `#ffffff` | карточки, мокапы |
| `--surface-sheet` | `#fafaf8` | вторичные плашки |
| `--text-primary` | `#1a1a1f` | заголовки, основной текст |
| `--text-secondary` | `#6b6d7b` | подписи, второстепенный текст |
| `--text-muted` | `#a0a2b1` | meta, нумерация |
| `--accent` | `#e8734a` | главный акцент (тёплый цитрусовый) |
| `--orange-text` | `#c2603a` | акцентные числа в тексте |
| `--indigo` | `#6366f1` | вторичный акцент (точечно) |
| `--green-text` | `#0d9668` | положительные дельты |
| `--danger` | `#dc2626` | отрицательные сигналы |

**Дисциплина:**
- **Доминанта `#f6f5f1` + `#1a1a1f`, акцент `#e8734a` — резкий, точечный.** Не покрывать акцентом большие площади.
- Никаких фиолетовых градиентов на белом. Никаких пастельных «ИИ-палитр».
- Цвет в коде — только через CSS-переменные. Хардкод hex в компоненте/слайде = баг.

## Типографика

| Стек | Назначение |
|---|---|
| **Onest** (300/400/500/600/700) | весь UI, заголовки, основной текст |
| **JetBrains Mono** (400/500/600) | числа (MRR, %, ₽), email, домены, даты, номера страниц |

**Запреты:** Inter, Roboto, Arial, системные. Space Grotesk — частая точка схождения LLM, осознанно избегать.

**Иерархия (ориентир для 1920×1080):**
- Hero-заголовок (титул): 120–160px, `font-weight: 600`, `letter-spacing: -0.02em`
- Заголовок слайда: 64–80px, `font-weight: 600`
- Подзаголовок / тезис: 28–36px, `font-weight: 400`
- Body: 22–26px
- Цифры stat-карточек: 96–140px, **JetBrains Mono**, `font-weight: 500`
- Meta / подписи: 16–18px, `letter-spacing: 0.04em`, uppercase допустимо

## Layout и плотность

- **Воздух важнее украшений.** `--slide-pad-x: 120px`, `--slide-pad-y: 80px` — не уменьшать.
- Сетка: 12 колонок, gutter 32px. Горизонтальные правила (1px `var(--border)`) — основной разделитель, не плашки.
- Не больше **одного** доминирующего визуального элемента на слайде (мокап, либо чарт, либо большая цифра).
- Список тезисов > 5 — признак, что слайд надо разбить.

## Motion

- Page load с staggered reveals (CSS `animation-delay`) — допустим, **только в превью**.
- В `@media print` все анимации — `animation: none !important`. Мокапы показывают финальный кадр.
- Никаких бесконечных циклов (pulsing dot — единственное допустимое исключение для индикатора «живых клиентов»).

## Backgrounds и атмосфера

- Базовый фон — тёплый off-white (`--bg`), а не чистый `#fff`.
- Допустимые приёмы для глубины: тонкие радиальные градиенты `--accent-glow` под hero-заголовком, geometric guides (1px hairlines), субтильные шумовые SVG-текстуры под мокапы.
- Запрет: цветные блоб-градиенты, glassmorphism, неоновый glow, drop-shadow с цветом ≠ нейтрально-чёрный.

## Мокапы и продуктовый UI

Не выдумывать продуктовые экраны. Реальные страницы — `C:\Users\user\Desktop\parcer\preview\.claude\worktrees\stupefied-kilby-d542f3\pages\`:
- `analytics/`, `calendar/`, `students/`, `parent/`, `profile/`, `auth/`, `onboarding/`

Frame для мокапа:
- **Mobile:** bezel `#1a1a1f`, скругление 44px, dynamic island, тень `--shadow-mockup`.
- **Desktop:** macOS traffic-lights, скругление 12px, тень `--shadow-mockup`.

После согласования с автором — мокапы растеризуются в `public/mockups/*.png` (или `.webp`/`.svg`) и подключаются как `<img>`. Не генерировать пиксельный CSS заново на каждый ход.

## Чек-лист до отдачи слайда

- [ ] Цвета — только из `tokens.css`, ни одного хардкод-hex
- [ ] Шрифты — только Onest / JetBrains Mono
- [ ] Числа — `font-mono`, у заголовков `letter-spacing: -0.02em`
- [ ] Воздух не съеден — паддинги `--slide-pad-*` сохранены
- [ ] Один доминирующий визуальный элемент
- [ ] В `@media print` анимации погашены
- [ ] Без эмодзи (если автор не попросил)
