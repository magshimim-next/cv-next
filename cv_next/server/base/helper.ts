import "server-only"

namespace Helper {
  /**
   * Returns the current epoch time.
   *
   * @return {number} The current epoch time.
   */
  export function epochTimeNow(): number {
    return new Date().getTime()
  }

  /**
   * Serializes an object to a Firebase usage object.
   *
   * @param {any} obj - The object to be serialized.
   * @return {any} The serialized object.
   */
  export function serializeObjectToFirebaseUsage(obj: any) {
    const serializedObj: any = {}
    for (const prop in obj) {
      if (typeof obj[prop] !== "function") {
        serializedObj[prop] = obj[prop]
      }
    }
    return serializedObj
  }

  /**
   * Returns the value of an enum based on its ID.
   *
   * @param {T} enumType - The enum type.
   * @param {V} id - The ID of the enum value.
   * @return {T[keyof T] | undefined} The value of the enum or undefined if not found.
   */
  export function getEnumValueById<
    T extends Record<string, string | number>,
    V extends T[keyof T],
  >(enumType: T, id: V): T[keyof T] | undefined {
    const enumValues = Object.values(enumType) as V[]
    const enumKey = Object.keys(enumType).find(
      (key) => enumType[key as keyof T] === id
    )

    return enumValues.includes(id) ? enumType[enumKey as keyof T] : undefined
  }
}

export default Helper
