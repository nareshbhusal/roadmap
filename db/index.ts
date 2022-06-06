import Dexie, { Table } from "dexie";
import type {
  IdeaData,
  User,
  BoardData,
  Organization,
  StoriesTag,
  IdeasTag,
  IdeaPreview,
  IdeaCreateForm,
  IdeaCreateRequest,
  IdeaUpdateForm
} from '../types';
import { slugify } from '../lib/utils';
import { defaultSearchValues, sortByValues as boardsSortByValues, SearchAndFilterKeys } from '../components/FilterBoards';
import { sortByValues as ideasSortByValues } from '../components/FilterIdeas';

export interface StoreIdea extends Omit<IdeaData, 'tags'> {
  tagIDs: number[];
}

export interface Board {
  id?: number;
  name: string;
  createdOn: number;
  lists: number[];
  tags: number[];
  archived: boolean;
  lastAccessed: number;
}

export interface BoardList {
  id?: number;
  boardId: number;
  name: string;
  stories: number[];
  position: number;
}

export interface Story {
  id?: number;
  position: number;
  title: string;
  description: string;
  createdOn: number;
  updatedOn: number;
  priority: '1' | '2' | '3' | '4' | '5';
  boardId: number;
  listId: number;
  tags: number[];
  tasks: number[];
  ideas: number[];
}

export interface Task {
  id?: number;
  storyID: number;
  name: string;
  isCompleted: boolean;
}

// Our app will have only one user and one organization.

export interface BoardsFilters {
  searchTerm: string;
  sortBy: typeof boardsSortByValues[number];
}

export interface IdeasFilters {
  searchTerm: string;
  status: IdeaData['status'];
  sortBy: typeof ideasSortByValues[number];
}

class IdeasDB extends Dexie {
  ideas!: Table<StoreIdea, number>;
  ideasTags!: Table<IdeasTag, number>;
  storiesTags!: Table<StoriesTag, number>;
  boards!: Table<Board, number>;
  boardLists!: Table<BoardList, number>;
  stories!: Table<Story, number>;
  tasks!: Table<Task, number>;
  users!: Table<User>;
  organizations!: Table<Organization>;

  constructor() {
    super("roadmapDB");

    // NOTE: Are the types that we've associated with the tables above the same for the data we push in?
    // Like the id prop is autogenerated for example right? So what's up with that?
    this.version(1).stores({
      ideas: `
        ++id,
        title,
        description,
        createdOn,
        updatedOn,
        impact,
        *tagIDs,
        effort,
        status,
        storyID,
        comments
      `,
      ideasTags: `
        ++id,
        &text
      `,
      boards: `
        ++id,
        name,
        createdOn,
        *lists,
        *tags
      `,
      boardLists: `
        ++id,
        boardId,
        name,
        **stories,
        position
      `,
      stories: `
      ++id,
      position,
      title,
      description,
      createdOn,
      updatedOn,
      priority,
      boardId,
      listId,
      *tags,
      *tasks,
      *ideas
      `,
      tasks: `
      ++id,
      storyID,
      name,
      isCompleted
      `,
      storiesTags: `
        ++id,
        &text
      `,
      users: 'name',
      organizations: 'name, urlKey'
    });

    this.ideas = this.table("ideas");
    this.ideasTags = this.table("ideasTags");
    this.users = this.table("users");
    this.organizations = this.table("organizations");
    this.boards = this.table("boards");
    this.boardLists = this.table("boardLists");
    this.stories = this.table("stories");
    this.tasks = this.table("tasks");
    this.storiesTags = this.table("storiesTags");
  }

  public async register(orgName: string, userName: string) {

    this.transaction("rw", this.organizations, this.users, async () => {
      // Only 1 organization and only 1 user
      await this.organizations.clear();
      await this.users.clear();

      await this.organizations.add({
        name: orgName,
        urlKey: slugify(orgName)
      });
      await this.users.add({
        name: userName,
      });
    });
  }

