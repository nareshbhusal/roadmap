import Step1 from './Step1';

const backdrop = {
  disabled: false,
  color: '#444',
  // color: 'red',
  opacity: '0.5',
  stageGap: 5,
  nextOnOverlayClick: true
}

const guide1 = {
  id: 'guide1',
  name: 'guide1',
  closeOnLastNext: false,
  steps: [
    {
      index: 0,
      type: 'modal',
      target: {
        path: {
          value: '/*/boards',
          comparator: 'regex'
        }
      },
      data: {
        bodyContent: Step1,
        clickOutsideToClose: false
      }
    },
    {
      index: 1,
      type: 'tooltip',
      target: {
        path: {
          value: '/*/boards',
          comparator: 'regex'
        },
        elementSelector: 'aside a'
      },
      data: {
        placement: {
          position: 'right'
          // orientation: 'fixed'
        },
        arrowSizeScale: 1.25,
        arrow: true,
        backdrop,
        /* bodyContent: `
           <div>
           <p style="color:blue">Tooltip 1 body</p>
           </div>`, */
      },
      styleProps: {
        // border: '2px solid green',
      }
    },
    {
      index: 2,
      type: 'tooltip',
      target: {
        path: {
          value: '/*/boards',
          comparator: 'regex'
        },
        elementSelector: 'section.filter input'
      },
      data: {
        placement: {
          position: 'bottom'
          // orientation: 'fixed'
        },
        arrowSizeScale: 1.25,
        arrow: true,
        backdrop,
        /* bodyContent: `
           <div>
           <p style="color:blue">Tooltip 1 body</p>
           </div>`, */
      },
      styleProps: {
        // border: '2px solid green',
      }
    },
  ]
}

const content = {
  "guide1": {
    type: 'guide',
    data: guide1
 }
}

export default content;
