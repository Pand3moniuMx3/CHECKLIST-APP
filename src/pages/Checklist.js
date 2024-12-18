import { useState, useEffect } from "react";
import "../styles/Checklist.css";
import "../styles/Navbar.css";
import "../styles/List.css";
import "../styles/Item.css";
import "../styles/Settings.css";

export default function Checklist({
  fullScreen,
  checklist,
  updateChecklist,
  onDeleteList,
}) {
  // new array from submissions
  const [title, setTitle] = useState(checklist.title);
  const [items, setItems] = useState(checklist.items);
  const [completion, setCompletion] = useState(checklist.completion);

  useEffect(() => {
    updateChecklist({ ...checklist, title, items, completion });
  }, [title, items, completion]);

  // addings items
  function handleAddItems(item) {
    setItems((prevItems) => [...prevItems, item]);
  }

  // deleting items
  function handleDeleteItems(id) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }

  // toggling items
  function handleToggleItem(id) {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  // clearing list
  function handleClearList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );

    if (confirmed) setItems([]);
  }

  // sorting items
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;
  if (sortBy === "input") sortedItems = items;
  if (sortBy === "quantity")
    sortedItems = items
      .slice()
      .sort((a, b) => a.productQuantity - b.productQuantity);
  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  if (sortBy === "newest") sortedItems = items.slice().reverse();

  // changing checkbox behavior
  const [checkboxBehavior, setCheckboxBehavior] = useState("keep");
  if (checkboxBehavior === "keep") sortedItems = items;
  if (checkboxBehavior === "delete")
    sortedItems = items.slice().filter((item) => item.packed !== true);

  // displaying messages related to array length
  const arrayLength = items.length;

  // counting packed items
  const packedItems = items.filter((item) => item.packed).length;

  // setting completion
  useEffect(() => {
    if (packedItems > 0 && packedItems === arrayLength) {
      setCompletion(true);
    } else {
      setCompletion(false);
    }
  }, [packedItems, arrayLength]);

  return (
    <section className="app-section">
      <Navbar
        onAddItems={handleAddItems}
        arrayLength={arrayLength}
        packedItems={packedItems}
        onSort={setSortBy}
        checkboxSettings={setCheckboxBehavior}
        onClearList={handleClearList}
        fullScreen={fullScreen}
        onDeleteList={onDeleteList}
        listId={checklist.id}
      />
      <List
        onDeleteItems={handleDeleteItems}
        arrayLength={arrayLength}
        onToggleItem={handleToggleItem}
        sortedItems={sortedItems}
        title={title}
        setTitle={setTitle}
      />
    </section>
  );
}

function Navbar({
  onAddItems,
  arrayLength,
  packedItems,
  onSort,
  checkboxSettings,
  onClearList,
  fullScreen,
  onDeleteList,
  listId,
}) {
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!productName) return alert("Enter item data");

    const newListItem = {
      productName,
      productQuantity,
      id: Date.now(),
      packed: false,
    };

    onAddItems(newListItem);

    setProductName("");
    setProductQuantity(1);
  }

  function selectInputValue(e) {
    e.target.select();
  }

  return (
    <div className="navbar">
      <Settings
        arrayLength={arrayLength}
        packedItems={packedItems}
        onSort={onSort}
        checkboxSettings={checkboxSettings}
        onClearList={onClearList}
        fullScreen={fullScreen}
        onDeleteList={onDeleteList}
        listId={listId}
      />
      <form className="data-entry" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="new item"
          className="btn secondary"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          onFocus={selectInputValue}
        />
        <input
          type="number"
          min="1"
          value={productQuantity}
          className="btn secondary"
          onChange={(e) => setProductQuantity(Number(e.target.value))}
          style={{ textAlign: "center" }}
        />
        <button type="submit" className="btn">
          +
        </button>
      </form>
    </div>
  );
}

