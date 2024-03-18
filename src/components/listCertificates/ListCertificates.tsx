import { IListCertificates } from '../../services/interfaces';
import { UserDataType } from '../../services/types';

import css from './ListCertificates.module.css';

const ListCertificates = ({ data, isItemActive, handlerItemActive }: IListCertificates) => {
  return (
    <ul className={css.list}>
      {data.map((item: UserDataType) => 
        <li className={[css.item, isItemActive === item.id && css.itemActive].join(' ')} 
          key={item.id} 
          onClick={() => handlerItemActive(item)}
        >
          {item.Common_Name}
        </li>
      )}
    </ul>
  );
};

export default ListCertificates;