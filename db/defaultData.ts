const defaultDbData = {
  boards: [
    {
      id: 1,
      name: 'First Board 🔖',
      createdOn: Date.now(),
      lists: [],
      tags: [1, 2, 3],
      archived: false,
      lastAccessed: Date.now()
    }
  ],
  boardLists: [
    {
      id: 1,
      name: 'Brainstorm',
      boardId: 1,
      stories: [1, 2, 3, 4],
      position: 1
    },
    {
      id: 2,
      name: 'Doing',
      boardId: 1,
      stories: [5, 6, 7],
      position: 2
    },
    {
      id: 3,
      name: 'Development',
      boardId: 1,
      stories: [8, 9, 10],
      position: 3
    },
    {
      id: 4,
      name: 'Code review',
      boardId: 1,
      stories: [11],
      position: 4
    },
  ],
  stories: [
    {
      id: 1,
      position: 1,
      title: 's1',
      description: '',
      createdOn: Date.now(),
      updatedOn: Date.now(),
      priority: 4,
      boardId: 1,
      listId: 1,
      tags: [1, 2],
      tasks: [],
      ideas: []
    },
    {
      id: 2,
      position: 2,
      title: 's2 - Example story title',
      description: `This is the description to our story.<div>The field accepts <b>markup</b> formatting, supported by html's \`contenteditable\` property.</div>`,
      createdOn: Date.now(),
      updatedOn: Date.now(),
      priority: 2,
      boardId: 1,
      listId: 1,
      tags: [3],
      tasks: [],
      ideas: []
    },
    {
      id: 3,
      position: 3,
      title: 's3',
      description: '',
      createdOn: Date.now(),
      updatedOn: Date.now(),
      priority: 1,
      boardId: 1,
      listId: 1,
      tags: [],
      tasks: [],
      ideas: []
    },
    {
      id: 4,
      position: 4,
      title: 's4',
      description: '',
      createdOn: Date.now(),
      updatedOn: Date.now(),
      priority: 1,
      boardId: 1,
      listId: 1,
      tags: [],
      tasks: [],
      ideas: []
    },
    {
      id: 5,
      position: 1,
      title: 's5',
      description: '',
      createdOn: Date.now(),
      updatedOn: Date.now(),
      priority: 1,
      boardId: 1,
      listId: 2,
      tags: [],
      tasks: [],
      ideas: []
    },
    {
      id: 6,
      position: 2,
      title: 's6',
      description: '',
      createdOn: Date.now(),
      updatedOn: Date.now(),
      priority: 1,
      boardId: 1,
      listId: 2,
      tags: [],
      tasks: [],
      ideas: []
    },
    {
      id: 7,
      position: 3,
      title: 's7',
      description: '',
      createdOn: Date.now(),
      updatedOn: Date.now(),
      priority: 1,
      boardId: 1,
      listId: 2,
      tags: [],
      tasks: [],
      ideas: []
    },
    {
      id: 8,
      position: 1,
      title: 's8',
      description: '',
      createdOn: Date.now(),
      updatedOn: Date.now(),
      priority: 1,
      boardId: 1,
      listId: 3,
      tags: [],
      tasks: [],
      ideas: []
    },
    {
      id: 9,
      position: 2,
      title: 's9',
      description: '',
      createdOn: Date.now(),
      updatedOn: Date.now(),
      priority: 1,
      boardId: 1,
      listId: 3,
      tags: [],
      tasks: [],
      ideas: []
    },
    {
      id: 10,
      position: 3,
      title: 's10',
      description: '',
      createdOn: Date.now(),
      updatedOn: Date.now(),
      priority: 1,
      boardId: 1,
      listId: 3,
      tags: [],
      tasks: [],
      ideas: []
    },
    {
      id: 11,
      position: 1,
      title: 's11',
      description: '',
      createdOn: Date.now(),
      updatedOn: Date.now(),
      priority: 1,
      boardId: 1,
      listId: 4,
      tags: [],
      tasks: [],
      ideas: []
    },
  ],
  tasks: [

  ],
  storiesTags: [
    {
      id: 1,
      text: 'tag1',
      color: '#a31e1e'
    },
    {
      id: 2,
      text: 'tag2',
      color: '#578c1a'
    },
    {
      id: 3,
      text: 'tag3',
      color: '#0277bd'
    },
  ]
}

export default defaultDbData;
