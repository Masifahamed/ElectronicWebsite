import mongoose from 'mongoose'

//product schema
const productSchema=new mongoose.Schema(
    {
        productname:{
            type:String,
            required:[true,'Required product name'],

        },
        price:{
            type:Number,
            required:[true,'required product price'],
            min:[100,'Minimum price should be 100']
        },
        discount:{
            type:Number,
            min:0,
            max:100,
            default:0
        },
        originalprice:{
            type:Number,
        },
        category:{
            type:String,
            required:[true,'eg:Electronic'],
            trim:true
        },
        stock:{
            type:Number,
            required:[true,'Stock required'],
            min:[1,'Stock must be at least 1']
        },
        description:{
            type:String,
            trim:true
        },
        imageurl:{
            type:String,
            required:[true,'Required the image URL'],
            
        },
         date: {
            type: Date,
            default: Date.now
        },
       
    }
)

const ProductModel =mongoose.model('ProductDetails',productSchema)

export default ProductModel;

// validate:{
            //     validator:function(value){
            // return /^(https?:\/\/.*\.(?:png|jpg|jpeg|webp|gif))$/i.test(value);
            //     },
            //     message:'Invalid image URL format'
            // }

// import mongoose from 'mongoose'

// //Transaction schema
// const productSchema=new mongoose.Schema(
//     {
//         name:{
//             type:String,
//             required:[true,'Required product name'],

//         },
//         description:{
//             type:String,
//             trim:true
//         },
//         image:{
//             type:String,
//             required:[true,'Required the image URL'],
//         },
//          originalprice:{
//             type:Number,
//         },
//         discount:{
//             type:Number,
//             min:0,
//             max:100,
//             default:0
//         },
//         price:{
//             type:Number,
//             required:[true,'required product price'],
//             min:[100,'Minimum price should be 100']
//         },
//          category:{
//             type:String,
//             required:[true,'eg:Electronic'],
//             trim:true
//         },
//         stock:{
//             type:Number,
//             required:[true,'Stock required'],
//             min:[1,'Stock must be at least 1']
//         },
        
//     }
// )

// const ProductModel = mongoose.model('Product',productSchema)

// export default ProductModel;


// import mongoose from 'mongoose'

// const reviewSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   userName: {
//     type: String,
//     required: true
//   },
//   userEmail: {
//     type: String,
//     required: true
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5
//   },
//   comment: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: [1000, 'Review cannot exceed 1000 characters']
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   },
//   verifiedPurchase: {
//     type: Boolean,
//     default: false
//   },
//   helpful: {
//     type: Number,
//     default: 0
//   },
//   notHelpful: {
//     type: Number,
//     default: 0
//   }
// }, {
//   timestamps: true
// });

// const productSchema = new mongoose.Schema({
//   // Basic Information
//   name: {
//     type: String,
//     required: [true, 'Product name is required'],
//     trim: true,
//     maxlength: [100, 'Product name cannot exceed 100 characters']
//   },
//   description: {
//     type: String,
//     required: [true, 'Product description is required'],
//     trim: true,
//     maxlength: [2000, 'Description cannot exceed 2000 characters']
//   },
//   shortDescription: {
//     type: String,
//     trim: true,
//     maxlength: [500, 'Short description cannot exceed 500 characters']
//   },
  
//   // Pricing Information
//   price: {
//     type: Number,
//     required: [true, 'Product price is required'],
//     min: [0, 'Price cannot be negative']
//   },
//   originalPrice: {
//     type: Number,
//     required: [true, 'Original price is required'],
//     min: [0, 'Original price cannot be negative']
//   },
//   costPrice: {
//     type: Number,
//     min: [0, 'Cost price cannot be negative']
//   },
//   discount: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 100
//   },
//   taxRate: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 100
//   },
  
//   // Inventory Management
//   sku: {
//     type: String,
//     unique: true,
//     sparse: true,
//     trim: true,
//     uppercase: true
//   },
//   stock: {
//     type: Number,
//     required: true,
//     default: 0,
//     min: 0
//   },
//   lowStockAlert: {
//     type: Number,
//     default: 5
//   },
//   manageStock: {
//     type: Boolean,
//     default: true
//   },
//   sold: {
//     type: Number,
//     default: 0
//   },
  
