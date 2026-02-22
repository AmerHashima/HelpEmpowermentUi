export interface Student {
  oid?:string;
  nameEn: string,
  nameAr: string,
  email: string,
  mobile: string,
  username: string,
  password?: string,
  // isActive: boolean,
  createdBy?: string,
  updatedBy?: string

}

export interface APIStudent {
  oid: string,
  nameEn: string,
  nameAr: string,
  email: string,
  mobile: string,
  username: string,
  isActive: true,
  createdAt: string,
  createdBy: string,
  updatedAt: string,
  updatedBy: string
}


export interface AuthStudent {
  nameEn: string,
  nameAr: string,
  email: string,
  mobile: string,
  username: string,
  password?: string,
  confirmPassword?: string,
}

export interface APIAuthStudent {
  userId:string,
  nameEn: string,
  nameAr: string,
  email: string,
  mobile: string,
  username: string,
  token:string,
  refreshToken:string,
  tokenExpires:string,
  userType: string,
  roles:string[]

}





