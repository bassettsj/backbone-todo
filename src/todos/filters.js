import {
  Router
} from 'backbone';
import {
  Todos
} from './todos-view';
export let TodoFilter = '';

// The Filters Router class
// ------------------------
export default class Filters extends Router {

  constructor() {
    super();
    this.routes = {
      '*filter': 'filter'
    }

    this._bindRoutes();
  }
  
  filter(param = '') {
    // *Set the current filter to be used.*
    TodoFilter = param;

    // *Trigger a collection filter event, causing hiding/unhiding
    // of Todo view items.*
    Todos.trigger('filter');
  }
}
