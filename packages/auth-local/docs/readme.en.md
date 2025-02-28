import { LoginForm, RecoverForm, RegisterForm, ChangePasswordForm } from '@startupjs/auth-local'
import Joi from '@hapi/joi'
import { Button } from '@startupjs/ui'

# Local auth

## Init main module
[Configuring main module](/docs/auth/main)

## Requirements
```
@startupjs/auth: >= 0.33.0
text-encoding-polyfill: >= 0.6.7
```

## Init of additional modules
In root index.js add:
```js
import 'text-encoding-polyfill'
```

## Enabling captcha
If you want to add **reCaptcha** for registration and password change forms, follow the instructions from [documentation @startupjs/recaptcha](/docs/libraries/recaptcha#connecting-to-startup-js) and add the `recaptchaEnabled` parameter in file `server/index.js`:

```js
initAuth(ee, {
  // ...
  recaptchaEnabled: true,
  // ...
})
```

## Enabling confirmation a registration
If you want to force users to confirm their email when they register, then specify next option `confirmRegistration` with `true` value

```js
initAuth(ee, {
  // ...
  confirmRegistration: true, // Default: false
  // ...
})
```

### There are additional registration confirmation settings:
| Prop name | Default value | Type | Purpouse |
|:---------:|:-------------:|:----:|:--------:|
| confirmEmailTimeLimit | `86400000` | number | A time limit im ms for email confirmation |
| registrationConfirmedUrl | `/auth/confirmed-email` | string | Page url to inform a user about successful email confirmation |


## Init on server
Importing strategy:
```js
import { Strategy as LocalStrategy } from '@startupjs/auth-local/server'
```

```js
initAuth(ee, {
  strategies: [
    new LocalStrategy()
  ]
})
```

## LoginForm
Form for login
```js
import { LoginForm } from '@startupjs/auth-local'
```

Accepts props:
- **baseUrl**: set base url for the form
- **redirectUrl**: set redirect url after authorization
- **onSuccess**: called after successful authorization
- **onError**: called when an authorization error occurs
- **onChangeSlide**: gets name of the slide after clicking on actions

```jsx example
return <LoginForm />
```

**Customization**
Props for customization:
- **properties**: it works on the principle of `properties` from ObjectInput, you can add new fields or override the standard ones
- **validateSchema**: prop to describe [joy](https://join.dev/api/) schemas, you need to pass the object as in the example. Also, if a new form is added, a schema must always be described for it
- **renderActions**: a function that returns a new layout for actions

```jsx example
function renderActions ({ onSubmit }) {
  return pug`
    Button(
      style={ marginTop: 16 }
      onPress=onSubmit
    ) Login
  `
}

return pug`
  LoginForm(
    properties={
      age: {
        input: 'number',
        label: 'Age',
        placeholder: 'Enter your age'
      }
    }
    validateSchema={
      age: Joi.number()
        .required()
        .messages({
          'any.required': 'Fill in the field',
          'string.empty': 'Fill in the field'
        })
    }
    renderActions=renderActions
  )
`
```

## RegisterForm
Form for registration
```js
import { RegisterForm } from '@startupjs/auth-local'
```

Accepts props:
- **baseUrl**: set base url for the form
- **recaptchaBadgePosition**: reposition the reCAPTCHA badge
- **redirectUrl**: set redirect url after authorization
- **onSuccess**: called after successful authorization
- **onError**: called when an authorization error occurs
- **onChangeSlide**: gets name of the slide after clicking on actions

```jsx example
return <RegisterForm />
```

**Customization**
Props for customization:
- **properties**: it works on the principle of `properties` from ObjectInput, you can add new fields or override the standard ones
- **validateSchema**: prop to describe [joy](https://join.dev/api/) schemas, you need to pass the object as in the example. Also, if a new form is added, a schema must always be described for it
- **renderActions**: a function that returns a new layout for actions

```jsx example
function renderActions ({ onSubmit }) {
  return pug`
    Button(
      style={ marginTop: 16 }
      onPress=onSubmit
    ) Sign In
  `
}

return pug`
  RegisterForm(
    properties={
      age: {
        input: 'number',
        label: 'Age',
        placeholder: 'Enter your age'
      }
    }
    validateSchema={
      age: Joi.number()
        .required()
        .messages({
          'any.required': 'Fill in the field',
          'string.empty': 'Fill in the field'
        })
    }
    renderActions=renderActions
  )
`
```

## RecoverForm
Password change form
```js
import { RecoverForm } from '@startupjs/auth-local'
```

```jsx example
return <RecoverForm />
```

## Server cookies

### onBeforeRegister
Helper-middleware, called before registration

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onBeforeRegister: (req, res, next, opts) => {
        console.log('onBeforeRegister')
        next()
      }
    })
  ]
  // ...
}
```

### onAfterRegister
Helper-middleware, called after registration

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onAfterRegister: ({ userId }, req) => {
        console.log('onAfterRegister')
      }
    })
  ]
  // ...
}
```

