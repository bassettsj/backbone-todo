import {
  Model
} from 'backbone';

export default class TodoModel extends Model {
  defaults() {
    return {
      title: '',
      completed: false
    };
  }

  toggle() {
    this.save({
      completed: !this.get('completed')
    });
  }
}
