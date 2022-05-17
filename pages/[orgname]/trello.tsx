import React, { useState } from 'react'
// import Board from 'react-trello'
import dynamic from 'next/dynamic';
import isEqual from 'lodash.isequal';

const data = {
  lanes: [
    {
      "id": "PLANNED",
      "title": "Planned Tasks",
      "label": "20/70",
      "style": {
        "width": 280
      },
      "cards": [
        {
          "id": "Milk",
          "title": "Buy milk",
          "label": "15 mins",
          "description": "2 Gallons of milk at the Deli store"
        },
        {
          "id": "Plan2",
          "title": "Dispose Garbage",
          "label": "10 mins",
          "description": "Sort out recyclable and waste as needed"
        },
        {
          "id": "Plan3",
          "title": "Write Blog",
          "label": "30 mins",
          "description": "Can AI make memes?"
        },
        {
          "id": "Plan4",
          "title": "Pay Rent",
          "label": "5 mins",
          "description": "Transfer to bank account"
        }
      ]
    },
    {
      "id": "WIP",
      "title": "Work In Progress",
      "label": "10/20",
      "style": {
        "width": 280
      },
      "cards": [
        {
          "id": "Wip1",
          "title": "Clean House",
          "label": "30 mins",
          "description": "Soap wash and polish floor. Polish windows and doors. Scrap all broken glasses"
        }
      ]
    },
    {
      "id": "BLOCKED",
      "title": "Blocked",
      "label": "0/0",
      "style": {
        "width": 280
      },
      "cards": []
    },
    {
      "id": "COMPLETED",
      "title": "Completed",
      "style": {
        "width": 280
      },
      "label": "2/5",
      "cards": [
        {
          "id": "Completed1",
          "title": "Practice Meditation",
          "label": "15 mins",
          "description": "Use Headspace app"
        },
        {
          "id": "Completed2",
          "title": "Maintain Daily Journal",
          "label": "15 mins",
          "description": "Use Spreadsheet for now"
        }
      ]
    },
    {
      "id": "REPEAT",
      "title": "Repeat",
      "style": {
        "width": 280
      },
      "label": "1/1",
      "cards": [
        {
          "id": "Repeat1",
          "title": "Morning Jog",
          "label": "30 mins",
          "description": "Track using fitbit"
        }
      ]
    },
    {
      "id": "ARCHIVED",
      "title": "Archived",
      "style": {
        "width": 280
      },
      "label": "1/1",
      "cards": [
        {
          "id": "Archived1",
          "title": "Go Trekking",
          "label": "300 mins",
          "description": "Completed 10km on cycle"
        }
      ]
    },
    {
      "id": "ARCHIVED2",
      "title": "Archived2",
      "style": {
        "width": 280
      },
      "label": "1/1",
      "cards": [
        {
          "id": "Archived2",
          "title": "Go Jogging",
          "label": "300 mins",
          "description": "Completed 10km on cycle"
        }
      ]
    },
    {
      "id": "ARCHIVED3",
      "title": "Archived3",
      "style": {
        "width": 280
      },
      "label": "1/1",
      "cards": [
        {
          "id": "Archived3",
          "title": "Go Cycling",
          "label": "300 mins",
          "description": "Completed 10km on cycle"
        }
      ]
    }
  ]
}

const TrelloBoard = () => {

  const [boardData, setData] = useState(data);
  // const [eventBus, setEventBus] = useState(null);

  const Board: React.ComponentType<any> = dynamic(async () => {
    // ignore declaration file error for next line
    // @ts-ignore
    const mod = await import('../../node_modules/react-trello');
    return mod;
  }, {
    ssr: false
  });

  const {
    GlobalStyle,
    BoardWrapper,
    Loader,
    ScrollableLane,
    LaneHeader,
    LaneFooter,
    Section,
    NewLaneForm,
    NewLaneSection,
    NewCardForm,
    Card,
    AddCardLink,
  } = {
    GlobalStyle: dynamic(() => {
      return import('../../node_modules/react-trello/dist/components/index.js').then(mod => mod.GlobalStyle)
    }),
    BoardWrapper: dynamic(() => {
      return import('../../node_modules/react-trello/dist/components/index.js').then(mod => mod.BoardWrapper)
    }),
    Loader: dynamic(() => {
      return import('../../node_modules/react-trello/dist/components/index.js').then(mod => mod.Loader)
    }),
    ScrollableLane: dynamic(() => {
      return import('../../node_modules/react-trello/dist/components/index.js').then(mod => mod.ScrollableLane)
    }),
    LaneHeader: dynamic(() => {
      return import('../../node_modules/react-trello/dist/components/index.js').then(mod => mod.LaneHeader)
    }),
    LaneFooter: dynamic(() => {
      return import('../../node_modules/react-trello/dist/components/index.js').then(mod => mod.LaneFooter)
    }),
    Section: dynamic(() => {
      return import('../../node_modules/react-trello/dist/components/index.js').then(mod => mod.Section)
    }),
    NewLaneForm: dynamic(() => {
      return import('../../node_modules/react-trello/dist/components/index.js').then(mod => mod.NewLaneForm)
    }),
    NewLaneSection: dynamic(() => {
      return import('../../node_modules/react-trello/dist/components/index.js').then(mod => mod.NewLaneSection)
    }),
    NewCardForm: dynamic(() => {
      return import('../../node_modules/react-trello/dist/components/index.js').then(mod => mod.NewCardForm)
    }),
    Card: dynamic(() => {
      return import('../../node_modules/react-trello/dist/components/index.js').then(mod => mod.Card)
    }),
    AddCardLink: dynamic(() => {
      return import('../../node_modules/react-trello/dist/components/index.js').then(mod => mod.AddCardLink)
    }),
  };

  const components = {
    BoardWrapper,
    Loader,
    GlobalStyle,
    ScrollableLane,
    LaneHeader,
    LaneFooter,
    Section,
    NewLaneForm,
    NewLaneSection,
    NewCardForm,
    Card,
    AddCardLink,
  };

  const handleDataChange = (newData: any) => {
    console.log('handleDataChange', newData);
    if (!isEqual(newData, boardData)) {
      setData(newData);
    }
    // setData(newData);
  }
  console.log(components)

  return (
    <div>
      <Board
        data={boardData}
        components={components}
        onDataChange={handleDataChange}
        // editable
        // editLaneTitle
        draggable />
    </div>
  );
}


const Trello = () => {

  return (
    <div>
      <TrelloBoard />
    </div>
  )
}

export default Trello;
