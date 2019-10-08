export default (interneOptions, kurzzeichen) => {
  if (!kurzzeichen) return ''
  const interne = interneOptions.find(i => i.kurzzeichen === kurzzeichen)
  if (!interne) return ''
  return (interne.name ? `${interne.vorname ? `${interne.vorname} ` : ''}${interne.name}` : '')
}
