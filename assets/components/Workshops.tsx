import {h} from 'hyperapp'
import {freestyle} from '../styles'
import WorkshopItem from './WorkshopItem'
import {Workshop} from '..'

interface Props {
  workshops: Workshop[],
}

const list = freestyle.registerStyle({
  'padding': '0',
})

const emptyNote = freestyle.registerStyle({
  'text-align': 'center',
  'font-size': '24px',
  'padding': '20px',
})

export default (props: Props) => {
  if(!props.workshops.length) return (
    <p class={emptyNote}>No workshops yet :(</p>
  )

  return (
    <ul class={list}>
      {props.workshops.map((ws) => <WorkshopItem workshop={ws} />)}
    </ul>
  )
}
