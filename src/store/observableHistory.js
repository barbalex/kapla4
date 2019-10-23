/**
 * need to build a singleton from history
 * where the needed methods are returned
 * and location is made observable
 * reason: MobX starting at v2.7.0 does not accept making history itself observable any more
 * see: https://github.com/mobxjs/mobx/issues/710
 *
 * get ui to follow url changes when user clicks browser back and forwards buttons:
 * http://stackoverflow.com/questions/25806608/how-to-detect-browser-back-button-event-cross-browser
 */

import { extendObservable } from 'mobx'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

const History = {
  history,
  action: history.action,
  push: history.push,
  replace: history.replace,
  block: history.block,
  go: history.go,
  goBack: history.goBack,
  goForward: history.goForward,
  length: history.length,
  createHref: history.createHref,
}

extendObservable(History, {
  location: history.location,
})
history.listen(location => {
  History.location = location
})

export default History
