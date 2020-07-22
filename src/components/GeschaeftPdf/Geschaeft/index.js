/* eslint-disable max-len */

import React, { useCallback, useEffect, useContext } from 'react'
import moment from 'moment'
import $ from 'jquery'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../shared/ErrorBoundary'
import AreaGeschaeft from './AreaGeschaeft'
import AreaNummern from './AreaNummern'
import AreaFristen from './AreaFristen'
import AreaParlVorstoss from './AreaParlVorstoss'
import AreaRechtsmittel from './AreaRechtsmittel'
import AreaPersonen from './AreaPersonen'
import AreaHistory from './AreaHistory'
import AreaLinks from './AreaLinks'
import AreaZuletztMutiert from './AreaZuletztMutiert'
import storeContext from '../../../storeContext'

moment.locale('de')

// height is: 297 - 2*10mm padding or print margin - 18mm for footer
const ScrollContainer = styled.div`
  overflow: visible;
  /*height: 259mm;
  max-height: 259mm;*/
`
const WrapperWide = styled.div`
  display: grid;
  border: thin solid #ccc;
  border-collapse: collapse;
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
const WrapperWidePdf = styled(WrapperWide)`
  grid-template-areas:
    'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaNummern areaNummern areaNummern'
    'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaForGeschaeftsart areaForGeschaeftsart areaForGeschaeftsart'
    'areaFristen areaFristen areaFristen areaFristen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen'
    'areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks'
    'areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory'
    'areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert';
`
const WrapperWideNoAreaForGeschaeftsartPdf = styled(WrapperWide)`
  grid-template-areas:
    'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaNummern areaNummern areaNummern'
    'areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaGeschaeft areaNummern areaNummern areaNummern'
    'areaFristen areaFristen areaFristen areaFristen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen areaPersonen'
    'areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks areaLinks'
    'areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory areaHistory'
    'areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert areaZuletztMutiert';
`

const Geschaeft = () => {
  const store = useContext(storeContext)
  const { setDirty } = store
  const {
    activeId,
    historyOfActiveId,
    geschaefteFilteredAndSorted: geschaefte,
    links,
  } = store.geschaefte
  const { geschaefteColumnWidth } = store.app
  const geschaeft = geschaefte.find((g) => g.idGeschaeft === activeId) || {}
  const { setValue } = geschaeft

  const change = useCallback((e) => {
    const { type, name: field, dataset } = e.target
    let { value } = e.target
    // need to convert numbers into numbers
    if (type && type === 'number') {
      value = +value
    }
    if (['radio', 'checkbox'].includes(type)) {
      // need to set null if existing value was clicked
      if (geschaeft[field] === dataset.value) {
        value = ''
      } else {
        // eslint-disable-next-line prefer-destructuring
        value = dataset.value
      }
      // blur does not occur in radio
      setValue({ field, value })
    }
    if (type === 'select-one') {
      setValue({ field, value })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const blur = useCallback(
    (e) => {
      const { type, name: field, value } = e.target
      if (type !== 'radio' && type !== 'select-one') {
        setValue({ field, value })
      }
    },
    [setValue],
  )
  const saveToDb = useCallback(
    ({ value, field }) => setValue({ field, value }),
    [setValue],
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
  }, [geschaeft.idGeschaeft, setDirty])

  // return immediately if no geschaeft
  const showGeschaeft = geschaeft.idGeschaeft
  if (!showGeschaeft) return null

  const showAreaParlVorstoss =
    geschaeft.geschaeftsart === 'Parlament. Vorstoss' &&
    !(
      !geschaeft.parlVorstossStufe &&
      !geschaeft.parlVorstossZustaendigkeitAwel &&
      !geschaeft.parlVorstossTyp
    )
  const showAreaRechtsmittel =
    geschaeft.geschaeftsart === 'Rekurs/Beschwerde' &&
    !(
      !geschaeft.rechtsmittelInstanz &&
      !geschaeft.rechtsmittelEntscheidNr &&
      !geschaeft.rechtsmittelEntscheidDatum &&
      !geschaeft.rechtsmittelErledigung &&
      !geschaeft.rechtsmittelTxt
    )
  const showAreaForGeschaeftsart = showAreaParlVorstoss || showAreaRechtsmittel

  // need width to adapt layout to differing widths
  const windowWidth = $(window).width()
  const areaGeschaefteWidth = windowWidth - geschaefteColumnWidth

  // prepare tab indexes
  const nrOfGFields = 10
  const nrOfNrFields = 13
  const nrOfFieldsBeforePv = nrOfGFields + nrOfNrFields
  const nrOfPvFields = 9
  const nrOfFieldsBeforeFristen = nrOfFieldsBeforePv + nrOfPvFields
  const nrOfFieldsBeforePersonen = nrOfFieldsBeforeFristen + 7
  const viewIsNarrow = areaGeschaefteWidth < 860
  const Wrapper = showAreaForGeschaeftsart
    ? WrapperWidePdf
    : WrapperWideNoAreaForGeschaeftsartPdf

  const myLinks = links.filter(
    (link) => link.idGeschaeft === geschaeft.idGeschaeft,
  )
  const showLinks = !(myLinks.length === 0)

  return (
    <ErrorBoundary>
      <ScrollContainer>
        <Wrapper>
          <AreaGeschaeft
            viewIsNarrow={viewIsNarrow}
            nrOfGFields={nrOfGFields}
            saveToDb={saveToDb}
          />
          <AreaNummern
            viewIsNarrow={viewIsNarrow}
            nrOfGFields={nrOfGFields}
            saveToDb={saveToDb}
          />
          {showAreaParlVorstoss && (
            <AreaParlVorstoss
              nrOfFieldsBeforePv={nrOfFieldsBeforePv}
              change={change}
              saveToDb={saveToDb}
            />
          )}
          {showAreaRechtsmittel && (
            <AreaRechtsmittel
              nrOfFieldsBeforePv={nrOfFieldsBeforePv}
              onChangeDatePicker={onChangeDatePicker}
              saveToDb={saveToDb}
            />
          )}
          <AreaFristen
            nrOfFieldsBeforeFristen={nrOfFieldsBeforeFristen}
            onChangeDatePicker={onChangeDatePicker}
            saveToDb={saveToDb}
            viewIsNarrow={viewIsNarrow}
          />
          <AreaPersonen
            nrOfFieldsBeforePersonen={nrOfFieldsBeforePersonen}
            saveToDb={saveToDb}
          />
          {showLinks && <AreaLinks />}
          {!!historyOfActiveId.length && <AreaHistory saveToDb={saveToDb} />}
          <AreaZuletztMutiert />
        </Wrapper>
      </ScrollContainer>
    </ErrorBoundary>
  )
}

export default observer(Geschaeft)
