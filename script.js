const myBoxes = document.getElementsByClassName("box");

let boxNumber = [...Array(129).keys()].slice(1); // Array [1, 2,...128]
let rand; //Random number from the array
let randBox; // The box id
let previousActive; 
let clicked = false;

function selectRandomNumber(randomArray) {
    if (previousActive) {
        previousActive.classList.remove("active-hover");
        previousActive.classList.remove("active");
    }

    rand = randomArray[Math.floor(Math.random() * randomArray.length)];
    randBox = document.getElementById(`box-${rand}`);
    
    if (randBox !== null) {
        randBox.classList.add("active");
        previousActive = randBox;
    } else {
        selectRandomNumber(randomArray); // Retry if box isn't found
    }

    console.log(rand);
}

function removeFromArray(randomArray, setBoxNumber) {
    const clickedIndex = randomArray.indexOf(rand);
    const boxesToHide = []; // To store the boxes that need to be hidden

    if (clickedIndex !== -1) {
        randomArray.splice(clickedIndex, 1); // Remove the clicked box

        if (setBoxNumber > 1) {
            // Pick multiple boxes but don't modify the array in this loop
            for (let l = 1; l <= setBoxNumber; l++) {
                rand = randomArray[Math.floor(Math.random() * randomArray.length)];
                randBox = document.getElementById(`box-${rand}`);
                
                if (randBox !== null) {
                    console.log(`Queuing box-${rand} to be hidden`);

                    boxesToHide.push(randBox); // Queue the box for hiding
                } else {
                    console.error(`Box with id 'box-${rand}' not found!`);
                }
            }
        }

        // Hide the queued boxes
        boxesToHide.forEach((box) => {
            box.classList.add("visibility");

            setTimeout(() => { 
                box.classList.add("visible");
            }, 500);  // Adjust the timeout to match animation
        }); 

        // After hiding, remove the hidden boxes from the array
        boxesToHide.forEach((box) => {
            const boxId = parseInt(box.id.split('-')[1]); // Extract the number from 'box-X'
            const index = randomArray.indexOf(boxId);
            if (index !== -1) {
                randomArray.splice(index, 1); // Remove box from array
            }
        });
    }
}

selectRandomNumber(boxNumber);

let multi = 0;
Array.from(myBoxes).forEach(myBox => {
    myBox.addEventListener("mouseover", event => {
        if (clicked) return; // Prevent interaction if a box has been clicked
        
        event.target.classList.add("hover");
        event.target.classList.remove("trail");

        if (event.target.classList.contains("active")) {
            event.target.classList.replace("hover", "active-hover");

            event.target.addEventListener("click", event => {
                if (clicked) return; // Only allow one click

                clicked = true; // Mark that a box has been clicked
                event.target.classList.add("visibility"); // Trigger hide animation

                setTimeout(() => { 
                    event.target.classList.add("visible"); // After animation, hide box
                }, 500); // Adjust based on animation duration

                // Update the multiplier logic
                if (multi === 0) {
                    multi += 1;
                } else {
                    multi *= 2;
                }

                removeFromArray(boxNumber, multi); // Hide other boxes based on multiplier
                console.log(`Number of multi: ${multi}`);
                
                // Reset clicked state after delay, and select next random box
                setTimeout(() => { 
                    clicked = false; 
                    selectRandomNumber(boxNumber); // Prepare for next box
                }, 1000);
            }, { once: true }); // Ensures the listener is fired once
        }
    });
});

Array.from(myBoxes).forEach(myBox => {
    myBox.addEventListener("mouseout", event => {
        event.target.classList.remove("hover");
        event.target.classList.add("trail");

        if (event.target.classList.contains("active-hover")) {
            event.target.classList.replace("active-hover", "active");
        }
    });
});

// Header animation logic
const head = document.getElementById("title");
const tip = document.getElementById("tip");

function move() {
    head.style.left = "-350px";
    tip.style.left = "0";
}

function move2(){
    tip.style.left = "-50px";
    head.style.left = "0";
}
