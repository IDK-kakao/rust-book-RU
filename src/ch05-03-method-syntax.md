## Синтаксис методов

_Методы_ похожи на функции: мы объявляем их с помощью ключевого слова `fn` и имени, они могут иметь параметры и возвращаемое значение, а также содержат код, который выполняется при вызове метода из другого места. В отличие от функций, методы определяются в контексте структуры (или перечисления, или объекта типажа, которые мы рассматриваем в [Главе 6][enums]<!-- ignore --> и [Главе 18][trait-objects]<!-- ignore --> соответственно), и их первый параметр всегда `self`, который представляет экземпляр структуры, для которого вызывается метод.

### Определение методов

Давайте изменим функцию `area`, которая принимает экземпляр `Rectangle` в качестве параметра, и вместо этого сделаем метод `area`, определённый для структуры `Rectangle`, как показано в Листинге 5-13.

<Listing number="5-13" file-name="src/main.rs" caption="Определение метода `area` для структуры `Rectangle`">

```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-13/src/main.rs}}
```

</Listing>

Чтобы определить функцию в контексте `Rectangle`, мы начинаем блок `impl` (реализации) для `Rectangle`. Всё внутри этого блока `impl` будет связано с типом `Rectangle`. Затем мы перемещаем функцию `area` внутрь фигурных скобок `impl` и меняем первый (и в данном случае единственный) параметр на `self` в сигнатуре и во всём теле. В `main`, где мы вызывали функцию `area` и передавали `rect1` в качестве аргумента, мы можем вместо этого использовать _синтаксис методов_ для вызова метода `area` на нашем экземпляре `Rectangle`. Синтаксис методов идёт после экземпляра: мы добавляем точку, затем имя метода, круглые скобки и любые аргументы.

В сигнатуре `area` мы используем `&self` вместо `rectangle: &Rectangle`. `&self` на самом деле является сокращением для `self: &Self`. Внутри блока `impl` тип `Self` является псевдонимом для типа, для которого предназначен блок `impl`. Методы должны иметь параметр с именем `self` типа `Self` в качестве своего первого параметра, поэтому Rust позволяет сократить это, используя только имя `self` в позиции первого параметра. Обратите внимание, что нам всё ещё нужно использовать `&` перед сокращением `self`, чтобы указать, что этот метод заимствует экземпляр `Self`, как мы это делали в `rectangle: &Rectangle`. Методы могут принимать владение `self`, заимствовать `self` неизменно, как мы сделали здесь, или заимствовать `self` изменяемо, как и любой другой параметр.

Мы выбрали `&self` здесь по той же причине, по которой использовали `&Rectangle` в версии функции: мы не хотим принимать владение, а просто хотим прочитать данные в структуре, не записывая в неё. Если бы мы хотели изменить экземпляр, для которого вызывается метод, в рамках того, что делает метод, мы бы использовали `&mut self` в качестве первого параметра. Наличие метода, который принимает владение экземпляром, используя только `self` в качестве первого параметра, встречается редко; эта техника обычно используется, когда метод преобразует `self` во что-то ещё, и вы хотите предотвратить использование исходного экземпляра вызывающей стороной после преобразования.

Основная причина использования методов вместо функций, помимо предоставления синтаксиса методов и необходимости повторять тип `self` в сигнатуре каждого метода, — это организация. Мы поместили всё, что мы можем делать с экземпляром типа, в один блок `impl`, а не заставляем будущих пользователей нашего кода искать возможности `Rectangle` в различных местах в предоставляемой нами библиотеке.

Обратите внимание, что мы можем дать методу то же имя, что и у одного из полей структуры. Например, мы можем определить метод для `Rectangle`, который также называется `width`:

<Listing file-name="src/main.rs">

```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/no-listing-06-method-field-interaction/src/main.rs:here}}
```

</Listing>

Здесь мы выбираем, чтобы метод `width` возвращал `true`, если значение в поле `width` экземпляра больше `0`, и `false`, если значение равно `0`: мы можем использовать поле внутри метода с таким же именем для любой цели. В `main`, когда мы добавляем круглые скобки после `rect1.width`, Rust понимает, что мы имеем в виду метод `width`. Когда мы не используем круглые скобки, Rust понимает, что мы имеем в виду поле `width`.

