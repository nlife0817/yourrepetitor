---
name: deck
description: Use when working on the «Твой репетитор × Создай НАШЕ 2026» Slidev presentation — adding/editing slides, building Vue components, adjusting layouts, exporting PDF. Triggers on requests about slides, deck, презентация, мокапы, экспорт PDF.
---

# Deck — авторинг презентации в Slidev

Стек: Slidev 52.x + Vue 3 + UnoCSS. Размер: 1920×1080. Палитра/шрифты — `styles/tokens.css`. Эстетика — `DESIGN.md`. Дисциплина workflow — `CLAUDE.md` (правь `pages/`, не `slides.md`).

## Файловая раскладка

```
Презентация/
├── slides.md              # точка входа: только frontmatter + src: pages/*
├── style.css              # auto-loaded Slidev (импортирует tokens.css + Google Fonts)
├── pages/                 # один слайд = один .md, ≤200 токенов
│   └── NN-name.md
├── components/            # переиспользуемые Vue SFC
│   ├── DeckHeader.vue     # шапка с логотипами (используется во всех layouts)
│   ├── DeckFooter.vue     # пагинация
│   ├── Stat.vue           # статистика: label / value / delta / trend
│   └── DeviceMock.vue     # рамка устройства (mobile/desktop) с slot для контента
├── layouts/               # Slidev layouts (см. правила ниже)
│   ├── default.vue        # стандартный слайд: header + body + footer
│   └── cover.vue          # двух-колоночный для титула / разделов
├── styles/
│   └── tokens.css         # CSS-переменные, ничего больше
├── public/                # статика, доступна по /path
│   ├── logo-tr.png
│   ├── logos/             # лого партнёров
│   └── mockups/           # будущие растеризованные PNG/WebP мокапы (см. ниже)
└── data/                  # YAML-данные слайдов (если выносим контент)
```

## Команды

- `pnpm dev` — dev-сервер с HMR (открывает браузер)
- `pnpm export` или `pnpm export:pdf` — PDF в корень проекта
- `pnpm export:pptx` — PPTX
- `pnpm build` — статический SPA в `dist/`

Перед `export` убедись, что `pnpm dev` хотя бы раз запускался и кэш не битый.

## Как добавить новый слайд

1. Создать `pages/NN-slug.md`. Frontmatter обязателен:
   ```md
   ---
   layout: default        # или cover, или кастомный layout
   ---
   ```
2. Добавить `src: ./pages/NN-slug.md` в `slides.md` (раскомментировать в манифесте, если есть).
3. Контент пиши в Markdown + Vue-компонентах. Стили слайда — в `<style>` блоке внутри того же `.md`. Глобальные правила — никогда не в слайде.

## Как редактировать существующий слайд

- **Только** `pages/NN-*.md`. Не трогай `slides.md`.
- Если меняешь повторяющийся визуальный паттерн — редактируй компонент в `components/`, а не дубль в каждом слайде.
- Если меняешь токен (цвет/шрифт/отступ) — `styles/tokens.css`. Никаких хардкод-hex в слайдах и компонентах.

## Контракт компонентов

| Компонент | Пропсы | Назначение |
|---|---|---|
| `<DeckHeader />` | — | шапка с логотипом ТР + грантовый блок справа. Авто-используется в layouts. |
| `<DeckFooter :page :total />` | `page: number, total: number` | нумерация. Авто-используется в layouts. |
| `<Stat label value delta? trend? />` | `label, value, delta?, trend?: 'up' \| 'down' \| 'flat'` | большая цифра + label + дельта |
| `<DeviceMock variant? label? />` | `variant: 'mobile' \| 'desktop' = 'mobile', label?: string` | рамка устройства; контент — через slot или плейсхолдер |

Новый компонент = новый файл `components/PascalName.vue`. Обновляй эту таблицу.

## Layouts

- `default` — `header → body (top-padded 184px, side-padded var(--slide-pad-x)) → footer`
- `cover` — то же, но body — двух-колоночный grid (`1fr 1fr`, gap 80px), вертикально центрировано

Для нестандартных слайдов делай новый layout, не хардкоди разметку шапки в слайде.

## Мокапы продукта

**Не выдумывать UI продукта.** Реальные страницы — `C:\Users\user\Desktop\parcer\preview\.claude\worktrees\stupefied-kilby-d542f3\pages\` (`analytics/`, `calendar/`, `students/`, `parent/`, `profile/`, `auth/`, `onboarding/`).

Текущая стратегия — Vue-обёртка `<DeviceMock>` с плейсхолдером. Решение по растеризации (превратить мокапы в `public/mockups/*.png` для экономии токенов на каждом ходе) — pending, см. `.claude/HANDOFF.md`. **До решения автора**:
- Ставь `<DeviceMock variant="mobile" label="Имя экрана" />` без вложенной разметки.
- Не воспроизводи продуктовый UI разметкой внутри слайдов и компонентов.

## Эстетика — обязательно перед версткой

Прежде чем писать стили слайда — открой `DESIGN.md`. Anti-slop правила (Anthropic Frontend Aesthetics Cookbook): запрещены Inter/Roboto/Arial/системные, фиолетовые градиенты на белом, generic AI layouts. Шрифты — только Onest + JetBrains Mono. Цвета — только переменные из `tokens.css`.

Чек-лист до отдачи слайда — в конце `DESIGN.md`.

## Делегирование сложной верстки

Длинные/сложные слайды (мокапы, чарты, креативная типографика) — через агента `frontend-developer` (Agent tool). Передавай ему: имя слайда, ссылку на `DESIGN.md`, ссылку на этот SKILL.md, ограничения по компонентам.

## Workflow с автором (КРИТИЧНО)

Для каждого слайда: **сначала текст словами в чате → согласование → только потом код**. «Поехали» = «начинаем обсуждение слайда», не «пиши код».

## Print / экспорт

- `@page { size: 1920px 1080px; margin: 0 }` уже задано в `tokens.css` через slidev.
- В `@media print` все анимации — `none !important` (см. `style.css`).
- Pulse-анимация индикатора клиентов — гасится в print.
- `slidev export` использует Playwright (уже в devDependencies). Если падает — `pnpm exec playwright install chromium`.

## Reference

- Архитектурное обоснование, источники, цитаты Anthropic — `presentations-claude-ru.md`.
- Slidev docs — `https://sli.dev`.
