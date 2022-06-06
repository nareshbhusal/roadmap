// https://www.typescriptlang.org/docs/handbook/utility-types.html

export interface IdeasTag {
  id?: number;
  text: string;
}

export type IdeaStatus = 'active' | 'completed' | 'archived';

export interface IdeaData {
  // TODO: What to do about these optional fields?
  id?: number;
  title: string;
  description: string;
  createdOn: number;
  updatedOn: number | null;
  effort: number;
  impact: number;
  storyID: number | null;
  tags: IdeasTag[];
  status: IdeaStatus;
  comments: string[]
}

export interface StoriesTag {
  id?: number;
  text: string;
}

// Define an interface `IdeaPreview` which will extend IdeaData, ommit `description` and making `comments` into number
export interface IdeaPreview extends Omit<IdeaData, 'description' | 'comments'> {
  comments: number;
}

export interface BoardPreview {
  id?: number;
  name: string;
  archived: boolean;
}

export interface IdeaUpdateForm extends Omit<IdeaData, 'id' | 'updatedOn' | 'createdOn' | 'tags' | 'status' | 'storyID' | 'comments'> {
  tagIDs: number[];
  comments: { value: string }[];
}

export interface IdeaCreateForm extends Omit<IdeaUpdateForm, 'storyID' | 'status' | 'comments' | 'tags'> {}

export interface IdeaCreateRequest extends Omit<IdeaCreateForm, 'tagIDs'> {
  tagIDs: number[];
}

export interface User {
  name: string;
}

export interface Organization {
  name: string;
  urlKey: string;
}

export interface StoryPreview {
  title: string;
  listId: number;
  boardId: number;
  createdOn: number;
  updatedOn: number | null;
  tags: number[];
  tasks: {
    done: number;
    total: number;
  };
  ideas: number[];
  priority: '1' | '2' | '3' | '4' | '5';
  description: string;
  position: number;
  id: number;
}

export interface BoardList {
  name: string;
  id: number;
  boardId: number;
  position: number;
  stories: StoryPreview[];
}

export interface BoardData {
  id: number;
  name: string;
  tags: number[];
  createdOn: number;
  lastAccessed: number;
  lists: BoardList[];
}

