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

```tsx
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

# 4 CLASSES AND INTERFACES

## 4.0 Classes

TypeScript로 객체지향코드를 만들어봅시다. 굳이 this를 사용하지 않아도 자동으로 만들어줍니다.

- TypeScript

```tsx
class Player {
  constructor (
    private firstName: string,
    private lastName: string
  ) {}
}
```

- JavaScript

```tsx
"use strict";
class Player {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
```

JavaScript에는 없지만 TypeScript에는 private, protected, public이 있습니다. 아래 코드에서 firstName은 접근할 수 없습니다. 다만 JavaScript에서는 가능합니다. 왜냐하면 JavaScript에는 private, protected, public기능이 없기 때문이죠.

```tsx
const nico = new Player("nico", "las", "니꼬");

nico.firstName // X
nico.nickname // O
```

다음으로 알아볼 것은 Abstract Class입니다. 아주 근사한 기능입니다.

```tsx
abstract class User {
  constructor (
      private firstName: string,
      private lastName: string,
      public nickname: string,
    ) {}
}

class Player extends User {
  
}

const nico = new Player("nico", "las", "니꼬");
```

method에도 접근지정자가 가능합니다. getFullName()에 private를 적용해 봅시다.

```tsx
abstract class User {
  constructor (
      private firstName: string,
      private lastName: string,
      public nickname: string,
    ) {}

  private getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

class Player extends User {
  
}

const nico = new Player("nico", "las", "니꼬");
nico.getFullName() // X
```

추상 메소드도 가능합니다.

```tsx
abstract class User {
  constructor (
      protected firstName: string,
      protected lastName: string,
      protected nickname: string,
    ) {}

