import {h} from 'hyperapp'
import {freestyle, buttonPrimary} from '../styles'
import {ToggleModal} from '../actions'

interface Props {
}

const nav = freestyle.registerStyle({
  'display': 'flex',
  'justify-content': 'flex-end',
})

export default (props: Props) => (
  <nav class={nav}>
    <button
      class={buttonPrimary}
      onClick={ToggleModal}>
      New Workshop
    </button>
  </nav>
)
