/**
 * Définition des niveaux
 * 
 * Un niveau est un simple objet de données : le code du jeu ne contient aucune valeur "en dur" propre à un niveau
 * 
 * - id : l'identifiant du niveau
 * - name : le nom du niveau
 * - rows : un sprite d'alien par rangée (de la plus haute à la plus basse)
 * - boss : un sprite de boss unique par niveau
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
        name: "Premier contact",
        rows: ["alien1", "alien2", "alien3"],
        boss: "boss1",
        points: [30, 20, 10],
        bossPoints: 80,
        bossHP : 20,
        columns: 14,
        enemySpeed: 70,
        stepDown: 20,
        shootInterval: 1.1,
        bossShootInterval : 0.7
    }
]