  abstract getNickName(): void

  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

class Player extends User {
  getNickName() {
    console.log(this.nickname)
  }
}

const nico = new Player("nico", "las", "니꼬");
nico.getFullName()
```

- private: 해당 클래스에서만 사용가능하고 외부에서는 사용 불가는ㅇ
- protected: 자식 클래스는 사용 가능
- public: 모두 사용 가능

## 4.1 Recap

해시맵을 만들어봅시다. 그 전에 index signature란 걸 배워봅시다. `[key: string]: string`을 Index Signature라고 합니다. Property의 이름은 모르지만 Type은 알고 있을 때 사용합니다. 매우 중요합니다.

```tsx
type Words = {
  [key: string]: string
}

let dict: Words = {
  "apple": "food",
  "banana": "food too",
}

```

Class의 property를 수동으로 초기화하고 싶다면 아래와 같이 사용합니다.

```tsx
class Dict {
  private words: Words
  constructor() {
    this.words = {}
  }
}
```

만든 단어장입니다. 특이한 점은 class도 Type으로 사용할 수 있습니다.

```tsx
type Words = {
  [key: string]: string
}

class Dict {
  private words: Words
  constructor() {
    this.words = {}
  }
  add(word: Word) {
    if (this.words[word.term] === undefined) {
      this.words[word.term] = word.def
    }
  }
  def(term: string) {
    return this.words[term]
  }
}

class Word {
  constructor(
    public term: string,
    public def: string,
  ) {}
}

const kimchi = new Word("kimchi", "한국의 김치")

const dict = new Dict()

dict.add(kimchi)
dict.def("kimchi")

```

## 4.2 Interfaces

값은 공개하고 싶지만, 수정은 불가능하게 하고 싶다면? `readonly`

```tsx
class Word {
  constructor(
    public readonly term: string,
    public readonly def: string,
  ) {}
}

```

JavaScript에 static이 있습니다. 그러면 Instance를 만들지 않고도 method를 호출할 수 있습니다.

```
class Hello {
  static hello() {
    return "hello"
  }
}

Hello.hello()
```

지금까지 배운 type

```tsx
type Nickname = string
type Health = number
type Friends = Array<string>
type Player = {
  nickname: string,
  healthBar: number,
}

const nico: Player = {
  nickname: "nico",
  healthBar: 10,
}

type Food = string

const kimchi: Food = "delicious"
```

type에 특정 데이터만 오도록 제한할 수 있습니다.

```tsx
type Team = "red" | "blue" | "yellow"
type Health = 1 | 5 | 10

type Player = {
  nickname: string,
  team: Team,
  health: Health
}

const nico: Player = {
  nickname: "nico",
  team: "yellow",
  health: 1,
}
```

인터페이스는 오브젝트의 모양을 알려줍니다.

```tsx
type Team = "red" | "blue" | "yellow"
type Health = 1 | 5 | 10

interface Player {
  nickname: string,
  team: Team,
  health: Health,
}

const nico: Player = {
  nickname: "nico",
  team: "yellow",
  health: 1,
}
```

모양이 Type과 비슷하지만 살짝 다릅니다.

```tsx
type A = {
}

interface B {
}
```

인터페이스는 오직 오브젝트의 모양을 설명할 때만 사용됩니다. 그래서 이런건 안됩니다.

```tsx
interface s = string // X
```

인터페이스는 클래스를 다루는 느낌이라 더 쉬울겁니다.

```tsx
interface User {
  name: string
}

interface Player extends User {

}

const nico: Player = {
  name: "nico"
}
```

Type으로는 이렇게 만듭니다.

```tsx
type User = {
  name: string
}

type Player = User & {

}

const nico: Player = {
  name: "nico"
}
```

Interface의 또 다른 특징은 Property를 누적할 수 있습니다.

```tsx
interface User {
  name: string
}

interface User {
  lastName: string
}

interface User {
  health: number
}

const nico: User = {
  name: "nico",
  lastName: "n",
  health: 1
}
```

결론: 인터페이스는 OOP를 위해 만들어졌고, Type은 더 범용성있습니다.

## 4.3 Interfaces part Two

Abstract class는 TypeScript에만 있는 기능이지만 꼭 기억해야할 내용은 JavaScript로 변환되면 Abstract Class는 Class가 됩니다.

```tsx
abstract class User {
  constructor (
    protected firstName: string,
    protected lastName: string,
  ) {}
  abstract sayHi(name: string): string
  abstract fullName(): string
}

class Player extends User {
  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
  sayHi(name: string) {
    return `Hello ${name}. My name is ${this.fullName()}`
  }
}
```

그렇기 때문에 Interface를 사용합니다. Interface는 JavaScript로 변환되면 사라집니다.

그리고 interface에서는 private, protect를 어떻게 사용할까요? abstract는 어떻게 사용할까요? 사용할 수 없습니다.

```tsx
interface User {
  firstName: string,
  lastName: string,
  sayHi(name: string): string
  fullName(): string
}

class Player implements User {
  constructor(
    public firstName: string,
    public lastName: string,
  ) {}
  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
  sayHi(name: string) {
    return `Hello ${name}. My name is ${this.fullName()}`
  }
}
```

그리고 여러개의 interface를 상속받을 수 있습니다.

```tsx
interface User {
  firstName: string,
  lastName: string,
  sayHi(name: string): string
  fullName(): string
}

interface Human {
  health: number
}

class Player implements User, Human {
  constructor(
    public firstName: string,
    public lastName: string,
    public health: number
  ) {}
  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
  sayHi(name: string) {
    return `Hello ${name}. My name is ${this.fullName()}`
  }
}
```

extends: 상속

implements: 다형성

Interface도 type으로 사용될 수 있습니다.

```tsx
interface User {
  firstName: string,
  lastName: string,
  sayHi(name: string): string
  fullName(): string
}

function makeUser(user: User): User {
  return {
    firstName: "f",
    lastName: "l",
    sayHi: (name) => "",
    fullName: () => "",
  }
}
```

## 4.4 Recap

type으로 상속하는 방법은 아래와 같습니다.

```tsx
type PlayerA = {
  name: string
}

type PlayerAA = PlayerA & {
  lastName: string
}

const playerA: PlayerAA = {
  name: "n",
  lastName: "l",
}
```

interface에서 상속하는 방법은 그냥 같은 interface를 여러번 사용하면 됩니다. 아주 중요합니다.

```tsx
interface A {
  name: string
}

interface A {
  lastName: string
}
```

type, interface모두 implements를 사용할 수 있습니다.

```tsx
type PlayerA = {
  firstName :string  
}

interface PlayerB {
  firstName :string
}

class UserA implements PlayerA {
  constructor (
    public firstName: string
  ) {}
}

class UserB implements PlayerB {
  constructor (
    public firstName: string
  ) {}
}
```

TypeScript 커뮤니티에서는 class, object의 꼴을 만들때 interface를 사용하고 나머지는 type을 사용하라고 합니다.

Interface는 대부분의 경우 사용합니다. 더 직관적이거든요. Type Alias나, 특정 값으로 제한할 때는 type을 사용합니다.

## 4.5 Polymorphism

Generic은 concrete type이 아니라 placeholder type입니다.

LocalStorage<T>를 SStorage<T>에서도 사용할 수 있습니다.

```tsx
interface SStorage<T> {
  [key: string]: T
}

class LocalStorage<T> {
  private storeage: SStorage<T> = {}
  set(key: string, value: T) {
    this.storeage[key] = value
  }
  remove(key: string) {
    delete this.storeage[key]
  }
  get(key: string): T {
    return this.storeage[key]
  }
  clear() {
    this.storeage = {}
  }
}
const stringsStorage = new LocalStorage<string>();

stringsStorage.get("ket")
stringsStorage.set("hello", "how are you")

const booleanStorage = new LocalStorage<boolean>();

booleanStorage.get("xxx")
booleanStorage.set("hello", true)
```

# 5 TYPESCRIPT BLOCKCHAIN

## 5.0 Introduction

이제 local 환경에서 TypeScript를 설치하고 사용해봅시다. 만약 ReactJS, NestJS, NextJS를 사용한다면 TypeScirpt를 직접 설치할 필요 없이 알아서 설치될겁니다. Webpack이 자동으로 설치되는 것처럼 말이죠.

## 5.1 Targets

- npm init -y
- npm i -D typescript
- tsc --init

```json
{
  "name": "typechain",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "build": "tsc"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "typescript": "^5.4.5"
  }
}

```

tsconfig.json이 있으면 VSCode가 인지하고 엄청난 기능을 제공합니다.

tsconfig.json에 여러 옵션을 설정할 수 있습니다.

- include: TypeScript 파일들이 어디에 위치해 있는지
- outDir: TypeScript가 컴파일된 결과물이 어디에 저장될 지
- target: TypeScript가 어떤 버전의 JavaScript로 컴파일 할지

```json
{
  "include": ["src"],
  "compilerOptions": {
    "outDir": "build",
    "target": "ES5"
  }
}
```

아래와 같은 TypeScript는 ES5에서는 이렇게 변환됩니다.

```tsx
const hello = () => "hi";
```

```jsx
var hello = function () { return "hi"; };
```

class도 해봅시다.

```tsx
class Block {
    constructor(private data: string) {}
    static hello() {
        return "hi";
    }
}
```

```jsx
var Block = /** @class */ (function () {
    function Block(data) {
        this.data = data;
    }
    Block.hello = function () {
        return "hi";
    };
    return Block;
}());

```

https://www.typescriptlang.org/tsconfig#target

## 5.2 Lib Configuration

lib은 TypeScript가 어느 환경에서 실행될지 알려주어야 합니다. 그래야 VSCode가 lib을 보고, 아? 너 DOM을 쓸거구나? 그럼 localstorage API Type을 준비해놓을게! 하고 자동완성을 해줍니다.

```json
{
  "include": ["src"],
  "compilerOptions": {
    "outDir": "build",
    "target": "ES6",
    "lib": ["ES6", "DOM"]
  }
}
```

## 5.3 Declaration Files

JavaScript로 만들어진 라이브러리를 TypeScript에 쓰려고 하면 TypeScript는 그 라이브러리에 대해 알 길이 없습니다.

tsconfig.json에서 strict는 TypeScript가 더 깐깐하게 체크한다는 뜻입니다.

```json
{
  "include": ["src"],
  "compilerOptions": {
    "outDir": "build",
    "target": "ES6",
    "lib": ["ES6", "DOM"],
    "strict": true,
  }
}
```

아래와 같은 JavaScript 패키지가 있다고 생각해봅시다.

```tsx
export function init(config) {
  return true;
}

export function exit(code) {
  return code + 1;
}

```

위 패키지를 불러오면 아래에서 오류가 발생합니다. init, exit에 대한 TypeScript가 정의되어있지 않거든요.

```tsx
import {init, exit} from "myPackage"

init({
    url: "https://example.com"
})

exit(1)

localStorage.clear()
```

그때  .d.ts파일이 필요합니다.

```tsx
	interface Config {
    url: string;
}

declare module "myPackage" {
  function init(config: Config): boolean;
  function exit(code: number): number;
}
```

## 5.4 JSDoc

`“allowJS”: true`를 하면 JavaScript 파일도 import할 수 있습니다. 그러면 TypeScript가 JavaScript를 자동으로 추론합니다.

```json
{
  "include": ["src"],
  "compilerOptions": {
    "outDir": "build",
    "target": "ES6",
    "lib": ["ES6", "DOM"],
    "strict": true,
    "allowJs": true,
  }
}
```

JavaScript파일을 .ts로 바꾸기는 싫고, 그런데도 Type은 체크받고 싶다면, @ts-check와 JSDoc를 활용해봅시다.

```jsx
// @ts-check
/**
 * Initializes the project
 * @param {object} config
 * @param {boolean} config.debug
 * @param {string} config.url
 * @returns {boolean}
 */
export function init(config) {
  return true;
}

/**
 * Exits the program
 * @param {number} code
 * @returns {number}
 */
export function exit(code) {
  return code + 1;
}

```

## 5.5 Blocks

`ts-node`는 개발 환경에서만 사용하는 패키지인데, 지금은 TypeScript로 작성된 파일을 JavaScript로 컴파일 한 결과물을 실행해야 합니다. 빌드하지 않고 실행하도록 도와주는 패키지입니다.

`nodemon`은 파일 수정후 저장하는 순간 변경 사항을 바로 적용해주는 패키지입니다.

```json
{
  "name": "typechain",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "build": "tsc",
    "dev": "nodemon --exec ts-node src/index.ts",
    "start": "node build/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "typescript": "^5.4.5"
  }
}

```

`esModuleInterop`은 CommonJS를 더 쉽게 사용하도록 만들어주는 옵션입니다.

`module`은 Module System을 선택하는 옵션입니다. CommonJS말고도 UMD가 있습니다. 브라우저에서 코드를 실행한다면 UMD를 사용하는 경우가 많습니다.

```json
{
  "include": ["src"],
  "compilerOptions": {
    "outDir": "build",
    "target": "ES6",
    "lib": ["ES6", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "module": "CommonJS",
  }
}
```

블록체인을 만들어봅시다. 블록안에 데이터들이 블록끼리 사슬처럼 연결된 것이 블록체인입니다.

```tsx
import * as crypto from 'crypto';

interface BlockShape {
    hash: string;
    prevHash: string;
    height: number;
    data: string;
}

class Block implements BlockShape {
    public hash: string;
    constructor(
        public prevHash: string,
        public height: number,
        public data: string
    ) {
        this.hash = Block.calculateHash(prevHash, height, data);
    }
    static calculateHash(prevHash: string, height: number, data: string): string {
        const toHsh = `${prevHash}${height}${data}`
        return prevHash + height + data;
    }
}
```

## 5.6 DefinitelyTyped

TypeScript가 대중화되기 전의 JavaScript Package는 .d.ts 파일이 정의되어 있지 않습니다. 그런데 이런 패키지를 사용하고 싶다면 내가 만들 필요가 없죠? 멋있는 개발자분들이 이미 다 정의해놓았습니다.

https://github.com/DefinitelyTyped/DefinitelyTyped에 말이죠.

`npm i -D @types/node`

위와 같이 설치하면 DefinitelyTyped에 있는 node폴더를 설치합니다. 이 node폴더 안에 crypto.d.ts가 정의되어 있답니다.

```tsx
import * as crypto from 'crypto';

interface BlockShape {
    hash: string;
    prevHash: string;
    height: number;
    data: string;
}

class Block implements BlockShape {
    public hash: string;
    constructor(
        public prevHash: string,
        public height: number,
        public data: string
    ) {
        this.hash = Block.calculateHash(prevHash, height, data);
    }
    static calculateHash(prevHash: string, height: number, data: string): string {
        const toHsh = `${prevHash}${height}${data}`
        return crypto.createHash('sha256').update(toHsh).digest('hex');
    }
}
```

지금까지 5~6년동안 TypeScript를 사용하면서 알게된 유용한 지식의 95%정도는 설명했습니다.

## 5.7 Chain

```tsx
import * as crypto from 'crypto';

interface BlockShape {
    hash: string;
    prevHash: string;
    height: number;
    data: string;
}

class Block implements BlockShape {
    public hash: string;
    constructor(
        public prevHash: string,
        public height: number,
        public data: string
    ) {
        this.hash = Block.calculateHash(prevHash, height, data);
    }
    static calculateHash(prevHash: string, height: number, data: string): string {
        const toHsh = `${prevHash}${height}${data}`
        return crypto.createHash('sha256').update(toHsh).digest('hex');
    }
}

class Blockchain {
    private blocks: Block[];
    constructor() {
        this.blocks = [];
    }

    private getPrevHash() {
        if (this.blocks.length === 0) return "";
        return this.blocks[this.blocks.length - 1].hash;
    }
    public addBlock(data:string) {
        const newBlock = new Block(this.getPrevHash(), this.blocks.length + 1, data);
        this.blocks.push(newBlock);
    }
    public getBlocks() {
        return [...this.blocks]; // Solution
    }
}

const blockchain = new Blockchain();

blockchain.addBlock("First one");
blockchain.addBlock("Second one");
blockchain.addBlock("Third one");
blockchain.addBlock("Fourth block");

blockchain.getBlocks().push(new Block("fake", 100, "fake")); // Trying to hack

console.log(blockchain.getBlocks());

```