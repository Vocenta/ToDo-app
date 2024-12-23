import { createSlice, Dispatch, MiddlewareAPI, Action, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../interfaces";
import { db, auth } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc } from "firebase/firestore";

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

// Función para obtener el id_corp (debe ser implementada según la lógica de la aplicación)
const getIdCorp = (): string => {
  // Aquí se debe implementar la lógica para obtener el id_corp
  return "example_id_corp"; // Reemplazar con la lógica real
};

// Thunks para manejar operaciones asíncronas con Firestore
export const fetchTasks = () => async (dispatch: Dispatch) => {
  const id_corp = getIdCorp();
  const q = query(tasksCollection, where("id_corp", "==", id_corp));
  const taskSnapshot = await getDocs(q);
  const tasksList: Task[] = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
  dispatch(tasksSlice.actions.setTasks(tasksList));
};

export const fetchDirectories = () => async (dispatch: Dispatch) => {
  const id_corp = getIdCorp();
  const q = query(directoriesCollection, where("id_corp", "==", id_corp));
  const dirSnapshot = await getDocs(q);
  const directoriesList: string[] = dirSnapshot.docs.map(doc => doc.data().name as string);
  dispatch(tasksSlice.actions.setDirectories(directoriesList));
};

export const addTask = (task: Task) => async (dispatch: Dispatch) => {
  const id_corp = getIdCorp();
  const id_owner = auth.currentUser?.uid || "unknown_owner";
  const docRef = await addDoc(tasksCollection, { ...task, id_corp, id_owner });
  dispatch(tasksSlice.actions.addNewTask({ ...task, id: docRef.id }));
};

export const updateTask = (task: Task) => async (dispatch: Dispatch) => {
  const taskDocRef = doc(db, "tasks", task.id); // Usar el id del documento de Firestore
  const taskDoc = await getDoc(taskDocRef);

  if (taskDoc.exists()) {
    const { id, ...data } = task; // Excluir 'id' antes de actualizar
    await updateDoc(taskDocRef, { ...data, id_corp: getIdCorp() });
    dispatch(tasksSlice.actions.editTask(task));
  } else {
    console.error("No document to update:", task.id);
  }
};

export const removeTask = (id: string) => async (dispatch: Dispatch) => {
  const taskDoc = doc(db, "tasks", id);
  await deleteDoc(taskDoc);
  dispatch(tasksSlice.actions.removeTask(id));
};

export const addDirectory = (dirName: string) => async (dispatch: Dispatch) => {
  const id_corp = getIdCorp();
  const docRef = await addDoc(directoriesCollection, { name: dirName, id_corp });
  dispatch(tasksSlice.actions.createDirectory(dirName));
};

export const deleteDirectory = (dirName: string) => async (dispatch: Dispatch) => {
  const id_corp = getIdCorp();
  const q = query(directoriesCollection, where("name", "==", dirName), where("id_corp", "==", id_corp));
  const dirSnapshot = await getDocs(q);
  const dirDoc = dirSnapshot.docs[0];
  if (dirDoc) {
    await deleteDoc(doc(db, "directories", dirDoc.id));
    dispatch(tasksSlice.actions.deleteDirectory(dirName));
  }
};

export const editDirectoryName = (newDirName: string, previousDirName: string) => async (dispatch: Dispatch) => {
  const id_corp = getIdCorp();
  const q = query(directoriesCollection, where("name", "==", previousDirName), where("id_corp", "==", id_corp));
  const dirSnapshot = await getDocs(q);
  const dirDoc = dirSnapshot.docs[0];
  if (dirDoc) {
    await updateDoc(doc(db, "directories", dirDoc.id), { name: newDirName });
    dispatch(tasksSlice.actions.editDirectoryName({ newDirName, previousDirName }));
  }
};

export const createDirectory = (dirName: string) => async (dispatch: Dispatch) => {
  const id_corp = getIdCorp();
  const q = query(directoriesCollection, where("name", "==", dirName), where("id_corp", "==", id_corp));
  const directoryDoesNotExist = (await getDocs(q)).empty;

  if (directoryDoesNotExist) {
    await addDirectory(dirName)(dispatch);
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
      }
    },
    deleteDirectory(state, action: PayloadAction<string>) {
      const dirName = action.payload;
      state.directories = state.directories.filter(dir => dir !== dirName);
      state.tasks = state.tasks.filter(task => task.dir !== dirName);
    },
    editDirectoryName(state, action: PayloadAction<{ newDirName: string; previousDirName: string }>) {
      const { newDirName, previousDirName } = action.payload;
      const index = state.directories.indexOf(previousDirName);
      if (index !== -1) {
        state.directories[index] = newDirName;
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
