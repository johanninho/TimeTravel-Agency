// --- INITIALISATION DES LIBRAIRIES ---
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        once: true,
        offset: 100,
        duration: 800,
        easing: 'ease-out-cubic',
    });
});

// --- NAVBAR SCROLL EFFECT ---
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-gray-900/95', 'backdrop-blur-md', 'shadow-lg');
        navbar.classList.remove('py-4');
        navbar.classList.add('py-2');
    } else {
        navbar.classList.remove('bg-gray-900/95', 'backdrop-blur-md', 'shadow-lg');
        navbar.classList.add('py-4');
        navbar.classList.remove('py-2');
    }
});

// --- SYSTÈME DE MODALE DE RÉSERVATION & VALIDATION ---
const modal = document.getElementById('booking-modal');
const closeModalBtn = document.getElementById('close-modal');
const overlay = document.getElementById('modal-overlay');
const confirmBtn = document.getElementById('confirm-booking');
const feedback = document.getElementById('form-feedback');
const destinationSelect = document.getElementById('destination-select');

// Inputs du formulaire
const dateInput = document.getElementById('date-input');
const emailInput = document.getElementById('email-input');
const travelersInput = document.getElementById('travelers-input');
const dateError = document.getElementById('date-error');
const emailError = document.getElementById('email-error');

// Fonction d'ouverture
window.openBooking = function() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Fonction de fermeture et reset
function closeBooking() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';

    // Reset complet
    feedback.classList.add('hidden');
    confirmBtn.innerHTML = 'Valider le saut';
    confirmBtn.disabled = false;

    // Enlever les erreurs visuelles
    [dateInput, emailInput, travelersInput].forEach(el => {
        el.classList.remove('border-red-500', 'ring-2', 'ring-red-500');
    });
    dateError.classList.add('hidden');
    emailError.classList.add('hidden');
}

closeModalBtn.addEventListener('click', closeBooking);
overlay.addEventListener('click', closeBooking);

// Validation Regex simple pour email
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

// Logique de validation et soumission
confirmBtn.addEventListener('click', () => {
    let isValid = true;

    // Reset des styles d'erreur
    dateInput.classList.remove('border-red-500', 'ring-2', 'ring-red-500');
    emailInput.classList.remove('border-red-500', 'ring-2', 'ring-red-500');
    dateError.classList.add('hidden');
    emailError.classList.add('hidden');

    // Vérification Date (Ne pas être vide)
    if(!dateInput.value) {
        dateInput.classList.add('border-red-500', 'ring-2', 'ring-red-500');
        dateError.classList.remove('hidden');
        isValid = false;
    }

    // Vérification Email (Regex)
    if(!emailInput.value || !validateEmail(emailInput.value)) {
        emailInput.classList.add('border-red-500', 'ring-2', 'ring-red-500');
        emailError.classList.remove('hidden');
        isValid = false;
    }

    // Vérification Voyageurs
    if(travelersInput.value < 1 || travelersInput.value > 5) {
        alert("Le nombre de voyageurs doit être compris entre 1 et 5.");
        isValid = false;
    }

    // Si tout est valide, on procède
    if(isValid) {
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Initialisation...';
        confirmBtn.disabled = true;

        setTimeout(() => {
            feedback.classList.remove('hidden');

            setTimeout(() => {
                closeBooking();
                alert(`Voyage confirmé pour ${destinationSelect.value} le ${dateInput.value} ! Vos billets ont été envoyés à ${emailInput.value}.`);
            }, 1500);
        }, 1500);
    }
});


// --- INTELLIGENCE ARTIFICIELLE (CHATBOT) ---

const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    if(!chatWindow.classList.contains('hidden')) {
        setTimeout(() => chatInput.focus(), 100);
    }
});

chatClose.addEventListener('click', () => chatWindow.classList.add('hidden'));

