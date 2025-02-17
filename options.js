document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submitButton").addEventListener("click", function () {
        let inputValue = document.getElementById("userInput").value;
        let message = document.getElementById("confirmationMessage");

        if (isNaN(inputValue) || inputValue.trim() === "") {
            message.style.color = "red";
            message.textContent = "Please enter a number!";
        } else {
            message.style.color = "rgb(23, 129, 211)";
            message.textContent = "Your pet will get hungry after " + inputValue + " seconds.";
            browser.storage.local.set({ decreaseInterval: (parseInt(inputValue) * 1000 / 3) }).then( (result) => {
                console.log("Seconds value set in storage to",(parseInt(inputValue) * 1000 / 3));

                browser.runtime.sendMessage({ action: "resetInterval" }).catch(error => {
                        console.error("Error sending message:", error);
                    });
                }
            );
        }
    });
});
