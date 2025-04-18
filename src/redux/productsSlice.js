import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    try {
      const response = await fetch("https://dummyjson.com/products?limit=100");
      const data = await response.json();

      if (!data.products || !Array.isArray(data.products)) {
        throw new Error("Invalid API response format");
      }

      return data.products.map((product) => ({
        id: product.id,
        name: product.title,
        nameAr: product.title,
        description: product.description,
        descriptionAr: product.description,
        price: product.price,
        image: product.thumbnail,
        category: product.category,
        rating: product.rating,
        inStock: product.stock > 0,
        isNew: true,
        isFeatured: product.rating >= 4.5,
        images: product.images,
        discountPercentage: product.discountPercentage || 0,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
);

// Async thunk for fetching products by category
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (category) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/category/${category}`
      );
      const data = await response.json();

      return data.products.map((product) => ({
        id: product.id,
        name: product.title,
        nameAr: product.title,
        description: product.description,
        descriptionAr: product.description,
        price: product.price,
        image: product.thumbnail,
        category: product.category,
        rating: product.rating,
        inStock: product.stock > 0,
        isNew: true,
        isFeatured: product.rating >= 4.5,
        images: product.images,
        discountPercentage: product.discountPercentage || 0,
      }));
    } catch (error) {
      throw new Error("Failed to fetch products by category");
    }
  }
);

// Async thunk for searching products
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (query) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${query}`
      );
      const data = await response.json();

      return data.products.map((product) => ({
        id: product.id,
        name: product.title,
        nameAr: product.title,
        description: product.description,
        descriptionAr: product.description,
        price: product.price,
        image: product.thumbnail,
        category: product.category,
        rating: product.rating,
        inStock: product.stock > 0,
        isNew: true,
        isFeatured: product.rating >= 4.5,
        images: product.images,
        discountPercentage: product.discountPercentage || 0,
      }));
    } catch (error) {
      throw new Error("Failed to search products");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    categories: [
      {
        id: "all",
        name: "All Categories",
        nameAr: "جميع الفئات",
        icon: "📦",
      },
      {
        id: "smartphones",
        name: "Smartphones",
        nameAr: "الهواتف الذكية",
        icon: "📱",
      },
      {
        id: "laptops",
        name: "Laptops",
        nameAr: "أجهزة الكمبيوتر المحمولة",
        icon: "💻",
      },
      {
        id: "fragrances",
        name: "Fragrances",
        nameAr: "العطور",
        icon: "🌸",
      },
      {
        id: "groceries",
        name: "Groceries",
        nameAr: "البقالة",
        icon: "🛒",
      },
      {
        id: "home-decoration",
        name: "Home Decoration",
        nameAr: "ديكور المنزل",
        icon: "🏠",
      },
      {
        id: "furniture",
        name: "Furniture",
        nameAr: "الأثاث",
        icon: "🪑",
      },
      {
        id: "tops",
        name: "Tops",
        nameAr: "الملابس العلوية",
        icon: "👕",
      },
      {
        id: "womens-dresses",
        name: "Women's Dresses",
        nameAr: "فساتين نسائية",
        icon: "👗",
      },
      {
        id: "womens-shoes",
        name: "Women's Shoes",
        nameAr: "أحذية نسائية",
        icon: "👠",
      },
      {
        id: "mens-shirts",
        name: "Men's Shirts",
        nameAr: "قمصان رجالية",
        icon: "👔",
      },
      {
        id: "mens-shoes",
        name: "Men's Shoes",
        nameAr: "أحذية رجالية",
        icon: "👞",
      },
      {
        id: "mens-watches",
        name: "Men's Watches",
        nameAr: "ساعات رجالية",
        icon: "⌚",
      },
      {
        id: "womens-watches",
        name: "Women's Watches",
        nameAr: "ساعات نسائية",
        icon: "⌚",
      },
      {
        id: "womens-bags",
        name: "Women's Bags",
        nameAr: "حقائب نسائية",
        icon: "👜",
      },
      {
        id: "womens-jewellery",
        name: "Women's Jewellery",
        nameAr: "مجوهرات نسائية",
        icon: "💍",
      },
      {
        id: "sunglasses",
        name: "Sunglasses",
        nameAr: "نظارات شمسية",
        icon: "🕶️",
      },
      {
        id: "motorcycle",
        name: "Motorcycle",
        nameAr: "دراجات نارية",
        icon: "🏍️",
      },
    ],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        console.log("Products loaded:", action.payload.length);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error("Error loading products:", action.error);
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      });
  },
});

export const selectProducts = (state) => state.products.products;
export const selectCategories = (state) => state.products.categories;
export const selectAllProducts = (state) => state.products.products;
export const selectFeaturedProducts = (state) =>
  state.products.products.filter((product) => product.isFeatured);

export default productsSlice.reducer;
