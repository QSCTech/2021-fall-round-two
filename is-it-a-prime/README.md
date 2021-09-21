# 写给小学生的 TypeScript 类型元编程

## 阅前须知

- 本文思维难度较大, 涉及到的概念会比较抽象, 可能更适合具有一定编程思维和编程基础的玩家, 如果不太能理解题目的话建议去看隔壁的几道题目
- 虽然题目中使用了 TypeScript, 但是涉及到的语法并不是很多, 而且文中应该会有所讲解, 希望有 TypeScript 基础的人都来看看本题, **不会 TypeScript 也是可以做的**
- **所有需要你来做的部分, 都有`Not implemented yet`这样的字眼**. 如果你不想看文档, 请你善用搜索
- 你可以把要补全后的代码写在任何地方, 比如一个`.ts`文件, 或许一个`.md`文件, 甚至一张纸的照片也可以, 然后按规定进行提交
- **文末的问题必答**
- Have fun~ :-D

## 故事背景

有一天, Pupil Switch 在做体操, 他在搜索引擎中遨游的时候, 发现 TypeScript 的类型系统好像很好玩的样子... 所以你也来玩吧...

## 任务

对 TypeScript 比较熟悉的同学都知道, 如果我们想判断一个**自然数**是否为素数, 那么我们可以这样写

```ts
const isPrime = (x: number): number => {
  if (x < 2) return false;
  for (let i = 2; i * i < x; ++i) if (x % i === 0) return false;
  return true;
};
```

当然这个太简单了没什么意思, 我们来尝试使用 TypeScript~~强大的~~类型系统, 来实现一个判断素数的类型 IsPrime. 在做完这道题后，你的代码能达到如下效果  

```ts
type check = IsPrime<18>; // type check = "F", 意思是 check 这个类型严格等于 "F" 这个字面量
type check = IsPrime<13>; // type check = "T"
```

也就意味着, 以下代码不会出现编译错误  

```ts
let check0: IsPrime<18> = "F";
let check1: IsPrime<13> = "T";
```

既然在预期中,  `check0` 的类型, 即 `IsPrime<18>` 严格等于 `"F"`, 那么 `check0` 只能取 `"F"` 这个值, 那么赋值语句 `... = "F"` 一定不会出现编译错误.  

## 让我们开始吧

### 提前准备

为了更好的完成这个任务, 你应该有一个趁手的开发环境, 并可以顺利的使用较新版本的 Node.js 和 TypeScript

以及, 如果你的编辑器具有良好的类型提示和报错, 那会让你事半功倍

(当然, 逻辑思维足够强的人可以只用纸笔完成这个任务)

### 讲一点类型语法

