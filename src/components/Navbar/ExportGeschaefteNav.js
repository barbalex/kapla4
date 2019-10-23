/* eslint-disable no-param-reassign */

import React, { useContext, useCallback } from 'react'
import { NavDropdown, MenuItem } from 'react-bootstrap'
import moment from 'moment'
import _ from 'lodash'
import { observer } from 'mobx-react'

import exportGeschaefte from '../../src/exportGeschaefte'
import getHistoryOfGeschaefte from '../../src/getHistoryOfGeschaefte'
import storeContext from '../../storeContext'

const NavbarExportGeschaefteNav = () => {
  const store = useContext(storeContext)
  const { messageShow } = store
  const { geschaeftePlusFilteredAndSorted: geschaefte } = store.geschaefte

  const onClickExportAllGeschaefte = useCallback(
    e => {
      e.preventDefault()
      // TODO: compute?
      const history = getHistoryOfGeschaefte(geschaefte)
      // need to make geko, interne and externe readable
      // and add history
      const geschaefteReadable = _.clone(geschaefte).map(g => {
        // make readable
        g.geko =
          g.geko && g.geko.map
            ? g.geko.map(geko => geko.gekoNr).join(', ')
            : null
        g.interne =
          g.interne && g.interne.map
            ? g.interne
                .map(i => {
                  const name = `${i.name} ${i.vorname}, ${i.kurzzeichen}`
                  const abt = i.abteilung ? `, ${i.abteilung}` : ''
                  const eMail = i.eMail ? `, ${i.eMail}` : ''
                  const telefon = i.telefon ? `, ${i.telefon}` : ''
                  return `${name}${abt}${eMail}${telefon}`
                })
                .join('; ')
            : null
        g.externe =
          g.externe && g.externe.map
            ? g.externe
                .map(i => {
                  const name = `${i.name} ${i.vorname}`
                  const firma = i.firma ? `, ${i.firma}` : ''
                  const eMail = i.eMail ? `, ${i.eMail}` : ''
                  const telefon = i.telefon ? `, ${i.telefon}` : ''
                  return `${name}${firma}${eMail}${telefon}`
                })
                .join('; ')
            : null
        g.links =
          g.links && g.links.map ? g.links.map(l => l.url).join(', ') : null
        g.historie = history.get(g.idGeschaeft).join(', ')
        delete g.verantwortlichName
        delete g.kannFaelligSein
        return g
      })
      exportGeschaefte(geschaefteReadable, messageShow)
    },
    [geschaefte, messageShow],
  )
  const onClickExportGeschaefteRechtsmittelVorjahre = useCallback(
    e => {
      e.preventDefault()
      const thisYear = moment().year()
      const firstDate = moment(`01.01.${thisYear - 2}`, 'DD.MM.YYYY')
      const lastDate = moment(`31.12.${thisYear - 1}`, 'DD.MM.YYYY')
      const isInPreviousTwoYears = date =>
        moment(date, 'DD.MM.YYYY').isBetween(firstDate, lastDate, 'days', '[]')
      const geschaefteGefiltert = geschaefte.filter(
        g =>
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
      const geschaefteWithNewFieldNames = geschaefteGefiltert.map(g => {
        const newGeschaeft = {}
        Object.keys(g).forEach(key => {
          newGeschaeft[newFieldNames[key]] = g[key]
        })
        return newGeschaeft
      })
      exportGeschaefte(geschaefteWithNewFieldNames, messageShow)
    },
    [geschaefte, messageShow],
  )

  return (
    <NavDropdown title="Exporte" id="exportGeschaefteNavDropdown">
      <MenuItem onClick={onClickExportAllGeschaefte}>
        Gefilterte Geschäfte mit allen Feldern
      </MenuItem>
      <MenuItem onClick={onClickExportGeschaefteRechtsmittelVorjahre}>
        Rekurse und Beschwerden, Vergleich der letzten zwei Jahre
      </MenuItem>
    </NavDropdown>
  )
}

export default observer(NavbarExportGeschaefteNav)
