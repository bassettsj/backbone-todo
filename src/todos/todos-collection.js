import LocalStorage from 'backbone.localstorage';
import {
  Collection
} from 'backbone';
import Todo from './todo-model';

// TodoList Collection class
// -------------------------

// The collection of todos is backed by *localStorage* instead of a remote
// server.
export default class TodoList extends Collection {

  // #### Constructors and Super Constructors
  // Specifying a `constructor` lets us define the class constructor. Use of the
  // `super` keyword in your constructor lets you call the constructor of a parent
  // class so that it can inherit all of its properties.
  constructor(options) {
    super(options);

    // *Hold a reference to this collection's model.*
    this.model = Todo;

    // *Save all of the todo items under the `'todos'` namespace.*
    this.localStorage = new LocalStorage('backbone-todo');
  }

  // *Filter down the list of all todo items that are finished.*

  // #### Arrow Functions (Expressions)
  // The arrow (`=>`) is shorthand syntax for an anonymous
  // function. It doesn't require the `function` keyword and the
  // parens are optional when there's a single parameter being used.
  // The value of `this` is bound to its containing scope, and when
  // an expression follows the arrow - like in this case - the arrow
  // function automatically returns that expression's value, so you
  // don't need `return`.
  //
  // Arrow functions are more lightweight
  // than normal functions, reflecting how they're expected to be used—
  // they don't have a prototype and can't act as constructors.
  // Because of how they inherit `this` from the containing scope, the
  // meaning of `this` inside of them __can__ be changed with `call` or `apply`.
  //
  // To recap, when using `=>`:
  //
  // * The `function` keyword isn't required.
  // * Parentheses are optional with a single parameter.
  // * `this` is bound to the containing scope— change the context with `call`
  // or `apply`.
  // * `return` is unnecessary with a single expression.
  // * Functions are lightweight— no prototypes or constructors.
  completed() {
    return this.filter(todo => todo.get('completed'));
  }

  // *Filter down the list to only todo items that are still not finished.*
  remaining() {
    // The ES6 spread operator reduces runtime boilerplate code by allowing
    // an expression to be expanded where multiple arguments or elements are
    // normally expected. It can appear in function calls or array literals.
    // The three dot syntax below is to indicate a variable number of arguments
    // and helps us avoid hacky use of `apply` for spreading.
    //
    // Compare the old way...
    //
    //     return this.without.apply(this, this.completed());
    //
    // ...with the new, signifcantly shorter way...
    //
    //     return this.without(...this.completed());
    //
    // This doesn't require repeating the object on which the method is called
    // (`this` in our case).
    return this.without(...this.completed());
  }

  // *We keep the Todos in sequential order, despite being saved by unordered
  // GUID in the database. This generates the next order number for new
  // items.*
  nextOrder() {
    if (!this.length) {
      return 1;
    }

    return this.last().get('order') + 1;
  }

  // *Todos are sorted by their original insertion order.*
  comparator(todo) {
    return todo.get('order');
  }
}
