<template>
  <div class="category-page-container">
    <!-- Header avec personnage guide -->
    <div class="guide-character">
      <img src="@/assets/avatars/guide.png" alt="Guide" class="guide-avatar" />
      <div class="speech-bubble">
        <p>Voici tous les métiers dans la catégorie "{{ category.name }}". Clique sur un métier pour en savoir plus !</p>
      </div>
    </div>

    <div class="category-header">
      <div class="category-icon-large">{{ category.icon }}</div>
      <h1 class="category-title">{{ category.name }}</h1>
      <p class="category-description">Découvre les {{ category.count }} métiers disponibles dans cette catégorie</p>
    </div>
    
    <div class="jobs-grid">
      <router-link 
        v-for="job in jobs" 
        :key="job.id" 
        :to="'/metier/' + job.slug" 
        class="job-card"
      >
        <div class="job-icon">{{ job.icon }}</div>
        <h2 class="job-title">{{ job.title }}</h2>
        <p class="job-short-description">{{ job.shortDescription }}</p>
        <div class="job-card-footer">
          <span class="education-level">{{ job.educationLevel }}</span>
          <span class="view-details">Voir détails →</span>
        </div>
      </router-link>
    </div>
    
    <div class="navigation-buttons">
      <router-link to="/" class="nav-button secondary-button">
        <span class="btn-icon">←</span>
        <span class="btn-text">Retour à l'accueil</span>
      </router-link>
      <router-link to="/metiers" class="nav-button primary-button">
        <span class="btn-icon">🔍</span>
        <span class="btn-text">Voir toutes les catégories</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryPage',
  data() {
    return {
      category: null,
      jobs: []
    }
  },
  created() {
    // Récupérer le slug de la catégorie depuis l'URL
    const categorySlug = this.$route.params.slug;
    
    // Charger les données de la catégorie (à remplacer par un appel API réel)
    this.loadCategoryData(categorySlug);
    
    // Charger les métiers de cette catégorie (à remplacer par un appel API réel)
    this.loadJobsData(categorySlug);
  },
  methods: {
    loadCategoryData(slug) {
      // Simuler une récupération de données - à remplacer par un appel API réel
      const categoriesData = [
        { slug: "technologies-information", name: "Technologies de l'information", icon: "💻", count: 5, description: "Découvre les métiers du numérique et de l'informatique" },
        { slug: "metiers-bouche", name: "Métiers de bouche", icon: "🍽️", count: 7, description: "Explore les métiers de la gastronomie et de l'alimentation" },
        { slug: "agriculture-viticulture", name: "Agriculture et viticulture", icon: "🌱", count: 7, description: "Découvre les métiers de la terre et du vin" },
        { slug: "mecanique-maintenance", name: "Mécanique et maintenance", icon: "🔧", count: 11, description: "Explore les métiers de la réparation et de l'entretien" },
        { slug: "metiers-art-artisanat", name: "Métiers d'art et artisanat", icon: "🎨", count: 8, description: "Découvre les métiers créatifs et artistiques" },
        { slug: "sante-soins", name: "Santé et soins", icon: "🏥", count: 4, description: "Explore les métiers du soin et de la santé" },
        { slug: "industrie-fabrication", name: "Industrie et fabrication", icon: "🏭", count: 5, description: "Découvre les métiers de la production industrielle" },
        { slug: "batiment-construction", name: "Bâtiment et construction", icon: "🏗️", count: 13, description: "Explore les métiers de la construction" },
        { slug: "automobile-carrosserie", name: "Automobile et carrosserie", icon: "🚗", count: 2, description: "Découvre les métiers de l'automobile" }
      ];
      
      this.category = categoriesData.find(cat => cat.slug === slug) || {
        name: "Catégorie inconnue",
        icon: "❓",
        count: 0,
        description: "Cette catégorie n'existe pas"
      };
    },
    loadJobsData(categorySlug) {
      // Données simulées des métiers - à remplacer par un appel API réel
      const jobsData = {
        "technologies-information": [
          { id: 1, title: "Développeur web", icon: "🖥️", slug: "developpeur-web", shortDescription: "Crée des sites et applications web", educationLevel: "Bac+2/3" },
          { id: 2, title: "Administrateur réseau", icon: "🌐", slug: "administrateur-reseau", shortDescription: "Gère les réseaux informatiques", educationLevel: "Bac+2/3" },
          { id: 3, title: "Data Scientist", icon: "📊", slug: "data-scientist", shortDescription: "Analyse les données massives", educationLevel: "Bac+5" },
          { id: 4, title: "Technicien informatique", icon: "🔌", slug: "technicien-informatique", shortDescription: "Assure le support technique informatique", educationLevel: "Bac/Bac+2" },
          { id: 5, title: "Concepteur d'applications", icon: "📱", slug: "concepteur-applications", shortDescription: "Conçoit des applications mobiles", educationLevel: "Bac+3/5" }
        ],
        "metiers-bouche": [
          { id: 6, title: "Boulanger", icon: "🍞", slug: "boulanger", shortDescription: "Fabrique du pain et des viennoiseries", educationLevel: "CAP/BP" },
          { id: 7, title: "Pâtissier", icon: "🧁", slug: "patissier", shortDescription: "Crée des desserts et pâtisseries", educationLevel: "CAP/BP" },
          { id: 8, title: "Boucher", icon: "🥩", slug: "boucher", shortDescription: "Prépare et vend des viandes", educationLevel: "CAP/BP" },
          { id: 9, title: "Chocolatier", icon: "🍫", slug: "chocolatier", shortDescription: "Travaille le chocolat sous toutes ses formes", educationLevel: "CAP/BP" },
          { id: 10, title: "Fromager", icon: "🧀", slug: "fromager", shortDescription: "Fabrique et affine les fromages", educationLevel: "CAP/BP" },
          { id: 11, title: "Chef cuisinier", icon: "👨‍🍳", slug: "chef-cuisinier", shortDescription: "Conçoit des plats et dirige une cuisine", educationLevel: "CAP/BTS" },
          { id: 12, title: "Sommelier", icon: "🍷", slug: "sommelier", shortDescription: "Expert en vins et accords mets-vins", educationLevel: "BP/BTS" }
        ],
        // Autres catégories...
        "agriculture-viticulture": [
          { id: 13, title: "Viticulteur", icon: "🍇", slug: "viticulteur", shortDescription: "Cultive la vigne et produit du vin", educationLevel: "CAP/BTS" },
          { id: 14, title: "Agriculteur", icon: "🌾", slug: "agriculteur", shortDescription: "Cultive des produits agricoles", educationLevel: "CAP/BTS" },
          { id: 15, title: "Maraîcher", icon: "🥕", slug: "maraicher", shortDescription: "Cultive des légumes", educationLevel: "CAP/BTS" },
          { id: 16, title: "Éleveur", icon: "🐄", slug: "eleveur", shortDescription: "S'occupe des animaux de ferme", educationLevel: "CAP/BTS" },
          { id: 17, title: "Œnologue", icon: "🍷", slug: "oenologue", shortDescription: "Expert en vin et sa fabrication", educationLevel: "Bac+5" },
          { id: 18, title: "Horticulteur", icon: "🌸", slug: "horticulteur", shortDescription: "Cultive des fleurs et plantes ornementales", educationLevel: "CAP/BTS" },
          { id: 19, title: "Paysagiste", icon: "🌳", slug: "paysagiste", shortDescription: "Conçoit et entretient les espaces verts", educationLevel: "CAP/BTS" }
        ]
      };
      
      // Récupérer les métiers de la catégorie sélectionnée ou un tableau vide si la catégorie n'existe pas
      this.jobs = jobsData[categorySlug] || [];
    }
  }
}
</script>

