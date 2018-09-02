import { environment as env } from '../../environments/environment';
import { Model } from './model';

export class Product implements Model {
  name: string;
  price: number;
  image: string;
  description: string;
  userId: object;
  id: string;
  createdAt: Date;

  constructor(doc) {
    this.name = doc.name;
    this.price = doc.price;
    this.description = doc.description;
    this.image = `${env.API}/${doc.productImage}`;
    this.userId = doc.userId;
    this.id = doc._id;
    this.createdAt = doc.createdAt
  }

  postedAt() {
    let date = new Date(this.createdAt).toDateString();
    let time = new Date(this.createdAt).toTimeString();
    return date + ' ' + time.split(' ')[0];
  }
}
