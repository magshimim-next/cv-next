import Helper from "../base/helper";

export default class User {
  public id: string;
  public email: string;
  public name: string;
  public active: boolean;
  public created: number;
  public lastLogin?: number;

  public constructor(name: string, id: string, email: string, active: boolean = false) {
    this.name = name;
    this.id = id;
    this.email = email;
    this.active = active;
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
  
  public updateActiveValue(active: boolean = false) {
    this.active = active;
  }
}
