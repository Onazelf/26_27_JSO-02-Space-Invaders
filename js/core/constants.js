/**
 * Constantes du jeu
 * 
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

// --- Projectiles ---
// Pour le joueur
export const PLAYER_BULLET_WIDTH = 12;
export const PLAYER_BULLET_HEIGHT = 40;
export const PLAYER_BULLET_SPEED = 520; // (px/s) : plus rapide que les tirs ennemis

// Pour les ennemis
export const ENEMY_BULLET_WIDTH = 14;
export const ENEMY_BULLET_HEIGHT = 42;
export const ENEMY_BULLET_SPEED = 300;

// --- Joueur ---
export const PLAYER_SIZE = 64;
export const PLAYER_BOTTOM_MARGIN = 24;
// Une constante peut être calculé à partir d'autres constantes : ici le haut du vaisseau
export const PLAYER_Y = CANVAS_HEIGHT - PLAYER_SIZE - PLAYER_BOTTOM_MARGIN;
// Durée d'invincibilité (s) après avoir été touché
export const INVINCIBILITY_DURATION = 1.5;

// --- Ennemis ---
export const ENEMY_SIZE = 48;
export const ENEMY_GAP_X = 72; // Distance entre 2 colonnes (de coin à coin)
export const ENEMY_GAP_Y = 58; // Distance entre 2 rangées
export const ENEMY_START_Y = 80; // Position verticale de la première rangée

// --- Explosions ---
export const EXPLOSION_DURATION = 0.45;
export const EXPLOSION_SIZE = 72;