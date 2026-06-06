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

interface JackJournalSettings {
  userName: string;
  onboardingDone: boolean;
  logsFolder: string;
  projectsFolder: string;
  collectionsFolder: string;
  recurringFile: string;
}

function defaultFolders(name: string) {
  const n = name || "Meu";
  return {
    logsFolder: `Diário de ${n}`,
    projectsFolder: `Projetos de ${n}`,
    collectionsFolder: `Coleções de ${n}`,
    recurringFile: "recorrentes.md",
  };
}

const DEFAULT_SETTINGS: JackJournalSettings = {
  userName: "",
  onboardingDone: false,
  logsFolder: "logs",
  projectsFolder: "projetos",
  collectionsFolder: "coleções",
  recurringFile: "recorrentes.md",
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

const WEEKDAY_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function monthName(d: Date): string {
  return MONTH_NAMES[d.getMonth()];
}

function calendarDateStr(year: number, month: number, day: number): string {
  const d = new Date(year, month, day);
  const dd = pad(day);
  const mm = pad(month + 1);
  const yy = String(year).slice(2);
  const dow = WEEKDAY_SHORT[d.getDay()];
  return `${dd}/${mm}/${yy} - ${dow}`;
}

function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

// ─── Template builders ────────────────────────────────────────────────────────

function buildRecurring(): string {
  return `# Tarefas Recorrentes

> Adicione uma tarefa por linha abaixo. Elas serão incluídas automaticamente em cada log diário.
> Use texto simples — sem checkboxes aqui.

-
-
`;
}

function buildProjectsSection(projectTasks: Record<string, string[]>): string {
  const entries = Object.entries(projectTasks);
  if (entries.length === 0) return "> Nenhuma tarefa ativa em projetos.\n";
  return entries.map(([project, tasks]) =>
    `### ${project}\n${tasks.map((t) => `- [ ] ${t}`).join("\n")}`
  ).join("\n\n");
}

function buildDailyLog(d: Date, recurringTasks: string[], migratedTasks: string[], projectTasks: Record<string, string[]>): string {
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

  const projects = buildProjectsSection(projectTasks);

  return `# Diário — ${ds}

← [[${prevMs}/${yesterday}|← Ontem]] | [[${nextMs}/${tomorrow}|Amanhã →]]
[[../../mensal/${ms}|↑ ${monthName(d)} ${year}]]

---

## Tarefas Recorrentes

${recurring}

---

## Projetos

${projects}

---

## Herdado de Ontem

${inherited}

---

## Eventos

- ○

---

## Notas

–

---

*← [[../../../INDEX|Dashboard]] | [[../../mensal/${ms}|Log Mensal]]*
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
    const label = calendarDateStr(d.getFullYear(), d.getMonth(), i + 1);
    return `| ${label} | |`;
  }).join("\n");

  return `# Log Mensal — ${name} ${year}

← [[${prevMs}|← Mês anterior]] | [[${nextMs}|Próximo mês →]]

---

## Calendário de Eventos

| Data | Evento |
|---|---|
${calendarRows}

---

## Tarefas e Projetos do Mês

- [ ]
- [ ]

### Projetos ativos

- [[../../${projectsFolder}/|]]

---

## Hábitos e Métricas

| Hábito / Métrica | Meta | Resultado |
|---|---|---|
| | | |

---

## Migrado do mês anterior

- [ ]

---

## Revisão do Mês

**O que funcionou bem?**
-

**O que não funcionou?**
-

**O que preciso mudar?**
-

---

*← [[../../INDEX|Dashboard]] | [[../../futuro/${year}-futuro|Log Futuro ${year}]]*
`;
}

function buildFutureLog(year: string): string {
  return `# Log Futuro — ${year}

> Eventos e tarefas sem mês definido ou a mais de um mês de distância.
> No início de cada mês, migre o que for pertinente para o Log Mensal.

---

## Janeiro
-

## Fevereiro
-

## Março
-

## Abril
-

## Maio
-

## Junho
-

## Julho
-

## Agosto
-

## Setembro
-

## Outubro
-

## Novembro
-

## Dezembro
-

---

*← [[../../INDEX|Dashboard]]*
`;
}

function buildCollection(name: string): string {
  const ds = dateStr(today());
  return `# Coleção — ${name}

**Criada em:** ${ds}

---

> Descreva em uma linha o que você coleciona aqui.

---

## Lista

-
-

---

*← [[../INDEX|Dashboard]]*
`;
}

function buildProjectLog(name: string): string {
  const ds = dateStr(today());
  return `# Projeto — ${name}

**Status:** \`Ativo\`
**Início:** ${ds}
**Prazo:** —

---

## Descrição

> O que é este projeto? Uma linha.

---

## Objetivo

> Que problema precisa ser resolvido?

---

## Tarefas Ativas

> Aparecem nos logs diários. Máximo 5 tarefas por vez.

- [ ]
- [ ]

---

## Backlog

> Tudo que pode virar tarefa futura. Sem compromisso.

- [ ]
- [ ]

---

## Notas e Contexto

-

---

*← [[../INDEX|Dashboard]]*
`;
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default class JackJournalPlugin extends Plugin {
  settings: JackJournalSettings;

  async onload() {
    await this.loadSettings();

    this.addRibbonIcon("book-open", "Diário de Hoje", async () => {
      await this.openOrCreateDailyLog(today());
    });

    this.addRibbonIcon("folder-plus", "Novo Projeto", async () => {
      new NewProjectModal(this.app, async (name) => {
        await this.createProjectLog(name);
      }).open();
    });

    this.addRibbonIcon("library", "Nova Coleção", async () => {
      new NewCollectionModal(this.app, async (name) => {
        await this.createCollection(name);
      }).open();
    });

    this.addCommand({
      id: "open-today",
      name: "Abrir diário de hoje",
      callback: async () => { await this.openOrCreateDailyLog(today()); },
    });

    this.addCommand({
      id: "new-monthly",
      name: "Novo log mensal",
      callback: async () => { await this.openOrCreateMonthlyLog(today()); },
    });

    this.addCommand({
      id: "new-future",
      name: "Novo log futuro",
      callback: async () => { await this.openOrCreateFutureLog(yearStr(today())); },
    });

    this.addCommand({
      id: "new-project",
      name: "Novo projeto",
      callback: async () => {
        new NewProjectModal(this.app, async (name) => {
          await this.createProjectLog(name);
        }).open();
      },
    });

    this.addCommand({
      id: "open-index",
      name: "Abrir Dashboard",
      callback: async () => { await this.openFile("INDEX.md"); },
    });

    this.addCommand({
      id: "edit-recurring",
      name: "Editar tarefas recorrentes",
      callback: async () => { await this.openRecurringFile(); },
    });

    this.addCommand({
      id: "new-collection",
      name: "Nova coleção",
      callback: async () => {
        new NewCollectionModal(this.app, async (name) => {
          await this.createCollection(name);
        }).open();
      },
    });

    this.addSettingTab(new JackJournalSettingTab(this.app, this));

    if (this.settings.onboardingDone) {
      await this.initFolders();
    }

    this.registerEvent(
      this.app.vault.on("modify", async (file) => {
        if (file instanceof TFile &&
            file.path.startsWith(this.settings.projectsFolder + "/") &&
            file.extension === "md") {
          await this.syncProjectsToTodayLog();
        }
      })
    );

    // URL scheme: obsidian://jack-journal?action=diario
    this.registerObsidianProtocolHandler("jack-journal", async (params) => {
      if (params.action === "diario") await this.openOrCreateDailyLog(today());
      if (params.action === "mensal") await this.openOrCreateMonthlyLog(today());
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
        try {
          await this.app.vault.createFolder(current);
        } catch {
          // pasta já existe — ignorar
        }
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

  get dailyFolder() { return `${this.settings.logsFolder}/diario`; }
  get monthlyFolder() { return `${this.settings.logsFolder}/mensal`; }
  get futureFolder() { return `${this.settings.logsFolder}/futuro`; }

  // ─── Project tasks ─────────────────────────────────────────────────────────

  async getActiveProjectTasks(): Promise<Record<string, string[]>> {
    const folder = this.app.vault.getAbstractFileByPath(this.settings.projectsFolder);
    if (!folder) return {};

    const files = this.app.vault.getFiles().filter(f =>
      f.path.startsWith(this.settings.projectsFolder + "/") && f.extension === "md"
    );

    const result: Record<string, string[]> = {};
    for (const file of files) {
      const content = await this.app.vault.read(file);
      const tasks = this.extractActiveTasks(content);
      if (tasks.length > 0) result[file.basename] = tasks;
    }

    return result;
  }

  extractActiveTasks(content: string): string[] {
    const lines = content.split("\n");
    const tasks: string[] = [];
    let inActiveSection = false;

    for (const line of lines) {
      if (/^## Tarefas Ativas/.test(line)) { inActiveSection = true; continue; }
      if (inActiveSection && /^## /.test(line)) break;
      if (inActiveSection && /^- \[ \] .+/.test(line)) {
        tasks.push(line.replace(/^- \[ \] /, "").trim());
      }
    }

    return tasks;
  }

  async syncProjectsToTodayLog() {
    const ds = dateStr(today());
    const ms = monthStr(today());
    const path = `${this.dailyFolder}/${ms}/${ds}.md`;

    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return;

    const content = await this.app.vault.read(file);
    const projectTasks = await this.getActiveProjectTasks();
    const newSection = buildProjectsSection(projectTasks);

    const updated = content.replace(
      /(## Projetos\n)([\s\S]*?)(\n---)/,
      `$1\n${newSection}\n$3`
    );

    if (updated !== content) {
      await this.app.vault.modify(file, updated);
    }
  }

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
      new Notice("recorrentes.md criado. Adicione suas tarefas recorrentes aqui.");
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
      const [recurring, migrated, projectTasks] = await Promise.all([
        this.getRecurringTasks(),
        this.getMigratedTasks(d),
        this.getActiveProjectTasks(),
      ]);
      const content = buildDailyLog(d, recurring, migrated, projectTasks);
      file = await this.createFile(path, content);
      new Notice(`Diário de ${ds} criado.`);
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
      new Notice(`Log mensal ${ms} criado.`);
    }

    await this.app.workspace.getLeaf(false).openFile(file as TFile);
    return file as TFile;
  }

  async openOrCreateFutureLog(year: string): Promise<TFile> {
    const path = `${this.futureFolder}/${year}-futuro.md`;

    let file = this.app.vault.getAbstractFileByPath(path);

    if (!(file instanceof TFile)) {
      const content = buildFutureLog(year);
      file = await this.createFile(path, content);
      new Notice(`Log Futuro ${year} criado.`);
    }

    await this.app.workspace.getLeaf(false).openFile(file as TFile);
    return file as TFile;
  }

  async initFolders() {
    await this.ensureFolder(this.settings.logsFolder);
    await this.ensureFolder(`${this.settings.logsFolder}/diario`);
    await this.ensureFolder(`${this.settings.logsFolder}/mensal`);
    await this.ensureFolder(`${this.settings.logsFolder}/futuro`);
    await this.ensureFolder(this.settings.projectsFolder);
    await this.ensureFolder(this.settings.collectionsFolder);
  }

  async createCollection(name: string): Promise<TFile> {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const path = `${this.settings.collectionsFolder}/${slug}.md`;

    let file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) {
      new Notice(`Coleção "${name}" já existe.`);
      await this.app.workspace.getLeaf(false).openFile(file);
      return file;
    }

    const content = buildCollection(name);
    file = await this.createFile(path, content);
    new Notice(`Coleção "${name}" criada.`);
    await this.app.workspace.getLeaf(false).openFile(file as TFile);
    return file as TFile;
  }

  async createProjectLog(name: string): Promise<TFile> {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const path = `${this.settings.projectsFolder}/${slug}.md`;

    let file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) {
      new Notice(`Projeto "${name}" já existe.`);
      await this.app.workspace.getLeaf(false).openFile(file);
      return file;
    }

    const content = buildProjectLog(name);
    file = await this.createFile(path, content);
    new Notice(`Projeto "${name}" criado.`);
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
      if (line.includes("## Tarefas Recorrentes")) { inRecurring = true; continue; }
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
  plugin: JackJournalPlugin;
  step: number = 0;
  userName: string = "";

  constructor(app: App, plugin: JackJournalPlugin) {
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

  renderStep0() {
    const { contentEl } = this;

    contentEl.createEl("h2", { text: "Bem-vindo ao Jack Journal" });
    contentEl.createEl("p", { text: "Um sistema de Bullet Journal para o Obsidian. Vamos configurar tudo em menos de 2 minutos." });
    contentEl.createEl("p", { text: "Você vai criar seu Log Futuro, Log Mensal e primeiro Diário — e configurar suas tarefas recorrentes." });

    const nameLabel = contentEl.createEl("p", { text: "Como posso te chamar?" });
    nameLabel.style.marginTop = "16px";
    nameLabel.style.fontWeight = "600";

    const input = contentEl.createEl("input", { type: "text", placeholder: "Seu nome" });
    input.style.cssText = "width:100%;padding:8px;margin-top:8px;border-radius:4px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);";
    input.value = this.userName;
    input.addEventListener("input", (e) => { this.userName = (e.target as HTMLInputElement).value; });

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText("Começar →");
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(async () => {
      const name = this.userName.trim() || "Meu";
      this.plugin.settings.userName = name;

      const folders = defaultFolders(name);
      this.plugin.settings.logsFolder = folders.logsFolder;
      this.plugin.settings.projectsFolder = folders.projectsFolder;
      this.plugin.settings.collectionsFolder = folders.collectionsFolder;
      this.plugin.settings.recurringFile = folders.recurringFile;
      await this.plugin.saveSettings();
      await this.plugin.initFolders();

      this.step = 1;
      this.renderStep();
    });
  }

  renderStep1() {
    const { contentEl } = this;
    const name = this.plugin.settings.userName;

    contentEl.createEl("h2", { text: "Passo 1 de 5 — Tarefas Recorrentes" });
    contentEl.createEl("p", { text: `${name}, tarefas recorrentes são coisas que você faz todo dia — exercício, leitura, oração, etc.` });
    contentEl.createEl("p", { text: "Ficam salvas em um único arquivo (recorrentes.md) e são adicionadas automaticamente em cada diário." });

    const note = contentEl.createEl("p", { text: "→ Vamos criar seu arquivo de tarefas recorrentes. Você pode editar quando quiser." });
    note.style.cssText = "background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText("Criar recorrentes.md");
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(async () => {
      await this.plugin.openRecurringFile();
      this.step = 2;
      this.renderStep();
    });
  }

  renderStep2() {
    const { contentEl } = this;
    const name = this.plugin.settings.userName;
    const year = yearStr(today());

    contentEl.createEl("h2", { text: "Passo 2 de 5 — Log Futuro" });
    contentEl.createEl("p", { text: `O Log Futuro é seu calendário anual, ${name}. Aqui ficam eventos e tarefas a mais de um mês de distância.` });
    contentEl.createEl("p", { text: "No início de cada mês, migre o que for pertinente para o Log Mensal." });

    const note = contentEl.createEl("p", { text: `→ Vamos criar o Log Futuro de ${year}.` });
    note.style.cssText = "background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText(`Criar Log Futuro ${year}`);
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(async () => {
      await this.plugin.openOrCreateFutureLog(year);
      this.step = 3;
      this.renderStep();
    });
  }

  renderStep3() {
    const { contentEl } = this;
    const d = today();
    const ms = monthStr(d);
    const name = monthName(d);
    const year = yearStr(d);

    contentEl.createEl("h2", { text: "Passo 3 de 5 — Log Mensal" });
    contentEl.createEl("p", { text: "O Log Mensal tem o calendário do mês, tarefas e projetos, hábitos e espaço para revisão no final do mês." });
    contentEl.createEl("p", { text: "No início de cada mês, crie um novo e migre as tarefas pendentes do mês anterior." });

    const note = contentEl.createEl("p", { text: `→ Vamos criar o Log Mensal de ${name} ${year}.` });
    note.style.cssText = "background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText(`Criar Log Mensal — ${ms}`);
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(async () => {
      await this.plugin.openOrCreateMonthlyLog(d);
      this.step = 4;
      this.renderStep();
    });
  }

  renderStep4() {
    const { contentEl } = this;
    const d = today();
    const ds = dateStr(d);

    contentEl.createEl("h2", { text: "Passo 4 de 5 — Diário" });
    contentEl.createEl("p", { text: "O Diário é o coração do sistema. Abra todo dia para registrar tarefas, eventos e notas." });

    const list = contentEl.createEl("ul");
    [
      "Tarefas recorrentes — puxadas automaticamente de recorrentes.md",
      "Tarefas de projetos — só as tarefas ativas, sem backlog",
      "Herdado de ontem — tarefas pendentes do dia anterior",
      "Eventos e notas livres",
    ].forEach((item) => list.createEl("li", { text: item }));

    const note = contentEl.createEl("p", { text: `→ Vamos criar o diário de hoje (${ds}).` });
    note.style.cssText = "background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText(`Criar Diário de Hoje — ${ds}`);
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(async () => {
      await this.plugin.openOrCreateDailyLog(d);
      this.step = 5;
      this.renderStep();
    });
  }

  renderStep5() {
    const { contentEl } = this;
    const name = this.plugin.settings.userName;

    contentEl.createEl("h2", { text: `Pronto, ${name}!` });
    contentEl.createEl("p", { text: "Seu sistema está configurado. A rotina é simples:" });

    const cards = [
      { emoji: "☀️", title: "Todo dia", text: "Abra o diário (ícone do livro na barra lateral ou Cmd+P → \"Abrir diário de hoje\"). Registre tarefas, eventos e notas." },
      { emoji: "📅", title: "Todo mês", text: "Crie o Log Mensal do novo mês, migre tarefas pendentes e revise o mês anterior." },
      { emoji: "📋", title: "Novos projetos", text: "Cmd+P → \"Novo projeto\". As tarefas ativas aparecem automaticamente no diário." },
      { emoji: "🔮", title: "Coisas distantes", text: "Anote no Log Futuro. No começo do mês, migre para o mensal." },
      { emoji: "🔁", title: "Tarefas recorrentes", text: "Edite recorrentes.md uma vez (Cmd+P → \"Editar tarefas recorrentes\"). Aparecem em cada diário automaticamente." },
    ];

    cards.forEach(({ emoji, title, text }) => {
      const card = contentEl.createEl("div");
      card.style.cssText = "background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:10px;";
      card.createEl("strong", { text: `${emoji} ${title}` });
      card.createEl("p", { text }).style.margin = "4px 0 0 0";
    });

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText("Começar a usar →");
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
    contentEl.createEl("h2", { text: "Novo Projeto" });

    new Setting(contentEl)
      .setName("Nome do projeto")
      .addText((text) => {
        text.setPlaceholder("ex: Site da empresa X");
        text.onChange((value) => { this.projectName = value; });
        setTimeout(() => text.inputEl.focus(), 50);
      });

    new Setting(contentEl).addButton((btn) => {
      btn.setButtonText("Criar projeto");
      btn.setCta();
      btn.onClick(() => {
        if (!this.projectName.trim()) {
          new Notice("Digite um nome para o projeto.");
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
    contentEl.createEl("h2", { text: "Nova Coleção" });

    new Setting(contentEl)
      .setName("Nome da coleção")
      .addText((text) => {
        text.setPlaceholder("ex: Livros para ler");
        text.onChange((value) => { this.collectionName = value; });
        setTimeout(() => text.inputEl.focus(), 50);
      });

    new Setting(contentEl).addButton((btn) => {
      btn.setButtonText("Criar coleção");
      btn.setCta();
      btn.onClick(() => {
        if (!this.collectionName.trim()) {
          new Notice("Digite um nome para a coleção.");
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

class JackJournalSettingTab extends PluginSettingTab {
  plugin: JackJournalPlugin;

  constructor(app: App, plugin: JackJournalPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Jack Journal" });

    new Setting(containerEl)
      .setName("Pasta dos logs")
      .setDesc("Contém as subpastas diario, mensal e futuro.")
      .addText((t) => {
        t.setValue(this.plugin.settings.logsFolder);
        t.onChange(async (v) => {
          this.plugin.settings.logsFolder = v;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Pasta dos projetos")
      .addText((t) => {
        t.setValue(this.plugin.settings.projectsFolder);
        t.onChange(async (v) => {
          this.plugin.settings.projectsFolder = v;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Pasta das coleções")
      .addText((t) => {
        t.setValue(this.plugin.settings.collectionsFolder);
        t.onChange(async (v) => {
          this.plugin.settings.collectionsFolder = v;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Arquivo de tarefas recorrentes")
      .addText((t) => {
        t.setValue(this.plugin.settings.recurringFile);
        t.onChange(async (v) => {
          this.plugin.settings.recurringFile = v;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Refazer configuração inicial")
      .setDesc("Reabre o guia de setup.")
      .addButton((btn) => {
        btn.setButtonText("Abrir onboarding");
        btn.onClick(() => {
          this.plugin.settings.onboardingDone = false;
          this.plugin.saveSettings();
          new OnboardingModal(this.app, this.plugin).open();
        });
      });
  }
}
