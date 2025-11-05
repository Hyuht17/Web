// ===== DOM ELEMENTS =====
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductFormSection = document.getElementById('addProductFormSection');
const addProductForm = document.getElementById('addProductForm');
const cancelBtn = document.getElementById('cancelBtn');
let productItems = document.querySelectorAll('.product-item');

// search
function filterProducts(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    // Lấy lại danh sách sản phẩm hiện tại (bao gồm cả sản phẩm vừa thêm)
    productItems = document.querySelectorAll('.product-item');
    
    productItems.forEach(item => {
        const productName = item.querySelector('.product-name').textContent.toLowerCase();
        
        if (productName.includes(term)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Kiểm tra nếu không có sản phẩm nào được hiển thị
    checkNoResults();
}

// Hàm kiểm tra và thông báo khi không có kết quả
function checkNoResults() {
    const visibleItems = Array.from(productItems).filter(item => item.style.display !== 'none');
    
    if (visibleItems.length === 0) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.textContent = '❌ Không tìm thấy tin tức nào phù hợp';
            noResultsMsg.style.cssText = `
                text-align: center;
                padding: 2rem;
                color: #6b7280;
                font-size: 1.1rem;
            `;
            
            const productList = document.querySelector('#product-list');
            productList.appendChild(noResultsMsg);
        }
    } else {
        const noResultsMsg = document.querySelector('.no-results-message');
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}

// Xử lý sự kiện tìm kiếm - Nút Tìm
searchBtn.addEventListener('click', function() {
    const searchTerm = searchInput.value;
    filterProducts(searchTerm);
});

// Xử lý sự kiện tìm kiếm - Keyup (nhập liệu real-time)
searchInput.addEventListener('keyup', function(event) {
    const searchTerm = this.value;
    filterProducts(searchTerm);
    
    // Nếu Enter được nhấn, tập trung vào nút tìm
    if (event.key === 'Enter') {
        searchBtn.focus();
    }
});

// ===== ADD PRODUCT TOGGLE FUNCTIONALITY =====
function toggleAddProductForm() {
    addProductFormSection.classList.toggle('hidden');
    
    // Focus vào input đầu tiên khi form hiện
    if (!addProductFormSection.classList.contains('hidden')) {
        document.getElementById('productTitle').focus();
    }
}

addProductBtn.addEventListener('click', function() {
    toggleAddProductForm();
});

cancelBtn.addEventListener('click', function() {
    toggleAddProductForm();
    addProductForm.reset();
    clearFormErrors();
});

// ===== VALIDATION FUNCTIONS =====
function validateForm(title, category, description) {
    const errors = [];
    
    // Kiểm tra tiêu đề
    if (!title || title.trim() === '') {
        errors.push('Tiêu đề tin tức không được rỗng');
    }
    
    // Kiểm tra thể loại
    if (!category || category === '') {
        errors.push('Vui lòng chọn thể loại');
    }
    
    // Kiểm tra nội dung
    if (!description || description.trim() === '') {
        errors.push('Nội dung tin tức không được rỗng');
    }
    
    if (description && description.trim().length < 10) {
        errors.push('Nội dung phải có ít nhất 10 ký tự');
    }
    
    return errors;
}

function displayFormErrors(errors) {
    const errorContainer = document.getElementById('formErrors');
    
    if (errors.length > 0) {
        errorContainer.innerHTML = errors.map(error => `<div class="error-item">⚠️ ${error}</div>`).join('');
        errorContainer.style.display = 'block';
    } else {
        errorContainer.style.display = 'none';
        errorContainer.innerHTML = '';
    }
}

function clearFormErrors() {
    const errorContainer = document.getElementById('formErrors');
    errorContainer.style.display = 'none';
    errorContainer.innerHTML = '';
}

// ===== ADD PRODUCT FORM SUBMISSION =====
addProductForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Lấy dữ liệu từ form
    const title = document.getElementById('productTitle').value.trim();
    const category = document.getElementById('productCategory').value;
    const description = document.getElementById('productDescription').value.trim();
    const imageUrl = document.getElementById('productImage').value.trim() || 'https://via.placeholder.com/400x250?text=Tin+tức';
    
    // Validate dữ liệu
    const errors = validateForm(title, category, description);
    
    if (errors.length > 0) {
        displayFormErrors(errors);
        return;
    }
    
    clearFormErrors();
    
    // Tạo phần tử bài viết mới
    const newArticle = document.createElement('article');
    newArticle.className = 'product-item';
    
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
    newArticle.innerHTML = `
        <img src="${imageUrl}" alt="${escapeHtml(title)}" onerror="this.src='https://via.placeholder.com/400x250?text=Tin+tức'">
        <h3 class="product-name">${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}</p>
        <p class="price"><strong>Thể loại:</strong> <span>${escapeHtml(category)}</span> | <span>${formattedDate}</span></p>
    `;
    
    // Thêm vào đầu danh sách sản phẩm
    const productList = document.querySelector('#product-list');
    const firstProductItem = productList.querySelector('.product-item');
    
    if (firstProductItem) {
        firstProductItem.before(newArticle);
    } else {
        productList.appendChild(newArticle);
    }
    
    // Cập nhật lại danh sách sản phẩm để JS có thể tìm kiếm được
    productItems = document.querySelectorAll('.product-item');
    
    // Reset form và đóng
    addProductForm.reset();
    addProductFormSection.classList.add('hidden');
    
    // Xóa input tìm kiếm để hiện toàn bộ danh sách
    searchInput.value = '';
    filterProducts('');
    
    // Thông báo thành công
    showNotification('✅ Thêm tin tức thành công!');
});

// Hàm escape HTML để tránh XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Hàm hiển thị thông báo
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #059669 0%, #10b981 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        z-index: 2000;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .error-container {
        display: none;
        background-color: #fee;
        border: 2px solid #fcc;
        border-radius: 4px;
        padding: 1rem;
        margin-bottom: 1.5rem;
    }

    .error-item {
        color: #c33;
        margin: 0.5rem 0;
        font-weight: 500;
    }

    .error-item:first-child {
        margin-top: 0;
    }

    .error-item:last-child {
        margin-bottom: 0;
    }
`;
document.head.appendChild(style);



