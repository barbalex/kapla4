/* eslint-disable max-len */

import React, { useCallback, useEffect, useContext } from 'react'
import moment from 'moment'
import $ from 'jquery'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import isDateField from '../../src/isDateField'
import validateDate from '../../src/validateDate'
import AreaGeschaeft from './AreaGeschaeft'
import AreaNummern from './AreaNummern'
import AreaFristen from './AreaFristen'
import AreaParlVorstoss from './AreaParlVorstoss'
import AreaRechtsmittel from './AreaRechtsmittel'
import AreaPersonen from './AreaPersonen'
import AreaHistory from './AreaHistory'
import AreaLinks from './AreaLinks'
import AreaZuletztMutiert from './AreaZuletztMutiert'
import storeContext from '../../storeContext'

moment.locale('de')

const ScrollContainerRegular = styled.div`
  height: calc(100vh - 52px);
  overflow-y: auto;
  overflow-x: hidden;
`
const ScrollContainerPdf = styled.div`
  overflow: hidden;
  height: 26cm;
  max-height: 26cm;

  @media print {
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`
const WrapperNarrow = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 100%);
  grid-template-rows: auto;
  grid-template-areas:
    'areaNummern' 'areaGeschaeft' 'areaForGeschaeftsart' 'areaFristen' 'areaPersonen' 'areaLinks' 'areaHistory'
    'areaZuletztMutiert';
`
const WrapperNarrowNoAreaForGeschaeftsart = styled(WrapperNarrow)`
  grid-template-areas: 'areaNummern' 'areaGeschaeft' 'areaFristen' 'areaPersonen' 'areaLinks' 'areaHistory' 'areaZuletztMutiert';
`
const WrapperWide = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 8.33333%);
  grid-template-rows: auto;
  grid-template-areas:
    'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaNummern areaNummern areaNummern areaNummern'
    'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaForGeschaeftsart areaForGeschaeftsart areaForGeschaeftsart areaForGeschaeftsart'
    'areaFristen areaFristen areaFristen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen'
    'areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks'
    'areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory'
    'areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert';
`
const WrapperPdf = styled(WrapperWide)`
  max-height: 26cm;
  overflow: hidden;
  max-width: 180mm;
  grid-template-columns: repeat(12, 15mm);
`
const WrapperWidePdf = styled(WrapperPdf)`
  grid-template-areas:
    'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaNummern areaNummern areaNummern areaNummern'
    'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaForGeschaeftsart areaForGeschaeftsart areaForGeschaeftsart areaForGeschaeftsart'
    'areaFristen areaFristen areaFristen areaFristen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen'
    'areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks'
    'areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory'
    'areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert';
`
const WrapperWideNoAreaForGeschaeftsart = styled(WrapperWide)`
  grid-template-areas:
    'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaNummern areaNummern areaNummern areaNummern'
    'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaNummern areaNummern areaNummern areaNummern'
    'areaFristen areaFristen areaFristen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen'
    'areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks'
    'areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory'
    'areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert';
`
const WrapperWideNoAreaForGeschaeftsartPdf = styled(WrapperPdf)`
  grid-template-areas:
    'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaNummern areaNummern areaNummern areaNummern'
    'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaNummern areaNummern areaNummern areaNummern'
    'areaFristen areaFristen areaFristen areaFristen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen'
    'areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks'
    'areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory'
    'areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert';
`

