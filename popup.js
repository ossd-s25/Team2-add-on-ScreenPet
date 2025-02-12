const MAX_FULLNESS = 30;
const MIN_FULLNESS = 15;
const DECREASE_FULLNESS_BY = 5;
const INCREASE_FULLNESS_BY = 5;
const DECREASE_INTERVAL = 5000; // 5 seconds in milliseconds


const catStates = {
    hungry: {
        img: "assets/images/cat/cat_hungry.png",
        text: "Your cat is hungry!"
    },
    full: {
        img: "assets/images/cat/cat_full.png",
        text: "Your cat is too full!"
    },
    happy: {
        img: "assets/images/cat/cat_happy.png",
        text: "Your cat is happy!"
    }
};

const pandaStates = {
    hungry: {
        img: "assets/images/panda/panda_hungry.png",
        text: "Your panda is hungry!"
    },
    full: {
        img: "assets/images/panda/panda_full.png",
        text: "Your panda is too full!"
    },
    happy: {
        img: "assets/images/panda/panda_happy.png",
        text: "Your panda is happy!"
    }
};

function setBodyClassForPet(chosenPet) {
    document.body.classList.remove("cat", "panda");
    document.body.classList.add(chosenPet);
}

// choose correct image set based on "cat" or "panda"
function getPetStates(chosenPet) {
    return chosenPet === 'panda' ? pandaStates : catStates;
}

let decreaseInterval;

document.addEventListener('DOMContentLoaded', () => {
    const feedButton = document.getElementById('feed');
    const petSelect = document.getElementById('petSelect');

   
    browser.storage.local.get(['chosenPet', 'fullness']).then(result => {
        // If no chosen pet, default to "cat"
        const chosenPet = result.chosenPet || 'cat';
        petSelect.value = chosenPet;

        
        let currentFullness = result.fullness;
        if (currentFullness === undefined) {
            currentFullness = MAX_FULLNESS / 2;
            browser.storage.local.set({ fullness: currentFullness });
        }

        
        updatePet(currentFullness);
    });

    
    decreaseInterval = setInterval(decreaseFullness, DECREASE_INTERVAL);

    
    petSelect.addEventListener('change', () => {
        const newPet = petSelect.value;
        
        browser.storage.local.set({ chosenPet: newPet });

        
        browser.storage.local.get('fullness').then(result => {
            const fullness = result.fullness || (MAX_FULLNESS / 2);
            updatePet(fullness);
        });
    });

    
    if (feedButton) {
        feedButton.addEventListener('click', feed);
    }
});

function updatePet(fullness) {
    const petImage = document.getElementById("pet");
    const statusText = document.getElementById("status");

    
    let mood = "happy";
    if (fullness <= MIN_FULLNESS) {
        mood = "hungry";
    } else if (fullness >= MAX_FULLNESS) {
        mood = "full";
    }

    
    browser.storage.local.get('chosenPet').then(result => {
        const chosenPet = result.chosenPet || 'cat';
        setBodyClassForPet(chosenPet)
        const petStates = getPetStates(chosenPet);

        petImage.src = petStates[mood].img;
        statusText.textContent = petStates[mood].text;
    });
}

function decreaseFullness() {
    browser.storage.local.get('fullness').then(result => {
        let currentFullness = result.fullness || MAX_FULLNESS;
        currentFullness = Math.max(MIN_FULLNESS, currentFullness - DECREASE_FULLNESS_BY);

        browser.storage.local.set({ fullness: currentFullness });
        updatePet(currentFullness);
    });
}

function feed() {
    browser.storage.local.get('fullness').then(result => {
        let currentFullness = result.fullness || (MAX_FULLNESS / 2);
        currentFullness = Math.min(MAX_FULLNESS, currentFullness + INCREASE_FULLNESS_BY);

        browser.storage.local.set({ fullness: currentFullness });
        updatePet(currentFullness);
    });
}




