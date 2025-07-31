import { trash } from "./trash";

// انتخاب کانتینر اصلی برای نمایش تمام لیست‌ها (Board)
const tasksContainer = document.querySelector("ul#taskContainer");

const navItems = document.querySelectorAll("nav > ul > li")
const sections = document.querySelectorAll("#todoContainer > section")




// انتخاب دکمه‌ای که به کاربر اجازه می‌دهد یک لیست جدید بسازد
const addListLi = document.querySelector("#addListLi");

// بارگذاری داده‌ها از localStorage یا مقدار پیش‌فرض در صورت نبود داده
let myData = JSON.parse(localStorage.getItem("tasksList")) || [];

// گرفتن موارد حذف شده از لوکال استرویج
let trashContainer = JSON.parse(localStorage.getItem("trash")) || [];

// تعریف متغیرهای عمومی برای استفاده‌های بعدی در DOM
let newList;
let div;
let newItem;
let parent;

/**
 * لود اولیه لیست‌ها و کارت‌ها از localStorage هنگام اجرای صفحه.
 * همچنین اضافه کردن قابلیت "Add List".
 */
export function addList() {

    //نمایش سکشن مورد نظر
    navItems.forEach((item, i) => {

        item.addEventListener("click", (e) => {
            localStorage.setItem("trash", JSON.stringify(trashContainer))
            sections.forEach((section, index) => {
                if (i === index) {
                    setTimeout(() => {
                        section.classList.add("sectionTransition")
                    }, 400);
                } else {
                    section.classList.remove("sectionTransition")
                }
            })

        })
    })

    // نمایش تمام لیست‌های ذخیره‌شده و کارت‌های داخل آن‌ها
    myData.forEach(element => {
        const ul = showTasks(element.name); // ساخت لیست جدید در DOM
        element.cards.forEach(card => {
            showCart(card.name, ul, element.name); // نمایش کارت‌های مربوط به لیست
        });
    });

    // تنظیم متن دکمه "Add List" با توجه به وجود یا نبود لیست
    let x = tasksContainer.children.length;
    addListLi.textContent = x > 1 ? "add another list" : "add a list";

    // رویداد کلیک روی دکمه اضافه‌کردن لیست جدید
    addListLi.addEventListener("click", () => {
        // ایجاد فرم ورودی برای ساخت لیست جدید
        div = document.createElement("div");
        div.classList.add("addListPromp");

        div.innerHTML = `
            <input type="text" autofocus/>
            <button>add list</button>
            <button>close</button>
        `;

        // جلوگیری از بسته‌شدن ناخواسته فرم هنگام کلیک داخل آن
        div.addEventListener("click", (e) => e.stopPropagation());
        addListLi.appendChild(div);

        // دکمه ثبت لیست جدید
        let addListBtnInPromp = div.children[1];
        addListBtnInPromp.addEventListener("click", () => {
            let inpVal = div.querySelector("input").value.trim();
            let isDuplicate = myData.some(el => el.name === inpVal);
            if (isDuplicate) {
                alert("This list already exists.");
                div.querySelector("input").focus();
            } else {
                addNewList(inpVal);
            }
        });

        // دکمه بستن فرم اضافه‌کردن لیست
        let closeBtn = div.children[2];
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            div.remove();
        });
    });
}

/**
 * افزودن لیست جدید به localStorage و نمایش آن در UI
 */
export function addNewList(listName) {
    if (!listName) {
        alert("Please fill in the field !");
        document.querySelector(".addListPromp>input").focus();
        return;
    }

    showTasks(listName);

    // تعیین بزرگ‌ترین ID موجود برای دادن ID جدید
    let maxId = myData.reduce((acc, item) => item.id > acc ? item.id : acc, 0);

    let newListObj = {
        name: listName,
        id: maxId + 1,
        cards: []
    };

    // افزودن لیست جدید به داده‌ها و ذخیره در localStorage
    myData.push(newListObj);
    localStorage.setItem("tasksList", JSON.stringify(myData));
    div.remove();
}