//   // Categorization
//   category: {
//     type: String,
//     required: [true, 'Product category is required'],
//     trim: true
//   },
//   subcategory: {
//     type: String,
//     trim: true
//   },
//   brand: {
//     type: String,
//     trim: true
//   },
//   tags: [{
//     type: String,
//     trim: true
//   }],
  
//   // Media
//   images: [{
//     url: {
//       type: String,
//       required: true
//     },
//     altText: {
//       type: String,
//       default: ''
//     },
//     isPrimary: {
//       type: Boolean,
//       default: false
//     },
//     order: {
//       type: Number,
//       default: 0
//     }
//   }],
//   videoUrl: {
//     type: String,
//     trim: true
//   },
//   thumbnail: {
//     type: String,
//     trim: true
//   },
  
//   // Specifications
//   specifications: [{
//     key: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     value: {
//       type: String,
//       required: true,
//       trim: true
//     }
//   }],
//   features: [String],
  
//   // Shipping & Dimensions
//   weight: {
//     type: Number,
//     min: 0
//   },
//   dimensions: {
//     length: { type: Number, min: 0 },
//     width: { type: Number, min: 0 },
//     height: { type: Number, min: 0 }
//   },
//   shippingClass: {
//     type: String,
//     trim: true
//   },
//   freeShipping: {
//     type: Boolean,
//     default: false
//   },
  
//   // Status & Visibility
//   status: {
//     type: String,
//     enum: ['draft', 'active', 'inactive', 'out_of_stock', 'discontinued'],
//     default: 'draft'
//   },
//   featured: {
//     type: Boolean,
//     default: false
//   },
//   published: {
//     type: Boolean,
//     default: false
//   },
//   publishDate: {
//     type: Date,
//     default: Date.now
//   },
//   expiryDate: {
//     type: Date
//   },
  
//   // SEO Optimization
//   seo: {
//     title: {
//       type: String,
//       trim: true,
//       maxlength: [60, 'SEO title cannot exceed 60 characters']
//     },
//     description: {
//       type: String,
//       trim: true,
//       maxlength: [160, 'SEO description cannot exceed 160 characters']
//     },
//     slug: {
//       type: String,
//       unique: true,
//       sparse: true,
//       trim: true,
//       lowercase: true
//     },
//     metaKeywords: [String],
//     canonicalUrl: {
//       type: String,
//       trim: true
//     }
//   },
  
//   // Analytics & Engagement
//   views: {
//     type: Number,
//     default: 0
//   },
//   likes: {
//     type: Number,
//     default: 0
//   },
//   shares: {
//     type: Number,
//     default: 0
//   },
//   salesCount: {
//     type: Number,
//     default: 0
//   },
//   wishlistCount: {
//     type: Number,
//     default: 0
//   },
  
//   // Ratings & Reviews (Calculated from user reviews)
//   rating: {
//     average: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 5
//     },
//     count: {
//       type: Number,
//       default: 0
//     },
//     distribution: {
//       1: { type: Number, default: 0 },
//       2: { type: Number, default: 0 },
//       3: { type: Number, default: 0 },
//       4: { type: Number, default: 0 },
//       5: { type: Number, default: 0 }
//     }
//   },
//   reviews: [reviewSchema],
  
//   // Related Products
//   relatedProducts: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product'
//   }],
//   crossSellProducts: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product'
//   }],
//   upSellProducts: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product'
//   }],
  
