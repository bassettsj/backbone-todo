import {
  View
} from 'backbone';
import $ from 'jquery';
import _ from 'underscore';
import TodoView from './todo-view';
import TodoList from './todos-collection';

export const ENTER_KEY = 13;
export let Todos = new TodoList();

// The Application class
// ---------------------

// *Our overall **AppView** is the top-level piece of UI.*
export default class TodoListView extends View {

  constructor() {
    super();
    // *Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.*
    this.setElement($('#todoapp'), true);

    this.statsTemplate = _.template($('#stats-template').html()),

    // *Delegate events for creating new items and clearing completed ones.*
    this.events = {
      'keypress #new-todo': 'createOnEnter',
      'click #clear-completed': 'clearCompleted',
      'click #toggle-all': 'toggleAllComplete'
    };

    // *At initialization, we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in localStorage.*

    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(Todos, 'add', this.addOne);
    this.listenTo(Todos, 'reset', this.addAll);
    this.listenTo(Todos, 'change:completed', this.filterOne);
    this.listenTo(Todos, 'filter', this.filterAll);
    this.listenTo(Todos, 'all', this.render);

    Todos.fetch();
  }

  // *Re-rendering the App just means refreshing the statistics— the rest of
  // the app doesn't change.*
  render() {
    var completed = Todos.completed().length; // const
    var remaining = Todos.remaining().length; // const

    if (Todos.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(
        this.statsTemplate({
          completed, remaining
        })
      );

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + (TodoFilter || '') + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  }

  // *Add a single todo item to the list by creating a view for it, then
  // appending its element to the `<ul>`.*
  addOne(model) {
    var view = new TodoView({ model }); // const
    $('#todo-list').append(view.render().el);
  }

  // *Add all items in the **Todos** collection at once.*
  addAll() {
    this.$('#todo-list').html('');
    Todos.each(this.addOne, this);
  }

  filterOne(todo) {
    todo.trigger('visible');
  }

  filterAll() {
    Todos.each(this.filterOne, this);
  }

  // *Generate the attributes for a new Todo item.*
  newAttributes() {
    return {
      title: this.$input.val().trim(),
      order: Todos.nextOrder(),
      completed: false
    };
  }

  // *If you hit `enter` in the main input field, create a new **Todo** model,
  // persisting it to localStorage.*
  createOnEnter(e) {
    if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
      return;
    }

    Todos.create(this.newAttributes());
    this.$input.val('');
  }

  // *Clear all completed todo items and destroy their models.*
  clearCompleted() {
    _.invoke(Todos.completed(), 'destroy');
    return false;
  }

  toggleAllComplete() {
    var completed = this.allCheckbox.checked; // const
    Todos.each(todo => todo.save({ completed }));
  }
}
