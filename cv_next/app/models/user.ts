export default class User {
  public id: string;
  public email: string;
  public name: string;

  public constructor(name: string, id: string, email: string) {
    this.name = name;
    this.id = id;
    this.email = email;
  }

  public updateName(name: string) {
    this.name = name;
  }

  public updateEmail(email: string) {
    this.email = email;
  }
}
