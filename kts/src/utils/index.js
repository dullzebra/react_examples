import moment from 'moment';
moment.locale('ru');

export const formatNumber = value => {
  try {
    const isDecimalShow = !!(value % Math.round(value));
    return value = value.toLocaleString('ru-RU', {
      minimumFractionDigits: isDecimalShow ? 2 : 0,
    });
  } catch (e) {
    return value;
  }
};

export const formatDate = value => {
  try {
    return moment(value).format('DD.MM.YYYY HH:mm');
  } catch (e) {
    return value;
  }
};

export const localeRU = {
  months : ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
};

export const getForumBsStyle = isPublic => (isPublic ? 'info' : 'warning');

export const declineDesimalNoun = (number, [nounSingle, noun24, nounPlural]) => {
  try {
    const num = Math.abs(number);

    if ((num % 100 >= 11 && num % 100 <= 14) || (num % 10 >= 5 && num % 10 <= 9) || num % 10 === 0) {
      return nounPlural;
    } else if (num % 10 === 1) {
      return nounSingle;
    } else if (num % 10 >= 1 && num % 10 <= 5) {
      return noun24;
    }
  } catch (e) {
    return '';
  }
};
