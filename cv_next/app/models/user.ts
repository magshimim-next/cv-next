import Helper from "../base/helper";

export default class User {
  public id: string;
  public email: string;
  public name: string;
  public created: number;
  public lastLogin?: number;

  public constructor(name: string, id: string, email: string) {
    this.name = name;
    this.id = id;
    this.email = email;
    this.created = Helper.epochTimeNow();
  }

  public updateName(name: string) {
    this.name = name;
  }

  public updateEmail(email: string) {
    this.email = email;
  }
  
  public updateLastLogin() {
    this.lastLogin = Helper.epochTimeNow();
  }
}
