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