import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [stuClass, setStuClass] = useState("")
  const [gender, setGender] = useState("")

  const [notification, setNotification] = useState({ show: false, message: '', type: '' })
  const [newlyAddedId, setNewlyAddedId] = useState(null)

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [editName, setEditName] = useState("")
  const [editAge, setEditAge] = useState("")
  const [editClass, setEditClass] = useState("")
  const [editGender, setEditGender] = useState("")

  // Search state
  const [searchTerm, setSearchTerm] = useState("")

  // Sort state
  const [sortAsc, setSortAsc] = useState(true)


  // Fetch students from API
  const fetchStudents = () => {
    setLoading(true)
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Lỗi khi fetch danh sách:", error)
        setError("Không thể tải danh sách học sinh")
        setLoading(false)
      })
  }


  // Hiển thị thông báo
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' })
    }, 3000)
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  //  Gửi yêu cầu thêm học sinh từ Frontend 
  const handleAddStudent = async (e) => {
    e.preventDefault()

    try {
      const newStudent = {
        name,
        age: parseInt(age),
        class: stuClass,
        gender
      }

      const response = await axios.post('http://localhost:5000/api/students', newStudent)

      setNewlyAddedId(response.data._id)

      setTimeout(() => {
        setNewlyAddedId(null)
      }, 3000)
      setName("")
      setAge("")
      setStuClass("")
      setGender("")
      // Cập nhật giao diện danh sách sau khi sửa
      fetchStudents()

      showNotification(`Thêm học sinh "${name}" thành công! `, 'success')
    } catch (error) {
      console.error("Lỗi khi thêm học sinh:", error)
      showNotification('Không thể thêm học sinh. Vui lòng thử lại! ', 'error')
    }
  }

  // Mở modal chỉnh sửa và load dữ liệu học sinh
  const handleEditClick = (student) => {
    setEditingStudent(student)
    setEditName(student.name)
    setEditAge(student.age)
    setEditClass(student.class)
    setEditGender(student.gender)
    setIsEditModalOpen(true)
  }

  // Đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingStudent(null)
    setEditName("")
    setEditAge("")
    setEditClass("")
    setEditGender("")
  }

  //Gửi yêu cầu cập nhật từ Frontend 
  // Cập nhật thông tin học sinh
  const handleUpdateStudent = async (e) => {
    e.preventDefault()

    try {
      const updatedData = {
        name: editName,
        age: parseInt(editAge),
        class: editClass,
        gender: editGender
      }

      await axios.put(`http://localhost:5000/api/students/${editingStudent._id}`, updatedData)

      // Refresh danh sách
      fetchStudents()

      // Đóng modal
      handleCloseEditModal()

      // Hiển thị thông báo
      showNotification(`Cập nhật học sinh "${editName}" thành công! `, 'success')
    } catch (error) {
      console.error("Lỗi khi cập nhật học sinh:", error)
      showNotification('Không thể cập nhật học sinh. Vui lòng thử lại! ', 'error')
    }
  }

  // Gửi yêu cầu xóa từ frontend
  const handleDelete = async (studentId, studentName) => {
    // Xác nhận trước khi xóa
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa học sinh "${studentName}"?`)

    if (!confirmDelete) {
      return
    }

    try {
      await axios.delete(`http://localhost:5000/api/students/${studentId}`)

      // Refresh danh sách
      fetchStudents()

      // Hiển thị thông báo
      showNotification(`Đã xóa học sinh "${studentName}" thành công! `, 'success')
    } catch (error) {
      console.error("Lỗi khi xóa học sinh:", error)
      showNotification('Không thể xóa học sinh. Vui lòng thử lại! ', 'error')
    }
  }



  if (loading) {
    return <div className="container"><h2>Đang tải...</h2></div>
  }

  if (error) {
    return <div className="container"><h2 className="error">{error}</h2></div>
  }

  return (
    <div className="container">
      {/* Toast Notification */}
      {notification.show && (
        <div className={`toast ${notification.type}`}>
          <span>{notification.message}</span>
        </div>
      )}

      <h1>Quản Lý Học Sinh</h1>
      {/* Tạo giao diện Form thêm học sinh */}
      {/* Form thêm học sinh */}
      <div className="form-section">
        <h2>Thêm Học Sinh Mới</h2>
        <form onSubmit={handleAddStudent} className="student-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Họ và tên"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Tuổi"
              value={age}
              onChange={e => setAge(e.target.value)}
              required
              min="1"
              max="100"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Lớp"
              value={stuClass}
              onChange={e => setStuClass(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <select
              value={gender}
              onChange={e => setGender(e.target.value)}
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <button type="submit" className="btn-submit">Thêm học sinh</button>
        </form>
      </div>

      {/* Danh sách học sinh */}
      <div className="list-section">
        <h2>Danh Sách Học Sinh</h2>

        {/* Search Box */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder=" Tìm kiếm theo tên, lớp hoặc giới tính..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn-clear-search"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Button */}
        <div className="sort-container">
          <button
            className="btn-sort"
            onClick={() => setSortAsc(prev => !prev)}
          >
            Sắp xếp theo tên: {sortAsc ? 'A → Z' : 'Z → A'}
          </button>
        </div>

        {(() => {
          //  Lọc danh sách dựa trên từ khóa tìm kiếm
          const filteredStudents = students.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.gender.toLowerCase().includes(searchTerm.toLowerCase())
          )

          // Sắp xếp danh sách theo tên
          //Hiển thị danh sách đã sắp xếp
          // Thực hiện sắp xếp trên danh sách 
          const sortedStudents = [...filteredStudents].sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()
            return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
          })

          return sortedStudents.length === 0 ? (
            <p>{searchTerm ? `Không tìm thấy học sinh nào với từ khóa "${searchTerm}"` : 'Không có học sinh nào trong danh sách.'}</p>
          ) : (
            <table className="student-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ và Tên</th>
                  <th>Tuổi</th>
                  <th>Lớp</th>
                  <th>Giới tính</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, index) => (
                  <tr
                    key={student._id || index}
                    className={student._id === newlyAddedId ? 'newly-added' : ''}
                  >
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.age}</td>
                    <td>{student.class}</td>
                    <td>{student.gender}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEditClick(student)}
                      >
                        Sửa
                      </button>
                      {/* Tích hợp nút "Xóa" trên giao diện */}
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(student._id, student.name)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        })()}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={handleCloseEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chỉnh Sửa Học Sinh</h2>
              <button className="btn-close" onClick={handleCloseEditModal}>✕</button>
            </div>
            {/* Giao diện cho phép sửa thông tin */}
            <form onSubmit={handleUpdateStudent} className="student-form">
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tuổi</label>
                <input
                  type="number"
                  placeholder="Tuổi"
                  value={editAge}
                  onChange={e => setEditAge(e.target.value)}
                  required
                  min="1"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label>Lớp</label>
                <input
                  type="text"
                  placeholder="Lớp"
                  value={editClass}
                  onChange={e => setEditClass(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Giới tính</label>
                <select
                  value={editGender}
                  onChange={e => setEditGender(e.target.value)}
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseEditModal}>
                  Hủy
                </button>
                <button type="submit" className="btn-submit">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
