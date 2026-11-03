/**
 * Le vaisseau du joueur
 * Pour cette classe on va utiliser le principe d'encapsulation
*/
import { INVINCIBILITY_DURATION, PLAYER_SIZE } from "../core/constants.js";
import { Entity } from "./Entity.js";

export class Player extends Entity {
    // Propriété privée pour les vies
    #lives;
    // Temps (s) qu'il reste à attendre AVANT de pouvoir tirer, à 0 on peut tirer à nouveau
    #cooldownRemaining = 0;
    // Temps (s) qu'il reste à être dans l'état d'invincibilité, à 0 on devient vulnérable
    #invincibilityRemaining = 0;

    constructor(x, y, sprite, attributes) {
        super(x, y, PLAYER_SIZE, PLAYER_SIZE, sprite, "#00ccff");
        this.speed = attributes.speed; // Vitesse en px
        this.shootCooldown = attributes.shootCooldown;
        this.bulletDamage = attributes.bulletDamage;
        this.#lives = attributes.lives;
    }

    // On crée les getter pour avoir accès depuis l'extérieur

    /**
     * Pour connaître le nombre de vies
     * @returns {number}
     */
    get lives() {
        return this.#lives;
    }

    /**
     * Pour savoir si on est encore en vie
     * @returns {boolean}
     */
    get isAlive() {
        return this.#lives > 0;
    }

    /**
     * Pour savoir si on est encore dans l'état invincible
     * @returns {boolean}
     */
    get isInvincible() {
        return this.#invincibilityRemaining > 0;
    }

    /**
     * Déplacement du vaisseau vers la gauche
     * @param {number} dt
     * @returns {void} 
     */
    moveLeft(dt) {
        this.x = Math.max(0, this.x - this.speed * dt);
    }

    /**
     * Déplacement du vaisseau vers la droite
     * @param {number} dt
     * @returns {void}
     */
    moveRight(dt, canvasWidth) {
        this.x = Math.min(canvasWidth - this.width, this.x + this.speed * dt);
    }

    /**
     * Gestion des mises à jour des temps : cooldown ou invincibility
     * @param {number} dt (delta time)
     * 
     * @returns {void}
     */
    update(dt) {
        this.#cooldownRemaining = Math.max(0, this.#cooldownRemaining - dt);
        this.#invincibilityRemaining = Math.max(0, this.#invincibilityRemaining - dt);
    }

    /**
     * Peut on tirer ? Oui lorsque le délai est écoulé
     * Vérifie que le cooldown est écoulé
     * 
     * @returns {boolean}
     */
    canShoot() {
        return this.#cooldownRemaining === 0;
    }

    /**
     * Méthode que l'on appelle juste après un tir pour relancer le délai d'attente
     * 
     * @returns {void}
     */
    registerShot() {
        this.#cooldownRemaining = this.shootCooldown;
    }

    /**
     * Retire une vie, sauf pendant l'invincibilité
     * 
     * Pourquoi l'invincibilité ? Sans elle, un alien qui reste en contact avec le vaisseau retirerai une vie a CHAQUE FRAME (60 fois par seconde) : on perdrait toutes ses vies en 3 frames !
     * 
     * @returns {boolean}
     */
    takeDamage() {
        if(this.isInvincible) {
            return false;
        }

        this.#lives -= 1;
        this.#invincibilityRemaining = INVINCIBILITY_DURATION;
        return true;
    }

    /**
     * REDEFINITION (override) de draw : on ajoute un comportement puis on réutilise celui de la classe mère
     * 
     * Effet de clignotement : le temps restant * 10 donne un nombre qui change toutes les 0.1s ; % 2 (reste de la division par 2), on alterne entre 0, 1, 0, 1, 0, 1 ...
     * Une image sur 2 on ne dessine pas le vaisseau
     */
    draw(ctx) {
        const isHiddenFrame = this.isInvincible && Math.floor(this.#invincibilityRemaining * 10) % 2 === 0;

        if(!isHiddenFrame) {
            super.draw(ctx);
        }
    }
}