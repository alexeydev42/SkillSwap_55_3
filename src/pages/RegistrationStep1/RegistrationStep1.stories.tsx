import { RegistrationStep1 } from './RegistrationStep1';

export default {
  title: 'Pages/RegistrationStep1',
  component: RegistrationStep1,
};

export const Default = {
  args: {},
};

export const EmailError = {
  args: {
    emailValue: 'petrov@mail.ru',
    emailError: 'Email уже используется',
  },
};

export const PasswordError = {
  args: {
    passwordValue: 'Слабый пароль',
    passwordError: 'Недостаточно надёжный пароль',
  },
};
