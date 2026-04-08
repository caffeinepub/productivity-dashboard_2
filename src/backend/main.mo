import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  // Type definitions
  type TodoCategory = {
    #work;
    #personal;
  };

  type TodoInput = {
    user : Principal;
    title : Text;
    category : TodoCategory;
    dueDate : ?Int;
  };

  type TodoItem = {
    todoId : Nat;
    title : Text;
    category : TodoCategory;
    completed : Bool;
    dueDate : ?Int;
    created : Int;
  };

  type DailyGoalInput = {
    user : Principal;
    title : Text;
    date : Text;
  };

  type DailyGoal = {
    id : Nat;
    title : Text;
    completed : Bool;
    date : Text;
  };

  type Habit = {
    id : Nat;
    name : Text;
  };

  type HabitCompletionInput = {
    user : Principal;
    habitId : Nat;
    date : Text;
  };

  type HabitCompletion = {
    habitId : Nat;
    date : Text;
  };

  type NoteInput = {
    user : Principal;
    title : Text;
    body : Text;
  };

  type Note = {
    id : Nat;
    title : Text;
    body : Text;
    created : Int;
    updated : Int;
  };

  // Compare functions for sorting
  module TodoItem {
    public func compare(t1 : TodoItem, t2 : TodoItem) : Order.Order {
      Nat.compare(t1.todoId, t2.todoId);
    };
  };

  func compareByCreatedTime(t1 : TodoItem, t2 : TodoItem) : Order.Order {
    Int.compare(t1.created, t2.created);
  };

  module Note {
    public func compare(n1 : Note, n2 : Note) : Order.Order {
      Nat.compare(n1.id, n2.id);
    };
  };

  func compareByNoteUpdatedTime(n1 : Note, n2 : Note) : Order.Order {
    Int.compare(n1.updated, n2.updated);
  };

  module DailyGoal {
    public func compare(g1 : DailyGoal, g2 : DailyGoal) : Order.Order {
      Nat.compare(g1.id, g2.id);
    };
  };

  module Habit {
    public func compare(h1 : Habit, h2 : Habit) : Order.Order {
      Nat.compare(h1.id, h2.id);
    };
  };

  // Storage
  let todoMap = Map.empty<Nat, TodoItem>();
  let goalMap = Map.empty<Nat, DailyGoal>();
  let habitMap = Map.empty<Nat, Habit>();
  let completionMap = Map.empty<Nat, HabitCompletion>();
  let noteMap = Map.empty<Nat, Note>();

  // ID counters
  var nextTodoId = 0;
  var nextGoalId = 0;
  var nextHabitId = 0;
  var nextCompletionId = 0;
  var nextNoteId = 0;

  // CRUD operations
  public shared ({ caller }) func createTodo(input : TodoInput) : async TodoItem {
    let newTodo : TodoItem = {
      todoId = nextTodoId;
      title = input.title;
      category = input.category;
      completed = false;
      dueDate = input.dueDate;
      created = Time.now();
    };
    todoMap.add(nextTodoId, newTodo);
    nextTodoId += 1;
    newTodo;
  };

  public shared ({ caller }) func getAllTodos() : async [TodoItem] {
    todoMap.values().toArray().sort();
  };

  public shared ({ caller }) func createDailyGoal(input : DailyGoalInput) : async DailyGoal {
    let newGoal : DailyGoal = {
      id = nextGoalId;
      title = input.title;
      completed = false;
      date = input.date;
    };
    goalMap.add(nextGoalId, newGoal);
    nextGoalId += 1;
    newGoal;
  };

  public query ({ caller }) func getAllGoals() : async [DailyGoal] {
    goalMap.values().toArray().sort();
  };

  public shared ({ caller }) func createHabit(name : Text) : async Habit {
    let newHabit : Habit = {
      id = nextHabitId;
      name;
    };
    habitMap.add(nextHabitId, newHabit);
    nextHabitId += 1;
    newHabit;
  };

  public shared ({ caller }) func createHabitCompletion(input : HabitCompletionInput) : async HabitCompletion {
    let newCompletion : HabitCompletion = {
      habitId = input.habitId;
      date = input.date;
    };
    completionMap.add(nextCompletionId, newCompletion);
    nextCompletionId += 1;
    newCompletion;
  };

  public shared ({ caller }) func createNote(input : NoteInput) : async Note {
    let now = Time.now();
    let newNote : Note = {
      id = nextNoteId;
      title = input.title;
      body = input.body;
      created = now;
      updated = now;
    };
    noteMap.add(nextNoteId, newNote);
    nextNoteId += 1;
    newNote;
  };

  public shared ({ caller }) func deleteTodo(id : Nat) : async Bool {
    if (todoMap.containsKey(id)) {
      todoMap.remove(id);
      true;
    } else {
      false;
    };
  };

  public shared ({ caller }) func deleteNote(id : Nat) : async Bool {
    if (noteMap.containsKey(id)) {
      noteMap.remove(id);
      true;
    } else {
      false;
    };
  };

  public shared ({ caller }) func deleteHabit(id : Nat) : async Bool {
    if (habitMap.containsKey(id)) {
      habitMap.remove(id);
      true;
    } else {
      false;
    };
  };

  public query ({ caller }) func isRegistered(user : Principal) : async Bool {
    let hasTodos = todoMap.values().toArray().any(func(t) { t.todoId == user.toText().toNat() });
    let hasGoals = goalMap.values().toArray().any(func(g) { g.id == user.toText().toNat() });
    let hasHabits = habitMap.values().toArray().any(func(h) { h.id == user.toText().toNat() });
    hasTodos or hasGoals or hasHabits;
  };

  public shared ({ caller }) func markTodoComplete(id : Nat) : async () {
    let oldTodo = switch (todoMap.get(id)) {
      case (null) { Runtime.trap("Todo not found") };
      case (?todo) { todo };
    };
    let newTodo = { oldTodo with completed = true };
    todoMap.add(id, newTodo);
  };
};
