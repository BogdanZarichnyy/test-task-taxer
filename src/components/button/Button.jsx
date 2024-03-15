import css from './Button.module.css';

const Buttom = ({ title, handlerEvent }) => {
  return (
    <button type="buttom" 
      className={css.button} 
      onClick={() => handlerEvent()}
    >
      {title}
    </button>
  );
};

export default Buttom;