export default (sortFields) =>
  sortFields
    .filter((sf) => sf.field || sf.field === 0)
    .map(
      (sf) =>
        `${sf.field} (${
          sf?.direction
            ?.replace('ASCENDING', 'aufsteigend')
            ?.replace('DESCENDING', 'absteigend') || 'AUFSTEIGEND'
        })`,
    )
    .sort()