  public async addBoard(name: string) {
    await this.boards.add({
      name,
      createdOn: Date.now(),
      lists: [] as number[],
      tags: [] as number[],
      archived: false,
      lastAccessed: Date.now()
    });
  }

  public async archiveBoard(boardId: number) {
    await this.boards.update(boardId, {
      archived: true
    });
  }

  public async unarchiveBoard(boardId: number) {
    await this.boards.update(boardId, {
      archived: false
    });
  }

  public async deleteBoard(boardId: number) {
    // delete lists, and tags associated with board
    await this.transaction("rw", this.stories, this.tasks, this.boards, this.boardLists, this.storiesTags, async () => {
      const board = await this.boards.get(boardId);
      // board.tags is a list of storyTag ids, delete those tags
      const storyTags = await this.storiesTags.where('id').anyOf(board!.tags).toArray();
      await this.storiesTags.bulkDelete((storyTags as unknown) as number[]);

      // run all boardList through this.deleteBoardList
      const boardLists = await this.boardLists.where('boardId').equals(boardId).toArray();
      for (const boardList of boardLists) {
        await this.deleteBoardList(boardList.id!);
      }

      // delete board
      await this.boards.delete(boardId);
    });
  }

  public async getBoards({ searchTerm, sortBy }: BoardsFilters) {
    const boards = await this.boards.toArray().then(boards => {
      return boards.map(({ id, name, archived, lastAccessed }) => {
        return {
          id,
          name,
          archived,
          lastAccessed
        }
      }).filter(board => {
        return board.name.toLowerCase().includes(searchTerm.toLowerCase());
      }).sort((a: any, b: any) => {
        if (sortBy === boardsSortByValues[0]) {
          // most recently active
          return b.lastAccessed - a.lastAccessed;
        } else if (sortBy === boardsSortByValues[1]) {
          // least recently active
          return a.lastAccessed - b.lastAccessed;
        } else if (sortBy === boardsSortByValues[2]) {
          // alphabetical
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        } else if (sortBy === boardsSortByValues[3]) {
          // reverse alphabetical
          return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
        } else if (sortBy === boardsSortByValues[4]) {
        } else {
          // console.log('sortBy value not recognized' +' '+sortBy);
        }
        // default
        return b.lastAccessed - a.lastAccessed;
      });
    });

    if (sortBy === boardsSortByValues[4]) {
      // archived
      return boards.filter(board => board.archived);
    }
    return boards.filter(board => !board.archived);
  }

  public async getTotalBoards() {
    return this.boards.count();
  }

  public async getStoryPreview(storyID: number) {
    // TODO: Doing this
    const story = await this.stories.get(storyID);
    // replace tags with actual tags instead of ids
    const tags = await this.storiesTags.where('id').anyOf(story!.tags).toArray();
    // replace tasks with number of tasks done vs total
    const tasks = await this.tasks.where('storyID').equals(storyID).toArray();
    // remove ideas and description

    const storyPreview = {
      ...story,
      tags,
      tasks: {
        done: tasks.filter(task => task.isCompleted).length,
        total: tasks.length
      }
    }
    return storyPreview;
  }

  public async deleteBoardList(boardListId: number) {
    await this.transaction("rw", this.boardLists, this.stories, async () => {
      // remove all stories in list
      // run all stories with listId ids through this.removeStory
      await this.stories.where('listId').equals(boardListId).toArray().then(stories => {
        stories.forEach(story => {
          this.removeStory(story.id!);
        })
      });

      // remove board list from board's list array
      const board = await this.boardLists.where('id').equals(boardListId).first();
      const boardId = board!.boardId;
      const boardLists = await this.boardLists.where('boardId').equals(boardId).toArray();
      await this.boards.update(boardId, {
        lists: boardLists.filter(list => list.id !== boardListId).map(list => list.id)
      });

      await this.boardLists.delete(boardListId);
    });
  }

