export interface ApiLookupResponse {
  success: boolean,
  message: string
  data: ApiLookup,
  errors: null | string[],
}

export interface Lookup {
  oid?: string,
  lookupCode: string,
  lookupNameAr: string,
  lookupNameEn: string,
  isActive: boolean,
  createdBy: string,
}

export interface ApiLookup {
  oid: string,
  lookupCode: string,
  lookupNameAr: string,
  lookupNameEn: string,
  createdAt: string,
  updatedAt: string | null,
  isActive: boolean,
  createdBy: string,
  details: LookupDetail[]
}

export interface LookupDetail {
  oid: string,
  lookupHeaderId: string,
  lookupHeaderCode: string,
  lookupValue: string,
  lookupNameEn: string,
  lookupNameAr: string,
  orderNo: number,
  isActive: boolean,
  createdAt: string,
  createdBy: string
}
