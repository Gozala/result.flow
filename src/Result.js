/* @flow */

/**
 * Library for representing the `Result` of a computation that may fail. Which
 * is a more type friendly way to handle errors than exceptions.
 */

import type { Maybe } from "maybe.flow"
import type { Result } from "./Result/Result"
import Ok from "./Ok"
import Error from "./Error"

export type { Result }

export const ok = <x, a>(value: a): Result<x, a> => new Ok(value)

export const error = <x, a>(error: x): Result<x, a> => new Error(error)

export const fromMaybe = <x, a>(error: x, value: Maybe<a>): Result<x, a> => {
  const result = value != null ? new Ok(value) : new Error(error)
  return result
}

export const chain = <x, a, b>(
  f: (value: a) => Result<x, b>,
  result: Result<x, a>
): Result<x, b> => {
  if (result.isOk) {
    return f(result.value)
  } else {
    return result
  }
}

export const capture = <x, y, a>(
  f: (error: x) => Result<y, a>,
  result: Result<x, a>
): Result<y, a> => (result.isOk ? result : f(result.error))

export const recover = <x, a>(
  f: (error: x) => a,
  result: Result<x, a>
): Result<x, a> => (result.isOk ? result : new Ok(f(result.error)))

export const and = <x, a, b>(
  left: Result<x, a>,
  right: Result<x, b>
): Result<x, b> => (left.isOk ? right : left)

export const or = <x, y, a>(
  left: Result<x, a>,
  right: Result<y, a>
): Result<y, a> => (left.isOk ? left : right)

export const map = <x, a, b>(
  f: (value: a) => b,
  result: Result<x, a>
): Result<x, b> => (result.isOk ? new Ok(f(result.value)) : result)

export const format = <x, y, a>(
  f: (error: x) => y,
  result: Result<x, a>
): Result<y, a> => (result.isOk ? result : new Error(f(result.error)))

export const toValue = <x, a>(result: Result<x, a>, fallback: a): a =>
  result.isOk ? result.value : fallback

export const toMaybe = <x, a>(result: Result<x, a>): Maybe<a> =>
  result.isOk ? result.value : null
