import React from "react";
import { useAppDispatch } from "../../../store/hooks";
import { updateTask } from "../../../store/Tasks.store";
import { ReactComponent as StarLine } from "../../../assets/star-line.svg";
import { Task } from "../../../interfaces";

const BtnMarkAsImportant: React.FC<{
  task: Task;
}> = ({ task }) => {
  const dispatch = useAppDispatch();

  const markAsImportantHandler = () => {
    dispatch(updateTask({ ...task, important: !task.important }));
  };

  return (
    <button
      title={task.important ? "unmark as important" : "mark as important"}
      onClick={markAsImportantHandler}
      className="transition hover:text-slate-700 dark:hover:text-slate-200 ml-auto"
    >
      <StarLine
        className={`w-5 h-5 sm:w-6 sm:h-6 ${
          task.important ? "fill-rose-500 stroke-rose-500 " : "fill-none"
        }`}
      />
    </button>
  );
};

export default React.memo(BtnMarkAsImportant);
