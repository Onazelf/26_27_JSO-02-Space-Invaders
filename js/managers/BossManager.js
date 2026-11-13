/**
 * Gestion du boss : récupère les propriétés du boss depuis Boss.js
 */
import { BOSS_SIZE, BOSS_Y, CANVAS_WIDTH } from "../core/constants.js";
import { Boss } from "../entities/Boss.js";

export class BossManager {
    #assetLoader;
    #boss = null; // Initialise une variable boss vide, pour la remplir plus tard
    #direction = 1; // 1 vers la droite, -1 vers la gauche
    #baseSpeed = 0; // Vitesse de départ du niveau (px/s)

    constructor(assetLoader) {
        this.#assetLoader = assetLoader;
    }

    /**
     * Récupère l'entité boss au cas où c'est nécessaire
     */
    get boss() {
        return this.#boss;
    }

    /**
     * Récupère l'information du boss éliminé
     * @returns {boolean}
     */
    get isCleared() {
        return this.#boss === null;
    }

    /**
     * Crée le boss décrit dans levels.js
     * Aucune valeur propre a un niveau est écrite ici : tout viens de levels.js
     */
    spawn(level) {
        this.#boss = null;
        this.#direction = 1;
        this.#baseSpeed = level.enemySpeed * 2;

        const sprite = this.#assetLoader.get(level.boss)

        this.#boss = new Boss(
            CANVAS_WIDTH / 2 - BOSS_SIZE / 2,
            BOSS_Y,
            sprite,
            level.bossPoints,
            level.bossHP
        );
    }

    /**
     * Supprime le boss au relancement de la partie
     */
    clear() {
        this.#boss = null;
    }

    /**
     * Méthode qui update la position du boss par rapport au canvas
     * @param {number} dt 
     * @param {number} canvasWidth
     * 
     * @returns {void}
     */
    update(dt, canvasWidth) {
        // Si il n'y a pas de boss, on n'update rien
        if(!this.#boss) {
            return;
        }

        // Déplacement horizontal prévu pour le boss (px/s * s * direction)
        const dx = this.#baseSpeed * dt * this.#direction;

        // On calcule la position minimale et maximale du boss
        const leftMost = this.#boss.x;
        const rightMost = this.#boss.x + BOSS_SIZE;

        // On regarde où le boss serait après le déplacement
        const willHitEdge = leftMost + dx <= 0 || rightMost + dx >= canvasWidth;

        // Si le boss touche le bord droit ou le bord gauche, on inverse la direction
        if(willHitEdge) {
            this.#direction *= -1;
            return;
        }

        this.#boss.moveBy(dx, 0);
    }

    /**
     * Dessine le boss
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        const boss = this.#boss;
        if(!boss) return;

        boss.draw(ctx);
    }
}