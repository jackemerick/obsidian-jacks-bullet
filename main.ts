import {
  App,
  ButtonComponent,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
} from "obsidian";

// ─── Types ────────────────────────────────────────────────────────────────────

interface JacksBulletSettings {
  userName: string;
  onboardingDone: boolean;
  logsFolder: string;
  projectsFolder: string;
  collectionsFolder: string;
  recurringFile: string;
}

function defaultFolders(name: string) {
  const n = name || "My";
  return {
    logsFolder: `${n}'s Logs`,
    projectsFolder: `${n}'s Projects`,
    collectionsFolder: `${n}'s Collections`,
    recurringFile: "recurring.md",
  };
}

const DEFAULT_SETTINGS: JacksBulletSettings = {
  userName: "",
  onboardingDone: false,
  logsFolder: "logs",
  projectsFolder: "projects",
  collectionsFolder: "collections",
  recurringFile: "recurring.md",
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

function today(): Date {
  return new Date();
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function dateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function monthStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

function yearStr(d: Date): string {
  return String(d.getFullYear());
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function monthName(d: Date): string {
  return MONTH_NAMES[d.getMonth()];
}

function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

// ─── Template builders ────────────────────────────────────────────────────────

function buildRecurring(): string {
  return `# Recurring Tasks

> Add one task per line below. These will be automatically included in every daily log.
> Use plain text — no checkboxes needed here.

-
-
`;
}

function buildDailyLog(d: Date, recurringTasks: string[], migratedTasks: string[]): string {
  const ds = dateStr(d);
  const ms = monthStr(d);
  const year = yearStr(d);
  const yesterday = dateStr(addDays(d, -1));
  const tomorrow = dateStr(addDays(d, 1));
  const prevMs = monthStr(addDays(d, -1));
  const nextMs = monthStr(addDays(d, 1));

  const recurring = recurringTasks.length > 0
    ? recurringTasks.map((t) => `- [ ] ${t}`).join("\n")
    : "- [ ] ";

  const inherited = migratedTasks.length > 0
    ? migratedTasks.map((t) => `- [>] ${t}`).join("\n")
    : "- [ ] ";

  return `# Daily Log — ${ds}

← [[${prevMs}/${yesterday}|← Yesterday]] | [[${nextMs}/${tomorrow}|Tomorrow →]]
[[../../monthly/${ms}|↑ ${monthName(d)} ${year}]]

---

## Recurring Tasks

${recurring}

---

## Projects

> Active tasks (not backlog) from each ongoing project.

- [ ]

---

## Inherited from Yesterday

${inherited}

---

## Events

- ○

---

## Notes

–

---

*← [[../../../INDEX|Dashboard]] | [[../../monthly/${ms}|Monthly Log]]*
`;
}

function buildMonthlyLog(d: Date, projectsFolder: string): string {
  const ms = monthStr(d);
  const year = yearStr(d);
  const name = monthName(d);
  const prevMs = monthStr(addMonths(d, -1));
  const nextMs = monthStr(addMonths(d, 1));
  const days = daysInMonth(d);

  const calendarRows = Array.from({ length: days }, (_, i) => {
    const day = pad(i + 1);
    return `| ${year}-${pad(d.getMonth() + 1)}-${day} | |`;
  }).join("\n");

  return `# Monthly Log — ${name} ${year}

← [[${prevMs}|← Previous Month]] | [[${nextMs}|Next Month →]]

---

## Event Calendar

| Date | Event |
|---|---|
${calendarRows}

---

## Tasks & Projects This Month

- [ ]
- [ ]

### Active Projects

- [[../../${projectsFolder}/|]]

---

## Habits & Metrics

| Habit / Metric | Goal | Result |
|---|---|---|
| | | |

---

## Migrated from Previous Month

- [ ]

---

## Monthly Review

**What worked well?**
-

**What didn't work?**
-

**What should I change?**
-

---

*← [[../../INDEX|Dashboard]] | [[../../future/${year}-future|Future Log ${year}]]*
`;
}

function buildFutureLog(year: string): string {
  return `# Future Log — ${year}

> Events and tasks without a defined month, or more than one month away.
> At the start of each month, migrate what's relevant to the Monthly Log.

---

## January
-

## February
-

## March
-

## April
-

## May
-

## June
-

## July
-

## August
-

## September
-

## October
-

## November
-

## December
-

---

*← [[../../INDEX|Dashboard]]*
`;
}

function buildCollection(name: string): string {
  const ds = dateStr(today());
  return `# Collection — ${name}

**Created:** ${ds}

---

> Describe in one line what you collect here.

---

## List

-
-

---

*← [[../INDEX|Dashboard]]*
`;
}

function buildProjectLog(name: string): string {
  const ds = dateStr(today());
  return `# Project — ${name}

**Status:** \`Active\`
**Started:** ${ds}
**Deadline:** —

---

## Description

> What is this project? One line.

---

## Goal

> What problem needs to be solved?

---

## Active Tasks

> These appear in daily logs. Keep it short — max 5 tasks at a time.

- [ ]
- [ ]

---

## Backlog

> Everything you think could become a future task. No commitment.

- [ ]
- [ ]

---

## Notes & Context

-

---

*← [[../INDEX|Dashboard]]*
`;
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default class JacksBulletPlugin extends Plugin {
  settings: JacksBulletSettings;

  async onload() {
    await this.loadSettings();

    this.addRibbonIcon("book-open", "Today's Log", async () => {
      await this.openOrCreateDailyLog(today());
    });

    this.addRibbonIcon("folder-plus", "New Project", async () => {
      new NewProjectModal(this.app, async (name) => {
        await this.createProjectLog(name);
      }).open();
    });

    this.addRibbonIcon("library", "New Collection", async () => {
      new NewCollectionModal(this.app, async (name) => {
        await this.createCollection(name);
      }).open();
    });

    this.addCommand({
      id: "open-today",
      name: "Open today's log",
      callback: async () => { await this.openOrCreateDailyLog(today()); },
    });

    this.addCommand({
      id: "new-monthly",
      name: "New monthly log",
      callback: async () => { await this.openOrCreateMonthlyLog(today()); },
    });

    this.addCommand({
      id: "new-future",
      name: "New future log",
      callback: async () => { await this.openOrCreateFutureLog(yearStr(today())); },
    });

    this.addCommand({
      id: "new-project",
      name: "New project",
      callback: async () => {
        new NewProjectModal(this.app, async (name) => {
          await this.createProjectLog(name);
        }).open();
      },
    });

    this.addCommand({
      id: "open-index",
      name: "Open Dashboard (INDEX)",
      callback: async () => { await this.openFile("INDEX.md"); },
    });

    this.addCommand({
      id: "edit-recurring",
      name: "Edit recurring tasks",
      callback: async () => { await this.openRecurringFile(); },
    });

    this.addCommand({
      id: "new-collection",
      name: "New collection",
      callback: async () => {
        new NewCollectionModal(this.app, async (name) => {
          await this.createCollection(name);
        }).open();
      },
    });

    this.addSettingTab(new JacksBulletSettingTab(this.app, this));

    // garante que as pastas existem sempre que o plugin carrega
    if (this.settings.onboardingDone) {
      await this.initFolders();
    }

    // URL scheme: obsidian://jacks-bullet?action=daily
    this.registerObsidianProtocolHandler("jacks-bullet", async (params) => {
      if (params.action === "daily") await this.openOrCreateDailyLog(today());
      if (params.action === "monthly") await this.openOrCreateMonthlyLog(today());
      if (params.action === "index") await this.openFile("INDEX.md");
    });

    if (!this.settings.onboardingDone) {
      setTimeout(() => {
        new OnboardingModal(this.app, this).open();
      }, 800);
    }
  }

  // ─── File helpers ──────────────────────────────────────────────────────────

  async ensureFolder(path: string) {
    const parts = path.split("/");
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!this.app.vault.getAbstractFileByPath(current)) {
        await this.app.vault.createFolder(current);
      }
    }
  }

  async createFile(path: string, content: string): Promise<TFile> {
    const folderPath = path.substring(0, path.lastIndexOf("/"));
    if (folderPath) await this.ensureFolder(folderPath);
    return await this.app.vault.create(path, content);
  }

  async openFile(path: string) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) {
      await this.app.workspace.getLeaf(false).openFile(file);
    }
  }

  get dailyFolder() { return `${this.settings.logsFolder}/daily`; }
  get monthlyFolder() { return `${this.settings.logsFolder}/monthly`; }
  get futureFolder() { return `${this.settings.logsFolder}/future`; }

  // ─── Recurring tasks ───────────────────────────────────────────────────────

  async getRecurringTasks(): Promise<string[]> {
    const file = this.app.vault.getAbstractFileByPath(this.settings.recurringFile);
    if (!(file instanceof TFile)) return [];

    const content = await this.app.vault.read(file);
    const tasks: string[] = [];

    for (const line of content.split("\n")) {
      const trimmed = line.replace(/^-\s*/, "").trim();
      if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith(">")) {
        tasks.push(trimmed);
      }
    }

    return tasks.filter(Boolean);
  }

  async openRecurringFile() {
    const path = this.settings.recurringFile;
    let file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
      file = await this.createFile(path, buildRecurring());
      new Notice("recurring.md created. Add your recurring tasks here.");
    }
    await this.app.workspace.getLeaf(false).openFile(file as TFile);
  }

  // ─── Log creators ──────────────────────────────────────────────────────────

  async openOrCreateDailyLog(d: Date): Promise<TFile> {
    const ms = monthStr(d);
    const ds = dateStr(d);
    const path = `${this.dailyFolder}/${ms}/${ds}.md`;

    let file = this.app.vault.getAbstractFileByPath(path);

    if (!(file instanceof TFile)) {
      const [recurring, migrated] = await Promise.all([
        this.getRecurringTasks(),
        this.getMigratedTasks(d),
      ]);
      const content = buildDailyLog(d, recurring, migrated);
      file = await this.createFile(path, content);
      new Notice(`Daily log for ${ds} created.`);
    }

    await this.app.workspace.getLeaf(false).openFile(file as TFile);
    return file as TFile;
  }

  async openOrCreateMonthlyLog(d: Date): Promise<TFile> {
    const ms = monthStr(d);
    const path = `${this.monthlyFolder}/${ms}.md`;

    let file = this.app.vault.getAbstractFileByPath(path);

    if (!(file instanceof TFile)) {
      const content = buildMonthlyLog(d, this.settings.projectsFolder);
      file = await this.createFile(path, content);
      new Notice(`Monthly log ${ms} created.`);
    }

    await this.app.workspace.getLeaf(false).openFile(file as TFile);
    return file as TFile;
  }

  async openOrCreateFutureLog(year: string): Promise<TFile> {
    const path = `${this.futureFolder}/${year}-future.md`;

    let file = this.app.vault.getAbstractFileByPath(path);

    if (!(file instanceof TFile)) {
      const content = buildFutureLog(year);
      file = await this.createFile(path, content);
      new Notice(`Future Log ${year} created.`);
    }

    await this.app.workspace.getLeaf(false).openFile(file as TFile);
    return file as TFile;
  }

  async initFolders() {
    await Promise.all([
      this.ensureFolder(this.settings.logsFolder),
      this.ensureFolder(`${this.settings.logsFolder}/daily`),
      this.ensureFolder(`${this.settings.logsFolder}/monthly`),
      this.ensureFolder(`${this.settings.logsFolder}/future`),
      this.ensureFolder(this.settings.projectsFolder),
      this.ensureFolder(this.settings.collectionsFolder),
    ]);
  }

  async createCollection(name: string): Promise<TFile> {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const path = `${this.settings.collectionsFolder}/${slug}.md`;

    let file = this.app.vault.getAbstractFileByPath(path);

    if (file instanceof TFile) {
      new Notice(`Collection "${name}" already exists.`);
      await this.app.workspace.getLeaf(false).openFile(file);
      return file;
    }

    const content = buildCollection(name);
    file = await this.createFile(path, content);
    new Notice(`Collection "${name}" created.`);
    await this.app.workspace.getLeaf(false).openFile(file as TFile);
    return file as TFile;
  }

  async createProjectLog(name: string): Promise<TFile> {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const path = `${this.settings.projectsFolder}/${slug}.md`;

    let file = this.app.vault.getAbstractFileByPath(path);

    if (file instanceof TFile) {
      new Notice(`Project "${name}" already exists.`);
      await this.app.workspace.getLeaf(false).openFile(file);
      return file;
    }

    const content = buildProjectLog(name);
    file = await this.createFile(path, content);
    new Notice(`Project "${name}" created.`);
    await this.app.workspace.getLeaf(false).openFile(file as TFile);
    return file as TFile;
  }

  // ─── Migration ─────────────────────────────────────────────────────────────

  async getMigratedTasks(d: Date): Promise<string[]> {
    const yesterday = addDays(d, -1);
    const ms = monthStr(yesterday);
    const ds = dateStr(yesterday);
    const path = `${this.dailyFolder}/${ms}/${ds}.md`;

    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return [];

    const content = await this.app.vault.read(file);
    const tasks: string[] = [];
    const lines = content.split("\n");
    let inRecurring = false;

    for (const line of lines) {
      if (line.includes("## Recurring Tasks")) { inRecurring = true; continue; }
      if (inRecurring && line.startsWith("## ")) inRecurring = false;
      if (!inRecurring && /^- \[ \] .+/.test(line)) {
        tasks.push(line.replace(/^- \[ \] /, "").trim());
      }
    }

    return tasks;
  }

  // ─── Settings ──────────────────────────────────────────────────────────────

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