Часто, но не всегда, когда мы даём методу то же имя, что и у поля, мы хотим, чтобы он просто возвращал значение в поле и ничего больше не делал. Такие методы называются _геттерами_, и Rust не реализует их автоматически для полей структур, как это делают некоторые другие языки. Геттеры полезны, потому что вы можете сделать поле приватным, а метод публичным, и таким образом обеспечить доступ только для чтения к этому полю как часть публичного API типа. Мы обсудим, что такое публичное и приватное и как обозначить поле или метод как публичный или приватный в [Главе 7][public]<!-- ignore -->.

### Методы с дополнительными параметрами

Давайте потренируемся в использовании методов, реализовав второй метод для структуры `Rectangle`. На этот раз мы хотим, чтобы экземпляр `Rectangle` принимал другой экземпляр `Rectangle` и возвращал `true`, если второй `Rectangle` может полностью поместиться внутри `self` (первого `Rectangle`); в противном случае он должен вернуть `false`. То есть, как только мы определим метод `can_hold`, мы хотим иметь возможность написать программу, показанную в Листинге 5-14.

<Listing number="5-14" file-name="src/main.rs" caption="Использование ещё не написанного метода `can_hold`">

```rust,ignore
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-14/src/main.rs}}
```

</Listing>

Ожидаемый вывод будет выглядеть следующим образом, потому что обе размерности `rect2` меньше размерностей `rect1`, но `rect3` шире, чем `rect1`:

```text
Can rect1 hold rect2? true
Can rect1 hold rect3? false
```

Мы знаем, что хотим определить метод, поэтому он будет внутри блока `impl Rectangle`. Имя метода будет `can_hold`, и он будет принимать неизменяемую ссылку на другой `Rectangle` в качестве параметра. Мы можем определить тип параметра, посмотрев на код, который вызывает метод: `rect1.can_hold(&rect2)` передаёт `&rect2`, что является неизменяемой ссылкой на `rect2`, экземпляр `Rectangle`. Это имеет смысл, потому что нам нужно только читать `rect2` (а не записывать, что означало бы необходимость изменяемой ссылки), и мы хотим, чтобы `main` сохранил владение `rect2`, чтобы мы могли использовать его снова после вызова метода `can_hold`. Возвращаемое значение `can_hold` будет логическим, а реализация проверит, что ширина и высота `self` больше, чем ширина и высота другого `Rectangle` соответственно. Давайте добавим новый метод `can_hold` в блок `impl` из Листинга 5-13, показанный в Листинге 5-15.

<Listing number="5-15" file-name="src/main.rs" caption="Реализация метода `can_hold` на `Rectangle`, который принимает другой экземпляр `Rectangle` в качестве параметра">

```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-15/src/main.rs:here}}
```

</Listing>

Когда мы запустим этот код с функцией `main` из Листинга 5-14, мы получим желаемый вывод. Методы могут принимать несколько параметров, которые мы добавляем в сигнатуру после параметра `self`, и эти параметры работают точно так же, как параметры в функциях.


### Ассоциированные функции

Все функции, определённые внутри блока `impl`, называются _ассоциированными функциями_, потому что они связаны с типом, указанным после `impl`. Мы можем определить ассоциированные функции как функции, у которых нет `self` в качестве первого параметра (и, следовательно, не являются методами), потому что им не нужен экземпляр типа для работы. Мы уже использовали одну такую функцию: функция `String::from`, определённая для типа `String`.

Ассоциированные функции, которые не являются методами, часто используются для конструкторов, которые будут возвращать новый экземпляр структуры. Их часто называют `new`, но `new` — это не специальное имя и не встроено в язык. Например, мы могли бы предоставить ассоциированную функцию с именем `square`, которая бы имела один параметр размерности и использовала его как для ширины, так и для высоты, тем самым упрощая создание квадратного `Rectangle`, вместо того чтобы указывать одно и то же значение дважды:

<span class="filename">Имя файла: src/main.rs</span>

```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/no-listing-03-associated-functions/src/main.rs:here}}
```

Ключевые слова `Self` в возвращаемом типе и в теле функции являются псевдонимами для типа, который появляется после ключевого слова `impl`, который в данном случае — `Rectangle`.

Чтобы вызвать эту ассоциированную функцию, мы используем синтаксис `::` с именем структуры; `let sq = Rectangle::square(3);` — это пример. Эта функция пространства имён структуры: синтаксис `::` используется как для ассоциированных функций, так и для пространств имён, создаваемых модулями. Мы обсудим модули в [Главе 7][modules]<!-- ignore -->.

