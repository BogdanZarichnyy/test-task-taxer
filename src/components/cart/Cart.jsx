import css from './Cart.module.css';

const Cart = ({ styles, isDetails, initialDetails }) => {
  return (
    <div className={styles}>
      <p className={css.infoCart}>
        <span className={css.text}>Common Name:</span> {!isDetails ? initialDetails.Common_Name : isDetails.Common_Name}
      </p>
      <p className={css.infoCart}>
        <span className={css.text}>Issuer CN:</span> {!isDetails ? initialDetails.Issuer_CN : isDetails.Issuer_CN}
      </p>
      <p className={css.infoCart}>
        <span className={css.text}>Valid From:</span> {!isDetails ? initialDetails.Valid_From : isDetails.Valid_From}
      </p>
      <p className={css.infoCart}>
        <span className={css.text}>Valid To:</span> {!isDetails ? initialDetails.Valid_To : isDetails.Valid_To}
      </p>
    </div>
  );
};

export default Cart;