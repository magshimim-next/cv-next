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
  // at the moment there is no need for update methods since once a user would like to update a CV he'll just create a new one.
}
