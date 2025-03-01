import { PostgrestError, AuthError } from "@supabase/supabase-js";
import { UI_Location } from "@/lib/definitions";
import { Database as DB } from "@/types/database.types";
import { PermsKeys } from "@/lib/supabase-definitions";
declare global {
  type Database = DB;
  type CvModel = DB["public"]["Tables"]["cvs"]["Row"];
  type PaginatedCvsModel = { page: number; cvs: CvModel[] };
  type CommentModel = DB["public"]["Tables"]["comments"]["Row"];
  type ErrorDetails = {
    postgrestError?: PostgrestError;
    authError?: AuthError;
    err?: Error;
  };
  type Result<T, E> =
    | { ok: true; val: T }
    | {
        ok: false;
        where: E;
        errors: ErrorDetails;
      };
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
    explanation?: string;
    image: string;
  };

  type NewCvModel = Omit<
    CvModel,
    "id" | "resolved" | "created_at" | "deleted" | "resolved"
  >;
  type UILocation = (typeof UI_Location)[keyof typeof UI_Location];
  type route = {
    route: string;
    path: string;
    image: string;
    UILocation: UILocation;
  };

  type UserWithPerms = UserModel & { user_type: PermsKeys.user_types_enum };
}
