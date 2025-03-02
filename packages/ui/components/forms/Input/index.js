import React, { useRef, useImperativeHandle } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { SCHEMA_TYPE_TO_INPUT } from '../helpers'
import inputs from './inputs'

function Input ({
  input,
  type,
  ...props
}, ref) {
  input = input || type
  input = SCHEMA_TYPE_TO_INPUT[input] || input

  const inputRef = useRef()
  useImperativeHandle(ref, () => inputRef.current, [])

  const { Component, useProps } = inputs[input]
  const componentProps = useProps(props, inputRef)

  return pug`
    Component(
      ref=inputRef
      ...componentProps
    )
  `
}

const possibleInputs = Object.keys(inputs)
const possibleTypes = Object.keys(SCHEMA_TYPE_TO_INPUT)

Input.defaultProps = {
  type: 'text'
}

Input.propTypes = {
  type: PropTypes.oneOf(possibleInputs.concat(possibleTypes)),
  value: PropTypes.any,
  $value: PropTypes.any
}

export default observer(Input, { forwardRef: true })
