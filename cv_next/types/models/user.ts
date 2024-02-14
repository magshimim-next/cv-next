import Helper from "@/server/base/helper"
import BaseModel from "./baseModel"
import { UserTypes } from "./userTypes"

export default class UserModel implements BaseModel {
  public email: string
  public name: string
  public active: boolean
  public created: number
  public lastLogin: number | null
  public userTypeID: number

  public collectionName: string
  public id: string
  public removeBaseData: () => Omit<BaseModel, "id" | "collectionName">

  public static readonly CollectionName: string = "user"

  public constructor(
    id: string,
    name: string,
    email: string,
    userTypeID: number,
    active: boolean = false,
    created?: number,
    lastLogin?: number
  ) {
    this.id = id
    this.collectionName = UserModel.CollectionName
    this.removeBaseData = () => {
      const { id, collectionName, ...rest } = this
      return rest
    }
    this.name = name
    this.email = email
    this.active = active
    this.userTypeID = userTypeID
    this.created = created ?? Helper.epochTimeNow()
    this.lastLogin = lastLogin ?? null
  }

  public updateName(name: string) {
    this.name = name
  }

  public updateEmail(email: string) {
    this.email = email
  }

  public updateLastLogin() {
    this.lastLogin = Helper.epochTimeNow()
  }

  public updateActiveValue(active: boolean = false) {
    this.active = active
  }

  public getUserType(): UserTypes.userType {
    let res = Helper.getEnumValueById(UserTypes.userType, this.userTypeID)
    return res !== undefined ? res : UserTypes.userType.regular
  }
}
