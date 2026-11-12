/**
 * Les états du jeu possible
 * 
 * A tout moment, le jeu est dans un SEUL de ces états. Game regarde l'état courant pour savoir quoi faire
 * PLAYING : tout bouge et le joueur peut tirer
 * PAUSED : rien ne bouge et on affiche pause
 * GAME_OVER : plus de vie => écran de défaite
 * VICTORY : tous les aliens sont détruits => écran de victoire
 * MAIN_MENU : Menu principal
 * 
 * Pourquoi un objet de constante plutôt que d'écrire "playing" partout ?
 * Une faute de frappe dans une chaine ("playin") ne provoque aucune erreur et le bug va être difficile à trouver. Avec GameState.PLAYING, une faute de frappe donne undefined et se voit tout de suite
 * 
 * Object.freeze : rend l'objet NON MODIFIABLE; impossible de changer une valeur
 * 
 * A NOTER : si vous devez ajouter un nouvel état de jeu, c'est ici qu'il faut le définir (ex: menu de démarrage, multi-niveau avec un état de transition entre 2 niveaux)
 */

export const GameState = Object.freeze({
    PLAYING: "playing",
    PAUSED: "paused",
    GAME_OVER: "gameover",
    VICTORY: "victory",
    MAIN_MENU: "main-menu"
});