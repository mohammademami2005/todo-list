const ul = document.querySelector("#trashUl")
let myData = JSON.parse(localStorage.getItem("tasksList")) || [];


let trashContainer = JSON.parse(localStorage.getItem("trash")) || [];


export function trash() {

    if (trashContainer.length === 0) {
        ul.textContent = "trash is empty"
        ul.classList.add("flexCenter")
    }

    trashContainer.forEach(item => {
        let li = document.createElement("li")
        li.classList.add("trashLI")
        li.innerHTML = `
        <div>
        <p>${item.name}</p>
        <button>Restore</button>
        </div>
        <ul class="cardsContainer"></ul>
        `
        ul.appendChild(li)


        let cardsContainer = li.querySelector("ul")
        element.cards.forEach((card) => {
            let newCard = document.createElement("li")
            newCard.innerHTML = card.name;
            cardsContainer.appendChild(newCard)
        })

        let restoreBtn = li.querySelector("button")
        restoreBtn.addEventListener("click", (e) => {
            let content = e.target.previousElementSibling.textContent
            let trashList = trashContainer.find(item => item.name == content)
            trashContainer = trashContainer.filter(item => item.name !== content)
            localStorage.setItem("trash", JSON.stringify(trashContainer))
            li.classList.add("hideLI")
            setTimeout(() => {
                li.remove()
            }, 1000);
    
            myData.push(trashList)
            
            localStorage.setItem("tasksList", JSON.stringify(myData))
        })



    });
}
trash()