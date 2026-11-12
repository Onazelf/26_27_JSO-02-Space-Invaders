/**
 * Un boss
 * 
 * Tout comme les aliens, le boss possède ses propres propriétés, mais a un comportement assez différent des ennemis classiques
 * D'abord, il ne se déplace pas avec une grille, mais est autonome car il est seul
 * Ensuite, il dispose d'une attaque supplémentaire par rapport aux aliens classiques
*/
import { BOSS_SIZE } from "../core/constants.js";
import { Entity } from "./Entity.js";

/**
 * @param {number} x
 * @param {number} y
 * @param {HTMLImageElement|null} sprite
 * @param {number} points points rapportés quand le boss est détruit
 * @param {number} hp points de vies du boss
 */
export class Boss extends Entity {
    constructor(x, y, sprite, points, hp) {
        // La taille du boss est différente des aliens, il est plus grand
        super(x, y, BOSS_SIZE, BOSS_SIZE, sprite, "#66ff66");

        this.points = points;
        this.hp = hp;
        this.maxHp = hp; // Un boss ne meurt pas du premier coup, il dispose alors de PV max
    }

    /**
     * Applique les DGT
     * @param {number} damage par défaut = 1
     * @returns {boolean}
     * 
     * La méthode ne supprime pas le boss, elle se contente de dire si il est détruit ou non. C'est Game qui décide des conséquences (score, explosion)
     */
    takeHit(damage = 1) {
        this.hp -= damage;
        return this.hp <= 0;
    }
}