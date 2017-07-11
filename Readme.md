# result.flow
[![travis][travis.icon]][travis.url]
[![package][version.icon] ![downloads][downloads.icon]][package.url]
[![styled with prettier][prettier.icon]][prettier.url]


Library for representing the `Result` of a computation that may fail. Which is a type friendly alternative to handling errors than exceptions are.

## Usage


A `Result<x, a>` is either `Ok<a>` meaning the computation succeeded with `a` value, or it is an `Error<x>` meaning that there was some `x` failure.

```js
type Result <x, a> =
  | { isOk:true, value: a }
  | { isOk:false, error:x }
```

Actual `Result<x, a>` interface is more complex as it provides full library API in form of methods as well, but actual type signature above is a good summary.

### Import

All the examples above assume following import:

```js
import * as Result from 'result.flow'
```

### Construct results


#### `Result.ok(value:a) => Result<x, a>`

Funciton `ok` constructs result of successful computaion:

```js
Result.ok(5) // => {isOk:true, value:5}
```

#### `Result.error(error:x) => Result<x, a>`

Function `error` constructs a failed computation:

```js
Result.ok('Oops!') // => {isOk:false, error:'Oops!'}
```

#### `Result.fromMaybe(error:x, value:?a):Result<x, a>`

Convert from a `Maybe<a>` (which is `?a`) to a result.

```js
const parseInt = (input:string):null|number => {
  const value = Number.parseInt(input)
  if (Number.isNaN(value)) {
    return null
  } else {
    return value
  }
}

const readInt = (input:string):Result.Result<string, number> =>
  Result.fromMaybe(`Input: "${input}" can not be read as an Int`,
                    parseInt(input))

readInt('5') // => Result.ok(5)
readInt('a') // => Result.error('Input: "a" can not be read as an Int')
```

P.S.: In the further examples we will make use of above defined `readInt`.


### Unbox results


#### `result.isOk:boolean`

You can use `isOk:boolean` common member to differentiate between `Ok<a>` and `Error<x>` variants of `Result<x,a>` and access to the corresponding properties:


```js
const result = readInt(data)
if (result.isOk) {
  console.log(result.value + 15)
} else {
  console.error(result.error)
}
```



#### `(resut:Result<x, a>).toValue(fallback:a):a`

It is also possible unbox `Result<x, a>` by providing a `fallback:a` value in case result is a failed computation. 


```js
readInt("123").toValue(0) // => 123
readInt("abc").toValue(0) // => 0
```

If the result is `Ok<a>` it returns the value, but if the result is an `Error` return a given fallback value.

#### `Result.toValue(result:Result<x, a>, fallback:a>):a`

Same API is also available as a function:

```js
Result.toValue(readInt("123"), 0) // => 123
Result.toValue(readInt("abc"), 0) // => 0
```

#### `(result:Result<x, a>).toMaybe():?a`

If actual error is not needed it is also possible to covert `Result<x, a>` to `Maybe<a>` (More specifically `undefined|null|void|a`):

```js
readInt("123").toMaybe() // => 123
readInt("abc").toMaybe() // => null
```

#### `Result.toMaybe(result:Result<x, a>):?a`

Same API is also available as a funciton:

```js
Result.toMaybe(readInt("123")) // => 123
Result.toMaybe(readInt("abc")) // => null
```


### Transform results


#### `(result:Result<x, a>).map(f:(value:a) => b):Result<x, b>`

Applies a function to a `Result<x, a>`. If the result is `Ok` underlaying value will be mapped. If the result is an `Error`, the same error value will propagate through.

```js
Result.ok(3).map(x => x + 1) // => Result.ok(4)
Result.error('bad input').map(x => x + 1) // => Result.error('bad input')
```

#### `Result.map(f:(value:a) => a, result:Result<x, a>):Result<x, a>`

Same API is also available as a function:

