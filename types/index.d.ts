export interface IdeaData {
  id: Number;
  title: string;
  description: string;
  createdOn: string;
  updatedOn: string;
  effort: number;
  impact: number;
  storyID: number;
  tags: string[];
  status: 'active' | 'completed' | 'archived';
  comments: string[]
}