// ─── Onboarding Modal ─────────────────────────────────────────────────────────

class OnboardingModal extends Modal {
  plugin: JacksBulletPlugin;
  step: number = 0;
  userName: string = "";

  constructor(app: App, plugin: JacksBulletPlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() { this.renderStep(); }
  onClose() { this.contentEl.empty(); }

  renderStep() {
    const { contentEl } = this;
    contentEl.empty();
    const steps = [
      this.renderStep0.bind(this),
      this.renderStep1.bind(this),
      this.renderStep2.bind(this),
      this.renderStep3.bind(this),
      this.renderStep4.bind(this),
      this.renderStep5.bind(this),
    ];
    steps[this.step]();
  }

  // Passo 0 — Boas-vindas + nome
  renderStep0() {
    const { contentEl } = this;

    contentEl.createEl("h2", { text: "Welcome to Jacks Bullet" });
    contentEl.createEl("p", { text: "A Bullet Journal system for Obsidian. Let's set everything up in under 2 minutes." });
    contentEl.createEl("p", { text: "You'll create your Future Log, Monthly Log, first Daily Log, and set up your recurring tasks." });

    const nameLabel = contentEl.createEl("p", { text: "What's your name?" });
    nameLabel.style.marginTop = "16px";
    nameLabel.style.fontWeight = "600";

    const input = contentEl.createEl("input", { type: "text", placeholder: "Your name" });
    input.style.cssText = "width:100%;padding:8px;margin-top:8px;border-radius:4px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);";
    input.value = this.userName;
    input.addEventListener("input", (e) => { this.userName = (e.target as HTMLInputElement).value; });

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText("Get started →");
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(async () => {
      const name = this.userName.trim() || "My";
      this.plugin.settings.userName = name;

      const folders = defaultFolders(name);
      this.plugin.settings.logsFolder = folders.logsFolder;
      this.plugin.settings.projectsFolder = folders.projectsFolder;
      this.plugin.settings.collectionsFolder = folders.collectionsFolder;
      this.plugin.settings.recurringFile = folders.recurringFile;
      await this.plugin.saveSettings();

      // cria todas as pastas imediatamente
      await this.plugin.initFolders();

      this.step = 1;
      this.renderStep();
    });
  }

  // Passo 1 — Recurring tasks
  renderStep1() {
    const { contentEl } = this;
    const name = this.plugin.settings.userName;

    contentEl.createEl("h2", { text: "Step 1 of 5 — Recurring Tasks" });
    contentEl.createEl("p", { text: `${name}, recurring tasks are things you do every day — exercise, review email, journal, etc.` });
    contentEl.createEl("p", { text: "They're stored in a single file (recurring.md) and automatically added to every daily log." });

    const note = contentEl.createEl("p", { text: "→ Let's create your recurring tasks file. You can edit it anytime." });
    note.style.cssText = "background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText("Create recurring.md");
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(async () => {
      await this.plugin.openRecurringFile();
      this.step = 2;
      this.renderStep();
    });
  }

  // Passo 2 — Future Log
  renderStep2() {
    const { contentEl } = this;
    const name = this.plugin.settings.userName;
    const year = yearStr(today());

    contentEl.createEl("h2", { text: "Step 2 of 5 — Future Log" });
    contentEl.createEl("p", { text: `The Future Log is your yearly calendar, ${name}. Events and tasks more than a month away live here.` });
    contentEl.createEl("p", { text: "At the start of each month, migrate what's relevant to the Monthly Log." });

    const note = contentEl.createEl("p", { text: `→ Let's create the Future Log for ${year}.` });
    note.style.cssText = "background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText(`Create Future Log ${year}`);
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(async () => {
      await this.plugin.openOrCreateFutureLog(year);
      this.step = 3;
      this.renderStep();
    });
  }

  // Passo 3 — Log Mensal
  renderStep3() {
    const { contentEl } = this;
    const d = today();
    const ms = monthStr(d);
    const name = monthName(d);
    const year = yearStr(d);

    contentEl.createEl("h2", { text: "Step 3 of 5 — Monthly Log" });
    contentEl.createEl("p", { text: "The Monthly Log has the event calendar, your tasks and projects, habits to track, and space for a monthly review." });
    contentEl.createEl("p", { text: "At the start of each month, create a new one and migrate pending tasks from the previous month." });

    const note = contentEl.createEl("p", { text: `→ Let's create the Monthly Log for ${name} ${year}.` });
    note.style.cssText = "background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText(`Create Monthly Log — ${ms}`);
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(async () => {
      await this.plugin.openOrCreateMonthlyLog(d);
      this.step = 4;
      this.renderStep();
    });
  }

  // Passo 4 — Log Diário
  renderStep4() {
    const { contentEl } = this;
    const d = today();
    const ds = dateStr(d);

    contentEl.createEl("h2", { text: "Step 4 of 5 — Daily Log" });
    contentEl.createEl("p", { text: "The Daily Log is the heart of the system. Open it every day to track tasks, events, and notes." });

    const list = contentEl.createEl("ul");
    [
      "Recurring tasks — pulled automatically from recurring.md",
      "Project tasks — only active tasks, no backlog",
      "Inherited from yesterday — pending tasks carried over",
      "Events and free notes",
    ].forEach((item) => list.createEl("li", { text: item }));

    const note = contentEl.createEl("p", { text: `→ Let's create today's log (${ds}).` });
    note.style.cssText = "background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText(`Create Today's Log — ${ds}`);
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(async () => {
      await this.plugin.openOrCreateDailyLog(d);
      this.step = 5;
      this.renderStep();
    });
  }

  // Passo 5 — Conclusão e rotina
  renderStep5() {
    const { contentEl } = this;
    const name = this.plugin.settings.userName;

    contentEl.createEl("h2", { text: `All set, ${name}!` });
    contentEl.createEl("p", { text: "Your system is ready. The routine is simple:" });

    const cards = [
      { emoji: "☀️", title: "Every day", text: "Open today's log (book icon in the sidebar or Cmd+P → \"Open today's log\"). Log tasks, events, and notes." },
      { emoji: "📅", title: "Every month", text: "Create the new Monthly Log, migrate pending tasks, and review the previous month." },
      { emoji: "📋", title: "New projects", text: "Cmd+P → \"New project\". Add active tasks to your daily log." },
      { emoji: "🔮", title: "Far-off things", text: "Log in Future Log. Migrate to monthly at the start of each month." },
      { emoji: "🔁", title: "Recurring tasks", text: "Edit recurring.md once (Cmd+P → \"Edit recurring tasks\"). They appear in every daily log automatically." },
    ];

    cards.forEach(({ emoji, title, text }) => {
      const card = contentEl.createEl("div");
      card.style.cssText = "background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:10px;";
      card.createEl("strong", { text: `${emoji} ${title}` });
      card.createEl("p", { text }).style.margin = "4px 0 0 0";
    });

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText("Start using →");
    btn.setCta();
    btn.buttonEl.style.marginTop = "20px";
    btn.onClick(async () => {
      this.plugin.settings.onboardingDone = true;
      await this.plugin.saveSettings();
      this.close();
      await this.plugin.openFile("INDEX.md");
    });
  }
}

// ─── New Project Modal ────────────────────────────────────────────────────────

class NewProjectModal extends Modal {
  onSubmit: (name: string) => void;
  projectName: string = "";

