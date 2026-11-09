/**
 * Affichage de l'interface : score, les vies, le nom du vaisseau, les écrans superposés (game over, écran de pause)
 * 
 * Le HUD (Head-Up Display) ne décide de rien : il reçoit des valeurs a afficher et les dessine
*/
import { GameState } from "../core/GameState.js";

const OVERLAYS = {
    [GameState.PAUSED] : {
        title: "PAUSE",
        color: "#ffffff",
        lines: ["P ou Echap pour reprendre"]
    },

    [GameState.GAME_OVER] : {
        title: "GAME OVER...",
        color: "#ff6677",
        lines: ["R pour Rejouer"]
    },

    [GameState.VICTORY] : {
        title: "VICTOIRE !",
        color: "#4beb6e",
        lines: ["R pour Rejouer"]
    },

    [GameState.MAIN_MENU] : {
        title: "MENU PRINCIPAL",
        color: "#ffffff",
        lines: ["Entrée pour lancer une partie"]
    }
}

export class HUD {
    /**
     * Information de partie: score, vies (sous forme de petit vaisseau), niveau
     */
    drawStats(ctx, { score, lives, levelName, shipSprite }) {
        // Fond translucide
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(12, 12, 240, 88);
        ctx.strokeStyle = "rgba(0, 204, 255, 0.5)";
        ctx.lineWidth = 1;
        ctx.strokeRect(12, 12, 240, 88); // Contour (fillRect = plein, strokeRect = cadre)
        
        this.#drawText(ctx, `Score : ${score}`, 24, 40, {size: 20});
        this.#drawText(ctx, levelName, 24, 90, { size : 14, color : "#88ddff" });

        // Une petite icone par vie restante, côte à côte (décalage de 30px)
        for(let life = 0; life < lives; life++) {
            const x = 24 + life * 30;

            if (shipSprite) {
                ctx.drawImage(shipSprite, x, 50, 24, 24);
            } else {
                ctx.fillStyle = "#00ccff";
                ctx.fillRect(x, 50, 24, 24);
            }
        }
    }

    #drawText(ctx, text, x, y, { size = 16, color = "#ffffff", align = "left", bold = false } = {} ) {
        ctx.fillStyle = color;
        ctx.font = `${bold ? "bold" : ""} ${size}px monospace`;
        ctx.textAlign = align; // left | center | right : x et y le point d'ancrage
        ctx.fillText(text, x, y);
        ctx.textAlign = "left"; // On remet la valeur par défaut pour ne pas perturber les autres dessins
    }

    /**
     * Ecrans superposés pour les états pause, game over et victory
     * Ne dessine rien pour les autres états
     */
    drawOverlay(ctx, state, score) {
        const overlay = OVERLAYS[state]; // On va chercher les textes de l'état courant

        if(!overlay) {
            return; // On est dans l'état PLAYING, donc pas d'écran superposé
        }

        const { width, height } = ctx.canvas; // Destructuration

        // Voile sombre sur toute la scène (qui reste visible en dessous)
        // Si l'overlay affiché est le menu principal, rend le fond complètement opaque
        overlay.MAIN_MENU ? ctx.fillStyle = "rgb(15, 15, 15)" : ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, width, height);

        this.#drawText(ctx, overlay.title, width / 2, height / 2 - 40, {
            size: 56,
            color: overlay.color,
            align: "center",
            bold: true
        });

        if(state === GameState.GAME_OVER || state === GameState.VICTORY) {
            // Si on est dans GAME OVER ou VICTORY
            // On affiche le score
            this.#drawText(ctx, `Score final : ${score}`, width / 2, height / 2 + 10, {
                    size: 24,
                    align: "center"
            });
        }

        // Chaque ligne est décalée de 30px vers le bas grâce à son numéro (index)
        overlay.lines.forEach( (line, index) => {
            this.#drawText(ctx, line, width / 2, height / 2 + 56 + index * 30, {
                size: 18,
                color: "#cccccc",
                align: "center"
            })
        });
    }
}