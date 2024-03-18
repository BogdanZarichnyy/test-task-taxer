import { IButton } from '../../services/interfaces';

import css from './Button.module.css';

const Buttom = ({ title, handlerEvent }: IButton) => {
  return (
    <button type="button" 
      className={css.button} 
      onClick={handlerEvent}
    >
      {title}
    </button>
  );
};

export default Buttom;