const tasksContainer = document.querySelector("ul#taskContainer")
const addListLi = document.querySelector("#addListLi")
let myData = JSON.parse(localStorage.getItem("tasksList")) || [];
let newList;
let div;
export function addList() {
    myData.forEach(element => {
        showTasks(element.name)
    });

    let x = tasksContainer.children.length
    addListLi.textContent = x > 1 ? "add another list" : "add a list"

    addListLi.addEventListener("click", () => {
        div = document.createElement("div")
        div.classList.add("addListPromp")
        const newListPromp = `
            <input type="text" autofocus/>
            <button>add list</button>
            <button>close</button>
        `
        div.innerHTML = newListPromp

        div.addEventListener("click", (e) => {
            e.stopPropagation()
        })
        addListLi.appendChild(div)
        let addListBtnInPromp = div.children[1]
        addListBtnInPromp.addEventListener("click", () => {
            let inpVal = document.querySelector(".addListPromp>input").value.trim()
            let isDoblicate = myData.some(element => element.name === inpVal)
            if (isDoblicate) {
                alert("This list already exists.")
                document.querySelector(".addListPromp>input").focus()
            } else addNewList(inpVal)
        })
        let closeBtn = div.children[2]
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            div.remove()
        })
    })
}

export function addNewList(listName) {
    if (listName == false || "") {
        alert("لطفا فیلد را پر کنید")
        document.querySelector(".addListPromp>input").focus()
    } else {
        showTasks(listName)
        let maxId = myData.reduce((acc, item) => item.id > acc ? item.id : acc, 0);

        let setNewTaskToServer = {
            name: listName,
            id: maxId + 1
        }
        myData.push(setNewTaskToServer)
        localStorage.setItem("tasksList", JSON.stringify(myData))
        div.remove()

    }
}

export function showTasks(listName) {
    newList = document.createElement("li")
    let newListContent = `
        <div class="newListContentHead">
            <p>${listName}</p>
            <button>...</button>
        </div>
        <ul></ul>
        <button class="btn">add a card</button>
    `
    newList.innerHTML = newListContent
    tasksContainer.prepend(newList)
    let addToCartBtn = newList.querySelector("button.btn")

    addToCartBtn.addEventListener("click", (e) => {
        let btn = e.target
        let parent = btn.parentElement

        let container = document.createElement("div")
        container.classList.add("add-to-card-container")
        const promp = `
            <input type="text" autofocus/>
            <button>add card</button>
            <button>X</button>
        `
        container.innerHTML = promp
        parent.appendChild(container)
        const addCardBtn = parent.lastElementChild.firstElementChild.nextElementSibling
        addCardBtn.addEventListener("click", (event) => {
            const addCartInp = parent.lastElementChild.firstElementChild.value
            if (addCartInp == false || "") {
                alert("poresh kon")
                parent.lastElementChild.firstElementChild.focus()
            } else {
                let btn = event.target
                let ul = btn.parentElement.parentElement.querySelector("ul")
                addCart(addCartInp, ul)
            }
        })
    })
}

export function addCart(val, parent) {
    const newItem = document.createElement("li")
    const newItemContent = `
    <li class="cartNewItem">
        <input type="checkbox" name="" id="">
        <p>${val}</p>
        <span>edit</span>
    </li>
   `
    newItem.innerHTML = newItemContent
    parent.appendChild(newItem)
    document.querySelector(".add-to-card-container").remove()
}
