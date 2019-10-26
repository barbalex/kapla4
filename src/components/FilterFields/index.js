/**
 * using hooks here results in error:
 * Hooks can only be called inside the body of a function component.
 */
import React, { useContext, useCallback } from 'react'
import moment from 'moment'
import $ from 'jquery'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import AreaGeschaeft from './AreaGeschaeft'
import AreaNummern from './AreaNummern'
import AreaFristen from './AreaFristen'
import AreaParlVorstoss from './AreaParlVorstoss'
import AreaRechtsmittel from './AreaRechtsmittel'
import AreaPersonen from './AreaPersonen'
import AreaHistory from './AreaHistory'
import AreaZuletztMutiert from './AreaZuletztMutiert'
import isDateField from '../../src/isDateField'

import storeContext from '../../storeContext'

moment.locale('de')

const getTemplateAreas = (width, showAreaForGeschaeftsart) => {
  if (width === 'narrow' && showAreaForGeschaeftsart) {
    return `
    "areaNummern"
    "areaGeschaeft"
    "areaForGeschaeftsart"
    "areaFristen"
    "areaPersonen"
    "areaHistory"
    "areaZuletztMutiert"`
  } else if (width === 'narrow' && !showAreaForGeschaeftsart) {
    return `
    "areaNummern"
    "areaGeschaeft"
    "areaFristen"
    "areaPersonen"
    "areaHistory"
    "areaZuletztMutiert"
    `
  } else if (width === 'wide' && showAreaForGeschaeftsart) {
    return `
    "areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaNummern areaNummern areaNummern areaNummern areaNummern"
    "areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaForGeschaeftsart areaForGeschaeftsart areaForGeschaeftsart areaForGeschaeftsart areaForGeschaeftsart"
    "areaFristen areaFristen areaFristen areaFristen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen"
    "areaFristen areaFristen areaFristen areaFristen areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory"
    "areaFristen areaFristen areaFristen areaFristen areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert"
    `
  }
  // width === 'wide' && !showAreaForGeschaeftsart
  return `
    "areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaNummern areaNummern areaNummern areaNummern areaNummern"
    "areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaNummern areaNummern areaNummern areaNummern areaNummern"
    "areaFristen areaFristen areaFristen areaFristen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen"
    "areaFristen areaFristen areaFristen areaFristen areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory"
    "areaFristen areaFristen areaFristen areaFristen areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert"
    `
}

const ScrollContainer = styled.div`
  overflow: auto;
  height: calc(100vh - 52px);
`
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: ${props =>
    props['data-width'] === 'narrow'
      ? 'repeat(1, 100%)'
      : 'repeat(12, 8.33333%)'};
  grid-template-rows: auto;
  grid-template-areas: ${props =>
    getTemplateAreas(
      props['data-width'],
      props['data-showareaforgeschaeftsart'],
    )};
`

const FilterFields = () => {
  const store = useContext(storeContext)
  let { filterFields, filterByFields } = store.geschaefte
  const { config } = store.app

  const changeComparator = useCallback(
    (value, name) => {
      const { filterFields } = store.geschaefte
      const newFilterFields = []
      let changedField = {
        comparator: '=',
        field: name,
        value: null,
      }
      if (filterFields.forEach) {
        filterFields.forEach(f => {
          if (f.field !== name) {
            newFilterFields.push(f)
          } else {
            changedField = f
          }
        })
      }
      changedField.comparator = value
      newFilterFields.push(changedField)
      filterByFields(newFilterFields)
    },
    [filterByFields, store.geschaefte],
  )
  const change = useCallback(
    e => {
      const { filterFields } = store.geschaefte
      const { type, name, dataset } = e.target
      const newFilterFields = []
      let changedField = {
        comparator: '=',
        field: name,
        value: null,
      }
      if (filterFields.forEach) {
        filterFields.forEach(f => {
          if (f.field !== name) {
            newFilterFields.push(f)
          } else if (f.comparator) {
            changedField = { ...f }
          }
        })
      }
      let { value } = e.target
      if (isDateField(name) && value) {
        value = moment(value, 'DD.MM.YYYY').format('YYYY-MM-DD')
      }
      if (type === 'radio') {
        // need to set null if existing value was clicked
        if (changedField.value === dataset.value) {
          value = null
        } else {
          value = dataset.value
        }
      }
      changedField.value = value
      newFilterFields.push(changedField)
      filterByFields(newFilterFields)
    },
    [filterByFields, store.geschaefte],
  )

  // build a fields hash for the values
  const values = {}
  if (filterFields.forEach) {
    filterFields.forEach(field => {
      values[field.field] = field.value
    })
  } else {
    filterFields = []
  }
  const showAreaParlVorstoss = !!(
    values.geschaeftsart && values.geschaeftsart === 'Parlament. Vorstoss'
  )
  const showAreaRechtsmittel = !!(
    values.geschaeftsart && values.geschaeftsart === 'Rekurs/Beschwerde'
  )
  const showAreaForGeschaeftsart = showAreaParlVorstoss || showAreaRechtsmittel

  // need to adapt layout to differing widths
  const windowWidth = $(window).width()
  const areaFilterFieldsWidth = windowWidth - config.geschaefteColumnWidth
  const width = areaFilterFieldsWidth < 980 ? 'narrow' : 'wide'

  // prepare tab indexes
  const nrOfGFields = 10
  const nrOfNrFields = 14
  const nrOfFieldsBeforePv = nrOfGFields + nrOfNrFields
  const nrOfPvFields = 9
  const nrOfFieldsBeforeFristen = nrOfFieldsBeforePv + nrOfPvFields
  const nrOfFieldsBeforePersonen = nrOfFieldsBeforeFristen + 7
  const nrOfFieldsBeforeHistory = nrOfFieldsBeforePersonen + 3
  const nrOfFieldsBeforeZuletztMutiert = nrOfFieldsBeforeHistory + 1

  return (
    <ScrollContainer>
      <Wrapper
        data-width={width}
        data-showareaforgeschaeftsart={showAreaForGeschaeftsart}
      >
        <AreaGeschaeft
          firstTabIndex={width === 'narrow' ? nrOfNrFields : 0}
          change={change}
          changeComparator={changeComparator}
          values={values}
        />
        <AreaNummern
          firstTabIndex={width === 'narrow' ? 0 : nrOfGFields}
          change={change}
          changeComparator={changeComparator}
          values={values}
        />
        {showAreaParlVorstoss && (
          <AreaParlVorstoss
            firstTabIndex={nrOfFieldsBeforePv}
            change={change}
            changeComparator={changeComparator}
            values={values}
          />
        )}
        {showAreaRechtsmittel && (
          <AreaRechtsmittel
            firstTabIndex={nrOfFieldsBeforePv}
            change={change}
            changeComparator={changeComparator}
            values={values}
          />
        )}
        <AreaFristen
          firstTabIndex={nrOfFieldsBeforeFristen}
          change={change}
          changeComparator={changeComparator}
          values={values}
        />
        <AreaPersonen
          firstTabIndex={nrOfFieldsBeforePersonen}
          change={change}
          changeComparator={changeComparator}
          values={values}
        />
        <AreaHistory
          firstTabIndex={nrOfFieldsBeforeHistory}
          change={change}
          changeComparator={changeComparator}
          values={values}
        />
        <AreaZuletztMutiert
          firstTabIndex={nrOfFieldsBeforeZuletztMutiert}
          change={change}
          changeComparator={changeComparator}
          values={values}
        />
      </Wrapper>
    </ScrollContainer>
  )
}

export default observer(FilterFields)
