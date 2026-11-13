/**
 * Définition des niveaux
 * 
 * Un niveau est un simple objet de données : le code du jeu ne contient aucune valeur "en dur" propre à un niveau
 * 
 * - id : l'identifiant du niveau
 * - name : le nom du niveau
 * - rows : un sprite d'alien par rangée (de la plus haute à la plus basse)
 * - boss : un sprite de boss unique par niveau
 * - bossName : le nom du boss qui s'affiche au dessus de la barre de vie
 * - points : point rapporté par rangée (même ordre que les rows)
 * - bossPoints : les points attribués à la mort du boss
 * - columns : nombre d'alien par rangée
 * - enemySpeed : vitesse de déplacement de départ de la grille (px/s) et vitesse de déplacement du boss (qui sera multipliée par 2 par rapport à la grille)
 * - stepDown : descente de la grille a chaque demi-tour (px)
 * - shootInterval : délai entre 2 tirs ennemis (s)
 * - bossShootInterval : délai entre 2 tirs du boss (s)
 * 
 * Pour ajouter des niveaux c'est ici !
 */
export const LEVELS = [
    {
        id: 1,
        name: "Niv. 1 : Premier contact",
        rows: ["alien1", "alien2", "alien3"],
        boss: "boss1",
        bossName: "Trivex - Incarnation du masque fantôme",
        points: [30, 20, 10],
        bossPoints: 80,
        bossHP : 20,
        columns: 9,
        enemySpeed: 70,
        stepDown: 20,
        shootInterval: 1.1,
        bossShootInterval : 0.7
    },

    {
        id: 2,
        name: "Niv. 2 : Invasion imminente",
        rows: ["alien3", "alien4", "alien5"],
        boss: "boss2",
        bossName: "Trivex - Incarnation du masque fantôme",
        points: [35, 25, 15],
        bossPoints: 100,
        bossHP : 35,
        columns: 10,
        enemySpeed: 75,
        stepDown: 20,
        shootInterval: 1,
        bossShootInterval : 0.6
    },

    {
        id: 3,
        name: "Niv. 3 : Nocturne défensive",
        rows: ["alien4", "alien2", "alien5", "alien6"],
        boss: "boss3",
        bossName: "Trivex - Incarnation du masque fantôme",
        points: [40, 25, 20, 15],
        bossPoints: 120,
        bossHP : 45,
        columns: 10,
        enemySpeed: 80,
        stepDown: 20,
        shootInterval: 1,
        bossShootInterval : 0.6
    }
]