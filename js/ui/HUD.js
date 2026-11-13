/**
 * Affichage de l'interface : score, les vies, le nom du vaisseau, les écrans superposés (game over, écran de pause)
 * 
 * Le HUD (Head-Up Display) ne décide de rien : il reçoit des valeurs a afficher et les dessine
*/
import { GameState } from "../core/GameState.js";
import { LEVELS } from "../data/levels.js";

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
    },

    [GameState.TRANSITION] : {
        title: "BRAVO !",
        color: "#60e6c9",
        lines: [`Prochain niveau : `]
    }
}

export class HUD {
    /**
     * Information de partie: score, vies (sous forme de petit vaisseau), niveau
     */
    drawStats(ctx, { score, lives, levelName, shipSprite }) {
        // Fond translucide
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(12, 12, 260, 88);
        ctx.strokeStyle = "rgba(0, 204, 255, 0.5)";
        ctx.lineWidth = 1;
        ctx.strokeRect(12, 12, 260, 88); // Contour (fillRect = plein, strokeRect = cadre)
        
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

    /**
     * Méthode qui sert à dessiner du texte
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {string} text 
     * @param {number} x 
     * @param {number} y 
     * @param {object} objectAttribute
     */
    #drawText(ctx, text, x, y, { size = 16, color = "#ffffff", align = "left", bold = false } = {} ) {
        ctx.fillStyle = color;
        ctx.font = `${bold ? "bold" : ""} ${size}px monospace`;
        ctx.textAlign = align; // left | center | right : x et y le point d'ancrage
        ctx.fillText(text, x, y);
        ctx.textAlign = "left"; // On remet la valeur par défaut pour ne pas perturber les autres dessins
    }

    /**
     * Ecrans superposés pour les états pause, game over, victory et transition
     * Ne dessine rien pour les autres états
     */
    drawOverlay(ctx, state, levelName, score) {
        const overlay = OVERLAYS[state]; // On va chercher les textes de l'état courant

        if(!overlay) {
            return; // On est dans l'état PLAYING, donc pas d'écran superposé
        }

        const { width, height } = ctx.canvas; // Destructuration

        // Voile sombre sur toute la scène (qui reste visible en dessous)
        // Si l'overlay affiché est le menu principal, rend le fond complètement opaque
        ctx.fillStyle = (state === GameState.MAIN_MENU) 
        ? "rgb(9, 9, 9)" 
        : "rgba(0, 0, 0, 0.6)";

        ctx.fillRect(0, 0, width, height);

        // Positionne correctement le texte
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
            // Quand on parcourt les différents états d'overlay, si c'est transition, on ajoute le nom du niveau comme variable, sinon uniquement le texte indiqué se dessine
            if(overlay === GameState.TRANSITION) line = overlay.lines + levelName;
            this.#drawText(ctx, line, width / 2, height / 2 + 56 + index * 30, {
                size: 18,
                color: "#cccccc",
                align: "center"
            })
        });
    }

    /**
     * Méthode qui permet d'afficher la barre de vie du boss en temps réel
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @param {object} state Etat actuel du jeu 
     * @param {number} hp PV actuels du boss
     * @param {number} maxHp PV max du boss
     * @param {string} bossName nom du boss à afficher
     */
    drawHealthBar(ctx, hp, maxHp, bossName) {
        const width = ctx.canvas.width;

        // On dessine le nom du boss
        this.#drawText(ctx, bossName, width / 2, 35, {
            size : 18,
            color : "#b6b6b6",
            align : "center",
            bold : true 
        });

        // Puis on dessine la barre de vie
        // On crée des constantes si jamais on veut changer la taille de la barre de vie
        const healthBarWidth = 335;
        const healthBarHeight = 30;
        // Cela permet de centrer la barre sur l'axe X
        const barX = width / 2 - healthBarWidth / 2

        // La barre rouge se construit sur toute la longueur initiale
        ctx.fillStyle = "rgb(226, 17, 17)";
        ctx.fillRect(barX, 55, healthBarWidth, healthBarHeight);
        
        // La barre verte se construit en fonction du ratio de PV restants du boss (proportionnelle a la taille de la barre rouge) car c'est celle qui se réduit
        // On utilise un Math.max pour éviter toute valeur négative
        const ratio = Math.max(0, hp / maxHp);
        ctx.fillStyle = "rgb(44, 214, 44)";
        ctx.fillRect(barX, 55, healthBarWidth * ratio, healthBarHeight);
        
        // On dessine le contour à la fin, sinon il chevauche qu'une barre sur 2
        ctx.strokeStyle = "#615b69";
        ctx.lineWidth = 5;
        ctx.strokeRect(barX, 55, healthBarWidth, healthBarHeight);
    }
}