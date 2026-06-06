var T=Object.defineProperty;var P=Object.getOwnPropertyDescriptor;var L=Object.getOwnPropertyNames;var N=Object.prototype.hasOwnProperty;var A=(a,e)=>{for(var t in e)T(a,t,{get:e[t],enumerable:!0})},M=(a,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of L(e))!N.call(a,o)&&o!==t&&T(a,o,{get:()=>e[o],enumerable:!(s=P(e,o))||s.enumerable});return a};var O=a=>M(T({},"__esModule",{value:!0}),a);var _={};A(_,{default:()=>y});module.exports=O(_);var i=require("obsidian");function B(a){let e=a||"Meu";return{logsFolder:`Di\xE1rio de ${e}`,projectsFolder:`Projetos de ${e}`,collectionsFolder:`Cole\xE7\xF5es de ${e}`,recurringFile:"recorrentes.md"}}var R={userName:"",onboardingDone:!1,logsFolder:"logs",projectsFolder:"projetos",collectionsFolder:"cole\xE7\xF5es",recurringFile:"recorrentes.md"};function d(){return new Date}function F(a){return String(a).padStart(2,"0")}function g(a){return`${a.getFullYear()}-${F(a.getMonth()+1)}-${F(a.getDate())}`}function u(a){return`${a.getFullYear()}-${F(a.getMonth()+1)}`}function b(a){return String(a.getFullYear())}function f(a,e){let t=new Date(a);return t.setDate(t.getDate()+e),t}function D(a,e){let t=new Date(a);return t.setMonth(t.getMonth()+e),t}var J=["Janeiro","Fevereiro","Mar\xE7o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],q=["Dom","Seg","Ter","Qua","Qui","Sex","S\xE1b"];function C(a){return J[a.getMonth()]}function I(a,e,t){let s=new Date(a,e,t),o=F(t),n=F(e+1),r=String(a).slice(2),c=q[s.getDay()];return`${o}/${n}/${r} - ${c}`}function V(a){return new Date(a.getFullYear(),a.getMonth()+1,0).getDate()}function H(){return`# Tarefas Recorrentes

> Adicione uma tarefa por linha abaixo. Elas ser\xE3o inclu\xEDdas automaticamente em cada log di\xE1rio.
> Use texto simples \u2014 sem checkboxes aqui.

-
-
`}function j(a){let e=Object.entries(a);return e.length===0?`> Nenhuma tarefa ativa em projetos.
`:e.map(([t,s])=>`### ${t}
${s.map(o=>`- [ ] ${o}`).join(`
`)}`).join(`

`)}function X(a,e,t,s){let o=g(a),n=u(a),r=b(a),c=g(f(a,-1)),l=g(f(a,1)),p=u(f(a,-1)),h=u(f(a,1)),m=e.length>0?e.map($=>`- [ ] ${$}`).join(`
`):"- [ ] ",S=t.length>0?t.map($=>`- [>] ${$}`).join(`
`):"- [ ] ",k=j(s);return`# Di\xE1rio \u2014 ${o}

\u2190 [[${p}/${c}|\u2190 Ontem]] | [[${h}/${l}|Amanh\xE3 \u2192]]
[[../../mensal/${n}|\u2191 ${C(a)} ${r}]]

---

## Tarefas Recorrentes

${m}

---

## Projetos

${k}

---

## Herdado de Ontem

${S}

---

## Eventos

- \u25CB

---

## Notas

\u2013

---

*\u2190 [[../../../INDEX|Dashboard]] | [[../../mensal/${n}|Log Mensal]]*
`}function z(a,e){let t=u(a),s=b(a),o=C(a),n=u(D(a,-1)),r=u(D(a,1)),c=V(a),l=Array.from({length:c},(p,h)=>`| ${I(a.getFullYear(),a.getMonth(),h+1)} | |`).join(`
`);return`# Log Mensal \u2014 ${o} ${s}

\u2190 [[${n}|\u2190 M\xEAs anterior]] | [[${r}|Pr\xF3ximo m\xEAs \u2192]]

---

## Calend\xE1rio de Eventos

| Data | Evento |
|---|---|
${l}

---

## Tarefas e Projetos do M\xEAs

- [ ]
- [ ]

### Projetos ativos

- [[../../${e}/|]]

---

## H\xE1bitos e M\xE9tricas

| H\xE1bito / M\xE9trica | Meta | Resultado |
|---|---|---|
| | | |

---

## Migrado do m\xEAs anterior

- [ ]

---

## Revis\xE3o do M\xEAs

**O que funcionou bem?**
-

**O que n\xE3o funcionou?**
-

**O que preciso mudar?**
-

---

*\u2190 [[../../INDEX|Dashboard]] | [[../../futuro/${s}-futuro|Log Futuro ${s}]]*
`}function W(a){return`# Log Futuro \u2014 ${a}

> Eventos e tarefas sem m\xEAs definido ou a mais de um m\xEAs de dist\xE2ncia.
> No in\xEDcio de cada m\xEAs, migre o que for pertinente para o Log Mensal.

---

## Janeiro
-

## Fevereiro
-

## Mar\xE7o
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

*\u2190 [[../../INDEX|Dashboard]]*
`}function Y(a){let e=g(d());return`# Cole\xE7\xE3o \u2014 ${a}

**Criada em:** ${e}

---

> Descreva em uma linha o que voc\xEA coleciona aqui.

---

## Lista

-
-

---

*\u2190 [[../INDEX|Dashboard]]*
`}function U(a){let e=g(d());return`# Projeto \u2014 ${a}

**Status:** \`Ativo\`
**In\xEDcio:** ${e}
**Prazo:** \u2014

---

## Descri\xE7\xE3o

> O que \xE9 este projeto? Uma linha.

---

## Objetivo

> Que problema precisa ser resolvido?

---

## Tarefas Ativas

> Aparecem nos logs di\xE1rios. M\xE1ximo 5 tarefas por vez.

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

*\u2190 [[../INDEX|Dashboard]]*
`}var y=class extends i.Plugin{async onload(){await this.loadSettings(),this.addRibbonIcon("book-open","Di\xE1rio de Hoje",async()=>{await this.openOrCreateDailyLog(d())}),this.addRibbonIcon("folder-plus","Novo Projeto",async()=>{new v(this.app,async e=>{await this.createProjectLog(e)}).open()}),this.addRibbonIcon("library","Nova Cole\xE7\xE3o",async()=>{new x(this.app,async e=>{await this.createCollection(e)}).open()}),this.addCommand({id:"open-today",name:"Abrir di\xE1rio de hoje",callback:async()=>{await this.openOrCreateDailyLog(d())}}),this.addCommand({id:"new-monthly",name:"Novo log mensal",callback:async()=>{await this.openOrCreateMonthlyLog(d())}}),this.addCommand({id:"new-future",name:"Novo log futuro",callback:async()=>{await this.openOrCreateFutureLog(b(d()))}}),this.addCommand({id:"new-project",name:"Novo projeto",callback:async()=>{new v(this.app,async e=>{await this.createProjectLog(e)}).open()}}),this.addCommand({id:"open-index",name:"Abrir Dashboard",callback:async()=>{await this.openFile("INDEX.md")}}),this.addCommand({id:"edit-recurring",name:"Editar tarefas recorrentes",callback:async()=>{await this.openRecurringFile()}}),this.addCommand({id:"new-collection",name:"Nova cole\xE7\xE3o",callback:async()=>{new x(this.app,async e=>{await this.createCollection(e)}).open()}}),this.addSettingTab(new E(this.app,this)),this.settings.onboardingDone&&await this.initFolders(),this.registerEvent(this.app.vault.on("modify",async e=>{e instanceof i.TFile&&e.path.startsWith(this.settings.projectsFolder+"/")&&e.extension==="md"&&await this.syncProjectsToTodayLog()})),this.registerObsidianProtocolHandler("jack-journal",async e=>{e.action==="diario"&&await this.openOrCreateDailyLog(d()),e.action==="mensal"&&await this.openOrCreateMonthlyLog(d()),e.action==="index"&&await this.openFile("INDEX.md")}),this.settings.onboardingDone||setTimeout(()=>{new w(this.app,this).open()},800)}async ensureFolder(e){let t=e.split("/"),s="";for(let o of t)if(s=s?`${s}/${o}`:o,!this.app.vault.getAbstractFileByPath(s))try{await this.app.vault.createFolder(s)}catch(n){}}async createFile(e,t){let s=e.substring(0,e.lastIndexOf("/"));return s&&await this.ensureFolder(s),await this.app.vault.create(e,t)}async openFile(e){let t=this.app.vault.getAbstractFileByPath(e);t instanceof i.TFile&&await this.app.workspace.getLeaf(!1).openFile(t)}get dailyFolder(){return`${this.settings.logsFolder}/diario`}get monthlyFolder(){return`${this.settings.logsFolder}/mensal`}get futureFolder(){return`${this.settings.logsFolder}/futuro`}async getActiveProjectTasks(){if(!this.app.vault.getAbstractFileByPath(this.settings.projectsFolder))return{};let t=this.app.vault.getFiles().filter(o=>o.path.startsWith(this.settings.projectsFolder+"/")&&o.extension==="md"),s={};for(let o of t){let n=await this.app.vault.read(o),r=this.extractActiveTasks(n);r.length>0&&(s[o.basename]=r)}return s}extractActiveTasks(e){let t=e.split(`
`),s=[],o=!1;for(let n of t){if(/^## Tarefas Ativas/.test(n)){o=!0;continue}if(o&&/^## /.test(n))break;o&&/^- \[ \] .+/.test(n)&&s.push(n.replace(/^- \[ \] /,"").trim())}return s}async syncProjectsToTodayLog(){let e=g(d()),t=u(d()),s=`${this.dailyFolder}/${t}/${e}.md`,o=this.app.vault.getAbstractFileByPath(s);if(!(o instanceof i.TFile))return;let n=await this.app.vault.read(o),r=await this.getActiveProjectTasks(),c=j(r),l=n.replace(/(## Projetos\n)([\s\S]*?)(\n---)/,`$1
${c}
$3`);l!==n&&await this.app.vault.modify(o,l)}async getRecurringTasks(){let e=this.app.vault.getAbstractFileByPath(this.settings.recurringFile);if(!(e instanceof i.TFile))return[];let t=await this.app.vault.read(e),s=[];for(let o of t.split(`
`)){let n=o.replace(/^-\s*/,"").trim();n&&!n.startsWith("#")&&!n.startsWith(">")&&s.push(n)}return s.filter(Boolean)}async openRecurringFile(){let e=this.settings.recurringFile,t=this.app.vault.getAbstractFileByPath(e);t instanceof i.TFile||(t=await this.createFile(e,H()),new i.Notice("recorrentes.md criado. Adicione suas tarefas recorrentes aqui.")),await this.app.workspace.getLeaf(!1).openFile(t)}async openOrCreateDailyLog(e){let t=u(e),s=g(e),o=`${this.dailyFolder}/${t}/${s}.md`,n=this.app.vault.getAbstractFileByPath(o);if(!(n instanceof i.TFile)){let[r,c,l]=await Promise.all([this.getRecurringTasks(),this.getMigratedTasks(e),this.getActiveProjectTasks()]),p=X(e,r,c,l);n=await this.createFile(o,p),new i.Notice(`Di\xE1rio de ${s} criado.`)}return await this.app.workspace.getLeaf(!1).openFile(n),n}async openOrCreateMonthlyLog(e){let t=u(e),s=`${this.monthlyFolder}/${t}.md`,o=this.app.vault.getAbstractFileByPath(s);if(!(o instanceof i.TFile)){let n=z(e,this.settings.projectsFolder);o=await this.createFile(s,n),new i.Notice(`Log mensal ${t} criado.`)}return await this.app.workspace.getLeaf(!1).openFile(o),o}async openOrCreateFutureLog(e){let t=`${this.futureFolder}/${e}-futuro.md`,s=this.app.vault.getAbstractFileByPath(t);if(!(s instanceof i.TFile)){let o=W(e);s=await this.createFile(t,o),new i.Notice(`Log Futuro ${e} criado.`)}return await this.app.workspace.getLeaf(!1).openFile(s),s}async initFolders(){await this.ensureFolder(this.settings.logsFolder),await this.ensureFolder(`${this.settings.logsFolder}/diario`),await this.ensureFolder(`${this.settings.logsFolder}/mensal`),await this.ensureFolder(`${this.settings.logsFolder}/futuro`),await this.ensureFolder(this.settings.projectsFolder),await this.ensureFolder(this.settings.collectionsFolder)}async createCollection(e){let t=e.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,""),s=`${this.settings.collectionsFolder}/${t}.md`,o=this.app.vault.getAbstractFileByPath(s);if(o instanceof i.TFile)return new i.Notice(`Cole\xE7\xE3o "${e}" j\xE1 existe.`),await this.app.workspace.getLeaf(!1).openFile(o),o;let n=Y(e);return o=await this.createFile(s,n),new i.Notice(`Cole\xE7\xE3o "${e}" criada.`),await this.app.workspace.getLeaf(!1).openFile(o),o}async createProjectLog(e){let t=e.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,""),s=`${this.settings.projectsFolder}/${t}.md`,o=this.app.vault.getAbstractFileByPath(s);if(o instanceof i.TFile)return new i.Notice(`Projeto "${e}" j\xE1 existe.`),await this.app.workspace.getLeaf(!1).openFile(o),o;let n=U(e);return o=await this.createFile(s,n),new i.Notice(`Projeto "${e}" criado.`),await this.app.workspace.getLeaf(!1).openFile(o),o}async getMigratedTasks(e){let t=f(e,-1),s=u(t),o=g(t),n=`${this.dailyFolder}/${s}/${o}.md`,r=this.app.vault.getAbstractFileByPath(n);if(!(r instanceof i.TFile))return[];let c=await this.app.vault.read(r),l=[],p=c.split(`
`),h=!1;for(let m of p){if(m.includes("## Tarefas Recorrentes")){h=!0;continue}h&&m.startsWith("## ")&&(h=!1),!h&&/^- \[ \] .+/.test(m)&&l.push(m.replace(/^- \[ \] /,"").trim())}return l}async loadSettings(){this.settings=Object.assign({},R,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}},w=class extends i.Modal{constructor(t,s){super(t);this.step=0;this.userName="";this.plugin=s}onOpen(){this.renderStep()}onClose(){this.contentEl.empty()}renderStep(){let{contentEl:t}=this;t.empty(),[this.renderStep0.bind(this),this.renderStep1.bind(this),this.renderStep2.bind(this),this.renderStep3.bind(this),this.renderStep4.bind(this),this.renderStep5.bind(this)][this.step]()}renderStep0(){let{contentEl:t}=this;t.createEl("h2",{text:"Bem-vindo ao Jack Journal"}),t.createEl("p",{text:"Um sistema de Bullet Journal para o Obsidian. Vamos configurar tudo em menos de 2 minutos."}),t.createEl("p",{text:"Voc\xEA vai criar seu Log Futuro, Log Mensal e primeiro Di\xE1rio \u2014 e configurar suas tarefas recorrentes."});let s=t.createEl("p",{text:"Como posso te chamar?"});s.style.marginTop="16px",s.style.fontWeight="600";let o=t.createEl("input",{type:"text",placeholder:"Seu nome"});o.style.cssText="width:100%;padding:8px;margin-top:8px;border-radius:4px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);",o.value=this.userName,o.addEventListener("input",r=>{this.userName=r.target.value});let n=new i.ButtonComponent(t);n.setButtonText("Come\xE7ar \u2192"),n.setCta(),n.buttonEl.style.marginTop="16px",n.onClick(async()=>{let r=this.userName.trim()||"Meu";this.plugin.settings.userName=r;let c=B(r);this.plugin.settings.logsFolder=c.logsFolder,this.plugin.settings.projectsFolder=c.projectsFolder,this.plugin.settings.collectionsFolder=c.collectionsFolder,this.plugin.settings.recurringFile=c.recurringFile,await this.plugin.saveSettings(),await this.plugin.initFolders(),this.step=1,this.renderStep()})}renderStep1(){let{contentEl:t}=this,s=this.plugin.settings.userName;t.createEl("h2",{text:"Passo 1 de 5 \u2014 Tarefas Recorrentes"}),t.createEl("p",{text:`${s}, tarefas recorrentes s\xE3o coisas que voc\xEA faz todo dia \u2014 exerc\xEDcio, leitura, ora\xE7\xE3o, etc.`}),t.createEl("p",{text:"Ficam salvas em um \xFAnico arquivo (recorrentes.md) e s\xE3o adicionadas automaticamente em cada di\xE1rio."});let o=t.createEl("p",{text:"\u2192 Vamos criar seu arquivo de tarefas recorrentes. Voc\xEA pode editar quando quiser."});o.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let n=new i.ButtonComponent(t);n.setButtonText("Criar recorrentes.md"),n.setCta(),n.buttonEl.style.marginTop="16px",n.onClick(async()=>{await this.plugin.openRecurringFile(),this.step=2,this.renderStep()})}renderStep2(){let{contentEl:t}=this,s=this.plugin.settings.userName,o=b(d());t.createEl("h2",{text:"Passo 2 de 5 \u2014 Log Futuro"}),t.createEl("p",{text:`O Log Futuro \xE9 seu calend\xE1rio anual, ${s}. Aqui ficam eventos e tarefas a mais de um m\xEAs de dist\xE2ncia.`}),t.createEl("p",{text:"No in\xEDcio de cada m\xEAs, migre o que for pertinente para o Log Mensal."});let n=t.createEl("p",{text:`\u2192 Vamos criar o Log Futuro de ${o}.`});n.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let r=new i.ButtonComponent(t);r.setButtonText(`Criar Log Futuro ${o}`),r.setCta(),r.buttonEl.style.marginTop="16px",r.onClick(async()=>{await this.plugin.openOrCreateFutureLog(o),this.step=3,this.renderStep()})}renderStep3(){let{contentEl:t}=this,s=d(),o=u(s),n=C(s),r=b(s);t.createEl("h2",{text:"Passo 3 de 5 \u2014 Log Mensal"}),t.createEl("p",{text:"O Log Mensal tem o calend\xE1rio do m\xEAs, tarefas e projetos, h\xE1bitos e espa\xE7o para revis\xE3o no final do m\xEAs."}),t.createEl("p",{text:"No in\xEDcio de cada m\xEAs, crie um novo e migre as tarefas pendentes do m\xEAs anterior."});let c=t.createEl("p",{text:`\u2192 Vamos criar o Log Mensal de ${n} ${r}.`});c.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let l=new i.ButtonComponent(t);l.setButtonText(`Criar Log Mensal \u2014 ${o}`),l.setCta(),l.buttonEl.style.marginTop="16px",l.onClick(async()=>{await this.plugin.openOrCreateMonthlyLog(s),this.step=4,this.renderStep()})}renderStep4(){let{contentEl:t}=this,s=d(),o=g(s);t.createEl("h2",{text:"Passo 4 de 5 \u2014 Di\xE1rio"}),t.createEl("p",{text:"O Di\xE1rio \xE9 o cora\xE7\xE3o do sistema. Abra todo dia para registrar tarefas, eventos e notas."});let n=t.createEl("ul");["Tarefas recorrentes \u2014 puxadas automaticamente de recorrentes.md","Tarefas de projetos \u2014 s\xF3 as tarefas ativas, sem backlog","Herdado de ontem \u2014 tarefas pendentes do dia anterior","Eventos e notas livres"].forEach(l=>n.createEl("li",{text:l}));let r=t.createEl("p",{text:`\u2192 Vamos criar o di\xE1rio de hoje (${o}).`});r.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:12px;";let c=new i.ButtonComponent(t);c.setButtonText(`Criar Di\xE1rio de Hoje \u2014 ${o}`),c.setCta(),c.buttonEl.style.marginTop="16px",c.onClick(async()=>{await this.plugin.openOrCreateDailyLog(s),this.step=5,this.renderStep()})}renderStep5(){let{contentEl:t}=this,s=this.plugin.settings.userName;t.createEl("h2",{text:`Pronto, ${s}!`}),t.createEl("p",{text:"Seu sistema est\xE1 configurado. A rotina \xE9 simples:"}),[{emoji:"\u2600\uFE0F",title:"Todo dia",text:'Abra o di\xE1rio (\xEDcone do livro na barra lateral ou Cmd+P \u2192 "Abrir di\xE1rio de hoje"). Registre tarefas, eventos e notas.'},{emoji:"\u{1F4C5}",title:"Todo m\xEAs",text:"Crie o Log Mensal do novo m\xEAs, migre tarefas pendentes e revise o m\xEAs anterior."},{emoji:"\u{1F4CB}",title:"Novos projetos",text:'Cmd+P \u2192 "Novo projeto". As tarefas ativas aparecem automaticamente no di\xE1rio.'},{emoji:"\u{1F52E}",title:"Coisas distantes",text:"Anote no Log Futuro. No come\xE7o do m\xEAs, migre para o mensal."},{emoji:"\u{1F501}",title:"Tarefas recorrentes",text:'Edite recorrentes.md uma vez (Cmd+P \u2192 "Editar tarefas recorrentes"). Aparecem em cada di\xE1rio automaticamente.'}].forEach(({emoji:r,title:c,text:l})=>{let p=t.createEl("div");p.style.cssText="background:var(--background-secondary);padding:12px;border-radius:6px;margin-top:10px;",p.createEl("strong",{text:`${r} ${c}`}),p.createEl("p",{text:l}).style.margin="4px 0 0 0"});let n=new i.ButtonComponent(t);n.setButtonText("Come\xE7ar a usar \u2192"),n.setCta(),n.buttonEl.style.marginTop="20px",n.onClick(async()=>{this.plugin.settings.onboardingDone=!0,await this.plugin.saveSettings(),this.close(),await this.plugin.openFile("INDEX.md")})}},v=class extends i.Modal{constructor(t,s){super(t);this.projectName="";this.onSubmit=s}onOpen(){let{contentEl:t}=this;t.createEl("h2",{text:"Novo Projeto"}),new i.Setting(t).setName("Nome do projeto").addText(s=>{s.setPlaceholder("ex: Site da empresa X"),s.onChange(o=>{this.projectName=o}),setTimeout(()=>s.inputEl.focus(),50)}),new i.Setting(t).addButton(s=>{s.setButtonText("Criar projeto"),s.setCta(),s.onClick(()=>{if(!this.projectName.trim()){new i.Notice("Digite um nome para o projeto.");return}this.close(),this.onSubmit(this.projectName.trim())})})}onClose(){this.contentEl.empty()}},x=class extends i.Modal{constructor(t,s){super(t);this.collectionName="";this.onSubmit=s}onOpen(){let{contentEl:t}=this;t.createEl("h2",{text:"Nova Cole\xE7\xE3o"}),new i.Setting(t).setName("Nome da cole\xE7\xE3o").addText(s=>{s.setPlaceholder("ex: Livros para ler"),s.onChange(o=>{this.collectionName=o}),setTimeout(()=>s.inputEl.focus(),50)}),new i.Setting(t).addButton(s=>{s.setButtonText("Criar cole\xE7\xE3o"),s.setCta(),s.onClick(()=>{if(!this.collectionName.trim()){new i.Notice("Digite um nome para a cole\xE7\xE3o.");return}this.close(),this.onSubmit(this.collectionName.trim())})})}onClose(){this.contentEl.empty()}},E=class extends i.PluginSettingTab{constructor(e,t){super(e,t),this.plugin=t}display(){let{containerEl:e}=this;e.empty(),e.createEl("h2",{text:"Jack Journal"}),new i.Setting(e).setName("Pasta dos logs").setDesc("Cont\xE9m as subpastas diario, mensal e futuro.").addText(t=>{t.setValue(this.plugin.settings.logsFolder),t.onChange(async s=>{this.plugin.settings.logsFolder=s,await this.plugin.saveSettings()})}),new i.Setting(e).setName("Pasta dos projetos").addText(t=>{t.setValue(this.plugin.settings.projectsFolder),t.onChange(async s=>{this.plugin.settings.projectsFolder=s,await this.plugin.saveSettings()})}),new i.Setting(e).setName("Pasta das cole\xE7\xF5es").addText(t=>{t.setValue(this.plugin.settings.collectionsFolder),t.onChange(async s=>{this.plugin.settings.collectionsFolder=s,await this.plugin.saveSettings()})}),new i.Setting(e).setName("Arquivo de tarefas recorrentes").addText(t=>{t.setValue(this.plugin.settings.recurringFile),t.onChange(async s=>{this.plugin.settings.recurringFile=s,await this.plugin.saveSettings()})}),new i.Setting(e).setName("Refazer configura\xE7\xE3o inicial").setDesc("Reabre o guia de setup.").addButton(t=>{t.setButtonText("Abrir onboarding"),t.onClick(()=>{this.plugin.settings.onboardingDone=!1,this.plugin.saveSettings(),new w(this.app,this.plugin).open()})})}};
