export class Rank {
  id: number;
  description: string;

  public constructor(id: number, description: string) {
    this.id = id;
    this.description = description;
  }

  public static fromObject(object: { [key: string]: unknown }): Rank {
    const { id, description} = object;

    if (!id) throw 'ID property is required';
    if (!description) throw 'Description property is required';

    const rank = new Rank(id as number, description as string);

    return rank;
  }
}
