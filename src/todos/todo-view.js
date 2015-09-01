import _ from 'underscore';
import $ from 'jquery';

import {
  ENTER_KEY
} from './todos-view';

import {
  View
} from 'Backbone';

import {
  TodoFilter
} from './filters';

// Todo Item View class
// --------------------

// *The DOM element for a todo item...*
export default class TodoView extends View {

  constructor(options) {
    super(options);
    // *... is a list tag.*
    this.tagName = 'li';
    console.log(this.model);
    // *Cache the template function for a single item.*
    this.template = _.template($('#item-template').html());

    this.input = '';

    // *Define the DOM events specific to an item.*
    this.events = {
      'click .toggle': 'toggleCompleted',
      'dblclick label': 'edit',
      'click .destroy': 'clear',
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'close'
    };

    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  }

  // *Re-render the contents of the todo item.*
  render() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.toggleClass('completed', this.model.get('completed'));
    this.toggleVisible();
    this.input = this.$('.edit');
    return this;
  }

  toggleVisible() {
    this.$el.toggleClass('hidden', this.isHidden);
  }

  // #### Property Getters and Setters
  // `isHidden()` is using something we call a property getter.
  // Although technically part of ECMAScript 5.1, getters and
  // setters allow us to write and read properties that lazily compute
  // their values. Properties can process values assigned in a
  // post-process step, validating and transforming during assignment.
  //
  // In general, this means using `set` and `get` to bind a property
  // of an object to a function which is invoked when the property is
  // being set and looked up. [Read more](http://ariya.ofilabs.com/2013/03/es6-and-method-definitions.html)
  // on getters and setters.
  get isHidden() {
    var isCompleted = this.model.get('completed'); // const
    return (// hidden cases only
      (!isCompleted && TodoFilter === 'completed') ||
      (isCompleted && TodoFilter === 'active')
    );
  }

  // *Toggle the `'completed'` state of the model.*
  toggleCompleted() {
    this.model.toggle();
  }

  // *Switch this view into `'editing'` mode, displaying the input field.*
  edit() {
    var value = this.input.val(); // const

    this.$el.addClass('editing');
    this.input.val(value).focus();
  }

  // *Close the `'editing'` mode, saving changes to the todo.*
  close() {
    var title = this.input.val(); // const

    if (title) {
      this.model.save({ title });
    } else {
      this.clear();
    }

    this.$el.removeClass('editing');
  }

  // *If you hit `enter`, we're through editing the item.*
  updateOnEnter(e) {
    if (e.which === ENTER_KEY) {
      this.close();
    }
  }

  // *Remove the item and destroy the model.*
  clear() {
    this.model.destroy();
  }
}
