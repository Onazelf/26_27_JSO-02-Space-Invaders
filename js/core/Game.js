/**
 * Chef d'orchestre du jeu
*/
import { computeShipAttributes } from "../data/ships.js";
import { Player } from "../entities/Player.js";
import { CollisionManager } from "../managers/CollisionManager.js";
import { EnemyManager } from "../managers/EnemyManager.js";
import { ExplosionManager } from "../managers/ExplosionManager.js";
import { ProjectileManager } from "../managers/ProjectileManager.js";
import { HUD } from "../ui/HUD.js";
import { CANVAS_WIDTH, PLAYER_SIZE, PLAYER_Y } from "./constants.js";
import { GameState } from "./GameState.js";
import { InputManager } from "./InputManager.js";

export class Game {
    // --- Dépendances reçues de l'extérieur ---
    #canvas;
    #ctx;
    #assetLoader;
    #sound;

    // --- Objets que Game crée et possède (composition) ---
    #input = new InputManager();
    #collisions = new CollisionManager();
    #hud = new HUD();
    #projectiles;
    #enemies;
    #explosions;

    // --- Etats de la partie ---
    #state = GameState.PLAYING;
    #player = null;
    #level = null; // Le niveau en cours (objet de data/levels.js)
    #ship = null; // Le vaisseau choisi (objet de data/ships.js)
    #score = 0;
    #enemyShootTimer = 0; // Compte à rebours avant le prochain tir ennemi
    #lastFrameTime = 0; // Horodatage de la dernière frame (pour calculer dt)

    /**
     * Les objets dont Game a besoin lui sont passés en paramètres
     * L'INJECTION DE DEPENDANCES, plutôt que créer ici : c'est main.js qui charge les ressources puis les donne à Game
     * Game ne dépend donc pas de la façon dont elles sont chargées
     */
    constructor(canvas, assetLoader, soundManager) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");
        this.#assetLoader = assetLoader;
        this.#sound = soundManager;

        this.#projectiles = new ProjectileManager(assetLoader, CANVAS_WIDTH);
        this.#enemies = new EnemyManager(assetLoader);
        this.#explosions = new ExplosionManager(assetLoader.get("explosion"))
    }

    // ----------------------------------------------------------------
    // CYCLE DE VIE D'UNE PARTIE
    // ----------------------------------------------------------------
    /**
     * Initialiser une partie sur un niveau, avec un vaisseau donné
     * On l'appelle au démarrage ET à chaque "Rejouer" : tout est remis à zéro
     * @param {object} level voir data/levels.js
     * @@param {object} ship voir data/ships.js
     */
    startLevel(level, ship) {
        this.#level = level;
        this.#ship = ship;
        this.#score = 0;
        this.#enemyShootTimer = level.shootInterval;

        // On réinitialise avant d'instancier
        this.#projectiles.clear();
        this.#explosions.clear();
        this.#enemies.spawn(level);

        // Le joueur est créé centré en bas de l'écran, avec les attributs du vaisseau
        this.#player = new Player(
            CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
            PLAYER_Y,
            this.#assetLoader.get(ship.id),
            computeShipAttributes(ship.stats)
        );

        this.#state = GameState.PLAYING;
    }

    /**
     * Construction du background du canvas (soit l'image, soit un background de secours)
     */
    #drawBackground() {
        const background = this.#assetLoader.get("background");

        if (background) {
            this.#ctx.drawImage(background, 0, 0, this.#canvas.width, this.#canvas.height);
        } else {
            this.#ctx.fillStyle = "#050510";
            this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
        }
    }

    /**
     * RENDER: dessine tous les éléments de la scène et l'interface
     */
    render() {
        const ctx = this.#ctx;
        // On efface tout pour reconstruire
        ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#drawBackground();
    }

    /**
     * Permet de démarrer la boucle de jeu
     */
    start() {
        const loop = () => {
            this.render();
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }
}