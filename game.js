//import GameHandler from "./gameHandler.js";
//import { Position } from "./position.js";

var smallShip = {
  name: "smallShip",
  size: 10,
  life: 30,
  speed: 0,
  color: "white",
  // Assuming (0,0) as the center of the ship
  shape: [
    [-10, -10], // Top left
    [10, 0], // Top right
    [10, 0], // Bottom right
    [-10, 10], // Bottom left
  ],
  position: { x: 20, y: 20 }, // Assuming Position is an object with x, y properties
};

//Thibaut LÉAUX
// COMPETENCES
// DIPLÔMES
// LANGUES
// EXPERIENCE PROFESIONNELLE
// INGÉNIEUR EN INFORMATIQUE
// ET RÉSEAUX DE COMMUNICATION
// Spécialisation Informatique Embarquée | CPE Lyon
// ORANGE – Apprenti Ingénieur en Automatisation
// Sept. 2017 - Juin 2020
// BREVET DE TECHNICIEN SUPERIEUR
// SYSTEMES NUMERIQUES
// Option Electronique et Communications | Lycée Edouard Branly
// Sept. 2015 - Juin 2017
// • Logiciel de localisation en batiment en 3D sur Unity
// • Automatisation de la supervision Environnement Technique
// et Commutation.
// • Gestion de projets transverses entre les services de la supervision en mode agile.
// • Développement d'automates sous Wintask.
// • Developpement web Php Javascript.
// • Mise en production et SAV des lignes internet Orange ADSL et fibre.
// • Mise en production de routeurs pour les clients entreprise.
// • Expertises, recherche de perturbateurs électromagnétiques.
// ORANGE – Apprenti Technicien d’intervention client
// Sept. 2015 - Aout 2017 | Bourg en Bresse
// Ingénieur Développeur
// Sept. 2017 – Sept. 2020 | Lyon
// PROFIL
// Passionné de développement, d'électronique et de domotique, je suis ingénieur, diplomé de CPE Lyon en filière Informatique et Réseaux de Communication, spécialisation informatique embarquée.
// J’ai mené à terme des projets d’application mobile professionnels et personnels, des projets d’automatisation complexes en autonomie au sein de la supervision des réseaux d’Orange, et conçu des systèmes pour des salles d’escape game en tant que micro-entrepreneur.
// BACCALAURETAT SCIENTIFIQUE
// SCIENCES DE L’INGENIEUR
// Option Physique Chimie | Lycée Pierre Brossolette
// Sept. 2008 - Juin 2011
// Création d’applications et Webapps en Flutter
// Développement de jeux vidéos et outils en C#, C++ et Java
// Gestion de projets complexes transverses
// Développement web front back NodeJS, PHP ou Springboot
// Développement C++ sur microcontrôleurs (Arduino, STM32, Raspberry Pi)
// Développement script Python en robotique
// (ROS et Pepper Aldebaran)
// Utilisation quotidienne de Git et de la suite Jetbrains, Intégration continue GitlabCI
// Anglais avancé
// +33 6 79 68 37 53
// 5 rue du Béal, 69009 Lyon
// https://www.linkedin.com/in/thibaut-leaux-angeli-497733115
// thibaut-leaux-angeli@live.fr
// ✓ Français : Langue maternelle
// ✓ Anglais : Niveau C1
// o Cambridge Advanced Exam
// o Année 2014-2015 en Ecosse
// ✓
// CENTRES D’INTERET
// o Conception et Pilotage de drone freestyle/course FPV
// o Création d’applicaitons, robots et systèmes connectés
// o Musique - Guitare et Piano
// o Cinéma
// o Sorties moto en groupe
// Permis A et B Véhiculé
// MICRO-ENTREPRENEUR – Ingénieur en Domotique
// Oct. 2016 – Sept. 2020 | Lyon
// • Conception, réalisation et maintenance de systèmes domotiques pour des escape games.
// • Intégration de microcontrôleurs, capteurs et actionneurs dans du mobilier.
// 30 ans
// Freelance – Ingénieur Développeur Mobile
// Sept. 2020 – Aujourd’hui | Lyon
// • Développement de BipShare, une application cross-platform de création de playlist de musiques partagées en Flutter.
// • Conception et développement d’une application mobile de gestion des ressources humaine pour un client en Flutter
// • Reprise de projet d’un application de coffre fort numerique en React Native et Node.JS
// • Conception et développement d’un ERP/CRM dans le domaine viticole.en Flutter

var dateOfBirth = new Date(1993, 2, 11);
var ageDifYear =
  (Date.now() - dateOfBirth.getTime()) / 1000 / 60 / 60 / 24 / 365;
//truncate the age to 2 decimals
ageDifYear = Math.trunc(ageDifYear * 100) / 100;

//now we add elements of my resume to the game as enemies
var AllEnemies = [
  new Enemy("Thibaut LÉAUX", 1000, 10, 1, "blue"),
  new Enemy("Age " + ageDifYear, 25, 4, 0.5, "blue"),

  new Enemy("Anglais avancé", 10, 4, 0.5 + Math.random() / 3, "#00ffAA"),
  new Enemy(
    "Applications, Webapps Flutter",
    100,
    10,
    0.1 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Développement C#, C++ et JS",
    100,
    10,
    0.1 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Projets complexes",
    100,
    10,
    0.1 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Fullstack front back NodeJS, PHP ou Springboot",
    100,
    15,
    0.8 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "C++ et microcontrôleurs (Arduino, STM32, Raspberry Pi)",
    100,
    12,
    0.4 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Python et robotique (ROS et Pepper Aldebaran)",
    100,
    17,
    0.5 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Git Jetbrains, GitlabCI",
    150,
    20,
    0.1 + Math.random() / 10,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Conception/Pilotage Drone FPV",
    Math.random() * 40,
    Math.random() * 40,
    Math.random() / 2,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "NodeJS, PHP ou Springboot",
    Math.random() * 40,
    Math.random() * 40,
    Math.random() / 2,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "Flutter",
    Math.random() * 80 + 50,
    Math.random() * 40,
    Math.random() / 2,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
  new Enemy(
    "React Native",
    Math.random() * 20,
    Math.random() * 20,
    Math.random() / 2,
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  ),
];

var enemiesNumber = AllEnemies.length;

var CVEnemies;

GameHandler = new GameHandler();
function resizeCanvasToDisplaySize(canvas) {
  // get the display size of the canvas.
  var width = canvas.clientWidth;
  var height = canvas.clientHeight;

  // check if the canvas size is different from its display size.
  if (canvas.width !== width || canvas.height !== height) {
    // make the canvas the same size
    canvas.width = width;
    canvas.height = height;
  }
}
function init() {
  var canvas = document.getElementById("canvas");
  resizeCanvasToDisplaySize(canvas);
  GameHandler.start();
}

function setCursorPosition(event) {
  GameHandler.setCursorPosition(new Position(event.clientX, event.clientY));
}

function makeMouseClick(event) {
  GameHandler.makeMouseClick(new Position(event.clientX, event.clientY));
}
//on widown size change init function is called
window.addEventListener("resize", init);

//add and event listener to the mouse click
window.addEventListener("click", makeMouseClick);
