import { isArray, isObject } from 'lodash'

const primitiveSatisfies = ({ data, filter }) => {
  // a number or string
  // convert to string if is number to also find 7681 when filtering for 681
  if (data.toString) {
    data = data.toString()
  }
  // lowercase
  if (data.toLowerCase) {
    data = data.toLowerCase()
  }
  // check if satisfies filter
  // by now data should be a string
  if (data.includes(filter)) {
    return true
  }
  return false
}

export default (geschaefte, filter) => {
  // convert to lower case if possibe
  let filterValue = filter.toLowerCase ? filter.toLowerCase() : filter
  if (filterValue.toString) {
    // a number is queried
    // convert to string to also find 7681 when filtering for 681
    filterValue = filterValue.toString()
  }

  return geschaefte.filter(geschaeft => {
    // if any value satisfies the filter, include the geschaeft
    let satisfiesFilter = false
    Object.keys(geschaeft).forEach(key => {
      let data = geschaeft[key]
      // ignore empty fields
      if (!(data || data === 0)) return
      if (isArray(data)) {
        // set satisfiesFilter = true if any element includes filterValue
        data.forEach(val => {
          // ignore empty fields
          if (!(val || val === 0)) return
          // elements can be objects (geko, person...)
          if (isObject(val)) {
            Object.values(val).forEach(val2 => {
              if (!(val2 || val2 === 0)) return
              if (primitiveSatisfies({ data: val2, filter })) {
                satisfiesFilter = true
              }
            })
          } else {
            if (primitiveSatisfies({ data: val, filter })) {
              satisfiesFilter = true
            }
          }
        })
      } else if (isObject(data)) {
        // set satisfiesFilter = true if any value includes filterValue
        // does this occur?
        Object.values(data).forEach(val => {
          // ignore empty fields
          if (!(val || val === 0)) return
          if (primitiveSatisfies({ data: val, filter })) {
            satisfiesFilter = true
          }
        })
      } else {
        // data is a primitive value
        if (primitiveSatisfies({ data, filter })) {
          satisfiesFilter = true
        }
      }
    })
    return satisfiesFilter
  })
}
