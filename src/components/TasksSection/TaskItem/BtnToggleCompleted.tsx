import React from "react";
import { useAppDispatch } from "../../../store/hooks";
import { updateTask } from "../../../store/Tasks.store";
import { ReactComponent as SvgX } from "../../../assets/x.svg";
import { ReactComponent as Check } from "../../../assets/check.svg";
import { Task } from "../../../interfaces";

const BtnToggleCompleted: React.FC<{
  task: Task;
  isListInView1: boolean;
}> = ({ task, isListInView1 }) => {
  const dispatch = useAppDispatch();

  const toggleTaskCompleted = (task: Task) => {
    dispatch(updateTask({ ...task, completed: !task.completed }));
  };

  return (
    <button
      title={task.completed ? "mark as uncompleted" : "mark as completed"}
      className={`${
        task.completed
          ? "bg-emerald-200 text-emerald-800 "
          : "bg-amber-200 text-amber-800 "
      } ${isListInView1 ? "mr-4" : "mr-4 order-0"} rounded-full font-medium`}
      onClick={() => toggleTaskCompleted(task)}
    >
      <span className="block py-1 px-3 absolute invisible sm:static sm:visible">
        {task.completed ? "completed" : "uncompleted"}
      </span>
      <span className=" sm:hidden w-6 h-6 grid place-items-center">
        {task.completed ? (
          <Check className="w-3 h-3" />
        ) : (
          <SvgX className="w-3 h-3" />
        )}
      </span>
    </button>
  );
};

export default React.memo(BtnToggleCompleted);
