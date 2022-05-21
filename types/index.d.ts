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
  // TODO: ^ getIdeas should only send number of comments
}

export interface StoriesTag {
  id?: number;
  text: string;
}

// Define an interface `IdeaPreview` which will extend IdeaData, ommit `description` and making `comments` into number
export interface IdeaPreview extends Omit<IdeaData, 'description' | 'comments'> {
  comments: number;
}

export interface IdeaUpdateForm extends Omit<IdeaData, 'id' | 'updatedOn' | 'createdOn'> {
  tagIDs: {
    value: number;
    label: string;
  }[];
}

export interface IdeaCreateForm extends Omit<IdeaUpdateForm, 'storyID' | 'status' | 'comments' | 'tags'> {}

export interface IdeaCreateRequest extends Omit<IdeaCreateForm, 'tagIDs'> {
  tagIDs: number[];
}
