export default interface BaseModel {
  collectionName: string
  id: string

  /**
   *
   * @returns The model without the ID
   */
  removeBaseData: () => Omit<BaseModel, "id" | "collectionName">
}
