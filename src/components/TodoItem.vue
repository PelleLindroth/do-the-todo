<template>
  <li class="todo" :class="{ 'checked-todo': done }">
    <span class="row"
      ><span
        class="gray-circle"
        :title="done ? 'Mark as unfinished' : 'Mark as finished'"
        :class="{ 'green-circle': done }"
        @click="toggleDone"
        >●</span
      >
      {{ name }}
      <span v-show="done" class="checked"> ✓ </span>
      <img
        v-show="!done"
        class="edit-icon"
        src="../assets/edit-icon.svg"
        alt="Edit icon"
        title="Edit todo"
        @click="toggleEdit"
      />
      <img
        v-show="done"
        class="clear-icon"
        src="../assets/clear-icon.svg"
        alt="Delete icon"
        title="Delete todo"
        @click="deleteTodo"
      />
    </span>
  </li>
</template>

<script>
export default {
  props: {
    dBkey: String,
    done: Boolean,
    edit: Boolean,
    name: String,
  },
  methods: {
    deleteTodo() {
      this.$emit('deleteTodo')
    },
    toggleEdit() {
      this.$emit('toggleEdit')
    },
    toggleDone() {
      this.$emit('toggleDone')
    },
  },
}
</script>

<style scope>
.todo {
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ddd;
  box-sizing: border-box;
  color: #555;
  cursor: default;
  display: flex;
  font-weight: 700;
  margin: 5px 0 0;
  min-width: 100%;
  height: 3rem;
  padding: 10px;
}

.gray-circle,
.green-circle {
  cursor: pointer;
  opacity: 0.7;
}

.gray-circle:hover,
.green-circle:hover {
  opacity: 1;
}

.gray-circle {
  color: #959595;
  margin-right: 5px;
}

.green-circle {
  color: #29b933;
  margin-right: 5px;
}

.checked {
  color: #29b933;
  margin-left: 5px;
}

.row {
  display: flex;
  width: 100%;
}

.edit-icon,
.clear-icon {
  cursor: pointer;
  margin-left: auto;
  opacity: 0.7;
  width: 1rem;
}

.edit-icon:hover,
.clear-icon:hover {
  opacity: 1;
}
</style>