/**
 * ساخت و نمایش یک لیست جدید (شامل کارت‌های درون آن) در DOM
 */
export function showTasks(listName) {
    const newList = document.createElement("li");
    newList.innerHTML = `
        <div class="newListContentHead">
            <p>${listName}</p>
            <button>...</button>
        </div>
        <ul></ul>
        <button class="btn">add a card</button>
    `;

    // منوی هدر آیتم
    const menuItemBtn = newList.querySelector("div>button")
    menuItemBtn.addEventListener("click", (e) => {
        if (menuItemBtn.disabled) return

        menuItemBtn.disabled = true

        let menuItem = document.createElement("div")
        menuItem.classList.add("ListmenuItem")
        menuItem.innerHTML = `
        <div>
            list action <span class=removeCart>❌</span>
        </div>
        <button id='delete'>delete</button>
        <button id="edit">edit item name</button>
        <button id='minimize'>minimize</button>
       `
        newList.querySelector("div").prepend(menuItem)
        menuItem.querySelector("div>span").addEventListener('click', (e) => {
            menuItem.remove()
            menuItemBtn.disabled = false
        })
        // delete list
        menuItem.querySelector("button#delete").addEventListener('click', (e) => {
            let cart = e.target.parentElement.parentElement.parentElement
            let content = e.target.parentElement.parentElement
            content = content.querySelector("p").textContent

            let localList = myData.find(item => item.name == content)
            myData = myData.filter(item => item.name !== content)
            console.log(myData);

            localStorage.setItem("tasksList", JSON.stringify(myData))


            console.log(localList);
            trashContainer.push(localList)
            console.log(trashContainer);

            localStorage.setItem("trash", JSON.stringify(trashContainer))

            menuItem.remove()
            cart.classList.add("hideLI")
            setTimeout(() => {
                cart.remove()
            }, 500);

            // console.log(content);



        })

        // edit list 
        menuItem.querySelector("button#edit").addEventListener("click", (e) => {
            let target = e.target.parentElement.nextElementSibling
            let parent = target.parentElement

            // جلوگیری از اضافه کردن مجدد input و button
            if (parent.querySelector("input.editPromp") || parent.querySelector("button.editConfirm")) {
                return;
            }
            let promp = document.createElement("input")
            let btn = document.createElement("button")
            btn.textContent = "✅"
            promp.classList.add("editPromp")
            target.parentElement.appendChild(promp)
            target.parentElement.appendChild(btn)

            btn.addEventListener("click", () => {
                let localList = myData.find(item => item.name == target.textContent)
                console.log(localList, "ll");
                if (!promp.value.trim()) {
                    alert('please inter new name')
                    return
                }

                if (localList) {
                    localList.name = promp.value.trim()
                    let f = myData = myData.filter(item => item.name !== target.textContent)
                    myData.push(localList)

                    localStorage.setItem("tasksList", JSON.stringify(myData))

                    target.textContent = localList.name

                    promp.remove()
                    btn.remove()
                }


            })
        })
    }, true)

    tasksContainer.prepend(newList); // اضافه کردن به ابتدای لیست‌ها

    const addToCartBtn = newList.querySelector("button.btn");
    const cardsContainer = newList.querySelector("ul");

    // نمایش فرم افزودن کارت هنگام کلیک روی "add a card"
    addToCartBtn.addEventListener("click", () => {
        const container = document.createElement("div");
        container.classList.add("add-to-card-container");
        container.innerHTML = `
            <input type="text" autofocus/>
            <button>add card</button>
            <button>X</button>
        `;

        newList.appendChild(container);

        const input = container.querySelector("input");
        const addCardBtn = container.querySelector("button");

        // افزودن کارت به لیست
        addCardBtn.addEventListener("click", () => {
            const value = input.value.trim();
            if (!value) {
                alert("لطفا فیلد را پر کنید");
                input.focus();
                return;
            }
            addCart(value, cardsContainer, listName);
        });

        // بستن فرم افزودن کارت
        container.querySelector("button:last-child").addEventListener("click", () => container.remove());
    });

    return cardsContainer;
}

