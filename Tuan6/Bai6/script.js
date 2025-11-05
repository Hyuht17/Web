const STORAGE_KEY = 'newsArticles';
const FETCH_DATA_KEY = 'fetchedArticles'; // Để tracking dữ liệu từ API

// Mảng sản phẩm mẫu ban đầu (fallback nếu fetch thất bại)
const DEFAULT_ARTICLES = [
    {
        id: 1,
        title: 'AI và Tương Lai Của Công Nghệ',
        category: 'Công nghệ',
        description: 'Trí tuệ nhân tạo đang thay đổi cách chúng ta làm việc và sinh hoạt. Các chuyên gia dự đoán AI sẽ tạo ra cuộc cách mạng lớn trong thập kỷ tới, ảnh hưởng đến mọi ngành nghề từ y tế, giáo dục đến sản xuất.',
        imageUrl: 'https://res.cloudinary.com/dhmutopv5/image/upload/v1753863008/spx2-8_sp4sgh.png',
        date: '22/10/2025'
    },
    {
        id: 2,
        title: 'Thị Trường Chứng Khoán Tăng Trưởng Mạnh',
        category: 'Kinh tế',
        description: 'Thị trường chứng khoán trong nước ghi nhận phiên tăng điểm ấn tượng với thanh khoản cao. VN-Index vượt mốc quan trọng, khối ngoại tiếp tục mua ròng, tạo tín hiệu tích cực cho xu hướng tăng trưởng.',
        imageUrl: 'https://res.cloudinary.com/dhmutopv5/image/upload/v1753863008/spx2-8_sp4sgh.png',
        date: '22/10/2025'
    },
    {
        id: 3,
        title: 'Đội Tuyển Việt Nam Chiến Thắng Ấn Tượng',
        category: 'Thể thao',
        description: 'Trong trận đấu vừa qua, đội tuyển Việt Nam đã có màn trình diễn xuất sắc, giành chiến thắng thuyết phục với tỷ số 3-0. Đây là bước tiến quan trọng trên hành trình chinh phục ngôi vương khu vực.',
        imageUrl: 'https://res.cloudinary.com/dhmutopv5/image/upload/v1753863008/spx2-8_sp4sgh.png',
        date: '22/10/2025'
    }
];

function getArticlesFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    } else {
        // Nếu chưa có dữ liệu, khởi tạo với các bài viết mẫu
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ARTICLES));
        return DEFAULT_ARTICLES;
    }
}

function saveArticlesToStorage(articles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

/**
 * Lấy dữ liệu tin tức từ file products.json bằng Fetch API
 * Nếu fetch thành công, lưu vào localStorage
 * Nếu fetch thất bại, sử dụng dữ liệu mặc định
 */
async function fetchArticlesFromServer() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    try {
        
        // Gửi request tới products.json
        const response = await fetch('./products.json');
        
        // Kiểm tra nếu response thành công
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Chuyển đổi response thành JSON
        const articles = await response.json();
        
        
        // Ẩn loading spinner
        if (loadingSpinner) {
            loadingSpinner.classList.add('hidden');
        }
        
        // Khởi tạo localStorage với dữ liệu từ API
        // Nếu chưa có dữ liệu trong localStorage, sử dụng dữ liệu từ API
        if (!localStorage.getItem(STORAGE_KEY)) {
            saveArticlesToStorage(articles);
        }
        
        // Render bài viết từ localStorage
        renderArticles();
        
        return articles;
        
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ máy chủ:', error);
        
        // Ẩn loading spinner
        if (loadingSpinner) {
            loadingSpinner.classList.add('hidden');
        }
        
        
        // Khởi tạo localStorage với dữ liệu mặc định nếu chưa có
        if (!localStorage.getItem(STORAGE_KEY)) {
            saveArticlesToStorage(DEFAULT_ARTICLES);
        }
        
        // Render bài viết từ localStorage
        renderArticles();
        
        // Hiển thị thông báo lỗi
        showNotification('Không thể tải từ máy chủ, sử dụng dữ liệu mặc định');
    }
}

// ===== RENDER ARTICLES FROM STORAGE =====
function createArticleElement(article) {
    const articleEl = document.createElement('article');
    articleEl.className = 'product-item';
    articleEl.innerHTML = `
        <img src="${article.imageUrl}" alt="${escapeHtml(article.title)}" onerror="this.src='https://via.placeholder.com/400x250?text=Tin+tức'">
        <h3 class="product-name">${escapeHtml(article.title)}</h3>
        <p>${escapeHtml(article.description)}</p>
        <p class="price"><strong>Thể loại:</strong> <span>${escapeHtml(article.category)}</span> | <span>${article.date}</span></p>
        <button class="delete-btn" data-id="${article.id}">🗑️ Xóa tin tức</button>
    `;
    
    // Thêm event listener cho nút xóa
    const deleteBtn = articleEl.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        const articleId = parseInt(this.dataset.id);
        deleteArticle(articleId);
    });
    
    return articleEl;
}

function renderArticles() {
    const productList = document.querySelector('#product-list');
    
    // Xóa tất cả các bài viết cũ (giữ lại h2)
    const oldArticles = productList.querySelectorAll('.product-item');
    oldArticles.forEach(article => article.remove());
    
    // Lấy bài viết từ localStorage
    const articles = getArticlesFromStorage();
    
    // Thêm từng bài viết vào danh sách
    articles.forEach(article => {
        const articleEl = createArticleElement(article);
        productList.appendChild(articleEl);
    });
    
    // Cập nhật lại danh sách sản phẩm
    productItems = document.querySelectorAll('.product-item');
}

