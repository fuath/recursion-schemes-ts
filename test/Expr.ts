import { Fix, fix } from '../src'
import { Functor1 } from 'fp-ts/lib/Functor'

declare module 'fp-ts/lib/HKT' {
  interface URI2HKT<A> {
    Expr: ExprF<A>
  }
}

export const URI = 'Expr'

export type URI = typeof URI

export class Const<A> {
  readonly _tag: 'Const' = 'Const'
  // prettier-ignore
  readonly '_A': A
  // prettier-ignore
  readonly '_URI': URI
  constructor(public value: number) {}
  map<B>(f: (a: A) => B): ExprF<B> {
    return this as any
  }
}

export class Add<A> {
  readonly _tag: 'Add' = 'Add'
  // prettier-ignore
  readonly '_A': A
  // prettier-ignore
  readonly '_URI': URI
  constructor(public x: A, public y: A) {}
  map<B>(f: (a: A) => B): ExprF<B> {
    return new Add(f(this.x), f(this.y))
  }
}

export class Mul<A> {
  readonly _tag: 'Mul' = 'Mul'
  // prettier-ignore
  readonly '_A': A
  // prettier-ignore
  readonly '_URI': URI
  constructor(public x: A, public y: A) {}
  map<B>(f: (a: A) => B): ExprF<B> {
    return new Mul(f(this.x), f(this.y))
  }
}

export function const_(n: number): Expr {
  return fix<URI>(new Const(n))
}

export function add(x: Expr, y: Expr): Expr {
  return fix(new Add(x, y))
}

export function mul(x: Expr, y: Expr): Expr {
  return fix(new Mul(x, y))
}

export type ExprF<A> = Const<A> | Add<A> | Mul<A>

export type Expr = Fix<URI>

export const functorExpr: Functor1<URI> = {
  URI,
  map<A, B>(expr: ExprF<A>, f: (a: A) => B): ExprF<B> {
    return expr.map(f)
  }
}