  public async getBoard(boardId: number) {
    // return the board but with board lists attached as well as stories from getStoryPreview
    const board = await this.boards.get(boardId);
    if (!board) return null;
    const boardLists = await this.boardLists.where('boardId').equals(boardId).toArray();

    // get stories using getStoryPreview and attach to board lists


    const lists = await Promise.all(boardLists.map(async (boardList) => {
      return {
        ...boardList,
        stories: await Promise.all(boardList.stories.map(async (storyID: number) => {
          return await this.getStoryPreview(storyID);
        })),
      }
    }));

    // update board's lastAccessed
    await this.boards.update(boardId, {
      lastAccessed: Date.now()
    });

    return {
      ...board,
      lists
    }
  }

  public async updateBoard(boardId: number, board: any) {
    await this.boards.update(boardId, {
      ...board,
    })
  }

  public async moveStoryToStory(storyToMove: number, storyToMoveTo: number) {
    const storyToMoveObj = await this.stories.get(storyToMove);
    const storyToMoveToObj = await this.stories.get(storyToMoveTo);
    if (!storyToMoveObj || !storyToMoveToObj) {
      throw new Error(`Could not find story with id ${storyToMove} or ${storyToMoveTo}`);
    }

    // move card with storyToMove to card with storyToMoveTo - list and position
    await this.transaction("rw", this.stories, this.boardLists, async () => {
      // let's design for the case where the card is dropped in the same list
      if (storyToMoveObj.listId === storyToMoveToObj.listId) {
        if (storyToMoveObj.position === storyToMoveToObj.position) {
          return;
        } else if (storyToMoveObj.position < storyToMoveToObj.position) {
          // every story with position more than current position and less than future position need to be decremented
          await this.stories.where('listId').equals(storyToMoveObj.listId)
          .and(r => r.position > storyToMoveObj.position && r.position <= storyToMoveToObj.position).modify(r => {
            r.position--;
          });
          // every story with position equals to and more than future position need to be incremented
          /* await this.stories.where('listId').equals(storyToMoveObj.listId)
          .and(r => r.position >= storyToMoveToObj.position).modify(r => {
            r.position++;
          }); */

          await this.stories.update(storyToMove, {
            position: storyToMoveToObj.position
          });

        } else {
          // stories with position equal to and more than current position, and less than future position need to be incremented
          await this.stories.where('listId').equals(storyToMoveObj.listId)
          .and(r => r.position < storyToMoveObj.position && r.position >= storyToMoveToObj.position).modify(r => {
            r.position++;
          });

          await this.stories.update(storyToMove, {
            position: storyToMoveToObj.position
          });
        }
      } else {
        const currentList = await this.boardLists.get(storyToMoveObj.listId)!;
        const destinationList = await this.boardLists.get(storyToMoveToObj.listId)!;
        // remove from the current list
        await this.boardLists.update(storyToMoveObj.listId, {
          stories: currentList!.stories.filter(id => id !== storyToMove)
        });
        // make position changes to the stories in the current list
        await this.stories.where('listId').equals(storyToMoveObj.listId).and(r => r.position > storyToMoveObj.position).modify(r => {
          r.position--;
        });
        // add to the destination list
        await this.boardLists.update(storyToMoveToObj.listId, {
          stories: [...destinationList!.stories, storyToMove]
        });
        // make position changes to the stories in the destination list
        await this.stories.where('listId').equals(storyToMoveToObj.listId).and(r => r.position >= storyToMoveToObj.position).modify(r => {
          r.position++;
        });
        await this.stories.update(storyToMove, {
          listId: storyToMoveToObj.listId,
          position: storyToMoveToObj.position
        });
      }
    });
  }

