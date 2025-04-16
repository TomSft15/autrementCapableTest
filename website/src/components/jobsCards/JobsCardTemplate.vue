// Fichier à placer dans @/components/jobsCards/MetierCardTemplate.vue

<template>
  <MetierPage
    :metierName="metierData.name"
    :description="metierData.description"
    :videoSrc="metierData.video"
    :posterSrc="metierData.poster"
    :skills="metierData.skills"
    :workEnvironment="metierData.environment"
    :jobDetails="metierData.details"
    :nextRoute="metierData.nextRoute"
  />
</template>

<script>
import MetierPage from '@/views/MetierPage.vue'

/*
  Ce composant sert de base pour créer des cartes de métiers.
  Utilisez-le en l'étendant et en définissant les données spécifiques du métier.
  
  Exemple d'utilisation:
  
  export default {
    extends: MetierCardTemplate,
    data() {
      return {
        metierData: {
          name: "Nom du métier",
          slug: "slug-du-metier",
          description: "Description du métier...",
          video: "URL de la vidéo",
          poster: "/images/MonMetier_Cover.png",
          skills: [
            "Compétence 1",
            "Compétence 2",
            "Compétence 3",
            "Compétence 4",
          ],
          environment: "Description de l'environnement de travail...",
          details: `...détails HTML du métier...`,
          nextRoute: "NomProchainMetier" // Route vers laquelle rediriger après
        }
      };
    }
  };
*/

export default {
  name: 'MetierCardTemplate',
  components: { MetierPage },
  data() {
    return {
      metierData: {
        name: "",
        slug: "",
        description: "",
        video: "",
        poster: "",
        skills: [],
        environment: "",
        details: "",
        nextRoute: null
      }
    };
  }
};
</script>