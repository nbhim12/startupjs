import filters from './filters'
import {
  CONFIRMED_EMAIL_URL,
  ERROR_URL,
  RECOVER_PASS_URL,
  RESET_PASS_URL,
  SIGN_IN_URL,
  SIGN_UP_URL,
} from './constants'

export default (components = {}) => [
  {
    path: SIGN_IN_URL,
    exact: true,
    component: components.PSignIn,
    filters: [filters.isNotLoggedIn()]
  },
  {
    path: SIGN_UP_URL,
    exact: true,
    component: components.PSignUp,
    filters: [filters.isNotLoggedIn()]
  },
  {
    path: RECOVER_PASS_URL,
    exact: true,
    component: components.PRecover,
    filters: [filters.isNotLoggedIn()]
  },
  {
    path: RESET_PASS_URL,
    exact: true,
    component: components.PResetPassword,
    filters: [filters.isNotLoggedIn()]
  },
  {
    path: ERROR_URL,
    exact: true,
    component: components.PError,
    filters: [filters.isNotLoggedIn(), (model, next, redirect) => {
      const query = model.at('$render.query').get()
      if (!query.err) return redirect('/')
      next()
    }]
  },
  {
    path: CONFIRMED_EMAIL_URL,
    exact: true,
    component: components.PConfirmedEmail,
    filters: [filters.isNotLoggedIn()]
  },
]