<style scoped>
/* Styles généraux */
.category-page-container {
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

/* Guide character */
.guide-character {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.guide-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 3px solid #FFC107;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.speech-bubble {
  position: relative;
  background-color: #FFF;
  border-radius: 15px;
  padding: 15px;
  margin-left: 15px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  max-width: 70%;
}

.speech-bubble:before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 10px 10px 10px 0;
  border-style: solid;
  border-color: transparent #FFF transparent transparent;
}

.speech-bubble p {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  line-height: 1.5;
}

/* En-tête de catégorie */
.category-header {
  text-align: center;
  margin: 30px 0 50px;
  padding: 40px 20px;
  background-color: #e8eaf6;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.category-icon-large {
  font-size: 5rem;
  margin-bottom: 15px;
  color: #3f51b5;
}

.category-title {
  font-size: 2.5rem;
  color: #3f51b5;
  margin-bottom: 15px;
}

.category-description {
  font-size: 1.3rem;
  color: #555;
  margin-bottom: 10px;
}

/* Grille des métiers */
.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin: 40px 0;
}

.job-card {
  background-color: white;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background-color: #e8eaf6;
}

.job-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #3f51b5;
}

.job-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.job-short-description {
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
  flex-grow: 1;
}

.job-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.education-level {
  background-color: #e0e0e0;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #555;
}

.view-details {
  color: #3f51b5;
  font-weight: bold;
  font-size: 0.9rem;
}

/* Boutons de navigation */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin: 40px 0 20px;
}

.nav-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 25px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  text-decoration: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.primary-button {
  background-color: #3f51b5;
  color: white;
}

.primary-button:hover {
  background-color: #303f9f;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.secondary-button {
  background-color: #FFF;
  color: #3f51b5;
  border: 2px solid #3f51b5;
}

.secondary-button:hover {
  background-color: #f5f5f5;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .navigation-buttons {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-button {
    width: 100%;
    justify-content: center;
  }
  
  .guide-character {
    flex-direction: column;
    text-align: center;
  }
  
  .speech-bubble {
    margin-left: 0;
    margin-top: 15px;
    max-width: 90%;
  }
  
  .speech-bubble:before {
    display: none;
  }
  
  .category-title {
    font-size: 2rem;
  }
  
  .category-description {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .jobs-grid {
    grid-template-columns: 1fr;
  }
  
  .category-header {
    padding: 30px 15px;
  }
}
</style>