var $=Object.defineProperty;var j=Object.getOwnPropertyDescriptor;var P=Object.getOwnPropertyNames;var N=Object.prototype.hasOwnProperty;var M=(i,e)=>{for(var t in e)$(i,t,{get:e[t],enumerable:!0})},A=(i,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of P(e))!N.call(i,n)&&n!==t&&$(i,n,{get:()=>e[n],enumerable:!(s=j(e,n))||s.enumerable});return i};var B=i=>A($({},"__esModule",{value:!0}),i);var Q={};M(Q,{default:()=>F});module.exports=B(Q);var o=require("obsidian");function O(i){let e=i||"My";return{logsFolder:`${e}'s Logs`,projectsFolder:`${e}'s Projects`,collectionsFolder:`${e}'s Collections`,recurringFile:"recurring.md"}}var R={userName:"",onboardingDone:!1,logsFolder:"logs",projectsFolder:"projects",collectionsFolder:"collections",recurringFile:"recurring.md"};function g(){return new Date}function f(i){return String(i).padStart(2,"0")}function h(i){return`${i.getFullYear()}-${f(i.getMonth()+1)}-${f(i.getDate())}`}function u(i){return`${i.getFullYear()}-${f(i.getMonth()+1)}`}function w(i){return String(i.getFullYear())}function y(i,e){let t=new Date(i);return t.setDate(t.getDate()+e),t}function C(i,e){let t=new Date(i);return t.setMonth(t.getMonth()+e),t}var I=["Janeiro","Fevereiro","Mar\xE7o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],J=["Dom","Seg","Ter","Qua","Qui","Sex","S\xE1b"];function E(i){return I[i.getMonth()]}function W(i,e,t){let s=new Date(i,e,t),n=f(t),a=f(e+1),r=String(i).slice(2),l=J[s.getDay()];return`${n}/${a}/${r} - ${l}`}function Y(i){return new Date(i.getFullYear(),i.getMonth()+1,0).getDate()}function X(){return`# Recurring Tasks

> Add one task per line below. These will be automatically included in every daily log.
> Use plain text \u2014 no checkboxes needed here.

-
-
`}function D(i){let e=Object.entries(i);return e.length===0?`> No active project tasks.
`:e.map(([t,s])=>`### ${t}
${s.map(n=>`- [ ] ${n}`).join(`
`)}`).join(`

`)}function H(i,e,t,s){let n=h(i),a=u(i),r=w(i),l=h(y(i,-1)),c=h(y(i,1)),d=u(y(i,-1)),p=u(y(i,1)),m=e.length>0?e.map(v=>`- [ ] ${v}`).join(`
`):"- [ ] ",L=t.length>0?t.map(v=>`- [>] ${v}`).join(`
`):"- [ ] ",S=D(s);return`# Daily Log \u2014 ${n}

\u2190 [[${d}/${l}|\u2190 Yesterday]] | [[${p}/${c}|Tomorrow \u2192]]
[[../../monthly/${a}|\u2191 ${E(i)} ${r}]]

---

## Recurring Tasks

${m}

---

## Projects

${S}

---

## Inherited from Yesterday

${L}

---

## Events

- \u25CB

---

## Notes

\u2013

---

*\u2190 [[../../../INDEX|Dashboard]] | [[../../monthly/${a}|Monthly Log]]*
`}function G(i,e){let t=u(i),s=w(i),n=E(i),a=u(C(i,-1)),r=u(C(i,1)),l=Y(i),c=Array.from({length:l},(d,p)=>`| ${W(i.getFullYear(),i.getMonth(),p+1)} | |`).join(`
`);return`# Monthly Log \u2014 ${n} ${s}

\u2190 [[${a}|\u2190 Previous Month]] | [[${r}|Next Month \u2192]]

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

*\u2190 [[../../INDEX|Dashboard]] | [[../../future/${s}-future|Future Log ${s}]]*
`}function V(i){return`# Future Log \u2014 ${i}

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
`}function _(i){let e=h(g());return`# Collection \u2014 ${i}

**Created:** ${e}

---

> Describe in one line what you collect here.

---

## List

-
-

---

*\u2190 [[../INDEX|Dashboard]]*
`}function K(i){let e=h(g());return`# Project \u2014 ${i}

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
`}var F=class extends o.Plugin{async onload(){await this.loadSettings(),this.addRibbonIcon("book-open","Today's Log",async()=>{await this.openOrCreateDailyLog(g())}),this.addRibbonIcon("folder-plus","New Project",async()=>{new k(this.app,async e=>{await this.createProjectLog(e)}).open()}),this.addRibbonIcon("library","New Collection",async()=>{new x(this.app,async e=>{await this.createCollection(e)}).open()}),this.addCommand({id:"open-today",name:"Open today's log",callback:async()=>{await this.openOrCreateDailyLog(g())}}),this.addCommand({id:"new-monthly",name:"New monthly log",callback:async()=>{await this.openOrCreateMonthlyLog(g())}}),this.addCommand({id:"new-future",name:"New future log",callback:async()=>{await this.openOrCreateFutureLog(w(g()))}}),this.addCommand({id:"new-project",name:"New project",callback:async()=>{new k(this.app,async e=>{await this.createProjectLog(e)}).open()}}),this.addCommand({id:"open-index",name:"Open Dashboard (INDEX)",callback:async()=>{await this.openFile("INDEX.md")}}),this.addCommand({id:"edit-recurring",name:"Edit recurring tasks",callback:async()=>{await this.openRecurringFile()}}),this.addCommand({id:"new-collection",name:"New collection",callback:async()=>{new x(this.app,async e=>{await this.createCollection(e)}).open()}}),this.addSettingTab(new T(this.app,this)),this.settings.onboardingDone&&await this.initFolders(),this.registerEvent(this.app.vault.on("modify",async e=>{e instanceof o.TFile&&e.path.startsWith(this.settings.projectsFolder+"/")&&e.extension==="md"&&await this.syncProjectsToTodayLog()})),this.registerObsidianProtocolHandler("jacks-bullet",async e=>{e.action==="daily"&&await this.openOrCreateDailyLog(g()),e.action==="monthly"&&await this.openOrCreateMonthlyLog(g()),e.action==="index"&&await this.openFile("INDEX.md")}),this.settings.onboardingDone||setTimeout(()=>{new b(this.app,this).open()},800)}async ensureFolder(e){let t=e.split("/"),s="";for(let n of t)if(s=s?`${s}/${n}`:n,!this.app.vault.getAbstractFileByPath(s))try{await this.app.vault.createFolder(s)}catch(a){}}async createFile(e,t){let s=e.substring(0,e.lastIndexOf("/"));return s&&await this.ensureFolder(s),await this.app.vault.create(e,t)}async openFile(e){let t=this.app.vault.getAbstractFileByPath(e);t instanceof o.TFile&&await this.app.workspace.getLeaf(!1).openFile(t)}get dailyFolder(){return`${this.settings.logsFolder}/daily`}get monthlyFolder(){return`${this.settings.logsFolder}/monthly`}get futureFolder(){return`${this.settings.logsFolder}/future`}async getActiveProjectTasks(){if(!this.app.vault.getAbstractFileByPath(this.settings.projectsFolder))return{};let t={},s=this.app.vault.getFiles().filter(n=>n.path.startsWith(this.settings.projectsFolder+"/")&&n.extension==="md");for(let n of s){let a=await this.app.vault.read(n),r=this.extractActiveTasks(a);if(r.length>0){let l=n.basename;t[l]=r}}return t}extractActiveTasks(e){let t=e.split(`
`),s=[],n=!1;for(let a of t){if(/^## Active Tasks/.test(a)){n=!0;continue}if(n&&/^## /.test(a))break;n&&/^- \[ \] .+/.test(a)&&s.push(a.replace(/^- \[ \] /,"").trim())}return s}async syncProjectsToTodayLog(){let e=h(g()),t=u(g()),s=`${this.dailyFolder}/${t}/${e}.md`,n=this.app.vault.getAbstractFileByPath(s);if(!(n instanceof o.TFile))return;let a=await this.app.vault.read(n),r=await this.getActiveProjectTasks(),l=D(r),c=a.replace(/(## Projects\n)([\s\S]*?)(\n---)/,`$1
${l}
$3`);c!==a&&await this.app.vault.modify(n,c)}async getRecurringTasks(){let e=this.app.vault.getAbstractFileByPath(this.settings.recurringFile);if(!(e instanceof o.TFile))return[];let t=await this.app.vault.read(e),s=[];for(let n of t.split(`
`)){let a=n.replace(/^-\s*/,"").trim();a&&!a.startsWith("#")&&!a.startsWith(">")&&s.push(a)}return s.filter(Boolean)}async openRecurringFile(){let e=this.settings.recurringFile,t=this.app.vault.getAbstractFileByPath(e);t instanceof o.TFile||(t=await this.createFile(e,X()),new o.Notice("recurring.md created. Add your recurring tasks here.")),await this.app.workspace.getLeaf(!1).openFile(t)}async openOrCreateDailyLog(e){let t=u(e),s=h(e),n=`${this.dailyFolder}/${t}/${s}.md`,a=this.app.vault.getAbstractFileByPath(n);if(!(a instanceof o.TFile)){let[r,l,c]=await Promise.all([this.getRecurringTasks(),this.getMigratedTasks(e),this.getActiveProjectTasks()]),d=H(e,r,l,c);a=await this.createFile(n,d),new o.Notice(`Daily log for ${s} created.`)}return await this.app.workspace.getLeaf(!1).openFile(a),a}async openOrCreateMonthlyLog(e){let t=u(e),s=`${this.monthlyFolder}/${t}.md`,n=this.app.vault.getAbstractFileByPath(s);if(!(n instanceof o.TFile)){let a=G(e,this.settings.projectsFolder);n=await this.createFile(s,a),new o.Notice(`Monthly log ${t} created.`)}return await this.app.workspace.getLeaf(!1).openFile(n),n}async openOrCreateFutureLog(e){let t=`${this.futureFolder}/${e}-future.md`,s=this.app.vault.getAbstractFileByPath(t);if(!(s instanceof o.TFile)){let n=V(e);s=await this.createFile(t,n),new o.Notice(`Future Log ${e} created.`)}return await this.app.workspace.getLeaf(!1).openFile(s),s}async initFolders(){await this.ensureFolder(this.settings.logsFolder),await this.ensureFolder(`${this.settings.logsFolder}/daily`),await this.ensureFolder(`${this.settings.logsFolder}/monthly`),await this.ensureFolder(`${this.settings.logsFolder}/future`),await this.ensureFolder(this.settings.projectsFolder),await this.ensureFolder(this.settings.collectionsFolder)}async createCollection(e){let t=e.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,""),s=`${this.settings.collectionsFolder}/${t}.md`,n=this.app.vault.getAbstractFileByPath(s);if(n instanceof o.TFile)return new o.Notice(`Collection "${e}" already exists.`),await this.app.workspace.getLeaf(!1).openFile(n),n;let a=_(e);return n=await this.createFile(s,a),new o.Notice(`Collection "${e}" created.`),await this.app.workspace.getLeaf(!1).openFile(n),n}async createProjectLog(e){let t=e.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,""),s=`${this.settings.projectsFolder}/${t}.md`,n=this.app.vault.getAbstractFileByPath(s);if(n instanceof o.TFile)return new o.Notice(`Project "${e}" already exists.`),await this.app.workspace.getLeaf(!1).openFile(n),n;let a=K(e);return n=await this.createFile(s,a),new o.Notice(`Project "${e}" created.`),await this.app.workspace.getLeaf(!1).openFile(n),n}async getMigratedTasks(e){let t=y(e,-1),s=u(t),n=h(t),a=`${this.dailyFolder}/${s}/${n}.md`,r=this.app.vault.getAbstractFileByPath(a);if(!(r instanceof o.TFile))return[];let l=await this.app.vault.read(r),c=[],d=l.split(`
`),p=!1;for(let m of d){if(m.includes("## Recurring Tasks")){p=!0;continue}p&&m.startsWith("## ")&&(p=!1),!p&&/^- \[ \] .+/.test(m)&&c.push(m.replace(/^- \[ \] /,"").trim())}return c}async loadSettings(){this.settings=Object.assign({},R,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}},b=class extends o.Modal{constructor(t,s){super(t);this.step=0;this.userName="";this.plugin=s}onOpen(){this.renderStep()}onClose(){this.contentEl.empty()}renderStep(){let{contentEl:t}=this;t.empty(),[this.renderStep0.bind(this),this.renderStep1.bind(this),this.renderStep2.bind(this),this.renderStep3.bind(this),this.renderStep4.bind(this),this.renderStep5.bind(this)][this.step]()}renderStep0(){let{contentEl:t}=this;t.createEl("h2",{text:"Welcome to Jacks Bullet"}),t.createEl("p",{text:"A Bullet Journal system for Obsidian. Let's set everything up in under 2 minutes."}),t.createEl("p",{text:"You'll create your Future Log, Monthly Log, first Daily Log, and set up your recurring tasks."});let s=t.createEl("p",{text:"What's your name?"});s.style.marginTop="16px",s.style.fontWeight="600";let n=t.createEl("input",{type:"text",placeholder:"Your name"});n.style.cssText="width:100%;padding:8px;margin-top:8px;border-radius:4px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);",n.value=this.userName,n.addEventListener("input",r=>{this.userName=r.target.value});let a=new o.ButtonComponent(t);a.setButtonText("Get started \u2192"),a.setCta(),a.buttonEl.style.marginTop="16px",a.onClick(async()=>{let r=this.userName.trim()||"My";this.plugin.settings.userName=r;let l=O(r);this.plugin.settings.logsFolder=l.logsFolder,this.plugin.settings.projectsFolder=l.projectsFolder,this.plugin.settings.collectionsFolder=l.collectionsFolder,this.plugin.settings.recurringFile=l.recurringFile,await this.plugin.saveSettings(),await this.plugin.initFolders(),this.step=1,this.renderStep()})}renderStep1(){let{contentEl:t}=this,s=this.plugin.settings.userName;t.createEl("h2",{text:"Step 1 of 5 \u2014 Recurring Tasks"}),t.createEl("p",{text:`${s}, recurring tasks are things you do every day \u2014 exercise, review email, journal, etc.`}),t.createEl("p",{text:"They're stored in a single file (recurring.md) and automatically added to every daily log."});let n=t.createEl("p",{text:"\u2192 Let's create your recurring tasks file. You can edit it anytime."});n.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let a=new o.ButtonComponent(t);a.setButtonText("Create recurring.md"),a.setCta(),a.buttonEl.style.marginTop="16px",a.onClick(async()=>{await this.plugin.openRecurringFile(),this.step=2,this.renderStep()})}renderStep2(){let{contentEl:t}=this,s=this.plugin.settings.userName,n=w(g());t.createEl("h2",{text:"Step 2 of 5 \u2014 Future Log"}),t.createEl("p",{text:`The Future Log is your yearly calendar, ${s}. Events and tasks more than a month away live here.`}),t.createEl("p",{text:"At the start of each month, migrate what's relevant to the Monthly Log."});let a=t.createEl("p",{text:`\u2192 Let's create the Future Log for ${n}.`});a.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let r=new o.ButtonComponent(t);r.setButtonText(`Create Future Log ${n}`),r.setCta(),r.buttonEl.style.marginTop="16px",r.onClick(async()=>{await this.plugin.openOrCreateFutureLog(n),this.step=3,this.renderStep()})}renderStep3(){let{contentEl:t}=this,s=g(),n=u(s),a=E(s),r=w(s);t.createEl("h2",{text:"Step 3 of 5 \u2014 Monthly Log"}),t.createEl("p",{text:"The Monthly Log has the event calendar, your tasks and projects, habits to track, and space for a monthly review."}),t.createEl("p",{text:"At the start of each month, create a new one and migrate pending tasks from the previous month."});let l=t.createEl("p",{text:`\u2192 Let's create the Monthly Log for ${a} ${r}.`});l.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let c=new o.ButtonComponent(t);c.setButtonText(`Create Monthly Log \u2014 ${n}`),c.setCta(),c.buttonEl.style.marginTop="16px",c.onClick(async()=>{await this.plugin.openOrCreateMonthlyLog(s),this.step=4,this.renderStep()})}renderStep4(){let{contentEl:t}=this,s=g(),n=h(s);t.createEl("h2",{text:"Step 4 of 5 \u2014 Daily Log"}),t.createEl("p",{text:"The Daily Log is the heart of the system. Open it every day to track tasks, events, and notes."});let a=t.createEl("ul");["Recurring tasks \u2014 pulled automatically from recurring.md","Project tasks \u2014 only active tasks, no backlog","Inherited from yesterday \u2014 pending tasks carried over","Events and free notes"].forEach(c=>a.createEl("li",{text:c}));let r=t.createEl("p",{text:`\u2192 Let's create today's log (${n}).`});r.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let l=new o.ButtonComponent(t);l.setButtonText(`Create Today's Log \u2014 ${n}`),l.setCta(),l.buttonEl.style.marginTop="16px",l.onClick(async()=>{await this.plugin.openOrCreateDailyLog(s),this.step=5,this.renderStep()})}renderStep5(){let{contentEl:t}=this,s=this.plugin.settings.userName;t.createEl("h2",{text:`All set, ${s}!`}),t.createEl("p",{text:"Your system is ready. The routine is simple:"}),[{emoji:"\u2600\uFE0F",title:"Every day",text:`Open today's log (book icon in the sidebar or Cmd+P \u2192 "Open today's log"). Log tasks, events, and notes.`},{emoji:"\u{1F4C5}",title:"Every month",text:"Create the new Monthly Log, migrate pending tasks, and review the previous month."},{emoji:"\u{1F4CB}",title:"New projects",text:'Cmd+P \u2192 "New project". Add active tasks to your daily log.'},{emoji:"\u{1F52E}",title:"Far-off things",text:"Log in Future Log. Migrate to monthly at the start of each month."},{emoji:"\u{1F501}",title:"Recurring tasks",text:'Edit recurring.md once (Cmd+P \u2192 "Edit recurring tasks"). They appear in every daily log automatically.'}].forEach(({emoji:r,title:l,text:c})=>{let d=t.createEl("div");d.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:10px;",d.createEl("strong",{text:`${r} ${l}`}),d.createEl("p",{text:c}).style.margin="4px 0 0 0"});let a=new o.ButtonComponent(t);a.setButtonText("Start using \u2192"),a.setCta(),a.buttonEl.style.marginTop="20px",a.onClick(async()=>{this.plugin.settings.onboardingDone=!0,await this.plugin.saveSettings(),this.close(),await this.plugin.openFile("INDEX.md")})}},k=class extends o.Modal{constructor(t,s){super(t);this.projectName="";this.onSubmit=s}onOpen(){let{contentEl:t}=this;t.createEl("h2",{text:"New Project"}),new o.Setting(t).setName("Project name").addText(s=>{s.setPlaceholder("e.g. Company website"),s.onChange(n=>{this.projectName=n}),setTimeout(()=>s.inputEl.focus(),50)}),new o.Setting(t).addButton(s=>{s.setButtonText("Create project"),s.setCta(),s.onClick(()=>{if(!this.projectName.trim()){new o.Notice("Enter a project name.");return}this.close(),this.onSubmit(this.projectName.trim())})})}onClose(){this.contentEl.empty()}},x=class extends o.Modal{constructor(t,s){super(t);this.collectionName="";this.onSubmit=s}onOpen(){let{contentEl:t}=this;t.createEl("h2",{text:"New Collection"}),new o.Setting(t).setName("Collection name").addText(s=>{s.setPlaceholder("e.g. Books to Read"),s.onChange(n=>{this.collectionName=n}),setTimeout(()=>s.inputEl.focus(),50)}),new o.Setting(t).addButton(s=>{s.setButtonText("Create collection"),s.setCta(),s.onClick(()=>{if(!this.collectionName.trim()){new o.Notice("Enter a collection name.");return}this.close(),this.onSubmit(this.collectionName.trim())})})}onClose(){this.contentEl.empty()}},T=class extends o.PluginSettingTab{constructor(e,t){super(e,t),this.plugin=t}display(){let{containerEl:e}=this;e.empty(),e.createEl("h2",{text:"Jacks Bullet"}),new o.Setting(e).setName("Logs folder").setDesc("Contains daily, monthly and future subfolders.").addText(t=>{t.setValue(this.plugin.settings.logsFolder),t.onChange(async s=>{this.plugin.settings.logsFolder=s,await this.plugin.saveSettings()})}),new o.Setting(e).setName("Projects folder").addText(t=>{t.setValue(this.plugin.settings.projectsFolder),t.onChange(async s=>{this.plugin.settings.projectsFolder=s,await this.plugin.saveSettings()})}),new o.Setting(e).setName("Collections folder").addText(t=>{t.setValue(this.plugin.settings.collectionsFolder),t.onChange(async s=>{this.plugin.settings.collectionsFolder=s,await this.plugin.saveSettings()})}),new o.Setting(e).setName("Recurring tasks file").setDesc("File where recurring tasks are stored.").addText(t=>{t.setValue(this.plugin.settings.recurringFile),t.onChange(async s=>{this.plugin.settings.recurringFile=s,await this.plugin.saveSettings()})}),new o.Setting(e).setName("Restart onboarding").setDesc("Reopens the setup guide.").addButton(t=>{t.setButtonText("Open onboarding"),t.onClick(()=>{this.plugin.settings.onboardingDone=!1,this.plugin.saveSettings(),new b(this.app,this.plugin).open()})})}};
