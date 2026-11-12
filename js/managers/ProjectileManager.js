/**
 * Gère le cycle de vie de TOUS les projectiles
 * création, déplacement, suppresion hors-écran, dessin
 * 
 * `Bullet` représente UN tir ; `ProjectileManager` représente le GROUPE de tirs
 * Grâce à lui, Game n'a pas besoin de connaître les détails : il dit "créer un tir pour ce joueur" ET "met tout à jour"
 * 
 * Les deux tableaux sont PRIVES (`#`) : personne d'autre que cette classe ne peut y ajouter ou retirer des tirs par accident
*/
import { ENEMY_BULLET_HEIGHT, ENEMY_BULLET_SPEED, ENEMY_BULLET_WIDTH, PLAYER_BULLET_HEIGHT, PLAYER_BULLET_SPEED, PLAYER_BULLET_WIDTH } from "../core/constants.js";
import { Bullet } from "../entities/Bullets.js";

export class ProjectileManager {
    #assetLoader;
    #canvasHeight;
    #playerBullets = [];
    #enemyBullets = [];

    constructor(assetLoader, canvasHeight) {
        this.#assetLoader = assetLoader;
        this.#canvasHeight = canvasHeight;
    }

    /**
     * Ces getter renvoient une COPIE du tableau initial [...tableau] = "spread" :
     * On propage les éléments dans un nouveau tableau
     * 
     * Pourquoi une copie ? Si Game parcourt la liste avec for ...of et supprime un tir en même temps, dans le tableau ORIGINAL, la boucle "saute" des éléments (bug connu)
     * En parcourant une COPIE, on peut supprimer tranquillement l'original
     */
    get playerBullets() {
        return [...this.#playerBullets];
    }

    get enemyBullets() {
        return [...this.#enemyBullets];
    }

    /**
     * Crée un tir qui part du haut du vaisseau
     * player.centerX - PLAYER_BULLET_WIDTH / 2 : on centre le tir sur le vaisseau (le point (x, y) d'une entité est son coin en HAUT à GAUCHE)
     */
    createPlayerBullet(player) {
        const bullet = new Bullet(
            player.centerX - PLAYER_BULLET_WIDTH / 2, // Valeur de x sur le canvas
            player.y - PLAYER_BULLET_HEIGHT + 8, // Valeur de y sur le canvas
            {
                width: PLAYER_BULLET_WIDTH,
                height: PLAYER_BULLET_HEIGHT,
                speed: PLAYER_BULLET_SPEED,
                direction: -1, // Vers le haut
                sprite: this.#assetLoader.get('bulletPlayer'),
                damage: player.bulletDamage,
                color: "#ffe566"
            }
        );

        this.#playerBullets.push(bullet);
        return bullet;
    }

    createEnemyBullet(enemy) {
        const bullet = new Bullet(
            enemy.centerX - ENEMY_BULLET_WIDTH / 2, // Valeur de x sur le canvas
            enemy.bottom - 8, // Valeur de y sur le canvas
            {
                width: ENEMY_BULLET_WIDTH,
                height: ENEMY_BULLET_HEIGHT,
                speed: ENEMY_BULLET_SPEED,
                direction: 1, // Vers le bas
                sprite: this.#assetLoader.get('bulletEnemy'),
                color: "#ff6666"
            }
        );

        this.#enemyBullets.push(bullet);
        return bullet;
    }

    update(dt) {
        // On fusionne les 2 listes dans un tableau temporaire pour faire avancer tous les tirs avec UNE seule boucle
        for(const bullet of [...this.#playerBullets, ...this.#enemyBullets]) {
            bullet.update(dt);
        }

        // filter() : Crée un nouveau TABLEAU qui ne garde que les éléments pour lesquels la fonction renvoie true. Ici : on garde les tirs qui ne sont pas sortis de l'écran
        // On ne supprime jamais dans un tableau qu'on est en train de parcourir, on le reconstruit
        this.#playerBullets = this.#playerBullets.filter( (bullet) => !bullet.isOffScreen(this.#canvasHeight) );
        this.#enemyBullets = this.#enemyBullets.filter( (bullet) => !bullet.isOffScreen(this.#canvasHeight) );
    }

    /**
     * Retire UN tir précis : on garde tout ceux qui sont différent de lui
     */
    removePlayerBullet(bulletToRemove) {
        this.#playerBullets = this.#playerBullets.filter( (bullet) => bullet !== bulletToRemove )
    }

    removeEnemyBullet(bulletToRemove) {
        this.#enemyBullets = this.#enemyBullets.filter( (bullet) => bullet !== bulletToRemove )
    }

    /**
     * Vide tout (utile lorsqu'on relance une partie)
     */
    clear() {
        this.#playerBullets = [];
        this.#enemyBullets = [];
    }

    /**
     * Dessine les projectiles du joueur et les projectiles ennemis
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        for(const bullet of [...this.playerBullets, ...this.#enemyBullets]) {
            bullet.draw(ctx);
        }
    }
}