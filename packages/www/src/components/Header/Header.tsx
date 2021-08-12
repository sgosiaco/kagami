import classNames from "classnames";
import React, { useState } from "react";

import {
  MenuIcon,
  PushPinIcon,
  SettingsIcon,
  TimerOffIcon,
} from "../common/Icon";
import classes from "./Header.module.css";

export const Header: React.FC = () => {
  const [isHeaderPinned, setHeaderPinned] = useState(true);

  const duration = "00:00";
  const title = "kagami";
  const info = "mirror your moves, better you move.";
  const isInSettings = false;

  return (
    <header
      className={classNames(
        classes.wrap,
        !isHeaderPinned && classes["not-pinned"],
      )}
    >
      <div className={classes.duration}>{duration}</div>
      <div className={classes["content-wrap"]}>
        <div className={classes["title"]}>{title}</div>
        <div className={classes["info"]}>{info}</div>
      </div>
      <div className={classes["menu-wrap"]}>
        <button
          className={classNames({
            "icon-button": true,
            [classes["button-toggle"]]: true,
          })}
        >
          {MenuIcon}
        </button>
        <nav className={classes["menu-item-wrap"]}>
          <span>
            <button
              className={classNames({
                "icon-button": true,
                checked: isHeaderPinned,
              })}
              onClick={() => {
                setHeaderPinned((s) => !s);
              }}
            >
              {PushPinIcon}
            </button>
            <div className={classes["menu-tooltip"]}>Always show header</div>
          </span>
          <span>
            <button className={classNames("icon-button")}>
              {TimerOffIcon}
            </button>
            <div className={classes["menu-tooltip"]}>Reset encounter</div>
          </span>
          <span>
            <button
              className={classNames("icon-button", isInSettings && "checked")}
            >
              {SettingsIcon}
            </button>
            <div className={classes["menu-tooltip"]}>Settings</div>
          </span>
        </nav>
      </div>
      <div className={classes["hover-area"]}></div>
    </header>
  );
};
