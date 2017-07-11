/* @flow */

import type { Maybe } from "maybe.flow"
import type { Result } from "./Result/Result"

/**
 * Represents succeeded result and contains result `value`.
 * @param a type of the `value` for this result.
 */
export default class Ok<a, x = *> {
  /**
   * Sentinel property for diferentitating between `Ok` and `Error` results.
   */
  isOk: true = true

  value: a
  /**
   * @param value Success value of this result.
   */
  constructor(value: a) {
    this.value = value
  }
  map<b>(f: (value: a) => b): Result<x, b> {
    return new Ok(f(this.value))
  }
  format<y>(f: (error: x) => y): Result<y, a> {
    return this
  }
  chain<b>(next: (value: a) => Result<x, b>): Result<x, b> {
    return next(this.value)
  }
  capture<y>(next: (error: x) => Result<y, a>): Result<y, a> {
    return this
  }
  recover(f: (error: x) => a): Result<x, a> {
    return this
  }
  and<b>(result: Result<x, b>): Result<x, b> {
    return result
  }
  or<y>(result: Result<y, a>): Result<y, a> {
    return this
  }
  toValue(fallback: a): a {
    return this.value
  }
  toMaybe(): Maybe<a> {
    return this.value
  }
}
