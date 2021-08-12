import React from "react";
import { HashRouter, Route } from "react-router-dom";

import { Header } from "./components/Header/Header";
import { MainPage } from "./pages/MainPage";

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Header />
      <Route path="/" component={MainPage} />
    </HashRouter>
  );
};
