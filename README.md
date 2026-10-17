# 📜 Màquina de Turing & Bletchley Park 1941
### Simulador del Joc de Taula i Unitat Didàctica Interactiva

Un entorn d'aprenentatge interactiu i fidel recreació digital del premiat joc de taula **«Turing Machine»** (de Fabien Gridel i Yoann Levet), ambientat amb una estètica de **quadern de camp i aquarel·les històriques de la Segona Guerra Mundial (1939–1945)**.

---

## 🎯 En aquesta proposta aprendràs a...

En aquesta activitat faràs un viatge en el temps fins a la Segona Guerra Mundial per descobrir com un equip secret de científics, liderats pel matemàtic **Alan Turing**, va aconseguir canviar el rumb de la història. Aprendràs com funcionava la famosa màquina de missatges secrets *Enigma* i com l'enginy humà i les primeres màquines de càlcul van acabar donant origen als ordinadors, videojocs i mòbils que fem servir avui dia.

A més, et posaràs a la pell d'un autèntic desxifrador de codis utilitzant un computador mecànic que funciona sense cap pantalla ni cable. Mitjançant targetes de cartró amb forats que filtren la informació en apilar-se, aprendràs a fer proves intel·ligents a la màquina, descartar les pistes impossibles i descobrir per pura lògica un codi secret d'entre 125 combinacions possibles.

### 🏆 Els 3 Objectius d'Aprenentatge
1. **Descobrir la història dels primers ordinadors:** Conèixer per què el xifratge de missatges va ser clau a la Segona Guerra Mundial i com Alan Turing va idear les primeres màquines programables.
2. **Entendre la computació física amb forats:** Experimentar com es pot processar informació només apilant targetes de cartró, veient com es tapen 124 combinacions per deixar passar la llum per un únic forat.
3. **Pensar com un detectiu de la lògica:** Plantejar bones hipòtesis de prova, interpretar els resultats (verd o vermell), ratllar les opcions descartades i deduir el codi secret amb certesa matemàtica.

---

## 🧭 Itinerari Pedagògic Seqüencial (3 Fases)

1. **Fase 1 · Dossier Històric i Test de Comprensió:**
   - 4 capítols visuals il·lustrats en aquarel·la sobre la Segona Guerra Mundial, la màquina Enigma, Alan Turing a Bletchley Park (*Hut 8*) i l'origen dels ordinadors moderns.
   - Simulador interactiu en viu de la matriu de 125 forats i l'enginyeria de superposició.
   - Test final obligatori de 5 preguntes per desbloquejar la fase següent.
2. **Fase 2 · Tutorial Guiat Pas a Pas:**
   - 6 reptes interactius seqüenciats per aprendre les figures (`▲`, `■`, `●`), les cartes de criteri, la lectura mecànica i l'ús de la llibreta de deducció.
3. **Fase 3 · El Tauler de Joc «Turing Machine»:**
   - Simulació física fidel amb selecció de targetes perforades, previsualització del forat obert en temps real, consola central de verificadors mecànics (A–F) i quadern oficial de deducció amb assistent lògic de candidats restants.
   - Enigmes autònoms (#01 al #07) verificats amb solució matemàtica única.

---

## 🚀 Com executar el projecte en local

### Requisits previs
- **Node.js** (versió 18 o superior)
- **npm** o **bun**

### Passos d'instal·lació
```bash
# 1. Clonar el repositori
git clone https://github.com/gerardcallereus/Turing-Machine.git
cd Turing-Machine

# 2. Instal·lar les dependències
npm install

# 3. Iniciar el servidor de desenvolupament
npm run dev
```

Obre el teu navegador a [http://localhost:3000](http://localhost:3000) per començar a jugar!

---

## 🛠️ Tecnologies emprades
- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS** (amb paleta personalitzada d'aquarel·les i textura de paper de cotó envellit)
- **Lucide Icons**
- **Canvas Confetti** & Web Audio API mecànica
