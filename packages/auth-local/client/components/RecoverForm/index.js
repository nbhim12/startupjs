import React, { useEffect, useState, useRef } from 'react'
import { Platform } from 'react-native'
import { observer, useValue, useSession } from 'startupjs'
import { Alert, Br, Span, Button, TextInput } from '@startupjs/ui'
import { SIGN_IN_SLIDE, RECOVER_PASSWORD_SLIDE } from '@startupjs/auth/isomorphic'
import { Recaptcha } from '@startupjs/recaptcha'
import _get from 'lodash/get'
import _merge from 'lodash/merge'
import PropTypes from 'prop-types'
import { useAuthHelper } from '../../helpers'
import './index.styl'

const IS_WEB = Platform.OS === 'web'

const DEFAULT_CONFIG = {
  emailInputLabel: 'Email',
  emailInputPlaceholder: 'Enter your email',
  resetButtonLabel: 'Get reset link',
  backButtonLabel: 'Back'
}

function RecoverForm ({
  baseUrl,
  config,
  onSuccess,
  onError,
  onChangeSlide
}) {
  const authHelper = useAuthHelper(baseUrl)
  const [recaptchaEnabled] = useSession('auth.recaptchaEnabled')

  const [form, $form] = useValue({ email: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const recaptchaRef = useRef()

  useEffect(() => {
    if (IS_WEB) {
      window.addEventListener('keypress', onKeyPress)
    }

    return () => {
      if (IS_WEB) {
        window.removeEventListener('keypress', onKeyPress)
      }
    }
  }, [])

  function onKeyPress (e) {
    if (e.key === 'Enter') recaptchaEnabled ? recaptchaRef.current.open() : createRecoverySecret()
  }

  async function createRecoverySecret (recaptcha) {
    try {
      await authHelper.createPassResetSecret({ ...form, recaptcha })
      onSuccess && onSuccess(null, RECOVER_PASSWORD_SLIDE)
      setMessage('Check your email for instructions')
      setErrors({})
    } catch (error) {
      setErrors({ server: _get(error, 'response.data.message', error.message) })
      recaptchaEnabled && recaptchaRef.current.close()
      onError && onError(error)
    }
  }

  const _config = _merge({}, DEFAULT_CONFIG, config)

  return pug`
    if !message
      if errors.server
        Alert(variant='error')= errors.server
        Br
      TextInput(
        name='email'
        label=_config.emailInputLabel
        placeholder=_config.emailInputPlaceholder
        value=form.email
        onChangeText=t => $form.set('email', t)
        testID='recover-email-input'
      )
      if recaptchaEnabled
        Br
        Recaptcha(
          id='recover-form-captcha'
          ref=recaptchaRef
          onVerify=createRecoverySecret
        )
      Button.button(
        color='primary'
        variant='flat'
        onPress=() => recaptchaEnabled ? recaptchaRef.current.open() : createRecoverySecret()
        testID='recover-pass-button'
      )= _config.resetButtonLabel
    else
      Span.text= message

    Button.back(
      variant='text'
      color='primary'
      onPress=() => onChangeSlide(SIGN_IN_SLIDE)
      testID='back-to-signin-button'
    )= _config.backButtonLabel
  `
}

RecoverForm.propTypes = {
  baseUrl: PropTypes.string,
  config: PropTypes.object,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onChangeSlide: PropTypes.func
}

export default observer(RecoverForm)
