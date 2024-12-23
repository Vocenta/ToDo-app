import React, { useEffect } from "react";
import AccountData from "./components/AccountSection/AccountData";
import Footer from "./components/Footer";
import Menu from "./components/Menu/Menu";
import TasksSection from "./components/TasksSection/TasksSection";
import ModalCreateTask from "./components/Utilities/ModalTask";
import { Task } from "./interfaces";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { modalActions } from "./store/Modal.store";
import { addTask, fetchDirectories, fetchTasks } from "./store/Tasks.store";
import RequireAuth from "./components/Utilities/RequireAuth";

const App: React.FC = () => {
  const modal = useAppSelector((state) => state.modal);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDirectories());
    dispatch(fetchTasks());
  }, [dispatch]);

  const closeModalCreateTask = () => {
    dispatch(modalActions.closeModalCreateTask());
  };

  const createNewTaskHandler = (task: Task) => {
    dispatch(addTask(task));
  };

  return (
    <RequireAuth>
      <div className="bg-slate-200 min-h-screen text-slate-600 dark:bg-slate-900 dark:text-slate-400 xl:text-base sm:text-sm text-xs">
        {modal.modalCreateTaskOpen && (
          <ModalCreateTask
            onClose={closeModalCreateTask}
            nameForm="Agregar una tarea"
            onConfirm={createNewTaskHandler}
          />
        )}
        <Menu />
        <TasksSection />
        <Footer />
        <AccountData />
      </div>
    </RequireAuth>
  );
};

export default App;
