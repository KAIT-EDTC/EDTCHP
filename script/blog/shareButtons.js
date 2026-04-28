/**
 * シェアボタンの共有ロジック
 */

function getShareData() {
    const url = location.href;
    const titleEl = document.getElementById('blog-title');
    const title = titleEl ? titleEl.textContent.trim() : document.title;
    return { url, title };
}

function showCheckmark(btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 4.685l-16.327 17.315-7.673-9.054.761-.648 6.95 8.203 15.561-16.501.728.685z"/></svg>';
    setTimeout(() => { btn.innerHTML = originalHTML; }, 1500);
}

function handleShareX() {
    const { url, title } = getShareData();
    const intentUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
}

async function handleCopyLink(e) {
    const btn = e.currentTarget;
    const { url } = getShareData();
    try {
        await navigator.clipboard.writeText(url);
        showCheckmark(btn);
    } catch {
        // fallback: do nothing
    }
}

document.querySelectorAll('.share-x').forEach(btn => btn.addEventListener('click', handleShareX));
document.querySelectorAll('.share-copy').forEach(btn => btn.addEventListener('click', handleCopyLink));
