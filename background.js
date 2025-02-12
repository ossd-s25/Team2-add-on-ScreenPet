const MAX_FULLNESS = 30;
const DECREASE_INTERVAL = 5000;
let decreaseInterval;

console.log("background.js is running");

browser.storage.local.get('fullness').then(result => {
    updatePet(result.fullness || MAX_FULLNESS);
});

decreaseInterval = setInterval(decreaseFullness, DECREASE_INTERVAL);

function decreaseFullness() {
    browser.storage.local.get('fullness').then(result => {
        let fullness = result.fullness || MAX_FULLNESS;
        fullness = Math.max(5, fullness - 5); // Reduce fullness
        browser.storage.local.set({ fullness });

        console.log(`fullness decreased in background: ${fullness}`);
    });
}

function updatePet(fullness) {
    browser.storage.local.set({ fullness });
}
