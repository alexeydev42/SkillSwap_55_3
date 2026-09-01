import { AuthLayout } from '@/widgets/AuthLayout';
import { RegistrationProgress } from '@/widgets/RegistrationProgress';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

import IdeaIcon from '@/shared/assets/icons/icon-idea.svg?react';
import EyeIcon from '@/shared/assets/icons/icon-eye.svg?react';
import EyeSlashIcon from '@/shared/assets/icons/icon-eye-slash.svg?react';

import styles from './RegistrationStep1.module.css';

export interface RegistrationStep1Props {
  emailValue?: string;
  passwordValue?: string;
  emailError?: string
  passwordError?: string
}

export const RegistrationStep1 = ({emailValue, passwordValue, emailError, passwordError}: RegistrationStep1Props) => {
  return(
    <AuthLayout
      topContent={<RegistrationProgress currentStep={1} />}
      infoBlockProps={{
        illustration: <IdeaIcon />,
        title: 'Добро пожаловать в SkillSwap!',
        description: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
      }}
    >
    <Button variant='secondary'>Продолжить с Google</Button>
    <Button variant="secondary">Продолжить с Apple</Button>
    <span className={styles.divider}>или</span>
    <Input
    type='email'
    label='Email'
    defaultValue={emailValue}
    error={emailError}
    />
    <Input
      type='password'
      label='Пароль'
      defaultValue={passwordValue}
      error={passwordError}
      helperText={!passwordError ? 'Надёжный' : undefined}
      showPasswordIcon={<EyeIcon />}
      hidePasswordIcon={<EyeSlashIcon />}
    />
    <span className={styles.passwordHint}>Пароль должен содержать не менее 8 знаков</span>
    <Button variant="primary">Далее</Button>
    </AuthLayout>
  )
}
