var w=Object.defineProperty;var L=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var C=Object.prototype.hasOwnProperty;var S=(o,t)=>{for(var e in t)w(o,e,{get:t[e],enumerable:!0})},j=(o,t,e,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of T(t))!C.call(o,a)&&a!==e&&w(o,a,{get:()=>t[a],enumerable:!(s=L(t,a))||s.enumerable});return o};var N=o=>j(w({},"__esModule",{value:!0}),o);var R={};S(R,{default:()=>F});module.exports=N(R);var n=require("obsidian"),P={userName:"",onboardingDone:!1,dailyFolder:"logs/daily",monthlyFolder:"logs/monthly",futureFolder:"logs/future",projectsFolder:"logs/projects",collectionsFolder:"collections"};function g(){return new Date}function y(o){return String(o).padStart(2,"0")}function h(o){return`${o.getFullYear()}-${y(o.getMonth()+1)}-${y(o.getDate())}`}function d(o){return`${o.getFullYear()}-${y(o.getMonth()+1)}`}function f(o){return String(o.getFullYear())}function m(o,t){let e=new Date(o);return e.setDate(e.getDate()+t),e}function $(o,t){let e=new Date(o);return e.setMonth(e.getMonth()+t),e}var M=["Janeiro","Fevereiro","Mar\xE7o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];function E(o){return M[o.getMonth()]}function k(o){return new Date(o.getFullYear(),o.getMonth()+1,0).getDate()}function A(o,t){let e=h(o),s=d(o),a=f(o),i=h(m(o,-1)),r=h(m(o,1)),l=d(m(o,-1)),c=d(m(o,1)),u=t.length>0?t.map(p=>`- [>] ${p}`).join(`
`):"- [ ] ";return`# Log Di\xE1rio \u2014 ${e}

\u2190 [[${l}/${i}|\u2190 Ontem]] | [[${c}/${r}|Amanh\xE3 \u2192]]
[[../../monthly/${s}|\u2191 ${E(o)} ${a}]]

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

${u}

---

## Eventos

- \u25CB

---

## Notas

\u2013

---

*\u2190 [[../../../INDEX|Dashboard]] | [[../../monthly/${s}|Log Mensal]]*
`}function B(o){let t=d(o),e=f(o),s=E(o),a=d($(o,-1)),i=d($(o,1)),r=k(o),l=Array.from({length:r},(c,u)=>{let p=y(u+1);return`| ${e}-${y(o.getMonth()+1)}-${p} | |`}).join(`
`);return`# Log Mensal \u2014 ${s} ${e}

\u2190 [[${a}|\u2190 M\xEAs anterior]] | [[${i}|Pr\xF3ximo m\xEAs \u2192]]

---

## Calend\xE1rio de Eventos

| Data | Evento |
|---|---|
${l}

---

## Tarefas e Projetos do M\xEAs

- [ ]
- [ ]

### Projetos ativos este m\xEAs

- [[../../projects/|]]

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

**O que preciso mudar ou ajustar?**
-

---

*\u2190 [[../../INDEX|Dashboard]] | [[../../future/${e}-future|Future Log ${e}]]*
`}function O(o){return`# Future Log \u2014 ${o}

> Eventos e tarefas que ainda n\xE3o t\xEAm m\xEAs certo ou est\xE3o a 2+ meses de dist\xE2ncia.
> Quando o m\xEAs chegar, migre para o Log Mensal correspondente.

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
`}function J(o){let t=h(g());return`# Projeto \u2014 ${o}

**Status:** \`Ativo\`
**In\xEDcio:** ${t}
**Deadline:** \u2014

---

## Descri\xE7\xE3o

> O que \xE9 este projeto? Uma linha.

---

## Objetivo

> Que problema precisa ser resolvido?

---

## Tarefas em Execu\xE7\xE3o

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

*\u2190 [[../../INDEX|Dashboard]]*
`}var F=class extends n.Plugin{async onload(){await this.loadSettings(),this.addRibbonIcon("book-open","Log de Hoje",async()=>{await this.openOrCreateDailyLog(g())}),this.addCommand({id:"open-today",name:"Abrir log de hoje",callback:async()=>{await this.openOrCreateDailyLog(g())}}),this.addCommand({id:"new-monthly",name:"Novo log mensal",callback:async()=>{await this.openOrCreateMonthlyLog(g())}}),this.addCommand({id:"new-future",name:"Novo future log",callback:async()=>{await this.openOrCreateFutureLog(f(g()))}}),this.addCommand({id:"new-project",name:"Novo projeto",callback:async()=>{new v(this.app,async t=>{await this.createProjectLog(t)}).open()}}),this.addCommand({id:"open-index",name:"Abrir Dashboard (INDEX)",callback:async()=>{await this.openFile("INDEX.md")}}),this.addSettingTab(new D(this.app,this)),this.settings.onboardingDone||setTimeout(()=>{new x(this.app,this).open()},800)}async ensureFolder(t){this.app.vault.getAbstractFileByPath(t)||await this.app.vault.createFolder(t)}async createFile(t,e){return await this.ensureFolder(t.substring(0,t.lastIndexOf("/"))),await this.app.vault.create(t,e)}async openFile(t){let e=this.app.vault.getAbstractFileByPath(t);e instanceof n.TFile&&await this.app.workspace.getLeaf(!1).openFile(e)}async openOrCreateDailyLog(t){let e=d(t),s=h(t),a=`${this.settings.dailyFolder}/${e}/${s}.md`,i=this.app.vault.getAbstractFileByPath(a);if(!(i instanceof n.TFile)){let r=await this.getMigratedTasks(t),l=A(t,r);i=await this.createFile(a,l),new n.Notice(`Log de ${s} criado.`)}return await this.app.workspace.getLeaf(!1).openFile(i),i}async openOrCreateMonthlyLog(t){let e=d(t),s=`${this.settings.monthlyFolder}/${e}.md`,a=this.app.vault.getAbstractFileByPath(s);if(!(a instanceof n.TFile)){let i=B(t);a=await this.createFile(s,i),new n.Notice(`Log mensal ${e} criado.`)}return await this.app.workspace.getLeaf(!1).openFile(a),a}async openOrCreateFutureLog(t){let e=`${this.settings.futureFolder}/${t}-future.md`,s=this.app.vault.getAbstractFileByPath(e);if(!(s instanceof n.TFile)){let a=O(t);s=await this.createFile(e,a),new n.Notice(`Future Log ${t} criado.`)}return await this.app.workspace.getLeaf(!1).openFile(s),s}async createProjectLog(t){let e=t.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,""),s=`${this.settings.projectsFolder}/${e}.md`,a=this.app.vault.getAbstractFileByPath(s);if(a instanceof n.TFile)return new n.Notice(`Projeto "${t}" j\xE1 existe.`),await this.app.workspace.getLeaf(!1).openFile(a),a;let i=J(t);return a=await this.createFile(s,i),new n.Notice(`Projeto "${t}" criado.`),await this.app.workspace.getLeaf(!1).openFile(a),a}async getMigratedTasks(t){let e=m(t,-1),s=d(e),a=h(e),i=`${this.settings.dailyFolder}/${s}/${a}.md`,r=this.app.vault.getAbstractFileByPath(i);if(!(r instanceof n.TFile))return[];let l=await this.app.vault.read(r),c=[],u=l.split(`
`),p=!1;for(let b of u){if(b.includes("## Tarefas Recorrentes")){p=!0;continue}p&&b.startsWith("## ")&&(p=!1),!p&&/^- \[ \] .+/.test(b)&&c.push(b.replace(/^- \[ \] /,"").trim())}return c}async loadSettings(){this.settings=Object.assign({},P,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}},x=class extends n.Modal{constructor(e,s){super(e);this.step=0;this.userName="";this.plugin=s}onOpen(){this.renderStep()}onClose(){this.contentEl.empty()}renderStep(){let{contentEl:e}=this;e.empty(),[this.renderStep0.bind(this),this.renderStep1.bind(this),this.renderStep2.bind(this),this.renderStep3.bind(this),this.renderStep4.bind(this)][this.step]()}renderStep0(){let{contentEl:e}=this;e.createEl("h2",{text:"Bem-vindo ao Jacks Bullet"}),e.createEl("p",{text:"Um sistema de Bullet Journal para o Obsidian. Vamos configurar tudo em menos de 2 minutos."}),e.createEl("p",{text:"Voc\xEA vai criar seu Future Log, Log Mensal e primeiro Log Di\xE1rio \u2014 e aprender a rotina do sistema."});let s=e.createEl("p",{text:"Como posso te chamar?"});s.style.marginTop="16px",s.style.fontWeight="600";let a=e.createEl("input",{type:"text",placeholder:"Seu nome"});a.style.width="100%",a.style.padding="8px",a.style.marginTop="8px",a.style.borderRadius="4px",a.style.border="1px solid var(--background-modifier-border)",a.style.background="var(--background-primary)",a.style.color="var(--text-normal)",a.value=this.userName,a.addEventListener("input",r=>{this.userName=r.target.value});let i=new n.ButtonComponent(e);i.setButtonText("Come\xE7ar \u2192"),i.setCta(),i.buttonEl.style.marginTop="16px",i.onClick(()=>{this.plugin.settings.userName=this.userName||"Jack",this.plugin.saveSettings(),this.step=1,this.renderStep()})}renderStep1(){let{contentEl:e}=this,s=this.plugin.settings.userName,a=f(g());e.createEl("h2",{text:"Passo 1 de 4 \u2014 Future Log"}),e.createEl("p",{text:`O Future Log \xE9 seu calend\xE1rio anual, ${s}. Aqui ficam eventos e tarefas que est\xE3o a mais de um m\xEAs de dist\xE2ncia.`}),e.createEl("p",{text:"No in\xEDcio de cada m\xEAs, voc\xEA revisa o Future Log e migra o que for pertinente para o Log Mensal."});let i=e.createEl("p",{text:`\u2192 Vamos criar o Future Log de ${a}.`});i.style.background="var(--background-secondary)",i.style.padding="12px",i.style.borderRadius="6px",i.style.marginTop="12px";let r=new n.ButtonComponent(e);r.setButtonText(`Criar Future Log ${a}`),r.setCta(),r.buttonEl.style.marginTop="16px",r.onClick(async()=>{await this.plugin.openOrCreateFutureLog(a),this.step=2,this.renderStep()})}renderStep2(){let{contentEl:e}=this,s=g(),a=d(s),i=E(s),r=f(s);e.createEl("h2",{text:"Passo 2 de 4 \u2014 Log Mensal"}),e.createEl("p",{text:"O Log Mensal tem o calend\xE1rio do m\xEAs, suas tarefas e projetos, h\xE1bitos que quer acompanhar e espa\xE7o para revis\xE3o no final do m\xEAs."}),e.createEl("p",{text:"No in\xEDcio de cada m\xEAs, voc\xEA cria um novo mensal e migra as tarefas pendentes do m\xEAs anterior."});let l=e.createEl("p",{text:`\u2192 Vamos criar o Log Mensal de ${i} ${r}.`});l.style.background="var(--background-secondary)",l.style.padding="12px",l.style.borderRadius="6px",l.style.marginTop="12px";let c=new n.ButtonComponent(e);c.setButtonText(`Criar Log Mensal \u2014 ${a}`),c.setCta(),c.buttonEl.style.marginTop="16px",c.onClick(async()=>{await this.plugin.openOrCreateMonthlyLog(s),this.step=3,this.renderStep()})}renderStep3(){let{contentEl:e}=this,s=g(),a=h(s);e.createEl("h2",{text:"Passo 3 de 4 \u2014 Log Di\xE1rio"}),e.createEl("p",{text:"O Log Di\xE1rio \xE9 o cora\xE7\xE3o do sistema. Voc\xEA abre todo dia, registra tarefas, eventos e notas."});let i=e.createEl("ul");["Tarefas recorrentes \u2014 sua rotina fixa","Tarefas de projetos \u2014 s\xF3 as que est\xE3o em execu\xE7\xE3o","Herdado de ontem \u2014 tarefas pendentes do dia anterior","Eventos e notas livres do dia"].forEach(c=>i.createEl("li",{text:c}));let r=e.createEl("p",{text:`\u2192 Vamos criar o Log de hoje (${a}).`});r.style.background="var(--background-secondary)",r.style.padding="12px",r.style.borderRadius="6px",r.style.marginTop="12px";let l=new n.ButtonComponent(e);l.setButtonText(`Criar Log de Hoje \u2014 ${a}`),l.setCta(),l.buttonEl.style.marginTop="16px",l.onClick(async()=>{await this.plugin.openOrCreateDailyLog(s),this.step=4,this.renderStep()})}renderStep4(){let{contentEl:e}=this,s=this.plugin.settings.userName;e.createEl("h2",{text:`Pronto, ${s}!`}),e.createEl("p",{text:"Seu sistema est\xE1 configurado. A rotina \xE9 simples:"}),[{emoji:"\u2600\uFE0F",title:"Todo dia",text:'Abra o log di\xE1rio (\xEDcone do livro na barra lateral ou Cmd+P \u2192 "Abrir log de hoje"). Registre tarefas, eventos e notas.'},{emoji:"\u{1F4C5}",title:"Todo m\xEAs",text:"Crie o Log Mensal do novo m\xEAs, migre as tarefas pendentes e revise o m\xEAs anterior."},{emoji:"\u{1F4CB}",title:"Novos projetos",text:'Cmd+P \u2192 "Novo projeto". Coloque as tarefas em execu\xE7\xE3o no log di\xE1rio.'},{emoji:"\u{1F52E}",title:"Coisas distantes",text:"Anote no Future Log. No come\xE7o do m\xEAs, migre para o mensal."}].forEach(({emoji:r,title:l,text:c})=>{let u=e.createEl("div");u.style.background="var(--background-secondary)",u.style.padding="12px",u.style.borderRadius="6px",u.style.marginTop="10px",u.createEl("strong",{text:`${r} ${l}`}),u.createEl("p",{text:c}).style.margin="4px 0 0 0"});let i=new n.ButtonComponent(e);i.setButtonText("Come\xE7ar a usar \u2192"),i.setCta(),i.buttonEl.style.marginTop="20px",i.onClick(async()=>{this.plugin.settings.onboardingDone=!0,await this.plugin.saveSettings(),this.close(),await this.plugin.openFile("INDEX.md")})}},v=class extends n.Modal{constructor(e,s){super(e);this.projectName="";this.onSubmit=s}onOpen(){let{contentEl:e}=this;e.createEl("h2",{text:"Novo Projeto"}),new n.Setting(e).setName("Nome do projeto").addText(s=>{s.setPlaceholder("Ex: Site da empresa X"),s.onChange(a=>{this.projectName=a}),setTimeout(()=>s.inputEl.focus(),50)}),new n.Setting(e).addButton(s=>{s.setButtonText("Criar projeto"),s.setCta(),s.onClick(()=>{if(!this.projectName.trim()){new n.Notice("Digite um nome para o projeto.");return}this.close(),this.onSubmit(this.projectName.trim())})})}onClose(){this.contentEl.empty()}},D=class extends n.PluginSettingTab{constructor(t,e){super(t,e),this.plugin=e}display(){let{containerEl:t}=this;t.empty(),t.createEl("h2",{text:"Jacks Bullet \u2014 Configura\xE7\xF5es"}),new n.Setting(t).setName("Pasta dos logs di\xE1rios").setDesc("Padr\xE3o: logs/daily").addText(e=>{e.setValue(this.plugin.settings.dailyFolder),e.onChange(async s=>{this.plugin.settings.dailyFolder=s,await this.plugin.saveSettings()})}),new n.Setting(t).setName("Pasta dos logs mensais").setDesc("Padr\xE3o: logs/monthly").addText(e=>{e.setValue(this.plugin.settings.monthlyFolder),e.onChange(async s=>{this.plugin.settings.monthlyFolder=s,await this.plugin.saveSettings()})}),new n.Setting(t).setName("Pasta do future log").setDesc("Padr\xE3o: logs/future").addText(e=>{e.setValue(this.plugin.settings.futureFolder),e.onChange(async s=>{this.plugin.settings.futureFolder=s,await this.plugin.saveSettings()})}),new n.Setting(t).setName("Pasta dos projetos").setDesc("Padr\xE3o: logs/projects").addText(e=>{e.setValue(this.plugin.settings.projectsFolder),e.onChange(async s=>{this.plugin.settings.projectsFolder=s,await this.plugin.saveSettings()})}),new n.Setting(t).setName("Repetir onboarding").setDesc("Reabre o guia de configura\xE7\xE3o inicial").addButton(e=>{e.setButtonText("Abrir onboarding"),e.onClick(()=>{this.plugin.settings.onboardingDone=!1,this.plugin.saveSettings(),new x(this.app,this.plugin).open()})})}};
