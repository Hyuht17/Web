import React, { useState } from "react";
import SearchForm from "./SearchForm";
import AddUser from "./AddUser";
import ResultTable from "./ResultTable";

function App() {
  const [kw, setKeyword] = useState("");
  const [newUser, setNewUser] = useState(null);

  return (
    <div className="app-container ">
      <h1>Quản lý người dùng</h1>
      <SearchForm onChangeValue={setKeyword} />
      <AddUser onAdd={setNewUser} />
      <ResultTable keyword={kw} user={newUser} onAdded={() => setNewUser(null)} />
    </div>
  );
}

export default App;
