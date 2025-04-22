const productList = document.getElementById('productList');
const form = document.getElementById('productForm');
const searchInput = document.getElementById('searchInput');

let page = 1;
const limit = 10;
let loading = false;
let searchQuery = '';
let debounceTimer;

// Debounced search
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchQuery = searchInput.value.trim();
    productList.innerHTML = '';
    page = 1;
    loadProducts();
  }, 300);
});

// Infinite scroll
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 &&
    !loading
  ) {
    loadProducts();
  }
});

// Load products
async function loadProducts() {
  loading = true;
  let url = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`;
  if (searchQuery) {
    url += `&q=${searchQuery}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.length === 0) return;

    data.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${p.title}</strong>
        <p>${p.body}</p>
        <button onclick="updateProduct(${p.id})">Update</button>
        <button onclick="deleteProduct(${p.id})">Delete</button>
      `;
      productList.appendChild(li);
    });

    page++;
  } catch (err) {
    alert('Error loading products');
  } finally {
    loading = false;
  }
}

// Add product
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const body = document.getElementById('body').value;

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, userId: 1 }),
    });
    const newProduct = await res.json();
    alert('Product added!');
    form.reset();
    productList.innerHTML = '';
    page = 1;
    loadProducts();
  } catch (err) {
    alert('Failed to add product');
  }
});

// Update product
async function updateProduct(id) {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Updated Title',
        body: 'Updated Body',
        userId: 1,
      }),
    });
    await res.json();
    alert('Product updated!');
  } catch (err) {
    alert('Failed to update product');
  }
}

// Delete product
async function deleteProduct(id) {
  try {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE',
    });
    alert('Product deleted!');
    productList.innerHTML = '';
    page = 1;
    loadProducts();
  } catch (err) {
    alert('Failed to delete product');
  }
}

// Initial load
loadProducts();
