# LTG

## Запуск

1. Если уже есть старая версия на nuxt 2, если нет — пропустить этот шаг
    - Удалить папки, если есть: node_modules, .nuxt, .dist
    - Удалить файлы, если есть: yarn.lock и package-lock.json
    - Установить pnpm: `https://pnpm.io/installation`
    - Убедиться, что версия nodejs 18, 19 или 20
2. Установить зависимости `pnpm i`

3. Сделать файл .env по примеру из файла `.env.example`

4. Запустить `pnpm run local` или `pnpm run local:stage` или `pnpm run local:prod`

### Чем отличаются команды:

-   `pnpm run local` — требует локально-запущенного бэкенда, адрес прокидывается в .env -> LTG_API
-   `pnpm run local:stage` — работает на бэкенде стейджа (нужен впн)
-   `pnpm run local:prod` — работает на бэкенде прода

### Адреса

Фронтенд:

-   Дев: `https://dev.longtaleent.com`
-   Стейдж: `https://longtaleent.com`
-   Прод: `https://ltg.com`

Бэкенд:

-   Дев: `https://dev-back.longtaleent.com`
-   Стейдж: `https://back-stg.longtaleent.com`
-   Прод: `https://api.ltg.com`

Админка:

-   Дев: `https://dev-admin.longtaleent.com`
-   Стейдж: `https://adm.longtaleent.com`
-   Прод: `https://adm.ltg.com`
