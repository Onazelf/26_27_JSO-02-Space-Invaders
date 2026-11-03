/**
 * Chargement des images
 * 
 * POURQUOI charger AVANT de jouer ? Une image met un petit moment à se charger du disque ou du réseau
 * Si on essaye de dessiner trop tôt, rien qui s'affiche.
 * Et on ne crée JAMAIS new Image() dans la boucle de rendu (60 fois par seconde !)
 * On charge tout une fois au départ, puis on réutilise
 */
export class AssetLoader {
    // Une Map associe un nom (clé) à une image : "alien1" -> <image>
    #images = new Map();

    /**
     * Charge toutes les images en PARALLELE
     * async : la méthode renvoie un Promise (une "promesse de résultat futur")
     * Promise.all([...]) attend que TOUTES les promesses soient tenues
     * Si une seule échoue, tout est rejeté : le message d'erreur nomme le fichier fautif
     */
    async loadAll(paths) {
        // Object.entries({a:1, b:2}) donne [["a", 1], ["b", 2]]
        const entries = Object.entries(paths);

        await Promise.all( entries.map(([key, src]) => this.#loadImage(key, src)) )
    }

    /**
     * Charge UNE image. On l'envelopper dans une promise car Image ne fonctionne qu'avec des événements (onLoad, onError)
     */
    #loadImage(key, src) {
        return new Promise( (resolve, reject) => {
            const image = new Image();

            image.onload = () => {
                this.#images.set(key, image);
                resolve();
            }
            
            image.onerror = () => reject(new Error(`Image introuvable : ${src}`))
            image.src = src; // C'est cette ligne qui déclenche le téléchargement
        } )
    }

    /**
     * Renvoie l'image associée à la clé (ou null si elle n'existe pas)
     */
    get(key) {
        // ?? Si le script ne trouve pas les images, il renvoie null, pour ne pas faire crash l'application
        return this.#images.get(key) ?? null;
    }
}