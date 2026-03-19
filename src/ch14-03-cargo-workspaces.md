## Рабочие пространства Cargo

В Главе 12 мы создали пакет, включающий бинарный крейт и библиотечный крейт. По мере развития проекта вы можете обнаружить, что библиотечный крейт продолжает расти, и вы хотите разделить пакет на несколько библиотечных крейтов. Cargo предлагает возможность под названием _рабочие пространства_ (workspaces), которая помогает управлять несколькими связанными пакетами, разрабатываемыми одновременно.

### Создание рабочего пространства

_Рабочее пространство_ — это набор пакетов, которые используют один и тот же файл _Cargo.lock_ и одну выходную директорию. Давайте создадим проект с использованием рабочего пространства — мы будем использовать тривиальный код, чтобы сосредоточиться на структуре рабочего пространства. Существует несколько способов структурировать рабочее пространство, поэтому мы покажем только один распространённый вариант. У нас будет рабочее пространство, содержащее один бинарный крейт и две библиотеки. Бинарный крейт, который будет предоставлять основную функциональность, будет зависеть от двух библиотек. Одна библиотека будет предоставлять функцию `add_one`, а другая — функцию `add_two`. Эти три крейта будут частью одного рабочего пространства. Начнём с создания новой директории для рабочего пространства:

```console
$ mkdir add
$ cd add
```

Далее, в директории _add_, мы создадим файл _Cargo.toml_, который будет конфигурировать всё рабочее пространство. В этом файле не будет секции `[package]`. Вместо этого он начнётся с секции `[workspace]`, которая позволит нам добавлять участников (members) в рабочее пространство. Мы также специально укажем использовать последнюю и лучшую версию алгоритма резолвера Cargo в нашем рабочем пространстве, установив `resolver` в `"3"`.

<span class="filename">Имя файла: Cargo.toml</span>

```toml
{{#include ../listings/ch14-more-about-cargo/no-listing-01-workspace/add/Cargo.toml}}
```

Далее мы создадим бинарный крейт `adder`, выполнив `cargo new` внутри директории _add_:

<!-- manual-regeneration
cd listings/ch14-more-about-cargo/output-only-01-adder-crate/add
remove `members = ["adder"]` from Cargo.toml
rm -rf adder
cargo new adder
copy output below
-->

```console
$ cargo new adder
    Creating binary (application) `adder` package
      Adding `adder` as member of workspace at `file:///projects/add`
