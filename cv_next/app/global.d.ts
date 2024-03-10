import { Database as DB } from "@/types/database.types"

declare global {
  type Database = DB
  type CvModel = DB["public"]["Tables"]["cvs"]["Row"]
  type PaginatedCvsModel = { page: number; cvs: CvModel[] }
  type CommentModel = DB["public"]["Tables"]["comments"]["Row"]
  type NewCommentModel = Omit<
    CommentModel,
    | "id"
    | "created_at"
    | "last_update"
    | "upvotes"
    | "downvotes"
    | "deleted"
    | "resolved"
  >
  type UserModel = DB["public"]["Tables"]["users"]["Row"]
  type PageHeader = {
    header: string
    subheader: string
    image: string
  }
}
