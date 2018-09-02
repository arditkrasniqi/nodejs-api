import { Model } from './model';

export class Order implements Model {
  id: string;
  product: object;
  quantity: number;
  createdAt: Date;
  markAsDone: boolean;

  constructor(id: string, pn: object, q: number, ca: Date, mad: boolean) {
    this.id = id;
    this.product = pn;
    this.quantity = q;
    this.createdAt = ca;
    this.markAsDone = mad;
  }

  postedAt() {
    let date = new Date(this.createdAt).toDateString();
    let time = new Date(this.createdAt).toTimeString();
    return date + ' ' + time.split(' ')[0];
  }
}
