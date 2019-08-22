import {State, Workshop} from '.'
import * as Http from './effects/Http'

export const UpdateWorkshops = (state: State, workshops: Workshop[]) =>
  ({...state, workshops: workshops})

export const AddWorkshop = (state: State, workshop: Workshop) =>
  ({...state, newWorkshop: {}, workshops: state.workshops.concat([workshop])})

export const GenericError = (state: State, e: Error) =>
  ({...state, error: e.message})

export const ErrorDismiss = (state: State) => ({...state, error: ''})

export const CreateWorkshop = (state: State) => [
  {...state, showModal: false},
  [Http.fetch, {
    url: '/workshops',
    opts: {
      method: 'POST',
      body: JSON.stringify(state.newWorkshop),
    },
    action: AddWorkshop,
    error: GenericError,
  }],
]

const getValue = (e: Event) =>
  (e.target as HTMLInputElement).value.trim()

export const UpdateNewWorkshopName = (state: State, e: Event) =>
  ({...state, newWorkshop: {...state.newWorkshop, name: getValue(e)}})

export const UpdateNewWorkshopDescription = (state: State, e: Event) =>
  ({...state, newWorkshop: {...state.newWorkshop, description: getValue(e)}})

export const UpdateNewWorkshopInstructor = (state: State, e: Event) =>
  ({...state, newWorkshop: {...state.newWorkshop, instructor: getValue(e)}})

export const UpdateNewWorkshopPrice = (state: State, value: number) =>
  ({...state, newWorkshop: {...state.newWorkshop, price: value}})

export const ToggleModal = (state: State) =>
  ({...state, showModal: !state.showModal})
