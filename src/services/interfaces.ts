import { UserDataType } from './types';

export interface IButton {
  title: string,
  handlerEvent: () => void
}

export interface ICart {
  styles: string, 
  isDetails: UserDataType | null, 
  initialDetails: UserDataType
}

export interface IInputCertificates {
  styles: string, 
  handlerUploadFile: (event: React.ChangeEvent<HTMLInputElement>) => void,
  sertificateName: string | null
}

export interface IListCertificates {
  data: UserDataType[], 
  isItemActive: number | null,
  handlerItemActive: (cart: UserDataType) => void,
}

export interface IUploadFile {
  file: File, 
  setData: React.Dispatch<React.SetStateAction<UserDataType[] | null>>, 
  setSertificateName: React.Dispatch<React.SetStateAction<string | null>>, 
  setIsAddCart: React.Dispatch<React.SetStateAction<boolean>>, 
  isAddCart: boolean
}