  public async moveStoryToList(storyID: number, listID: number, direction: 'top' | 'bottom') {
    const story = await this.stories.get(storyID);
    const currentList = await this.boardLists.get(story!.listId!);
    const destinationList = await this.boardLists.get(listID);
    if (!story || !currentList || !destinationList) {
      throw new Error(`Could not find story with id ${storyID} or ${listID}`);
    }

    await this.transaction("rw", this.stories, this.boardLists, async () => {
      if (currentList.id !== destinationList.id) {
        // remove from the current list
        await this.boardLists.update(story!.listId!, {
          stories: currentList!.stories.filter(id => id !== storyID)
        });

        // make changes to the positions of the stories in the currentList, decrement higher positions
        await this.stories.where('listId').equals(story!.listId!).and(r => r.position > story!.position!).modify(r => {
          r.position--;
        });

        // add to the destination list
        await this.boardLists.update(listID, {
          stories: [...destinationList!.stories, storyID]
        });

        if (direction === 'bottom') {
          // make position of story equal to the last position in the destination list
          const lastPosition = destinationList!.stories.length;
          await this.stories.update(storyID, {
            listId: listID,
            position: lastPosition + 1
          });
        } else {
          // make changes to the positions of the stories in the destinationList, increment all positions
          await this.stories.where('listId').equals(listID).modify(r => {
            r.position++;
          });

          // make position of story equal to the first position in the destination list
          await this.stories.update(storyID, {
            listId: listID,
            position: 1
          });
        }

      } else {
        // when list is the same

        if (direction === 'bottom') {
          await this.stories.where('listId').equals(listID).and(r => r.position > story!.position).modify(r => {
            r.position--;
          });

          const lastPosition = currentList!.stories.length;
          await this.stories.update(storyID, {
            position: lastPosition + 1 -1 // -1 because lastPosition is factoring in the current story too
          });

        } else {
          await this.stories.where('listId').equals(listID).and(r => r.position < story!.position).modify(r => {
            r.position++;
          });
          await this.stories.update(storyID, {
            position: 1
          });
        }
      }
    });
  }

  public async addBoardList(name: string, boardId: number) {
    const board = await this.boards.get(boardId);
    const position = board!.lists.length+1;

    const boardListId = await this.boardLists.add({
      name,
      boardId,
      position,
      stories: [] as number[]
    });

    await this.boards.update(boardId, {
      lists: [...board!.lists, boardListId]
    });
  }

  public async moveBoardList(targetListID: number, destinationListID: number) {

    await this.transaction("rw", this.boardLists, async () => {
      // move list with id targetList to position of destinationList in board
      // and any cascading effect on positions of other lists in the board
      const targetList = await this.boardLists.get(targetListID);
      const destinationList = await this.boardLists.get(destinationListID);

      await this.transaction("rw", this.boardLists, async () => {
        const currentPosition = targetList!.position;
        const destinationPosition = destinationList!.position;

        if (currentPosition === destinationPosition) {
          return;
        } else if (currentPosition > destinationPosition) {
          // move to the left
          await this.boardLists.where('boardId').equals(targetList!.boardId).and(r => r.position >= destinationPosition && r.position < currentPosition).modify(r => {
            r.position++;
          });
        } else {
          // move to the right
          await this.boardLists.where('boardId').equals(targetList!.boardId).and(r => r.position > currentPosition && r.position <= destinationPosition).modify(r => {
            r.position--;
          });
        }
        await this.boardLists.update(targetList!.id!, {
          position: destinationPosition
        });
      });
    });
  }

  public async updateBoardList(boardId: number, boardList: any) {
    return await this.boardLists.update(boardId, {
      ...boardList,
      updatedOn: Date.now(),
    });
  }

  public async addStory(story: any) {
    const boardList = await this.boardLists.get(story.listId);
    const position = boardList!.stories.length + 1;

    const storyID = await this.stories.add({
      ...story,
      createdOn: Date.now(),
      updatedOn: null,
      tags: [],
      tasks: [],
      ideas: [],
      priority: '1',
      description: '',
      position
    });

    await this.boardLists.update(story.listId, {
      stories: [...boardList!.stories, storyID]
    });
  }

  public async getStories() {
    const stories = await this.stories.toArray();
    return stories.map(({ id, title }) => {
      return {
        id,
        title,
      }
    });
  }

  public async updateStory(storyID: number, story: any) {
    return await this.stories.update(storyID, {
      ...story,
      updatedOn: Date.now(),
    });
  }

  public async setStoryToIdea(ideaID: number, storyID: number | null) {
    await this.ideas.update(ideaID, {
      storyID
    });
  }

