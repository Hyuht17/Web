import React, { useState } from "react";
import SearchForm from "./SearchForm";
import AddUser from "./AddUser";
import ResultTable from "./ResultTable";
import "./App.css";

function App() {
  const [kw, setKeyword] = useState("");
  const [newUser, setNewUser] = useState(null);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Quản Lý Người Dùng</h1>
        <p className="subtitle">CRUD Application với JSONPlaceholder API</p>
      </header>
      
      <div className="app-content">
        <SearchForm onChangeValue={setKeyword} />
        <AddUser onAdd={setNewUser} />
        <ResultTable keyword={kw} user={newUser} onAdded={() => setNewUser(null)} />
      </div>
      
      <footer className="app-footer">
        <p>Sử dụng Fetch API với async/await | Pagination | Search | CRUD Operations</p>
      </footer>
    </div>
  );
}

export default App;
