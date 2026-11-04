/**
 * Gestion des sons
 * Le chargement n'est volontairement PAS bloquant : un son manquant ne doit jamais empêcher le jeu de démarrer
 */
export class SoundManager {
    #sounds = new Map(); // Nom du son => élément audio
    #volume = 0.6; // Volume général (0 à 1)
    #muted = false;

    /**
     * Prépare les éléments audio (le navigateur les télécharge en arrière plan)
     */
    load(paths) {
        // Object.entries permet de transformer un objet en tableau et donc de le parcourir avec une boucle for
        for(const [key, src] of Object.entries(paths)) {
            const audio = new Audio(src);

            audio.preload = "auto" // Télécharger dès maintenant
            this.#sounds.set(key, audio);
        }
    }

    /**
     * Joue un son
     * volumeScale permet de baisser le son de certains tirs par rapport à d'autres
     */
    play(key, volumeScale = 1) {
        const source = this.#sounds.get(key);

        if(this.#muted || !source) {
            return;
        }

        // Un même élément audio ne peut pas se jouer 2 fois en même temps
        // On joue donc avec un clone, ce qui permet de superposer plusieurs tirs
        const audio = source.cloneNode();

        audio.volume = Math.min(1, this.#volume * volumeScale);
        // play renvoie un Promise : si le navigateur refuse (pas encore d'intéraction)
        // On utilise .catch() pour "avaler" l'erreur au lieu de l'afficher dans la consoles
        audio.play().catch( () => {} );
    }

    toggleMute() {
        return this.#muted = !this.#muted; // ! inverse le boolean
    }

    get isMuted() {
        return this.#muted;
    }
}