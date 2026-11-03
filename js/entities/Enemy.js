/**
 * Un alien
 * 
 * Il est déplacé COLLECTIVEMENT par EnemyManager : toute la grille bouge d'un bloc
 * Un alien n'a donc pas de logique de déplacement propre (pas de méthode update)
 * Il garde seulement ses informations : points, colonnes, vie ...
 */

import { ENEMY_SIZE } from "../core/constants.js";
import { Entity } from "./Entity.js";

/**
 * 
 * @param {number} x
 * @param {number} y
 * @param {HTMLImageElement|null} sprite
 * @param {number} points points rapportés quand l'ennemi est détruit
 * @param {number} column colonnes dans la grille (sert à choisir qui tire)
 */
export class Enemy extends Entity{
    constructor(x, y, sprite, points, column) {
        // La taille est la même pour tous les aliens: on utilise les constantes
        super(x, y, ENEMY_SIZE, ENEMY_SIZE, sprite, "#66ff66");

        this.points = points;
        this.column = column;
        this.hp = 1; // Un alien "normal" meurt au premier contact avec un projectile
    }

    /**
     * Applique les DGT
     * @param {number} damage par défaut = 1
     * @returns {boolean}
     * 
     * La méthode ne supprime pas l'ennemi, elle se contente de dire si l'ennemi est détruit ou non. C'est Game qui décide des conséquences (score, explosion, retrait de la liste)
     */
    takeHit(damage = 1) {
        this.hp -= damage;
        return this.hp <= 0;
    }
}