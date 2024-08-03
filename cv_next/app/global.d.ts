import { uiLocation } from "@/lib/definitions";
import { Database as DB } from "@/types/database.types"
import { ValueOf } from "next/dist/shared/lib/constants";

declare global {
  type Database = DB
  type CvModel = DB["public"]["Tables"]["cvs"]["Row"]
  type PaginatedCvsModel = { page: number; cvs: CvModel[] }
  type CommentModel = DB["public"]["Tables"]["comments"]["Row"]
  type UserModel = DB["public"]["Tables"]["users"]["Row"]
  type PageHeader = {
    header: string
    subheader: string,
    explanation?: string,
    image: string
  }
  type UILocation = typeof uiLocation[keyof typeof uiLocation]
  type routes = {
    route: string,
    path: string,
    image: string,
    UILocation: UILocation
  }
}
