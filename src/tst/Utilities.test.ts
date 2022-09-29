import { getTimeElapsedString } from "../Utilities"

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

export {}