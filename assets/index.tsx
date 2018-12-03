/// <reference path="./types/hyperapp.d.ts" />
/// <reference path="./types/insert-css.d.ts" />

import {h, app, VNode} from 'hyperapp'
import {insertCss} from 'insert-css'
import {freestyle} from './styles'
import * as Http from './effects/Http'
import Main from './Main'
import {UpdateWorkshops} from './actions'

export interface Workshop {
  name: string,
  description: string,
  instructor: string,
  price: number,
}

export interface State {
  workshops: Workshop[],
  newWorkshop: Workshop,
  showModal: boolean,
  error: string,
}

const init: State = {
  workshops: [],
  showModal: false,
  error: '',
  newWorkshop: {
    name: '',
    description: '',
    instructor: '',
    price: 0,
  },
}

const view = (state: State): VNode => (
  <Main
    workshops={state.workshops}
    showModal={state.showModal}
    newWorkshop={state.newWorkshop}
    error={state.error} />
)

const container = document.getElementById('container')

app({
  init,
  view,
  subscriptions: (state: State) => [
    Http.fetch({
      url: '/workshops',
      action: UpdateWorkshops,
    }),
  ],
  container,
})

insertCss(freestyle.getStyles())