```

Запуск `cargo new` внутри рабочего пространства также автоматически добавляет вновь созданный пакет в ключ `members` в определении `[workspace]` в файле _Cargo.toml_ рабочего пространства, вот так:

```toml
{{#include ../listings/ch14-more-about-cargo/output-only-01-adder-crate/add/Cargo.toml}}
```

На этом этапе мы можем собрать рабочее пространство, выполнив `cargo build` в корневой директории _add_. Файлы в вашей директории _add_ должны выглядеть так:

```text
├── Cargo.lock
├── Cargo.toml
├── adder
│   ├── Cargo.toml
│   └── src
│       └── main.rs
└── target
```

Рабочее пространство имеет одну директорию _target_ на верхнем уровне, в которую будут помещаться скомпилированные артефакты; у пакета `adder` нет своей собственной директории _target_. Даже если мы запустим `cargo build` изнутри директории _adder_, скомпилированные артефакты всё равно окажутся в _add/target_, а не в _add/adder/target_. Cargo структурирует директорию _target_ в рабочем пространстве именно так, потому что крейты в рабочем пространстве должны зависеть друг от друга. Если бы у каждого крейта была своя директория _target_, каждому крейту пришлось бы перекомпилировать все остальные крейты в рабочем пространстве, чтобы разместить артефакты в своей собственной директории _target_. Используя одну общую директорию _target_, крейты могут избежать ненужных пересборок.

### Создание второго пакета в рабочем пространстве

Далее создадим ещё один пакет-участник в рабочем пространстве и назовём его `add_one`. Сгенерируем новый библиотечный крейт с именем `add_one`:

<!-- manual-regeneration
cd listings/ch14-more-about-cargo/output-only-02-add-one/add
remove `"add_one"` from `members` list in Cargo.toml
rm -rf add_one
cargo new add_one --lib
copy output below
-->

```console
$ cargo new add_one --lib
    Creating library `add_one` package
      Adding `add_one` as member of workspace at `file:///projects/add`
```

Теперь верхний _Cargo.toml_ будет включать путь _add_one_ в список `members`:

<span class="filename">Имя файла: Cargo.toml</span>

```toml
{{#include ../listings/ch14-more-about-cargo/no-listing-02-workspace-with-two-crates/add/Cargo.toml}}
```

Ваша директория _add_ теперь должна содержать эти директории и файлы:

```text
├── Cargo.lock
├── Cargo.toml
├── add_one
│   ├── Cargo.toml
│   └── src
│       └── lib.rs
├── adder
│   ├── Cargo.toml
│   └── src
│       └── main.rs
└── target
```

В файле _add_one/src/lib.rs_ добавим функцию `add_one`:

<span class="filename">Имя файла: add_one/src/lib.rs</span>

```rust,noplayground
{{#rustdoc_include ../listings/ch14-more-about-cargo/no-listing-02-workspace-with-two-crates/add/add_one/src/lib.rs}}
```

Теперь мы можем сделать так, чтобы пакет `adder` с нашим бинарным крейтом зависел от пакета `add_one` с нашей библиотекой. Сначала нам нужно добавить зависимость по пути (path dependency) на `add_one` в файл _adder/Cargo.toml_.

<span class="filename">Имя файла: adder/Cargo.toml</span>

```toml
{{#include ../listings/ch14-more-about-cargo/no-listing-02-workspace-with-two-crates/add/adder/Cargo.toml:6:7}}
```

Cargo не предполагает, что крейты в рабочем пространстве будут зависеть друг от друга, поэтому нам нужно явно указать отношения зависимостей.

Далее давайте используем функцию `add_one` (из крейта `add_one`) в крейте `adder`. Откройте файл _adder/src/main.rs_ и измените функцию `main` так, чтобы она вызывала функцию `add_one`, как в Листинге 14-7.

<Listing number="14-7" file-name="adder/src/main.rs" caption="Использование библиотечного крейта `add_one` в крейте `adder`">

```rust,ignore
{{#rustdoc_include ../listings/ch14-more-about-cargo/listing-14-07/add/adder/src/main.rs}}
```

</Listing>

Давайте соберём рабочее пространство, выполнив `cargo build` в верхней директории _add_!

<!-- manual-regeneration
cd listings/ch14-more-about-cargo/listing-14-07/add
cargo build
copy output below; the output updating script doesn't handle subdirectories in paths properly
-->

```console
$ cargo build
   Compiling add_one v0.1.0 (file:///projects/add/add_one)
   Compiling adder v0.1.0 (file:///projects/add/adder)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.22s
```

Чтобы запустить бинарный крейт из директории _add_, мы можем указать, какой пакет в рабочем пространстве мы хотим запустить, используя аргумент `-p` и имя пакета с `cargo run`:

<!-- manual-regeneration
cd listings/ch14-more-about-cargo/listing-14-07/add
cargo run -p adder
copy output below; the output updating script doesn't handle subdirectories in paths properly
-->

```console
$ cargo run -p adder
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.00s
     Running `target/debug/adder`
Hello, world! 10 plus one is 11!
```

Это запускает код в _adder/src/main.rs_, который зависит от крейта `add_one`.

#### Зависимость от внешнего пакета в рабочем пространстве

Обратите внимание, что рабочее пространство имеет только один файл _Cargo.lock_ на верхнем уровне, а не по _Cargo.lock_ в каждой директории крейта. Это гарантирует, что все крейты используют одну и ту же версию всех зависимостей. Если мы добавим пакет `rand` в файлы _adder/Cargo.toml_ и _add_one/Cargo.toml_, Cargo разрешит обе зависимости к одной версии `rand` и запишет это в один _Cargo.lock_. Обеспечение использования всеми крейтами в рабочем пространстве одних и тех же зависимостей означает, что крейты всегда будут совместимы друг с другом. Давайте добавим крейт `rand` в секцию `[dependencies]` в файле _add_one/Cargo.toml_, чтобы мы могли использовать крейт `rand` в крейте `add_one`:

<!-- When updating the version of `rand` used, also update the version of
`rand` used in these files so they all match:
* ch02-00-guessing-game-tutorial.md
* ch07-04-bringing-paths-into-scope-with-the-use-keyword.md
-->

<span class="filename">Имя файла: add_one/Cargo.toml</span>

```toml
{{#include ../listings/ch14-more-about-cargo/no-listing-03-workspace-with-external-dependency/add/add_one/Cargo.toml:6:7}}
```

Теперь мы можем добавить `use rand;` в файл _add_one/src/lib.rs_, и сборка всего рабочего пространства выполненная `cargo build` в директории _add_ подтянет и скомпилирует крейт `rand`. Мы получим одно предупреждение, потому что не используем импортированный `rand`:

<!-- manual-regeneration
cd listings/ch14-more-about-cargo/no-listing-03-workspace-with-external-dependency/add
cargo build
copy output below; the output updating script doesn't handle subdirectories in paths properly
-->

```console
$ cargo build
    Updating crates.io index
  Downloaded rand v0.8.5
   --snip--
   Compiling rand v0.8.5
   Compiling add_one v0.1.0 (file:///projects/add/add_one)
warning: unused import: `rand`
 --> add_one/src/lib.rs:1:5
  |
1 | use rand;
  |     ^^^^
  |
  = note: `#[warn(unused_imports)]` on by default

warning: `add_one` (lib) generated 1 warning (run `cargo fix --lib -p add_one` to apply 1 suggestion)
   Compiling adder v0.1.0 (file:///projects/add/adder)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.95s
```

Верхний _Cargo.lock_ теперь содержит информацию о зависимости `add_one` от `rand`. Однако, хотя `rand` используется где-то в рабочем пространстве, мы не можем использовать его в других крейтах в рабочем пространстве, если не добавим `rand` и в их файлы _Cargo.toml_. Например, если мы добавим `use rand;` в файл _adder/src/main.rs_ для пакета `adder`, мы получим ошибку:

<!-- manual-regeneration
cd listings/ch14-more-about-cargo/output-only-03-use-rand/add
cargo build
copy output below; the output updating script doesn't handle subdirectories in paths properly
-->

```console
$ cargo build
  --snip--
   Compiling adder v0.1.0 (file:///projects/add/adder)
error[E0432]: unresolved import `rand`
 --> adder/src/main.rs:2:5
  |
2 | use rand;
  |     ^^^^ no external crate `rand`
```

Чтобы исправить это, отредактируйте файл _Cargo.toml_ для пакета `adder` и укажите, что `rand` также является для него зависимостью. Сборка пакета `adder` добавит `rand` в список зависимостей для `adder` в _Cargo.lock_, но дополнительные копии `rand` загружаться не будут. Cargo гарантирует, что каждый крейт в каждом пакете рабочего пространства, использующий пакет `rand`, будет использовать одну и ту же версию, при условии что они указывают совместимые версии `rand`, экономя место и обеспечивая совместимость крейтов в рабочем пространстве.

Если крейты в рабочем пространстве указывают несовместимые версии одной и той же зависимости, Cargo разрешит каждую из них, но всё равно попытается разрешить как можно меньше версий.

Обратите внимание, что Cargo обеспечивает совместимость только в рамках правил [Семантического версионирования]. Например, предположим, что в рабочем пространстве один крейт зависит от `rand` 0.8.0, а другой — от `rand` 0.8.1. Правила semver говорят, что 0.8.1 совместим с 0.8.0, поэтому оба крейта будут зависеть от 0.8.1 (или потенциально более позднего патча, например, 0.8.2). Но если один крейт зависит от `rand` 0.7.0, а другой — от `rand` 0.8.0, эти версии семантически несовместимы. Следовательно, Cargo будет использовать разные версии `rand` для каждого крейта.

#### Добавление теста в рабочее пространство

В качестве ещё одного улучшения давайте добавим тест функции `add_one::add_one` внутри крейта `add_one`:

<span class="filename">Имя файла: add_one/src/lib.rs</span>

```rust,noplayground
{{#rustdoc_include ../listings/ch14-more-about-cargo/no-listing-04-workspace-with-tests/add/add_one/src/lib.rs}}
```

Теперь запустите `cargo test` в верхней директории _add_. Запуск `cargo test` в рабочем пространстве, структурированном подобно этому, выполнит тесты для всех крейтов в рабочем пространстве:

<!-- manual-regeneration
cd listings/ch14-more-about-cargo/no-listing-04-workspace-with-tests/add
cargo test
copy output below; the output updating script doesn't handle subdirectories in
paths properly
-->

```console
$ cargo test
   Compiling add_one v0.1.0 (file:///projects/add/add_one)
   Compiling adder v0.1.0 (file:///projects/add/adder)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.20s
     Running unittests src/lib.rs (target/debug/deps/add_one-93c49ee75dc46543)

running 1 test
test tests::it_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/adder-3a47283c568d2b6a)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests add_one

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

Первая часть вывода показывает, что тест `it_works` в крейте `add_one` прошёл. Следующая часть показывает, что в крейте `adder` не было найдено тестов, а последняя часть показывает, что не было найдено документационных тестов в крейте `add_one`.

Мы также можем запускать тесты для одного конкретного крейта в рабочем пространстве из верхней директории, используя флаг `-p` и указывая имя крейта, который мы хотим протестировать:

<!-- manual-regeneration
cd listings/ch14-more-about-cargo/no-listing-04-workspace-with-tests/add
cargo test -p add_one
copy output below; the output updating script doesn't handle subdirectories in paths properly
-->

```console
$ cargo test -p add_one
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.00s
     Running unittests src/lib.rs (target/debug/deps/add_one-93c49ee75dc46543)

running 1 test
test tests::it_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests add_one

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

Этот вывод показывает, что `cargo test` запустил тесты только для крейта `add_one` и не запускал тесты для крейта `adder`.

Если вы публикуете крейты в рабочем пространстве на [crates.io](https://crates.io/), каждый крейт в рабочем пространстве нужно будет публиковать отдельно. Как и `cargo test`, мы можем опубликовать конкретный крейт в нашем рабочем пространстве, используя флаг `-p` и указав имя крейта, который мы хотим опубликовать.

Для дополнительной практики добавьте крейт `add_two` в это рабочее пространство подобно крейту `add_one`!

По мере роста вашего проекта рассмотрите возможность использования рабочего пространства: оно позволяет работать с более мелкими, легкими для понимания компонентами, вместо одного большого куска кода. Более того, хранение крейтов в рабочем пространстве может облегчить координацию между крейтами, если они часто изменяются одновременно.

{{#quiz ../quizzes/ch14-03-cargo-workspaces.toml}}

[Семантическое версионирование]: https://semver.org/