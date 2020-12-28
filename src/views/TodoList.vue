<template>
  <div class="todo-list-container">
    <header>
      <img src="../assets/Logo.svg" alt="Small do the Todo Logo" class="logo" />
      <button v-show="!newTodo" class="newTodoButton" v-on:click="toggleInput">
        New Todo...
      </button>
      <input
        type="text"
        class="newTodoInput"
        v-model="newInput"
        v-show="newTodo"
        :placeholder="placeholder"
        @keyup.enter="submitTodo"
        minLength="3"
        maxlength="30"
      />
    </header>
    <ul class="todo-list">
      <div v-for="todo in this.todos" :key="todo.dBkey">
        <TodoItem
          v-show="!todo.edit"
          :name="todo.name"
          :done="todo.done"
          :edit="todo.edit"
          :dBkey="todo.dBkey"
          @toggleEdit="toggleEdit(todo)"
          @toggleDone="toggleDone(todo)"
          @deleteTodo="deleteTodo(todo)"
        />
        <li
          v-show="todo.edit"
          :name="todo.name"
          :done="todo.done"
          :edit="todo.edit"
          :dBkey="todo.dBkey"
        >
          <input
            class="edit-input"
            type="text"
            v-model="newInput"
            minLength="3"
            maxlength="30"
            @keyup.enter="editTodo(todo)"
          />
        </li>
      </div>
    </ul>
    <span v-show="todos.length > 0" class="footer">
      <button
        class="delete-todos-button"
        :class="{
          'delete-button-enabled': manyDeletable,
        }"
        :disabled="!manyDeletable"
        @click="deleteMany"
      >
        Delete all finished
      </button>
      <p class="total-todos">
        <em>{{
          unfinished
            ? `Unfinished todos: ${unfinished} of ${todos.length}`
            : 'No unfinished todos'
        }}</em>
      </p>
    </span>
    <div class="sign-out">
      <p>
        <em>Signed in as {{ user.displayName }}</em>
      </p>
      <button class="sign-out-button" @click="this.$root.signOut">
        SIGN OUT
      </button>
    </div>
  </div>
</template>

<script>
import TodoItem from '../components/TodoItem'

export default {
  components: {
    TodoItem,
  },
  created() {
    this.fetchTodos()
  },
  computed: {
    manyDeletable() {
      return this.unfinished < this.todos.length - 1
    },
  },
  data() {
    return {
      newInput: '',
      newTodo: false,
      placeholder: 'What needs to be done?',
      todos: [],
      unfinished: 0,
      user: this.$root.userData.user,
    }
  },
  methods: {
    async fetchTodos() {
      const todos = []
      const snapshot = await this.$root.fb
        .database()
        .ref(`${this.user.uid}/todos/`)
        .once('value')
      if (snapshot.val()) {
        for (let todo of Object.entries(snapshot.val())) {
          let key = todo[0]
          let newTodo = todo[1]
          newTodo.dBkey = key
          todos.push(newTodo)
        }
      }

      this.todos = todos
      this.countUnfinished()
    },
    toggleInput() {
      if (!this.todos.find(item => item.edit === true)) {
        this.newTodo = true
      }
    },
    toggleDone(todo) {
      todo.done = !todo.done
      this.$root.fb
        .database()
        .ref(`${this.user.uid}/todos/` + todo.dBkey)
        .update({
          done: todo.done,
        })
      this.countUnfinished()
    },
    toggleEdit(todo) {
      if (!this.newTodo) {
        this.newInput = todo.name
        todo.edit = true
      }
    },
    submitTodo() {
      if (this.newInput.length > 2) {
        const ref = this.$root.fb
          .database()
          .ref(`${this.user.uid}/todos/`)
          .push() // ref key will be given from api
        ref.set({ name: this.newInput, done: false, edit: false })

        this.todos.push({
          name: this.newInput,
          done: false,
          edit: false,
          dBkey: ref.key,
        })

        this.newTodo = false
        this.placeholder = 'What needs to be done?'
        this.countUnfinished()
      } else {
        this.placeholder = 'Todo needs to be at least three characters'
      }
      this.newInput = ''
    },
    editTodo(todo) {
      if (this.newInput.length > 2) {
        todo.name = this.newInput

        this.$root.fb
          .database()
          .ref(`${this.user.uid}/todos/` + todo.dBkey)
          .update({
            name: this.newInput,
          })

        this.newInput = ''
        todo.edit = false
      }
    },
    deleteTodo(todo) {
      this.$root.fb
        .database()
        .ref(`${this.user.uid}/todos/` + todo.dBkey)
        .remove()

      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].dBkey === todo.dBkey) {
          this.todos.splice(i, 1)
        }
      }
    },
    deleteMany() {
      for (let todo of this.todos) {
        if (todo.done) {
          this.$root.fb
            .database()
            .ref(`${this.user.uid}/todos/` + todo.dBkey)
            .remove()
        }

        this.todos = this.todos.filter(todo => !todo.done)
      }
    },
    countUnfinished() {
      this.unfinished = this.todos.filter(todo => !todo.done).length
    },
  },
}
</script>

