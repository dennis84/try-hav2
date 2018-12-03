import {VNode} from 'hyperapp'

declare module 'hyperapp' {
  export type View<S> = (state: S) => VNode

  export type Dispatch = (action: any, props: any) => void

  export type Effect = (props: Subscription, dispatch: Dispatch) => void

  export interface Subscription {
    effect: Effect,
    [key: string]: any,
  }

  type Subscriptions<S> = (state: S) => Subscription[]

  interface Props<S> {
    init: S,
    view: View<S>,
    subscriptions?: Subscriptions<S>,
    container: HTMLElement,
  }

  export function app<S>(props: Props<S>): void
}
