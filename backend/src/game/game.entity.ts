export class Game {
  id: number;
  name: string;

  public constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  public static fromObject(object: { [key: string]: unknown }): Game {
    const { id, name } = object;

    if (!id) throw 'ID property is required';
    if (!name) throw 'Name property is required';

    const game = new Game(id as number, name as string);

    return game;
  }
}
