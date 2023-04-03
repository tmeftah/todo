<template>
  <span v-if="isLoggedIn">
    <button @click="LogOut" class="button is-danger mb-5">Logout</button>
    <div>
      <div class="field is-grouped">
        <p class="control is-expanded">
          <input type="text" class="input" placeholder="Add a todo" v-model="newTodo" />
        </p>
        <p class="controle">
          <button class="button is-info" @click="addTodo" :disabled="!newTodo">Add</button>
        </p>
      </div>
      <div
        class="card mb-3"
        v-for="todo in TodosWithDueDate"
        :key="todo.id"
        :class="{ 'has-background-success-light': todo.done }"
      >
        <div class="card-content">
          <div class="content">
            <div class="columns is-mobile is-vcentered">
              <div class="column" :class="{ 'has-text-success line-through': todo.done }">
                <div v-show="todo.id !== editedTodo.id">
                  <div @dblclick="editTodo(todo)">
                    {{ todo.content }}
                    <p class="is-size-7" v-show="todo.dueDate">Due: {{ todo.dueDate }}</p>
                  </div>
                </div>

                <div v-show="edit">
                  <input
                    class="input"
                    v-show="todo.id === editedTodo.id"
                    v-model="editedTodo.content"
                    @keyup.enter="updateTodo(editedTodo)"
                  />

                  <input
                    type="date"
                    v-model="editedTodo.dueDate"
                    v-show="todo.id === editedTodo.id"
                  />
                </div>
              </div>
              <div class="column is-5 has-text-right">
                <button class="button is-light" @click="makeDone(todo)">&check;</button>
                <button class="button is-danger ml-2" @click="deleteTodo(todo.id)">&cross;</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <h5>No Due Date</h5>
      <hr />

      <div
        class="card mb-3"
        v-for="todo in TodosWithOutDueDate"
        :key="todo.id"
        :class="{ 'has-background-success-light': todo.done }"
      >
        <div class="card-content">
          <div class="content">
            <div class="columns is-mobile is-vcentered">
              <div class="column" :class="{ 'has-text-success line-through': todo.done }">
                <div v-show="todo.id !== editedTodo.id">
                  <div @dblclick="editTodo(todo)">
                    {{ todo.content }}
                    <p class="is-size-7" v-show="todo.dueDate">Due: {{ todo.dueDate }}</p>
                  </div>
                </div>

                <div v-show="edit">
                  <input
                    class="input"
                    v-show="todo.id === editedTodo.id"
                    v-model="editedTodo.content"
                    @keyup.enter="updateTodo(editedTodo)"
                  />

                  <input
                    type="date"
                    v-model="editedTodo.dueDate"
                    v-show="todo.id === editedTodo.id"
                  />
                </div>
              </div>
              <div class="column is-5 has-text-right">
                <button class="button is-light" @click="makeDone(todo)">&check;</button>
                <button class="button is-danger ml-2" @click="deleteTodo(todo.id)">&cross;</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore'
import { useRouter } from 'vue-router' // import router
import { signOut } from 'firebase/auth'
import { db, auth } from '@/firebase'

/*

*/
const router = useRouter() // get a reference to our vue router
const todosCollectionRef = collection(db, 'todos')

const newTodo = ref('')
const editedTodo = ref('')

const edit = ref('')
const todos = ref([])
const isLoggedIn = ref(null)

const TodosWithDueDate = computed({
  get() {
    return todos.value.filter((todo) => {
      return todo.dueDate !== null && todo.dueDate !== ''
    })
  }
})
const TodosWithOutDueDate = computed({
  get() {
    return todos.value.filter((todo) => {
      return todo.dueDate === null || todo.dueDate === ''
    })
  }
})

const snap = onSnapshot(
  query(todosCollectionRef, orderBy('dueDate', 'asc'), orderBy('added_on', 'desc')),
  (querySnapshot) => {
    const todosList = []
    querySnapshot.forEach((doc) => {
      const todo = {
        id: doc.id,
        content: doc.data().content,
        done: doc.data().done,
        added_on: doc.data().added_on,
        dueDate: doc.data().dueDate
      }
      todosList.push(todo)
    })
    todos.value = todosList
  }
)

/*
Realtime db connection
*/
onMounted(() => {
  // runs after firebase is initialized
  auth.onAuthStateChanged(function (user) {
    if (user) {
      isLoggedIn.value = true // if we have a user
    } else {
      isLoggedIn.value = false // if we do not
    }
  })
})

const addTodo = () => {
  // Add a new document with a generated id.

  addDoc(todosCollectionRef, {
    content: newTodo.value,
    done: false,
    added_on: Date.now(),
    dueDate: null
  })
  newTodo.value = ''
}

const editTodo = (todo) => {
  editedTodo.value = todo
  edit.value = true
}

const updateTodo = (todo) => {
  updateDoc(doc(todosCollectionRef, todo.id), {
    content: todo.content,
    dueDate: todo.dueDate
  })
  editedTodo.value = ''
}

const makeDone = (todo) => {
  updateDoc(doc(todosCollectionRef, todo.id), {
    done: !todo.done
  })
}

const deleteTodo = (id) => {
  deleteDoc(doc(todosCollectionRef, id))
}

const LogOut = () => {
  snap()
  signOut(auth)
    .then(() => {
      // Sign-out successful.

      router.push('/login') // redirect to the feed
    })
    .catch((error) => {
      // An error happened.
      console.log(error)
    })
}
</script>
