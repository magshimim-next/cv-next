import { Database as DB } from "@/types/database.types";
import { PostgrestError } from "@supabase/supabase-js";

declare global {
  type Database = DB;
  type CvModel = DB["public"]["Tables"]["cvs"]["Row"];
  type PaginatedCvsModel = { page: number; cvs: CvModel[] };
  type CommentModel = DB["public"]["Tables"]["comments"]["Row"];
  type Result<T, E> =
    | { ok: true; val: T }
    | { ok: false; where: E; postgrestError?: PostgrestError; err?: Error };
  type NewCommentModel = Omit<
    CommentModel,
    | "id"
    | "created_at"
    | "last_update"
    | "upvotes"
    | "downvotes"
    | "deleted"
    | "resolved"
  >;
  type UserModel = DB["public"]["Tables"]["profiles"]["Row"];
  type PageHeader = {
    header: string;
    subheader: string;
    image: string;
  };
}
