
// Mets ton adresse ici (ex : "prenom.nom@gmail.com") pour que le formulaire ouvre la messagerie du visiteur
const EMAIL_CONTACT: string = "";

const liensMenu = document.querySelectorAll<HTMLAnchorElement>("nav a");

liensMenu.forEach((lien) => {
  lien.addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();

    const cible: string | null = lien.getAttribute("href");
    if (!cible) return;

    const section = document.querySelector(cible);
    section?.scrollIntoView({ behavior: "smooth" });
  });
});


const formulaire = document.getElementById("form-contact") as HTMLFormElement;
const champNom = document.getElementById("nom") as HTMLInputElement;
const champPrenom = document.getElementById("prenom") as HTMLInputElement;
const champEmail = document.getElementById("email") as HTMLInputElement;
const champTelephone = document.getElementById("telephone") as HTMLInputElement;
const champEntreprise = document.getElementById("entreprise") as HTMLInputElement;
const champMessage = document.getElementById("message") as HTMLTextAreaElement;
const resultat = document.getElementById("resultat") as HTMLParagraphElement;

function afficherErreur(message: string): void {
  resultat.textContent = message;
  resultat.style.color = "red";
}

function afficherValidation(message: string): void {
  resultat.textContent = message;
  resultat.style.color = "green";
}

formulaire.addEventListener("submit", (event: Event) => {
  event.preventDefault();

  const nom: string = champNom.value.trim();
  const prenom: string = champPrenom.value.trim();
  const email: string = champEmail.value.trim();
  const telephone: string = champTelephone.value.trim();
  const entreprise: string = champEntreprise.value.trim();
  const message: string = champMessage.value.trim();

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
    const numero: string = telephone.replace(/[\s.-]/g, "");

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

  const sujet: string = `Contact portfolio — ${prenom} ${nom}${entreprise ? ` (${entreprise})` : ""}`;
  const corps: string = `${message}\n\n${prenom} ${nom}\n${email}${telephone ? `\n${telephone}` : ""}${entreprise ? `\n${entreprise}` : ""}`;

  window.location.href = `mailto:${EMAIL_CONTACT}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;

  afficherValidation(`Merci ${prenom} ${nom}, votre messagerie s'ouvre pour envoyer le message.`);
  formulaire.reset();
});