function addMessage(text, sender) {
    const div = document.createElement('div');
    const isUser = sender === 'user';

    div.className = `max-w-[85%] p-3 rounded-xl mb-2 text-sm message-anim shadow-sm ${
        isUser
            ? 'bg-yellow-500 text-gray-900 self-end rounded-tr-none ml-auto font-medium'
            : 'bg-gray-100 text-gray-800 self-start rounded-tl-none border border-gray-200'
    }`;

    div.innerHTML = text;

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

const knowledgeBase = {
    "paris": "<b>Paris 1889</b> est notre destination romantique ❤️.<br>C'est l'Exposition Universelle !<br>💰 <i>Prix :</i> 2500€<br>👗 <i>Tenue :</i> Robes à tournure et hauts-de-forme fournis.",
    "crétacé": "<b>Le Crétacé</b> est réservé aux aventuriers 🦕.<br>Vous verrez des T-Rex en toute sécurité depuis nos pods blindés.<br>💰 <i>Prix :</i> 4000€ (Assurance vie incluse).",
    "florence": "<b>Florence 1504</b> est sublime 🎨.<br>Rencontrez Léonard de Vinci et Michel-Ange.<br>💰 <i>Prix :</i> 3200€.",
    "securite": "Pas d'inquiétude ! Notre protocole <b>Zero-Paradoxe</b> vous empêche d'interagir avec vos ancêtres. En cas de danger, le retour est instantané.",
    "prix": "Nos voyages débutent à 2500€. Le Crétacé est le plus cher (4000€) en raison de la complexité logistique.",
    "reservation": "Cliquez simplement sur le bouton <b>Réserver</b> jaune en haut à droite pour choisir vos dates !",
    "bonjour": "Bonjour voyageur ! Quelle époque vous fait rêver aujourd'hui ?",
    "default": "Je suis Chronos, l'IA de l'agence. Je peux vous parler de <b>Paris</b>, du <b>Crétacé</b>, de <b>Florence</b>, ou de nos protocoles de <b>sécurité</b>."
};

function getBotResponse(input) {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('paris') || lowerInput.includes('1889') || lowerInput.includes('france')) return knowledgeBase['paris'];
    if (lowerInput.includes('crétacé') || lowerInput.includes('dino') || lowerInput.includes('jurassic')) return knowledgeBase['crétacé'];
    if (lowerInput.includes('florence') || lowerInput.includes('italie') || lowerInput.includes('art')) return knowledgeBase['florence'];
    if (lowerInput.includes('securite') || lowerInput.includes('danger') || lowerInput.includes('risque') || lowerInput.includes('peur')) return knowledgeBase['securite'];
    if (lowerInput.includes('prix') || lowerInput.includes('tarif') || lowerInput.includes('combien')) return knowledgeBase['prix'];
    if (lowerInput.includes('reserver') || lowerInput.includes('date') || lowerInput.includes('acheter')) return knowledgeBase['reservation'];
    if (lowerInput.includes('bonjour') || lowerInput.includes('salut') || lowerInput.includes('hello')) return knowledgeBase['bonjour'];

    return knowledgeBase['default'];
}

function handleSend() {
    const text = chatInput.value.trim();
    if (text) {
        addMessage(text, 'user');
        chatInput.value = '';

        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.className = "text-gray-400 text-xs ml-2 mb-2 italic flex items-center gap-1";
        loadingDiv.innerHTML = '<span>Chronos écrit</span> <span class="animate-pulse">...</span>';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            document.getElementById(loadingId).remove();
            const response = getBotResponse(text);
            addMessage(response, 'bot');
        }, 1000 + Math.random() * 500);
    }
}

chatSend.addEventListener('click', handleSend);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});

window.openChat = function(topic) {
    chatWindow.classList.remove('hidden');
    addMessage(`Dites-m'en plus sur ${topic}.`, 'user');

    setTimeout(() => {
        const response = getBotResponse(topic);
        addMessage(response, 'bot');
    }, 1000);
};