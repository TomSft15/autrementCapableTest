<template>
  <div class="tinder-metiers-container">
    <!-- Animation de déblocage du badge -->
    <div v-if="showBadgeUnlockAnimation" class="badge-unlock-overlay">
      <div class="badge-unlock-animation">
        <div class="badge-icon">👷</div>
        <h2>Badge débloqué !</h2>
        <h3>{{ badgeData.name }}</h3>
        <p>{{ badgeData.description }}</p>
        <button @click="closeBadgeAnimation" class="close-animation-btn">Continuer</button>
      </div>
    </div>

    <!-- Header avec personnage guide -->
    <div class="guide-character" v-if="!gameStarted">
      <img src="@/assets/avatars/guide.png" alt="Guide" class="guide-avatar" />
      <div class="speech-bubble">
        <p>Bienvenue dans l'explorateur de métiers ! Découvre différents métiers qui pourraient t'intéresser et fais ton choix.</p>
      </div>
    </div>

    <div class="game-header">
      <h1 class="main-title">Explorateur de Métiers</h1>
      <p class="subtitle" v-if="!gameStarted">Découvre des métiers intéressants et trouve celui qui te correspond</p>
    </div>
    
    <!-- Écran d'accueil -->
    <div class="welcome-screen" v-if="!gameStarted">
      <div class="welcome-card">
        <div class="card-icon">👷</div>
        <h2>Comment ça marche ?</h2>
        <ol class="instructions-list">
          <li><span class="instruction-step">1</span> Découvre différents métiers qui te seront présentés</li>
          <li><span class="instruction-step">2</span> Pour chaque métier, indique s'il t'intéresse ou non</li>
          <li><span class="instruction-step">3</span> Explore de nouvelles possibilités et trouve ce qui te passionne !</li>
        </ol>
        <button @click="startGame" class="start-button">
          <span class="btn-icon">🎮</span>
          <span class="btn-text">Commencer l'exploration</span>
        </button>
      </div>
    </div>
    
    <!-- Zone de jeu principale -->
    <div class="game-playground" v-if="gameStarted && !showResults">
      <!-- Barre de progression -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          <div class="progress-text">{{ seenMetiers.length }} / {{ metiersData.length }} métiers explorés</div>
        </div>
      </div>
      
      <!-- Cartes de métiers -->
      <div class="metiers-cards-container">
        <transition-group name="card">
          <div v-for="(metier, index) in currentBatch" :key="metier.id" class="metier-card" 
               :style="{ zIndex: currentBatch.length - index, transform: `translateX(${index * 10}px) translateY(${-index * 10}px)` }">
            <div class="metier-card-inner">
              <div class="metier-icon">{{ metier.icon }}</div>
              <h2 class="metier-title">{{ metier.title }}</h2>
              <p class="metier-description">{{ metier.description }}</p>
              <div class="metier-details">
                <span class="education-level">{{ metier.educationLevel }}</span>
              </div>
            </div>
            
            <div class="metier-actions">
              <button @click="rejectMetier(metier)" class="action-button dislike-button">
                <span class="btn-icon">👎</span>
                <span class="btn-text">Pas intéressé</span>
              </button>
              <button @click="viewDetails(metier)" class="action-button info-button">
                <span class="btn-icon">🔍</span>
                <span class="btn-text">Plus d'infos</span>
              </button>
              <button @click="likeMetier(metier)" class="action-button like-button">
                <span class="btn-icon">👍</span>
                <span class="btn-text">Ça m'intéresse</span>
              </button>
            </div>
          </div>
        </transition-group>
        
        <!-- Message quand il n'y a plus de métiers à montrer -->
        <div v-if="currentBatch.length === 0 && !batchEnded" class="loading-indicator">
          <div class="loading-spinner"></div>
          <p>Chargement des métiers...</p>
        </div>
      </div>
      
      <!-- Message de fin de lot -->
      <div v-if="batchEnded" class="batch-end-message">
        <h3>Tu as exploré {{ currentBatchSize }} métiers !</h3>
        <p>Veux-tu découvrir d'autres métiers ?</p>
        <div class="batch-end-actions">
          <button @click="loadNextBatch" class="action-button continue-button">
            <span class="btn-icon">▶️</span>
            <span class="btn-text">Continuer</span>
          </button>
          <button @click="endExploration" class="action-button end-button">
            <span class="btn-icon">🏁</span>
            <span class="btn-text">Terminer</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Écran des résultats -->
    <div class="results-overlay" v-if="showResults">
      <div class="results-modal">
        <div class="results-header">
          <div class="results-title-container">
            <div class="results-title-icon">🏆</div>
            <h2 class="results-title">Exploration terminée !</h2>
          </div>
          <p class="results-subtitle">Voici un résumé de ton exploration de métiers</p>
        </div>
        
        <div class="results-statistics">
          <div class="stat-item">
            <div class="stat-value">{{ seenMetiers.length }}</div>
            <div class="stat-label">Métiers explorés</div>
          </div>
          
          <div class="stat-item">
            <div class="stat-value">{{ likedMetiers.length }}</div>
            <div class="stat-label">Métiers intéressants</div>
          </div>
        </div>
        
        <div class="liked-metiers-list" v-if="likedMetiers.length > 0">
          <h3>Les métiers qui t'intéressent :</h3>
          <div class="liked-metiers-grid">
            <div v-for="metier in likedMetiers" :key="metier.id" class="liked-metier-item">
              <div class="liked-metier-icon">{{ metier.icon }}</div>
              <div class="liked-metier-info">
                <h4>{{ metier.title }}</h4>
                <button @click="viewDetails(metier)" class="view-details-button">Voir les détails</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="no-liked-metiers" v-else>
          <p>Tu n'as pas encore trouvé de métier qui t'intéresse. N'hésite pas à explorer davantage !</p>
        </div>
        
        <div class="results-actions">
          <button @click="restartGame" class="action-button restart-button">
            <span class="btn-icon">🔄</span>
            <span class="btn-text">Recommencer</span>
          </button>
          <button @click="goToDashboard" class="action-button home-button">
            <span class="btn-icon">🏠</span>
            <span class="btn-text">Retour à l'accueil</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { unlockBadge, isBadgeUnlocked } from '@/utils/badges';

