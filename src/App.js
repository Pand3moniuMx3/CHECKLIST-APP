import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Checklist from "./pages/Checklist";
import Repo from "./pages/Repo";

function App() {
  // reading the screen width all the time
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const fullScreen = windowWidth > 600;

  // creating new array of lists and saving it to local storage
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem("list-array");
    return savedLists ? JSON.parse(savedLists) : [];
  });
  useEffect(() => {
    localStorage.setItem("list-array", JSON.stringify(lists));
  }, [lists]);

  // adding new list

  function handleAddList() {
    const generateRandomId = () => Math.floor(100000 + Math.random() * 900000);

    const newChecklist = {
      items: [],
      title: "Untitled",
      completion: false,
      id: generateRandomId(),
    };

    setLists([...lists, newChecklist]);
  }

  // deleting a list
  function handleDeleteList(id) {
    const sure = window.confirm(
      "Are you sure you want to delete the list? This action cannot be undone"
    );

    if (sure) setLists((lists) => lists.filter((list) => list.id !== id));
  }

  // clear all checklists
  function handleClearRepo() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );

    if (confirmed) setLists([]);
  }

  // update checklist title or items
  function updateChecklist(updatedChecklist) {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === updatedChecklist.id ? updatedChecklist : list
      )
    );
  }

  // sorting lists
  const [sortListsBy, setSortListsBy] = useState("input");
  let sortedLists;
  if (sortListsBy === "input") {
    sortedLists = [...lists];
  } else if (sortListsBy === "completion") {
    sortedLists = [...lists].sort(
      (a, b) => Number(a.completion) - Number(b.completion)
    );
  } else if (sortListsBy === "items") {
    sortedLists = [...lists].sort((a, b) => a.items.length - b.items.length);
  }

  return (
    <>
      <Router>
        <Routes>
          {/* Repo page */}
          <Route
            path="/"
            index
            element={
              <Repo
                fullScreen={fullScreen}
                listArray={sortedLists}
                onClearRepo={handleClearRepo}
                onAddList={handleAddList}
                onSortLists={setSortListsBy}
              />
            }
          />
          {/* Checklist pages */}
          {sortedLists.map((list) => (
            <Route
              path={`/${list.id}`}
              key={list.id}
              element={
                <Checklist
                  fullScreen={fullScreen}
                  checklist={lists}
                  updateChecklist={updateChecklist}
                  onDeleteList={handleDeleteList}
                />
              }
            />
          ))}
        </Routes>
      </Router>
    </>
  );
}

export default App;
