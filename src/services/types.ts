export type UserDataType = {
  id: number, 
  Common_Name: string, 
  Issuer_CN: string, 
  Valid_From: string, 
  Valid_To: string 
};

type KeyUserDataType = {
  [key: string]: string,
}

type SubArrayUserDataType = { 
  sub: any[]
}

export type ParseUserDataType = KeyUserDataType & SubArrayUserDataType;