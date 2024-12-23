import React from "react";
import useDescriptionTitle from "../hooks/useDescriptionTitle";
import useTodayTasks from "../hooks/useTodayTasks";
import LayoutRoutes from "../Utilities/LayoutRoutes";

const TodaysTasks: React.FC = () => {
  const todaysTasks = useTodayTasks();

  useDescriptionTitle("Las tareas de hoy", "Las tareas de hoy");

  return (
    <LayoutRoutes title="Las tareas de hoy" tasks={todaysTasks}></LayoutRoutes>
  );
};

export default TodaysTasks;