这一部分我可能只会讲一点浅薄的理解, 如果大家对 TypeScript 感兴趣, 想更加认真的学习类型系统, 欢迎大家去查阅[The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

#### 类型基础

Emmmm, 虽然这个理解可能不是很正确, 但你可以暂时把 TypeScript 中的类型理解为集合.

TypeScript 有数种基础类型, 比如 number, string, boolean, 以及 null, undefined 什么的, 如果你会 JavaScript, 那你应该也认识它们

当一个变量被标记为一个类型的时候, 表示它属于这个集合.

```ts
const p: number = 2; // p属于number这个集合, 它只能是一个数字
```

可以把类型赋值给一个类型, 相当于起了一个别名

```ts
type MyType1 = number; // MyType以后就和number是一样的
```

我们可以对这个集合做运算, 比如取并集:

```ts
type MyType2 = number | string; // MyType 是数字或者字符串
```

在 TypeScript 中, 字面量也可以作为类型, 此时, 这个值就**只能是**这个**字面量**  

```ts
type Four = 4; // 类型为Four就只能取4这个数字
```

看起来没什么用? 但是可以结合上面的并操作:

```ts
type ReqMethods = "GET" | "POST" | "PUT" | "DELETE"; // 类型为ReqMethods的变量的值只能是这四个字符串之一
```

此外, objects 也可以作为类型, 你甚至可以指定每个元素的类型

```ts
type Employee = {
  name: string;
  gender: "Male" | "Female";
  salary: number;
};
```

此外还有一种写法, 是定义 interface

```ts
interface Employee {
  name: string;
  gender: "Male" | "Female";
  salary: number;
} // 和上面的基本等价
```

#### 奇怪的类型

TypeScript 中, 有一些 JavaScript 中没有的类型, 比如

- void
  这个一般是用在函数的返回值上, 表示这个函数没有返回值
- **never**
  这个一般是用于不会返回的函数上(比如死循环), 表示这个函数永远不会返回
- **unknown**
  这个表示这个函数可能是任何类型, 在需要确定类型的时候需要做类型推断
- any
  这个表示让 TypeScript 不再对这个变量做类型检查, 在一些 TypeScript 代码规范中, 会有不允许使用 any 的情况出现
  ~~JavaScript = AnyScript~~

#### 泛型

举一个例子[(来自 Handbook)](https://www.typescriptlang.org/docs/handbook/2/generics.html):

我们想要一个复读机函数, 它会返回传入的参数:

```ts
function identity(x: any): any {
  return x;
}
```

然后如果我们要做类型标注, 假如我们希望获得的返回值的类型跟传入的一样, 而不会给我们一个 any, 但我们又不想为每一个类型单独写一个 identity 函数, 我们可以使用泛型, 表示这个地方可以传入任何类型 (似乎和 C++里的 template 差不多?)

```ts
function identity<T>(x: T): T {
  return x;
}
```

#### extends

TypeScript 中的 extends 是一个似乎被过度使用的关键词, 它有一些截然不同的用法

- 首先, 它可以表示包含关系, 从集合的观点来看, `A extends B`表示 A 是 B 的子集(注意子集和真子集概念的区别). 在这种情况下, 类型为 A 的变量可以直接赋值给类型为 B 的变量
- 其次, 在泛型中, 我们可以定义
  ```ts
  type Generated = Generator<T extends BasicType>;
  ```
  在这个例子中, 表示传入这个泛型处的类型必须是 BasicType 的子集
- 然后, extends 可以用于判断句中
  ```ts
  type Flag = Checked extends BasicType ? true : false;
  ```
  这个表示, 如果 Checked 是 BasicType 的子集, 那么 Flag 表示 true, 否则表示 false.. 注意, 这里`A extends B`本身不具备 boolean 属性, 后面的`?xxx:xxx`这些都是不可以省略的. (另外, 或许值得注意的是, 如果 B 是一个字面量, 那么这是一个判断字面量是否相等的好方法~)

此外, 有一些特殊的规定.

在类型运算中, `never`是最小集(可以算是空集), 无论`Type`是什么, `never extends Type`都成立.

而`unknown`是最大集, 无论`Type`是什么, `Type extends unknown`也都成立.

(由于个人习惯和喜好问题, 我们在这里不讨论`any`)

#### 递归

类型定义中可以递归, 例如我们定义一个链表的节点, 我们可以

```ts
type Node = {
  next?: Node; // ?:表示该属性可选
  value: any;
};
```

## 开始做操

那么有了上面这些概念就差不多了, 我们可以来开始玩了.

我们发现, 我们可以拥有字面量表示类型, 我们有判断, 有递归, 这就意味着我们可以做很多很多事了.

那么 我们现在先来定义自然数.

### 自然数

我们应该都在小学数学课上听老师讲过[皮亚诺公理](https://en.wikipedia.org/wiki/Peano_axioms), 因此我们可以这样定义自然数

我们把自然数当作一个无限长的链表; 对于每一个自然数, 它的结构应该是这样的

```ts
type Num = {
  prev: Num; // 前一个自然数
  zero: "T" | "F"; //这个数是否是0, 可以作为我们递归的结束条件
  // 你可以把 "T" 和 "F" 换成其他你喜欢的字面量, 只要它能表示一个二元的状态, 且在你接下来的编程中沿用你制定的规定
};
```

我们于是可以这样定义 `0` 

```ts
type Zero = {
  prev: never; // 0没有前驱
  zero: "T";
};
```

既然我们已经有了对 `0` 的定义, 那么我们可以很轻松地定义出**得到一个数的后继的类型**和**得到一个数的前驱的类型**.  

```ts
type NextNum<T extends Num> = // Not implemented yet
type PrevNum<T extends Num> = // Not implemented yet
```

*Hint: 我们知道, 在自然数中, 0 的后继是 1. 那么, `NextNum<Zero>` 就应当返回一个能正确表示 1 的类型. 更具体地, 1 的前驱是 0, 且 1 非 0.*

### 四则运算

有了自然数的定义, 我们就可以进行四则运算了. 很不幸, TypeScript 中字面量类型之间是没有关系的, 不能直接进行运算, 所以我们需要利用递归

在这里, 我们给出一下加法的样例, 观察到 $a+b=(a+1)+(b-1)$:

```ts
type Add<T1 extends Num, T2 extends Num> = T2["zero"] extends "T"
  ? T1
  : Add<NextNum<T1>, PrevNum<T2>>;
```

接下来请大家理解上面干了啥, 然后参照着实现减法 乘法 和整除. 请留意, 整除运算有可能依赖比较运算, 比较运算可能依赖减法运算.  

```ts
type Sub<// Not implemented yet
type Mul<// Not implemented yet
type Div<// Not implemented yet
```

_Hint: 乘法和除法过程中或许可以添加一个泛型值作为辅助, 并且你应该为所有辅助提供初值, 因为我们不会显式调用它_

_Hint: 做运算的时候请注意边界条件 (例如自然数的减法中没有负数, 除数不能为 0 等)_

### 比较运算和逻辑运算

啊 这一部分相信大家冰雪聪明, 自己完成肯定没问题啦

在这一部分中, 你至少需要实现: `IsLessThan` `IsEqual` `And` `Or` `Not`

```ts
// Not implemented yet
```

#### 判断素数!

啊 这应该是最简单的一步了吧 我们已经完成了所有工具 现在只需要把它们拼起来就可以啦

```ts
type IsPrimeNum<// Not implemented yet
```

### 更阳间的写法

根据我们上面的写法, 当我们传参的时候, 我们需要传大量的`NextNum<`然后套娃才能搞出这个数字

我们能不能整个方便的写法呢?

在这个部分, 我们来实现这样一个类型吧, 它接受一个数字, 然后会生成一个相等的, 我们定义的自然数

```ts
type SetNum<T extends number// Not implemented yet
// e.g. SetNum<5> = NextNum<NextNum<NextNum<NextNum<NextNum<Zero>>>>>
```

_Hint: 可以试试用一个不断变长的数组来做递归判断~_

把这一步代入上一步, 这样我们就完成了我们的终极形态~

```ts
type IsPrime<T extends number> = IsPrimeNum<SetNum<T>>;
```

这样我们就完成啦! 找几个数来测试一下对不对呢?

```ts
//e.g.
let check0: IsPrime<1> = "F";
let check1: IsPrime<2> = "T";
let check2: IsPrime<9> = "F";
let check3: IsPrime<23> = "T";
//...
```

有编译错误吗?

## 写在最后

### 说明

- 以上内容纯属奇技淫巧, 在正常开发中应该用不到, 就是来锻炼大脑的
- 关于 TypeScript 类型系统, 本文只介绍了非常小的一部分, 想做体操的话可以试试[这个](https://typescript-exercises.github.io/)
- 出题比较仓促, 可能 review 不够, 还请谅解

### 问题

**本部分必答, 你可以写在任何面试官可以找到的位置**

1. 你觉得这个任务有意思吗?
2. 你在完成的过程中遇到了哪些困难? 又得到了哪些收获?
3. 你想给本文打几分? 为什么? 有什么意见或建议?
4. 你还想对求是潮说些什么?

以上.
