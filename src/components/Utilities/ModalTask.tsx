import React, { useRef, useState } from "react";
import { Task } from "../../interfaces";
import { useAppSelector } from "../../store/hooks";
import Modal from "./Modal";

const InputCheckbox: React.FC<{
  label: string;
  isChecked: boolean;
  setChecked: (value: React.SetStateAction<boolean>) => void;
}> = ({ isChecked, setChecked, label }) => {
  return (
    <label className="mb-0 flex items-center cursor-pointer">
      <div className="mr-2 bg-slate-300/[.5] dark:bg-slate-800 w-5 h-5 rounded-full grid place-items-center border border-slate-300 dark:border-slate-700">
        {isChecked && (
          <span className="bg-rose-500 w-2 h-2 block rounded-full"></span>
        )}
      </div>
      <span className="order-1 flex-1">{label}</span>
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        onChange={() => setChecked((prev: boolean) => !prev)}
      />
    </label>
  );
};

const ModalCreateTask: React.FC<{
  onClose: () => void;
  task?: Task;
  nameForm: string;
  onConfirm: (task: Task) => void;
}> = ({ onClose, task, nameForm, onConfirm }) => {
  const directories = useAppSelector((state) => state.tasks.directories);

  const today: Date = new Date();
  let day: number = today.getDate();
  let month: number = today.getMonth() + 1;
  const year: number = today.getFullYear();
  if (day < 10) {
    day = +("0" + day);
  }
  if (month < 10) {
    month = +("0" + month);
  }

  const todayDate: string = year + "-" + month + "-" + day;
  const maxDate: string = year + 1 + "-" + month + "-" + day;

  const [description, setDescription] = useState<string>(() => {
    if (task) {
      return task.description;
    }
    return "";
  });
  const [title, setTitle] = useState<string>(() => {
    if (task) {
      return task.title;
    }
    return "";
  });
  const [date, setDate] = useState<string>(() => {
    if (task) {
      return task.date;
    }
    return todayDate;
  });
  const isTitleValid = useRef<Boolean>(false);
  const isDateValid = useRef<Boolean>(false);

  const [isImportant, setIsImportant] = useState<boolean>(() => {
    if (task) {
      return task.important;
    }
    return false;
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    if (task) {
      return task.completed;
    }
    return false;
  });

  const [selectedDirectory, setSelectedDirectory] = useState<string>(() => {
    if (task) {
      return task.dir;
    }
    return directories[0];
  });

  const [subTasks, setSubTasks] = useState<string[]>([]);

  const addNewTaskHandler = (event: React.FormEvent): void => {
    event.preventDefault();

    isTitleValid.current = title.trim().length > 0;
    isDateValid.current = date.trim().length > 0;

    if (isTitleValid.current && isDateValid.current) {
      const newTask: Task = {
        title: title,
        dir: selectedDirectory,
        description: description,
        date: date,
        completed: isCompleted,
        important: isImportant,
        id: task?.id || Date.now().toString(), // Asegurar que el id no se modifique si ya existe
      };
      onConfirm(newTask);
      onClose();
    }
  };

  const generateSubtasks = () => {
    // Lógica para generar subtareas usando GPT
    const generatedSubTasks = [
      "Subtarea 1: Analizar requisitos",
      "Subtarea 2: Diseñar solución",
      "Subtarea 3: Implementar código",
    ];
    setSubTasks(generatedSubTasks);
  };

  return (
    <Modal onClose={onClose} title={nameForm}>
      <form
        className="flex flex-col stylesInputsField"
        onSubmit={addNewTaskHandler}
      >
        <label>
          Título
          <input
            type="text"
            placeholder="e.g, study for the test"
            required
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            className="w-full"
          />
        </label>
        <label>
          Fecha
          <input
            type="date"
            className="w-full"
            value={date}
            required
            onChange={({ target }) => setDate(target.value)}
            min={todayDate}
            max={maxDate}
          />
        </label>
        <label>
          Descripción (opcional)
          <textarea
            placeholder="e.g, study for the test"
            className="w-full"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          ></textarea>
        </label>
        <a href="#" onClick={generateSubtasks} className="text-blue-500 mt-2">
          Generar subtareas
        </a>
        <div className="sub-tasks-container mt-2">
          {subTasks.map((subTask, index) => (
            <div
              key={index}
              id="sub-task-item"
              className="mt-5 flex items-center justify-between p-2 sub-task-item"
            >
              <div className="flex items-center justify-center gap-2">
                <input
                  type="checkbox"
                  className="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center 
                              justify-center rounded-md border border-gray-300 text-white/0 outline-none transition duration-[0.2s]
                              checked:border-none checked:text-white hover:cursor-pointer dark:border-white/10 checked:bg-brand-500 dark:checked:bg-brand-400"
                  name="weekly"
                />
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  {subTask}
                </p>
              </div>
              <span className="material-symbols-rounded h-6 w-6 text-navy-700 dark:text-white cursor-pointer">
                o
              </span>
            </div>
          ))}
        </div>
        <label>
          Seleccione un directorio
          <select
            className="block w-full"
            value={selectedDirectory}
            onChange={({ target }) => setSelectedDirectory(target.value)}
          >
            {directories.map((dir: string) => (
              <option
                key={dir}
                value={dir}
                className="bg-slate-100 dark:bg-slate-800"
              >
                {dir}
              </option>
            ))}
          </select>
        </label>
        <InputCheckbox
          isChecked={isImportant}
          setChecked={setIsImportant}
          label="Marcar como importante"
        />
        <InputCheckbox
          isChecked={isCompleted}
          setChecked={setIsCompleted}
          label="Marcar como completado"
        />
        <button type="submit" className="btn mt-5">
          {nameForm}
        </button>
      </form>
    </Modal>
  );
};

export default ModalCreateTask;
