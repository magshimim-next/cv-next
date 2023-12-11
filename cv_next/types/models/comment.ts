import Definitions from "@/server/base/definitions";
import Helper from "@/server/base/helper";
import BaseModel from "./baseModel";

export default class CommentModel implements BaseModel {
  public userID: string;
  public data: string;
  public resolved: boolean;
  public deleted: boolean;
  public lastUpdate: number;
  public documentID: string | null;
  public parentCommentID: string | null;
  public upvotes: Array<string> | null;
  public downvotes: Array<string> | null;

  public collectionName: string;
  public id: string;
  public removeBaseData: () => Omit<BaseModel, "id" | "collectionName">;

  public static readonly CollectionName: string = "comment";

  public constructor(
    id: string,
    userID: string,
    data: string,
    resolved: boolean = false,
    deleted: boolean = false,
    documentID?: string,
    parentCommentID?: string,
    upvotes?: Array<string>,
    downvotes?: Array<string>,
    lastUpdate?: number
  ) {
    this.id = id;
    this.collectionName = CommentModel.CollectionName;
    this.removeBaseData = () => {
      const { id, collectionName, ...rest } = this;
      return rest;
    };
    this.userID = userID;
    this.data = data;
    this.lastUpdate = lastUpdate ?? Helper.epochTimeNow();
    this.documentID = documentID || null;
    this.parentCommentID = parentCommentID || null;
    this.upvotes = upvotes || null;
    this.downvotes = downvotes || null;
    this.resolved = resolved;
    this.deleted = deleted;
  }

  public updateData(data: string) {
    this.data = data;
    this.lastUpdate = Helper.epochTimeNow();
  }

  public markDeleted(deleted: boolean) {
    this.deleted = deleted;
    this.lastUpdate = Helper.epochTimeNow();
  }

  public updateResolvedValue(resolved: boolean = false) {
    this.resolved = resolved;
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

export type ClientCommentModel = Omit<CommentModel, "removeBaseData" | "updateData" | "markDeleted"
| "updateResolvedValue" | "addUpvote" | "removeUpvote" | "addDownvote" | "removeDownvote">;
