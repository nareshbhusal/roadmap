export interface IdeasTag {
    id: number;
    text: string;
}

export interface IdeaData {
  id?: number;
  title: string;
  description: string;
  createdOn: number;
  updatedOn?: number;
  effort: number;
  impact: number;
  storyID?: number;
  tags: IdeasTag[];
  status: 'active' | 'completed' | 'archived';
  comments: string[]
}
