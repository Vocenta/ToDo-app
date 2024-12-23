import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { menusActions } from "../../store/Menu.store";
import LayoutMenus from "../Utilities/LayoutMenus";
import DarkMode from "./DarkMode";
import DeleteTasks from "./DeleteTasks";
import TasksDone from "./TasksDone";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signOutUser } from "../../firebase";

const AccountData: React.FC = () => {
  const menuOpen = useAppSelector((state) => state.menu.menuAccountOpened);
  const [user] = useAuthState(auth);

  const dispatch = useAppDispatch();

  const closeMenuHandler = () => {
    dispatch(menusActions.closeMenuAccount());
  };

  return (
    <LayoutMenus
      menuOpen={menuOpen}
      closeMenuHandler={closeMenuHandler}
      className="top-0 right-0 "
    >
      <section className="p-5 flex flex-col h-full">
        <span className="flex items-center mx-auto">
          <span className="font-medium">
            {user ? `Hi, ${user.displayName}!` : "Hi, User!"}
          </span>
          <img
            src={user?.photoURL || "default-avatar-url"}
            alt="User Avatar"
            className="w-10 rounded-full ml-4"
          />
        </span>

        {user && (
          <button
            onClick={signOutUser}
            className="mt-2 bg-red-500 text-white p-2 rounded-md"
          >
            Cerrar sesión
          </button>
        )}

        <DarkMode />

        <TasksDone />
        <DeleteTasks />
        <a
          href="https://github.com/x1-il"
          className="mt-4 bg-rose-100 p-2 rounded-md text-rose-600 text-center transition hover:bg-rose-200 dark:bg-slate-700/[.3] dark:text-slate-200"
        >
          Projected by Ibrahim Laklaa
        </a>
      </section>
    </LayoutMenus>
  );
};

export default AccountData;
