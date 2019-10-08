export default (valuePassed, label, maxStringLength) => {
  let value = valuePassed
  if (value) {
    value = label ? `${label}: ` : ''
    value += valuePassed.substring(0, maxStringLength)
    if (valuePassed.length > maxStringLength) {
      value += '... (Text gekürzt)'
    }
  }
  return value
}
