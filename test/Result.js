/* @flow */

import * as Result from "../"
import test from "blue-tape"

test("test API", async test => {
  test.ok(isFunction(Result.ok))
  test.ok(isFunction(Result.error))
  test.ok(isFunction(Result.fromMaybe))
  test.ok(isFunction(Result.map))
  test.ok(isFunction(Result.format))
  test.ok(isFunction(Result.chain))
  test.ok(isFunction(Result.capture))
  test.ok(isFunction(Result.recover))
  test.ok(isFunction(Result.and))
  test.ok(isFunction(Result.or))
  test.ok(isFunction(Result.toValue))
  test.ok(isFunction(Result.toMaybe))
})

test("test ok", async test => {
  const { ok, error } = Result

  const success = ok(5)
  if (success.isOk) {
    test.equal(success.value, 5, `ok(5).value -> 5`)
  }

  test.equal(ok(5).isOk, true, `ok(5).isOk -> true`)

  test.equal(ok(3).toValue(4), 3, `ok(3).toValue(4) -> 3`)
  test.equal(ok(-4).toMaybe(), -4, `ok(-4).toMaybe() -> -4`)

  test.deepEqual(
    Result.fromMaybe("Oops", 3),
    ok(3),
    `Result.fromMaybe('Oops', 3) -> ok(3)`
  )
  test.deepEqual(
    ok(5).map($ => $ + 7),
    ok(12),
    `ok(5).map($ => $ + 7) -> ok(12)`
  )
  test.deepEqual(
    ok("great").format(Error),
    ok("great"),
    `ok('great').format(Error) -> ok('great')`
  )
  test.deepEqual(
    ok(Error("boom")).chain($ => ok($.message)),
    ok("boom"),
    `ok(Error('boom')).chain($ => ok($.message)) -> ok('boom')`
  )
  test.deepEqual(
    ok(Error("boom")).chain($ => error($.message)),
    error("boom"),
    `ok(Error('boom')).chain($ => error($.message)) -> error('boom')`
  )
  test.deepEqual(
    ok("beep").capture(_ => ok("bop")),
    ok("beep"),
    `ok('beep').capture(_ => ok('bop')) -> ok('beep')`
  )
  test.deepEqual(
    ok("beep").capture(_ => error("bop")),
    ok("beep"),
    `ok('beep').capture(_ => error('bop')) -> ok('beep')`
  )

  test.deepEqual(
    ok("great").recover(JSON.stringify),
    ok("great"),
    `ok('great').recover(JSON.stringify) -> ok('great')`
  )
  test.deepEqual(
    ok(11).and(ok("foo")),
    ok("foo"),
    `ok(11).and(ok('foo')) -> ok('foo')`
  )
  test.deepEqual(
    ok(11).and(error("oops")),
    error("oops"),
    `ok(11).and(error('oops')) -> error('oops')`
  )
  test.deepEqual(ok(1).or(ok(7)), ok(1), "ok(1).or(ok(7)) -> ok(1)")
  test.deepEqual(
    ok(1).or(error("oops")),
    ok(1),
    `ok(1).or(error('oops')) -> ok(1)`
  )
})

