import {Dispatch} from 'hyperapp'

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

interface Props {
  action: any,
  url: string,
  error?: any,
  opts?: any,
}

export const fetch = (dispatch: Dispatch, props: Props) => {
  window.fetch(props.url, props.opts)
    .then(checkStatus)
    .then(parseJson)
    .then((json) => dispatch(props.action, json))
    .catch((e) => {
      if(props.error) return dispatch(props.error, e)
      throw e
    })
}