  public async addTask(storyID: number, task: any) {
    await this.transaction("rw", this.stories, this.tasks, async () => {
      const taskId = await this.tasks.add({
        storyID,
        ...task,
        isCompleted: false
      });
      const story = await this.stories.get(storyID);
      const taskIDs = [...story!.tasks, taskId];

      await this.stories.update(storyID, {
        tasks: taskIDs
      });
    })
  }

  public async updateTask(taskID: number, task: any) {
    return await this.tasks.update(taskID, {
      ...task
    });
  }

  public async removeTask(taskID: number) {
    await this.transaction("rw", this.stories, this.tasks, async () => {
      const storyID = await this.tasks.get(taskID).then(task => task!.storyID);
      const story = await this.stories.get(storyID);
      const taskIDs = story!.tasks.filter(id => id !== taskID);

      await this.stories.update(storyID, {
        tasks: taskIDs
      });

      await this.tasks.delete(taskID);
    });
  }

  public async addStoriesTag(text: string, storyID: number) {
    // use transaction: add tag to storiesTag table, to stories table, and to the board of the story with the storyID
    await this.transaction("rw", this.storiesTags, this.stories, this.boards, async () => {
      const tagId = await this.storiesTags.add({
        text
      });
      const story = await this.stories.get(storyID);
      const tagIDs = [...story!.tags, tagId];

      await this.stories.update(storyID, {
        tags: tagIDs
      });

      const board = await this.boards.get(story!.boardId);
      const tags = [...board!.tags, tagId];

      await this.boards.update(story!.boardId, {
        tags
      });
    });
  }

  public async removeStory(storyID: number) {
    await this.transaction("rw", this.stories, this.boardLists, async () => {
      const story = await this.stories.get(storyID);
      const boardList = await this.boardLists.get(story!.listId);
      const stories = boardList!.stories.filter(id => id !== storyID);

      await this.boardLists.update(story!.listId, {
        stories
      });

      await this.stories.delete(storyID);
      // Remove associated tasks and ideas
      story!.tasks.forEach(taskID => this.removeTask(taskID));
      story!.ideas.forEach(ideaID => this.removeIdea(ideaID));

      // also make updates to the position props of other stories in the same list
      await this.stories.where('listId').equals(story!.listId).and(r => r.position > story!.position).modify(r => {
        r.position--;
      });
    });
  }

  public async removeStoriesTag(tagID: number, boardID: number) {
    // remove the storiesTag with tagID from the storiesTag table, and from the board table with boardID, and from
    // every stories in that board with the tagID
    await this.transaction("rw", this.storiesTags, this.boards, this.stories, async () => {
      const story = await this.stories.get(tagID);
      const board = await this.boards.get(story!.boardId);
      const tagIDs = board!.tags.filter(id => id !== tagID);

      await this.boards.update(story!.boardId, {
        tags: tagIDs
      });

      await this.storiesTags.delete(tagID);

      // remove the tag from every stories of the boardID that has the tag
      const stories = await this.stories.where({
        boardId: boardID
      }).toArray();

      for (const story of stories) {
        const tagIDs = story!.tags.filter(id => id !== tagID);
        await this.stories.update(story!.id!, {
          tags: tagIDs
        });
      }
    });
  }

  public async getRegisterationInfo() {
    const [organization, user] = await Promise.all([
      this.organizations.toArray().then(orgs => orgs[0]),
      this.users.toArray().then(users => users[0]),
    ]);
    return {
      organization,
      user
    };
  }

  public async updateAccountInfo(organization: Organization, user: User) {
    await this.transaction("rw", this.organizations, this.users, async () => {
      // there's only one organization and one user, update those sole records
      await this.organizations.clear();
      await this.users.clear();
      await this.organizations.bulkPut([organization]);
      await this.users.bulkPut([user]);
    });
  }


  public async addIdea(idea: IdeaCreateRequest) {
    const newIdeaData: StoreIdea = {
      ...idea,
      createdOn: Date.now(),
      updatedOn: null,
      storyID: null,
      comments: [],
      status: 'active',
    }
    return await this.ideas.add(newIdeaData);
  }

