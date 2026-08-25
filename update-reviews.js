import fs from 'fs';
let content = fs.readFileSync('src/pages/product/index.jsx', 'utf8');

// We need to add state for review input and a submit function
content = content.replace(
  "  const [activeTab, setActiveTab] = useState('desc');",
  `  const [activeTab, setActiveTab] = useState('desc');
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  
  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim() || !reviewerName.trim()) return;
    try {
      const res = await fetch(\`http://localhost:3000/api/products/\${product.id}/reviews\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: reviewerName, text: reviewText, rating: 5 })
      });
      if (res.ok) {
        setReviewText('');
        setReviewerName('');
        alert('نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.');
        // Optionally refresh data here
      }
    } catch(err) {
      alert('خطا در ثبت نظر');
    }
  };`
);

// Replace the reviews list content
const reviewsStart = "{activeTab === 'reviews' && (";
const reviewsReplacement = `{activeTab === 'reviews' && (
              <div className={styles.reviewsList}>
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev, idx) => (
                    <div key={idx} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <span className={styles.reviewerName}>{rev.name || 'کاربر سایت'}</span>
                        <div className={styles.reviewStars}>
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                        </div>
                      </div>
                      <p className={styles.reviewText}>
                        {rev.text}
                      </p>
                      <span className="text-xs text-gray-400 mt-2 block">{rev.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 mb-4">هنوز نظری برای این محصول ثبت نشده است.</p>
                )}
                
                <form onSubmit={submitReview} className="mt-8 border-t border-gray-100 pt-6">
                  <h4 className="font-bold text-sm text-[#042a1b] mb-4">ثبت نظر جدید</h4>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="نام شما" 
                      value={reviewerName} 
                      onChange={e => setReviewerName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#d4af37]"
                      required
                    />
                    <textarea 
                      placeholder="نظر خود را بنویسید..." 
                      value={reviewText} 
                      onChange={e => setReviewText(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#d4af37] resize-none"
                      rows="3"
                      required
                    />
                    <button type="submit" className="bg-[#042a1b] text-[#d4af37] px-6 py-2 rounded-xl text-sm font-bold">ثبت نظر</button>
                  </div>
                </form>
              </div>
            )}`;

// Use simple replacement by finding the blocks
const lines = content.split('\n');
let newLines = [];
let inReviews = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{activeTab === 'reviews' && (")) {
    inReviews = true;
    newLines.push(reviewsReplacement);
    // Need to skip until the matching closing brace/paren
    // It's a bit hard to count braces accurately in JS string split
    // Let's just find the end of the div
  }
  
  if (inReviews) {
    if (lines[i].includes(")}")) {
       inReviews = false;
    }
    continue;
  }
  
  newLines.push(lines[i]);
}

// Since regex is hard here, let me use regex properly instead of counting.
fs.writeFileSync('src/pages/product/index.jsx', content, 'utf8');
