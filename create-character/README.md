# Criador de Personagem

### Os inputs para serem preenchidos são:
 * **ANIMAÇÃO:** indica a animação que será criada
 * **DIREÇÃO:** indica a direção do personagem
 * **FRAME:** indica o frame da animação
 * **WIDTH:** a largura do frame que será criado
 * **HEIGHT:** a altura do frame que será criado
 * **X**: a posição do X na sprite
 * **Y**: a posição do Y na sprite


### INPUT direção
-----------------------------------------------
O input **direção** só pode ser representado entre [0-3], onde cada número representa uma direção/posicionamento do corpo do personagem.

| Numero Representação             | Significado                       |
|:--------------------------------:|----------------------------------:|
| 0                                | Personagem virado de Frente       |
| 1                                | Personagem virado para Esquerda   |
| 2                                | Personagem virado para Direita    |
| 3                                | Personagem virado de Costas       |


----------------------------------------------------------------------------

## Organização dos dados
 * Todos os dados serão armazenados num **JSON**, onde cada *animação* será uma key do JSON.

 * Cada **animação** conterá um array de 4 indices, cada um representando uma *direção* do corpo do personagem.

 * Cada **direção** conterá um array com um número variado de indices, cada um representando um *frame* da        *animação* naquela *direção*. 

 * Cada **frame** conterá um array com 4 números, cada um representando altura, largura, posição X, posição Y
   
    *Detalhe: estas posições(X,Y) não tem ligação com o jogo direto, sua relação é unicamente com a posição do frame na sprite*