export default {
  name: 'JobsComponent',
  data() {
    return {
      gameStarted: false,
      showResults: false,
      batchEnded: false,
      currentBatchSize: 3,
      seenMetiers: [],
      likedMetiers: [],
      currentBatch: [],
      showBadgeUnlockAnimation: false,
      badgeApprenticeId: 7, // ID du badge Apprenti des métiers
      badgeData: {
        name: "Apprenti des métiers",
        description: "Bravo ! Tu as découvert au moins 3 métiers différents !"
      },
      // Configuration pour la redirection directe
      directRedirection: true, // Activer/désactiver la redirection directe
      directMetierRoute: 'SoudeurCard', // Route vers laquelle rediriger directement (ou mettre un nom de route aléatoire)
      // Données des métiers
      metiersData: [
        // Catégorie Technologies de l'information
        { 
          id: 1, 
          title: "Infographiste", 
          icon: "🎨", 
          slug: "infographiste", 
          description: "Crée des images, des graphiques et des visuels pour différents supports de communication.",
          educationLevel: "Bac+2/3",
          category: "technologies-information",
          videoUrl: "https://www.youtube.com/watch?v=mAmKJMyja34"
        },
        { 
          id: 2, 
          title: "Administrateur réseau", 
          icon: "🌐", 
          slug: "administrateur-reseau", 
          description: "Assure le bon fonctionnement, la sécurité et la maintenance des réseaux informatiques.",
          educationLevel: "Bac+2/3",
          category: "technologies-information",
          videoUrl: "https://www.youtube.com/watch?v=IqZOa5twOJM"
        },
        { 
          id: 3, 
          title: "Technicien télécoms et réseau", 
          icon: "📡", 
          slug: "technicien-telecoms-reseau", 
          description: "Installe, configure et maintient les équipements de télécommunication.",
          educationLevel: "Bac+2",
          category: "technologies-information",
          videoUrl: "https://www.youtube.com/watch?v=agbIb8eNtrI"
        },
        { 
          id: 4, 
          title: "Webdesigner", 
          icon: "💻", 
          slug: "webdesigner", 
          description: "Conçoit et réalise l'aspect visuel et ergonomique des sites web.",
          educationLevel: "Bac+2/3",
          category: "technologies-information",
          videoUrl: "https://www.youtube.com/watch?v=73Sff8gkwmQ"
        },
        // Catégorie Métiers de bouche
        { 
          id: 5, 
          title: "Cuisinier", 
          icon: "👨‍🍳", 
          slug: "cuisinier", 
          description: "Prépare et cuisine des plats en respectant les règles d'hygiène et de sécurité alimentaire.",
          educationLevel: "CAP/Bac Pro",
          category: "metiers-bouche",
          videoUrl: "https://www.youtube.com/watch?v=26PKwm1HhgY"
        },
        { 
          id: 6, 
          title: "Boucher", 
          icon: "🥩", 
          slug: "boucher", 
          description: "Prépare et vend des viandes et produits à base de viande.",
          educationLevel: "CAP/BP",
          category: "metiers-bouche",
          videoUrl: "https://www.youtube.com/watch?v=5JquaV9IeX8"
        },
        { 
          id: 7, 
          title: "Boulanger", 
          icon: "🍞", 
          slug: "boulanger", 
          description: "Fabrique et vend du pain, des viennoiseries et autres produits de boulangerie.",
          educationLevel: "CAP/BP",
          category: "metiers-bouche",
          videoUrl: "http://youtube.com/watch?v=dWsyghFicjc"
        },
        // Catégorie Agriculture et viticulture
        { 
          id: 8, 
          title: "Ingénieur R&D en agroéquipement", 
          icon: "🔬", 
          slug: "ingenieur-rd-agroequipement", 
          description: "Conçoit et développe des équipements agricoles innovants.",
          educationLevel: "Bac+5",
          category: "agriculture-viticulture",
          videoUrl: "https://www.youtube.com/watch?v=3XP1XtVGvCs"
        },
        { 
          id: 9, 
          title: "Conducteur de machines agricoles", 
          icon: "🚜", 
          slug: "conducteur-machines-agricoles", 
          description: "Conduit et entretient différents types de machines agricoles.",
          educationLevel: "CAP/Bac Pro",
          category: "agriculture-viticulture",
          videoUrl: "https://www.youtube.com/watch?v=sQMlEIukhpU"
        },
        { 
          id: 10, 
          title: "Horticulteur", 
          icon: "🌸", 
          slug: "horticulteur", 
          description: "Cultive des plantes ornementales, des légumes et des fruits.",
          educationLevel: "CAP/BTS",
          category: "agriculture-viticulture",
          videoUrl: "https://www.youtube.com/watch?v=So33sgmemU4"
        },
        // Ajouter d'autres métiers selon les besoins...
        { 
          id: 11, 
          title: "Jardinier-Paysagiste", 
          icon: "🌳", 
          slug: "jardinier-paysagiste", 
          description: "Crée, aménage et entretient les espaces verts et jardins.",
          educationLevel: "CAP/BP",
          category: "agriculture-viticulture",
          videoUrl: "https://www.youtube.com/watch?v=39YqeU_w7FE"
        },
        { 
          id: 12, 
          title: "Tapissier d'ameublement", 
          icon: "🛋️", 
          slug: "tapissier-ameublement", 
          description: "Réalise ou restaure des garnitures et habillages de sièges et de mobilier.",
          educationLevel: "CAP/BP",
          category: "metiers-art-artisanat",
          videoUrl: "https://www.youtube.com/watch?v=2haY75ERpQA"
        },
        { 
          id: 13, 
          title: "Prothésiste dentaire", 
          icon: "🦷", 
          slug: "prothesiste-dentaire", 
          description: "Conçoit et fabrique des prothèses dentaires sur prescription des dentistes.",
          educationLevel: "Bac+2",
          category: "sante-soins",
          videoUrl: "https://www.youtube.com/watch?v=ZU3PlV3SDgI"
        },
        { 
          id: 14, 
          title: "Mécatronicien", 
          icon: "🤖", 
          slug: "mecatronicien", 
          description: "Conçoit et maintient des systèmes associant mécanique, électronique et informatique.",
          educationLevel: "Bac+2/5",
          category: "mecanique-maintenance",
          videoUrl: "https://www.youtube.com/watch?v=7QiR2IIQKnY"
        },
        { 
          id: 15, 
          title: "Tailleur-couturier", 
          icon: "👔", 
          slug: "tailleur-couturier", 
          description: "Crée, fabrique ou répare des vêtements sur mesure.",
          educationLevel: "CAP/BP",
          category: "metiers-art-artisanat",
          videoUrl: "https://www.youtube.com/watch?v=UkI3RaaPSBQ"
        },
        {
          id: 16,
          title: "Soudeur",
          icon: "🔥",
          slug: "soudeur",
          description: "Assemble par fusion ou par apport de métal les différents éléments métalliques pour créer des structures.",
          educationLevel: "CAP/Bac Pro",
          category: "industrie",
          videoUrl: "/videos/Soudeur_Soudeuse.mp4"
        }
      ]
    };
  },
  computed: {
    // Pourcentage de progression
    progressPercentage() {
      return (this.seenMetiers.length / this.metiersData.length) * 100;
    },
    // Liste des routes disponibles pour la redirection aléatoire
    availableMetierRoutes() {
      return ['SoudeurCard', 'JardinerCard', 'CoiffeurCard'];
    },
    // Route aléatoire sélectionnée
    randomMetierRoute() {
      const randomIndex = Math.floor(Math.random() * this.availableMetierRoutes.length);
      return this.availableMetierRoutes[randomIndex];
    }
  },
  mounted() {
    // Charger les métiers déjà vus depuis le localStorage
    this.loadSeenMetiers();
    this.loadLikedMetiers();
  },
  methods: {
    // Démarrer le jeu
    startGame() {
      // Si la redirection directe est activée, rediriger vers la fiche métier
      if (this.directRedirection) {
        // Rediriger directement vers une fiche métier spécifique ou aléatoire
        if (this.directMetierRoute === 'random') {
          this.$router.push({ name: this.randomMetierRoute });
        } else {
          this.$router.push({ name: this.directMetierRoute });
        }
        return;
      }
      
      // Sinon, continuer avec le comportement normal
      this.gameStarted = true;
      this.loadNextBatch();
    },
    
    // Charger le prochain lot de métiers
    loadNextBatch() {
      this.batchEnded = false;
      this.currentBatch = [];
      
      // Filtrer les métiers qui n'ont pas encore été vus
      const unseenMetiers = this.metiersData.filter(
        metier => !this.seenMetiers.some(seen => seen.id === metier.id)
      );
      
      // Si tous les métiers ont été vus, afficher les résultats
      if (unseenMetiers.length === 0) {
        this.showResults = true;
        return;
      }
      
      // Sélectionner aléatoirement un lot de métiers
      const batchSize = Math.min(this.currentBatchSize, unseenMetiers.length);
      const selectedMetiers = [];
      
      // Sélection aléatoire sans remise
      const availableIndices = Array.from({ length: unseenMetiers.length }, (_, i) => i);
      
      for (let i = 0; i < batchSize; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const metierIndex = availableIndices.splice(randomIndex, 1)[0];
        selectedMetiers.push(unseenMetiers[metierIndex]);
      }
      
      this.currentBatch = selectedMetiers;
    },
    
    // Marquer un métier comme "aimé"
    likeMetier(metier) {
      // Ajouter aux métiers vus
      if (!this.seenMetiers.some(seen => seen.id === metier.id)) {
        this.seenMetiers.push(metier);
        this.saveSeenMetiers();
      }
      
      // Ajouter aux métiers aimés
      if (!this.likedMetiers.some(liked => liked.id === metier.id)) {
        this.likedMetiers.push(metier);
        this.saveLikedMetiers();
      }
      
      // Retirer de la liste actuelle
      this.removeMetierFromBatch(metier);
      
      // Vérifier si le badge peut être débloqué
      this.checkBadgeUnlock();
    },
    
    // Marquer un métier comme "pas intéressé"
    rejectMetier(metier) {
      // Ajouter uniquement aux métiers vus
      if (!this.seenMetiers.some(seen => seen.id === metier.id)) {
        this.seenMetiers.push(metier);
        this.saveSeenMetiers();
      }
      
      // Retirer de la liste actuelle
      this.removeMetierFromBatch(metier);
      
      // Vérifier si le badge peut être débloqué
      this.checkBadgeUnlock();
    },
    
    // Voir les détails d'un métier
    viewDetails(metier) {
      // Rediriger vers la page détaillée du métier
      if (metier.slug === 'soudeur') {
        this.$router.push({ name: 'SoudeurCard' });
      } else if (metier.slug === 'jardinier-paysagiste') {
        this.$router.push({ name: 'JardinerCard' });
      } else if (metier.slug === 'coiffeur') {
        this.$router.push({ name: 'CoiffeurCard' });
      } else {
        this.$router.push(`/metier/${metier.slug}`);
      }
    },
    
    // Retirer un métier du lot actuel
    removeMetierFromBatch(metier) {
      const index = this.currentBatch.findIndex(m => m.id === metier.id);
      if (index !== -1) {
        this.currentBatch.splice(index, 1);
      }
      
      // Si le lot est vide, afficher le message de fin de lot
      if (this.currentBatch.length === 0) {
        this.batchEnded = true;
      }
    },
    
    // Terminer l'exploration
    endExploration() {
      this.showResults = true;
    },
    
    // Redémarrer le jeu
    restartGame() {
      this.seenMetiers = [];
      this.saveSeenMetiers();
      this.gameStarted = false;
      this.showResults = false;
      this.batchEnded = false;
    },
    
    // Retour au tableau de bord
    goToDashboard() {
      this.$router.push('/dashboard');
    },
    
    // Sauvegarder les métiers vus
    saveSeenMetiers() {
      // Stocker uniquement les IDs pour économiser de l'espace
      const seenIds = this.seenMetiers.map(metier => metier.id);
      localStorage.setItem('seen-metiers', JSON.stringify(seenIds));
    },
    
    // Charger les métiers vus
    loadSeenMetiers() {
      const savedIds = localStorage.getItem('seen-metiers');
      if (savedIds) {
        try {
          const ids = JSON.parse(savedIds);
          this.seenMetiers = ids.map(id => 
            this.metiersData.find(metier => metier.id === id)
          ).filter(Boolean); // Filtrer les valeurs null/undefined
        } catch (error) {
          console.error('Erreur lors du chargement des métiers vus:', error);
        }
      }
    },
    
    // Sauvegarder les métiers aimés
    saveLikedMetiers() {
      // Stocker uniquement les IDs pour économiser de l'espace
      const likedIds = this.likedMetiers.map(metier => metier.id);
      localStorage.setItem('liked-metiers', JSON.stringify(likedIds));
    },
    
    // Charger les métiers aimés
    loadLikedMetiers() {
      const savedIds = localStorage.getItem('liked-metiers');
      if (savedIds) {
        try {
          const ids = JSON.parse(savedIds);
          this.likedMetiers = ids.map(id => 
            this.metiersData.find(metier => metier.id === id)
          ).filter(Boolean); // Filtrer les valeurs null/undefined
        } catch (error) {
          console.error('Erreur lors du chargement des métiers aimés:', error);
        }
      }
    },
    
    // Vérifier si le badge peut être débloqué
    checkBadgeUnlock() {
      // Débloquer le badge si l'utilisateur a vu au moins 3 métiers
      if (this.seenMetiers.length >= 3 && !isBadgeUnlocked(this.badgeApprenticeId)) {
        const badgeUnlocked = unlockBadge(this.badgeApprenticeId);
        if (badgeUnlocked) {
          setTimeout(() => {
            this.showBadgeUnlockAnimation = true;
          }, 500);
        }
      }
    },
    
    // Fermer l'animation du badge
    closeBadgeAnimation() {
      this.showBadgeUnlockAnimation = false;
    }
  }
};
</script>

