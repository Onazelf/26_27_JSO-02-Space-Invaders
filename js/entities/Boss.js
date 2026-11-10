/**
 * Un boss
 * 
 * Tout comme les aliens, le boss possède ses propres propriétés, mais a un comportement assez différent des ennemis classiques
 * D'abord, il ne se déplace pas avec une grille, mais est autonome car il est seul
 * Ensuite, il dispose d'une attaque supplémentaire par rapport aux aliens classiques
*/
import { BOSS_SIZE } from "../core/constants.js";
import { Entity } from "./Entity.js";

export class Boss extends Entity {
    constructor(x, y, sprite, points, hp = 20) {
        // La taille du boss est différente des aliens, il est plus grand
        super(x, y, BOSS_SIZE, BOSS_SIZE, sprite, "#66ff66");

        this.points = points;
        this.hp = hp; // Un boss ne meurt pas du premier coup
    }

    takeHit(damage = 1) {
        this.hp -= damage;
        return this.hp <= 0;
    }
}