### onBeforeCreatePasswordResetSecret
Helper-middleware, called before creating the password reset code

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onBeforeCreatePasswordResetSecret: (req, res, done) => {
        console.log('onBeforeCreatePasswordResetSecret')

        const { email } = req.body
        if (!email) return done('Missing email')
        done(null, email)
      }
    })
  ]
  // ...
}
```

### onCreatePasswordResetSecret
Helper-middleware, called when creating a password reset code

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onCreatePasswordResetSecret: ({ userId, secret }, req) => {
        console.log('onCreatePasswordResetSecret')
      }
    })
  ]
  // ...
}
```

### onBeforePasswordReset
Helper-middleware, called before password recovery

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onBeforePasswordReset: (req, res, next) => {
        console.log('onBeforePasswordReset')
        next()
      }
    })
  ]
  // ...
}
```

### onAfterPasswordReset
Helper-middleware, called after password recovery

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onAfterPasswordReset: ({ userId }, req) => {
        console.log('onAfterPasswordReset')
      }
    })
  ]
  // ...
}
```

### onBeforePasswordChange
Helper-middleware, called before changing the password

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onBeforePasswordChange: (req, res, next) => {
        console.log('onBeforePasswordChange')
        next()
      }
    })
  ]
  // ...
}
```

### onAfterPasswordChange
Helper-middleware, called after changing the password

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onAfterPasswordChange: ({ userId }, req) => {
        console.log('onAfterPasswordChange')
      }
    })
  ]
  // ...
}
```

### onBeforeConfirmRegistration
Helper-middleware, called before confirmation registration process

```js
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onBeforeConfirmRegistration: (req, res, next) => {
        console.log('onBeforeConfirmRegistration')
      }
    })
  ]
  // ...
}
```

### onBeforeResendConfirmation
Helper-middleware, called before resend email confirmation

```js
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onBeforeResendConfirmation: (req, res, config, next) => {
        console.log('onBeforeResendConfirmation')
      }
    })
  ]
  // ...
}
```

### sendRegistrationConfirmationComplete
Helper-middleware, called after confirmation a registration

```js
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      sendRegistrationConfirmationComplete: (userId, next) => {
        console.log('sendRegistrationConfirmationComplete')
      }
    })
  ]
  // ...
}
```

### confirmEmail
Helper-middleware, implements confirmation a registration

```js
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      confirmEmail: (model, userId, config, next) => {
        console.log('confirmEmail')
      }
    })
  ]
  // ...
}
```

### sendRegistrationConfirmation
Helper-middleware, called after registration and on resend confirmation email. You need override this middleware if confirmRegistration option is `true` to send an email with confirmation link

```js
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      sendRegistrationConfirmation: (req, userId, next) => {
        console.log('sendRegistrationConfirmation')
      }
    })
  ]
  // ...
}
```