// ===== DOM ELEMENTS =====
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductFormSection = document.getElementById('addProductFormSection');
const addProductForm = document.getElementById('addProductForm');
const cancelBtn = document.getElementById('cancelBtn');
const categoryFilter = document.getElementById('categoryFilter');
const sortBtn = document.getElementById('sortBtn');
let productItems = document.querySelectorAll('.product-item');
let isSorted = false;

// search
function filterProducts(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    
    // Lấy lại danh sách sản phẩm hiện tại (bao gồm cả sản phẩm vừa thêm)
    productItems = document.querySelectorAll('.product-item');
    
    productItems.forEach(item => {
        const productName = item.querySelector('.product-name').textContent.toLowerCase();
        const productCategory = item.querySelector('.price span').textContent;
        
        // Kiểm tra cả tên và thể loại
        const nameMatch = productName.includes(term);
        const categoryMatch = selectedCategory === '' || productCategory === selectedCategory;
        
        if (nameMatch && categoryMatch) {
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

// ===== CATEGORY FILTER =====
categoryFilter.addEventListener('change', function() {
    const searchTerm = searchInput.value;
    filterProducts(searchTerm);
});

// ===== SORT FUNCTIONALITY =====
sortBtn.addEventListener('click', function() {
    let articles = getArticlesFromStorage();
    
    if (isSorted) {
        // Nếu đã sắp xếp, trả về thứ tự mặc định
        isSorted = false;
        sortBtn.textContent = '↕️ Sắp xếp';
    } else {
        // Sắp xếp theo tiêu đề A-Z
        articles.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
        saveArticlesToStorage(articles);
        isSorted = true;
        sortBtn.textContent = '↕️ A→Z';
    }
    
    renderArticles();
    
    // Áp dụng bộ lọc hiện tại sau khi sắp xếp
    const searchTerm = searchInput.value;
    filterProducts(searchTerm);
});

// ===== DELETE ARTICLE FUNCTION =====
function deleteArticle(articleId) {
    const confirmed = confirm('Bạn có chắc muốn xóa tin tức này?');
    
    if (confirmed) {
        let articles = getArticlesFromStorage();
        
        // Lọc bỏ bài viết có ID đó
        articles = articles.filter(a => a.id !== articleId);
        
        // Lưu lại localStorage
        saveArticlesToStorage(articles);
        
        // Re-render toàn bộ
        renderArticles();
        
        // Áp dụng bộ lọc hiện tại
        const searchTerm = searchInput.value;
        filterProducts(searchTerm);
        
        // Thông báo
        showNotification('Tin tức đã được xóa thành công!');
    }
}

// ===== ADD PRODUCT TOGGLE FUNCTIONALITY =====
function toggleAddProductForm() {
    addProductFormSection.classList.toggle('hidden');
    
    // Focus vào input đầu tiên khi form hiện
    if (!addProductFormSection.classList.contains('hidden')) {
        setTimeout(() => {
            document.getElementById('productTitle').focus();
        }, 100);
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
    
    // Lấy bài viết từ localStorage
    let articles = getArticlesFromStorage();
    
    // Tạo ID mới (tự động tăng)
    const newId = Math.max(...articles.map(a => a.id), 0) + 1;
    
    // Tạo đối tượng bài viết mới
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
    const newArticle = {
        id: newId,
        title: title,
        category: category,
        description: description,
        imageUrl: imageUrl,
        date: formattedDate
    };
    
    // Thêm vào đầu mảng
    articles.unshift(newArticle);
    
    // Lưu vào localStorage
    saveArticlesToStorage(articles);
    
    // Tạo phần tử HTML và thêm vào đầu danh sách
    const articleEl = createArticleElement(newArticle);
    const productList = document.querySelector('#product-list');
    const firstProductItem = productList.querySelector('.product-item');
    
    if (firstProductItem) {
        firstProductItem.before(articleEl);
    } else {
        productList.appendChild(articleEl);
    }
    
    // Cập nhật lại danh sách sản phẩm để JS có thể tìm kiếm được
    productItems = document.querySelectorAll('.product-item');
    
    // Reset form và đóng
    addProductForm.reset();
    addProductFormSection.classList.add('hidden');
    
    // Reset filter
    searchInput.value = '';
    categoryFilter.value = '';
    isSorted = false;
    sortBtn.textContent = '↕️ Sắp xếp';
    
    // Render lại và xóa bộ lọc
    renderArticles();
    filterProducts('');
    
    // Thông báo thành công
    showNotification('Thêm tin tức thành công! (Đã lưu vào localStorage)');
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


// ===== INITIALIZATION - TẢI DỮ LIỆU TỪCÓ TỬ API =====
// Tải bài viết từ API khi trang được load
document.addEventListener('DOMContentLoaded', async function() {
    console.log('� Ứng dụng đang khởi động...');
    
    // Gọi fetchArticlesFromServer để lấy dữ liệu từ API
    await fetchArticlesFromServer();
    
    console.log('✨ Ứng dụng đã sẵn sàng!');
});

// Nếu script được load synchronously (không phải async)
if (document.readyState === 'loading') {
    // Đợi DOM tải xong rồi gọi fetch
    document.addEventListener('DOMContentLoaded', fetchArticlesFromServer);
} else {
    // Nếu DOM đã tải xong, gọi fetch ngay
    fetchArticlesFromServer();
}