  constructor(app: App, onSubmit: (name: string) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: "New Project" });

    new Setting(contentEl)
      .setName("Project name")
      .addText((text) => {
        text.setPlaceholder("e.g. Company website");
        text.onChange((value) => { this.projectName = value; });
        setTimeout(() => text.inputEl.focus(), 50);
      });

    new Setting(contentEl).addButton((btn) => {
      btn.setButtonText("Create project");
      btn.setCta();
      btn.onClick(() => {
        if (!this.projectName.trim()) {
          new Notice("Enter a project name.");
          return;
        }
        this.close();
        this.onSubmit(this.projectName.trim());
      });
    });
  }

  onClose() { this.contentEl.empty(); }
}

// ─── New Collection Modal ─────────────────────────────────────────────────────

class NewCollectionModal extends Modal {
  onSubmit: (name: string) => void;
  collectionName: string = "";

  constructor(app: App, onSubmit: (name: string) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: "New Collection" });

    new Setting(contentEl)
      .setName("Collection name")
      .addText((text) => {
        text.setPlaceholder("e.g. Books to Read");
        text.onChange((value) => { this.collectionName = value; });
        setTimeout(() => text.inputEl.focus(), 50);
      });

    new Setting(contentEl).addButton((btn) => {
      btn.setButtonText("Create collection");
      btn.setCta();
      btn.onClick(() => {
        if (!this.collectionName.trim()) {
          new Notice("Enter a collection name.");
          return;
        }
        this.close();
        this.onSubmit(this.collectionName.trim());
      });
    });
  }

  onClose() { this.contentEl.empty(); }
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

