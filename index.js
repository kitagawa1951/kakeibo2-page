"use strict";

const STORAGE_KEY = "kakeiboEntries";

const form = document.getElementById("ledger-form");
const ledgerList = document.getElementById("ledger-list");
const totalAmount = document.getElementById("total-amount");

function loadEntries() {
  const savedEntries = localStorage.getItem(STORAGE_KEY);

  if (!savedEntries) {
    return [];
  }

  try {
    const entries = JSON.parse(savedEntries);
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatAmount(amount) {
  return new Intl.NumberFormat("ja-JP").format(amount);
}

function renderEntries(entries) {
  ledgerList.replaceChildren();

  if (entries.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 4;
    emptyCell.textContent = "登録されたデータはありません。";
    emptyRow.appendChild(emptyCell);
    ledgerList.appendChild(emptyRow);
  } else {
    entries.forEach((entry) => {
      const row = document.createElement("tr");

      const dateCell = document.createElement("td");
      dateCell.textContent = entry.date;

      const itemCell = document.createElement("td");
      itemCell.textContent = entry.item;

      const typeCell = document.createElement("td");
      typeCell.textContent = entry.type === "income" ? "収入" : "支出";

      const amountCell = document.createElement("td");
      amountCell.textContent = `${formatAmount(entry.amount)} 円`;
      amountCell.classList.add("amount-cell");

      row.append(dateCell, itemCell, typeCell, amountCell);
      ledgerList.appendChild(row);
    });
  }

  const total = entries.reduce((sum, entry) => {
    return entry.type === "income"
      ? sum + entry.amount
      : sum - entry.amount;
  }, 0);

  const sign = total < 0 ? "-" : "";
  totalAmount.textContent = `${sign}${formatAmount(Math.abs(total))} 円`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const newEntry = {
    date: formData.get("date"),
    item: formData.get("item").trim(),
    type: formData.get("type"),
    amount: Number(formData.get("amount")),
  };

  const entries = loadEntries();
  entries.push(newEntry);
  saveEntries(entries);
  renderEntries(entries);
  form.reset();
});

renderEntries(loadEntries());
