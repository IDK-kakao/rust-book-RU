## Приложение D - Полезные инструменты разработки

В этом приложении мы рассмотрим некоторые полезные инструменты разработки, которые предоставляет проект Rust. Мы посмотрим на автоматическое форматирование, быстрые способы применения исправлений предупреждений, линтер и интеграцию с IDE.

### Автоматическое форматирование с помощью `rustfmt`

Инструмент `rustfmt` переформатирует ваш код в соответствии с общепринятым стилем кода. Многие совместные проекты используют `rustfmt`, чтобы избежать споров о том, какой стиль использовать при написании кода на Rust: каждый форматирует свой код с помощью этого инструмента.

Установки Rust по умолчанию включают rustfmt, поэтому у вас уже должны быть программы `rustfmt` и `cargo-fmt`. Эти две команды аналогичны `rustc` и `cargo` в том смысле, что `rustfmt` позволяет более детальный контроль, а `cargo-fmt` понимает соглашения проекта, использующего Cargo. Чтобы отформатировать любой проект Cargo, введите следующее:

```sh
$ cargo fmt
```

Запуск этой команды переформатирует весь код Rust в текущем крейте. Это должно изменить только стиль кода, а не его семантику.

Эта команда даёт вам `rustfmt` и `cargo-fmt`, аналогично тому, как Rust даёт вам и `rustc`, и `cargo`. Чтобы отформатировать любой проект Cargo, введите следующее:

```console
$ cargo fmt
```

Запуск этой команды переформатирует весь код Rust в текущем крейте. Это должно изменить только стиль кода, а не его семантику. Для получения дополнительной информации о `rustfmt`, см. [его документацию][rustfmt].

[rustfmt]: https://github.com/rust-lang/rustfmt

### Исправляйте код с помощью `rustfix`

Инструмент `rustfix` включён в установки Rust и может автоматически исправлять предупреждения компилятора, у которых есть очевидный способ исправить проблему, который, скорее всего, именно то, что вам нужно. Вы, вероятно, уже видели предупреждения компилятора. Например, рассмотрим этот код:

<span class="filename">Имя файла: src/main.rs</span>

```rust
fn main() {
    let mut x = 42;
    println!("{x}");
}
```

Здесь мы определяем переменную `x` как изменяемую, но никогда не изменяем её на самом деле. Rust предупреждает нас об этом:

```console
$ cargo build
   Compiling myprogram v0.1.0 (file:///projects/myprogram)
warning: variable does not need to be mutable
 --> src/main.rs:2:9
  |
2 |     let mut x = 0;
  |         ----^
  |         |
  |         help: remove this `mut`
  |
  = note: `#[warn(unused_mut)]` on by default
```

Предупреждение предлагает удалить ключевое слово `mut`. Мы можем автоматически применить это предложение, используя инструмент `rustfix`, запустив команду `cargo fix`:

```console
$ cargo fix
    Checking myprogram v0.1.0 (file:///projects/myprogram)
      Fixing src/main.rs (1 fix)
    Finished dev [unoptimized + debuginfo] target(s) in 0.59s
```

Когда мы снова посмотрим на _src/main.rs_, мы увидим, что `cargo fix` изменил код:

<span class="filename">Имя файла: src/main.rs</span>

```rust
fn main() {
    let x = 42;
    println!("{x}");
}
```

Переменная `x` теперь неизменяема, и предупреждение больше не появляется.

Вы также можете использовать команду `cargo fix` для перехода вашего кода между разными редакциями Rust. Редакции рассматриваются в [Приложении E][editions].

### Больше линтов с Clippy

Инструмент Clippy — это коллекция линтов для анализа вашего кода, чтобы вы могли отлавливать распространённые ошибки и улучшать ваш код на Rust. Clippy включён в стандартные установки Rust.

Чтобы запустить линты Clippy на любом проекте Cargo, введите следующее:

```console
$ cargo clippy
```

Например, представьте, что вы написали программу, которая использует приближение математической константы, такой как пи, как это делает эта программа:

<Listing file-name="src/main.rs">

```rust
fn main() {
    let x = 3.1415;
    let r = 8.0;
    println!("the area of the circle is {}", x * r * r);
}
```

</Listing>

Запуск `cargo clippy` на этом проекте приводит к этой ошибке:

```text
error: approximate value of `f{32, 64}::consts::PI` found
 --> src/main.rs:2:13
  |
2 |     let x = 3.1415;
  |             ^^^^^^
  |
  = note: `#[deny(clippy::approx_constant)]` on by default
  = help: consider using the constant directly
  = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#approx_constant
```

Эта ошибка сообщает вам, что в Rust уже определена более точная константа `PI`, и ваша программа была бы более корректной, если бы вы использовали эту константу. Затем вы измените свой код, чтобы использовать константу `PI`. Следующий код не приводит к ошибкам или предупреждениям от Clippy:

<Listing file-name="src/main.rs">

```rust
fn main() {
    let x = std::f64::consts::PI;
    let r = 8.0;
    println!("the area of the circle is {}", x * r * r);
}
```

</Listing>

Для получения дополнительной информации о Clippy, см. [его документацию][clippy].

[clippy]: https://github.com/rust-lang/rust-clippy

### Интеграция с IDE с помощью `rust-analyzer`

Для помощи в интеграции с IDE сообщество Rust рекомендует использовать [`rust-analyzer`][rust-analyzer]<!-- ignore -->. Этот инструмент — это набор утилит, ориентированных на компилятор, который говорит на [Language Server Protocol][lsp]<!-- ignore -->, что представляет собой спецификацию для взаимодействия IDE и языков программирования. Разные клиенты могут использовать `rust-analyzer`, например [плагин Rust analyzer для Visual Studio Code][vscode].

[lsp]: http://langserver.org/
[vscode]: https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer

Посетите [домашнюю страницу][rust-analyzer]<!-- ignore --> проекта `rust-analyzer` для инструкций по установке, затем установите поддержку language server в вашу конкретную IDE. Ваша IDE получит такие возможности, как автодополнение, переход к определению и встроенные ошибки.

[rust-analyzer]: https://rust-analyzer.github.io
[editions]: appendix-05-editions.md