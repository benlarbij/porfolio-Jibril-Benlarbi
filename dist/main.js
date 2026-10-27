"use strict";
// Mets ton adresse ici (ex : "prenom.nom@gmail.com") pour que le formulaire ouvre la messagerie du visiteur
const EMAIL_CONTACT = "";
const liensMenu = document.querySelectorAll("nav a");
liensMenu.forEach((lien) => {
    lien.addEventListener("click", (event) => {
        event.preventDefault();
        const cible = lien.getAttribute("href");
        if (!cible)
            return;
        const section = document.querySelector(cible);
        section?.scrollIntoView({ behavior: "smooth" });
    });
});
const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Remplit une barre de langue de 0 jusqu'à sa valeur
function remplirBarre(barre) {
    const valeurFinale = Number(barre.dataset.valeur);
    const duree = 1000;
    const debut = performance.now();
    function etape(maintenant) {
        const avancement = Math.min((maintenant - debut) / duree, 1);
        barre.value = valeurFinale * avancement;
        if (avancement < 1)
            requestAnimationFrame(etape);
    }
    requestAnimationFrame(etape);
}
if (!mouvementReduit && "IntersectionObserver" in window) {
    const sections = document.querySelectorAll("section");
    const barres = document.querySelectorAll("#langues progress");
    // On met les barres à 0 en gardant leur vraie valeur de côté
    barres.forEach((barre) => {
        barre.dataset.valeur = String(barre.value);
        barre.value = 0;
    });
    // Quand une section arrive à l'écran, on l'affiche (une seule fois)
    const observateur = new IntersectionObserver((entrees) => {
        entrees.forEach((entree) => {
            if (!entree.isIntersecting)
                return;
            entree.target.classList.add("visible");
            if (entree.target.id === "langues")
                barres.forEach(remplirBarre);
            observateur.unobserve(entree.target);
        });
    }, { threshold: 0.15 });
    sections.forEach((section) => {
        section.classList.add("animer");
        observateur.observe(section);
    });
}
// Numéro de chaque compétence, pour qu'elles apparaissent l'une après l'autre
document.querySelectorAll("#competences li").forEach((competence, i) => {
    competence.style.setProperty("--i", String(i));
});
// Barre de progression de lecture en haut de la page
const barreProgression = document.createElement("div");
barreProgression.id = "progression";
document.body.appendChild(barreProgression);
function majProgression() {
    const hauteurMax = document.documentElement.scrollHeight - window.innerHeight;
    const avancement = hauteurMax > 0 ? window.scrollY / hauteurMax : 0;
    barreProgression.style.transform = `scaleX(${avancement})`;
}
window.addEventListener("scroll", majProgression, { passive: true });
majProgression();
// Menu fixé en haut une fois l'en-tête dépassé + lien de la section en cours souligné
const enTete = document.querySelector("header");
const menu = document.querySelector("header nav");
if ("IntersectionObserver" in window) {
    new IntersectionObserver((entrees) => {
        menu.classList.toggle("nav-fixe", !entrees[0].isIntersecting);
    }).observe(enTete);
    const observateurMenu = new IntersectionObserver((entrees) => {
        entrees.forEach((entree) => {
            if (!entree.isIntersecting)
                return;
            liensMenu.forEach((lien) => {
                lien.classList.toggle("actif", lien.getAttribute("href") === `#${entree.target.id}`);
            });
        });
    }, { rootMargin: "-50% 0px -50% 0px" });
    document.querySelectorAll("section").forEach((section) => observateurMenu.observe(section));
}
if (!mouvementReduit) {
    // Effet machine à écrire sur le sous-titre
    const sousTitre = document.querySelector(".sous-titre");
    const phrases = [
        sousTitre.textContent ?? "",
        "Développeur C et TypeScript",
        "À la recherche d'un stage en informatique",
    ];
    let indexPhrase = 0;
    let nbLettres = phrases[0].length;
    let efface = true;
    sousTitre.classList.add("ecrit");
    function ecrire() {
        const phrase = phrases[indexPhrase];
        sousTitre.textContent = phrase.slice(0, nbLettres);
        let pause = efface ? 35 : 70;
        if (!efface && nbLettres === phrase.length) {
            efface = true;
            pause = 2200;
        }
        else if (efface && nbLettres === 0) {
            efface = false;
            indexPhrase = (indexPhrase + 1) % phrases.length;
            pause = 400;
        }
        else {
            nbLettres += efface ? -1 : 1;
        }
        setTimeout(ecrire, pause);
    }
    setTimeout(ecrire, 3000);
    // Fiches projets qui s'inclinent en 3D selon la position de la souris
    document.querySelectorAll("#projets article").forEach((carte) => {
        carte.addEventListener("mousemove", (event) => {
            const rect = carte.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            carte.style.transform = `rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-4px)`;
            carte.style.setProperty("--x", `${x * 100}%`);
            carte.style.setProperty("--y", `${y * 100}%`);
        });
        carte.addEventListener("mouseleave", () => {
            carte.style.transform = "";
        });
    });
    // Réseau de particules dans l'en-tête, qui réagit à la souris
    const canvas = document.createElement("canvas");
    enTete.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let particules = [];
    let largeur = 0;
    let hauteur = 0;
    const souris = { x: -1000, y: -1000 };
    const DISTANCE_LIEN = 120;
    let enTeteVisible = true;
    function redimensionner() {
        const ratio = window.devicePixelRatio || 1;
        largeur = enTete.offsetWidth;
        hauteur = enTete.offsetHeight;
        canvas.width = largeur * ratio;
        canvas.height = hauteur * ratio;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        const nombre = Math.min(Math.floor((largeur * hauteur) / 12000), 90);
        particules = [];
        for (let i = 0; i < nombre; i++) {
            particules.push({
                x: Math.random() * largeur,
                y: Math.random() * hauteur,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
            });
        }
    }
    function dessiner() {
        requestAnimationFrame(dessiner);
        if (!enTeteVisible)
            return;
        ctx.clearRect(0, 0, largeur, hauteur);
        particules.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > largeur)
                p.vx *= -1;
            if (p.y < 0 || p.y > hauteur)
                p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.fill();
            // Lignes entre les particules proches
            for (let j = i + 1; j < particules.length; j++) {
                const autre = particules[j];
                const distance = Math.hypot(p.x - autre.x, p.y - autre.y);
                if (distance < DISTANCE_LIEN) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 * (1 - distance / DISTANCE_LIEN)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(autre.x, autre.y);
                    ctx.stroke();
                }
            }
            // Lignes vers la souris
            const distanceSouris = Math.hypot(p.x - souris.x, p.y - souris.y);
            if (distanceSouris < DISTANCE_LIEN * 1.5) {
                ctx.strokeStyle = `rgba(199, 125, 255, ${0.6 * (1 - distanceSouris / (DISTANCE_LIEN * 1.5))})`;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(souris.x, souris.y);
                ctx.stroke();
            }
        });
    }
    enTete.addEventListener("mousemove", (event) => {
        const rect = enTete.getBoundingClientRect();
        souris.x = event.clientX - rect.left;
        souris.y = event.clientY - rect.top;
    });
    enTete.addEventListener("mouseleave", () => {
        souris.x = -1000;
        souris.y = -1000;
    });
    // On arrête de dessiner quand l'en-tête n'est plus à l'écran
    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entrees) => {
            enTeteVisible = entrees[0].isIntersecting;
        }).observe(enTete);
    }
    window.addEventListener("resize", redimensionner);
    redimensionner();
    dessiner();
}
const formulaire = document.getElementById("form-contact");
const champNom = document.getElementById("nom");
const champPrenom = document.getElementById("prenom");
const champEmail = document.getElementById("email");
const champTelephone = document.getElementById("telephone");
const champEntreprise = document.getElementById("entreprise");
const champMessage = document.getElementById("message");
const resultat = document.getElementById("resultat");
function afficherErreur(message) {
    resultat.textContent = message;
    resultat.style.color = "red";
}
function afficherValidation(message) {
    resultat.textContent = message;
    resultat.style.color = "green";
}
formulaire.addEventListener("submit", (event) => {
    event.preventDefault();
    const nom = champNom.value.trim();
    const prenom = champPrenom.value.trim();
    const email = champEmail.value.trim();
    const telephone = champTelephone.value.trim();
    const entreprise = champEntreprise.value.trim();
    const message = champMessage.value.trim();
    if (!nom || !prenom || !email || !message) {
        afficherErreur("Veuillez remplir tous les champs obligatoires (*).");
        return;
    }
    // texte@texte.texte, sans espace
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        afficherErreur("Veuillez entrer une adresse email valide.");
        return;
    }
    // Le téléphone est facultatif : on ne le vérifie que s'il est rempli
    if (telephone) {
        // On enlève les espaces, points et tirets (06 12 34 56 78, 06.12.34.56.78...)
        const numero = telephone.replace(/[\s.-]/g, "");
        if (!/^\d{10}$/.test(numero)) {
            afficherErreur("Le téléphone doit contenir 10 chiffres.");
            return;
        }
        if (!numero.startsWith("0")) {
            afficherErreur("Le téléphone doit commencer par 0.");
            return;
        }
    }
    if (!EMAIL_CONTACT) {
        afficherValidation(`Merci ${prenom} ${nom}, vos informations sont valides. L'envoi en ligne n'est pas encore disponible.`);
        return;
    }
    const sujet = `Contact portfolio — ${prenom} ${nom}${entreprise ? ` (${entreprise})` : ""}`;
    const corps = `${message}\n\n${prenom} ${nom}\n${email}${telephone ? `\n${telephone}` : ""}${entreprise ? `\n${entreprise}` : ""}`;
    window.location.href = `mailto:${EMAIL_CONTACT}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
    afficherValidation(`Merci ${prenom} ${nom}, votre messagerie s'ouvre pour envoyer le message.`);
    formulaire.reset();
});