### Несколько блоков `impl`

Каждой структуре разрешено иметь несколько блоков `impl`. Например, Листинг 5-15 эквивалентен коду, показанному в Листинге 5-16, где каждый метод находится в своём блоке `impl`.

<Listing number="5-16" caption="Переписывание Листинга 5-15 с использованием нескольких блоков `impl`">

```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing-05-16/src/main.rs:here}}
```

</Listing>

Здесь нет причины разделять эти методы на несколько блоков `impl`, но это допустимый синтаксис. Мы увидим случай, когда несколько блоков `impl` полезны, в Главе 10, где мы обсудим обобщённые типы и типажи.

### Вызовы методов — это синтаксический сахар для вызовов функций

Используя концепции, которые мы обсудили до сих пор, мы теперь можем увидеть, как вызовы методов являются синтаксическим сахаром для вызовов функций. Например, предположим, что у нас есть структура прямоугольника с методом `area` и методом `set_width`:

```rust,ignore
# struct Rectangle {
#     width: u32,
#     height: u32,
# }
# 
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn set_width(&mut self, width: u32) {
        self.width = width;
    }
}
```

И предположим, что у нас есть прямоугольник `r`. Тогда вызовы методов `r.area()` и `r.set_width(2)` эквивалентны этому:

```rust
# struct Rectangle {
#     width: u32,
#     height: u32,
# }
# 
# impl Rectangle {
#     fn area(&self) -> u32 {
#        self.width * self.height
#      }
# 
#     fn set_width(&mut self, width: u32) {
#         self.width = width;
#     }
# }
# 
# fn main() {
    let mut r = Rectangle { 
        width: 1,
        height: 2
    };
    let area1 = r.area();
    let area2 = Rectangle::area(&r);
    assert_eq!(area1, area2);

    r.set_width(2);
    Rectangle::set_width(&mut r, 2);
# }
```

Вызов метода `r.area()` становится `Rectangle::area(&r)`. Имя функции — это ассоциированная функция `Rectangle::area`. Аргумент функции — это параметр `&self`. Rust автоматически вставляет оператор заимствования `&`.

> *Примечание:* если вы знакомы с C или C++, вы привыкли к двум разным синтаксисам для вызовов методов: `r.area()` и `r->area()`. У Rust нет эквивалента оператору стрелки `->`. Rust автоматически ссылается и разыменовывает получатель метода при использовании оператора точки.

Вызов метода `r.set_width(2)` аналогично становится `Rectangle::set_width(&mut r, 2)`. Этот метод ожидает `&mut self`, поэтому первый аргумент — изменяемая ссылка `&mut r`. Второй аргумент точно такой же, число 2.

