import Helper from "../base/helper";
import BaseModel from "./baseModel";

export default class UserModel implements BaseModel {
  public email: string;
  public name: string;
  public active: boolean;
  public created: number;
  public lastLogin?: number | null;

  public collectionName: string;
  public id: string;
  public removeBaseData: () => Omit<BaseModel, "id" | "collectionName">;

  public static readonly CollectionName: string = "user";

  public constructor(
    name: string,
    id: string,
    email: string,
    active: boolean = false
  ) {
    this.id = id;
    this.collectionName = UserModel.CollectionName;
    this.removeBaseData = () => {
      const { id, collectionName, ...rest } = this;
      return rest;
    };
    this.name = name;
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
