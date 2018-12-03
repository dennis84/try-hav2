import {h} from 'hyperapp'
import {Workshop} from '..'
import {freestyle, button, buttonPrimary} from '../styles'
import {Modal, ModalBody, ModalHeader, ModalFooter} from './Modal'
import PriceInput from './PriceInput'
import {
  ToggleModal,
  CreateWorkshop,
  UpdateNewWorkshopName,
  UpdateNewWorkshopDescription,
  UpdateNewWorkshopInstructor,
  UpdateNewWorkshopPrice,
} from '../actions'

interface Props {
  visible: boolean,
  newWorkshop: Workshop,
}

const field = freestyle.registerStyle({
  'display': 'flex',
  'flex-wrap': 'wrap',
  '&:not(:last-child)': {
    'margin-bottom': '10px',
  },
  'input, textarea': {
    'width': '100%',
    'font-size': '20px',
    'font-family': 'Times New Roman',
    'outline': '0',
    'border': '1px solid #ccc',
    'border-radius': '2px',
    'padding': '4px',
    'color': '#4a4a4a',
  },
  'input': {
    'height': '40px',
  },
  'textarea': {
    'height': '120px',
  }
})

const FocusInput = (elm: HTMLElement) => elm.focus()

export default (props: Props) => (
  <Modal visible={props.visible}>
    <ModalHeader></ModalHeader>

    <ModalBody>
      <div class={field}>
        <label>Name</label>
        <input
          onCreate={FocusInput}
          onKeyUp={UpdateNewWorkshopName}
          type="text" />
      </div>

      <div class={field}>
        <label>Description</label>
        <textarea onKeyUp={UpdateNewWorkshopDescription}></textarea>
      </div>

      <div class={field}>
        <label>Instructor</label>
        <input type="text" onKeyUp={UpdateNewWorkshopInstructor} />
      </div>

      <div class={field}>
        <label>Price</label>
        <PriceInput onChange={UpdateNewWorkshopPrice} />
      </div>
    </ModalBody>

    <ModalFooter>
      <button class={buttonPrimary} onClick={CreateWorkshop}>Submit</button>
      <button class={button} onClick={ToggleModal}>Close</button>
    </ModalFooter>
  </Modal>
)
