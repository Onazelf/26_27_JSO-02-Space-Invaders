/**
 * Classe pour définir les projectiles.
 * 
 * Il sert au joueur ET aux ennemis : seule la DIRECTION change
 * (-1 = vers le haut, +1 vers le bas), ainsi que la taille, la vitesse et le sprite
 * Ces valeurs seront choisies par "ProjectileManager" à la création : ainsi une seule classe suffit, au lieu de 2 presque identique
*/
import { Entity } from "./Entity.js";

class Bullet extends Entity {
    /**
     * Le troisième paramètre est un OBJET dont on extrait les propriétés ("destructuring" dans la signature)
     * `{ width, height, ... }` équivaut à écrire option.width, option.height, ...
     * Les options qui ont "=" ont une valeur par défaut (donc facultative à l'appel)
     * 
     * Avantage à l'appel : on voit le NOM de chaque valeur
     * new Bullet(x, y, { width: 12, height: 40, speed: 520, direction: -1 })
     * Au lieu d'avoir une succession de valeurs sans savoir à quel paramètres elle renvoie
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {{ width: number, height: number, speed: number, direction: number, sprite?:HTMLImageElement | null, damage?: number, color?: string }} options 
     */
    
    constructor(x, y, { width, height, speed, direction, sprite = null, damage = 1, color = "#ffe566" }) {
        super(x, y, width, height, sprite, color);
        this.speed = speed; // en (px/s)
        this.direction = direction;
        this.damage = damage; // sert aux ennemis qui ont plusieurs points de vie (boss)
    }

    /**
     * vitesse * direction * temps = distance parcourue pendant une frame
     * 
     * @param {number} dt 
     */
    update(dt) {
        this.moveBy(0, this.speed * this.direction * dt);
    }

    /**
     * Le tir est-il complètement sorti de l'écran ? (En haut OU en bas)
     * Si oui, "ProjectileManager" le supprime: sans ça la liste des tirs grossirait sans fin et ralentirait le jeu ("fuite de mémoire")
     * 
     * @param {*} canvasHeight 
     * @returns 
     */
    isOffScreen(canvasHeight) {
        return this.bottom < 0 || this.y > canvasHeight;
    }
}