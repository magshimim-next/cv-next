import Definitions from "../base/Definitions";
import Helper from "../base/helper";

export default class Comment {
  public id: string;
  public userID: string;
  public data: string;
  public lastUpdate: number;
  public documentID?: string;
  public parentCommentID?: string;
  public upvotes?: Array<string>;
  public downvotes?: Array<string>;

  public constructor(
    id: string,
    userID: string,
    data: string,
    documentID?: string,
    parentCommentID?: string,
    upvotes?: Array<string>,
    downvotes?: Array<string>
  ) {
    this.id = id;
    this.userID = userID;
    this.data = data;
    this.lastUpdate = Helper.epochTimeNow();
    this.documentID = documentID;
    this.parentCommentID = parentCommentID;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
  }

  public updateData(data: string) {
    this.data = data;
    this.lastUpdate = Helper.epochTimeNow();
  }

  public addUpvote(userID: string) {
    this.removeDownvote(userID);
    if (this.upvotes === null || this.upvotes === undefined) {
      this.upvotes = [userID];
    } else {
      this.upvotes.push(userID);
    }
    this.lastUpdate = Helper.epochTimeNow();
  }

  public removeUpvote(userID: string) {
    if (this.upvotes !== null && this.upvotes !== undefined) {
      var idx = this.upvotes.findIndex((e) => e === userID);
      if (idx > Definitions.undefinedIndex) {
        this.upvotes.splice(idx, 1);
      }
    }
    this.lastUpdate = Helper.epochTimeNow();
  }

  public addDownvote(userID: string) {
    this.removeUpvote(userID);
    if (this.downvotes === null || this.downvotes === undefined) {
      this.downvotes = [userID];
    } else {
      this.downvotes.push(userID);
    }
    this.lastUpdate = Helper.epochTimeNow();
  }

  public removeDownvote(userID: string) {
    if (this.downvotes !== null && this.downvotes !== undefined) {
      var idx = this.downvotes.findIndex((e) => e === userID);
      if (idx > Definitions.undefinedIndex) {
        this.downvotes.splice(idx, 1);
      }
    }
    this.lastUpdate = Helper.epochTimeNow();
  }
}
