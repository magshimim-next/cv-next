import {login} from '../actions/login/gmailAuth'

export default function Page() {
  return (
    <form>
      <button formAction={login}>Log in</button>
    </form>
  )
}