```js
Result.map(x => x + 1, Result.ok(3)) // => ok(4)
Result.map(x => x + 1, Result.error('bad input')) // => error('bad input')
```

#### `(result:Result<x,a>).format(f:(error:x) => y):Result<y, a>`

It is also possible to map an `error` of the result. For example, say the errors we get have too much information:

```js
Result
  .error({ reason:'Bad input', filename: '/path' })
  .format(error => error.reason) // => Result.error('Bad input')

Result
  .ok(4)
  .format(error => error.reason) // => Result.ok(4)
```

#### `Result.format(f:(error:x) => y, result:Result<x, a>):Result<y, a>`

Same API is also avaiable as a funciton:

```js
Result.format(error => error.reason,
              Result.error({ reason:'Bad input', filename: '/path' }))
// => Result.error('Bad input')

Result.format(error => error.reason, Result.ok(4)) // => Result.ok(4)
```

#### `(result:Result<x, a>).format(f:(error:x) => a):Result<x, a>`

It is also possible to transform failed `Result<x, a>` to succeeded result by mapping `x` to `a`:

```js
Result.error('Bad input').recover(Error) // => Result.ok(Error('Bad input'))
```

#### `Result.recover((error:x) => a, result:Result<x, a>):Result<x, a>`

Same API is also available as a function:

```js
Result.recover(Error,
                Result.error('Bad Input')) // => Result.ok(Error('Bad Input'))
```

### Chaining results


#### `(result:Result<x, a>).chain(next:(value:a) => Result<x, b>):Result<x, b>`

It is possible to chain a sequence of computations that may fail:

```js
type Month = 1|2|3|4|5|6|7|8|9|10|11|12
const toValidMonth = (n:number):Result.Result<string, Month> => {
  if (n >= 1 && n <= 12 && Math.floor(n) === n) {
      return Result.ok((n:Month))
  } else {
    return Result.error(`Number: ${n} is not with-in 0 to 12 month range`)
  }
}

const parseMonth = (input:string):Result<string, Month> =>
  readInt(input).chain(toValidMonth)

parseMonth('4') // => Result.ok(4)
parseMonth('a') // => Result.error('Input: "a" can not be read as an Int')
parseMonth('13') // => Result.error('Number 13 is not with-in 0 to 12 month range') 
```

#### `Result.chain(f:(value:a) => Result<x, b>, r:Result<x, a>):Result<x, b>`

Same API is also available as a function:

```js
const parseMonth = (input:string):Result.Result<string, Month> =>
  Result.chain(toValidMonth, readInt(input))

parseMonth('7') // => Result.ok(7)
parseMonth('Hi') // => Result.error('Input: "Hi" can not be read as an Int')
parseMonth('0') // => Result.error('Number: 0 is not with-in 0 to 12 month range')
```

#### `(result:Result<x, a>).and(other:Result<x, b>):Result<x, b>`

Sometimes you want to chain a sequence of computations, but unlike in previous example, result of next computation does not depend on result of previous one:

```js
Result.ok(2).and(Result.error('late error')) // => Result.error('late error')
Result.error('early error').and(Result.ok(1)) // => Result.error('early error')

Result.error('early').and(Result.error('late')) // => Result.error('early')
Result.ok(2)
      .and(Result.ok('diff result type')) // => Result.ok('diff result type')
```

#### `Result.and(left:Result<x, a>, right:Result<x, b>):Result<x, b>`

Same API is available through a function as well:

```js
{
const {ok, error} = Result
Result.and(ok(2), error('late error')) // => Result.error('late error')
Result.and(error('early error'), ok(1)) // => Result.error('early error')

Result.and(error('early'), error('late')) // => Result.error('early')
Result.and(ok(2), ok('diff result type')) // => Result.ok('diff result type')
}
```

#### `(result:Result<x, a>).capture(f:(error:x) => Result<y, a>):Result<y, a>`

