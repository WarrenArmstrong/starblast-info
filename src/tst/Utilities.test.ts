import { abbreviate, getTimeElapsedString } from "../Utilities"

test("getTimeElapsedString", () => {
	expect(getTimeElapsedString(10)).toStrictEqual("10 seconds")
	expect(getTimeElapsedString(59)).toStrictEqual("59 seconds")
	expect(getTimeElapsedString(60)).toStrictEqual("1 minute")
	expect(getTimeElapsedString(61)).toStrictEqual("1 minute")
	expect(getTimeElapsedString(125)).toStrictEqual("2 minutes")
	expect(getTimeElapsedString(3595)).toStrictEqual("59 minutes")
	expect(getTimeElapsedString(3600)).toStrictEqual("1 hour")
	expect(getTimeElapsedString(3800)).toStrictEqual("1 hour, 3 minutes")
})

test("abbreviate", () => {
	expect(abbreviate("Vandalay Industries", 30)).toStrictEqual("Vandalay Industries")
	expect(abbreviate("Vandalay Industries", 19)).toStrictEqual("Vandalay Industries")
	expect(abbreviate("Vandalay Industries", 18)).toStrictEqual("Vandalay In.")
	expect(abbreviate("Vandalay Industries", 12)).toStrictEqual("Vandalay In.")
	expect(abbreviate("Vandalay Industries", 11)).toStrictEqual("Vandalay")
	expect(abbreviate("Vandalay Industries", 8)).toStrictEqual("Vandalay")
	expect(abbreviate("Vandalay Industries", 7)).toStrictEqual("Va.")
	expect(abbreviate("Vandalay Industries", 3)).toStrictEqual("Va.")
	expect(() => abbreviate("Vandalay Industries", 2)).toThrow()
	expect(() => abbreviate("Vandalay Industries", -10)).toThrow()
})

export {}