test("test error", async test => {
  const { ok, error } = Result

  const failure = error("Oops!")
  if (!failure.isOk) {
    test.equal(failure.error, "Oops!", `error('Oops!').error -> 'Oops!'`)
  }

  test.equal(error(5).isOk, false, `error(5).isOk -> false`)
  test.equal(error(3).toValue(7), 7, `error(3).toValue(7) -> 7`)
  test.equal(
    error(3).toValue("whatever"),
    "whatever",
    `error(3).toValue('whatever') -> 'whatever'`
  )
  test.equal(error(-4).toMaybe(), null, `error(-4).toMaybe() -> null`)

  test.deepEqual(
    Result.fromMaybe("Oops", null),
    error("Oops"),
    `Result.fromMaybe('Oops', null) -> error('Oops')`
  )

  test.deepEqual(
    Result.fromMaybe("Oops", undefined),
    error("Oops"),
    `Result.fromMaybe('Oops', null) -> error('Oops')`
  )

  test.deepEqual(
    Result.fromMaybe("Oops", ((): void => {})()),
    error("Oops"),
    `Result.fromMaybe('Oops', (():void => {})()) -> error('Oops')`
  )

  test.deepEqual(
    error(5).map($ => $ + 7),
    error(5),
    `error(5).map($ => $ + 7) -> error(5)`
  )
  test.deepEqual(
    error("great").format(Error),
    error(Error("great")),
    `error('great').format(Error) -> error(Error('great'))`
  )
  test.deepEqual(
    error(Error("boom")).chain($ => ok($.message)),
    error(Error("boom")),
    `error(Error('boom')).chain($ => ok($.message)) -> error(Error('boom'))`
  )
  test.deepEqual(
    error(Error("boom")).chain($ => error($.message)),
    error(Error("boom")),
    `ok(Error('boom')).chain($ => error($.message)) -> error(Error('boom'))`
  )
  test.deepEqual(
    error("beep").capture(_ => ok("bop")),
    ok("bop"),
    `error('beep').capture(_ => ok('bop')) -> ok('bop')`
  )
  test.deepEqual(
    error("beep").capture(_ => error("bop")),
    error("bop"),
    `ok('beep').capture(_ => error('bop')) -> error('bop')`
  )
  test.deepEqual(
    error("great").recover(Error),
    ok(Error("great")),
    `ok('great').recover(Error) -> ok(Error('great'))`
  )
  test.deepEqual(
    error(11).and(ok("foo")),
    error(11),
    `error(11).and(ok('foo')) -> error(11)`
  )
  test.deepEqual(
    error(11).and(error(5)),
    error(11),
    `ok(11).and(error(5)) -> error(11)`
  )
  test.deepEqual(error(1).or(ok(7)), ok(7), `error(1).or(ok(7)) -> ok(7)`)
  test.deepEqual(
    error(1).or(error("oops")),
    error("oops"),
    `error(1).or(error('oops')) -> error('oops')`
  )
})

test("test functions", async test => {
  const { ok, error } = Result

  test.equal(Result.toValue(ok(3), 4), 3, `Result.toValue(ok(3), 4) -> 3`)
  test.equal(Result.toMaybe(ok(-4)), -4, `Result.toMaybe(ok(-4)) -> -4`)
  test.deepEqual(
    Result.map($ => $ + 7, ok(5)),
    ok(12),
    `Result.map($ => $ + 7, ok(5))`
  )
  test.deepEqual(
    Result.format(Error, ok("great")),
    ok("great"),
    `Result.format(Error, ok('great'))`
  )
  test.deepEqual(
    Result.chain($ => ok($.message), ok(Error("boom"))),
    ok("boom"),
    `Result.chain($ => ok($.message), ok(Error('boom'))) -> ok('boom')`
  )
  test.deepEqual(
    Result.chain($ => error($.message), ok(Error("boom"))),
    error("boom"),
    `Result.chain($ => error($.message), ok(Error('boom'))) -> error('boom')`
  )
  test.deepEqual(
    Result.capture(_ => ok("bop"), ok("beep")),
    ok("beep"),
    `Result.capture(_ => ok('bop'), ok('beep')) -> ok('beep')`
  )
  test.deepEqual(
    Result.capture(_ => error("bop"), ok("beep")),
    ok("beep"),
    `Result.capture(_ => error('bop'), ok('beep')) -> ok('beep')`
  )
  test.deepEqual(
    Result.recover(JSON.stringify, ok("great")),
    ok("great"),
    `Result.recover(JSON.stringify, ok('great'))`
  )
  test.deepEqual(
    Result.and(ok(11), ok("foo")),
    ok("foo"),
    `Result.and(ok(11), ok('foo')) -> ok('foo')`
  )
  test.deepEqual(
    Result.and(ok(11), error("oops")),
    error("oops"),
    `Result.and(ok(11), error('oops')) -> error('oops')`
  )
  test.deepEqual(
    Result.or(ok(1), ok(7)),
    ok(1),
    "Result.or(ok(1), ok(7)) -> ok(1)"
  )
  test.deepEqual(
    Result.or(ok(1), error("oops")),
    ok(1),
    `Result.or(ok(1), error('oops')) -> ok(1)`
  )

  test.equal(Result.toValue(error(3), 7), 7, `Result.toValue(error(3), 7) -> 7`)
  test.equal(
    Result.toValue(error(3), "whatever"),
    "whatever",
    `Result.toValue(error(3), 'whatever') -> 'whatever'`
  )
  test.equal(
    Result.toMaybe(error(-4)),
    null,
    `Result.toMaybe(error(-4)) -> null`
  )
  test.deepEqual(
    Result.map($ => $ + 7, error(5)),
    error(5),
    `Result.map($ => $ + 7, error(5)) -> error(5)`
  )
  test.deepEqual(
    Result.format(Error, error("great")),
    error(Error("great")),
    `Result.format(Error, error('great')) -> error(Error('great'))`
  )
  test.deepEqual(
    Result.chain($ => ok($.message), error(Error("boom"))),
    error(Error("boom")),
    `Result.chain($ => ok($.message), error(Error('boom'))) -> error(Error('boom'))`
  )
  test.deepEqual(
    Result.chain($ => error($.message), error(Error("boom"))),
    error(Error("boom")),
    `Result.chain($ => error($.message), error(Error('boom'))) -> error(Error('boom'))`
  )
  test.deepEqual(
    Result.capture(_ => ok("bop"), error("beep")),
    ok("bop"),
    `Result.capture(_ => ok('bop'), error('beep')) -> ok('bop')`
  )
  test.deepEqual(
    Result.capture(_ => error("bop"), error("beep")),
    error("bop"),
    `Result.capture(_ => error('bop'), error('beep'))`
  )
  test.deepEqual(
    Result.recover(Error, error("great")),
    ok(Error("great")),
    `Result.recover(Error, error('great')) -> ok(Error('great'))`
  )
  test.deepEqual(
    Result.and(error(11), ok("foo")),
    error(11),
    `Result.and(error(11), ok('foo')) -> error(11)`
  )
  test.deepEqual(
    Result.and(error(11), error(5)),
    error(11),
    `Result.and(error(11), error(5)) -> error(11)`
  )
  test.deepEqual(
    Result.or(error(1), ok(7)),
    ok(7),
    `Result.or(error(1), ok(7)) -> ok(7)`
  )
  test.deepEqual(
    Result.or(error(1), error("oops")),
    error("oops"),
    `Result.or(error(1), error('oops')) -> error('oops')`
  )
})

