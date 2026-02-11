const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      search,
      sort,
      limit = 10,
      page = 1
    } = req.query;

    const offset = (page - 1) * limit;

    const filters = {
      category,
      brand,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      rating: rating ? parseFloat(rating) : undefined,
      search,
      sort
    };

    const products = await Product.findAll(filters, parseInt(limit), offset);
    const total = await Product.count(filters);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages,
      currentPage: parseInt(page),
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is numeric or slug
    const isNumeric = /^\d+$/.test(id);
    const product = isNumeric 
      ? await Product.findById(id)
      : await Product.findBySlug(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get product images
    const images = await Product.getImages(product.id);
    
    // Get related products
    const relatedProducts = await Product.getRelatedProducts(
      product.id, 
      product.category_id
    );

    res.json({
      success: true,
      product: {
        ...product,
        images,
        relatedProducts
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    
    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Category.getProductCount(category.id);
        return { ...category, productCount: count };
      })
    );

    res.json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:slug
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 10, page = 1 } = req.query;
    
    const offset = (page - 1) * limit;
    
    const category = await Category.findBySlug(slug);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const filters = { category: slug };
    const products = await Product.findAll(filters, parseInt(limit), offset);
    const total = await Product.count(filters);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      category,
      count: products.length,
      total,
      totalPages,
      currentPage: parseInt(page),
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProduct,
  getCategories,
  getProductsByCategory
};