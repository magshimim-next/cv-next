import { Database as DB } from "@/types/database.types"

declare global {
  type Database = DB
  type CvModel = DB["public"]["Tables"]["cvs"]["Row"]
  type PaginatedCvsModel = { page: number; cvs: CvModel[] }
  type CommentModel = DB["public"]["Tables"]["comments"]["Row"]
}
