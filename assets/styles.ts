import * as FS from 'free-style'

export const freestyle = FS.create((x: string) => 'cc-' + FS.stringHash(x))

const buttonCommon = {
  'display': 'inline-flex',
  'height': '40px',
  'border-radius': '20px',
  'justify-content': 'center',
  'align-items': 'center',
  'border': '0',
  'font-size': '20px',
  'font-family': 'Times New Roman',
  'cursor': 'pointer',
}

interface BlockProps {
  background: string,
  border: string,
  block: string,
  mouse?: boolean,
}

export const block = (props: BlockProps) => {
  return {
    'background': props.background,
    'box-shadow': `0 2px 0 ${props.block}, 0 4px 0px ${props.border}`,
    'border': `2px solid ${props.border}`,
    ...props.mouse ? {
      '&:active': {
        'position': 'relative',
        'box-shadow': 'none',
        'top': '4px',
      }
    } : {}
  }
}

export const button = freestyle.registerStyle({
  ...buttonCommon,
  ...block({
    background: '#f2f2f2',
    border: '#ccc',
    block: '#eee',
    mouse: true,
  }),
  'color': '#4a4a4a',
  '&:hover': {
    'background': '#fefefe',
  }
})

export const buttonPrimary = freestyle.registerStyle({
  ...buttonCommon,
  ...block({
    background: 'hsl(171, 100%, 41%)',
    border: 'hsl(171, 100%, 35%)',
    block: 'hsl(171, 100%, 38%)',
    mouse: true,
  }),
  'color': '#fff',
  '&:hover': {
    'background': 'hsl(171, 100%, 44%)',
  }
})
