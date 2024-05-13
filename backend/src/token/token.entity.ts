import { Collection } from 'src/collection/collection.entity';

export class Token {
  id: number;
  price: number;
  collection: Collection;

  public constructor(id: number, price: number, collection: Collection) {
    this.id = id;
    this.price = price;
    this.collection = collection;
  }

  public static fromObject(object: { [key: string]: unknown }): Token {
    const { id, price, collection } = object;

    if (!id) throw 'ID property is required';
    if (!price) throw 'Price property is required';

    const token = new Token(
      id as number,
      price as number,
      collection as Collection,
    );

    return token;
  }
}
