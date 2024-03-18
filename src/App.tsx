import { useEffect, useState } from 'react';
import Buttom from './components/button/Button';
import ListCertificates from './components/listCertificates/ListCertificates';
import InputCertificates from './components/inputCertificates/InputCertificates';
import Cart from './components/cart/Cart';

import { UserDataType } from './services/types';
import { uploadFile } from './utils/uploadFile';
import { load } from './services/storage'

import css from './App.module.css';

export default function App() {
  const [data, setData] = useState<UserDataType[] | null>(null);
  const [isAddCart, setIsAddCart] = useState(false);
  const [isItemActive, setIsItemActive] = useState<number | null>(null);
  const [isDetails, setIsDetails] = useState<UserDataType | null>(null);
  const [sertificateName, setSertificateName] = useState<string | null>(null);

  useEffect(() => {
    const dataStorage = load("taxer");
    if (!dataStorage) {
      return
    }
    setData(dataStorage);
  }, []);

  const handlerEvent = () => {
    setIsAddCart(!isAddCart);
  }

  const handlerItemActive = (cart: UserDataType) => {
    setIsItemActive(cart.id);
    setIsDetails(cart);
  }

  const handlerUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('file', event.target.files[0]);
    const files: FileList | null = event.target.files;
    if (!files) return;
  
    const file: File = files[0];
    setSertificateName(file.name);

    uploadFile({file, setData, setSertificateName, setIsAddCart, isAddCart});
  }

  return (
    <div className={css.main}>

      <div className={css.catalog}>
        {!isAddCart 
          ? <Buttom title="Додати" handlerEvent={handlerEvent} />
          : <Buttom title="Назад" handlerEvent={handlerEvent} />
        }
        {(!!data && !isAddCart)
          ? <ListCertificates data={data} isItemActive={isItemActive} handlerItemActive={handlerItemActive}/>
          : !isAddCart && <p className={css.notice}>Немає жодного сертифікату</p>
        }
      </div>
      
      <div className={css.details}>
        {isAddCart && <InputCertificates styles={css.detailsInfo} handlerUploadFile={handlerUploadFile} sertificateName={sertificateName} />}
        {(!!data && !isAddCart) 
          ? <Cart styles={css.detailsInfo} isDetails={isDetails} initialDetails={data[0]} />
          : ''
        }
      </div>

    </div>
  );
}