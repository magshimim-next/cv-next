import Helper from "../base/helper"

export default class CVModel {
  userId: string
  documentUrl: string
  description: string | null
  uploadDate: number
  categoryId: number
  isResolved: boolean
  isDeleted: boolean

  static readonly CollectionName = "cv"

  constructor(
    public id: string,
    userId: string,
    documentUrl: string,
    categoryId: number,
    description: string | null = null,
    isResolved = false,
    isDeleted = false
  ) {
    this.userId = userId
    this.documentUrl = documentUrl
    this.description = description
    this.uploadDate = Helper.getCurrentEpochTime()
    this.categoryId = categoryId
    this.isResolved = isResolved
    this.isDeleted = isDeleted
  }

  setResolved(isResolved: boolean): void {
    this.isResolved = isResolved
  }

  setDeleted(isDeleted: boolean): void {
    this.isDeleted = isDeleted
  }

  updateDescription(description: string): void {
    this.description = description
  }
}
