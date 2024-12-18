import React, { useState } from "react";
import "../styles/Repo.css";
import "../styles/Menu.css";
import "../styles/RepoList.css";
import "../styles/RepoItem.css";

export default function Repo({
  fullScreen,
  listArray,
  onClearRepo,
  onAddList,
  onSortLists,
}) {
  const [settingsTabState, setSettingsTabState] = useState(false);

  function handleOpeningSettingsTab() {
    setSettingsTabState(!settingsTabState);
  }

  return (
    <section className="repo">
      <Menu
        fullScreen={fullScreen}
        onSettingsTabOpen={handleOpeningSettingsTab}
        onAddList={onAddList}
      />
      <RepoList listArray={listArray} />
      <RepoSettings
        onClearRepo={onClearRepo}
        settingsTabState={settingsTabState}
        onSettingsTabOpen={handleOpeningSettingsTab}
        onSortLists={onSortLists}
      />
    </section>
  );
}

function Menu({ fullScreen, onSettingsTabOpen, onAddList }) {
  return (
    <div className="menu-component">
      <div className="container">
        <div className="settings-btn" onClick={onSettingsTabOpen}></div>
        <h2>My lists</h2>
        <p className="btn add-checklist" onClick={onAddList}>
          {fullScreen ? `+` : `Add new list`}
        </p>
      </div>
    </div>
  );
}

function RepoSettings({
  onClearRepo,
  settingsTabState,
  onSettingsTabOpen,
  onSortLists,
}) {
  const repoSettingsArray = [
    {
      title: "Sort items",
      id: 1,
      options: [
        {
          name: "Sort by input order",
          value: "input",
        },
        {
          name: "Sort by completion",
          value: "completion",
        },
        {
          name: "Sort by items",
          value: "items",
        },
      ],
    },
  ];

  const [dropdownState, setDropdownState] = useState(false);
  function handleDropdownState() {
    setDropdownState(!dropdownState);
  }

  return (
    <div className={`settings-tab ${settingsTabState ? "" : "closed"}`}>
      <div className="top-info">
        <h3>Settings</h3>
        <img
          src="/icons/close-icon.svg"
          alt="close settings"
          onClick={onSettingsTabOpen}
        />
      </div>
      {repoSettingsArray.map((setting) => (
        <div className={`dropdown ${dropdownState ? "closed" : ""}`}>
          <div className="title">
            <p onClick={handleDropdownState}>{setting.title}</p>
            {setting.options.length >= 2 && (
              <img
                src="/icons/Chevron.svg"
                alt="extend options"
                onClick={handleDropdownState}
              />
            )}
          </div>
          <div className="options">
            {setting.options.map((option) => (
              <p onClick={() => onSortLists(option.value)}>{option.name}</p>
            ))}
          </div>
        </div>
      ))}
      <p className="dropdown" onClick={onClearRepo}>
        Clear
      </p>
    </div>
  );
}

function RepoList({ listArray }) {
  return (
    <>
      <div className="repo-list">
        {listArray.map((list) => (
          <RepoItem list={list} key={list.id} />
        ))}
      </div>
    </>
  );
}

function RepoItem({ list }) {
  return (
    <a
      className={`repo-item ${list.completion ? "completed" : ""}`}
      key={list.id}
      href={`/${list.id}`}
    >
      <b className="title">{list.title}</b>
      <p className="items">{list.items.length} Items</p>
      <img src="/icons/arrow-icon.svg" alt="open list" />
    </a>
  );
}
