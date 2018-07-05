# 3D Ringen configurator

De 3D ringenconfigurator voor http://basisringenshop.nl

## Getting Started

De ontwikkelomgeving van de configurator draait op nodeJs. Om alles klaar te maken voor verdere ontwikkeling zal nodeJs, en het project eerst geinstalleerd moeten worden.

### Het project installeren

1. Installeer nodeJs. (https://nodejs.org/en/)
2. Clone de repository. ( stap 1 en 2 kunnen ook omgedraaid worden :P )
3. Navigeer in de terminal (in windows de Node.js command prompt) naar de net gedownloade bestanden.
4. voer het onderstaande command uit. Dit zorgt ervoor dat de benodigde pakketen worden gedownload en geinstalleerd.

```
npm install
```

### Beginnen met ontwikkelen

De bestanden van de configurator zijn te vinden in src/ring. Als een van deze bestanden is aangepast zal het project opnieuw gebundled/gecompiled moeten worden. Dit is te doen door het volgende command in te voeren vanaf de root van het project.

```
npm run-script build
```

Het net gemaakte bestand is te vinden in build/javascripts/configurator.js. In dit bestand zijn alle onderdelen uit de map src/ring samengevoegd en gecompiled met Babel.js. Babel.js zorgt ervoor dat de code ook juist werkt in oudere browsers zoals ie11.

Het onderstaande command zorgt ervoor dat het project automatisch gecompiled wordt wanneer er een aanpassing gedaan is in de map scr/ring. Dit kan makkelijker zijn dan steeds handmating het command "npm run-script build" in te voeren.

```
npm run-script dev
```

### Aanpassingen bekijken

In het project is een expressjs server toegevoegd. Dit maakt het makkelijker om de aanpassingen snel te kunnen bekijken. Gebruik het command:  

```
npm start
```

en ga vervolgens in de browser http://localhost:3001/ om het resultaat te bekijken.

### De basis ringen configurator

De Ring class is de hoofdklasse voor het genereren van de ring. Deze klasse stuurt alle andere klasse aan. Het proces van het genereren werkt als volgt:

1. Een ring object wordt aangemaakt door middel van de code "new Ring (int model)".
2. In de constructor worden alle instelling geinitieerd.
3. De ring moet in de scene geplaatst worden en gegenereed met de methode "PlaceRingInScene()".
4. Het basismodel (zonder groeven) wordt gegenereed. Als eerste een 2D shape (het model). En vervolgens hiervan een 3D ring.
5. Eventueel worden er groeven aangemaakt. Dit zijn clipObjects. D.m.v. de RingClippingPathCreator worden de groeven op de juiste positie op de ring geplaatst. Hiervoor is het nodig dat het basismodel zonder groeven al aanwezig is. Een nieuwe 2D shape wordt aangemaakt, met de groeven toegepast. En vervolgens hiervan een 3D ring.
6. De laatste stap zijn de materialen. Voor elk verschillende materiaal moet een kopie gemaakt worden van de 3D ring. En door middel van een clipping plane wordt het object "afgesneden". Zodat het volgende materiaal kan beginnen.
7. De ring kan aangepast worden door de methodes in de klasse Ring aan te spreken. Als er aanpassingen gedaan zijn moet de methode updateRing() uitgevoerd worden om de aanpassing toe te passen.

## Gebruikte frameworks in productie

* [ThreeJS](https://threejs.org/) - 3D WebGL framework.
* [ClipperLibJs](https://github.com/junmer/clipper-lib) - 2D shape substract, union functions.
* [Detector](https://threejs.org/docs/#manual/introduction/WebGL-compatibility-check) - ThreeJs extentie, laat waarschuwing zien als de browser niet WebGL compatible is.
* [OrbitControl](https://threejs.org/docs/#examples/controls/OrbitControls) - ThreeJs extentie voor camera besturing.

## Gebruikte frameworks in development omgeving

* [RollUp](https://rollupjs.org/) - Bundle tool om alle src files te compilen naar een enkel bestand.
* [Babel](https://babeljs.io/) - zorgt ervoor dat het gecompilde bestand geschikt is voor alle browsers.
* [ExpressJs](https://expressjs.com/) - Server tool om de configurator lokaal te laten draaien.
