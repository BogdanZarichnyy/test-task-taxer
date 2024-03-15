import css from './InputCertificates.module.css';

const InputCertificates = ({ styles, handlerUploadFile, sertificateName }) => {
  return (
    <label className={styles} htmlFor="sertificate">
      <input className={css.inputHidden} 
        type="file" id="sertificate" 
        name="sertificate" 
        accept="application/x-x509-ca-cert" 
        onChange={handlerUploadFile}
      />
      <p className={css.inputInfo}>{sertificateName ?? 'Перетягніть файл сертифікату сюди'}</p>
      <p className={css.inputButton}>Виберіть через стандартний діалог</p>
    </label>
  );
};

export default InputCertificates;