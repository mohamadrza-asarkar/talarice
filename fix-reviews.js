import fs from 'fs';
let content = fs.readFileSync('src/pages/product/index.jsx', 'utf8');

const target = `{activeTab === 'reviews' && (
              <div className={styles.reviewsList}>
                <div className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewerName}>کاربر سایت</span>
                    <div className={styles.reviewStars}>
                      <i className="fa-solid fa-star" />
                      <i className="fa-solid fa-star" />
                      <i className="fa-solid fa-star" />
                      <i className="fa-solid fa-star" />
                      <i className="fa-solid fa-star" />
                    </div>
                  </div>
                  <p className={styles.reviewText}>
                    کیفیت محصول بسیار عالی بود. عطر و طعم فوق‌العاده‌ای داشت.
                  </p>
                </div>
              </div>
            )}`;

const replacement = `{activeTab === 'reviews' && (
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

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/pages/product/index.jsx', content, 'utf8');
    console.log("Success");
} else {
    // try to regex replace
    const regex = /\{activeTab === 'reviews' && \([\s\S]*?<\/div>\s*<\/div>\s*\)\}/m;
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync('src/pages/product/index.jsx', content, 'utf8');
        console.log("Success with Regex");
    } else {
        console.log("Not found");
    }
}
