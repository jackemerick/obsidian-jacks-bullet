# Jacks Bullet — Obsidian Plugin

Plugin oficial do [Jacks Bullet](https://github.com/jackemerick/jacks-bullet), um sistema de Bullet Journal para o Obsidian baseado na metodologia de Ryder Carroll.

## O que o plugin faz

- **Onboarding guiado** — abre automaticamente na primeira vez e guia você a criar o Future Log, Log Mensal e primeiro Log Diário
- **Ribbon button** — ícone fixo na barra lateral que abre o log de hoje (cria automaticamente se não existir)
- **Auto-migração** — ao criar o log diário, puxa as tarefas pendentes do dia anterior
- **Comandos via Cmd+P:**
  - `Abrir log de hoje`
  - `Novo log mensal`
  - `Novo future log`
  - `Novo projeto`
  - `Abrir Dashboard (INDEX)`

## Instalação

### Via diretório de plugins (recomendado)

1. Abra o Obsidian → Settings → Community plugins
2. Desative o Safe Mode
3. Clique em Browse e busque **Jacks Bullet**
4. Instale e ative

### Manual

1. Baixe `main.js`, `manifest.json` e `styles.css` do [último release](https://github.com/jackemerick/obsidian-jacks-bullet/releases/latest)
2. Crie a pasta `.obsidian/plugins/jacks-bullet/` no seu vault
3. Copie os 3 arquivos para essa pasta
4. Recarregue o Obsidian e ative o plugin em Settings → Community plugins

## Template do vault

Para usar o sistema completo (estrutura de pastas, templates de logs), baixe o vault em:

→ [github.com/jackemerick/jacks-bullet](https://github.com/jackemerick/jacks-bullet)

## Desenvolvimento

```bash
git clone https://github.com/jackemerick/obsidian-jacks-bullet
cd obsidian-jacks-bullet
npm install
npm run dev   # watch mode
npm run build # produção
```

Copie `main.js`, `manifest.json` e `styles.css` para `.obsidian/plugins/jacks-bullet/` no seu vault de teste.

## Licença

MIT — [Jack Emerick](https://jackemerick.com.br)
