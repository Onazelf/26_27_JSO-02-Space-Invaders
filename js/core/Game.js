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
import { CANVAS_WIDTH, MAX_DELTA_TIME, PLAYER_SIZE, PLAYER_Y } from "./constants.js";
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
     * Permet de démarrer la boucle de jeu
     */
    start() {
        // performance.now() renvoie un temps précis en milliseconde depuis le début du contexte
        // On le mémorise pour calculer la durée écoulée entre 2 images
        this.#lastFrameTime = performance.now();

        const loop = (now) => {
            // dt = temps écoulé depuis la dernière image (s)
            // Le plafond (Math.min) évite un énorme saut quand l'onglet est resté longtemps en arrière-plan
            const dt = Math.min( (now - this.#lastFrameTime) / 1000, MAX_DELTA_TIME);

            this.#lastFrameTime = now;
            this.update(dt); // On calcule le nouvel état du jeu

            this.render(); // On dessine cet état
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }

    // ----------------------------------------------------------------
    // UPDATE : La logique du jeu (aucun dessin ici)
    // ----------------------------------------------------------------
    update(dt) {
        this.#handleGlobalInput();

        // Quand le jeu n'est pas en cours (pause, fin de partie), plus rien ne bouge : c'est ce simple if qui réalise la pause
        if(this.#state === GameState.PLAYING) {
            this.#updatePlaying(dt);
        }

        // LAST TODO: ce qui vient d'être pressé ne vaut que pour cette image
        this.#input.endFrame();
    }

    /**
     * Touches qui marchent quel que soit l'état: son, pause, rejouer...
     */
    #handleGlobalInput() {
        if(this.#input.wasPressed("KeyM")) {
            this.#sound.toggleMute();
        }

        const wantsPause = this.#input.wasPressed("KeyP") || this.#input.wasPressed("Escape");

        // Une même touche fait 2 choses selon l'état: c'est une TRANSITION d'état
        if(wantsPause && this.#state === GameState.PLAYING) {
            this.#state = GameState.PAUSED;
        } else if (wantsPause && this.#state === GameState.PAUSED) {
            this.#state = GameState.PLAYING;
        }

        const isFinished = this.#state === GameState.VICTORY || GameState.GAME_OVER;

        if(this.#input.wasPressed("KeyR") && isFinished) {
            this.startLevel(this.#level, this.#ship);
        }
    }

    /**
     * Tout ce qui se passe pendant qu'on joue. L'ORDRE compte :
     * On déplace tout, puis on teste
     */
    #updatePlaying(dt) {
        this.#updatePlayer(dt);
        this.#projectiles.update(dt);
        this.#enemies.update(dt, CANVAS_WIDTH);
        this.#explosions.update(dt);
        this.updateEnemyShooting(dt);

        this.#handleCollisions();
    }

    /**
     * Déplace le joueur et gère ses tirs selon les commandes reçues
     */
    #updatePlayer(dt) {
        const player = this.#player;

        player.update(dt); // Ecoule le délai de tir et d'invincibilité

        // isPressed : tant que la touche est maintenue, on bouge a chaque image
        if(this.#input.isPressed("ArrowLeft")) {
            player.moveLeft(dt);
        }

        if(this.#input.isPressed("ArrowRight")) {
            player.moveRight(dt, CANVAS_WIDTH);
        }

        const wantsToShot = this.#input.isPressed("Space") || this.#input.isPressed("ArrowUp");

        // Le joueur n'a pas le droit de tirer à chaque image: canShoot() impose le délai
        if(wantsToShot && player.canShoot()) {
            this.#projectiles.createPlayerBullet(player);
            player.registerShot(); // Relance le délai
            this.#sound.play("playerShot", 0.7);
        }
    }

    /**
     * Les ennemis tirent à intervalles réguliers
     * Un compte à rebours diminue avec dt, ça doit respecter l'écran de pause : quand le jeu est en pause, update n'est pas appelé, le compteur est donc gelé
     */
    updateEnemyShooting(dt) {
        this.#enemyShootTimer -= dt;

        if(this.#enemyShootTimer > 0) {
            return; // Pas encore le moment de tirer
        }

        const shooters = this.#enemies.getShooters();

        if(shooters.length > 0) {
            // Nombre entier aléatoire entre 0 et (shooters.length - 1)
            // Math.random() donne un décimal dans [0, 1], on le multiplie puis on arrondit vers le bas
            const shooter = shooters[Math.floor(Math.random() * shooters.length)];

            this.#projectiles.createEnemyBullet(shooter);
            this.#sound.play("enemyShot", 0.5);
        }

        this.#enemyShootTimer = this.#level.shootInterval; // On relance le compte à rebours
    }

    // ----------------------------------------------------------------
    // COLLISIONS: CollisionManager DETECTE et Game DECIDE
    // ----------------------------------------------------------------
    /**
     * Détecte les collisions et applique leur conséquences dans l'ordre prévu
     */
    #handleCollisions() {
        this.#handlePlayerBulletHitEnemies();
        this.#handleEnemyBulletHitPlayer();
        this.#handleEnemiesTouchPlayer();
    }

    /**
     * Gère les tirs du joueur qui touchent les ennemis et leur attribue les DGT
     */
    #handlePlayerBulletHitEnemies() {
        // playerBullets et enemies renvoient des copies : on peut donc supprimer dans les vrais tableaux pendant qu'on parcourt les copies sans rien casser
        for(const bullet of this.#projectiles.playerBullets) {
            const enemy = this.#collisions.findFirstCollision(bullet, this.#enemies.enemies);

            if(!enemy) {
                continue; // Ce tir ne touche rien : on passe au suivant
            }

            this.#projectiles.removePlayerBullet(bullet); // Ce tir est consommé, on l'efface
            // takeHit renvoie true si l'ennemi est détruit (un boss, lui, peut survivre)
            if(enemy.takeHit(bullet.damage)) {
                this.#score += enemy.points;
                this.#explosions.spawn(enemy.centerX, enemy.centerY);
                this.#sound.play("explosionSmall", 0.75);
                this.#enemies.removeEnemy(enemy);
            }
        }
    }

    /**
     * Gère les tirs des ennemis qui touchent le joueur et lui retire une vie
     */
    #handleEnemyBulletHitPlayer() {
        const bullet = this.#collisions.findFirstCollision(this.#player, this.#projectiles.enemyBullets);

        if(!bullet) {
            return; // Aucun missile ennemi n'a touché le joueur
        }

        // Le tir est consommé dans tout les cas ; même si le joueur est invincible
        this.#projectiles.removeEnemyBullet(bullet);
        this.#damagePlayer();

    }

    /**
     * Un alien touche le joueur
     */
    #handleEnemiesTouchPlayer() {
        const enemy = this.#collisions.findFirstCollision(this.#player, this.#enemies.enemies);

        if(enemy) {
            this.#damagePlayer();
        }
    }

    /**
     * Point unique pour blesser le joueur
     */
    #damagePlayer() {
        // takeDamage répond false pendant l'invincibilité : alors on ne fait rien
        if(!this.#player.takeDamage()) {
            return;
        }

        this.#explosions.spawn(this.#player.centerX, this.#player.centerY);
        this.#sound.play("hit", 0.9);
    }

    // ----------------------------------------------------------------
    // FIN DE PARTIE
    // ----------------------------------------------------------------


    /**
     * Construction du background du canvas (soit l'image, soit un background de secours)
     */
    #drawBackground() {
        const background = this.#assetLoader.get("background");

        if(background) {
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

        // L'ORDRE DES DESSINS compte : ce qui est dessiné en dernier apparaît par dessus (calques)
        // Fond => Joueur => Ennemis => Tirs => Explosions => Interface => Overlays
        this.#player.draw(ctx);
        this.#enemies.draw(ctx);
        this.#projectiles.draw(ctx);
        this.#explosions.draw(ctx);
    }
}