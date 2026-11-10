/**
 * Gère la grille d'ennemis : création à partir d'un niveau, déplacement collectif, choix des ennemis qui peuvent tirer, dessiner le tout
 * 
 * Comportement classique du Space Invaders
 * - toute la grille se déplace horizontalement d'un bloc
 * - quand le bloc touche un bord, on repart dans l'autre sens et on descend le bloc d'un cran
 * - plus il reste d'ennemis et plus la grille va vite
*/
import { CANVAS_WIDTH, ENEMY_GAP_X, ENEMY_GAP_Y, ENEMY_SIZE, ENEMY_START_Y } from "../core/constants.js";
import { Enemy } from "../entities/Enemy.js";

export class EnemyManager {
    #assetLoader;
    #enemies = [];
    #direction = 1; // 1 vers la droite, -1 vers la gauche
    #baseSpeed = 0; // Vitesse de départ du niveau (px/s)
    #stepDown = 0; // Descente a chaque demi-tour (px)
    #initialCount = 0; // Nombre d'ennemis au départ (sert à calculer l'accelération)

    constructor(assetLoader) {
        this.#assetLoader = assetLoader;
    }

    /**
     * getter pour récupérer la liste des ennemis (en copie)
     * @returns {Array} array d'ennemis
     */
    get enemies() {
        return [...this.#enemies];
    }

    /**
     * Tous les ennemis sont-ils détruit ? (condition pour passer au boss)
     * @returns {boolean}
     */
    get isCleared() {
        return this.#enemies.length === 0;
    }

    /**
     * Position du bas de l'ennemi le plus bas (sert à détecter l'invasion)
     * reduce : parcourt le tableau en gardant un cumul : ici, le plus grand `bottom` rencontré jusque là (on part de 0)
     * @returns {number}
     */
    get lowestBottom() {
        return this.#enemies.reduce( (lowest, enemy) => Math.max(lowest, enemy.lowestBottom), 0);
    }

    /**
     * Crée la grille d'ennemis décrite par un niveau (voir : data/levels.js)
     * Aucune valeur propre a un niveau est écrite ici : tout viens de level.js
     */
    spawn(level) {
        this.#enemies = [];
        this.#direction = 1;
        this.#baseSpeed = level.enemySpeed;
        this.#stepDown = level.stepDown;
        const countEnemies = level.columns <= 14 ? level.columns : 14;

        // Largeur totale de la grille : (n-1) écarts entre les ennemis + la largeur du dernier
        // On la centre dans le canvas
        const gridWidth = (countEnemies - 1) * ENEMY_GAP_X + ENEMY_SIZE;
        const startX = (CANVAS_WIDTH - gridWidth) / 2;

        // On va boucler les rows (lignes) avec un forEach (boucle pour parcourir les tableaux), pour chaque élément du tableau, on donne son spriteKey et son numéro (row, qui commence par 0)
        level.rows.forEach((spriteKey, row) => {
            const sprite = this.#assetLoader.get(spriteKey);

            // BOUCLE IMBRIQUEE : pour chaque rangée (row) on crée les colonnes
            for(let column = 0; column < countEnemies; column++) {
                this.#enemies.push(
                    new Enemy(
                        startX + column * ENEMY_GAP_X, // x : décalage de colonne en colonne
                        ENEMY_START_Y + row * ENEMY_GAP_Y, // y : décalage de rangée en rangée
                        sprite,
                        level.points[row] ?? 10, // ?? : 10 points par défaut si il n'y a pas de valeur
                        column
                    )
                )
            }
        });

        this.#initialCount = this.#enemies.length;
    }

    /**
     * Vitesse actuelle : de x1 (grille pleine) jusqu'à x3 (dernier ennemi)
     * destroyRatio va de 0 (aucun détruit) à 1 (tout est détruit)
     */
    get currentSpeed() {
        if(this.#initialCount === 0) {
            return this.#baseSpeed;
        }

        const destroyRatio = 1 - this.#enemies.length / this.#initialCount;
        return this.#baseSpeed * (1 + 2 * destroyRatio);
    }

    /**
     * Méthode pour supprimer un ennemi
     * @param {Enemy}
     * @returns {void}
     */
    removeEnemy(enemyToRemove) {
        this.#enemies = this.#enemies.filter( (enemy) => enemy !== enemyToRemove )
    }

    /**
     * Méthode qui déplace la grille d'ennemis en gérant la collision des bords et fait descendre la grille à chaque aller/retour
     * @param {number} dt 
     * @param {number} canvasWidth
     * 
     * @returns
     */
    update(dt, canvasWidth) {
        if(this.isCleared) {
            return;
        }

        // Déplacement horizontal prévu pour cette image (px/s * s * direction)
        const dx = this.currentSpeed * dt * this.#direction;

        // On calcule les bords du BLOC entier
        const leftMost = Math.min(...this.#enemies.map( (enemy) => enemy.x ));
        const rightMost = Math.max(...this.#enemies.map( (enemy) => enemy.x + enemy.width ));

        // On regarde où le bloc serait après le déplacement
        const willHitEdge = leftMost + dx <= 0 || rightMost + dx >= canvasWidth;

        if(willHitEdge) {
            // On fait un demi-tour : on inverse le sens de direction
            this.#direction *= -1;

            for(const enemy of this.#enemies) {
                enemy.moveBy(0, this.#stepDown);
            }

            return;
        }

        for(const enemy of this.#enemies) {
            enemy.moveBy(dx, 0);
        }
    }

    /**
     * Seuls les ennemis les plus en bas pourront tirer, pour éviter que les projectiles traversent les autres ennemis
     * Une Map associe une clé (ici le numéro de colonne) à une valeur (l'ennemi le plus bas trouvé jusque là pour cette colonne)
     * @returns {Array}
     */
    getShooters() {
        const lowestByColumn = new Map();

        for(const enemy of this.#enemies) {
            const current = lowestByColumn.get(enemy.column);
            // Si il n'y a plus d'ennemis sur une colonne
            if(!current || enemy.y > current.y) {
                lowestByColumn.set(enemy.column, enemy)
            }
        }

        return [...lowestByColumn.values()];
    }

    /**
     * Vide la grille (utilisé lorsqu'on relance une partie)
     */
    clear() {
        this.#enemies = [];
    }

    /**
     * On dessine la grille
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        for(const enemy of this.#enemies) {
            enemy.draw(ctx);
        }
    }
}