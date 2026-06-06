var k=Object.defineProperty;var L=Object.getOwnPropertyDescriptor;var D=Object.getOwnPropertyNames;var C=Object.prototype.hasOwnProperty;var S=(s,n)=>{for(var t in n)k(s,t,{get:n[t],enumerable:!0})},M=(s,n,t,e)=>{if(n&&typeof n=="object"||typeof n=="function")for(let r of D(n))!C.call(s,r)&&r!==t&&k(s,r,{get:()=>n[r],enumerable:!(e=L(n,r))||e.enumerable});return s};var j=s=>M(k({},"__esModule",{value:!0}),s);var Y={};S(Y,{default:()=>b});module.exports=j(Y);var i=require("obsidian");function N(s){let n=s||"My";return{logsFolder:`${n}'s Logs`,projectsFolder:`${n}'s Projects`,collectionsFolder:`${n}'s Collections`,recurringFile:`${n}'s Logs/recurring.md`}}var P={userName:"",onboardingDone:!1,logsFolder:"logs",projectsFolder:"projects",collectionsFolder:"collections",recurringFile:"logs/recurring.md"};function h(){return new Date}function f(s){return String(s).padStart(2,"0")}function m(s){return`${s.getFullYear()}-${f(s.getMonth()+1)}-${f(s.getDate())}`}function g(s){return`${s.getFullYear()}-${f(s.getMonth()+1)}`}function F(s){return String(s.getFullYear())}function y(s,n){let t=new Date(s);return t.setDate(t.getDate()+n),t}function T(s,n){let t=new Date(s);return t.setMonth(t.getMonth()+n),t}var A=["Janeiro","Fevereiro","Mar\xE7o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];function $(s){return A[s.getMonth()]}function B(s){return new Date(s.getFullYear(),s.getMonth()+1,0).getDate()}function O(){return`# Recurring Tasks

> Add one task per line below. These will be automatically included in every daily log.
> Use plain text \u2014 no checkboxes needed here.

-
-
`}function R(s,n,t){let e=m(s),r=g(s),a=F(s),o=m(y(s,-1)),l=m(y(s,1)),c=g(y(s,-1)),u=g(y(s,1)),p=n.length>0?n.map(x=>`- [ ] ${x}`).join(`
`):"- [ ] ",d=t.length>0?t.map(x=>`- [>] ${x}`).join(`
`):"- [ ] ";return`# Daily Log \u2014 ${e}

\u2190 [[${c}/${o}|\u2190 Yesterday]] | [[${u}/${l}|Tomorrow \u2192]]
[[../../monthly/${r}|\u2191 ${$(s)} ${a}]]

---

## Recurring Tasks

${p}

---

## Projects

> Active tasks (not backlog) from each ongoing project.

- [ ]

---

## Inherited from Yesterday

${d}

---

## Events

- \u25CB

---

## Notes

\u2013

---

*\u2190 [[../../../INDEX|Dashboard]] | [[../../monthly/${r}|Monthly Log]]*
`}function I(s,n){let t=g(s),e=F(s),r=$(s),a=g(T(s,-1)),o=g(T(s,1)),l=B(s),c=Array.from({length:l},(u,p)=>{let d=f(p+1);return`| ${e}-${f(s.getMonth()+1)}-${d} | |`}).join(`
`);return`# Monthly Log \u2014 ${r} ${e}

\u2190 [[${a}|\u2190 Previous Month]] | [[${o}|Next Month \u2192]]

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

- [[../../${n}/|]]

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

*\u2190 [[../../INDEX|Dashboard]] | [[../../future/${e}-future|Future Log ${e}]]*
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
`}function W(s){let n=m(h());return`# Project \u2014 ${s}

**Status:** \`Active\`
**Started:** ${n}
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
`}var b=class extends i.Plugin{async onload(){await this.loadSettings(),this.addRibbonIcon("book-open","Today's Log",async()=>{await this.openOrCreateDailyLog(h())}),this.addCommand({id:"open-today",name:"Open today's log",callback:async()=>{await this.openOrCreateDailyLog(h())}}),this.addCommand({id:"new-monthly",name:"New monthly log",callback:async()=>{await this.openOrCreateMonthlyLog(h())}}),this.addCommand({id:"new-future",name:"New future log",callback:async()=>{await this.openOrCreateFutureLog(F(h()))}}),this.addCommand({id:"new-project",name:"New project",callback:async()=>{new v(this.app,async n=>{await this.createProjectLog(n)}).open()}}),this.addCommand({id:"open-index",name:"Open Dashboard (INDEX)",callback:async()=>{await this.openFile("INDEX.md")}}),this.addCommand({id:"edit-recurring",name:"Edit recurring tasks",callback:async()=>{await this.openRecurringFile()}}),this.addSettingTab(new E(this.app,this)),this.settings.onboardingDone||setTimeout(()=>{new w(this.app,this).open()},800)}async ensureFolder(n){let t=n.split("/"),e="";for(let r of t)e=e?`${e}/${r}`:r,this.app.vault.getAbstractFileByPath(e)||await this.app.vault.createFolder(e)}async createFile(n,t){let e=n.substring(0,n.lastIndexOf("/"));return e&&await this.ensureFolder(e),await this.app.vault.create(n,t)}async openFile(n){let t=this.app.vault.getAbstractFileByPath(n);t instanceof i.TFile&&await this.app.workspace.getLeaf(!1).openFile(t)}get dailyFolder(){return`${this.settings.logsFolder}/daily`}get monthlyFolder(){return`${this.settings.logsFolder}/monthly`}get futureFolder(){return`${this.settings.logsFolder}/future`}async getRecurringTasks(){let n=this.app.vault.getAbstractFileByPath(this.settings.recurringFile);if(!(n instanceof i.TFile))return[];let t=await this.app.vault.read(n),e=[];for(let r of t.split(`
`)){let a=r.replace(/^-\s*/,"").trim();a&&!a.startsWith("#")&&!a.startsWith(">")&&e.push(a)}return e.filter(Boolean)}async openRecurringFile(){let n=this.settings.recurringFile,t=this.app.vault.getAbstractFileByPath(n);t instanceof i.TFile||(t=await this.createFile(n,O()),new i.Notice("recurring.md created. Add your recurring tasks here.")),await this.app.workspace.getLeaf(!1).openFile(t)}async openOrCreateDailyLog(n){let t=g(n),e=m(n),r=`${this.dailyFolder}/${t}/${e}.md`,a=this.app.vault.getAbstractFileByPath(r);if(!(a instanceof i.TFile)){let[o,l]=await Promise.all([this.getRecurringTasks(),this.getMigratedTasks(n)]),c=R(n,o,l);a=await this.createFile(r,c),new i.Notice(`Daily log for ${e} created.`)}return await this.app.workspace.getLeaf(!1).openFile(a),a}async openOrCreateMonthlyLog(n){let t=g(n),e=`${this.monthlyFolder}/${t}.md`,r=this.app.vault.getAbstractFileByPath(e);if(!(r instanceof i.TFile)){let a=I(n,this.settings.projectsFolder);r=await this.createFile(e,a),new i.Notice(`Monthly log ${t} created.`)}return await this.app.workspace.getLeaf(!1).openFile(r),r}async openOrCreateFutureLog(n){let t=`${this.futureFolder}/${n}-future.md`,e=this.app.vault.getAbstractFileByPath(t);if(!(e instanceof i.TFile)){let r=J(n);e=await this.createFile(t,r),new i.Notice(`Future Log ${n} created.`)}return await this.app.workspace.getLeaf(!1).openFile(e),e}async createProjectLog(n){let t=n.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,""),e=`${this.settings.projectsFolder}/${t}.md`,r=this.app.vault.getAbstractFileByPath(e);if(r instanceof i.TFile)return new i.Notice(`Project "${n}" already exists.`),await this.app.workspace.getLeaf(!1).openFile(r),r;let a=W(n);return r=await this.createFile(e,a),new i.Notice(`Project "${n}" created.`),await this.app.workspace.getLeaf(!1).openFile(r),r}async getMigratedTasks(n){let t=y(n,-1),e=g(t),r=m(t),a=`${this.dailyFolder}/${e}/${r}.md`,o=this.app.vault.getAbstractFileByPath(a);if(!(o instanceof i.TFile))return[];let l=await this.app.vault.read(o),c=[],u=l.split(`
`),p=!1;for(let d of u){if(d.includes("## Recurring Tasks")){p=!0;continue}p&&d.startsWith("## ")&&(p=!1),!p&&/^- \[ \] .+/.test(d)&&c.push(d.replace(/^- \[ \] /,"").trim())}return c}async loadSettings(){this.settings=Object.assign({},P,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}},w=class extends i.Modal{constructor(t,e){super(t);this.step=0;this.userName="";this.plugin=e}onOpen(){this.renderStep()}onClose(){this.contentEl.empty()}renderStep(){let{contentEl:t}=this;t.empty(),[this.renderStep0.bind(this),this.renderStep1.bind(this),this.renderStep2.bind(this),this.renderStep3.bind(this),this.renderStep4.bind(this),this.renderStep5.bind(this)][this.step]()}renderStep0(){let{contentEl:t}=this;t.createEl("h2",{text:"Welcome to Jacks Bullet"}),t.createEl("p",{text:"A Bullet Journal system for Obsidian. Let's set everything up in under 2 minutes."}),t.createEl("p",{text:"You'll create your Future Log, Monthly Log, first Daily Log, and set up your recurring tasks."});let e=t.createEl("p",{text:"What's your name?"});e.style.marginTop="16px",e.style.fontWeight="600";let r=t.createEl("input",{type:"text",placeholder:"Your name"});r.style.cssText="width:100%;padding:8px;margin-top:8px;border-radius:4px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);",r.value=this.userName,r.addEventListener("input",o=>{this.userName=o.target.value});let a=new i.ButtonComponent(t);a.setButtonText("Get started \u2192"),a.setCta(),a.buttonEl.style.marginTop="16px",a.onClick(async()=>{let o=this.userName.trim()||"My";this.plugin.settings.userName=o;let l=N(o);this.plugin.settings.logsFolder=l.logsFolder,this.plugin.settings.projectsFolder=l.projectsFolder,this.plugin.settings.collectionsFolder=l.collectionsFolder,this.plugin.settings.recurringFile=l.recurringFile,await this.plugin.saveSettings(),this.step=1,this.renderStep()})}renderStep1(){let{contentEl:t}=this,e=this.plugin.settings.userName;t.createEl("h2",{text:"Step 1 of 5 \u2014 Recurring Tasks"}),t.createEl("p",{text:`${e}, recurring tasks are things you do every day \u2014 exercise, review email, journal, etc.`}),t.createEl("p",{text:"They're stored in a single file (recurring.md) and automatically added to every daily log."});let r=t.createEl("p",{text:"\u2192 Let's create your recurring tasks file. You can edit it anytime."});r.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let a=new i.ButtonComponent(t);a.setButtonText("Create recurring.md"),a.setCta(),a.buttonEl.style.marginTop="16px",a.onClick(async()=>{await this.plugin.openRecurringFile(),this.step=2,this.renderStep()})}renderStep2(){let{contentEl:t}=this,e=this.plugin.settings.userName,r=F(h());t.createEl("h2",{text:"Step 2 of 5 \u2014 Future Log"}),t.createEl("p",{text:`The Future Log is your yearly calendar, ${e}. Events and tasks more than a month away live here.`}),t.createEl("p",{text:"At the start of each month, migrate what's relevant to the Monthly Log."});let a=t.createEl("p",{text:`\u2192 Let's create the Future Log for ${r}.`});a.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let o=new i.ButtonComponent(t);o.setButtonText(`Create Future Log ${r}`),o.setCta(),o.buttonEl.style.marginTop="16px",o.onClick(async()=>{await this.plugin.openOrCreateFutureLog(r),this.step=3,this.renderStep()})}renderStep3(){let{contentEl:t}=this,e=h(),r=g(e),a=$(e),o=F(e);t.createEl("h2",{text:"Step 3 of 5 \u2014 Monthly Log"}),t.createEl("p",{text:"The Monthly Log has the event calendar, your tasks and projects, habits to track, and space for a monthly review."}),t.createEl("p",{text:"At the start of each month, create a new one and migrate pending tasks from the previous month."});let l=t.createEl("p",{text:`\u2192 Let's create the Monthly Log for ${a} ${o}.`});l.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let c=new i.ButtonComponent(t);c.setButtonText(`Create Monthly Log \u2014 ${r}`),c.setCta(),c.buttonEl.style.marginTop="16px",c.onClick(async()=>{await this.plugin.openOrCreateMonthlyLog(e),this.step=4,this.renderStep()})}renderStep4(){let{contentEl:t}=this,e=h(),r=m(e);t.createEl("h2",{text:"Step 4 of 5 \u2014 Daily Log"}),t.createEl("p",{text:"The Daily Log is the heart of the system. Open it every day to track tasks, events, and notes."});let a=t.createEl("ul");["Recurring tasks \u2014 pulled automatically from recurring.md","Project tasks \u2014 only active tasks, no backlog","Inherited from yesterday \u2014 pending tasks carried over","Events and free notes"].forEach(c=>a.createEl("li",{text:c}));let o=t.createEl("p",{text:`\u2192 Let's create today's log (${r}).`});o.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let l=new i.ButtonComponent(t);l.setButtonText(`Create Today's Log \u2014 ${r}`),l.setCta(),l.buttonEl.style.marginTop="16px",l.onClick(async()=>{await this.plugin.openOrCreateDailyLog(e),this.step=5,this.renderStep()})}renderStep5(){let{contentEl:t}=this,e=this.plugin.settings.userName;t.createEl("h2",{text:`All set, ${e}!`}),t.createEl("p",{text:"Your system is ready. The routine is simple:"}),[{emoji:"\u2600\uFE0F",title:"Every day",text:`Open today's log (book icon in the sidebar or Cmd+P \u2192 "Open today's log"). Log tasks, events, and notes.`},{emoji:"\u{1F4C5}",title:"Every month",text:"Create the new Monthly Log, migrate pending tasks, and review the previous month."},{emoji:"\u{1F4CB}",title:"New projects",text:'Cmd+P \u2192 "New project". Add active tasks to your daily log.'},{emoji:"\u{1F52E}",title:"Far-off things",text:"Log in Future Log. Migrate to monthly at the start of each month."},{emoji:"\u{1F501}",title:"Recurring tasks",text:'Edit recurring.md once (Cmd+P \u2192 "Edit recurring tasks"). They appear in every daily log automatically.'}].forEach(({emoji:o,title:l,text:c})=>{let u=t.createEl("div");u.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:10px;",u.createEl("strong",{text:`${o} ${l}`}),u.createEl("p",{text:c}).style.margin="4px 0 0 0"});let a=new i.ButtonComponent(t);a.setButtonText("Start using \u2192"),a.setCta(),a.buttonEl.style.marginTop="20px",a.onClick(async()=>{this.plugin.settings.onboardingDone=!0,await this.plugin.saveSettings(),this.close(),await this.plugin.openFile("INDEX.md")})}},v=class extends i.Modal{constructor(t,e){super(t);this.projectName="";this.onSubmit=e}onOpen(){let{contentEl:t}=this;t.createEl("h2",{text:"New Project"}),new i.Setting(t).setName("Project name").addText(e=>{e.setPlaceholder("e.g. Company website"),e.onChange(r=>{this.projectName=r}),setTimeout(()=>e.inputEl.focus(),50)}),new i.Setting(t).addButton(e=>{e.setButtonText("Create project"),e.setCta(),e.onClick(()=>{if(!this.projectName.trim()){new i.Notice("Enter a project name.");return}this.close(),this.onSubmit(this.projectName.trim())})})}onClose(){this.contentEl.empty()}},E=class extends i.PluginSettingTab{constructor(n,t){super(n,t),this.plugin=t}display(){let{containerEl:n}=this;n.empty(),n.createEl("h2",{text:"Jacks Bullet"}),new i.Setting(n).setName("Logs folder").setDesc("Contains daily, monthly and future subfolders.").addText(t=>{t.setValue(this.plugin.settings.logsFolder),t.onChange(async e=>{this.plugin.settings.logsFolder=e,this.plugin.settings.recurringFile=`${e}/recurring.md`,await this.plugin.saveSettings()})}),new i.Setting(n).setName("Projects folder").addText(t=>{t.setValue(this.plugin.settings.projectsFolder),t.onChange(async e=>{this.plugin.settings.projectsFolder=e,await this.plugin.saveSettings()})}),new i.Setting(n).setName("Collections folder").addText(t=>{t.setValue(this.plugin.settings.collectionsFolder),t.onChange(async e=>{this.plugin.settings.collectionsFolder=e,await this.plugin.saveSettings()})}),new i.Setting(n).setName("Recurring tasks file").setDesc("File where recurring tasks are stored.").addText(t=>{t.setValue(this.plugin.settings.recurringFile),t.onChange(async e=>{this.plugin.settings.recurringFile=e,await this.plugin.saveSettings()})}),new i.Setting(n).setName("Restart onboarding").setDesc("Reopens the setup guide.").addButton(t=>{t.setButtonText("Open onboarding"),t.onClick(()=>{this.plugin.settings.onboardingDone=!1,this.plugin.saveSettings(),new w(this.app,this.plugin).open()})})}};
