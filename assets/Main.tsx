import {h} from 'hyperapp'
import {freestyle} from './styles'
import Navbar from './components/Navbar'
import Errors from './components/Errors'
import NewWorkshopModal from './components/NewWorkshopModal'
import Workshops from './components/Workshops'
import {State} from '.'

const container = freestyle.registerStyle({
  'margin': '0 auto',
  'margin-top': '40px',
  'width': '600px',
  'font-size': '20px',
  'font-family': 'Times New Roman',
  'color': '#4a4a4a',
})

export default (props: State) => (
  <div class={container}>
    <Navbar />
    <Errors message={props.error} />
    <NewWorkshopModal
      visible={props.showModal}
      newWorkshop={props.newWorkshop} />
    <Workshops workshops={props.workshops} />
  </div>
)
