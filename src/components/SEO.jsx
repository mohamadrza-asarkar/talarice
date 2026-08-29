import { useEffect } from 'react';

export function SEO({
  title,
  description = 'خرید آنلاین برنج اصیل و معطر کامفیروزی فارس و برنج‌های درجه یک با تضمین پخت عالی، ارسال مستقیم از شالیزار و گارانتی بازگشت وجه در فروشگاه طلا رایس.',
  keywords = 'برنج کامفیروز, خرید برنج کامفیروزی, برنج معطر کامفیروز فارس, برنج اصیل ایرانی, برنج طلا رایس',
  image = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200',
  url = window.location.href,
  type = 'website',
  schema = null
}) {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title ? `${title} | طلا رایس` : 'فروشگاه طلا رایس | خرید مستقیم برنج اصیل کامفیروزی';
    document.title = formattedTitle;

    // Helper to update or create meta tags
    function setMetaTag(name, content, isProperty = false) {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content || '');
    }

    // 2. Standard Meta Tags
    setMetaTag('title', formattedTitle);
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);

    // 3. Open Graph
    setMetaTag('og:title', formattedTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:type', type, true);

    // 4. Twitter Cards
    setMetaTag('twitter:title', formattedTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // 5. Dynamic JSON-LD Schema
    let scriptTag = document.getElementById('dynamic-seo-schema');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-seo-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      const dynamicTag = document.getElementById('dynamic-seo-schema');
      if (dynamicTag) dynamicTag.remove();
    };
  }, [title, description, keywords, image, url, type, schema]);

  return null;
}

export default SEO;
