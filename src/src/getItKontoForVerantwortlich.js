export default (interne, verantwortlich) => {
  const intern = interne.find(i => i.kurzzeichen === verantwortlich)
  if (intern) return intern.itKonto
  return null
}
