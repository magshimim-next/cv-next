export default class Helper {
  public static epochTimeNow(): number {
    return new Date().getTime();
  }

  // Function to serialize class objects
  public static serializeObjectToFirebaseUsage(obj: any) {
    const serialized: any = {};
    for (const key in obj) {
      if (
        Object.prototype.hasOwnProperty.call(obj, key) &&
        typeof obj[key] !== "function"
      ) {
        serialized[key] = obj[key];
      }
    }

    return serialized;
  }

  public static getEnumValueById<
    T extends Record<string, string | number>,
    V extends T[keyof T]
  >(enumType: T, id: V): T[keyof T] | undefined {
    const enumValues = Object.values(enumType) as V[];

    if (enumValues.includes(id)) {
      const enumKey = Object.keys(enumType).find(
        (key) => enumType[key as keyof T] === id
      );
      return enumType[enumKey as keyof T];
    }

    return undefined;
  }

  public static getEnumIndex<T extends Record<string, string | number>>(
    enumType: T,
    enumValue: keyof T
  ): number | undefined {
    const enumKeys = Object.keys(enumType) as Array<keyof T>;
    const index = enumKeys.findIndex(
      (key) => enumType[key] === enumType[enumValue]
    );

    if (index !== -1) {
      return index;
    }

    return undefined;
  }
}
