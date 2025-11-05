// ===== DOM ELEMENTS =====
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductFormSection = document.getElementById('addProductFormSection');
const addProductForm = document.getElementById('addProductForm');
const cancelBtn = document.getElementById('cancelBtn');
const productItems = document.querySelectorAll('.product-item');

// ===== SEARCH / FILTER FUNCTIONALITY =====
function filterProducts(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
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
});

// ===== ADD PRODUCT FORM SUBMISSION =====
addProductForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Lấy dữ liệu từ form
    const title = document.getElementById('productTitle').value.trim();
    const category = document.getElementById('productCategory').value;
    const description = document.getElementById('productDescription').value.trim();
    const imageUrl = document.getElementById('productImage').value.trim() || 'https://via.placeholder.com/400x250?text=Tin+tức';
    
    // Kiểm tra dữ liệu hợp lệ
    if (!title || !category || !description) {
        alert('❌ Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    // Tạo phần tử bài viết mới
    const newArticle = document.createElement('article');
    newArticle.className = 'product-item';
    
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
    newArticle.innerHTML = `
        <img src="${imageUrl}" alt="${title}" onerror="this.src='https://via.placeholder.com/400x250?text=Tin+tức'">
        <h3 class="product-name">${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}</p>
        <p class="price"><strong>Thể loại:</strong> <span>${escapeHtml(category)}</span> | <span>${formattedDate}</span></p>
    `;
    
    // Thêm vào danh sách sản phẩm (trước section form)
    const productList = document.querySelector('#product-list');
    const lastProductItem = productList.querySelector('.product-item:last-of-type');
    
    if (lastProductItem) {
        lastProductItem.after(newArticle);
    }
    
    // Cập nhật lại danh sách sản phẩm để JS có thể tìm kiếm được
    updateProductItems();
    
    // Reset form và đóng
    addProductForm.reset();
    addProductFormSection.classList.add('hidden');
    
    // Thông báo thành công
    showNotification('✅ Thêm tin tức thành công!');
});

// Hàm cập nhật danh sách sản phẩm sau khi thêm mới
function updateProductItems() {
    productItems.length = 0;
    document.querySelectorAll('.product-item').forEach(item => {
        productItems.push(item);
    });
}

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
        top: 20px;
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
`;
document.head.appendChild(style);

// ===== INITIALIZATION =====
console.log('✅ Script.js đã được tải thành công!');
console.log('Số tin tức hiện tại:', productItems.length);
