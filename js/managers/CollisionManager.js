/**
 * Détection de collisions
 * 
 * Cette classe répond à la question : Est-ce que ces rectangles se touchent ?
 * Elle ne modifie rien, ne joue aucun son, et ne change aucun score (Game)
 * Cette séparation de classe "détecter/décider" rend la classe très simple à tester seule
 */
export class CollisionManager {
    /**
     * Méthode AABB (Axis-Aligned Boundind Box = Rectangle aligné sur les axes)
     * 
     * 2 rectangles se touchent si, sur l'axe X ET sur l'axe Y, leurs intervalles se chevauchent. Pour chaque axe on vérifie 2 conditions :
     * 
     * X : a.x < b.x + b.width => le bord gauche de A est à gauche du bord droit de B
     *     a.x + a.width > b.x => le bord droite de A est à droite du bord gauche de B
     * 
     * Y : a.y < b.y + b.height => même raisonnement pour la hauteur
     *     a.y + a.height > b.y => même raisonnement pour la hauteur
     * 
     * Les 4 conditions doivent être vraies en MÊME TEMPS. Si UNE SEULE est fausse, il existe un espace entre les rectangles : pas de collision
     * 2 rectangles qui se touchent seulement n'entrent pas en collision
     * 
     * Fonctionne avec n'importe quels objets qui ont x, y, width, height
     * (Joueur, ennemis, projectiles) c'est du "duck typing"
     * 
     * @returns {boolean}
     */
    isColliding(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    /**
     * Renvoie la PREMIERE entité de "others" qui touche "entity", ou "null"
     * Pratique pour "ce tir touche t-il un ennemi et lequel ?"
     */
    findFirstCollision(entity, others) {
        for(const other of others) {
            if(this.isColliding(entity, other)) {
                return other; // On s'arrête dès qu'on en a trouvé un
            }
        }

        return null;
    }
}