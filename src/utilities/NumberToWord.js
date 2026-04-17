import {ToWords} from 'to-words';

const convertAmountToWords = amountStr => {
  const amount = amountStr.replace(/[₹,]/g, ''); // Remove ₹ and commas
  const toWords = new ToWords({
    converterOptions: {
      currency: true,
    },
  });
  const words = toWords.convert(amount);

  return `${words}`;
};

export default convertAmountToWords;
