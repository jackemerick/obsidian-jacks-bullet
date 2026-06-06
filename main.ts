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
  dailyFolder: string;
  monthlyFolder: string;
  futureFolder: string;
  projectsFolder: string;
  collectionsFolder: string;
}

const DEFAULT_SETTINGS: JacksBulletSettings = {
  userName: "",
  onboardingDone: false,
  dailyFolder: "logs/daily",
  monthlyFolder: "logs/monthly",
  futureFolder: "logs/future",
  projectsFolder: "logs/projects",
  collectionsFolder: "collections",
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

function buildDailyLog(d: Date, migratedTasks: string[]): string {
  const ds = dateStr(d);
  const ms = monthStr(d);
  const year = yearStr(d);
  const yesterday = dateStr(addDays(d, -1));
  const tomorrow = dateStr(addDays(d, 1));
  const prevMs = monthStr(addDays(d, -1));
  const nextMs = monthStr(addDays(d, 1));

  const inherited = migratedTasks.length > 0
    ? migratedTasks.map((t) => `- [>] ${t}`).join("\n")
    : "- [ ] ";

  return `# Log Diário — ${ds}

← [[${prevMs}/${yesterday}|← Ontem]] | [[${nextMs}/${tomorrow}|Amanhã →]]
[[../../monthly/${ms}|↑ ${monthName(d)} ${year}]]

---

## Tarefas Recorrentes

- [ ]
- [ ]

---

## Projetos

> Tarefas ativas de cada projeto em andamento.

- [ ]

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

*← [[../../../INDEX|Dashboard]] | [[../../monthly/${ms}|Log Mensal]]*
`;
}

function buildMonthlyLog(d: Date): string {
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

### Projetos ativos este mês

- [[../../projects/|]]

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

**O que preciso mudar ou ajustar?**
-

---

*← [[../../INDEX|Dashboard]] | [[../../future/${year}-future|Future Log ${year}]]*
`;
}

function buildFutureLog(year: string): string {
  return `# Future Log — ${year}

> Eventos e tarefas que ainda não têm mês certo ou estão a 2+ meses de distância.
> Quando o mês chegar, migre para o Log Mensal correspondente.

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

function buildProjectLog(name: string): string {
  const ds = dateStr(today());
  return `# Projeto — ${name}

**Status:** \`Ativo\`
**Início:** ${ds}
**Deadline:** —

---

## Descrição

> O que é este projeto? Uma linha.

---

## Objetivo

> Que problema precisa ser resolvido?

---

## Tarefas em Execução

- [ ]
- [ ]

---

## Backlog

- [ ]
- [ ]

---

## Notas e Contexto

-

---

*← [[../../INDEX|Dashboard]]*
`;
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default class JacksBulletPlugin extends Plugin {
  settings: JacksBulletSettings;

  async onload() {
    await this.loadSettings();

    // Ribbon — abre o log de hoje (cria se não existir)
    this.addRibbonIcon("book-open", "Log de Hoje", async () => {
      await this.openOrCreateDailyLog(today());
    });

    // Comandos
    this.addCommand({
      id: "open-today",
      name: "Abrir log de hoje",
      callback: async () => {
        await this.openOrCreateDailyLog(today());
      },
    });

    this.addCommand({
      id: "new-monthly",
      name: "Novo log mensal",
      callback: async () => {
        await this.openOrCreateMonthlyLog(today());
      },
    });

    this.addCommand({
      id: "new-future",
      name: "Novo future log",
      callback: async () => {
        await this.openOrCreateFutureLog(yearStr(today()));
      },
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
      name: "Abrir Dashboard (INDEX)",
      callback: async () => {
        await this.openFile("INDEX.md");
      },
    });

    // Settings tab
    this.addSettingTab(new JacksBulletSettingTab(this.app, this));

    // Onboarding na primeira abertura
    if (!this.settings.onboardingDone) {
      // pequeno delay para o vault carregar antes de abrir o modal
      setTimeout(() => {
        new OnboardingModal(this.app, this).open();
      }, 800);
    }
  }

  // ─── File helpers ──────────────────────────────────────────────────────────

  async ensureFolder(path: string) {
    const folder = this.app.vault.getAbstractFileByPath(path);
    if (!folder) {
      await this.app.vault.createFolder(path);
    }
  }

  async createFile(path: string, content: string): Promise<TFile> {
    await this.ensureFolder(path.substring(0, path.lastIndexOf("/")));
    return await this.app.vault.create(path, content);
  }

  async openFile(path: string) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) {
      await this.app.workspace.getLeaf(false).openFile(file);
    }
  }

  // ─── Log creators ──────────────────────────────────────────────────────────

  async openOrCreateDailyLog(d: Date): Promise<TFile> {
    const ms = monthStr(d);
    const ds = dateStr(d);
    const path = `${this.settings.dailyFolder}/${ms}/${ds}.md`;

    let file = this.app.vault.getAbstractFileByPath(path);

    if (!(file instanceof TFile)) {
      // tenta migrar tarefas do dia anterior
      const migrated = await this.getMigratedTasks(d);
      const content = buildDailyLog(d, migrated);
      file = await this.createFile(path, content);
      new Notice(`Log de ${ds} criado.`);
    }

    await this.app.workspace.getLeaf(false).openFile(file as TFile);
    return file as TFile;
  }

  async openOrCreateMonthlyLog(d: Date): Promise<TFile> {
    const ms = monthStr(d);
    const path = `${this.settings.monthlyFolder}/${ms}.md`;

    let file = this.app.vault.getAbstractFileByPath(path);

    if (!(file instanceof TFile)) {
      const content = buildMonthlyLog(d);
      file = await this.createFile(path, content);
      new Notice(`Log mensal ${ms} criado.`);
    }

    await this.app.workspace.getLeaf(false).openFile(file as TFile);
    return file as TFile;
  }

  async openOrCreateFutureLog(year: string): Promise<TFile> {
    const path = `${this.settings.futureFolder}/${year}-future.md`;

    let file = this.app.vault.getAbstractFileByPath(path);

    if (!(file instanceof TFile)) {
      const content = buildFutureLog(year);
      file = await this.createFile(path, content);
      new Notice(`Future Log ${year} criado.`);
    }

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
    const path = `${this.settings.dailyFolder}/${ms}/${ds}.md`;

    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return [];

    const content = await this.app.vault.read(file);
    const tasks: string[] = [];

    // pega tarefas pendentes que não são recorrentes (não estão na seção de recorrentes)
    const lines = content.split("\n");
    let inRecorrentes = false;

    for (const line of lines) {
      if (line.includes("## Tarefas Recorrentes")) {
        inRecorrentes = true;
        continue;
      }
      if (inRecorrentes && line.startsWith("## ")) {
        inRecorrentes = false;
      }
      if (!inRecorrentes && /^- \[ \] .+/.test(line)) {
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

  onOpen() {
    this.renderStep();
  }

  onClose() {
    this.contentEl.empty();
  }

  renderStep() {
    const { contentEl } = this;
    contentEl.empty();

    const steps = [
      this.renderStep0.bind(this),
      this.renderStep1.bind(this),
      this.renderStep2.bind(this),
      this.renderStep3.bind(this),
      this.renderStep4.bind(this),
    ];

    steps[this.step]();
  }

  // Passo 0 — Boas-vindas
  renderStep0() {
    const { contentEl } = this;

    contentEl.createEl("h2", { text: "Bem-vindo ao Jacks Bullet" });
    contentEl.createEl("p", {
      text: "Um sistema de Bullet Journal para o Obsidian. Vamos configurar tudo em menos de 2 minutos.",
    });
    contentEl.createEl("p", {
      text: "Você vai criar seu Future Log, Log Mensal e primeiro Log Diário — e aprender a rotina do sistema.",
    });

    const nameLabel = contentEl.createEl("p", { text: "Como posso te chamar?" });
    nameLabel.style.marginTop = "16px";
    nameLabel.style.fontWeight = "600";

    const input = contentEl.createEl("input", {
      type: "text",
      placeholder: "Seu nome",
    });
    input.style.width = "100%";
    input.style.padding = "8px";
    input.style.marginTop = "8px";
    input.style.borderRadius = "4px";
    input.style.border = "1px solid var(--background-modifier-border)";
    input.style.background = "var(--background-primary)";
    input.style.color = "var(--text-normal)";
    input.value = this.userName;
    input.addEventListener("input", (e) => {
      this.userName = (e.target as HTMLInputElement).value;
    });

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText("Começar →");
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(() => {
      this.plugin.settings.userName = this.userName || "Jack";
      this.plugin.saveSettings();
      this.step = 1;
      this.renderStep();
    });
  }

  // Passo 1 — Future Log
  renderStep1() {
    const { contentEl } = this;
    const name = this.plugin.settings.userName;
    const year = yearStr(today());

    contentEl.createEl("h2", { text: "Passo 1 de 4 — Future Log" });
    contentEl.createEl("p", {
      text: `O Future Log é seu calendário anual, ${name}. Aqui ficam eventos e tarefas que estão a mais de um mês de distância.`,
    });
    contentEl.createEl("p", {
      text: "No início de cada mês, você revisa o Future Log e migra o que for pertinente para o Log Mensal.",
    });

    const note = contentEl.createEl("p", {
      text: `→ Vamos criar o Future Log de ${year}.`,
    });
    note.style.background = "var(--background-secondary)";
    note.style.padding = "12px";
    note.style.borderRadius = "6px";
    note.style.marginTop = "12px";

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText(`Criar Future Log ${year}`);
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(async () => {
      await this.plugin.openOrCreateFutureLog(year);
      this.step = 2;
      this.renderStep();
    });
  }

  // Passo 2 — Log Mensal
  renderStep2() {
    const { contentEl } = this;
    const d = today();
    const ms = monthStr(d);
    const name = monthName(d);
    const year = yearStr(d);

    contentEl.createEl("h2", { text: "Passo 2 de 4 — Log Mensal" });
    contentEl.createEl("p", {
      text: "O Log Mensal tem o calendário do mês, suas tarefas e projetos, hábitos que quer acompanhar e espaço para revisão no final do mês.",
    });
    contentEl.createEl("p", {
      text: "No início de cada mês, você cria um novo mensal e migra as tarefas pendentes do mês anterior.",
    });

    const note = contentEl.createEl("p", {
      text: `→ Vamos criar o Log Mensal de ${name} ${year}.`,
    });
    note.style.background = "var(--background-secondary)";
    note.style.padding = "12px";
    note.style.borderRadius = "6px";
    note.style.marginTop = "12px";

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText(`Criar Log Mensal — ${ms}`);
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(async () => {
      await this.plugin.openOrCreateMonthlyLog(d);
      this.step = 3;
      this.renderStep();
    });
  }

  // Passo 3 — Log Diário
  renderStep3() {
    const { contentEl } = this;
    const d = today();
    const ds = dateStr(d);

    contentEl.createEl("h2", { text: "Passo 3 de 4 — Log Diário" });
    contentEl.createEl("p", {
      text: "O Log Diário é o coração do sistema. Você abre todo dia, registra tarefas, eventos e notas.",
    });

    const list = contentEl.createEl("ul");
    [
      "Tarefas recorrentes — sua rotina fixa",
      "Tarefas de projetos — só as que estão em execução",
      "Herdado de ontem — tarefas pendentes do dia anterior",
      "Eventos e notas livres do dia",
    ].forEach((item) => list.createEl("li", { text: item }));

    const note = contentEl.createEl("p", {
      text: `→ Vamos criar o Log de hoje (${ds}).`,
    });
    note.style.background = "var(--background-secondary)";
    note.style.padding = "12px";
    note.style.borderRadius = "6px";
    note.style.marginTop = "12px";

    const btn = new ButtonComponent(contentEl);
    btn.setButtonText(`Criar Log de Hoje — ${ds}`);
    btn.setCta();
    btn.buttonEl.style.marginTop = "16px";
    btn.onClick(async () => {
      await this.plugin.openOrCreateDailyLog(d);
      this.step = 4;
      this.renderStep();
    });
  }

  // Passo 4 — Rotina e conclusão
  renderStep4() {
    const { contentEl } = this;
    const name = this.plugin.settings.userName;

    contentEl.createEl("h2", { text: `Pronto, ${name}!` });
    contentEl.createEl("p", {
      text: "Seu sistema está configurado. A rotina é simples:",
    });

    const cards = [
      { emoji: "☀️", title: "Todo dia", text: "Abra o log diário (ícone do livro na barra lateral ou Cmd+P → \"Abrir log de hoje\"). Registre tarefas, eventos e notas." },
      { emoji: "📅", title: "Todo mês", text: "Crie o Log Mensal do novo mês, migre as tarefas pendentes e revise o mês anterior." },
      { emoji: "📋", title: "Novos projetos", text: "Cmd+P → \"Novo projeto\". Coloque as tarefas em execução no log diário." },
      { emoji: "🔮", title: "Coisas distantes", text: "Anote no Future Log. No começo do mês, migre para o mensal." },
    ];

    cards.forEach(({ emoji, title, text }) => {
      const card = contentEl.createEl("div");
      card.style.background = "var(--background-secondary)";
      card.style.padding = "12px";
      card.style.borderRadius = "6px";
      card.style.marginTop = "10px";
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
        text.setPlaceholder("Ex: Site da empresa X");
        text.onChange((value) => {
          this.projectName = value;
        });
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

  onClose() {
    this.contentEl.empty();
  }
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
    containerEl.createEl("h2", { text: "Jacks Bullet — Configurações" });

    new Setting(containerEl)
      .setName("Pasta dos logs diários")
      .setDesc("Padrão: logs/daily")
      .addText((t) => {
        t.setValue(this.plugin.settings.dailyFolder);
        t.onChange(async (v) => {
          this.plugin.settings.dailyFolder = v;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Pasta dos logs mensais")
      .setDesc("Padrão: logs/monthly")
      .addText((t) => {
        t.setValue(this.plugin.settings.monthlyFolder);
        t.onChange(async (v) => {
          this.plugin.settings.monthlyFolder = v;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Pasta do future log")
      .setDesc("Padrão: logs/future")
      .addText((t) => {
        t.setValue(this.plugin.settings.futureFolder);
        t.onChange(async (v) => {
          this.plugin.settings.futureFolder = v;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Pasta dos projetos")
      .setDesc("Padrão: logs/projects")
      .addText((t) => {
        t.setValue(this.plugin.settings.projectsFolder);
        t.onChange(async (v) => {
          this.plugin.settings.projectsFolder = v;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Repetir onboarding")
      .setDesc("Reabre o guia de configuração inicial")
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
