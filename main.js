var E=Object.defineProperty;var L=Object.getOwnPropertyDescriptor;var D=Object.getOwnPropertyNames;var S=Object.prototype.hasOwnProperty;var N=(i,e)=>{for(var t in e)E(i,t,{get:e[t],enumerable:!0})},j=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of D(e))!S.call(i,s)&&s!==t&&E(i,s,{get:()=>e[s],enumerable:!(n=L(e,s))||n.enumerable});return i};var P=i=>j(E({},"__esModule",{value:!0}),i);var H={};N(H,{default:()=>F});module.exports=P(H);var a=require("obsidian");function M(i){let e=i||"My";return{logsFolder:`${e}'s Logs`,projectsFolder:`${e}'s Projects`,collectionsFolder:`${e}'s Collections`,recurringFile:"recurring.md"}}var A={userName:"",onboardingDone:!1,logsFolder:"logs",projectsFolder:"projects",collectionsFolder:"collections",recurringFile:"recurring.md"};function g(){return new Date}function f(i){return String(i).padStart(2,"0")}function m(i){return`${i.getFullYear()}-${f(i.getMonth()+1)}-${f(i.getDate())}`}function u(i){return`${i.getFullYear()}-${f(i.getMonth()+1)}`}function w(i){return String(i.getFullYear())}function y(i,e){let t=new Date(i);return t.setDate(t.getDate()+e),t}function C(i,e){let t=new Date(i);return t.setMonth(t.getMonth()+e),t}var B=["Janeiro","Fevereiro","Mar\xE7o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];function T(i){return B[i.getMonth()]}function O(i){return new Date(i.getFullYear(),i.getMonth()+1,0).getDate()}function R(){return`# Recurring Tasks

> Add one task per line below. These will be automatically included in every daily log.
> Use plain text \u2014 no checkboxes needed here.

-
-
`}function I(i,e,t){let n=m(i),s=u(i),o=w(i),r=m(y(i,-1)),l=m(y(i,1)),c=u(y(i,-1)),h=u(y(i,1)),d=e.length>0?e.map(v=>`- [ ] ${v}`).join(`
`):"- [ ] ",p=t.length>0?t.map(v=>`- [>] ${v}`).join(`
`):"- [ ] ";return`# Daily Log \u2014 ${n}

\u2190 [[${c}/${r}|\u2190 Yesterday]] | [[${h}/${l}|Tomorrow \u2192]]
[[../../monthly/${s}|\u2191 ${T(i)} ${o}]]

---

## Recurring Tasks

${d}

---

## Projects

> Active tasks (not backlog) from each ongoing project.

- [ ]

---

## Inherited from Yesterday

${p}

---

## Events

- \u25CB

---

## Notes

\u2013

---

*\u2190 [[../../../INDEX|Dashboard]] | [[../../monthly/${s}|Monthly Log]]*
`}function J(i,e){let t=u(i),n=w(i),s=T(i),o=u(C(i,-1)),r=u(C(i,1)),l=O(i),c=Array.from({length:l},(h,d)=>{let p=f(d+1);return`| ${n}-${f(i.getMonth()+1)}-${p} | |`}).join(`
`);return`# Monthly Log \u2014 ${s} ${n}

\u2190 [[${o}|\u2190 Previous Month]] | [[${r}|Next Month \u2192]]

---

## Event Calendar

| Date | Event |
|---|---|
${c}

---

## Tasks & Projects This Month

- [ ]
- [ ]

### Active Projects

- [[../../${e}/|]]

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

*\u2190 [[../../INDEX|Dashboard]] | [[../../future/${n}-future|Future Log ${n}]]*
`}function W(i){return`# Future Log \u2014 ${i}

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

*\u2190 [[../../INDEX|Dashboard]]*
`}function Y(i){let e=m(g());return`# Collection \u2014 ${i}

**Created:** ${e}

---

> Describe in one line what you collect here.

---

## List

-
-

---

*\u2190 [[../INDEX|Dashboard]]*
`}function X(i){let e=m(g());return`# Project \u2014 ${i}

**Status:** \`Active\`
**Started:** ${e}
**Deadline:** \u2014

---

## Description

> What is this project? One line.

---

## Goal

> What problem needs to be solved?

---

## Active Tasks

> These appear in daily logs. Keep it short \u2014 max 5 tasks at a time.

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

*\u2190 [[../INDEX|Dashboard]]*
`}var F=class extends a.Plugin{async onload(){await this.loadSettings(),this.addRibbonIcon("book-open","Today's Log",async()=>{await this.openOrCreateDailyLog(g())}),this.addRibbonIcon("folder-plus","New Project",async()=>{new x(this.app,async e=>{await this.createProjectLog(e)}).open()}),this.addRibbonIcon("library","New Collection",async()=>{new k(this.app,async e=>{await this.createCollection(e)}).open()}),this.addCommand({id:"open-today",name:"Open today's log",callback:async()=>{await this.openOrCreateDailyLog(g())}}),this.addCommand({id:"new-monthly",name:"New monthly log",callback:async()=>{await this.openOrCreateMonthlyLog(g())}}),this.addCommand({id:"new-future",name:"New future log",callback:async()=>{await this.openOrCreateFutureLog(w(g()))}}),this.addCommand({id:"new-project",name:"New project",callback:async()=>{new x(this.app,async e=>{await this.createProjectLog(e)}).open()}}),this.addCommand({id:"open-index",name:"Open Dashboard (INDEX)",callback:async()=>{await this.openFile("INDEX.md")}}),this.addCommand({id:"edit-recurring",name:"Edit recurring tasks",callback:async()=>{await this.openRecurringFile()}}),this.addCommand({id:"new-collection",name:"New collection",callback:async()=>{new k(this.app,async e=>{await this.createCollection(e)}).open()}}),this.addSettingTab(new $(this.app,this)),this.registerObsidianProtocolHandler("jacks-bullet",async e=>{e.action==="daily"&&await this.openOrCreateDailyLog(g()),e.action==="monthly"&&await this.openOrCreateMonthlyLog(g()),e.action==="index"&&await this.openFile("INDEX.md")}),this.settings.onboardingDone||setTimeout(()=>{new b(this.app,this).open()},800)}async ensureFolder(e){let t=e.split("/"),n="";for(let s of t)n=n?`${n}/${s}`:s,this.app.vault.getAbstractFileByPath(n)||await this.app.vault.createFolder(n)}async createFile(e,t){let n=e.substring(0,e.lastIndexOf("/"));return n&&await this.ensureFolder(n),await this.app.vault.create(e,t)}async openFile(e){let t=this.app.vault.getAbstractFileByPath(e);t instanceof a.TFile&&await this.app.workspace.getLeaf(!1).openFile(t)}get dailyFolder(){return`${this.settings.logsFolder}/daily`}get monthlyFolder(){return`${this.settings.logsFolder}/monthly`}get futureFolder(){return`${this.settings.logsFolder}/future`}async getRecurringTasks(){let e=this.app.vault.getAbstractFileByPath(this.settings.recurringFile);if(!(e instanceof a.TFile))return[];let t=await this.app.vault.read(e),n=[];for(let s of t.split(`
`)){let o=s.replace(/^-\s*/,"").trim();o&&!o.startsWith("#")&&!o.startsWith(">")&&n.push(o)}return n.filter(Boolean)}async openRecurringFile(){let e=this.settings.recurringFile,t=this.app.vault.getAbstractFileByPath(e);t instanceof a.TFile||(t=await this.createFile(e,R()),new a.Notice("recurring.md created. Add your recurring tasks here.")),await this.app.workspace.getLeaf(!1).openFile(t)}async openOrCreateDailyLog(e){let t=u(e),n=m(e),s=`${this.dailyFolder}/${t}/${n}.md`,o=this.app.vault.getAbstractFileByPath(s);if(!(o instanceof a.TFile)){let[r,l]=await Promise.all([this.getRecurringTasks(),this.getMigratedTasks(e)]),c=I(e,r,l);o=await this.createFile(s,c),new a.Notice(`Daily log for ${n} created.`)}return await this.app.workspace.getLeaf(!1).openFile(o),o}async openOrCreateMonthlyLog(e){let t=u(e),n=`${this.monthlyFolder}/${t}.md`,s=this.app.vault.getAbstractFileByPath(n);if(!(s instanceof a.TFile)){let o=J(e,this.settings.projectsFolder);s=await this.createFile(n,o),new a.Notice(`Monthly log ${t} created.`)}return await this.app.workspace.getLeaf(!1).openFile(s),s}async openOrCreateFutureLog(e){let t=`${this.futureFolder}/${e}-future.md`,n=this.app.vault.getAbstractFileByPath(t);if(!(n instanceof a.TFile)){let s=W(e);n=await this.createFile(t,s),new a.Notice(`Future Log ${e} created.`)}return await this.app.workspace.getLeaf(!1).openFile(n),n}async initFolders(){await Promise.all([this.ensureFolder(this.settings.logsFolder),this.ensureFolder(`${this.settings.logsFolder}/daily`),this.ensureFolder(`${this.settings.logsFolder}/monthly`),this.ensureFolder(`${this.settings.logsFolder}/future`),this.ensureFolder(this.settings.projectsFolder),this.ensureFolder(this.settings.collectionsFolder)])}async createCollection(e){let t=e.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,""),n=`${this.settings.collectionsFolder}/${t}.md`,s=this.app.vault.getAbstractFileByPath(n);if(s instanceof a.TFile)return new a.Notice(`Collection "${e}" already exists.`),await this.app.workspace.getLeaf(!1).openFile(s),s;let o=Y(e);return s=await this.createFile(n,o),new a.Notice(`Collection "${e}" created.`),await this.app.workspace.getLeaf(!1).openFile(s),s}async createProjectLog(e){let t=e.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,""),n=`${this.settings.projectsFolder}/${t}.md`,s=this.app.vault.getAbstractFileByPath(n);if(s instanceof a.TFile)return new a.Notice(`Project "${e}" already exists.`),await this.app.workspace.getLeaf(!1).openFile(s),s;let o=X(e);return s=await this.createFile(n,o),new a.Notice(`Project "${e}" created.`),await this.app.workspace.getLeaf(!1).openFile(s),s}async getMigratedTasks(e){let t=y(e,-1),n=u(t),s=m(t),o=`${this.dailyFolder}/${n}/${s}.md`,r=this.app.vault.getAbstractFileByPath(o);if(!(r instanceof a.TFile))return[];let l=await this.app.vault.read(r),c=[],h=l.split(`
`),d=!1;for(let p of h){if(p.includes("## Recurring Tasks")){d=!0;continue}d&&p.startsWith("## ")&&(d=!1),!d&&/^- \[ \] .+/.test(p)&&c.push(p.replace(/^- \[ \] /,"").trim())}return c}async loadSettings(){this.settings=Object.assign({},A,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}},b=class extends a.Modal{constructor(t,n){super(t);this.step=0;this.userName="";this.plugin=n}onOpen(){this.renderStep()}onClose(){this.contentEl.empty()}renderStep(){let{contentEl:t}=this;t.empty(),[this.renderStep0.bind(this),this.renderStep1.bind(this),this.renderStep2.bind(this),this.renderStep3.bind(this),this.renderStep4.bind(this),this.renderStep5.bind(this)][this.step]()}renderStep0(){let{contentEl:t}=this;t.createEl("h2",{text:"Welcome to Jacks Bullet"}),t.createEl("p",{text:"A Bullet Journal system for Obsidian. Let's set everything up in under 2 minutes."}),t.createEl("p",{text:"You'll create your Future Log, Monthly Log, first Daily Log, and set up your recurring tasks."});let n=t.createEl("p",{text:"What's your name?"});n.style.marginTop="16px",n.style.fontWeight="600";let s=t.createEl("input",{type:"text",placeholder:"Your name"});s.style.cssText="width:100%;padding:8px;margin-top:8px;border-radius:4px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);",s.value=this.userName,s.addEventListener("input",r=>{this.userName=r.target.value});let o=new a.ButtonComponent(t);o.setButtonText("Get started \u2192"),o.setCta(),o.buttonEl.style.marginTop="16px",o.onClick(async()=>{let r=this.userName.trim()||"My";this.plugin.settings.userName=r;let l=M(r);this.plugin.settings.logsFolder=l.logsFolder,this.plugin.settings.projectsFolder=l.projectsFolder,this.plugin.settings.collectionsFolder=l.collectionsFolder,this.plugin.settings.recurringFile=l.recurringFile,await this.plugin.saveSettings(),await this.plugin.initFolders(),this.step=1,this.renderStep()})}renderStep1(){let{contentEl:t}=this,n=this.plugin.settings.userName;t.createEl("h2",{text:"Step 1 of 5 \u2014 Recurring Tasks"}),t.createEl("p",{text:`${n}, recurring tasks are things you do every day \u2014 exercise, review email, journal, etc.`}),t.createEl("p",{text:"They're stored in a single file (recurring.md) and automatically added to every daily log."});let s=t.createEl("p",{text:"\u2192 Let's create your recurring tasks file. You can edit it anytime."});s.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let o=new a.ButtonComponent(t);o.setButtonText("Create recurring.md"),o.setCta(),o.buttonEl.style.marginTop="16px",o.onClick(async()=>{await this.plugin.openRecurringFile(),this.step=2,this.renderStep()})}renderStep2(){let{contentEl:t}=this,n=this.plugin.settings.userName,s=w(g());t.createEl("h2",{text:"Step 2 of 5 \u2014 Future Log"}),t.createEl("p",{text:`The Future Log is your yearly calendar, ${n}. Events and tasks more than a month away live here.`}),t.createEl("p",{text:"At the start of each month, migrate what's relevant to the Monthly Log."});let o=t.createEl("p",{text:`\u2192 Let's create the Future Log for ${s}.`});o.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let r=new a.ButtonComponent(t);r.setButtonText(`Create Future Log ${s}`),r.setCta(),r.buttonEl.style.marginTop="16px",r.onClick(async()=>{await this.plugin.openOrCreateFutureLog(s),this.step=3,this.renderStep()})}renderStep3(){let{contentEl:t}=this,n=g(),s=u(n),o=T(n),r=w(n);t.createEl("h2",{text:"Step 3 of 5 \u2014 Monthly Log"}),t.createEl("p",{text:"The Monthly Log has the event calendar, your tasks and projects, habits to track, and space for a monthly review."}),t.createEl("p",{text:"At the start of each month, create a new one and migrate pending tasks from the previous month."});let l=t.createEl("p",{text:`\u2192 Let's create the Monthly Log for ${o} ${r}.`});l.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let c=new a.ButtonComponent(t);c.setButtonText(`Create Monthly Log \u2014 ${s}`),c.setCta(),c.buttonEl.style.marginTop="16px",c.onClick(async()=>{await this.plugin.openOrCreateMonthlyLog(n),this.step=4,this.renderStep()})}renderStep4(){let{contentEl:t}=this,n=g(),s=m(n);t.createEl("h2",{text:"Step 4 of 5 \u2014 Daily Log"}),t.createEl("p",{text:"The Daily Log is the heart of the system. Open it every day to track tasks, events, and notes."});let o=t.createEl("ul");["Recurring tasks \u2014 pulled automatically from recurring.md","Project tasks \u2014 only active tasks, no backlog","Inherited from yesterday \u2014 pending tasks carried over","Events and free notes"].forEach(c=>o.createEl("li",{text:c}));let r=t.createEl("p",{text:`\u2192 Let's create today's log (${s}).`});r.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let l=new a.ButtonComponent(t);l.setButtonText(`Create Today's Log \u2014 ${s}`),l.setCta(),l.buttonEl.style.marginTop="16px",l.onClick(async()=>{await this.plugin.openOrCreateDailyLog(n),this.step=5,this.renderStep()})}renderStep5(){let{contentEl:t}=this,n=this.plugin.settings.userName;t.createEl("h2",{text:`All set, ${n}!`}),t.createEl("p",{text:"Your system is ready. The routine is simple:"}),[{emoji:"\u2600\uFE0F",title:"Every day",text:`Open today's log (book icon in the sidebar or Cmd+P \u2192 "Open today's log"). Log tasks, events, and notes.`},{emoji:"\u{1F4C5}",title:"Every month",text:"Create the new Monthly Log, migrate pending tasks, and review the previous month."},{emoji:"\u{1F4CB}",title:"New projects",text:'Cmd+P \u2192 "New project". Add active tasks to your daily log.'},{emoji:"\u{1F52E}",title:"Far-off things",text:"Log in Future Log. Migrate to monthly at the start of each month."},{emoji:"\u{1F501}",title:"Recurring tasks",text:'Edit recurring.md once (Cmd+P \u2192 "Edit recurring tasks"). They appear in every daily log automatically.'}].forEach(({emoji:r,title:l,text:c})=>{let h=t.createEl("div");h.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:10px;",h.createEl("strong",{text:`${r} ${l}`}),h.createEl("p",{text:c}).style.margin="4px 0 0 0"});let o=new a.ButtonComponent(t);o.setButtonText("Start using \u2192"),o.setCta(),o.buttonEl.style.marginTop="20px",o.onClick(async()=>{this.plugin.settings.onboardingDone=!0,await this.plugin.saveSettings(),this.close(),await this.plugin.openFile("INDEX.md")})}},x=class extends a.Modal{constructor(t,n){super(t);this.projectName="";this.onSubmit=n}onOpen(){let{contentEl:t}=this;t.createEl("h2",{text:"New Project"}),new a.Setting(t).setName("Project name").addText(n=>{n.setPlaceholder("e.g. Company website"),n.onChange(s=>{this.projectName=s}),setTimeout(()=>n.inputEl.focus(),50)}),new a.Setting(t).addButton(n=>{n.setButtonText("Create project"),n.setCta(),n.onClick(()=>{if(!this.projectName.trim()){new a.Notice("Enter a project name.");return}this.close(),this.onSubmit(this.projectName.trim())})})}onClose(){this.contentEl.empty()}},k=class extends a.Modal{constructor(t,n){super(t);this.collectionName="";this.onSubmit=n}onOpen(){let{contentEl:t}=this;t.createEl("h2",{text:"New Collection"}),new a.Setting(t).setName("Collection name").addText(n=>{n.setPlaceholder("e.g. Books to Read"),n.onChange(s=>{this.collectionName=s}),setTimeout(()=>n.inputEl.focus(),50)}),new a.Setting(t).addButton(n=>{n.setButtonText("Create collection"),n.setCta(),n.onClick(()=>{if(!this.collectionName.trim()){new a.Notice("Enter a collection name.");return}this.close(),this.onSubmit(this.collectionName.trim())})})}onClose(){this.contentEl.empty()}},$=class extends a.PluginSettingTab{constructor(e,t){super(e,t),this.plugin=t}display(){let{containerEl:e}=this;e.empty(),e.createEl("h2",{text:"Jacks Bullet"}),new a.Setting(e).setName("Logs folder").setDesc("Contains daily, monthly and future subfolders.").addText(t=>{t.setValue(this.plugin.settings.logsFolder),t.onChange(async n=>{this.plugin.settings.logsFolder=n,await this.plugin.saveSettings()})}),new a.Setting(e).setName("Projects folder").addText(t=>{t.setValue(this.plugin.settings.projectsFolder),t.onChange(async n=>{this.plugin.settings.projectsFolder=n,await this.plugin.saveSettings()})}),new a.Setting(e).setName("Collections folder").addText(t=>{t.setValue(this.plugin.settings.collectionsFolder),t.onChange(async n=>{this.plugin.settings.collectionsFolder=n,await this.plugin.saveSettings()})}),new a.Setting(e).setName("Recurring tasks file").setDesc("File where recurring tasks are stored.").addText(t=>{t.setValue(this.plugin.settings.recurringFile),t.onChange(async n=>{this.plugin.settings.recurringFile=n,await this.plugin.saveSettings()})}),new a.Setting(e).setName("Restart onboarding").setDesc("Reopens the setup guide.").addButton(t=>{t.setButtonText("Open onboarding"),t.onClick(()=>{this.plugin.settings.onboardingDone=!1,this.plugin.saveSettings(),new b(this.app,this.plugin).open()})})}};
