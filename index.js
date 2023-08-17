const add = document.querySelector('.add')
const clear = document.querySelector('.clear')

const storage = JSON.parse(localStorage.getItem('users')) || {}

/**
 * Функция добавления слушателей на кнопки удаления и изменения
 * в карточке пользователя
 * @param {HTMLDivElement} userCard - карточка пользователя
 */
function setListeners(userCard) {
    const deleteBtn = userCard.querySelector('.delete')
    const changeBtn = userCard.querySelector('.change')

    const userEmail = deleteBtn.dataset.deleteUserEmail

    deleteBtn.addEventListener('click', () => {
        console.log(
            `%c Удаление пользователя ${userEmail} `,
            'background: red; color: white'
        )

        deleteBtn.parentElement.parentElement.remove()
        deleteCard(userEmail)
    })

    changeBtn.addEventListener('click', () => {
        console.log(
            `%c Изменение пользователя ${userEmail} `,
            'background: green; color: white'
        )
        const newName = document.querySelector('#name')
        const newSecondName = document.querySelector('#secondName')
        const newEmail = document.querySelector('#email')
        const newHobbie = document.querySelector('#hobbie')
        const newAddress = document.querySelector('#address')

        newName.value = storage[userEmail].name
        newSecondName.value = storage[userEmail].secondName
        newEmail.value = storage[userEmail].email
        newHobbie.value = storage[userEmail].hobbie
        newAddress.value = storage[userEmail].address
    })
}

/**
 * Функция создания карточки пользователя
 * @param {Object} data - объект с данными пользователя
 * @param {string} data.name - имя пользователя
 * @param {string} data.secondName - фамилия пользователя
 * @param {string} data.email - email пользователя
 * @param {string} data.hobbie - хобби пользователя
 * @param {string} data.address - адрес пользователя
 * @returns {string} - возвращает строку с разметкой карточки пользователя
 */
function createCard({ name, secondName, email, hobbie, address }) {
    return `
        <div data-user=${email} class="user-outer">
            <div class="user-info">
                <p class="name">${name}</p>
                <p class="secondName">${secondName}</p>
                <p class="email">${email}</p>
                <p>${hobbie}</p>
                <p class="address">${address}</p>
            </div>
            <div class="menu">
                <button data-delete-user-email=${email} class="delete">Удалить</button>
                <button data-change-user-email=${email} class="change">Изменить</button>
            </div>
        </div>
    `
}

/**
 * Функция перерисовки карточек пользователей при загрузке страницы
 * @param {Object} storage - объект с данными пользователей
 */
function rerenderCards(storage) {
    const users = document.querySelector('.users')

    if (!storage) {
        console.log('localStorage пустой')
        return
    }

    users.innerHTML = ''

    Object.keys(storage).forEach((email) => {
        const userData = storage[email]
        const userCard = document.createElement('div')
        userCard.className = 'user'
        userCard.dataset.email = email
        userCard.innerHTML = createCard(userData)
        users.append(userCard)
        setListeners(userCard)
    })
}

/**
 * Функция добавления карточки пользователя в список пользователей и в localStorage
 * @param {Event} e - событие клика по кнопке добавления
 */
function addCard(e) {
    e.preventDefault()
    const newName = document.querySelector('#name')
    const newSecondName = document.querySelector('#secondName')
    const newEmail = document.querySelector('#email')
    const newHobbie = document.querySelector('#hobbie')
    const newAddress = document.querySelector('#address')

    const users = document.querySelector('.users')

    if (
        !newEmail.value ||
        !newName.value ||
        !newSecondName.value ||
        !newHobbie.value ||
        !newAddress.value
    ) {
        resetInputs(newName, newSecondName, newEmail, newHobbie, newAddress)
        return
    }

    const data = {
        name: newName.value,
        secondName: newSecondName.value,
        email: newEmail.value,
        hobbie: newHobbie.value,
        address: newAddress.value,
    }

    if (newEmail.value in storage) {
        deleteCard(newEmail.value)
        window.location.reload()
    }

    storage[newEmail.value] = data

    const userCard = document.createElement('div')
    userCard.className = 'user'
    userCard.dataset.email = newEmail.value
    userCard.innerHTML = createCard(data)
    users.append(userCard)
    setListeners(userCard)

    // Добавление данных в localStorage
    localStorage.setItem('users', JSON.stringify(storage))
    resetInputs(newName, newSecondName, newEmail, newHobbie, newAddress)

    console.log(storage)
}

/**
 * Функция очистки полей ввода
 * @param {HTMLInputElement} inputs
 */
function resetInputs(...inputs) {
    inputs.forEach((input) => {
        input.value = ''
    })
}

// Функция удаления card
function deleteCard(userEmail) {
    delete storage[userEmail]
    localStorage.removeItem('users')
    localStorage.setItem('users', JSON.stringify(storage))
}

// Функция очистки localStorage
function clearLocalStorage() {
    localStorage.removeItem('users')
    window.location.reload()
}

// Добавление слушателей на кнопки добавления и очистки
add.addEventListener('click', addCard)
clear.addEventListener('click', clearLocalStorage)

// При загрузке страницы перерисовываются карточки пользователей
window.addEventListener('load', () => {
    rerenderCards(JSON.parse(localStorage.getItem('users')))
})
