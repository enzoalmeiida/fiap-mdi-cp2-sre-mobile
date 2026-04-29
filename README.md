# FIAP Status & SRE Mobile

Aplicativo mobile desenvolvido com React Native, Expo e Expo Router para monitoramento de operação, status de serviços, gestão de incidentes e recursos de segurança para ambiente SRE/NOC.

## a) Sobre o Projeto

- **Nome do app:** FIAP Status & SRE Mobile
- **Problema que resolve:** centraliza a visualização de uptime, telemetria de datacenter e gestão de incidentes críticos em uma interface mobile com foco operacional.
- **Operação da FIAP escolhida:** [preencher manualmente]
- **Por que essa operação:** [preencher manualmente]
- **O que mudou em relação ao CP1:**
  - autenticação local com contexto global de sessão
  - persistência de login com SecureStore
  - proteção de rotas com Expo Router
  - validação inline de login e cadastro
  - biometria para reentrada no app
  - persistência de incidentes em AsyncStorage
  - busca dinâmica em incidentes
  - feedback tátil com Haptics
  - notificações locais tipo pager de SRE
  - evidência de incidente com câmera/galeria e preview
- **Funcionalidades implementadas:**
  - login local com validação
  - cadastro local com confirmação de senha
  - logout e retomada de sessão
  - desbloqueio biométrico
  - painel de uptime
  - painel de datacenter
  - lista de incidentes com filtro
  - salvamento de incidentes no storage
  - anexo de evidência por foto
  - notificações locais

## b) Integrantes do Grupo

- Enzo Almeida Santos Ramos RM: 556900
  
- Gabriel de Mello Silva Fernandes RM: 554421

- Guilherme Machado Moreira RM: 557290

- Jose Antonio Kretzer Rodriguez RM: 555523

## c) Como Rodar o Projeto

### Pré-requisitos

- Node.js instalado
- Expo Go instalado no celular ou emulador configurado
- Expo SDK compatível com o projeto

### Passo a passo

```bash
git clone https://github.com/enzoalmeiida/fiap-mdi-cp2-sre-mobile.git
cd fiap-mdi-cp2-sre-mobile
npm install
npx expo start
```

### Execução

- No terminal, execute `npx expo start`.
- Escaneie o QR Code com o Expo Go no celular ou abra em um emulador.

## d) Demonstração Visual - OBRIGATÓRIO

### Prints obrigatórios

Incluir prints de **todas** as telas do app:

- Login
- Cadastro
- Biometria
- Uptime
- Datacenter
- Incidentes
- Tela com notificação local recebida
- Tela de incidentes com evidência/anexo

### GIF ou vídeo da demonstração do fluxo completo

Fluxo sugerido:

1. cadastro
2. login
3. biometria
4. dashboard
5. Uptime
6. Datacenter
7. Incidentes
8. anexar evidência
9. salvar incidente
10. logout

### Orientações de gravação

- Para GIF: usar Android Studio Emulator + Record Screen.
- Para vídeo: gravar a tela do celular ou emulador e subir no YouTube/Google Drive com o link no README.

### Regra de avaliação

- README sem prints e sem demonstração em vídeo/GIF pode sofrer desconto automático conforme o enunciado.

## e) Decisões Técnicas

- **Estrutura do projeto:**
  - `app/` para rotas do Expo Router
  - `src/context/` para o contexto global de autenticação
  - `app/(tabs)/` para as telas principais do dashboard
  - `hooks/` e `constants/` para suporte ao template do Expo
- **Contexts criados:**
  - `AuthContext` para sessão global, login, registro, logout e desbloqueio biométrico
- **Autenticação:**
  - login e cadastro locais, sem Firebase, Supabase ou backend externo
  - sessão salva de forma persistente com SecureStore quando disponível
- **AsyncStorage utilizado para:**
  - salvar o usuário cadastrado localmente
  - persistir a lista de incidentes
  - restaurar incidentes ao reabrir o app
- **SecureStore utilizado para:**
  - armazenar a sessão/token do usuário logado
- **Navegação protegida:**
  - o root layout bloqueia acesso às tabs sem sessão válida
  - usuário autenticado passa pela biometria ao reabrir o app
- **Notificações locais:**
  - configuradas no root layout com handler para exibir alertas em primeiro plano
- **Mídia e evidências:**
  - `expo-image-picker` para câmera e galeria
  - preview da imagem antes de salvar
  - URI da imagem salvo junto com o incidente

## f) Diferencial Implementado - OBRIGATÓRIO

### Diferenciais escolhidos

- notificações locais tipo pager de SRE
- evidência de incidente com câmera/galeria e preview
- biometria para reentrada segura
- feedback tátil com Haptics
- busca dinâmica em incidentes

### Justificativa

Esses diferenciais aumentam a aderência do app a um cenário real de NOC/SRE, pois permitem:

- alertar rapidamente sobre falhas críticas
- registrar evidências operacionais de incidentes
- reforçar a segurança de acesso ao painel
- melhorar a experiência do operador durante a triagem

### Resumo técnico

- `expo-notifications` agenda alertas locais com exibição em primeiro plano
- `expo-image-picker` coleta imagens da câmera ou da galeria
- `AsyncStorage` guarda os incidentes e seus metadados
- `SecureStore` protege a sessão do usuário
- `expo-local-authentication` controla o desbloqueio biométrico
- `expo-haptics` adiciona retorno tátil nas ações críticas

## g) Próximos Passos

- integrar backend real para autenticação e incidentes [opcional]
- adicionar edição/exclusão de incidentes
- incluir múltiplas imagens por incidente
- criar gráficos de disponibilidade e SLA
- persistir logs de auditoria operacional

## Observações Finais

- O projeto foi construído sem Firebase, Supabase ou serviços similares.
- Toda a persistência e autenticação foram implementadas com APIs nativas do ecossistema Expo/React Native.
- Campos pessoais e informações não fornecidas foram deixados como placeholders para preenchimento manual.
