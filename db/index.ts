import Dexie, { Table } from "dexie";
import type { IdeaData } from '../types';

// TODO: There must be some best-practice pattern for this problem where you need just some slight adjustment
// to the type interface, one for form values, one for the server request, and one for the database.
// TODO: God, please make the types less fugly
//
// TODO: We'll have different board, different projects, and one organization.

export interface IdeasTag {
  id?: number;
  text: string;
}

export interface StoriesTag {
  id?: number;
  text: string;
}

export interface Idea {
  id?: number;
  title: string;
  description: string;
  createdOn: number;
  updatedOn?: number;
  effort: number;
  impact: number;
  storyID?: number;
  tagIDs: number[];
  status: 'active' | 'completed' | 'archived';
  comments: string[]
}

class IdeasDB extends Dexie {
  ideas!: Table<Idea, number>;
  ideasTags!: Table<IdeasTag, number>;
  storiesTags!: Table<StoriesTag, number>;

  constructor() {
    super("roadmapDB");

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
      storiesTags: `
        ++id,
        &text
      `
    });

    this.ideas = this.table("ideas");
    this.ideasTags = this.table("ideasTags");
    this.storiesTags = this.table("storiesTags");
  }

  public addIdea(idea: Partial<Idea>) {
    return this.ideas.add({
      ...idea,
      createdOn: Date.now(),
      comments: [],
      status: 'active',
    } as Idea);
  }

  public async deleteIdeasTag(ideasTagID: number) {
    const something = await this.ideas.where("id").equals(ideasTagID).toArray();
    console.log(something);
    await this.transaction("rw", this.ideas, this.ideasTags, async () => {
      await this.ideasTags.delete(ideasTagID);
      // remove ideasTagID from all ideas' tagIDs[]
      await this.ideas.where("tagIDs").equals(ideasTagID).modify(idea => {
        idea.tagIDs = idea.tagIDs.filter(tagID => tagID !== ideasTagID);
      });
    });
  }

  public getIdea(id: number) {
    // TODO: We want to also fetch comments[]
    return this.ideas.get(id);
  }

  public async getIdeas() {
    const ideas = await this.ideas.toArray();
    const ideasTags = await this.ideasTags.toArray();
    return (ideas.map(idea => {
      let ideaToSend = {
        ...idea as any,
        tags: idea.tagIDs.map(tagID => {
          return ideasTags.find(tag => tag.id === tagID);
        }),
      } as any[];
      delete (ideaToSend as any).tagIDs;
      return ideaToSend;
    }) as unknown) as IdeaData[];
  }

  public getIdeasTags() {
    return this.ideasTags.toArray();
  }

  public addIdeasTag(tag: string) {
    return this.ideasTags.add({
      text: tag
    });
  }

  public updateIdea(id: number, idea: Partial<Idea>) {
    return this.ideas.update(id, {
      ...idea,
      updatedOn: Date.now(),
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
