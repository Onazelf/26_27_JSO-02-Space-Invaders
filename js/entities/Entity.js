/**
 * La classe mère de tout ce qui existe dans le jeu
 * 
 * Une entité, c'est un rectangle qui a une position, une taille et un rendu
 * Le joueur, les ennemis et les tirs sont tous des rectangles à l'écran : plutôt que de répéter 3 fois le même code, on l'écrit une seule fois ici
 * Les autres classes hériteront de Entity
 * 
 * Notions : Classe, constructeur, propriétés, méthodes, héritage, getter
 * 
 * Repère du canvas : l'origine (0,0) est en HAUT à GAUCHE
 * x augmente vers la droite, quand y augmente vers le bas
 */

export class Entity {
    /**
     * Le constructeur est appelé automatiquement lors de l'instance (new Entity(...))
     * Dans un constructeur, "this" désigne l'objet qui est en train d'être créé
     */
    constructor(x, y, width, height, sprite = null, color = "#fff") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite; // Une image (HTMLImageElement) ou null
        this.color = color; // Une couleur de secours si on n'a pas d'image
    }

    /**
     * Déplacement de l'entité de (dx, dy) pixels
     * On passe par une méthode plutôt que de modifier x et y directement
     */
    moveBy(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    /**
     * Mise à jour à chaque image. Ici elle ne fait rien : une entité immobile n'a rien à mettre à jour
     * Les classes FILLES la DEFINISSENT (c'est le polymorphisme : même nom de méthode avec un comportement différent selon l'objet)
     * 
     * dt (delta time) = temps écoulé depuis la dernière image, en seconde
     * le préfixe _ indique "paramètre volontairement inutilisé ici"
     */
    update(_dt) {}

    /**
     * Dessine l'entité. "ctx" est le pinceau du canvas (CanvasRenderingContext2D)
     */
    draw(ctx) {
        if(this.sprite) {
            // Si on a une image, on utilise drawImage(image, x, y, largeur, hauteur): l'image est étiré dans le rectangle
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
            return; // On s'arrête là : pas besoin du rectangle de secours
        }

        // Pas d'image : On dessine un rectangle plein de la couleur de l'entité
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Un GETTER se lit comme une propriété (entity.centerX, sans parenthèse)

    // Abscisse du centre du rectangle
    get centerX() {
        return this.x + this.width / 2;
    }

    // Ordonnée du centre du rectangle
    get centerY() {
        return this.y + this.height / 2;
    }

    // Ordonnée du bord BAS du rectangle (rappel : y augmente vers le bas)
    get bottom() {
        return this.y + this.height;
    }
}