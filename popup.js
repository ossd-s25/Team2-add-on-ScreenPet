const MAX_FULLNESS = 30;
const MIN_FULLNESS = 0;
const DECREASE_FULLNESS_BY = 5;
const INCREASE_FULLNESS_BY = 5;
const DECREASE_INTERVAL = 5000; // 5 seconds in milliseconds

const petStates={
    hungry:{
        img:"assets/images/cat/cat_hungry.png",
        text: "Your pet is hungry!"
    },
    full:{
        img:"assets/images/cat/cat_full.png",
        text: "Your pet is full!"
    },
    happy:{
        img:"assets/images/cat/cat_happy.png",
        text: "Your pet is happy!"
    }
};

browser.storage.local.get('fullness').then(result => {
    if (result.fullness === undefined) {
        browser.storage.local.set({ fullness: MAX_FULLNESS / 2 });
    }
});

function updatePet(fullness) {
    const petImage = document.getElementById("pet");
    const statusText = document.getElementById("status");

    console.log(petImage);
    console.log("updating pet", fullness);
    let mood = "happy"
    if (fullness <= MIN_FULLNESS) {
        mood = "hungry";
    }
    else if (fullness >= MAX_FULLNESS) {
        mood = "full";
    }

    petImage.src = petStates[mood].img;
    statusText.textContent = petStates[mood].text;
}

function decreaseFullness() {
    browser.storage.local.get('fullness').then(result => {
        let updatedFullness = Math.max(MIN_FULLNESS, result.fullness - DECREASE_FULLNESS_BY);
        browser.storage.local.set({ fullness: updatedFullness });
        updatePet(updatedFullness);
    });
}

function feed() {
    browser.storage.local.get('fullness').then(result => {
        let updatedFullness = Math.min(MAX_FULLNESS, result.fullness + INCREASE_FULLNESS_BY);
        browser.storage.local.set({ fullness: updatedFullness });
        updatePet(updatedFullness);
    });
}



// interval to decrease fullness
let decreaseInterval;
document.addEventListener('DOMContentLoaded', () => {
    const feedButton = document.getElementById('feed');

    browser.storage.local.get('fullness').then(result => {
        updatePet(result.fullness || MAX_FULLNESS);
    });

    decreaseInterval = setInterval(decreaseFullness, DECREASE_INTERVAL);

    if (feedButton) {
        feedButton.addEventListener('click', feed);
    }
});