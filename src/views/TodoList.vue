<template>
  <div class="wrapper">
    <header>
      <img
        src="../assets/Logo_white.svg"
        alt="Small do the Todo Logo"
        class="logo"
      />
      <p>
        <em>Signed in as {{ user.displayName }}</em>
      </p>
      <button class="sign-out-button" @click="this.$root.signOut">
        SIGN OUT
      </button>
    </header>
    <main>
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
    </main>
    <footer v-show="todos.length > 0" class="footer">
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
    </footer>
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

<style lang="scss">
.wrapper {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  height: 100vh;
  overflow: scroll;
}

header {
  align-items: center;
  background: #0a78f9;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  left: 0;
  padding: 1rem 12rem;
  position: fixed;
  top: 0;
  width: 100%;

  .logo {
    width: 4rem;
  }

  p {
    color: #fff;
    cursor: default;
    font-size: 12px;
    margin: 0;
  }

  .sign-out-button {
    border: 1px solid #fff;
    background-color: transparent;
    color: white;
    cursor: pointer;
    font-size: 8px;
    padding: 0.5rem;
    width: 4rem;
  }
}

main {
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  margin: 5rem auto;
  min-height: 30rem;
  padding: 1rem;
  max-width: 25rem;

  .todo-list {
    list-style: none;
    margin: 0;
    padding: 0;

    min-height: 80vh;
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

  .newTodoButton {
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
}

.footer {
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  left: 0;
  padding: 1rem 0;
  position: fixed;
  width: 100%;

  .delete-todos-button {
    align-items: center;
    background-color: #f2f2f2;
    border: none;
    color: white;
    display: flex;
    margin: 0 2rem 0 0;
    outline: none;
    padding: 10px;
  }

  .delete-button-enabled {
    background-color: #29b933;
    cursor: pointer;
  }

  .total-todos {
    color: #7e7e7e;
    cursor: default;
    font-size: 10px;
    margin: 0 0 0 2rem;
  }
}

@media only screen and (max-width: 600px) {
  .wrapper {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
  }

  header {
    align-items: center;
    background-color: #0a78f9;
    box-sizing: border-box;
    display: flex;
    height: 4rem;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0 1rem;
    z-index: 1;

    .logo {
      width: 3rem;
    }

    p {
      color: #fff;
      cursor: default;
      font-size: 10px;
      margin: 0;
    }

    .sign-out-button {
      border: 1px solid #fff;
      background-color: transparent;
      color: white;
      font-size: 10px;
      padding: 5px;
    }
  }

  main {
    background-color: rgba(255, 255, 255, 0.9);
    margin-top: 3.5rem;
    display: flex;
    flex-direction: column;
    min-width: 0;

    .todo-list {
      padding: 0 0 5.5vh;
      margin: 0;
    }

    .newTodoInput,
    .newTodoButton,
    .edit-input {
      box-sizing: border-box;
      width: 100%;
      height: 3.5rem;
      margin: 5px 0 0;
    }
  }

  .footer {
    align-items: center;
    background-color: #fff;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    height: 5.5rem;
    justify-content: space-between;
    left: 0;
    padding: 0 1rem;
    position: fixed;
    width: 100vw;

    .delete-todos-button {
      align-items: center;
      background-color: #f2f2f2;
      border: none;
      color: white;
      display: flex;
      margin: 0;
      outline: none;
      padding: 10px 15px;
    }

    .delete-button-enabled {
      background-color: #29b933;
      cursor: pointer;
    }

    .total-todos {
      color: #8a8a8a;
      cursor: default;
      font-size: 10px;
      margin: 0;
    }
  }
}
</style>