//   // Admin Fields
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   updatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   notes: {
//     type: String,
//     trim: true,
//     maxlength: [500, 'Notes cannot exceed 500 characters']
//   },
//   internalCode: {
//     type: String,
//     trim: true
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // ==================== INDEXES ====================
// productSchema.index({ name: 'text', description: 'text', 'tags': 'text' });
// productSchema.index({ category: 1, status: 1 });
// productSchema.index({ price: 1 });
// productSchema.index({ 'rating.average': -1 });
// productSchema.index({ createdAt: -1 });
// productSchema.index({ sku: 1 }, { sparse: true });
// productSchema.index({ 'seo.slug': 1 }, { sparse: true });
// productSchema.index({ featured: -1, status: 1 });
// productSchema.index({ status: 1, published: 1 });
// productSchema.index({ brand: 1, category: 1 });

// // ==================== VIRTUAL PROPERTIES ====================
// productSchema.virtual('inStock').get(function() {
//   return this.stock > 0;
// });

// productSchema.virtual('profitMargin').get(function() {
//   if (!this.costPrice) return null;
//   return ((this.price - this.costPrice) / this.costPrice * 100).toFixed(2);
// });

// productSchema.virtual('savings').get(function() {
//   return this.originalPrice - this.price;
// });

// productSchema.virtual('savingsPercentage').get(function() {
//   if (this.originalPrice <= 0) return 0;
//   return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
// });

// productSchema.virtual('taxAmount').get(function() {
//   return (this.price * (this.taxRate / 100)).toFixed(2);
// });

// productSchema.virtual('finalPrice').get(function() {
//   return this.price + (this.price * (this.taxRate / 100));
// });

// // ==================== METHODS ====================
// productSchema.methods.updateRating = function() {
//   const approvedReviews = this.reviews.filter(review => review.status === 'approved');
  
//   if (approvedReviews.length === 0) {
//     this.rating.average = 0;
//     this.rating.count = 0;
//     this.rating.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//     return;
//   }

//   const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
//   this.rating.average = parseFloat((totalRating / approvedReviews.length).toFixed(1));
//   this.rating.count = approvedReviews.length;

//   // Update rating distribution
//   this.rating.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//   approvedReviews.forEach(review => {
//     this.rating.distribution[review.rating]++;
//   });
// };

// productSchema.methods.isLowStock = function() {
//   return this.manageStock && this.stock <= this.lowStockAlert;
// };

// productSchema.methods.getPrimaryImage = function() {
//   const primary = this.images.find(img => img.isPrimary);
//   return primary ? primary.url : (this.images[0] ? this.images[0].url : null);
// };

// productSchema.methods.incrementViews = function() {
//   this.views += 1;
//   return this.save();
// };

// productSchema.methods.incrementSales = function(quantity = 1) {
//   this.salesCount += quantity;
//   this.stock = Math.max(0, this.stock - quantity);
//   return this.save();
// };

// productSchema.methods.addToWishlist = function() {
//   this.wishlistCount += 1;
//   return this.save();
// };

// productSchema.methods.removeFromWishlist = function() {
//   this.wishlistCount = Math.max(0, this.wishlistCount - 1);
//   return this.save();
// };

// // ==================== STATIC METHODS ====================
// productSchema.statics.searchProducts = function(query, filters = {}, userType = 'user') {
//   const {
//     minPrice,
//     maxPrice,
//     minRating,
//     minDiscount,
//     category,
//     brand,
//     inStock,
//     featured,
//     page = 1,
//     limit = 12,
//     sortBy = 'createdAt',
//     sortOrder = 'desc'
//   } = filters;

//   let searchQuery = {};

//   // Different access for admin vs user
//   if (userType === 'user') {
//     searchQuery.status = 'active';
//     searchQuery.published = true;
//   }

//   // Text search
//   if (query) {
//     searchQuery.$text = { $search: query };
//   }

//   // Price range
//   if (minPrice || maxPrice) {
//     searchQuery.price = {};
//     if (minPrice) searchQuery.price.$gte = parseInt(minPrice);
//     if (maxPrice) searchQuery.price.$lte = parseInt(maxPrice);
//   }

//   // Rating filter
//   if (minRating) {
//     searchQuery['rating.average'] = { $gte: parseFloat(minRating) };
//   }

//   // Discount filter
//   if (minDiscount) {
//     searchQuery.discount = { $gte: parseInt(minDiscount) };
//   }

//   // Category filter
//   if (category) {
//     searchQuery.category = new RegExp(category, 'i');
//   }

//   // Brand filter
//   if (brand) {
//     searchQuery.brand = new RegExp(brand, 'i');
//   }

//   // Stock filter
//   if (inStock === 'true') {
//     searchQuery.stock = { $gt: 0 };
//   }

//   // Featured filter
//   if (featured !== undefined) {
//     searchQuery.featured = featured === 'true';
//   }

//   const sortOptions = {};
//   sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

//   // Select fields based on user type
//   let selectFields = '';
//   if (userType === 'user') {
//     selectFields = '-costPrice -notes -internalCode -createdBy -updatedBy';
//   }

//   return this.find(searchQuery)
//     .select(selectFields)
//     .sort(sortOptions)
//     .limit(limit * 1)
//     .skip((page - 1) * limit)
//     .populate('createdBy', 'name email')
//     .populate('updatedBy', 'name email')
//     .exec();
// };

// productSchema.statics.getCategories = function() {
//   return this.distinct('category', { status: 'active', published: true });
// };

// productSchema.statics.getBrands = function() {
//   return this.distinct('brand', { status: 'active', published: true }).then(brands => 
//     brands.filter(brand => brand && brand.trim() !== '')
//   );
// };

// productSchema.statics.getFeaturedProducts = function(limit = 8) {
//   return this.find({ 
//     status: 'active', 
//     published: true, 
//     featured: true,
//     stock: { $gt: 0 }
//   })
//   .limit(limit)
//   .sort({ 'rating.average': -1, salesCount: -1 })
//   .exec();
// };

// productSchema.statics.getRelatedProducts = function(productId, category, limit = 4) {
//   return this.find({
//     _id: { $ne: productId },
//     category: category,
//     status: 'active',
//     published: true,
//     stock: { $gt: 0 }
//   })
//   .limit(limit)
//   .sort({ 'rating.average': -1, salesCount: -1 })
//   .exec();
// };

// productSchema.statics.getProductsForAdmin = function(filters = {}) {
//   const {
//     status,
//     category,
//     featured,
//     lowStock,
//     search,
//     page = 1,
//     limit = 50,
//     sortBy = 'createdAt',
//     sortOrder = 'desc'
//   } = filters;

//   let query = {};

//   if (status) query.status = status;
//   if (category) query.category = new RegExp(category, 'i');
//   if (featured !== undefined) query.featured = featured === 'true';
//   if (lowStock === 'true') {
//     query.$expr = { $lte: ['$stock', '$lowStockAlert'] };
//   }
//   if (search) {
//     query.$text = { $search: search };
//   }

//   const sortOptions = {};
//   sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

//   return this.find(query)
//     .sort(sortOptions)
//     .limit(limit * 1)
//     .skip((page - 1) * limit)
//     .populate('createdBy', 'name email')
//     .populate('updatedBy', 'name email')
//     .exec();
// };

// // ==================== PRE-SAVE MIDDLEWARE ====================
// productSchema.pre('save', function(next) {
//   // Auto-generate SKU if not provided
//   if (!this.sku) {
//     this.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
//   }

//   // Auto-generate slug if not provided
//   if (!this.seo.slug && this.name) {
//     this.seo.slug = this.name
//       .toLowerCase()
//       .replace(/[^a-z0-9 -]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/-+/g, '-');
//   }

//   // Calculate discount if not provided but prices are set
//   if (!this.discount && this.originalPrice && this.price && this.originalPrice > this.price) {
//     this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
//   }

//   // Set thumbnail from primary image
//   if (!this.thumbnail && this.images.length > 0) {
//     this.thumbnail = this.getPrimaryImage();
//   }

//   // Update rating if reviews are modified
//   if (this.reviews && this.reviews.isModified) {
//     this.updateRating();
//   }

//   next();
// });

// // Update timestamp on review changes
// productSchema.pre('save', function(next) {
//   if (this.reviews && this.reviews.isModified()) {
//     this.updatedAt = Date.now();
//   }
//   next();
// });

// const ProductModel = mongoose.model('Product', productSchema);
// export default ProductModel;
