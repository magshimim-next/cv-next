export default class Helper {
  public static getCurrentEpochTime(): number {
    return Date.now()
  }

  public static serializeObjectToFirebaseUsage(obj: any) {
    const serialized: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] !== "function") {
        serialized[key] = obj[key]
      }
    }
    return serialized
  }
}
