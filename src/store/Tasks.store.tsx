import { createSlice, Dispatch, MiddlewareAPI, Action, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../interfaces";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

// Definición de la colección en Firestore
const tasksCollection = collection(db, "tasks");
const directoriesCollection = collection(db, "directories");

// Estado inicial vacío; se poblará desde Firestore
const initialState: {
  tasks: Task[];
  directories: string[];
} = {
  tasks: [],
  directories: [],
};

// Thunks para manejar operaciones asíncronas con Firestore
export const fetchTasks = () => async (dispatch: Dispatch) => {
  const taskSnapshot = await getDocs(tasksCollection);
  const tasksList: Task[] = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
  dispatch(tasksSlice.actions.setTasks(tasksList));
};

export const fetchDirectories = () => async (dispatch: Dispatch) => {
  const dirSnapshot = await getDocs(directoriesCollection);
  const directoriesList: string[] = dirSnapshot.docs.map(doc => doc.data().name as string);
  dispatch(tasksSlice.actions.setDirectories(directoriesList));
};

export const addTask = (task: Task) => async (dispatch: Dispatch) => {
  const docRef = await addDoc(tasksCollection, task);
  dispatch(tasksSlice.actions.addNewTask({ ...task, id: docRef.id }));
};

export const updateTask = (task: Task) => async (dispatch: Dispatch) => {
  const taskDoc = doc(db, "tasks", task.id);
  const { id, ...data } = task; // Excluir 'id' antes de actualizar
  await updateDoc(taskDoc, data);
  dispatch(tasksSlice.actions.editTask(task));
};

export const removeTask = (id: string) => async (dispatch: Dispatch) => {
  const taskDoc = doc(db, "tasks", id);
  await deleteDoc(taskDoc);
  dispatch(tasksSlice.actions.removeTask(id));
};

export const addDirectory = (dirName: string) => async (dispatch: Dispatch) => {
  const docRef = await addDoc(directoriesCollection, { name: dirName });
  dispatch(tasksSlice.actions.createDirectory(dirName)); // Reemplazar 'docName' por 'dirName'
};

export const deleteDirectory = (dirName: string) => async (dispatch: Dispatch) => {
  // Asumimos que el nombre del directorio es único
  const dirSnapshot = await getDocs(collection(db, "directories"));
  const dirDoc = dirSnapshot.docs.find(doc => doc.data().name === dirName);
  if (dirDoc) {
    await deleteDoc(doc(db, "directories", dirDoc.id));
    dispatch(tasksSlice.actions.deleteDirectory(dirName));
  }
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    setDirectories(state, action: PayloadAction<string[]>) {
      state.directories = action.payload;
    },
    addNewTask(state, action: PayloadAction<Task>) {
      state.tasks = [action.payload, ...state.tasks];
    },
    removeTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    markAsImportant(state, action: PayloadAction<string>) {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.important = !task.important;
        updateTask(task); // Actualiza en Firestore
      }
    },
    editTask(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        updateTask(action.payload); // Actualiza en Firestore
      }
    },
    toggleTaskCompleted(state, action: PayloadAction<string>) {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        updateTask(task); // Actualiza en Firestore
      }
    },
    deleteAllData(state) {
      state.tasks = [];
      state.directories = ["Main"];
      // Aquí deberías eliminar todos los documentos de Firestore si es necesario
    },
    createDirectory(state, action: PayloadAction<string>) {
      const newDirectory = action.payload;
      if (!state.directories.includes(newDirectory)) {
        state.directories = [newDirectory, ...state.directories];
        addDirectory(newDirectory); // Agrega en Firestore
      }
    },
    deleteDirectory(state, action: PayloadAction<string>) {
      const dirName = action.payload;
      state.directories = state.directories.filter(dir => dir !== dirName);
      state.tasks = state.tasks.filter(task => task.dir !== dirName);
      deleteDirectory(dirName); // Elimina en Firestore
    },
    editDirectoryName(state, action: PayloadAction<{ newDirName: string; previousDirName: string }>) {
      const { newDirName, previousDirName } = action.payload;
      if (!state.directories.includes(newDirName)) {
        const index = state.directories.indexOf(previousDirName);
        if (index !== -1) {
          state.directories[index] = newDirName;
          // Aquí deberías actualizar el nombre del directorio en Firestore
        }
        state.tasks.forEach(task => {
          if (task.dir === previousDirName) {
            task.dir = newDirName;
            updateTask(task); // Actualiza en Firestore
          }
        });
      }
    },
  },
});

export const tasksActions = tasksSlice.actions;
export default tasksSlice.reducer;

// Middleware para manejar interacciones con Firestore si es necesario
export const tasksMiddleware = (store: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
  return next(action);
};
