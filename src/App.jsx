import { useEffect, useState } from 'react';
import Buttom from './components/button/Button';
import ListCertificates from './components/listCertificates/ListCertificates';
import InputCertificates from './components/inputCertificates/InputCertificates';
import Cart from './components/cart/Cart';

import ASN1 from '@lapo/asn1js';

import { save, load } from './service/storage'

import css from './App.module.css';

export default function App() {
  const [data, setData] = useState(null);
  const [isAddCart, setIsAddCart] = useState(false);
  const [isItemActive, setIsItemActive] = useState(null);
  const [isDetails, setIsDetails] = useState(null);
  const [sertificateName, setSertificateName] = useState(null);

  useEffect(() => {
    const dataStorage = load("taxer");
    if (!dataStorage) {
      return
    }
    setData(dataStorage);
  }, []);

  const getGenericId = () => {
    const date = new Date();
    return date.getTime();
  };

  const handlerEvent = () => {
    setIsAddCart(!isAddCart);
  }

  const handlerItemActive = (cart) => {
    setIsItemActive(cart.id);
    setIsDetails(cart);
  }

  function parseDataFile(subArray) {
    let parseSubArray = [];

    subArray.forEach((item) => {
      // console.log('typeName:', item.typeName());
      // console.log(item.content());

      if (item.sub === null) {
        parseSubArray.push({
          [item.typeName()]: item.content()
        });
      } else {
        parseSubArray.push({
          [item.typeName()]: item.content(),
          sub: parseDataFile(item.sub)
        });
      }

    });

    return parseSubArray;
  }

  const handlerUploadFile = (event) => {
    // console.log('file', event.target.files[0]);
    const file = event.target.files[0];
    
    setSertificateName(file.name);

    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function() {
      // console.log(reader.result);

      const byteArray = new Uint8Array(reader.result);
      // console.log(byteArray);

      const resultHex = ASN1.decode(byteArray);
      if (resultHex.typeName() !== 'SEQUENCE') {
        throw 'Неправильна структура конверта сертифіката (очікується SEQUENCE)';
      } else {
        // console.log(resultHex);
        // console.log('typeName:', resultHex.typeName());
        // console.log(resultHex.content());

        const dataObj = {
          [resultHex.typeName()]: resultHex.content(),
          sub: parseDataFile(resultHex.sub)
        };
        // console.log(dataObj);

        // console.log('Common Name', dataObj.sub[0].sub[5].sub[1].sub[0].sub[1].UTF8String);
        // console.log('Issuer CN', dataObj.sub[0].sub[3].sub[2].sub[0].sub[1].UTF8String);
        // console.log('Valid From', dataObj.sub[0].sub[4].sub[0].UTCTime);
        // console.log('Valid To', dataObj.sub[0].sub[4].sub[1].UTCTime);

        let Common_Name = '';
        dataObj.sub[0].sub[5].sub.forEach((item) => {
          // console.log(item.sub[0].sub[0].OBJECT_IDENTIFIER.toString());
          // console.log(item.sub[0].sub[1].UTF8String);
          if(item.sub[0].sub[0].OBJECT_IDENTIFIER.includes('commonName')) {
            Common_Name = item.sub[0].sub[1].UTF8String;
          }
        });
        const Issuer_CN = dataObj.sub[0].sub[3].sub[2].sub[0].sub[1].UTF8String;
        let Valid_From = dataObj.sub[0].sub[4].sub[0].UTCTime;
        let Valid_To = dataObj.sub[0].sub[4].sub[1].UTCTime;

        const dateFrom = new Date(Valid_From);
        const dateTo  = new Date(Valid_To);
        // console.log(dateFrom.getDate().toString().padStart(2, '0'));
        // console.log(dateFrom.getMonth().toString().padStart(2, '0'));
        // console.log(dateFrom.getFullYear().toString());

        Valid_From = `${dateFrom.getDate().toString().padStart(2, '0')}-${dateFrom.getMonth().toString().padStart(2, '0')}-${dateFrom.getFullYear().toString()}`;
        Valid_To = `${dateTo.getDate().toString().padStart(2, '0')}-${dateTo.getMonth().toString().padStart(2, '0')}-${dateTo.getFullYear().toString()}`;

        const dataStorage = { 
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
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  return (
    <div className={css.main}>

      <div className={css.catalog}>
        {!isAddCart 
          ? <Buttom title="Додати" handlerEvent={() => handlerEvent("Додати")} />
          : <Buttom title="Назад" handlerEvent={() => handlerEvent("Назад")} />
        }
        {(!!data & !isAddCart)
          ? <ListCertificates data={data} isItemActive={isItemActive} handlerItemActive={handlerItemActive}/>
          : !isAddCart && <p className={css.notice}>Немає жодного сертифікату</p>
        }
      </div>
      
      <div className={css.details}>
        {isAddCart && <InputCertificates styles={css.detailsInfo} handlerUploadFile={handlerUploadFile} sertificateName={sertificateName} />}
        {(!!data & !isAddCart) 
          ? <Cart styles={css.detailsInfo} isDetails={isDetails} initialDetails={data[0]} />
          : ''
        }
      </div>

    </div>
  );
}