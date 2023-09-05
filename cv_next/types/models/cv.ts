import Helper from "@/server/base/helper";
import BaseModel from "./baseModel";
import { Categories } from "./categories";

export default class CvModel implements BaseModel {
  public userID: string;
  public documentLink: string;
  public description?: string | null;
  public uploadDate: number;
  public categoryID: number;
  public resolved: boolean;
  public deleted: boolean;

  public collectionName: string;
  public id: string;
  public removeBaseData: () => Omit<BaseModel, "id" | "collectionName">;

  public static readonly CollectionName: string = "cv";

  public constructor(
    id: string,
    userID: string,
    documentLink: string,
    categoryID: number,
    description?: string,
    resolved? : boolean,
    deleted? : boolean,
    uploadDate? : number,
  ) {
    this.id = id;
    this.collectionName = CvModel.CollectionName;
    this.removeBaseData = () => {
      const { id, collectionName, ...rest } = this;
      return rest;
    };
    this.userID = userID;
    this.documentLink = documentLink;
    this.description = description || null;
    this.uploadDate = uploadDate ?? Helper.epochTimeNow();
    this.categoryID = categoryID;
    this.resolved = resolved ?? false;
    this.deleted = deleted ?? false;
  }

  public setResolved(resolved: boolean) {
    this.resolved = resolved;
  }
  
  public setDeleted(deleted: boolean) {
    this.deleted = deleted;
  }

  public updateDescription(description: string) {
    this.description = description;
  }

  public getCategory(): Categories.category {
    let res = Helper.getEnumValueById(Categories.category, this.categoryID);
    return res !== undefined ? res : Categories.category.undefined;
  }
}
