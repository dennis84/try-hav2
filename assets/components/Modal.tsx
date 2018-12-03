import {h} from 'hyperapp'
import {freestyle, block} from '../styles'

interface ModalProps {
  visible: boolean,
}

const container = freestyle.registerStyle({
  'position': 'fixed',
  'top': '0',
  'right': '0',
  'bottom': '0',
  'left': '0',
  'background': 'rgba(0,0,0,0.5)',
  'display': 'flex',
  'justify-content': 'center',
  'align-items': 'center',
})

const modal = freestyle.registerStyle({
  'max-width': '480px',
  'width': '100%',
  ...block({
    background: '#fff',
    block: '#999',
    border: '#666',
  }),
})

const modalHeader = freestyle.registerStyle({
  'display': 'flex',
  'justify-content': 'flex-end',
})

const modalBody = freestyle.registerStyle({
  'padding': '20px',
})

const modalFooter = freestyle.registerStyle({
  'padding': '20px',
  'background': '#f2f2f2',
  'border-top': '1px solid #ccc',
  '> button:not(:last-child)': {
    'margin-right': '10px',
  }
})

const render = (props: ModalProps, children: any) => (
  <div class={container}>
    <div class={modal}>
      {children}
    </div>
  </div>
)

export const Modal = (props: ModalProps, children: any) => (
  <div>{props.visible && render(props, children)}</div>
)

export const ModalBody = (props: {}, children: any) => (
  <div class={modalBody}>{children}</div>
)

export const ModalHeader = (props: {}, children: any) => (
  <div class={modalHeader}>
    {children}
  </div>
)

export const ModalFooter = (props: {}, children: any) => (
  <div class={modalFooter}>
    {children}
  </div>
)
