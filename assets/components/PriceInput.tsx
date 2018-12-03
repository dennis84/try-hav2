import {h} from 'hyperapp'

const OnKeyUp = (props: Props) => (state: any, e: KeyboardEvent) => {
  const target = e.target as HTMLInputElement
  target.value = target.value.replace(/[^\d]/g, '')
  if(props.onChange) {
    return props.onChange(state, parseInt(target.value))
  }
}

interface Props {
  onChange?: (state: any, value: number) => any,
}

export default (props: Props) => (
  <input onKeyUp={OnKeyUp(props)} type="text" />
)