<style scoped>
/* Tous les styles CSS restent identiques, pas besoin de les modifier */
/* Base Styles */
.tinder-metiers-container {
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
  min-height: 100vh;
}

/* Game Header */
.game-header {
  text-align: center;
  margin-bottom: 30px;
}

.main-title {
  font-size: 2.5rem;
  color: #FF9800; /* Orange pour le thème des métiers */
  margin-bottom: 10px;
  text-align: center;
  position: relative;
  padding-bottom: 10px;
}

.main-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background-color: #4CAF50;
  border-radius: 2px;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

/* Guide Character */
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

/* Animation du badge débloqué */
.badge-unlock-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  animation: fadeIn 0.5s ease-out;
}

.badge-unlock-animation {
  background-color: #fff;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 0 30px rgba(255, 152, 0, 0.6); /* Couleur orange pour le thème des métiers */
  animation: scaleIn 0.5s ease-out;
}

.badge-unlock-animation .badge-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
  color: #FF9800; /* Orange pour le thème des métiers */
}

.badge-unlock-animation h2 {
  color: #FF9800;
  font-size: 2rem;
  margin-bottom: 10px;
}

.badge-unlock-animation h3 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.badge-unlock-animation p {
  color: #666;
  margin-bottom: 20px;
}

.close-animation-btn {
  background-color: #FF9800;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-animation-btn:hover {
  background-color: #F57C00;
  transform: scale(1.05);
}