<style>
.todo-list-container {
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 5rem auto;
  min-height: 30rem;
  padding: 1rem;
  width: 20rem;
}

header {
  align-items: center;
  display: flex;
}

.logo {
  margin-right: 5px;
  width: 3rem;
}

.newTodoInput,
.newTodoButton,
.edit-input {
  box-sizing: border-box;
  width: 100%;
  height: 3rem;
  margin: 5px 0 0;
}

.newTodoInput,
.newTodoButton {
  margin: 0;
}

.newTodoButton,
.sign-out-button {
  align-items: center;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  font-size: 1.1rem;
  font-weight: 700;
  justify-content: center;
  outline: none;
}

.edit-input {
  background-color: #c5c5c5;
  border: none;
  color: white;
  outline: none;
  padding: 0 0 0 10px;
}

.newTodoInput {
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  color: #333;
  font-size: 1rem;
  font-weight: 700;
  outline: none;
  padding: 0 0 0 10px;
}

.newTodoButton {
  background: transparent;
  border: 4px solid #0a78f9;
  color: #0a78f9;
}

.edit-input {
  font-weight: 700;
  font-size: 1rem;
  margin: 5px 0 0;
}

::placeholder {
  color: #aeaeae;
}

.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
}

.total-todos {
  color: #7e7e7e;
  cursor: default;
  font-size: 10px;
  margin: 0 2px 0 0;
}

.footer > p {
  margin-top: 3px;
}

.delete-todos-button {
  align-items: center;
  background-color: #f2f2f2;
  border: none;
  color: white;
  display: flex;
  margin-top: 5px;
  outline: none;
  padding: 10px;
}

.delete-button-enabled {
  background-color: #29b933;
  cursor: pointer;
}

.sign-out {
  align-items: flex-end;
  margin-top: auto;
  display: flex;
  justify-content: space-between;
}

.sign-out button {
  border: 1px solid black;
  color: #333;
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
}

.sign-out em,
.sign-out p {
  align-self: flex-end;
  color: #7e7e7e;
  cursor: default;
  font-size: 10px;
  margin: 0;
}

@media only screen and (max-width: 600px) {
  .todo-list-container {
    background-color: rgba(255, 255, 255, 0.7);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 1rem auto;
    min-height: 95vh;
    padding: 1.5rem;
    min-width: 95%;
  }

  .newTodoInput,
  .newTodoButton,
  .edit-input {
    box-sizing: border-box;
    width: 100%;
    height: 3.5rem;
    margin: 5px 0 0;
  }

  .delete-todos-button {
    align-items: center;
    background-color: #f2f2f2;
    border: none;
    color: white;
    display: flex;
    margin-top: 5px;
    outline: none;
    padding: 15px;
  }

  .delete-button-enabled {
    background-color: #29b933;
    cursor: pointer;
  }
}
</style>