/**
 * اضافه کردن کارت جدید به لیست خاص و ذخیره آن در localStorage
 */
export function addCart(val, parent, listName) {
    showCart(val, parent, listName); // نمایش کارت در UI

    let localList = myData.find(item => item.name === listName);

    // ذخیره کارت جدید در داده‌ها
    localList.cards.push({
        name: val,
        description: null,
        state: false
    });

    localStorage.setItem("tasksList", JSON.stringify(myData));
}

/**
 * نمایش یک کارت در لیست مشخص به همراه قابلیت ویرایش و تیک‌زدن
 */
export function showCart(val, parent, listName) {
    const newItem = document.createElement("li");
    newItem.classList.add("cartNewItem");

    newItem.innerHTML = `
        <p>${val}</p>
        <input type="checkbox">
        <span>🖋️</span>
    `;

    parent.appendChild(newItem);

    // حذف فرم اضافه‌کردن کارت (در صورتی که باز باشه)
    const container = parent.parentElement.querySelector(".add-to-card-container");
    if (container) container.remove();

    const localList = myData.find(item => item.name === listName);
    const checkbox = newItem.querySelector("input");


    checkbox.addEventListener("click", (e) => {
        const card = localList.cards.find(c => c.name === val);
        if (card) {
            card.state = e.target.checked;
            localStorage.setItem("tasksList", JSON.stringify(myData));

            // حذف span قدیمی اگه هست
            const existingSpan = newItem.querySelector(".cartItemChecked");
            if (existingSpan) existingSpan.remove();

            if (card.state) {
                const newSpan = document.createElement("span");
                newSpan.classList.add("cartItemChecked");
                newItem.appendChild(newSpan);
                newItem.style.position = "relative";
                // تاخیر کوتاه برای اجرای ترنزیشن
                setTimeout(() => {
                    newSpan.style.width = "100%"; // باعث اعمال width: 100% با transition
                }, 10); // 10 میلی‌ثانیه کافیه
            }
        }
    });


    // تعیین وضعیت تیک بر اساس داده‌های قبلی
    const existingCard = localList.cards.find(c => c.name === val);
    checkbox.checked = existingCard?.state ?? false;
    if (checkbox.checked) {
        existingCard?.state ?? false
        const newSpan = document.createElement("span")
        newSpan.classList.add("cartItemChecked")
        newItem.appendChild(newSpan)
        newItem.style.position = "relative"
        newSpan.style.width = "100%"
    }

    // ذخیره وضعیت کارت هنگام تیک‌زدن
    checkbox.addEventListener("click", (e) => {
        const card = localList.cards.find(c => c.name === val);
        if (card) {
            card.state = e.target.checked;
            localStorage.setItem("tasksList", JSON.stringify(myData));
        }
    });

    // ویرایش کارت (نام کارت)
    const editBtn = newItem.querySelector("span");
    editBtn.addEventListener('click', () => {
        const existingInput = newItem.querySelector(".editPromp");

        if (!existingInput) {
            // شروع ویرایش
            const editInput = document.createElement("input");
            editInput.classList.add("editPromp");

            const currentValue = newItem.querySelector("p").textContent;
            editInput.value = currentValue;

            // ذخیره مقدار قبلی برای بروزرسانی درست در localStorage
            newItem.setAttribute("data-oldname", currentValue);

            newItem.appendChild(editInput);
            editBtn.textContent = "✅";

        } else {
            // پایان ویرایش
            const newValue = existingInput.value.trim();
            const oldValue = newItem.getAttribute("data-oldname");

            if (newValue) {
                newItem.querySelector("p").textContent = newValue;

                const card = localList.cards.find(c => c.name === oldValue);
                if (card) {
                    card.name = newValue;
                    localStorage.setItem("tasksList", JSON.stringify(myData));
                }
            }

            existingInput.remove();
            editBtn.textContent = "🖋️";
            newItem.removeAttribute("data-oldname");
        }
    });

}
