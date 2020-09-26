export type OrdersAPI = {
  getAll(): Promise<any | null>
  getAllByOffice(): Promise<any | null>
  getById(): Promise<any | null>
  create(data: any): Promise<any | null>
  createByOffice(data: any): Promise<any | null>
  addSms(data: any): Promise<any | null>
  addCompletedWork(data: any): Promise<any | null>
  addMasterComment(data: any): Promise<any | null>
  addManagerComment(data: any): Promise<any | null>
  addWorkflow(data: any): Promise<any | null>
  setStatus(data: any): Promise<any | null>
  setPayed(data: any): Promise<any | null>
  setMaster(data: any): Promise<any | null>
  setManager(data: any): Promise<any | null>
  setOffice(data: any): Promise<any | null>
  updateById(data: any): Promise<any | null>
  deleteById(): Promise<any | null>
}
