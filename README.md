# FIAP Status & SRE Mobile 🚀

Aplicativo mobile desenvolvido com **React Native**, **Expo** e **Expo Router** para monitoramento de operação, status de serviços, gestão de incidentes e recursos de segurança para ambiente SRE/NOC.

---

## d) Demonstração

🎬 **Vídeo de Demonstração** Assista ao fluxo principal do app em funcionamento:  
(https://youtube.com/shorts/wypaT6iUx_g?si=ayyZiln862QMmGIt)

📸 **Telas do App**

| Login | Cadastro | Biometria | Uptime & SLA | Datacenter | Incidentes | Perfil |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| <img width="1080" height="2237" alt="Image" src="https://github.com/user-attachments/assets/486195f1-3754-465c-9a7f-85b959bf1249" />
 | <img width="1080" height="2240" alt="Image (1)" src="https://github.com/user-attachments/assets/627344cd-2de2-4ddb-b706-2ae24d5acc63" />
 | <img width="1080" height="2246" alt="Image (2)" src="https://github.com/user-attachments/assets/706201e1-631b-4b0a-9243-489dd14a4097" />
 | <img width="1080" height="2254" alt="Image (3)" src="https://github.com/user-attachments/assets/6c4b7ccb-9188-4a0b-bdc7-622aae213b08" />
 | <img width="1080" height="2227" alt="Image (4)" src="https://github.com/user-attachments/assets/72191144-29f9-48b6-bac1-50bf06e6f149" />
 | <img width="1080" height="2248" alt="Image (5)" src="https://github.com/user-attachments/assets/6afa2192-3de3-4cd9-bf69-f34a44f2fdcf" />
 | <img width="1074" height="2245" alt="Image (6)" src="https://github.com/user-attachments/assets/a108e892-0aab-4b78-9fb4-495476dd5ebc" />
 

---

## e) Decisões Técnicas

### Estrutura do Projeto:
O projeto foi estruturado seguindo o padrão do **Expo Router**, utilizando rotas baseadas em arquivos e organização modular para facilitar a manutenção.

- **Autenticação:** Sistema local seguro utilizando `SecureStore` para persistência de sessão e `expo-local-authentication` para acesso biométrico.
- **Contextos:** `AuthContext` gerencia o estado global de autenticação e proteção de rotas.
- **Persistência de Dados:** Uso de `AsyncStorage` para armazenamento local da lista de incidentes e evidências.
- **UX/UI:** Implementação de feedback tátil com `Haptics` e notificações locais tipo "Pager" para alertas críticos de infraestrutura.

## b) Integrantes do Grupo

- **Enzo Almeida Santos Ramos** - RM: 556900
- **Gabriel de Mello Silva Fernandes** - RM: 554421
- **Guilherme Machado Moreira** - RM: 557290
- **Jose Antonio Kretzer Rodriguez** - RM: 555523

## c) Como Rodar o Projeto

1. Clone o repositório:
   ```bash
   git clone [https://github.com/enzoalmeiida/fiap-mdi-cp2-sre-mobile.git](https://github.com/enzoalmeiida/fiap-mdi-cp2-sre-mobile.git)
