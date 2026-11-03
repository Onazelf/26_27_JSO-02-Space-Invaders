/**
 * Définition des niveaux
 * 
 * Un niveau est un simple objet de données : le code du jeu ne contient aucune valeur "en dur" propre à un niveau
 * 
 * - rows : un sprite d'alien par rangée (de la plus haute à la plus basse)
 * - points : point rapporté par rangée (même ordre que les rows)
 * - columns : nombre d'alien par rangée
 * - enemySpeed : vitesse de déplacement de départ de la grille (px/s)
 * - stepDown : descente de la grille a chaque demi-tour (px)
 * - shootInterval : délai entre 2 tirs ennemis (s)
 * 
 * Pour ajouter des niveaux c'est ici !
 */
export const LEVELS = [
    {
        id: 1,
        name: "Premier contact",
        rows: ["alien1", "alien2", "alien3"],
        points: [30, 20, 10],
        columns: 9,
        ennemySpeed: 70,
        stepDown: 20,
        shootInterval: 1.1
    }
]