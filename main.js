var k=Object.defineProperty;var D=Object.getOwnPropertyDescriptor;var L=Object.getOwnPropertyNames;var C=Object.prototype.hasOwnProperty;var S=(s,e)=>{for(var t in e)k(s,t,{get:e[t],enumerable:!0})},M=(s,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of L(e))!C.call(s,a)&&a!==t&&k(s,a,{get:()=>e[a],enumerable:!(n=D(e,a))||n.enumerable});return s};var j=s=>M(k({},"__esModule",{value:!0}),s);var Y={};S(Y,{default:()=>b});module.exports=j(Y);var i=require("obsidian");function N(s){let e=s||"My";return{logsFolder:`${e}'s Logs`,projectsFolder:`${e}'s Projects`,collectionsFolder:`${e}'s Collections`,recurringFile:"recurring.md"}}var P={userName:"",onboardingDone:!1,logsFolder:"logs",projectsFolder:"projects",collectionsFolder:"collections",recurringFile:"recurring.md"};function g(){return new Date}function f(s){return String(s).padStart(2,"0")}function m(s){return`${s.getFullYear()}-${f(s.getMonth()+1)}-${f(s.getDate())}`}function u(s){return`${s.getFullYear()}-${f(s.getMonth()+1)}`}function F(s){return String(s.getFullYear())}function y(s,e){let t=new Date(s);return t.setDate(t.getDate()+e),t}function $(s,e){let t=new Date(s);return t.setMonth(t.getMonth()+e),t}var A=["Janeiro","Fevereiro","Mar\xE7o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];function T(s){return A[s.getMonth()]}function B(s){return new Date(s.getFullYear(),s.getMonth()+1,0).getDate()}function O(){return`# Recurring Tasks

> Add one task per line below. These will be automatically included in every daily log.
> Use plain text \u2014 no checkboxes needed here.

-
-
`}function R(s,e,t){let n=m(s),a=u(s),r=F(s),o=m(y(s,-1)),l=m(y(s,1)),c=u(y(s,-1)),p=u(y(s,1)),d=e.length>0?e.map(x=>`- [ ] ${x}`).join(`
`):"- [ ] ",h=t.length>0?t.map(x=>`- [>] ${x}`).join(`
`):"- [ ] ";return`# Daily Log \u2014 ${n}

\u2190 [[${c}/${o}|\u2190 Yesterday]] | [[${p}/${l}|Tomorrow \u2192]]
[[../../monthly/${a}|\u2191 ${T(s)} ${r}]]

---

## Recurring Tasks

${d}

---

## Projects

> Active tasks (not backlog) from each ongoing project.

- [ ]

---

## Inherited from Yesterday

${h}

---

## Events

- \u25CB

---

## Notes

\u2013

---

*\u2190 [[../../../INDEX|Dashboard]] | [[../../monthly/${a}|Monthly Log]]*
`}function I(s,e){let t=u(s),n=F(s),a=T(s),r=u($(s,-1)),o=u($(s,1)),l=B(s),c=Array.from({length:l},(p,d)=>{let h=f(d+1);return`| ${n}-${f(s.getMonth()+1)}-${h} | |`}).join(`
`);return`# Monthly Log \u2014 ${a} ${n}

\u2190 [[${r}|\u2190 Previous Month]] | [[${o}|Next Month \u2192]]

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
`}function J(s){return`# Future Log \u2014 ${s}

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
`}function W(s){let e=m(g());return`# Project \u2014 ${s}

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
`}var b=class extends i.Plugin{async onload(){await this.loadSettings(),this.addRibbonIcon("book-open","Today's Log",async()=>{await this.openOrCreateDailyLog(g())}),this.addCommand({id:"open-today",name:"Open today's log",callback:async()=>{await this.openOrCreateDailyLog(g())}}),this.addCommand({id:"new-monthly",name:"New monthly log",callback:async()=>{await this.openOrCreateMonthlyLog(g())}}),this.addCommand({id:"new-future",name:"New future log",callback:async()=>{await this.openOrCreateFutureLog(F(g()))}}),this.addCommand({id:"new-project",name:"New project",callback:async()=>{new v(this.app,async e=>{await this.createProjectLog(e)}).open()}}),this.addCommand({id:"open-index",name:"Open Dashboard (INDEX)",callback:async()=>{await this.openFile("INDEX.md")}}),this.addCommand({id:"edit-recurring",name:"Edit recurring tasks",callback:async()=>{await this.openRecurringFile()}}),this.addSettingTab(new E(this.app,this)),this.registerObsidianProtocolHandler("jacks-bullet",async e=>{e.action==="daily"&&await this.openOrCreateDailyLog(g()),e.action==="monthly"&&await this.openOrCreateMonthlyLog(g()),e.action==="index"&&await this.openFile("INDEX.md")}),this.settings.onboardingDone||setTimeout(()=>{new w(this.app,this).open()},800)}async ensureFolder(e){let t=e.split("/"),n="";for(let a of t)n=n?`${n}/${a}`:a,this.app.vault.getAbstractFileByPath(n)||await this.app.vault.createFolder(n)}async createFile(e,t){let n=e.substring(0,e.lastIndexOf("/"));return n&&await this.ensureFolder(n),await this.app.vault.create(e,t)}async openFile(e){let t=this.app.vault.getAbstractFileByPath(e);t instanceof i.TFile&&await this.app.workspace.getLeaf(!1).openFile(t)}get dailyFolder(){return`${this.settings.logsFolder}/daily`}get monthlyFolder(){return`${this.settings.logsFolder}/monthly`}get futureFolder(){return`${this.settings.logsFolder}/future`}async getRecurringTasks(){let e=this.app.vault.getAbstractFileByPath(this.settings.recurringFile);if(!(e instanceof i.TFile))return[];let t=await this.app.vault.read(e),n=[];for(let a of t.split(`
`)){let r=a.replace(/^-\s*/,"").trim();r&&!r.startsWith("#")&&!r.startsWith(">")&&n.push(r)}return n.filter(Boolean)}async openRecurringFile(){let e=this.settings.recurringFile,t=this.app.vault.getAbstractFileByPath(e);t instanceof i.TFile||(t=await this.createFile(e,O()),new i.Notice("recurring.md created. Add your recurring tasks here.")),await this.app.workspace.getLeaf(!1).openFile(t)}async openOrCreateDailyLog(e){let t=u(e),n=m(e),a=`${this.dailyFolder}/${t}/${n}.md`,r=this.app.vault.getAbstractFileByPath(a);if(!(r instanceof i.TFile)){let[o,l]=await Promise.all([this.getRecurringTasks(),this.getMigratedTasks(e)]),c=R(e,o,l);r=await this.createFile(a,c),new i.Notice(`Daily log for ${n} created.`)}return await this.app.workspace.getLeaf(!1).openFile(r),r}async openOrCreateMonthlyLog(e){let t=u(e),n=`${this.monthlyFolder}/${t}.md`,a=this.app.vault.getAbstractFileByPath(n);if(!(a instanceof i.TFile)){let r=I(e,this.settings.projectsFolder);a=await this.createFile(n,r),new i.Notice(`Monthly log ${t} created.`)}return await this.app.workspace.getLeaf(!1).openFile(a),a}async openOrCreateFutureLog(e){let t=`${this.futureFolder}/${e}-future.md`,n=this.app.vault.getAbstractFileByPath(t);if(!(n instanceof i.TFile)){let a=J(e);n=await this.createFile(t,a),new i.Notice(`Future Log ${e} created.`)}return await this.app.workspace.getLeaf(!1).openFile(n),n}async createProjectLog(e){let t=e.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,""),n=`${this.settings.projectsFolder}/${t}.md`,a=this.app.vault.getAbstractFileByPath(n);if(a instanceof i.TFile)return new i.Notice(`Project "${e}" already exists.`),await this.app.workspace.getLeaf(!1).openFile(a),a;let r=W(e);return a=await this.createFile(n,r),new i.Notice(`Project "${e}" created.`),await this.app.workspace.getLeaf(!1).openFile(a),a}async getMigratedTasks(e){let t=y(e,-1),n=u(t),a=m(t),r=`${this.dailyFolder}/${n}/${a}.md`,o=this.app.vault.getAbstractFileByPath(r);if(!(o instanceof i.TFile))return[];let l=await this.app.vault.read(o),c=[],p=l.split(`
`),d=!1;for(let h of p){if(h.includes("## Recurring Tasks")){d=!0;continue}d&&h.startsWith("## ")&&(d=!1),!d&&/^- \[ \] .+/.test(h)&&c.push(h.replace(/^- \[ \] /,"").trim())}return c}async loadSettings(){this.settings=Object.assign({},P,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}},w=class extends i.Modal{constructor(t,n){super(t);this.step=0;this.userName="";this.plugin=n}onOpen(){this.renderStep()}onClose(){this.contentEl.empty()}renderStep(){let{contentEl:t}=this;t.empty(),[this.renderStep0.bind(this),this.renderStep1.bind(this),this.renderStep2.bind(this),this.renderStep3.bind(this),this.renderStep4.bind(this),this.renderStep5.bind(this)][this.step]()}renderStep0(){let{contentEl:t}=this;t.createEl("h2",{text:"Welcome to Jacks Bullet"}),t.createEl("p",{text:"A Bullet Journal system for Obsidian. Let's set everything up in under 2 minutes."}),t.createEl("p",{text:"You'll create your Future Log, Monthly Log, first Daily Log, and set up your recurring tasks."});let n=t.createEl("p",{text:"What's your name?"});n.style.marginTop="16px",n.style.fontWeight="600";let a=t.createEl("input",{type:"text",placeholder:"Your name"});a.style.cssText="width:100%;padding:8px;margin-top:8px;border-radius:4px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);",a.value=this.userName,a.addEventListener("input",o=>{this.userName=o.target.value});let r=new i.ButtonComponent(t);r.setButtonText("Get started \u2192"),r.setCta(),r.buttonEl.style.marginTop="16px",r.onClick(async()=>{let o=this.userName.trim()||"My";this.plugin.settings.userName=o;let l=N(o);this.plugin.settings.logsFolder=l.logsFolder,this.plugin.settings.projectsFolder=l.projectsFolder,this.plugin.settings.collectionsFolder=l.collectionsFolder,this.plugin.settings.recurringFile=l.recurringFile,await this.plugin.saveSettings(),this.step=1,this.renderStep()})}renderStep1(){let{contentEl:t}=this,n=this.plugin.settings.userName;t.createEl("h2",{text:"Step 1 of 5 \u2014 Recurring Tasks"}),t.createEl("p",{text:`${n}, recurring tasks are things you do every day \u2014 exercise, review email, journal, etc.`}),t.createEl("p",{text:"They're stored in a single file (recurring.md) and automatically added to every daily log."});let a=t.createEl("p",{text:"\u2192 Let's create your recurring tasks file. You can edit it anytime."});a.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let r=new i.ButtonComponent(t);r.setButtonText("Create recurring.md"),r.setCta(),r.buttonEl.style.marginTop="16px",r.onClick(async()=>{await this.plugin.openRecurringFile(),this.step=2,this.renderStep()})}renderStep2(){let{contentEl:t}=this,n=this.plugin.settings.userName,a=F(g());t.createEl("h2",{text:"Step 2 of 5 \u2014 Future Log"}),t.createEl("p",{text:`The Future Log is your yearly calendar, ${n}. Events and tasks more than a month away live here.`}),t.createEl("p",{text:"At the start of each month, migrate what's relevant to the Monthly Log."});let r=t.createEl("p",{text:`\u2192 Let's create the Future Log for ${a}.`});r.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let o=new i.ButtonComponent(t);o.setButtonText(`Create Future Log ${a}`),o.setCta(),o.buttonEl.style.marginTop="16px",o.onClick(async()=>{await this.plugin.openOrCreateFutureLog(a),this.step=3,this.renderStep()})}renderStep3(){let{contentEl:t}=this,n=g(),a=u(n),r=T(n),o=F(n);t.createEl("h2",{text:"Step 3 of 5 \u2014 Monthly Log"}),t.createEl("p",{text:"The Monthly Log has the event calendar, your tasks and projects, habits to track, and space for a monthly review."}),t.createEl("p",{text:"At the start of each month, create a new one and migrate pending tasks from the previous month."});let l=t.createEl("p",{text:`\u2192 Let's create the Monthly Log for ${r} ${o}.`});l.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let c=new i.ButtonComponent(t);c.setButtonText(`Create Monthly Log \u2014 ${a}`),c.setCta(),c.buttonEl.style.marginTop="16px",c.onClick(async()=>{await this.plugin.openOrCreateMonthlyLog(n),this.step=4,this.renderStep()})}renderStep4(){let{contentEl:t}=this,n=g(),a=m(n);t.createEl("h2",{text:"Step 4 of 5 \u2014 Daily Log"}),t.createEl("p",{text:"The Daily Log is the heart of the system. Open it every day to track tasks, events, and notes."});let r=t.createEl("ul");["Recurring tasks \u2014 pulled automatically from recurring.md","Project tasks \u2014 only active tasks, no backlog","Inherited from yesterday \u2014 pending tasks carried over","Events and free notes"].forEach(c=>r.createEl("li",{text:c}));let o=t.createEl("p",{text:`\u2192 Let's create today's log (${a}).`});o.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let l=new i.ButtonComponent(t);l.setButtonText(`Create Today's Log \u2014 ${a}`),l.setCta(),l.buttonEl.style.marginTop="16px",l.onClick(async()=>{await this.plugin.openOrCreateDailyLog(n),this.step=5,this.renderStep()})}renderStep5(){let{contentEl:t}=this,n=this.plugin.settings.userName;t.createEl("h2",{text:`All set, ${n}!`}),t.createEl("p",{text:"Your system is ready. The routine is simple:"}),[{emoji:"\u2600\uFE0F",title:"Every day",text:`Open today's log (book icon in the sidebar or Cmd+P \u2192 "Open today's log"). Log tasks, events, and notes.`},{emoji:"\u{1F4C5}",title:"Every month",text:"Create the new Monthly Log, migrate pending tasks, and review the previous month."},{emoji:"\u{1F4CB}",title:"New projects",text:'Cmd+P \u2192 "New project". Add active tasks to your daily log.'},{emoji:"\u{1F52E}",title:"Far-off things",text:"Log in Future Log. Migrate to monthly at the start of each month."},{emoji:"\u{1F501}",title:"Recurring tasks",text:'Edit recurring.md once (Cmd+P \u2192 "Edit recurring tasks"). They appear in every daily log automatically.'}].forEach(({emoji:o,title:l,text:c})=>{let p=t.createEl("div");p.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:10px;",p.createEl("strong",{text:`${o} ${l}`}),p.createEl("p",{text:c}).style.margin="4px 0 0 0"});let r=new i.ButtonComponent(t);r.setButtonText("Start using \u2192"),r.setCta(),r.buttonEl.style.marginTop="20px",r.onClick(async()=>{this.plugin.settings.onboardingDone=!0,await this.plugin.saveSettings(),this.close(),await this.plugin.openFile("INDEX.md")})}},v=class extends i.Modal{constructor(t,n){super(t);this.projectName="";this.onSubmit=n}onOpen(){let{contentEl:t}=this;t.createEl("h2",{text:"New Project"}),new i.Setting(t).setName("Project name").addText(n=>{n.setPlaceholder("e.g. Company website"),n.onChange(a=>{this.projectName=a}),setTimeout(()=>n.inputEl.focus(),50)}),new i.Setting(t).addButton(n=>{n.setButtonText("Create project"),n.setCta(),n.onClick(()=>{if(!this.projectName.trim()){new i.Notice("Enter a project name.");return}this.close(),this.onSubmit(this.projectName.trim())})})}onClose(){this.contentEl.empty()}},E=class extends i.PluginSettingTab{constructor(e,t){super(e,t),this.plugin=t}display(){let{containerEl:e}=this;e.empty(),e.createEl("h2",{text:"Jacks Bullet"}),new i.Setting(e).setName("Logs folder").setDesc("Contains daily, monthly and future subfolders.").addText(t=>{t.setValue(this.plugin.settings.logsFolder),t.onChange(async n=>{this.plugin.settings.logsFolder=n,await this.plugin.saveSettings()})}),new i.Setting(e).setName("Projects folder").addText(t=>{t.setValue(this.plugin.settings.projectsFolder),t.onChange(async n=>{this.plugin.settings.projectsFolder=n,await this.plugin.saveSettings()})}),new i.Setting(e).setName("Collections folder").addText(t=>{t.setValue(this.plugin.settings.collectionsFolder),t.onChange(async n=>{this.plugin.settings.collectionsFolder=n,await this.plugin.saveSettings()})}),new i.Setting(e).setName("Recurring tasks file").setDesc("File where recurring tasks are stored.").addText(t=>{t.setValue(this.plugin.settings.recurringFile),t.onChange(async n=>{this.plugin.settings.recurringFile=n,await this.plugin.saveSettings()})}),new i.Setting(e).setName("Restart onboarding").setDesc("Reopens the setup guide.").addButton(t=>{t.setButtonText("Open onboarding"),t.onClick(()=>{this.plugin.settings.onboardingDone=!1,this.plugin.saveSettings(),new w(this.app,this.plugin).open()})})}};