  public async deleteIdeasTag(ideasTagID: number) {
    await this.transaction("rw", this.ideas, this.ideasTags, async () => {
      await this.ideasTags.delete(ideasTagID);
      // remove ideasTagID from all ideas' tagIDs[]
      await this.ideas.where("tagIDs").equals(ideasTagID).modify(idea => {
        idea.tagIDs = idea.tagIDs.filter((tagID: number) => tagID !== ideasTagID);
      });
    });
  }

  public async getIdea(ideaID: number): Promise<any> {
    const idea = await this.ideas.get(ideaID);
    // return idea, but with tagIDs replaced by actual ideasTags objects
    let tags = await Promise.all(idea!.tagIDs.map(async (tagID: number) => {
      const tag = await this.ideasTags.get(tagID) as IdeasTag;
      return tag;
    }));
    tags = tags.filter((tag: IdeasTag | undefined) => tag !== undefined) as IdeasTag[];

    const ideaToSend = {
      ...idea,
      tags
    }
    return ideaToSend;
  }

  public async getTotalIdeas(): Promise<number> {
    return await this.ideas.toCollection().count();
  }

  public async removeIdea(ideaID: number) {
    await this.transaction("rw", this.ideas, this.stories, async () => {
      const idea = await this.ideas.get(ideaID);
      const storyID = idea!.storyID!;
      const story = await this.stories.get(storyID);
      const ideaIDs = story!.ideas.filter(id => id !== ideaID);
      await this.stories.update(storyID, {
        ideas: ideaIDs
      });
      await this.ideas.delete(ideaID);
    });
  }

  public async getIdeas({ searchTerm, status, sortBy }: IdeasFilters): Promise<IdeaPreview[]> {
    const ideas = await this.ideas.toArray();

    const ideasPreviews = await Promise.all(ideas.map(async (idea: StoreIdea) => {

      let tags = await Promise.all(idea.tagIDs.map(async (tagID: number) => {
        const tag = await this.ideasTags.get(tagID) as IdeasTag;
        return tag;
      }));

      tags = tags.filter((tag: IdeasTag | undefined) => tag !== undefined);
      const { id, title, impact, effort, description, status, createdOn, updatedOn, storyID } = idea;

      let previewIdea = {
        id,
        title,
        impact,
        effort,
        status,
        createdOn,
        updatedOn,
        storyID,
        comments: idea.comments.length,
        tags,
      };
      return previewIdea;
    }));

    return ideasPreviews.filter(idea => {
      return idea.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        idea.status === status;
    }).sort((a, b) => {
      switch (sortBy) {
        case ideasSortByValues[0]:
          // sort by creation time
          return a.createdOn - b.createdOn;
        case ideasSortByValues[1]:
          // sort by increasing effort
          return a.effort - b.effort;
        case ideasSortByValues[2]:
          // sort by decreasing impact
          return b.impact - a.impact;
        default:
          // console.log("sortBy value not recognized");
          return a.createdOn - b.createdOn;
      }
    });
  }

  public async getIdeasTags(): Promise<IdeasTag[]> {
    return await this.ideasTags.toArray();
  }

  public async addIdeasTag(tag: string) {
    return await this.ideasTags.add({
      text: tag
    });
  }

  public async updateIdea(id: number, idea: any) {
    const currentIdea = await this.ideas.get(id)!;
    return await this.ideas.update(id, {
      ...idea,
      updatedOn: Date.now(),
      status: currentIdea!.status,
      storyID: currentIdea!.storyID,
    });
  }
}

export const db = new IdeasDB();

const populateDB = async () => {
  // TODO: do this
  // db.ideas.bulkAdd(ideas);
};

db.on("populate", populateDB);

db.open().then(function (db) {
    // Database opened successfully
}).catch (function (err) {
    // Error occurred
});

export function resetDatabase() {
  return db.transaction('rw', db.ideas, db.ideas, async () => {
    await Promise.all(db.tables.map(table => table.clear()));
    await populateDB();
  });
}