class JacksBulletSettingTab extends PluginSettingTab {
  plugin: JacksBulletPlugin;

  constructor(app: App, plugin: JacksBulletPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Jacks Bullet" });

    new Setting(containerEl)
      .setName("Logs folder")
      .setDesc("Contains daily, monthly and future subfolders.")
      .addText((t) => {
        t.setValue(this.plugin.settings.logsFolder);
        t.onChange(async (v) => {
          this.plugin.settings.logsFolder = v;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Projects folder")
      .addText((t) => {
        t.setValue(this.plugin.settings.projectsFolder);
        t.onChange(async (v) => {
          this.plugin.settings.projectsFolder = v;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Collections folder")
      .addText((t) => {
        t.setValue(this.plugin.settings.collectionsFolder);
        t.onChange(async (v) => {
          this.plugin.settings.collectionsFolder = v;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Recurring tasks file")
      .setDesc("File where recurring tasks are stored.")
      .addText((t) => {
        t.setValue(this.plugin.settings.recurringFile);
        t.onChange(async (v) => {
          this.plugin.settings.recurringFile = v;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Restart onboarding")
      .setDesc("Reopens the setup guide.")
      .addButton((btn) => {
        btn.setButtonText("Open onboarding");
        btn.onClick(() => {
          this.plugin.settings.onboardingDone = false;
          this.plugin.saveSettings();
          new OnboardingModal(this.app, this.plugin).open();
        });
      });
  }
}
