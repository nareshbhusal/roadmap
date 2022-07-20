import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Hotspot from './Hotspot';

const backdrop = {
  disabled: false,
  color: '#444',
  opacity: '0.5',
  stageGap: 5,
  nextOnOverlayClick: true
}

const guideName = 'guide1';

const guide1 = {
  id: guideName,
  name: guideName,
  closeOnLastNext: false,
  steps: [
    {
      index: 0,
      type: 'modal',
      target: {
        path: {
          value: '/*/roadmap/*',
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
          value: '/*/roadmap/*',
          comparator: 'regex'
        },
        elementSelector: 'aside a.Boards'
      },
      data: {
        placement: {
          position: 'right'
        },
        arrowSizeScale: 1.25,
        arrow: true,
        backdrop,
        bodyContent: Step2
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
        elementSelector: 'button.add'
      },
      data: {
        placement: {
          position: 'bottom',
          orientation: 'auto'
        },
        arrowSizeScale: 1.25,
        arrow: true,
        backdrop,
        bodyContent: Step3
      }
    },
    {
      index: 3,
      type: 'tooltip',
      target: {
        path: {
          value: '/*/boards',
          comparator: 'regex'
        },
        elementSelector: 'button.create'
      },
      data: {
        placement: {
          position: 'bottom',
        },
        arrowSizeScale: 1.25,
        arrow: true,
        backdrop: {
          disabled: true
        },
        bodyContent: Step4
      }
    },
    {
      index: 4,
      type: 'tooltip',
      target: {
        path: {
          value: '/*/roadmap/*',
          comparator: 'regex'
        },
        elementSelector: 'aside .boards'
      },
      data: {
        placement: {
          position: 'right'
        },
        arrowSizeScale: 1.25,
        arrow: true,
        backdrop,
        bodyContent: Step5,
      }
    },
    {
      index: 5,
      type: 'hotspot',
      target: {
        path: {
         value: '/*/ideas',
         comparator: 'regex'
        },
        elementSelector: 'h2'
      },
      tip: {
        data: {
          bodyContent: Hotspot
        }
      }
    },
  ],
}

const content = {
  "guide1": {
    type: 'guide',
    data: guide1
 }
}

export default content;
