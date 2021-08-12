import React from "react";
import { HashRouter, Route } from "react-router-dom";

import classes from "./App.module.css";
import { ResizeIcon } from "./components/common/Icon";
import { Header } from "./components/Header/Header";
import { MainPage } from "./pages/MainPage";

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Header />
      <Route path="/" component={MainPage} />
      <span className={classes["resize-handler"]}>{ResizeIcon}</span>
    </HashRouter>
  );
};
