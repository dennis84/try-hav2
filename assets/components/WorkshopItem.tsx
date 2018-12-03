import {h} from 'hyperapp'
import {freestyle, block} from '../styles'
import {Workshop} from '..'

const item = freestyle.registerStyle({
  'list-style': 'none',
  'align-items': 'center',
  'padding': '20px',
  ...block({
    background: '#fff',
    block: '#eee',
    border: '#ccc',
  }),
  '&:not(:last-child)': {
    'border-bottom': '0',
  },
})

const name = freestyle.registerStyle({
  'font-weight': 'bold',
})

const description = freestyle.registerStyle({
  'font-size': '16px',
})

const price = freestyle.registerStyle({
  'font-weight': 'bold',
  'text-align': 'right',
})

interface Props {
  workshop: Workshop,
}

export default (props: Props) => (
  <li class={item}>
    <div class={name}>{props.workshop.name}</div>
    <div class={description}>{props.workshop.description}</div>
    <div class={price}>$ {(props.workshop.price / 100).toFixed(2)}</div>
  </li>
)
