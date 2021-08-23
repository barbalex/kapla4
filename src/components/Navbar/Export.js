import React, { useContext, useCallback } from 'react'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap'
import moment from 'moment'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'

import exportGeschaefte from '../../src/exportGeschaefte'
import getHistoryOfGeschaefte from '../../src/getHistoryOfGeschaefte'
import storeContext from '../../storeContext'

const Export = () => {
  const store = useContext(storeContext)
  const { messageShow } = store
  const {
    geschaefteFilteredAndSorted: geschaefte,
    interneOptions,
    externeOptions,
    geko,
    links,
  } = store.geschaefte

  const onClickExportAllGeschaefte = useCallback(
    (e) => {
      e.preventDefault()
      // TODO: compute?
      const history = getHistoryOfGeschaefte(geschaefte)
      // need to make geko, interne and externe readable
      // and add history
      const geschaefteReadable = geschaefte.map((ge) => {
        const g = toJS(ge)
        const interne = store.geschaefteKontakteIntern.geschaefteKontakteIntern
          .filter((k) => k.idGeschaeft === g.idGeschaeft)
          .map(
            (gk) => interneOptions.find((i) => i.id === gk.idKontakt) || null,
          )
        const externe = store.geschaefteKontakteExtern.geschaefteKontakteExtern
          .filter((k) => k.idGeschaeft === g.idGeschaeft)
          .map(
            (gk) => externeOptions.find((i) => i.id === gk.idKontakt) || null,
          )
        g.geko =
          geko
            .filter((gko) => gko.idGeschaeft === g.idGeschaeft)
            .map((g) => g.gekoNr)
            .join(', ') || null
        g.interne =
          interne
            .map((i) => {
              const name = `${i.name} ${i.vorname}, ${i.kurzzeichen}`
              const abt = i.abteilung ? `, ${i.abteilung}` : ''
              const eMail = i.eMail ? `, ${i.eMail}` : ''
              const telefon = i.telefon ? `, ${i.telefon}` : ''
              return `${name}${abt}${eMail}${telefon}`
            })
            .join('; ') || null
        g.externe =
          externe
            .map((i) => {
              const name = `${i.name} ${i.vorname}`
              const firma = i.firma ? `, ${i.firma}` : ''
              const eMail = i.eMail ? `, ${i.eMail}` : ''
              const telefon = i.telefon ? `, ${i.telefon}` : ''
              return `${name}${firma}${eMail}${telefon}`
            })
            .join('; ') || null
        g.links =
          links
            .filter((l) => l.idGeschaeft === g.idGeschaeft)
            .map((l) => l.url)
            .join(', ') || null
        g.historie = history.get(g.idGeschaeft).join(', ')
        return g
      })
      exportGeschaefte(geschaefteReadable, messageShow)
    },
    [
      externeOptions,
      geko,
      geschaefte,
      interneOptions,
      links,
      messageShow,
      store.geschaefteKontakteExtern.geschaefteKontakteExtern,
      store.geschaefteKontakteIntern.geschaefteKontakteIntern,
    ],
  )
  const onClickExportGeschaefteRechtsmittelVorjahre = useCallback(
    (e) => {
      e.preventDefault()
      const thisYear = moment().year()
      const firstDate = moment(`01.01.${thisYear - 2}`, 'DD.MM.YYYY')
      const lastDate = moment(`31.12.${thisYear - 1}`, 'DD.MM.YYYY')
      const isInPreviousTwoYears = (date) =>
        moment(date, 'DD.MM.YYYY').isBetween(firstDate, lastDate, 'days', '[]')
      const geschaefteGefiltert = geschaefte.filter(
        (g) =>
          g.geschaeftsart === 'Rekurs/Beschwerde' &&
          !!g.datumEingangAwel &&
          isInPreviousTwoYears(g.datumEingangAwel),
      )
      const fieldsWanted = [
        'datumEingangAwel',
        'ausloeser',
        'gegenstand',
        'rechtsmittelInstanz',
        'abteilung',
        'rechtsmittelErledigung',
        'rechtsmittelEntscheidDatum',
        'rechtsmittelEntscheidNr',
        'rechtsmittelTxt',
        'idGeschaeft',
      ]
      // now reduce fields to wanted
      geschaefteGefiltert.forEach((g, index) => {
        geschaefteGefiltert[index] = _.pick(
          geschaefteGefiltert[index],
          fieldsWanted,
        )
      })
      const newFieldNames = {
        datumEingangAwel: 'Datum Rechtsschrift',
        ausloeser: 'Rekurrent bzw. Beschwerdeführer / Objekt',
        gegenstand: 'Gegenstand des Rechtsstreites',
        rechtsmittelInstanz: 'Rechtsmittelinstanz',
        abteilung: 'Hauptbetroffene Abteilung',
        rechtsmittelErledigung: 'Ergebnis des Rechtsstreites',
        rechtsmittelEntscheidDatum: 'Datum Urteil / Verfügung',
        rechtsmittelEntscheidNr: 'Nr. Urteil / Verfügung',
        rechtsmittelTxt: 'Bemerkungen',
        idGeschaeft: 'Kapla ID',
      }
      const geschaefteWithNewFieldNames = geschaefteGefiltert.map((g) => {
        const newGeschaeft = {}
        Object.keys(g).forEach((key) => {
          newGeschaeft[newFieldNames[key]] = g[key]
        })
        return newGeschaeft
      })
      exportGeschaefte(geschaefteWithNewFieldNames, messageShow)
    },
    [geschaefte, messageShow],
  )

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        Exporte
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={onClickExportAllGeschaefte}>
          Gefilterte Geschäfte mit allen Feldern
        </DropdownItem>
        <DropdownItem onClick={onClickExportGeschaefteRechtsmittelVorjahre}>
          Rekurse und Beschwerden, Vergleich der letzten zwei Jahre
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default observer(Export)
