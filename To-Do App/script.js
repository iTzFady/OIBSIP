let tasks = JSON.parse(localStorage.getItem("dailyTasks") || "[]");
let editId = null;

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " at " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}

function save() {
  localStorage.setItem("dailyTasks", JSON.stringify(tasks));
}

function toast(msg, dur = 2400) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), dur);
}

function addTask() {
  const title = document.getElementById("fTitle").value.trim();
  const errEl = document.getElementById("errTitle");
  const inputEl = document.getElementById("fTitle");

  if (!title) {
    inputEl.classList.add("err");
    errEl.classList.add("show");
    return;
  }
  inputEl.classList.remove("err");
  errEl.classList.remove("show");

  tasks.unshift({
    id: uid(),
    title,
    desc: document.getElementById("fDesc").value.trim(),
    priority: document.getElementById("fPriority").value,
    category: document.getElementById("fCat").value.trim(),
    done: false,
    createdAt: new Date().toISOString(),
    doneAt: null,
  });

  save();
  render();

  document.getElementById("fTitle").value = "";
  document.getElementById("fDesc").value = "";
  document.getElementById("fCat").value = "";
  document.getElementById("fPriority").value = "medium";

  toast("Task added ✓");
}

function toggleDone(id) {
  const t = tasks.find((x) => x.id === id);
  if (!t) return;
  t.done = !t.done;
  t.doneAt = t.done ? new Date().toISOString() : null;
  save();
  render();
  toast(t.done ? "Marked complete ✓" : "Moved back to pending");
}

function deleteTask(id) {
  tasks = tasks.filter((x) => x.id !== id);
  save();
  render();
  toast("Task deleted");
}

function openEdit(id) {
  const t = tasks.find((x) => x.id === id);
  if (!t) return;
  editId = id;
  document.getElementById("mTitle").value = t.title;
  document.getElementById("mDesc").value = t.desc;
  document.getElementById("mPriority").value = t.priority;
  document.getElementById("mCat").value = t.category || "";
  document.getElementById("mErrTitle").classList.remove("show");
  document.getElementById("mTitle").classList.remove("err");
  document.getElementById("overlay").classList.add("open");
}

function saveEdit() {
  const title = document.getElementById("mTitle").value.trim();
  if (!title) {
    document.getElementById("mTitle").classList.add("err");
    document.getElementById("mErrTitle").classList.add("show");
    return;
  }
  const t = tasks.find((x) => x.id === editId);
  if (t) {
    t.title = title;
    t.desc = document.getElementById("mDesc").value.trim();
    t.priority = document.getElementById("mPriority").value;
    t.category = document.getElementById("mCat").value.trim();
  }
  save();
  render();
  closeModal();
  toast("Task updated ✓");
}

function closeModal(e) {
  if (e && e.target !== document.getElementById("overlay")) return;
  document.getElementById("overlay").classList.remove("open");
  editId = null;
}

function render() {
  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  document.getElementById("statPending").textContent = pending.length;
  document.getElementById("statDone").textContent = done.length;
  document.getElementById("statTotal").textContent = tasks.length;
  document.getElementById("badgePending").textContent =
    `${pending.length} task${pending.length !== 1 ? "s" : ""}`;
  document.getElementById("badgeDone").textContent =
    `${done.length} task${done.length !== 1 ? "s" : ""}`;

  renderList(
    "listPending",
    pending,
    "No pending tasks — you're all caught up!",
  );
  renderList("listDone", done, "Completed tasks will appear here.");
}

function renderList(containerId, items, emptyMsg) {
  const el = document.getElementById(containerId);
  if (!items.length) {
    el.innerHTML = `<div class="empty-state">${emptyMsg}</div>`;
    return;
  }

  el.innerHTML = items
    .map(
      (t) => `
    <div class="task${t.done ? " done" : ""}" id="task-${t.id}">
      <input type="checkbox" class="task-check" ${t.done ? "checked" : ""} onchange="toggleDone('${t.id}')"/>
      <div class="task-body">
        <div class="task-title">${esc(t.title)}</div>
        ${t.desc ? `<div class="task-desc">${esc(t.desc)}</div>` : ""}
        <div class="task-meta">
          <span class="tag priority-${t.priority}">${t.priority}</span>
          ${t.category ? `<span class="tag" style="background:#f5f0ea;color:#6b6155;border:1px solid #e8e0d4">${esc(t.category)}</span>` : ""}
          <span class="task-time">Added ${fmtDate(t.createdAt)}</span>
          ${t.doneAt ? `<span class="task-done-time">· Completed ${fmtDate(t.doneAt)}</span>` : ""}
        </div>
      </div>
      <div class="task-actions">
        <button class="act-btn edit" onclick="openEdit('${t.id}')" title="Edit">✏</button>
        <button class="act-btn del"  onclick="deleteTask('${t.id}')" title="Delete">✕</button>
      </div>
    </div>
  `,
    )
    .join("");
}

function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

document.getElementById("fTitle").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

render();
