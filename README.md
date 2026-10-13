
Conceito da Aula 5 (Gerenciamento de Memória)
Mecânica do Jogo ("Sou a MMU")
Endereço Lógico / Virtual   O endereço gerado sob a perspectiva do programa, exibido como solicitação de acesso.   
Endereço Físico   A localização real no pente de RAM que o jogador precisa calcular e digitar.   
MMU (Memory Management Unit)   O papel assumido pelo jogador de interceptar requisições e realizar a tradução.   
Registrador Base   O valor do SO exibido na Fase 1 que deve ser somado ao endereço lógico.   
Paginação & Tabela de Páginas   Mecânica da Fase 2, onde o jogador faz o lookup na tabela para obter o Quadro (Frame) e somar com o deslocamento (offset).   

## Documentação completa 

# 🕹️ Sou a MMU! (Memory Management Unit)

> **Disciplina:** Sistemas Operacionais  
> **Professor:** Prof. Me. Emerson Ap. Mouco Jr.  
> **Instituição:** FATEC Ilha Solteira  
> **Tema Escolhido:** Gerenciamento de Memória (Aula 5)

---

## 👥 Integrantes do Grupo
* Victor Pena Maiolino
* Claudio Marcelo de Souza Inhã

---

## 📋 Sobre o Projeto
O **Sou a MMU!** é um jogo desenvolvido em HTML, CSS e JavaScript puros (sem frameworks externos), projetado para rodar diretamente no navegador. 

O jogo simula o papel do chip **MMU (Memory Management Unit)** presente na CPU. O jogador assume a responsabilidade de interceptar as requisições de endereços lógicos feitas pelos programas e traduzi-las em tempo real para os endereços físicos correspondentes na memória RAM.

---

## 🎮 Como Jogar
1. Acesse o jogo publicado no **GitHub Pages**: `https://victorpmaiolino-sys.github.io/Sou-a-MMU-/`
2. Na tela inicial, leia o **Tutorial** para entender como a tradução de endereços funciona na teoria.
3. Clique em **"Começar Simulação"**:
   * **Fase 1 (Registrador Base):** Calcule o Endereço Físico somando o Endereço Lógico ao valor do Registrador Base.
   * **Fase 2 (Paginação):** O sistema ativa a paginação. Consulte a Tabela de Páginas da MMU para identificar em qual Quadro (*Frame*) a Página está alocada e aplique a fórmula: `(Quadro × 100) + Deslocamento`.
4. Digite a resposta no campo e pressione `Enter` ou clique no botão **"Traduzir"**.
5. Acompanhe o log do sistema no terminal verde e tente obter a maior precisão possível antes do tempo acabar!

---

## 🚀 Recursos Principais

*   **Fase 1: Registrador Base**
    *   Simula a tradução básica somando o Endereço Lógico ao Registrador Base do sistema.
    *   Modo campanha padrão com 10 exercícios para fixação do conceito.
*   **Fase 2: Paginação**
    *   Simula sistemas de paginação com Tabela de Páginas, associando Páginas Lógicas a Quadros Físicos (RAM) e Deslocamentos.
    *   Modo campanha padrão com 10 exercícios.
*   **♾️ Modo Infinito (Fase 1 e Fase 2)**
    *   Modos arcades ocultos até que o jogador conclua a respectiva fase normal pela primeira vez.
    *   Geração contínua e infinita de solicitações de memória.
    *   **Sistema de Pontuação:** Cada tarefa concluída com sucesso concede `+100 pontos`, enquanto erros retiram `35 pontos` (com limite mínimo em zero).
    *   **Botão "Finalizar MMU":** Permite ao jogador encerrar a sessão voluntariamente a qualquer momento para computar pontuações, tarefas realizadas e registrar recordes pessoais salvos automaticamente no navegador (`localStorage`).

---

## 🎓 Tabela: Conceito da Aula vs. Mecânica do Jogo

| Conceito da Aula 5 (Gerenciamento de Memória) | Mecânica no Jogo |
|
| **Endereço Lógico (Virtual)** | O endereço fornecido na requisição sob a perspectiva do programa (ex: *Endereço Lógico: 10*). |
| **Endereço Físico** | O endereço real na RAM que o jogador deve calcular e inserir no campo de entrada. |
| **MMU (Memory Management Unit)** | O papel assumido pelo jogador, atuando como o chip de hardware intermediário entre a CPU e a RAM. |
| **Registrador Base** | O valor do SO exibido no painel da Fase 1, que o jogador deve somar diretamente ao Endereço Lógico. |
| **Paginação & Tabela de Páginas** | O painel exibido na Fase 2, onde o jogador faz a busca (*lookup*) da Página Lógica para obter o Quadro (*Frame*) Físico e somar com o deslocamento (*offset*). |
| **Feedback de Erro / Log** | Terminal no rodapé do jogo que simula o comportamento interno do SO e informa se o acesso à memória foi bem-sucedido ou falhou. |

---

## 🛠️ Tecnologias Utilizadas
* **HTML5** (Estruturação)
* **CSS3** (Estilização e Layout Responsivo)
* **JavaScript ES6+** (Lógica do Jogo, Temporizador e Mapeamento da MMU)

---

## 📦 Entregáveis
* **Link do Jogo:** `https://victorpmaiolino-sys.github.io/Sou-a-MMU-/`
* **Repositório:** `https://github.com/victorpmaiolino-sys/Sou-a-MMU-`