const PASSWORD_MAX_LENGTH = 50;
const PASSWORD_MIN_LENGTH = 8;

const NAME_MAX_LENGTH = 15;
const NAME_MIN_LENGTH = 3;

const shortName = 'Слишком короткое имя';
const longName = 'Слишком длинное имя';
const incorrectName = 'Некоректні дані при реєстрації';

const incorrectEmail = 'Некоректний емейл';

const shortPassword = 'Слишком короткий пароль';
const longPassword = 'Слишком длинний пароль';

export const validateName = (name) => {
  const regExp = /^([A-Za-z0-9]){3,15}$/gi;

  if (name) {
    if (name.match(regExp)) return true;
    if (name.length < NAME_MIN_LENGTH) return shortName;
    if (name.length > NAME_MAX_LENGTH) return longName;
  }

  return incorrectName;
};

export const validateEmail = (email) => {
  const regExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (email.match(regExp)) return true;
  if (!email.match(regExp)) return incorrectEmail;
};

export const validatePassword = (password) => {
  if (password.length < PASSWORD_MIN_LENGTH) return shortPassword;
  if (password.length > PASSWORD_MAX_LENGTH) return longPassword;

  return true;
};
