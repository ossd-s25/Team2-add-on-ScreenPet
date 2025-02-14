const MAX_FULLNESS = 30;
const MIN_FULLNESS = 15;
const DEFAULT_DECREASE_INTERVAL = 5000;

console.log("background.js is running");

browser.runtime.onInstalled.addListener(() => {
    //alarm to trigger every 15 sec to keep the background script from going idle
    browser.alarms.create('intervalAlarm', { periodInMinutes: 0.25 });
});
//listen for alarm
browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'intervalAlarm') {
        console.log("15 seconds passed, keeping background alive");
    }
});

browser.storage.local.get('fullness').then(result => {
    updatePet(result.fullness || MAX_FULLNESS);
});

//initialize decreaseInterval Scheduler
let decreaseInterval;
browser.storage.local.get('decreaseInterval').then(result => {
    let decreaseTime = result.decreaseInterval || DEFAULT_DECREASE_INTERVAL;
    decreaseInterval = setInterval(decreaseFullness, decreaseTime);
    console.log("Interval timer set to decrease fullness every " + (decreaseTime / 1000) + " seconds.");
});

//decreasing fullness
function decreaseFullness() {
    browser.storage.local.get('fullness').then(result => {
        let fullness = Math.min(result.fullness, MAX_FULLNESS);
        currentFullness = Math.max(MIN_FULLNESS, fullness - 5); // Reduce fullness
        browser.storage.local.set({ fullness: currentFullness });
        console.log(`fullness decreased in background: ${currentFullness}`);
    });
}

//update stored fullness value
function updatePet(fullness) {
    browser.storage.local.set({ fullness });
}

//listen for user's time choice
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "resetInterval") {
        clearInterval(decreaseInterval); //erase old interval
        browser.storage.local.get('decreaseInterval').then(result => {
            decreaseTime = result.decreaseInterval || DEFAULT_DECREASE_INTERVAL;
            decreaseInterval = setInterval(decreaseFullness, decreaseTime);
            console.log("Interval timer re-intialized to new seconds value:", result.decreaseInterval);
        });
    }
    return Promise.resolve();
});