const Geschaeft = () => {
  const store = useContext(storeContext)
  const { changeGeschaeftInDb, geschaefteChangeState, setDirty } = store
  const {
    activeId,
    geschaeftePlusFilteredAndSorted: geschaefte,
  } = store.geschaefte
  const { config } = store.app
  const path = store.history.location.pathname
  const isPdf = path === '/geschaeftPdf'
  const geschaeft = geschaefte.find(g => g.idGeschaeft === activeId) || {}

  const change = useCallback(
    e => {
      const { type, name, dataset } = e.target
      let { value } = e.target
      // need to convert numbers into numbers
      // if (!isNaN(value)) value = +value
      if (type && type === 'number') {
        value = +value
      }
      if (type === 'radio') {
        // need to set null if existing value was clicked
        if (geschaeft[name] === dataset.value) {
          value = ''
        } else {
          // eslint-disable-next-line prefer-destructuring
          value = dataset.value
        }
        // blur does not occur in radio
        changeGeschaeftInDb(activeId, name, value)
      }
      if (type === 'select-one') {
        changeGeschaeftInDb(activeId, name, value)
      }
      geschaefteChangeState(activeId, name, value)
    },
    [activeId, changeGeschaeftInDb, geschaeft, geschaefteChangeState],
  )
  const blur = useCallback(
    e => {
      const { type, name, value } = e.target
      if (type !== 'radio' && type !== 'select-one') {
        if (isDateField(name)) {
          if (validateDate(value)) {
            // if correct date, save to db
            changeGeschaeftInDb(activeId, name, value)
          }
          // else: give user hint
          let value2 = ''
          if (value) value2 = moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY')
          if (value2.includes('Invalid date')) {
            value2 = value2.replace('Invalid date', 'Format: DD.MM.YYYY')
          }
          geschaefteChangeState(activeId, name, value2)
        } else {
          changeGeschaeftInDb(activeId, name, value)
        }
      }
    },
    [activeId, changeGeschaeftInDb, geschaefteChangeState],
  )
  const onChangeDatePicker = useCallback(
    (name, date) => {
      const rVal = {
        target: {
          type: 'text',
          name,
          value: date,
        },
      }
      blur(rVal)
    },
    [blur],
  )

  useEffect(() => {
    setDirty(false)
  }, [geschaeft.id, setDirty])
  console.log('geschäft rendering')

  // return immediately if no geschaeft
  const showGeschaeft = geschaeft.idGeschaeft
  if (!showGeschaeft) return null

  const showAreaParlVorstoss =
    geschaeft.geschaeftsart === 'Parlament. Vorstoss' &&
    !(
      isPdf &&
      !geschaeft.parlVorstossStufe &&
      !geschaeft.parlVorstossZustaendigkeitAwel &&
      !geschaeft.parlVorstossTyp
    )
  const showAreaRechtsmittel =
    geschaeft.geschaeftsart === 'Rekurs/Beschwerde' &&
    !(
      isPdf &&
      !geschaeft.rechtsmittelInstanz &&
      !geschaeft.rechtsmittelEntscheidNr &&
      !geschaeft.rechtsmittelEntscheidDatum &&
      !geschaeft.rechtsmittelErledigung &&
      !geschaeft.rechtsmittelTxt
    )
  const showAreaForGeschaeftsart = showAreaParlVorstoss || showAreaRechtsmittel

  // need width to adapt layout to differing widths
  const windowWidth = $(window).width()
  const areaGeschaefteWidth = windowWidth - config.geschaefteColumnWidth

  // prepare tab indexes
  const nrOfGFields = 10
  const nrOfNrFields = 13
  const nrOfFieldsBeforePv = nrOfGFields + nrOfNrFields
  const nrOfPvFields = 9
  const nrOfFieldsBeforeFristen = nrOfFieldsBeforePv + nrOfPvFields
  const nrOfFieldsBeforePersonen = nrOfFieldsBeforeFristen + 7
  const viewIsNarrow = areaGeschaefteWidth < 860
  let ScrollContainer = ScrollContainerRegular
  if (isPdf) ScrollContainer = ScrollContainerPdf
  let Wrapper
  if (isPdf) {
    if (showAreaForGeschaeftsart) {
      Wrapper = WrapperWidePdf
    } else {
      Wrapper = WrapperWideNoAreaForGeschaeftsartPdf
    }
  } else if (viewIsNarrow) {
    if (showAreaForGeschaeftsart) {
      Wrapper = WrapperNarrow
    } else {
      Wrapper = WrapperNarrowNoAreaForGeschaeftsart
    }
  } else if (showAreaForGeschaeftsart) {
    Wrapper = WrapperWide
  } else {
    Wrapper = WrapperWideNoAreaForGeschaeftsart
  }

  const showLinks = !(isPdf && geschaeft.links.length === 0)

  return (
    <ScrollContainer>
      <Wrapper isPdf={isPdf}>
        <AreaGeschaeft
          viewIsNarrow={viewIsNarrow}
          nrOfGFields={nrOfGFields}
          change={change}
          blur={blur}
        />
        <AreaNummern
          viewIsNarrow={viewIsNarrow}
          nrOfGFields={nrOfGFields}
          change={change}
          blur={blur}
        />
        {showAreaParlVorstoss && (
          <AreaParlVorstoss
            nrOfFieldsBeforePv={nrOfFieldsBeforePv}
            change={change}
          />
        )}
        {showAreaRechtsmittel && (
          <AreaRechtsmittel
            nrOfFieldsBeforePv={nrOfFieldsBeforePv}
            change={change}
            blur={blur}
            onChangeDatePicker={onChangeDatePicker}
          />
        )}
        <AreaFristen
          nrOfFieldsBeforeFristen={nrOfFieldsBeforeFristen}
          change={change}
          blur={blur}
          onChangeDatePicker={onChangeDatePicker}
        />
        <AreaPersonen
          nrOfFieldsBeforePersonen={nrOfFieldsBeforePersonen}
          change={change}
        />
        {showLinks && <AreaLinks mylinks={store.geschaefte.links} />}
        <AreaHistory blur={blur} change={change} />
        <AreaZuletztMutiert />
      </Wrapper>
    </ScrollContainer>
  )
}

export default observer(Geschaeft)
