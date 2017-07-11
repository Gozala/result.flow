/* @flow */

import type { Maybe } from "maybe.flow"

type Methods<x, a> = {
  map<b>(f: (value: a) => b): Result<x, b>,
  format<y>(f: (error: x) => y): Result<y, a>,
  chain<b>(next: (value: a) => Result<x, b>): Result<x, b>,
  capture<y>(next: (error: x) => Result<y, a>): Result<y, a>,
  recover(f: (error: x) => a): Result<x, a>,
  and<b>(result: Result<x, b>): Result<x, b>,
  or<y>(result: Result<y, a>): Result<y, a>,
  toValue(fallback: a): a,
  toMaybe(): Maybe<a>
}

type Ok<a> = Methods<*, a> & {
  isOk: true,
  value: a
}

type Error<x> = Methods<x, *> & {
  isOk: false,
  error: x
}

export type Result<x, a> = Ok<a> | Error<x>
