import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [show, setShow] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFreinds] = useState(initialFriends);
  // functions
  function handleAddfriendform(friend) {
    setFreinds((friends) => [...friends, friend]);
    setShow(false);
  }

  function handleShowAddfriend() {
    setShow((show) => !show);
  }

  function Selection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShow(false);
  }
  function splitBill(value) {
    setFreinds((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={Selection}
          selectedFriend={selectedFriend}
        />
        {show && <Addfriends onAddfriends={handleAddfriendform} />}
        <Button onClick={handleShowAddfriend}>
          {show ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <Splitinputs selectedFriend={selectedFriend} onSplitBill={splitBill} />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friends) => (
        <List
          friends={friends}
          key={friends.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function List({ friends, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friends.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friends.image} alt="friendPic" />
      <h3>{friends.name}</h3>
      {friends.balance < 0 && (
        <p className="red">
          you owe {friends.name} {Math.abs(friends.balance)}$
        </p>
      )}
      {friends.balance > 0 && (
        <p className="green">
          {friends.name} owes you {Math.abs(friends.balance)}$
        </p>
      )}
      {friends.balance === 0 && (
        <p className="grey">{friends.name} and you are even</p>
      )}
      <Button onClick={() => onSelection(friends)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function Addfriends({ onAddfriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddfriends(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼️ Image Url</label>
      <input
        type="text"
        placeholder="Img Url"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function Splitinputs({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paiedByUser, setPaiedByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paiedByFriend = bill ? bill - paiedByUser : "";
  function handleBill(e) {
    setBill(Number(e.target.value));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paiedByUser) return;
    onSplitBill(whoIsPaying === "user" ? paiedByFriend : -paiedByUser);

    // setBill("");
    // setPaiedByUser("");
    // setWhoIsPaying("user");
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split bill with {selectedFriend.name}</h2>
      <label>💰Bill value</label>
      <input onChange={handleBill} value={bill} type="text" />
      <label>🧍‍♀️your expense</label>
      <input
        type="text"
        value={paiedByUser}
        onChange={(e) =>
          setPaiedByUser(
            Number(e.target.value) > bill ? paiedByUser : Number(e.target.value)
          )
        }
      />
      <label>🧑🏻‍🤝‍🧑🏾{selectedFriend.name} expense</label>
      <input type="text" disabled value={paiedByFriend} />
      <label>🤑 who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button> Split Bill</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
