/**
 * Touches que le jeu utilise
 * On va devoir enlever le comportement naturel du navigateur (flèche du bas, faire défiler la page, etc) => on va utiliser preventDefault()
 */
const GAME_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "Enter"])

/**
 * Mémorise l'état du clavier
 * 
 * Pourquoi une classe dédiée ? Le joueur ne doit jamais lirele clavier lui-même
 * Game interroge ce manager puis commande le joueur. Chaque classe garde ainsi UNE responsabilité
 * 
 * Pourquoi mémoriser l'état ? Le navigateur n'envoie un événement par exemple "keydown" qu'au moment de l'appui. OR on veut savoir, a CHAQUE IMAGE, si la flèche est toujours enfoncée. On retient donc l'état dans un Set
 * 
 * 2 questions possibles :
 * -isPressed(code) : la touche est-elle MAINTENUE enfoncée ? (déplacement ou le tir continu)
 * -wasPressed(code) : vient-elle d'être pressée à cette frame (pause ou rejouer)
 * 
 * On utilise event.code (position physique de la touche) et non event.key qui dépend du type de clavier (AZERTY ou QWERTY)
 */
export class InputManager {
    #down = new Set(); // touches actuellement enfoncées
    #justPressed = new Set(); // touches pressées DEPUIS la dernière frame

    constructor(target = window) {
        target.addEventListener("keydown", (event) => this.#onKeyDown(event));
        target.addEventListener("keyup", (event) => this.#down.delete(event.code));
        // Si la fenêtre perd le focus pendant un appui (clic ailleurs ou changement d'onglet), on aura jamais reçu le "keyup" : on "lâche" toutes les touches
        target.addEventListener("blur", () => this.#down.clear() );
    }

    #onKeyDown(event) {
        if(GAME_KEYS.has(event.code)) {
            event.preventDefault(); // Le navigateur ne fait pas son action habituelle
        }

        // event.repeat vaut true quand le système répète la touche maintenue
        // on l'ignore, sinon wasPressed renverrait true en boucle
        if(!event.repeat && !this.#down.has(event.code)) {
            this.#justPressed.add(event.code);
        }

        this.#down.add(event.code);
    }

    /**
     * La touche est-elle maintenue enfoncée en ce moment ?
     */
    isPressed(code) {
        return this.#down.has(code);
    }

    /**
     * La touche vient-elle d'être pressée (une seule fois par appui)
     */
    wasPressed(code) {
        return this.#justPressed.has(code);
    }

    /**
     * A appeler une fois par image, quand tout le monde a lu les entrées :
     * Ce qui vient d'être pressé ne doit valoir que pour l'image en cours
     */
    endFrame() {
        this.#justPressed.clear();
    }
}