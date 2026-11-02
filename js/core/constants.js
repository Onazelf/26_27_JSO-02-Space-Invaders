/**
 * Constantes du jeu
 * Pourquoi des constantes ? Ecrire 64 ou 300 au milieu du code, sans nom, s'appelle un "nombre magique" : on ne sait plus ce qu'il représente ni ou le modifier. Ici chaque valeur a un nom et un seul endroit ou la changer.
 * Conventions : NOMS_EN_MAJUSCULES pour les constantes
 * 
 * Unités : toutes les vitesses sont en PIXEL/SECONDE (px/s) et toutes les durées sont en SECONDES. Le jeu utilise un "delta time: (dt) : le déplacement d'une entité vaut vitesse dt. Ainsi le jeu va à la même vitesse sur un écran 60Hz et sur un écran 144Hz"
 */

// --- Canvas ---
export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;

// --- Boucle du jeu ---
/** plafond de dt (s) */
export const MAX_DELTA_TIME = 0.05;