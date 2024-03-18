import { parseCertificate } from "./parseCertificate";
import { load, save } from "../services/storage";

import { IUploadFile } from "../services/interfaces";
import { UserDataType } from "../services/types";

import ASN1 from '@lapo/asn1js';

const getGenericId = (): number => {
  const date: Date = new Date();
  return date.getTime();
};

export const uploadFile = ({file, setData, setSertificateName, setIsAddCart, isAddCart}: IUploadFile) => {
  let reader: FileReader = new FileReader();

  reader.readAsArrayBuffer(file);
  reader.onload = (event: ProgressEvent<FileReader>): void => {
    const data: FileReader | null = event.target;
    if (!data?.result || typeof data?.result === 'string') return; 
    // console.log(data?.result);

    const byteArray: Uint8Array = new Uint8Array(data.result);
    // console.log(byteArray);

    // console.log(reader?.result);
    // if (!reader?.result || typeof reader?.result === 'string') return;
    // const byteArray: Uint8Array = new Uint8Array(reader.result);

    const resultHex: ASN1 = ASN1.decode(byteArray);
    if (resultHex.typeName() !== 'SEQUENCE') {
      throw 'Неправильна структура конверта сертифіката (очікується SEQUENCE)';
    } else {
      // console.log(resultHex);
      // console.log('typeName:', resultHex.typeName());
      // console.log(resultHex.content());

      if (!resultHex?.sub) return;
      const dataObj = {
        [resultHex.typeName()]: resultHex.content(),
        sub: parseCertificate(resultHex.sub),
      };
      // console.log(dataObj);

      // console.log('Common Name', dataObj.sub[0].sub[5].sub[1].sub[0].sub[1].UTF8String);
      // console.log('Issuer CN', dataObj.sub[0].sub[3].sub[2].sub[0].sub[1].UTF8String);
      // console.log('Valid From', dataObj.sub[0].sub[4].sub[0].UTCTime);
      // console.log('Valid To', dataObj.sub[0].sub[4].sub[1].UTCTime);

      let Common_Name: string = '';
      dataObj.sub[0].sub[5].sub.forEach((item: any) => {
        // if (!item.sub) return;
        // console.log(item.sub[0].sub[0].OBJECT_IDENTIFIER.toString());
        // console.log(item.sub[0].sub[1].UTF8String);
        if(item.sub[0].sub[0].OBJECT_IDENTIFIER.includes('commonName')) {
          Common_Name = item.sub[0].sub[1].UTF8String;
        }
      });
      const Issuer_CN: string = dataObj.sub[0].sub[3].sub[2].sub[0].sub[1].UTF8String;
      let Valid_From: string = dataObj.sub[0].sub[4].sub[0].UTCTime;
      let Valid_To: string = dataObj.sub[0].sub[4].sub[1].UTCTime;

      const dateFrom: Date = new Date(Valid_From);
      const dateTo: Date = new Date(Valid_To);
      // console.log(dateFrom.getDate().toString().padStart(2, '0'));
      // console.log(dateFrom.getMonth().toString().padStart(2, '0'));
      // console.log(dateFrom.getFullYear().toString());

      Valid_From = `${dateFrom.getDate().toString().padStart(2, '0')}-${dateFrom.getMonth().toString().padStart(2, '0')}-${dateFrom.getFullYear().toString()}`;
      Valid_To = `${dateTo.getDate().toString().padStart(2, '0')}-${dateTo.getMonth().toString().padStart(2, '0')}-${dateTo.getFullYear().toString()}`;

      const dataStorage: UserDataType = { 
        id: getGenericId(), 
        Common_Name, 
        Issuer_CN, 
        Valid_From, 
        Valid_To 
      };

      const data = load("taxer");

      if (!data) {
        save("taxer", [ dataStorage ]);
        setData([ dataStorage ])
        setSertificateName(null);
        setIsAddCart(!isAddCart);
      } else {
        save("taxer", [ ...data, dataStorage ]);
        setData([ ...data, dataStorage ])
        setSertificateName(null);
        setIsAddCart(!isAddCart);
      }
    }
  };
  reader.onerror = (error: any): void => {
    console.log('Error: ', error);
  };
}