Как мы описали в Главе 4.2 ["Разыменование указателя даёт доступ к его данным"](ch04-02-references-and-borrowing.html#dereferencing-a-pointer-accesses-its-data), Rust вставит столько ссылок и разыменований, сколько нужно, чтобы типы совпали для параметра `self`. Например, вот два эквивалентных вызова `area` для изменяемой ссылки на коробчатый прямоугольник:

```rust
# struct Rectangle {
#     width: u32,
#     height: u32,
# }
# 
# impl Rectangle {
#     fn area(&self) -> u32 {
#        self.width * self.height
#      }
# 
#     fn set_width(&mut self, width: u32) {
#         self.width = width;
#     }
# }
# fn main() {
    let r = &mut Box::new(Rectangle { 
        width: 1,
        height: 2
    });
    let area1 = r.area();
    let area2 = Rectangle::area(&**r);
    assert_eq!(area1, area2);
# }
```

Rust добавит два разыменования (один для изменяемой ссылки, один для коробки), а затем одну неизменяемую ссылку, потому что `area` ожидает `&Rectangle`. Обратите внимание, что это также ситуация, когда изменяемая ссылка "понижается" до общей ссылки, как мы обсуждали в [Главе 4.2](ch04-02-references-and-borrowing.html#mutable-references-provide-unique-and-non-owning-access-to-data). И наоборот, вам не будет разрешено вызвать `set_width` на значении типа `&Rectangle` или `&Box<Rectangle>`.

{{#quiz ../quizzes/ch05-03-method-syntax-sec1.toml}}


### Методы и владение

Как мы обсуждали в Главе 4.2 ["Ссылки и заимствование"](ch04-02-references-and-borrowing.html), методы должны вызываться для структур, которые имеют необходимые права. В качестве работающего примера мы будем использовать эти три метода, которые принимают `&self`, `&mut self` и `self` соответственно.

```rust,ignore
impl Rectangle {    
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn set_width(&mut self, width: u32) {
        self.width = width;
    }

    fn max(self, other: Rectangle) -> Rectangle {
        Rectangle { 
            width: self.width.max(other.width),
            height: self.height.max(other.height),
        }
    }
}
```

#### Чтение и запись с `&self` и `&mut self`

Если мы создаём владеющий прямоугольник с `let rect = Rectangle { ... }`, то `rect` имеет права @Perm{read} и @Perm{own}. С этими правами допустимо вызвать методы `area` и `max`:

```aquascope,permissions,boundaries,stepper
#struct Rectangle {
#    width: u32,
#    height: u32,
#}
#impl Rectangle {    
#  fn area(&self) -> u32 {
#    self.width * self.height
#  }
#
#  fn set_width(&mut self, width: u32) {
#    self.width = width;
#  }
#
#  fn max(self, other: Self) -> Self {
#    let w = self.width.max(other.width);
#    let h = self.height.max(other.height);
#    Rectangle { 
#      width: w,
#      height: h
#    }
#  }
#}
#fn main() {
let rect = Rectangle {
    width: 0,
    height: 0
};`(focus,rxpaths:^rect$)`
println!("{}", rect.area());`{}`

let other_rect = Rectangle { width: 1, height: 1 };
let max_rect = rect.max(other_rect);`{}`
#}
```

Однако, если мы попытаемся вызвать `set_width`, у нас не хватает права @Perm{write}:

```aquascope,permissions,boundaries,shouldFail
#struct Rectangle {
#    width: u32,
#    height: u32,
#}
#impl Rectangle {    
#  fn area(&self) -> u32 {
#    self.width * self.height
#  }
#
#  fn set_width(&mut self, width: u32) {
#    self.width = width;
#  }
#
#  fn max(self, other: Self) -> Self {
#    let w = self.width.max(other.width);
#    let h = self.height.max(other.height);
#    Rectangle { 
#      width: w,
#      height: h
#    }
#  }
#}
#fn main() {
let rect = Rectangle {
    width: 0,
    height: 0
};
rect.set_width(0);`{}`
#}
```

Rust отклонит эту программу с соответствующим сообщением об ошибке:

```text
error[E0596]: cannot borrow `rect` as mutable, as it is not declared as mutable
  --> test.rs:28:1
   |
24 | let rect = Rectangle {
   |     ---- help: consider changing this to be mutable: `mut rect`
...
28 | rect.set_width(0);
   | ^^^^^^^^^^^^^^^^^ cannot borrow as mutable
```

Мы получим аналогичную ошибку, если попытаемся вызвать `set_width` на неизменяемой ссылке на `Rectangle`, даже если базовый прямоугольник изменяем:

```aquascope,permissions,boundaries,stepper,shouldFail
#struct Rectangle {
#    width: u32,
#    height: u32,
#}
#impl Rectangle {    
#  fn area(&self) -> u32 {
#    self.width * self.height
#  }
#
#  fn set_width(&mut self, width: u32) {
#    self.width = width;
#  }
#
#  fn max(self, other: Self) -> Self {
#    let w = self.width.max(other.width);
#    let h = self.height.max(other.height);
#    Rectangle { 
#      width: w,
#      height: h
#    }
#  }
#}
#fn main() {
// Added the mut keyword to the let-binding
let mut rect = Rectangle {
    width: 0,
    height: 0
};`(focus,rxpaths:^rect$)`
rect.set_width(1);`{}`     // this is now ok

let rect_ref = &rect;`(focus,rxpaths:^\*rect_ref$)`
rect_ref.set_width(2);`{}` // but this is still not ok
#}
```

#### Перемещения с `self`

Вызов метода, который ожидает `self`, переместит входную структуру (если только структура не реализует `Copy`). Например, мы не можем использовать `Rectangle` после передачи его в `max`:

```aquascope,permissions,boundaries,stepper,shouldFail
#struct Rectangle {
#    width: u32,
#    height: u32,
#}
#impl Rectangle {    
#  fn area(&self) -> u32 {
#    self.width * self.height
#  }
#
#  fn set_width(&mut self, width: u32) {
#    self.width = width;
#  }
#
#  fn max(self, other: Self) -> Self {
#    let w = self.width.max(other.width);
#    let h = self.height.max(other.height);
#    Rectangle { 
#      width: w,
#      height: h
#    }
#  }
#}
#fn main() {
let rect = Rectangle {
    width: 0,
    height: 0
};`(focus,rxpaths:^rect$)`
let other_rect = Rectangle { 
    width: 1, 
    height: 1 
};
let max_rect = rect.max(other_rect);`(focus,rxpaths:^rect$)`
println!("{}", rect.area());`{}`
#}
```

Как только мы вызываем `rect.max(..)`, мы перемещаем `rect` и теряем все права на него. Попытка скомпилировать эту программу даст нам следующую ошибку:

```text
error[E0382]: borrow of moved value: `rect`
  --> test.rs:33:16
   |
24 | let rect = Rectangle {
   |     ---- move occurs because `rect` has type `Rectangle`, which does not implement the `Copy` trait
...
32 | let max_rect = rect.max(other_rect);
   |                     --------------- `rect` moved due to this method call
33 | println!("{}", rect.area());
   |                ^^^^^^^^^^^ value borrowed here after move
```

Аналогичная ситуация возникает, если мы пытаемся вызвать метод `self` на ссылку. Например, предположим, что мы попытались сделать метод `set_to_max`, который присваивает `self` результату `self.max(..)`:

```aquascope,permissions,boundaries,stepper,shouldFail
#struct Rectangle {
#    width: u32,
#    height: u32,
#}
impl Rectangle {    
#  fn area(&self) -> u32 {
#    self.width * self.height
#  }
#
#  fn set_width(&mut self, width: u32) {
#    self.width = width;
#  }
#
#  fn max(self, other: Self) -> Self {
#    let w = self.width.max(other.width);
#    let h = self.height.max(other.height);
#    Rectangle { 
#      width: w,
#      height: h
#    }
#  }
    fn set_to_max(&mut self, other: Rectangle) {`(focus,rxpaths:^\*self$)`
        *self = self.max(other);`{}`
    }
}
```

Тогда мы можем видеть, что `self` не имеет прав @Perm{own} в операции `self.max(..)`. Поэтому Rust отклоняет эту программу со следующим сообщением об ошибке:

```text
error[E0507]: cannot move out of `*self` which is behind a mutable reference
  --> test.rs:23:17
   |
23 |         *self = self.max(other);
   |                 ^^^^^----------
   |                 |    |
   |                 |    `*self` moved due to this method call
   |                 move occurs because `*self` has type `Rectangle`, which does not implement the `Copy` trait
   |
```

Это тот же тип ошибки, который мы обсуждали в Главе 4.3 ["Копирование против перемещения из коллекции"](ch04-03-fixing-ownership-errors.html#fixing-an-unsafe-program-copying-vs-moving-out-of-a-collection).

#### Хорошие перемещения и плохие перемещения

Вы можете спросить: почему имеет значение, перемещаем ли мы из `*self`? На самом деле, для случая `Rectangle` это безопасно перемещать из `*self`, хотя Rust не позволяет вам этого сделать. Например, если мы смоделируем программу, которая вызывает отклонённый `set_to_max`, вы можете видеть, что ничего небезопасного не происходит:

```aquascope,interpreter,shouldFail,horizontal
#struct Rectangle {
#    width: u32,
#    height: u32,
#}
impl Rectangle {    
#  fn max(self, other: Self) -> Self {
#    let w = self.width.max(other.width);
#    let h = self.height.max(other.height);
#    Rectangle { 
#      width: w,
#      height: h
#    }
#  }
    fn set_to_max(&mut self, other: Rectangle) {
        `[]`let max = self.max(other);`[]`
        *self = max;
    }
}

fn main() {
    let mut rect = Rectangle { width: 0, height: 1 };
    let other_rect = Rectangle { width: 1, height: 0 };`[]`
    rect.set_to_max(other_rect);`[]`
}
```

Причина, по которой безопасно перемещать из `*self`, заключается в том, что `Rectangle` не владеет данными в куче. На самом деле, мы можем заставить Rust скомпилировать `set_to_max`, просто добавив `#[derive(Copy, Clone)]` к определению `Rectangle`:

```aquascope,permissions,boundaries,stepper
\#[derive(Copy, Clone)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {    
#  fn max(self, other: Self) -> Self {
#    let w = self.width.max(other.width);
#    let h = self.height.max(other.height);
#    Rectangle { 
#      width: w,
#      height: h
#    }
#  }
    fn set_to_max(&mut self, other: Rectangle) {`(focus,rxpaths:^\*self$)`
        *self = self.max(other);`{}`
    }
}
```

Обратите внимание, что в отличие от предыдущего случая, `self.max(other)` больше не требует права @Perm{own} на `*self` или `other`. Помните, что `self.max(other)` раскрывается в `Rectangle::max(*self, other)`. Разыменование `*self` не требует владения над `*self`, если `Rectangle` копируем.

Вы можете спросить: почему Rust не автоматически выводит `Copy` для `Rectangle`? Rust не автоматически выводит `Copy` для стабильности при изменениях API. Представьте, что автор типа `Rectangle` решил добавить поле `name: String`. Тогда весь клиентский код, который полагается на то, что `Rectangle` является `Copy`, внезапно будет отклонён компилятором. Чтобы избежать этой проблемы, авторы API должны явно добавить `#[derive(Copy)]`, чтобы указать, что они ожидают, что их структура всегда будет `Copy`.

Чтобы лучше понять проблему, давайте запустим симуляцию. Допустим, мы добавили `name: String` в `Rectangle`. Что произойдёт, если Rust разрешит компиляцию `set_to_max`?

```aquascope,interpreter,shouldFail,horizontal
struct Rectangle {
    width: u32,
    height: u32,
    name: String,
}

impl Rectangle {    
#  fn max(self, other: Self) -> Self {
#    let w = self.width.max(other.width);
#    let h = self.height.max(other.height);
#    Rectangle { 
#      width: w,
#      height: h,
#      name: String::from("max")
#    }
#  }
    fn set_to_max(&mut self, other: Rectangle) {
        `[]`let max = self.max(other);`[]`
        drop(*self);`[]` // This is usually implicit,
                         // but added here for clarity.
        *self = max;
    }
}

fn main() {
    let mut r1 = Rectangle { 
        width: 9, 
        height: 9, 
        name: String::from("r1") 
    };
    let r2 = Rectangle {
        width: 16,
        height: 16,
        name: String::from("r2")
    };
    r1.set_to_max(r2);
}
```

В этой программе мы вызываем `set_to_max` с двумя прямоугольниками `r1` и `r2`. `self` — это изменяемая ссылка на `r1`, а `other` — это перемещение `r2`. После вызова `self.max(other)` метод `max` потребляет владение обоими прямоугольниками. Когда `max` возвращается, Rust освобождает обе строки "r1" и "r2" в куче. Обратите внимание на проблему: в месте L2 `*self` должен быть читаемым и записываемым. Однако `(*self).name` (фактически `r1.name`) была освобождена.

Поэтому, когда мы делаем `*self = max`, мы сталкиваемся с неопределённым поведением. Когда мы перезаписываем `*self`, Rust неявно удалит данные, которые ранее были в `*self`. Чтобы сделать это поведение явным, мы добавили `drop(*self)`. После вызова `drop(*self)` Rust пытается освободить `(*self).name` во второй раз. Это действие — двойное освобождение, что является неопределённым поведением.

Поэтому помните: когда вы видите ошибку вроде "cannot move out of `*self`", это обычно потому, что вы пытаетесь вызвать метод `self` на ссылку, такую как `&self` или `&mut self`. Rust защищает вас от двойного освобождения.


## Итоги

Структуры позволяют создавать пользовательские типы, которые значимы для вашей предметной области. Используя структуры, вы можете сохранять связанные фрагменты данных вместе и называть каждый фрагмент, чтобы сделать ваш код понятным. В блоках `impl` вы можете определять функции, связанные с вашим типом, а методы — это вид ассоциированной функции, который позволяет указать поведение, которое имеют экземпляры ваших структур.

Но структуры — не единственный способ создания пользовательских типов: давайте обратимся к функции перечисления Rust, чтобы добавить ещё один инструмент в ваш арсенал.

{{#quiz ../quizzes/ch05-03-method-syntax-sec2.toml}}

[enums]: ch06-00-enums.html
[trait-objects]: ch18-02-trait-objects.md
[public]: ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html#exposing-paths-with-the-pub-keyword
[modules]: ch07-02-defining-modules-to-control-scope-and-privacy.html