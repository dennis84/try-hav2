import {h} from 'hyperapp'
import {freestyle, block, button} from '../styles'
import {ErrorDismiss} from '../actions'

const error = freestyle.registerStyle({
  'color': '#fff',
  'margin': '20px 0',
  'padding': '20px',
  ...block({
    background: '#ff3860',
    block: '#d5002b',
    border: '#ab1634',
  }),
  '> button': {
    'margin-top': '10px',
  }
})

interface Props {
  message: string,
}

export default (props: Props) => {
  if(!props.message) return

  return (
    <div class={error}>
      <div>{props.message}</div>
      <button class={button} onClick={ErrorDismiss}>Close</button>
    </div>
  )
}
