# 2 OVERVIEW OF TYPESCRIPT

## 2.0 How Typescript Works

TypeScript는 강타입 언어입니다.

다른 강타입 언어로는 C, C++, Java, Rust가 있는데, 이들이 0101로 컴파일된다면 TypeScript는 JavaScript로 컴파일됩니다.

웹에서 TypeScript가 JavaScript로 어떻게 변하는지 아래 링크에서 확인할 수 있습니다.

https://www.typescriptlang.org/play/

TypeScript를 사용하면 Runtime 전에 에러를 찾을 수 있습니다.

## 2.1 Implicit Types vs Explicit Types

TypeScript는 알아서 Type을 추론할 수 있습니다.

TypeScript에는 Type Checker가 내장되어 있습니다.

Type을 직접 알려줄 수도 있습니다.

```tsx
let a = "hello"
let b : boolean = false
```

명시적으로 작성하는 것은 추천하지 않습니다. 왜냐면 가독성이 떨어지거든요. Type Checker에게 맡겨봐요.

다만 아래와 같은 경우에는 Type Checker가 추론하지 못하기 때문에 명시적으로 알려주어야 합니다. 적절하게 사용하는 것이 중요합니다.

```tsx
let c : number[] = []
```

## 2.2 Types of TS part One

?를 사용해 Optional로 Type을 지정할 수 있습니다.

```
const player : {
    name: string,
    age?: number,
} = {
    name: "",
}

if (player.age < 10) {

}
```

Alias도 가능합니다.

```tsx
type Player = {
    name: string,
    age?: number,
}

const nico : Player = {
    name: "",
}

const lynn : Player = {
    name: "lynn",
    age: 12
}
```

함수도 가능합니다.

```tsx
function playerMaker(name: string): Player {
    return {
        name
    }
}

const nico = playerMaker("nico")

```

## 2.3 Types of TS part Two

Readonly

```tsx
type Player = {
    readonly name: string,
    age?: number,
}

const playerMaker = (name: string): Player => ({name});
const nico = playerMaker("nico")
nico.name = ""
```

```tsx
const numbers: readonly number[] = [1, 2, 3, 4]
numbers.push(1)
```

Tuple도 있습니다. Tuple의 장점은 Array의 개수를 정할 수 있고, 특정 타입도 정할 수 있어서 API의 응답이 아래와 같이 올 경우 용이합니다.

```tsx
const player: [string, number, boolean] = ["nico", 12, true]
```

다른 타입도 있습니다. `undefined`, `null` 도 있습니다. `?`는 전에도 말했듯이 `undefined |` 를 줄인 것입니다.

any도 있습니다. TypeScript이 조이는 숨통을 잠시 벗어나는 키워드입니다. 사용법은 사용하지 않는 것입니다.

## 2.4 Types of TS part Three

이번에 알아볼 Type은 JavaScript에는 없고 TypeScrip에만 존재하는 Type입니다. void ,never, unknown을 알아봅시다.

unknown은 아직 Type을 알지 못할 때 사용합니다.

```tsx
let a: unknown;

if (typeof a === 'number') {
    let b = a + 1
}
if (typeof a === 'string') {
    let b = a.toUpperCase();
}

```

void는 C와 같이 function의 return이 없을 때 사용합니다.

```tsx
function hello() {
    console.log('x')
}
const a = hello();
a.toUpperCase();
```

never는 절대 발생하지 않는 경우의 type입니다.

```tsx
function hello(): never {
    throw new Error("xxx")
}

function hi(name: string | number) {
    if (typeof name === "string") {
        name // string
    } else if (typeof name === "number") {
        name // number
    } else {
        name // never
    }
}
```

# 3 FUNCTIONS

## 3.0 Call Signatures

Arrow function을 사용하려고 합니다. 

```tsx
// const add: (a: number, b: number) => number
const add = (a: number, b: number) => a + b
```

아래와 같이 더 깔끔하게 만들 수 있습니다.

```tsx
type Add = (a: number, b: number) => number;

const add: Add = (a, b) => a + b
```

`(a: number, b: number) => number` 꼴을 `call signatures`라고 부릅니다.

## 3.1 Overloading

함수가 여러 개의 call signature를 가지고 있을 때 사용합니다.

```tsx
type Add = {
  (a: number, b: number): number,
  (a: number, b: string): number,
}

const add: Add = (a, b) => {
  if (typeof b === "string") return a
  return a + b
}
```

패키지를 디자인할 때 아래와 같이 많이 사용합니다.

```tsx
type Config = {
  path: string,
  state: object
}

type Push = {
  (path: string): void
  (config: Config): void
}

const push: Push = (config) => {
  if (typeof config === "string") console.log(config)
  else {
    console.log(config.path, config.state)
  }
};
```

call signature의 parameter개수가 다를경우에는?

```tsx
type Add = {
  (a: number, b: number): number,
  (a: number, b: number, c: number): number,
}

const add: Add = (a, b, c?: number) => {
  return a + b
}
```

자주보는 상황은 아닐겁니다.

## 3.2 Polymorphism

아래의 경우 `(arr: string[]): void`를 또 추가해줘야 할까요?

```tsx
type SuperPrint = {
    (arr: number[]): void
    (arr: boolean[]): void
}

const superPrint: SuperPrint = (arr) => {
    arr.forEach(i => console.log(i))
}

superPrint([1, 2, 3, 4])
superPrint([true, false, true])
superPrint(["a", "b", "c"])
```

이제 배워야 할 것은 Generic입니다. 모든 경우의 call signature를 다 사용할 필요가 없어졌습니다.

```tsx
type SuperPrint = {
    <T>(arr: T[]): void
}

const superPrint: SuperPrint = (arr) => {
    arr.forEach(i => console.log(i))
}

superPrint([1, 2, 3, 4])
superPrint([true, false, true])
superPrint(["a", "b", "c"])
```

Generic이 Polymorphism을 지원하기 위해 만들어졌습니다.

## 3.3 Generics Recap

Generic은 아래와 같이 사용할 수 있습니다.

```tsx
type SuperPrint = <T>(a: T[]) => T

const superPrint: SuperPrint = (a) => a[0]

const a = superPrint([1,2, 3, 4])
const b = superPrint([true, true, true])
const c = superPrint(["a", "b", "c"])
const d = superPrint([1, 2, true, false, "hello"])
```

그냥 any를 사용하면 안되나요? 네 안됩니다! any로는 Type을 추론할 수 없습니다.

generic은 요구한대로 call signature을 만들어준다고 이해하시면 됩니다.

Generic은 parameter의 위치를 기반으로 type을 추론합니다.

```tsx
type SuperPrint = <T, M>(a: T[], b: M) => T
```

## 3.4 Conclusions

```tsx
type Player<E> = {
  name: string
  extraInfo: E
}

type NicoExtra = {
  favFood: string
}

type NicoPlayer = Player<NicoExtra>

const nico: NicoPlayer = {
  name: "nico",
  extraInfo: {
    favFood: "kimchi"
  }
}
const lynn: Player<null> = {
  name: "lynn",
  extraInfo: null,
}
```

아래 코드에서 A, B는 같은 꼴입니다. 보통 A를 많이 보게 될 것입니다.

```tsx
type A = Array<number>
type B = number[]

let a: A = [1, 2, 3, 4]
```

```tsx
function printAllNumbers(arr: Array<number>){}
```

ReactJS에서는 아래와 같이 TypeScript를 적용합니다.

```tsx
useState<number>()
```