export interface StoryDragItem {
  title: string;
  id: number;
  listId: number;
  position: number;
}

export interface ListDragItem {
  name: string;
  id: number;
  position: number;
}

export const ItemTypes = {
  STORY: 'story',
  LIST: 'list',
}
