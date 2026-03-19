# Язык программирования Rust

![Build Status](https://github.com/rust-lang/book/workflows/CI/badge.svg)

> Если вы обнаружили ошибки в переводе, опечатки или неточности, пожалуйста, откройте [issue](../../issues) в этом репозитории.

Этот репозиторий содержит русский перевод книги "The Rust Programming Language", а именно экспериментальной ветки, которая поддерживает интерактивные функции, такие как викторины.

**Переводчик:** Kakao

**Оригинальный репозиторий:** [cognitive-engineering-lab/rust-book](https://github.com/cognitive-engineering-lab/rust-book)

[Книга доступна в печатном виде от издательства No Starch Press][nostarch] (на английском языке).

[nostarch]: https://nostarch.com/rust-programming-language-2nd-edition

Вы также можете читать книгу бесплатно онлайн. Смотрите книгу, поставляемую с последними релизами Rust: [stable], [beta] или [nightly]. Обратите внимание, что проблемы в этих версиях могли быть уже исправлены в этом репозитории, так как эти релизы обновляются реже.

[stable]: https://doc.rust-lang.org/stable/book/
[beta]: https://doc.rust-lang.org/beta/book/
[nightly]: https://doc.rust-lang.org/nightly/book/

Смотрите [releases] для загрузки кода всех примеров, которые появляются в книге.

[releases]: https://github.com/rust-lang/book/releases

## Требования

Для сборки книги требуется [mdBook], в идеале та же версия, которую использует rust-lang/rust в [этом файле][rust-mdbook]. Чтобы установить:

[mdBook]: https://github.com/rust-lang/mdBook
[rust-mdbook]: https://github.com/rust-lang/rust/blob/master/src/tools/rustbook/Cargo.toml

```bash
$ cargo install mdbook --locked --version <version_num>
```

Этот форк также требует несколько препроцессоров mdBook для поддержки экспериментальных расширений. Следуйте инструкциям по установке по каждой ссылке ниже.

* `mdbook-aquascope`: <https://github.com/cognitive-engineering-lab/aquascope#installation>
* `mdbook-quiz`: <https://github.com/cognitive-engineering-lab/mdbook-quiz#installation>

Вы должны установить ту же версию каждого препроцессора, [используемую в CI](https://github.com/cognitive-engineering-lab/rust-book/blob/main/.github/workflows/main.yml).

Наконец, вам нужен [pnpm](https://pnpm.io/installation).

Книга также использует два плагина mdbook, которые являются частью этого репозитория. Если вы их не установите, вы увидите предупреждения при сборке, и вывод будет выглядеть неправильно, но вы *всё равно* сможете собрать книгу. Чтобы использовать плагины, выполните:

```bash
$ cargo install --locked --path packages/mdbook-trpl-listing
$ cargo install --locked --path packages/mdbook-trpl-note
```

## Сборка

### С cargo-make

Если у вас установлен [`cargo-make`], выполните:

```bash
$ cargo make build
```

### Без cargo-make

Сначала соберите JavaScript-расширения.

```bash
$ cd js-extensions
$ pnpm init-repo
$ cd ..
```

Затем для сборки книги введите:

```bash
$ mdbook build
```

### Результат

Результат будет в подкаталоге `book`. Чтобы посмотреть, откройте его в веб-браузере.

_Firefox:_
```bash
$ firefox book/index.html                       # Linux
$ open -a "Firefox" book/index.html             # OS X
$ Start-Process "firefox.exe" .\book\index.html # Windows (PowerShell)
$ start firefox.exe .\book\index.html           # Windows (Cmd)
```

_Chrome:_
```bash
$ google-chrome book/index.html                 # Linux
$ open -a "Google Chrome" book/index.html       # OS X
$ Start-Process "chrome.exe" .\book\index.html  # Windows (PowerShell)
$ start chrome.exe .\book\index.html            # Windows (Cmd)
```

Для запуска тестов:

```bash
$ cd packages/trpl
$ mdbook test --library-path packages/trpl/target/debug/deps
```

## Участие в проекте

Мы будем рады вашей помощи! Пожалуйста, смотрите [CONTRIBUTING.md][contrib], чтобы узнать о типах вклада, которые мы ищем.

[contrib]: https://github.com/rust-lang/book/blob/main/CONTRIBUTING.md

Поскольку книга [издана в печатном виде][nostarch], и поскольку мы хотим сохранить онлайн-версию книги близкой к печатной версии, когда это возможно, может потребоваться больше времени, чем вы привыкли, чтобы мы рассмотрели вашу проблему или pull request.

До сих пор мы проводили крупные ревизии, совпадающие с [изданиями Rust](https://doc.rust-lang.org/edition-guide/). Между этими крупными ревизиями мы будем только исправлять ошибки. Если ваша проблема или pull request не является строго исправлением ошибки, она может ожидать до следующего раза, когда мы будем работать над крупной ревизией: ожидайте порядка месяцев или лет. Спасибо за ваше терпение!

### Переводы

Мы будем рады помощи в переводе книги! Смотрите метку [Translations], чтобы присоединиться к усилиям, которые в настоящее время ведутся. Откройте новую проблему, чтобы начать работу над новым языком! Мы ждём [поддержки mdbook] для нескольких языков, прежде чем мы объединим какие-либо переводы, но не стесняйтесь начинать!

[Translations]: https://github.com/rust-lang/book/issues?q=is%3Aopen+is%3Aissue+label%3ATranslations
[mdbook support]: https://github.com/rust-lang/mdBook/issues/5

## Проверка орфографии

Для сканирования исходных файлов на орфографические ошибки вы можете использовать скрипт `spellcheck.sh`, доступный в каталоге `ci`. Ему нужен словарь допустимых слов, который предоставлен в `ci/dictionary.txt`. Если скрипт выдаёт ложное срабатывание (скажем, вы использовали слово `BTreeMap`, которое скрипт считает недопустимым), вам нужно добавить это слово в `ci/dictionary.txt` (сохраняйте отсортированный порядок для согласованности).

[`cargo-make`]: https://github.com/sagiegurari/cargo-make