import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/ProductsTab.jsx', 'utf8');

// Replace handleSubmit and states
content = content.replace(
  "  const [search, setSearch] = useState('');",
  `  const [search, setSearch] = useState('');
  const [imageFile, setImageFile] = useState(null);`
);

content = content.replace(
  "setFormData({ name: '', price: '', stock: '', category: 'برنج', origin: '', image: '', description: '' });",
  "setFormData({ name: '', price: '', stock: '', category: 'برنج', origin: '', image: '', description: '' });\n      setImageFile(null);"
);

content = content.replace(
  "const payload = { ...formData, price: Number(formData.price), stock: Number(formData.stock), inStock: Number(formData.stock) > 0 };",
  `let imageUrl = formData.image;
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const res = await fetch('http://localhost:3000/api/upload', { method: 'POST', body: uploadData });
        const json = await res.json();
        if (json.success) imageUrl = json.url;
      }
      const payload = { ...formData, price: Number(formData.price), stock: Number(formData.stock), inStock: Number(formData.stock) > 0, image: imageUrl };`
);

// Replace file input
const inputRegex = /<input type="text" placeholder="https:\/\/..." value=\{formData.image\} onChange=\{e => setFormData\(\{\.\.\.formData, image: e\.target\.value\}\)\} dir="ltr" className="w-full p-4 bg-white border border-slate-300 shadow-none rounded-2xl text-sm font-bold focus:border-\[#d4af37\] outline-none transition-colors" \/>/;
content = content.replace(
  inputRegex,
  `<input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full p-4 bg-white border border-slate-300 shadow-none rounded-2xl text-sm font-bold focus:border-[#d4af37] outline-none transition-colors" />`
);

// Replace image label
content = content.replace(
  '<label className="text-xs font-bold text-slate-600">لینک تصویر (URL)</label>',
  '<label className="text-xs font-bold text-slate-600">تصویر محصول</label>'
);

fs.writeFileSync('src/pages/admin/ProductsTab.jsx', content, 'utf8');