function Settings({
  arrayLength,
  packedItems,
  onSort,
  checkboxSettings,
  onClearList,
  fullScreen,
  onDeleteList,
  listId,
}) {
  const settingsArray = [
    {
      title: "Sort items",
      id: 1,
      options: [
        {
          name: "Sort by input order",
          value: "input",
        },
        {
          name: "Sort by newest",
          value: "newest",
        },
        {
          name: "Sort by packed status",
          value: "packed",
        },
        {
          name: "Sort by quantity",
          value: "quantity",
        },
      ],
    },
    {
      title: "Checkbox behavior",
      id: 2,
      options: [
        {
          name: "Keep checked items",
          value: "keep",
        },
        {
          name: "Delete checked items",
          value: "delete",
        },
      ],
    },
  ];

  // open and close settings tab
  const [settingsOpen, isSettingsOpen] = useState(false);
  const handleSettingsOpening = () => {
    isSettingsOpen(!settingsOpen);
  };

  // open and close dropdowns
  const [openDropdown, setOpenDropdown] = useState(null);
  const handleDropdownOpening = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <>
      {fullScreen ? (
        <div className="settings-btn" onClick={handleSettingsOpening}></div>
      ) : (
        <div className="settings">
          <img
            src="/icons/clear-icon.png"
            alt="clear list"
            onClick={() => onClearList()}
          />
          {packedItems >= 1 ? (
            <p
              style={{
                color: packedItems === arrayLength && "var(--clr-theme)",
              }}
            >
              {packedItems} / {arrayLength}
            </p>
          ) : (
            <p>0 / {arrayLength}</p>
          )}
          <img
            src="/icons/settings-icon.png"
            alt="settings"
            onClick={handleSettingsOpening}
          />
        </div>
      )}
      <div className={`settings-tab ${settingsOpen ? "" : "closed"}`}>
        <div className="top-info">
          <h3>Settings</h3>
          <img
            src="/icons/close-icon.svg"
            onClick={handleSettingsOpening}
            alt="close settings"
          />
        </div>
        {settingsArray.map((setting) => (
          <div
            className={`dropdown ${
              openDropdown === setting.id ? "" : "closed"
            }`}
          >
            <div className="title">
              <p onClick={() => handleDropdownOpening(setting.id)}>
                {setting.title}
              </p>
              {setting.options.length >= 2 && (
                <img
                  src="/icons/Chevron.svg"
                  alt="extend options"
                  onClick={() => handleDropdownOpening(setting.id)}
                />
              )}
            </div>
            <div className="options">
              {setting.options.map((option) => (
                <p
                  onClick={() => {
                    onSort(option.value);
                    checkboxSettings(option.value);
                  }}
                >
                  {option.name}
                </p>
              ))}
            </div>
          </div>
        ))}
        <p onClick={() => onClearList()} className="dropdown">
          Clear
        </p>
        <a href="/" className="dropdown" onClick={() => onDeleteList(listId)}>
          Delete list
        </a>
      </div>
    </>
  );
}

function List({
  arrayLength,
  onDeleteItems,
  onToggleItem,
  sortedItems,
  title,
  setTitle,
}) {
  return (
    <div className="list-container">
      <form className="title-form">
        <input
          type="text"
          className="checklist-title"
          placeholder="name your list..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <a href="/">
          <img src="/icons/home-icon.svg" alt="close list" />
        </a>
      </form>
      {arrayLength >= 1 ? (
        <div className="list">
          {sortedItems.map((item) => (
            <Item
              id={item.id}
              product={item.productName}
              quantity={item.productQuantity}
              packed={item.packed}
              onDeleteItems={onDeleteItems}
              onToggleItem={onToggleItem}
            />
          ))}
        </div>
      ) : (
        <h3>Add more items to your list</h3>
      )}
    </div>
  );
}

function Item({ id, product, quantity, packed, onDeleteItems, onToggleItem }) {
  const textTemplate = quantity > 1 ? `${product} (${quantity})` : `${product}`;

  return (
    <div className="item" key={id}>
      <input
        type="checkbox"
        className="checkbox"
        value={packed}
        onChange={() => onToggleItem(id)}
        checked={packed}
      />
      {packed ? (
        <s className="text">{textTemplate}</s>
      ) : (
        <p className="text">{textTemplate}</p>
      )}
      <img
        src="/icons/close-icon.svg"
        className="close-btn"
        alt="delete item"
        onClick={() => onDeleteItems(id)}
      />
    </div>
  );
}
