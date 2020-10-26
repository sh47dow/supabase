import React from 'react'
import PropTypes from 'prop-types'
import './Select.css'

const Select = ({
  className = '',
  isError = false,
  children,
  ...props
}) => {
  const classes = []

  if (isError) {
    classes.push('form-select--error')
  }

  return (
    <select
      className={`form-select border-solid ${classes.join(' ')} ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

Select.propTypes = {
  isError: PropTypes.bool,
  className: PropTypes.string,
}

export default Select
