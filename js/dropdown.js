const inputbox = document.getElementById("memberbox");
const dropdown = document.getElementById("dropdownMenu");
const filterInput = document.getElementById("filterInput");
const checkboxList = document.getElementById("checkboxList");
const button = document.querySelector(".dropdown-button");
const labels = Array.from(checkboxList.querySelectorAll("label"));
let memberList = [];
const ALL_MEMBER_NUM = "0";

// プルダウンの開閉
button.addEventListener("click", e => {
    e.stopPropagation(); // この要素の親以上のイベントは無視される。
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

// プルダウン以外クリックで閉じる
document.addEventListener("click", e => {
    if (!dropdown.contains(e.target)) dropdown.style.display = "none";
});

// フィルターハンドラ
// labelのテキストで曖昧検索->labelのidとcheckboxのvalueで完全一致検索をする->アペンド
filterInput.addEventListener("input", () => {
    const filter = this.value;
    checkboxList.innerHTML = "";
    labels.forEach(label => {
        if (label.textContent.includes(filter)) {
            checkboxList.appendChild(label);
            checkboxList.appendChild(document.createElement("br"));
        }
    });
});

// チェックボックスのイベント委譲
checkboxList.addEventListener("change", e => {
    if (e.target.type !== "checkbox") return;
    const checkbox = e.target;
    if (checkbox.value === ALL_MEMBER_NUM) {
        memberList = [];
        Array.from(checkboxList.querySelectorAll("input[type='checkbox']")).forEach(c => {
            if (c.value !== ALL_MEMBER_NUM) {
                c.checked = false;
                c.disabled = checkbox.checked;
            }
        });
    }
    const SID = checkbox.value;
    if (checkbox.checked) {
        if (!memberList.includes(SID)) memberList.push(SID);
    } else {
        memberList = memberList.filter(member => member !== SID);
    }
    inputbox.value = memberList.join(",");
});
