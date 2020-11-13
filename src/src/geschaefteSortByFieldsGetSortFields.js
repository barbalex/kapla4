const geschaefteSortByFieldsGetSortFields = (state, field, direction) => {
  const sortFieldsWithoutPassedField = state.geschaefte.sortFields.filter(
    (sf) => sf.field !== field,
  )
  if (!direction) {
    // remove field
    return sortFieldsWithoutPassedField
  }
  return [{ field, direction }, ...sortFieldsWithoutPassedField]
}

export default geschaefteSortByFieldsGetSortFields
