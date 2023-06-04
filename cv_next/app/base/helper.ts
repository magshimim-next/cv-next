export default class Helper {
  public static epochTimeNow(): number {
    return new Date().getTime();
  }

  // Function to serialize class objects
  public static serializeObject(obj: any) {
    const serialized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] !== "function") {
        serialized[key] = obj[key];
      }
    }

    return serialized;
  }
}
