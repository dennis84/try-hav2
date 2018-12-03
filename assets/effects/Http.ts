import {Dispatch, Subscription} from 'hyperapp'

const parseJson = (resp: Response) => resp.json()

const checkStatus = (resp: Response): Response | Promise<any> => {
  if(resp.status >= 200 && resp.status < 400) {
    return resp
  }

  if(resp.status === 400) {
    return parseJson(resp).then((json) => {
      throw new Error(json.message)
    })
  }

  throw new Error(resp.statusText)
}

function fetchEffect(props: Subscription, dispatch: Dispatch) {
  window.fetch(props.url, props.opts)
    .then(checkStatus)
    .then(parseJson)
    .then((json) => dispatch(props.action, json))
    .catch((e) => {
      if(props.error) return dispatch(props.error, e)
      throw e
    })
}

interface Props {
  action: any,
  url: string,
  error?: any,
  opts?: any,
}

export const fetch = (props: Props) => ({
  effect: fetchEffect,
  action: props.action,
  error: props.error,
  url: props.url,
  opts: props.opts,
})
