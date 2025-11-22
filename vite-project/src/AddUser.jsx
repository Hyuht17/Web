import React, { useState } from "react";

function AddUser({ onAdd }) {
  const [adding, setAdding] = useState(false);
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    address: { street: "", suite: "", city: "" },
    phone: "",
    website: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (["street", "suite", "city"].includes(id)) {
      setUser({ ...user, address: { ...user.address, [id]: value } });
    } else {
      setUser({ ...user, [id]: value });
    }
    // Clear error for this field
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!user.name.trim()) {
      newErrors.name = "Name là bắt buộc";
    }
    
    if (!user.username.trim()) {
      newErrors.username = "Username là bắt buộc";
    }
    
    if (!user.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!user.phone.trim()) {
      newErrors.phone = "Phone là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validateForm()) {
      return;
    }

    onAdd(user);
    
    // Reset form
    setUser({
      name: "",
      username: "",
      email: "",
      address: { street: "", suite: "", city: "" },
      phone: "",
      website: "",
    });
    setErrors({});
    setAdding(false);
  };

  const handleCancel = () => {
    setUser({
      name: "",
      username: "",
      email: "",
      address: { street: "", suite: "", city: "" },
      phone: "",
      website: "",
    });
    setErrors({});
    setAdding(false);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <button className="btn-add" onClick={() => setAdding(true)}>
        ➕ Thêm người dùng
      </button>

      {adding && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>➕ Thêm người dùng mới</h3>
            
            <div className="form-group">
              <label>Name: <span className="required">*</span></label>
              <input 
                id="name" 
                value={user.name} 
                onChange={handleChange}
                placeholder="Nhập tên đầy đủ"
                className={errors.name ? "error-input" : ""}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Username: <span className="required">*</span></label>
              <input 
                id="username" 
                value={user.username} 
                onChange={handleChange}
                placeholder="Nhập username"
                className={errors.username ? "error-input" : ""}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label>Email: <span className="required">*</span></label>
              <input 
                id="email" 
                type="email"
                value={user.email} 
                onChange={handleChange}
                placeholder="example@email.com"
                className={errors.email ? "error-input" : ""}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone: <span className="required">*</span></label>
              <input 
                id="phone" 
                value={user.phone} 
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className={errors.phone ? "error-input" : ""}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>City:</label>
              <input 
                id="city" 
                value={user.address.city} 
                onChange={handleChange}
                placeholder="Nhập thành phố"
              />
            </div>

            <div className="form-group">
              <label>Website:</label>
              <input 
                id="website" 
                value={user.website} 
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <div className="modal-actions">
              <button className="btn-save" onClick={handleAdd}>
                Lưu
              </button>
              <button className="btn-cancel" onClick={handleCancel}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddUser;
