
/**
 * Explosions animées
 * 
 * explosion.png est une "sprite sheet" : image qui contient plusieurs frames d'animations (ici une grille de 2 colonnes * 3 lignes) dont seulement les 4 premières cases sont utilisées. On dessine une case à la fois avec la forme à 9 arguments de drawImage
 * 
 * ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
 * (la zone source découpe un morceau de l'image, la destination dit où le dessiner)
 * 
 *     colonne 0  colonne 1
 *     ┌─────────┬─────────┐
 *     │ frame 0 │ frame 1 │  ← ligne 0
 *     ├─────────┼─────────┤
 *     │ frame 2 │ frame 3 │  ← ligne 1
 *     └─────────┴─────────┘
 */
import { EXPLOSION_DURATION, EXPLOSION_SIZE } from "../core/constants.js";

const COLUMNS = 2;
const USED_FRAMES = 4;

export class ExplosionManager {
    #sheet;
    #explosions = []; // Chaque explosion : {x, y, age} (age en s)

    constructor(sheet) {
        this.#sheet = sheet;
    }

    spawn(x, y) {
        this.#explosions.push( {x, y, age: 0} );
    }

    update(dt) {
        // Chaque explosion vieillit...
        for(const explosion of this.#explosions) {
            explosion.age += dt;
        }

        // ...et on garde seulement celles qui ne sont pas arrivées au bout de l'animation
        this.#explosions = this.#explosions.filter(
            (explosion) => explosion.age < EXPLOSION_DURATION
        );
    }

    clear() {
        this.#explosions = [];
    }

    /**
     * Dessine l'animation de l'explosion
     */
    draw(ctx) {
        for(const explosion of this.#explosions) {
            // progress va de 0 (début) à 1 (fin de l'animation)
            const progress = explosion.age / EXPLOSION_DURATION;

            if (this.#sheet) {
                this.#drawFrame(ctx, explosion, progress);
            } else {
                this.#drawFallback(ctx, explosion, progress);
            }
        }
    }

    /**
     * Dessine la bonne frame du sprite selon l'avancement de l'animation
     */
    #drawFrame(ctx, explosion, progress) {
        const frameSize = this.#sheet.width / COLUMNS; // Taille d'une case (carré)

        const frame = Math.min(USED_FRAMES - 1, Math.floor(progress * USED_FRAMES) );

        const sourceX = (frame % COLUMNS) * frameSize;
        const sourceY = Math.floor(frame / COLUMNS) * frameSize;

        ctx.drawImage(
            this.#sheet, // source
            sourceX, // sx
            sourceY, // sy
            frameSize, // sw
            frameSize, //sh
            explosion.x - EXPLOSION_SIZE / 2, // dx 
            explosion.y - EXPLOSION_SIZE / 2, // dy
            EXPLOSION_SIZE, // dw
            EXPLOSION_SIZE // dh
        );
    }

    /**
     * Au cas où on ne récupère pas le sprite, on dessine une explosion de rechange
     */
    #drawFallback(ctx, explosion, progress) {
        ctx.fillStyle = `rgba(255, 170, 0, ${1 - progress})`;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, EXPLOSION_SIZE / 3, 0, Math.PI * 2);
        ctx.fill();
    }
}