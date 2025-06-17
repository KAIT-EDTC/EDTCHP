const checkboxes = document.querySelectorAll("#checkboxList input[type='checkbox']");
const inputbox = document.getElementById("memberbox");
const filterInput = document.getElementById("filterInput");
const labels = document.querySelectorAll("#checkboxList label");
const checkboxList = document.getElementById("checkboxList");
let memberList = [];

// プルダウンの開閉
function toggleDropdown() {
    const dropdown = document.getElementById("dropdownMenu");
    dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
}

// 検索ボックスにフォーカスがあるときでもプルダウンを開いたままにする
function keepDropdownOpen() {
    document.getElementById("dropdownMenu").style.display = "block";
}

// クリックイベントハンドラ(このスクリプトの場合はプルダウンの開閉)
document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("dropdownMenu");
    const button = document.querySelector(".dropdown-button");
    const inputField = document.getElementById("filterInput");

    // プルダウン以外の場所をクリックしたときにプルダウンを閉じる。
    if (!dropdown.contains(event.target) && !button.contains(event.target) && event.target !== inputField) {
        dropdown.style.display = "none";
    }
});

// フィルターハンドラ
filterInput.addEventListener("input", function() {
    const filter = this.value;
    labels.forEach(label => {
        const text = label.textContent;
        label.style.display = text.includes(filter) ? "inline" : "none";
    });
});

checkboxes.forEach(checkbox => {    
    checkbox.addEventListener("change", () => addMember(checkbox));
});

// 
function addMember(checkbox) {
    // 0(全員)が選択された時は、それ以外のチェックボックスを全て無効化する。
    if (checkbox.value == "0") {
        checkboxes.forEach(checkbox => {
            if (checkbox.value != "0") {
                memberList = [];
                checkbox.checked = false;
                checkbox.disabled = checkbox.checked;
            }
        });
    }

    // 選択されたチェックボックスをリストに追加する(チェックが外れたらリストから削除する)。
    if (checkbox.checked) {
        const SID = checkbox.value;
        if (!memberList.includes(SID)) {
            memberList.push(SID);
        }
    } else {
        const SID = checkbox.value;
        memberList = memberList.filter(member => member !== SID);
    }

    inputbox.value = memberList.join(",");
}
