/* eslint-disable no-param-reassign */
import { action } from 'mobx'

export default store => ({
  setGeschaefteListOverflowing: action(overflowing => {
    store.ui.geschaefteListOverflowing = overflowing
  }),
})
