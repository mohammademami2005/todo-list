const ul = document.querySelector("#trashUl")
let myData = JSON.parse(localStorage.getItem("tasksList")) || [];
let trashContainer = JSON.parse(localStorage.getItem("trash")) || [];

export function trash() {

    if (!ul) {
        console.error("عنصر #trashUl پیدا نشد");
        return;
    }

    if (!Array.isArray(trashContainer)) {
        console.error("trashContainer معتبر نیست:", trashContainer);
        return;
    }

    if (trashContainer.length === 0) {
        ul.textContent = "trash is empty"
        ul.classList.add("flexCenter")
        return;
    }

    trashContainer.forEach((element, i) => {
        if (!element || typeof element !== 'object') {
            console.warn(`عنصر trashContainer در index ${i} نامعتبر است:`, element);
            return;
        }

        if (!element.name) {
            console.warn(`عنصر name در index ${i} وجود ندارد`, element);
            return;
        }

        let li = document.createElement("li")
        li.classList.add("trashLI")
        li.innerHTML = `
        <div>
            <p>${element.name}</p>
            <button>Restore</button>
        </div>
        <ul class="cardsContainer"></ul>
        `
        ul.appendChild(li)

        let cardsContainer = li.querySelector("ul")
        if (Array.isArray(element.cards)) {
            element.cards.forEach((card, j) => {
                if (!card || typeof card !== 'object' || !card.name) {
                    console.warn(`کارت نامعتبر در لیست ${element.name} index ${j}:`, card)
                    return;
                }
                let newCard = document.createElement("li")
                newCard.textContent = card.name;
                cardsContainer.appendChild(newCard)
            })
        }

        let restoreBtn = li.querySelector("button")
        restoreBtn.addEventListener("click", (e) => {
            let content = e.target.previousElementSibling.textContent.trim()
            let trashList = trashContainer.find(item => item.name == content)
            trashContainer = trashContainer.filter(item => item.name !== content)
            localStorage.setItem("trash", JSON.stringify(trashContainer))
            li.classList.add("hideLI")
            setTimeout(() => {
                li.remove()
            }, 1000);

            if (trashList) {
                myData.push(trashList)
                localStorage.setItem("tasksList", JSON.stringify(myData))
            }
        })
    });
}

trash()
