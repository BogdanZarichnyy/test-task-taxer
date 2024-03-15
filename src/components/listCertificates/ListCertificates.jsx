import css from './ListCertificates.module.css';

const ListCertificates = ({ data, isItemActive, handlerItemActive }) => {
  return (
    <ul className={css.list}>
      {data.map((item) => 
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