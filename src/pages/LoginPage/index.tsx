import {AuthHeader} from '../../widgets/AuthHeader'
import {Button} from '../../shared/ui/Button'
import styles from './LoginPage.module.css'


export default function LoginPage() {
  return (
  <AuthLayout>
   <AuthHeader/>
    <main>
      <Button>Выход</Button>
      <div>
        <Button>Продолжить с Google</Button>
        <Button>Продолжить с Apple</Button>
        <div className={styles.divider}><span>Или</span></div>
        <form>
          <label></label>
          <input type="text"><input/>
          </form>

      </div>

    </main>
    <AuthLayout/>
  )
}
