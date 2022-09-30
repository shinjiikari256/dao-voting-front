const NET_NAME = 'localhost';

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const handlerError = (err) => {
  if (err.code !== ERROR_CODE_TX_REJECTED_BY_USER) console.error(err?.data?.message ?? err?.message);
};

export { NET_NAME };

export { handlerError };
