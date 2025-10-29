// 学祭紹介ページのプログラム説明文を products/page の各商品ページから取得して反映します
(function(){
  const sources = [
    {
      key: 'sumo',
      url: '../products/page/product-SumoRobot.html',
      descId: 'desc-sumo',
    },
    {
      key: 'buruburu',
      url: '../products/page/product-buruburu.html',
      descId: 'desc-buruburu',
    },
    {
      key: 'lt',
      url: '../products/page/product-LineTracer.html',
      descId: 'desc-lt',
    }
  ];

  function extractDescription(htmlText){
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const left = doc.querySelector('.main-content .content-left');
      if (!left) return null;
      const ps = Array.from(left.querySelectorAll('p'));
      if (!ps.length) return null;
      // 値段や人数などの行は除外し、説明っぽい最初の2〜3段落を採用
      const filtered = ps
        .map(p => (p.textContent || '').trim())
        .filter(t => t && !/^値段/.test(t) && !/^対応人数/.test(t) && !/^授業時間/.test(t));
      const top = filtered.slice(0, 3);
      if (!top.length) return null;
      // 改行は <br> に置換
      const html = top.map(t => t.replace(/\n+/g, '<br>')).join('<br>');
      return html;
    } catch (e){
      console.error('extractDescription failed', e);
      return null;
    }
  }

  async function loadAndInject(){
    await Promise.all(sources.map(async (s) => {
      try {
        const res = await fetch(s.url, { cache: 'no-store' });
        if (!res.ok) return;
        const text = await res.text();
        const desc = extractDescription(text);
        if (desc){
          const el = document.getElementById(s.descId);
          if (el){
            el.innerHTML = desc;
          }
        }
      } catch (e){
        console.warn('Failed to fetch product page:', s.url, e);
      }
    }));
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', loadAndInject);
  } else {
    loadAndInject();
  }
})();
