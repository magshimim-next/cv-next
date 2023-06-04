import Helper from "../base/helper";

export default class CV {
  public id: string;
  public userID: string;
  public documentLink: string;
  public description: string;
  public uploadDate: number;
  public categoryID: number;

  public constructor(
    id: string,
    userID: string,
    documentLink: string,
    description: string,
    categoryID: number
  ) {
    this.id = id;
    this.userID = userID;
    this.documentLink = documentLink;
    this.description = description;
    this.uploadDate = Helper.epochTimeNow();
    this.categoryID = categoryID;
  }

  public updateDescription(description: string) {
    this.description = description;
  }
}
