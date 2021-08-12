import React from "react";
import { HashRouter, Route } from "react-router-dom";

import classes from "./App.module.css";
import { ResizeIcon } from "./components/common/Icon";
import { Header } from "./components/Header/Header";
import { MainPage } from "./pages/MainPage";
import { SettingsPage } from "./pages/SettingsPage";

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Route component={Header} />
      <Route exact path="/" component={MainPage} />
      <Route path="/settings" component={SettingsPage} />
      <span className={classes["resize-handler"]}>{ResizeIcon}</span>
    </HashRouter>
  );
};
