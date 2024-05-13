export class Game {
  id: number;
  name: string;
  icon: string;

  public constructor(id: number, name: string, icon: string) {
    this.id = id;
    this.name = name;
    this.icon = icon;
  }

  public static fromObject(object: { [key: string]: unknown }): Game {
    const { id, name, icon } = object;

    if (!id) throw 'ID property is required';
    if (!name) throw 'Name property is required';
    if (!icon) throw 'Icon property is required';

    const game = new Game(id as number, name as string, icon as string);

    return game;
  }
}