It is also possible to chain a sequence of computations that may fail, such that next computation is performed when previous one fails:

```js
const fromMonthName = (month:string):Month|null => {
  switch (month.toLowerCase()) {
    case "january": return 1
    case "february": return 2
    case "march": return 3
    case "april": return 4
    case "may": return 5
    case "june": return 6
    case "july": return 7
    case "august": return 8
    case "september": return 9
    case "october": return 10
    case "november": return 11
    case "december": return 12
    default: return null
  }
}

const readMonthByName = (input: string):Result.Result<string, Month> =>
  Result.fromMaybe(`Input "${input}" is not a valid month name`,
                    fromMonthName(input))


const readMonth = (input:string):Result.Result<string, Month> =>
  parseMonth(input)
  .capture(intError =>
            readMonthByName(input)
            .format(nameError => `${intError} & ${nameError}`))

readMonth('3') // => Result.ok(3)
readMonth('June') // => Result.ok(6)
readMonth('17') // => Result.error('Number: 17 is not with-in 0 to 12 month range & Input "17" is not a valid month name')
readMonth('Jude') // Result.error('Input: "Jude" can not be read as an Int & Input "Jude" is not a valid month name')
```

#### `Result.capture(f:(error:x) => Result<y, a>, r:Result<x, a>):Result<y, a>`


Same API is also available via function:

```js
const readMonth = (input:string):Result.Result<string, Month> =>
  Result.capture(badInt =>
                    readMonthByName(input).
                      format(badName => `${badInt} or ${badName}`),
                  parseMonth(input))

readMonth('3') // => Result.ok(3)
readMonth('June') // => Result.ok(6)
readMonth('17') // => Result.error('Number: 17 is not with-in 0 to 12 month range & Input "17" is not a valid month name')
readMonth('Jude') // => Result.error('Input: "Jude" can not be read as an Int & Input "Jude" is not a valid month name')
```

#### `(result:Result<x, a>).or(other:Result<y, a>):Result<y, a>`

It is also possible to chain a fallback computation that is performed if original fails, but unlike example above ignoring the first error:

```js
{
const {ok, error} = Result

ok(2).or(error('late error')) // => Result.ok(2)
error('early error').or(ok(3)) // => Result.ok(3)
error(-1).or(error('diff result type')) // => Result.error('diff result type')
ok(2).or(ok(100)) // => Result.ok(2)
}
```

#### `Result.or(left:Result<x, a>, right:Result<y, a>):Result<y, a>`

As in all other cases same API is availabel via function as well:

```js
{
const {ok, error} = Result

Result.or(ok(2), error('late error')) // => Result.ok(2)
Result.or(error('early error'), ok(3)) // => Result.ok(3)
Result.or(error(-1), error('diff result type')) // => Result.error('diff result type')
Result.or(ok(2), ok(100)) // => Result.ok(2)
}
```

## Prior Art

This library is inspired by:

- [Result from Elm][Result.elm]
- [Result from Rust][Result.rst]


[type guards]:https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
[Result.elm]:http://package.elm-lang.org/packages/elm-lang/core/latest/Result
[Result.rst]:https://doc.rust-lang.org/std/result/enum.Result.html

[travis.icon]: https://travis-ci.org/Gozala/result.flow.svg?branch=master
[travis.url]: https://travis-ci.org/Gozala/result.flow

[version.icon]: https://img.shields.io/npm/v/result.flow.svg
[downloads.icon]: https://img.shields.io/npm/dm/result.flow.svg
[package.url]: https://npmjs.org/package/result.flow


[downloads.image]: https://img.shields.io/npm/dm/result.flow.svg
[downloads.url]: https://npmjs.org/package/result.flow

[prettier.icon]:https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier.url]:https://github.com/prettier/prettier

[docs.icon]:https://img.shields.io/badge/typedoc-latest-ff69b4.svg?style=flat
[docs.`url]:https://gozala.github.io/result.flow/
