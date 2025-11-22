import React, { useEffect, useState } from "react";

function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  // Fetch users with async/await
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(`Lỗi khi tải dữ liệu: ${err.message}`);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (user) {
      addUserToAPI(user);
    }
  }, [user]);

  const addUserToAPI = async (newUser) => {
    try {
      setLoading(true);
      const response = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const userWithId = { ...newUser, id: users.length + 1 };
      setUsers((prev) => [...prev, userWithId]);
      
      onAdded();
      alert("Thêm người dùng thành công!");
    } catch (err) {
      setError(`Lỗi khi thêm người dùng: ${err.message}`);
      alert(`Lỗi: ${err.message}`);
      console.error("Add user error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("Xóa người dùng thành công!");
    } catch (err) {
      setError(`Lỗi khi xóa người dùng: ${err.message}`);
      alert(`Lỗi: ${err.message}`);
      console.error("Delete user error:", err);
    } finally {
      setLoading(false);
    }
  };

  const editUser = (u) => {
    setEditing({ ...u, address: { ...u.address } });
  };

  const handleEditChange = (key, value) => {
    if (["street", "suite", "city"].includes(key)) {
      setEditing({ ...editing, address: { ...editing.address, [key]: value } });
    } else {
      setEditing({ ...editing, [key]: value });
    }
  };

  const saveUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${editing.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editing),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setUsers((prev) => prev.map((u) => (u.id === editing.id ? editing : u)));
      setEditing(null);
      alert("Cập nhật người dùng thành công!");
    } catch (err) {
      setError(`Lỗi khi cập nhật người dùng: ${err.message}`);
      alert(`Lỗi: ${err.message}`);
      console.error("Update user error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.username.toLowerCase().includes(keyword.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: "10px", color: "#666" }}>
        Hiển thị {currentUsers.length} / {filteredUsers.length} người dùng
        {keyword && ` (Tìm kiếm: "${keyword}")`}
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                Không tìm thấy người dùng nào
              </td>
            </tr>
          ) : (
            currentUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.address?.city || "N/A"}</td>
                <td>
                  <button className="btn-edit" onClick={() => editUser(u)}>
                    Sửa
                  </button>
                  <button className="btn-delete" onClick={() => removeUser(u.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {filteredUsers.length > usersPerPage && (
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            ← Trước
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={currentPage === number ? "active" : ""}
              >
                {number}
              </button>
            ))}
          </div>
          
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Sau →
          </button>
        </div>
      )}

      {editing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Sửa người dùng</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                value={editing.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                placeholder="Nhập tên"
              />
            </div>
            <div className="form-group">
              <label>Username:</label>
              <input
                value={editing.username}
                onChange={(e) => handleEditChange("username", e.target.value)}
                placeholder="Nhập username"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={editing.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
                placeholder="Nhập email"
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                value={editing.phone || ""}
                onChange={(e) => handleEditChange("phone", e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="form-group">
              <label>City:</label>
              <input
                value={editing.address?.city || ""}
                onChange={(e) => handleEditChange("city", e.target.value)}
                placeholder="Nhập thành phố"
              />
            </div>
            <div className="modal-actions">
              <button className="btn-save" onClick={saveUser}>
                Lưu
              </button>
              <button className="btn-cancel" onClick={() => setEditing(null)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultTable;
