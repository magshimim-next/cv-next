import Helper from "../base/helper";
import BaseModel from "./baseModel";

export default class CvModel implements BaseModel {
  public userID: string;
  public documentLink: string;
  public description?: string | null;
  public uploadDate: number;
  public categoryID: number;

  public collectionName: string;
  public id: string;
  public removeBaseData: () => Omit<BaseModel, "id" | "collectionName">;

  public static readonly CollectionName: string = "cv";

  public constructor(
    id: string,
    userID: string,
    documentLink: string,
    categoryID: number,
    description?: string
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
    this.uploadDate = Helper.epochTimeNow();
    this.categoryID = categoryID;
  }

  public updateDescription(description: string) {
    this.description = description;
  }
}
