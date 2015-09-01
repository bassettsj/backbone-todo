import $ from 'jquery';
import Backbone from 'backbone';
import './todos/todo-model';
import './todos/todo-view';
import TodoListView from './todos/todos-view';
import Filters from './todos/filters';
$(()=> {
  new TodoListView();
  new Filters();
  Backbone.history.start();
});
