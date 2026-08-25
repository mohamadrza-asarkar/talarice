import fs from 'fs';
let content = fs.readFileSync('server.js', 'utf8');

const regex = /\/\/ Products\napp\.get\('\/api\/products'[\s\S]*?res\.json\(\{ success: true \}\);\n\}\);/m;

const replacement = `// File Upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const imageUrl = \`/uploads/\${req.file.filename}\`;
  res.json({ success: true, url: imageUrl });
});

// Products
app.get('/api/products', (req, res) => {
  res.json({ success: true, data: products });
});
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p._id === req.params.id);
  if (product) {
    res.json({ success: true, data: product });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});
app.post('/api/products', (req, res) => {
  const newProduct = { _id: Date.now().toString(), reviews: [], ...req.body };
  products = [newProduct, ...products];
  res.json({ success: true, data: newProduct });
});
app.put("/api/products/:id", (req, res) => {
  products = products.map(p => p._id === req.params.id ? { ...p, ...req.body } : p);
  res.json({ success: true }); 
});
app.delete('/api/products/:id', (req, res) => {
  products = products.filter(p => p._id !== req.params.id);
  res.json({ success: true });
});

// Reviews
app.post('/api/products/:id/reviews', (req, res) => {
  const productIndex = products.findIndex(p => p._id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  const newReview = { 
    id: Date.now().toString(), 
    date: new Intl.DateTimeFormat('fa-IR').format(new Date()),
    ...req.body 
  };
  if (!products[productIndex].reviews) {
    products[productIndex].reviews = [];
  }
  products[productIndex].reviews.push(newReview);
  res.json({ success: true, data: newReview });
});`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('server.js', content, 'utf8');
  console.log("Success");
} else {
  console.log("Regex not matched!");
}