/* Welcome Screen */
.welcome-screen {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  align-items: center;
  margin: 40px 0;
}

.welcome-card {
  flex: 1;
  min-width: 300px;
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #FF9800;
}

.welcome-card h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
}

.instructions-list {
  text-align: left;
  padding-left: 10px;
  margin-bottom: 30px;
}

.instructions-list li {
  margin-bottom: 15px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 15px;
}

.instruction-step {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: #FF9800;
  color: white;
  border-radius: 50%;
  flex-shrink: 0;
}

.start-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.start-button:hover {
  background-color: #388E3C;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.btn-icon {
  font-size: 1.3rem;
}

/* Game Playground */
.game-playground {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

/* Progress Bar */
.progress-container {
  width: 100%;
  max-width: 600px;
  margin-bottom: 30px;
}

.progress-bar {
  height: 20px;
  background-color: #E0E0E0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-size: 0.9rem;
  font-weight: bold;
}

/* Métiers Cards */
.metiers-cards-container {
  width: 100%;
  max-width: 500px;
  min-height: 350px;
  position: relative;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.metier-card {
  position: absolute;
  width: 100%;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.metier-card-inner {
  padding: 30px;
  text-align: center;
}

.metier-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #FF9800;
}

.metier-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
}

.metier-description {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 20px;
  line-height: 1.6;
}

.metier-details {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.education-level {
  background-color: #E3F2FD;
  color: #2196F3;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

/* Card Actions */
.metier-actions {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  background-color: #F5F5F5;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button .btn-icon {
  font-size: 1.5rem;
}

.dislike-button {
  background-color: #FFEBEE;
  color: #F44336;
}

.dislike-button:hover {
  background-color: #FFCDD2;
}

.like-button {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.like-button:hover {
  background-color: #C8E6C9;
}

.info-button {
  background-color: #E3F2FD;
  color: #2196F3;
}

.info-button:hover {
  background-color: #BBDEFB;
}

/* Card Animation */
.card-enter-active, .card-leave-active {
  transition: all 0.5s;
}

.card-enter-from, .card-leave-to {
  opacity: 0;
  transform: translateX(30px) translateY(-10px) rotate(10deg);
}

/* Loading Indicator */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #E0E0E0;
  border-top: 5px solid #FF9800;
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 15px;
}

.loading-indicator p {
  color: #666;
  font-size: 1.1rem;
}

/* Batch End Message */
.batch-end-message {
  text-align: center;
  padding: 30px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.batch-end-message h3 {
  font-size: 1.5rem;
  color: #FF9800;
  margin-bottom: 15px;
}

.batch-end-message p {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 20px;
}

.batch-end-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.continue-button {
  background-color: #4CAF50;
  color: white;
  padding: 12px 25px;
}

.continue-button:hover {
  background-color: #388E3C;
}

.end-button {
  background-color: #FF9800;
  color: white;
  padding: 12px 25px;
}

.end-button:hover {
  background-color: #F57C00;
}

/* Results Overlay */
.results-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease-out;
}

.results-modal {
  background-color: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.5s ease-out;
}

.results-header {
  text-align: center;
  margin-bottom: 30px;
}

.results-title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

.results-title-icon {
  font-size: 2.5rem;
  color: #FF9800;
}

.results-title {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.results-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

/* Results Statistics */
.results-statistics {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #FF9800;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 1.1rem;
  color: #666;
}

/* Liked Métiers List */
.liked-metiers-list {
  margin-bottom: 30px;
}

.liked-metiers-list h3 {
  font-size: 1.5rem;
  color: #4CAF50;
  margin-bottom: 20px;
  text-align: center;
}

.liked-metiers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.liked-metier-item {
  display: flex;
  align-items: center;
  background-color: #F5F5F5;
  border-radius: 15px;
  padding: 15px;
  transition: all 0.3s ease;
}

.liked-metier-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.liked-metier-icon {
  font-size: 2rem;
  margin-right: 15px;
  color: #FF9800;
}

.liked-metier-info {
  flex: 1;
}

.liked-metier-info h4 {
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 8px 0;
}

.view-details-button {
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-details-button:hover {
  background-color: #1976D2;
}

.no-liked-metiers {
  text-align: center;
  padding: 30px;
  background-color: #F5F5F5;
  border-radius: 15px;
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

/* Results Actions */
.results-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.restart-button {
  background-color: #FF9800;
  color: white;
  padding: 12px 25px;
}

.restart-button:hover {
  background-color: #F57C00;
}

.home-button {
  background-color: #9C27B0;
  color: white;
  padding: 12px 25px;
}

.home-button:hover {
  background-color: #7B1FA2;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .results-statistics {
    flex-direction: column;
    gap: 20px;
  }
  
  .batch-end-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .metier-card-inner {
    padding: 20px;
  }
  
  .metier-actions {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .action-button {
    flex: 1 0 40%;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .results-modal {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .instructions-list li {
    gap: 10px;
  }
  
  .liked-metiers-grid {
    grid-template-columns: 1fr;
  }
  
  .results-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .action-button {
    width: 100%;
  }
  
  .speech-bubble {
    max-width: 100%;
  }
}
</style>