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
