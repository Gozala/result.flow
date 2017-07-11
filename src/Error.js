/* @flow */

import type { Maybe } from "maybe.flow"
import type { Result } from "./Result/Result"
import Ok from "./Ok"

/**
 * Represents failer result and contains result `error`.
 * @param x type of the `error` value for failed result.
 */
export default class Error<x, a = *> {
  /**
   * Sentinel property for diferentitating between `Ok` and `Error` results.
   */
  isOk: false = false
  error: x
  /**
   * @param error Error value of this result.
   */
  constructor(error: x) {
    this.error = error
  }
  map<b>(f: (value: a) => b): Result<x, b> {
    return this
  }
  format<y>(f: (error: x) => y): Result<y, a> {
    return new Error(f(this.error))
  }
  chain<b>(next: (value: a) => Result<x, b>): Result<x, b> {
    return this
  }
  capture<y>(next: (error: x) => Result<y, a>): Result<y, a> {
    return next(this.error)
  }
  recover(f: (error: x) => a): Result<x, a> {
    return new Ok(f(this.error))
  }
  and<b>(result: Result<x, b>): Result<x, b> {
    return this
  }
  or<y>(result: Result<y, a>): Result<y, a> {
    return result
  }
  toValue(fallback: a): a {
    return fallback
  }
  toMaybe(): Maybe<a> {
    return null
  }
}
