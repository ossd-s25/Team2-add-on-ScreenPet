document.addEventListener("DOMContentLoaded", function(){
    const petImage = document.getElementById("pet");
    const statusText = document.getElementById("status");
    const feedButton = this.documentElementById("feed");

    const petStates={
        hungry:{
            img:"assets/images/cat_hungry_100x100.png"
            text: "Your pet is hungry!"
        },
        full:{
            img:"assets/images/cat_full_100x100.png"
            text: "Your pet is full!"
        },
        happy:{
            img:"assets/images/cat_full_100x100.png"
            text: "Your pet is happy!"
        }
    };

    chrome.storage.local.get(["petMood","lastFed"], function(result){
        const currentTime = Date.now();
        const lastFedTime = result.lastFed || 0;
        const timeSinceFed = (currentTime - lastFedTime)/1000;

        if (timeSinceFed >= 1200){
            updatePet("hungry");
        } else{
            updatePet(result.petMood || "hungry");
            setTimeout(() => updatePet("hungry"),(1200 - timeSinceFed)*1000);
        }
    });

    function updatePet(mood){
        petImage.src = petStates[mood].img;
        statusText.textContent = petStates[mood].text;
        chrome.storage.local.set({petMood:mood});

        if (mood == "full"){
            const fedTime = Date.now();
            chrome.storage.local.set({lastFed:fedTime});

            setTimeout(() => updatePet("hungry"), 1200 * 1000);
        }
    }

    feedButton.addEventListener("click", function(){
        updatePet("full");
    })
});