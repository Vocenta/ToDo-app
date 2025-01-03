import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { menusActions } from "../../store/Menu.store";
import BtnAddTask from "../Utilities/BtnAddTask";
import Directories from "./Directories/Directories";
import NavLinks from "./NavLinks";
import LayoutMenus from "../Utilities/LayoutMenus";

const classLinkActive =
  "text-rose-600 bg-violet-100 border-r-4 border-rose-500 dark:bg-slate-700/[.2] dark:text-slate-200 dark:border-slate-200";

const Menu: React.FC = () => {
  const menuOpen = useAppSelector((state) => state.menu.menuHeaderOpened);
  const dispatch = useAppDispatch();

  const closeMenuHandler = () => {
    dispatch(menusActions.closeMenuHeader());
  };
  return (
    <LayoutMenus
      menuOpen={menuOpen}
      closeMenuHandler={closeMenuHandler}
      className="left-0"
    >
      <header className="h-full flex flex-col">
        <div className="ml-10  mt-8 text-lg tracking-wide hidden xl:block">
        <svg
  fill="#e3e3e3"
  height="132px"
  width="132px"
  version="1.1"
  id="Layer_1"
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 512 512"
  xmlSpace="preserve"
  stroke="#e3e3e3"
>
  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
  <g id="SVGRepo_iconCarrier">
    {" "}
    <g>
      {" "}
      <g>
        {" "}
        <path d="M409.55,70.347C374.452,24.326,321.356,0,256,0c-65.356,0-118.452,24.326-153.549,70.347 c-30.209,39.611-46.177,93.382-46.177,155.5c0,67.981,19.424,137.928,53.291,191.905C147.701,478.529,199.706,512,256,512 s108.3-33.471,146.434-94.248c33.868-53.977,53.291-123.923,53.291-191.905C455.726,163.729,439.758,109.958,409.55,70.347z M119.775,365.971l38.521,6.948l9.294,65.003C148.515,418.707,132.353,393.859,119.775,365.971z M239.304,381.505h-33.776v33.391 h33.776v62.386c-11.848-1.871-23.193-5.7-33.959-11.205L187.94,344.336l-82.026-14.795 c-10.513-33.336-16.248-69.084-16.248-103.693c0-47.361,10.765-90.154,30.551-122.404v49.54h33.391V65.389 c10.576-8.396,22.332-15.141,35.224-20.241v95.992l50.472,28.57V381.505z M239.304,131.34l-17.081-9.669V36.038 c5.535-0.912,11.232-1.583,17.081-2.022V131.34z M272.696,34.016c5.85,0.44,11.546,1.111,17.081,2.022v85.633l-17.081,9.669 V34.016z M344.411,437.921l9.294-65.003l38.521-6.949C379.647,393.859,363.485,418.707,344.411,437.921z M324.061,344.334 l-17.406,121.741c-10.766,5.505-22.112,9.335-33.96,11.206v-62.386h33.776v-33.391h-33.776V169.71l50.472-28.571V45.147 c12.892,5.1,24.648,11.846,35.224,20.241v87.596h33.391v-49.54c19.785,32.249,30.551,75.042,30.551,122.403 c0,34.609-5.736,70.359-16.248,103.693L324.061,344.334z" />{" "}
      </g>{" "}
    </g>{" "}
    <g>
      {" "}
      <g>
        {" "}
        <path d="M343.335,203.788c-29.668,0-53.806,24.137-53.806,53.806c0,29.669,24.138,53.807,53.806,53.807 c29.669,0,53.807-24.137,53.807-53.807C397.142,227.926,373.004,203.788,343.335,203.788z M343.335,278.009 c-11.256,0-20.414-9.158-20.414-20.415c0-11.256,9.158-20.414,20.414-20.414s20.415,9.158,20.415,20.414 C363.75,268.851,354.591,278.009,343.335,278.009z" />{" "}
      </g>{" "}
    </g>{" "}
    <g>
      {" "}
      <g>
        {" "}
        <circle cx="343.329" cy="257.592" r="13.866" />{" "}
      </g>{" "}
    </g>{" "}
    <g>
      {" "}
      <g>
        {" "}
        <path d="M168.665,203.788c-29.668,0-53.806,24.138-53.806,53.806c0,29.669,24.137,53.807,53.806,53.807 c29.669,0,53.807-24.138,53.807-53.807C222.472,227.926,198.334,203.788,168.665,203.788z M168.665,278.009 c-11.256,0-20.414-9.158-20.414-20.415c0-11.256,9.158-20.414,20.414-20.414c11.257,0,20.415,9.158,20.415,20.414 C189.08,268.851,179.922,278.009,168.665,278.009z" />{" "}
      </g>{" "}
    </g>{" "}
    <g>
      {" "}
      <g>
        {" "}
        <circle cx="168.659" cy="257.592" r="13.866" />{" "}
      </g>{" "}
    </g>{" "}
  </g>
</svg>

        </div>
        <BtnAddTask className="my-8 mx-4" />
        <NavLinks classActive={classLinkActive} />
        <Directories classActive={classLinkActive} />
      </header>
    </LayoutMenus>
  );
};

export default Menu;