test("docs", async test => {
  const parseInt = (input: string): null | number => {
    const value = Number.parseInt(input)
    if (Number.isNaN(value)) {
      return null
    } else {
      return value
    }
  }

  const readInt = (input: string): Result.Result<string, number> =>
    Result.fromMaybe(
      `Input: "${input}" can not be read as an Int`,
      parseInt(input)
    )

  test.deepEqual(readInt("5"), Result.ok(5))
  test.deepEqual(
    readInt("a"),
    Result.error('Input: "a" can not be read as an Int')
  )

  test.deepEqual(readInt("123").toValue(0), 123)
  test.deepEqual(readInt("abc").toValue(0), 0)
  test.deepEqual(Result.toValue(readInt("123"), 0), 123)
  test.deepEqual(Result.toValue(readInt("abc"), 0), 0)

  test.deepEqual(readInt("123").toMaybe(), 123)
  test.ok(readInt("abc").toMaybe() == null)

  test.deepEqual(Result.toMaybe(readInt("123")), 123)
  test.ok(Result.toMaybe(readInt("abc")) == null)

  test.deepEqual(Result.ok(3).map(x => x + 1), Result.ok(4))
  test.deepEqual(
    Result.error("bad input").map(x => x + 1),
    Result.error("bad input")
  )

  test.deepEqual(Result.map(x => x + 1, Result.ok(3)), Result.ok(4))
  test.deepEqual(
    Result.map(x => x + 1, Result.error("bad input")),
    Result.error("bad input")
  )

  test.deepEqual(
    Result.error({ reason: "Bad input", filename: "/path" }).format(
      error => error.reason
    ),
    Result.error("Bad input")
  )

  test.deepEqual(Result.ok(4).format(error => error.reason), Result.ok(4))

  test.deepEqual(
    Result.format(
      error => error.reason,
      Result.error({ reason: "Bad input", filename: "/path" })
    ),
    Result.error("Bad input")
  )

  test.deepEqual(
    Result.format(error => error.reason, Result.ok(4)),
    Result.ok(4)
  )

  test.deepEqual(
    Result.error("Bad input").recover(Error),
    Result.ok(Error("Bad input"))
  )

  test.deepEqual(
    Result.recover(Error, Result.error("Bad Input")),
    Result.ok(Error("Bad Input"))
  )

  type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  const toValidMonth = (n: number): Result.Result<string, Month> => {
    switch (n) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        return Result.ok((n: Month))
      default:
        return Result.error(`Number: ${n} is not with-in 0 to 12 month range`)
    }
  }

  const parseMonth = (input: string): Result.Result<string, Month> =>
    readInt(input).chain(toValidMonth)

  test.deepEqual(parseMonth("4"), Result.ok(4))
  test.deepEqual(
    parseMonth("a"),
    Result.error('Input: "a" can not be read as an Int')
  )
  test.deepEqual(
    parseMonth("13"),
    Result.error("Number: 13 is not with-in 0 to 12 month range")
  )

  {
    const parseMonth = (input: string): Result.Result<string, Month> =>
      Result.chain(toValidMonth, readInt(input))

    test.deepEqual(parseMonth("7"), Result.ok(7))
    test.deepEqual(
      parseMonth("Hi"),
      Result.error('Input: "Hi" can not be read as an Int')
    )
    test.deepEqual(
      parseMonth("0"),
      Result.error("Number: 0 is not with-in 0 to 12 month range")
    )
  }

  test.deepEqual(
    Result.ok(2).and(Result.error("late error")),
    Result.error("late error")
  )

  test.deepEqual(
    Result.error("early error").and(Result.ok(1)),
    Result.error("early error")
  )

  test.deepEqual(
    Result.error("early").and(Result.error("late")),
    Result.error("early")
  )

  test.deepEqual(
    Result.ok(2).and(Result.ok("diff result type")),
    Result.ok("diff result type")
  )

  {
    const { ok, error } = Result
    test.deepEqual(
      Result.and(ok(2), error("late error")),
      Result.error("late error")
    )
    test.deepEqual(
      Result.and(error("early error"), ok(1)),
      Result.error("early error")
    )

    test.deepEqual(
      Result.and(error("early"), error("late")),
      Result.error("early")
    )
    test.deepEqual(
      Result.and(ok(2), ok("diff result type")),
      Result.ok("diff result type")
    )
  }

  const fromMonthName = (month: string): ?Month => {
    switch (month.toLowerCase()) {
      case "january":
        return 1
      case "february":
        return 2
      case "march":
        return 3
      case "april":
        return 4
      case "may":
        return 5
      case "june":
        return 6
      case "july":
        return 7
      case "august":
        return 8
      case "september":
        return 9
      case "october":
        return 10
      case "november":
        return 11
      case "december":
        return 12
      default:
        return null
    }
  }

  const readMonthByName = (input: string): Result.Result<string, Month> =>
    Result.fromMaybe(
      `Input "${input}" is not a valid month name`,
      fromMonthName(input)
    )

  const readMonth = (input: string): Result.Result<string, Month> =>
    parseMonth(input).capture(intError =>
      readMonthByName(input).format(nameError => `${intError} & ${nameError}`)
    )

  test.deepEqual(readMonth("3"), Result.ok(3))
  test.deepEqual(readMonth("June"), Result.ok(6))
  test.deepEqual(
    readMonth("17"),
    Result.error(
      'Number: 17 is not with-in 0 to 12 month range & Input "17" is not a valid month name'
    )
  )
  test.deepEqual(
    readMonth("Jude"),
    Result.error(
      'Input: "Jude" can not be read as an Int & Input "Jude" is not a valid month name'
    )
  )

  {
    const readMonth = (input: string): Result.Result<string, Month> =>
      Result.capture(
        badInt =>
          readMonthByName(input).format(badName => `${badInt} & ${badName}`),
        parseMonth(input)
      )

    test.deepEqual(readMonth("3"), Result.ok(3))
    test.deepEqual(readMonth("June"), Result.ok(6))
    test.deepEqual(
      readMonth("17"),
      Result.error(
        'Number: 17 is not with-in 0 to 12 month range & Input "17" is not a valid month name'
      )
    )
    test.deepEqual(
      readMonth("Jude"),
      Result.error(
        'Input: "Jude" can not be read as an Int & Input "Jude" is not a valid month name'
      )
    )
  }

  {
    const { ok, error } = Result

    test.deepEqual(ok(2).or(error("late error")), Result.ok(2))
    test.deepEqual(error("early error").or(ok(3)), Result.ok(3))
    test.deepEqual(
      error(-1).or(error("diff result type")),
      Result.error("diff result type")
    )
    test.deepEqual(ok(2).or(ok(100)), Result.ok(2))
  }

  {
    const { ok, error } = Result

    test.deepEqual(Result.or(ok(2), error("late error")), Result.ok(2))
    test.deepEqual(Result.or(error("early error"), ok(3)), Result.ok(3))
    test.deepEqual(
      Result.or(error(-1), error("diff result type")),
      Result.error("diff result type")
    )
    test.deepEqual(Result.or(ok(2), ok(100)), Result.ok(2))
  }
})
const isFunction = (value: mixed) => typeof value == "function"
