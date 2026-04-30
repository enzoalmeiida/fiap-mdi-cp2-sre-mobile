# 📱 FIAP Status & SRE Mobile

## a) Sobre o Projeto

**Nome do app:** FIAP Status & SRE Mobile

**Descrição do problema que resolve:** Atualmente, as equipes de TI e Facilities precisam estar fisicamente na sala de controle ou acessando computadores específicos para acompanhar a saúde da infraestrutura da faculdade. Isso pode gerar atrasos na detecção de falhas de rede, problemas em equipamentos de laboratório ou anomalias no datacenter. O app resolve isso colocando um painel de NOC (Network Operations Center) e SRE (Site Reliability Engineering) na palma da mão da equipe técnica.

**Qual operação da FIAP foi escolhida e por quê:**
Escolhemos o **Monitoramento e Gestão de Infraestrutura Campus/Datacenter**. A escolha se deu porque a disponibilidade de serviços (Wi-Fi, catracas, sistemas do aluno) e o bom funcionamento dos equipamentos (projetores, ar-condicionado) impactam diretamente a experiência de todos os alunos e professores. Agilizar a resposta a esses incidentes é vital para a qualidade do ensino.


---

## b) Integrantes do Grupo

* **Enzo Almeida Santos Ramos** - RM 556900
* **Gabriel de Mello Silva Fernandes** - RM 554421
* **Guilherme Machado Moreira** - RM 557290
* **Jose Antonio Kretzer Rodriguez** - RM 555523

---

## c) Como Rodar o Projeto

**Pré-requisitos:**
* [Node.js](https://nodejs.org/) instalado em sua máquina.
* Aplicativo **Expo Go** instalado no seu dispositivo móvel (Android ou iOS).

**Passo a passo para execução local:**

1.  **Clone este repositório para a sua máquina:**
    ```bash
    git clone [https://github.com/enzoalmeiida/fiap-mdi-cp1-sre-mobile.git](https://github.com/enzoalmeiida/fiap-mdi-cp1-sre-mobile.git)
    ```
2.  **Acesse o diretório do projeto:**
    ```bash
    cd fiap-mdi-cp2-sre-mobile
    ```
3.  **Instale as dependências do projeto:**
    ```bash
    npm install
    ```
4.  **Inicie o servidor do Expo:**
    ```bash
    npx expo start
    ```
5.  **Abra o aplicativo Expo Go no seu celular e escaneie o QR Code exibido no terminal.**

---

## d) Demonstração

🎬 **Vídeo de Demonstração**
Assista ao fluxo completo, incluindo cadastro, login, validações e monitoramento:
https://youtube.com/shorts/wypaT6iUx_g?si=kd5fPHnK0E-NtUxA

### 📸 Telas do App

| Tela  | Tela  | Tela  |
| :---: | :---: | :---: |
| ![Image 6](./assets/images/Image%20(6).jpg) | ![Image 5](./assets/images/Image%20(5).jpg) | ![Image 4](./assets/images/Image%20(4).jpg) |
| ![Image 3](./assets/images/Image%20(3).jpg) | ![Image 2](./assets/images/Image%20(2).jpg) | ![Image 1](./assets/images/Image%20(1).jpg) |

---

## e) Decisões Técnicas

**Estruturação e Navegação:**
Utilizamos o padrão **Expo Router** para roteamento modular dentro de `app/(tabs)`. A interface segue os princípios de acessibilidade para operações rápidas em ambiente de TI.

**Segurança e Persistência:**
A segurança é garantida pela combinação de **Context API** para o fluxo de estado e **SecureStore/AsyncStorage** para persistência de credenciais e dados operacionais, conforme solicitado nos requisitos de CP2.

**Hooks Utilizados:**
* **useState:** Gestão de inputs e dados de telemetria.
* **useEffect:** Carregamento de dados persistidos ao montar as telas.
* **useContext:** Consumo do estado global de autenticação em toda a aplicação.

---

## f) Diferenciais Implementados 

* **Autenticação com Context API & AsyncStorage:** Fluxo completo de Cadastro e Login com persistência de sessão. O app reconhece se o usuário já está logado ao reabrir.
* **Gerenciamento de Estado Global:** Uso de `AuthContext` para disponibilizar dados do usuário e funções de login/logout para todas as telas.
* **Formulários com Validação:** Validações em tempo real para campos vazios, formato de e-mail e requisitos de senha (mínimo 6 caracteres), com mensagens de erro dinâmicas.
* **Persistência de Dados Funcionais:** Armazenamento de estados de monitoramento e preferências via `AsyncStorage`, garantindo que os dados sobrevivam ao fechamento do app.
* **Dashboard de Observabilidade Real:** Monitoramento de serviços críticos (Portal do Aluno, Wi-Fi, etc.) com troca de status para "Falha" em tempo real.
* **Telemetria de Datacenter:** Sensores de temperatura, umidade e energia atualizados dinamicamente via hooks.


---

## g) Próximos Passos

Para as próximas iterações do projeto, o grupo planeja implementar:
* Integração com **Mapas Interativos** dos andares da faculdade para localização física de equipamentos.
* Conexão direta com sistemas de **Ticketing (Jira/ServiceNow)** para abertura automática de chamados ao detectar falhas.
* Dashboard de **Análise Preditiva** usando IA para antecipar quedas de energia no datacenter com base no histórico de telemetria.
