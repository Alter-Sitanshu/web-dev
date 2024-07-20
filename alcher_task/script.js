const User_URL = "https://dummyjson.com/users";

//Loading User Info
const loadUsers = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then((response) => {
            return response.json();
        }).then((object) => {
            const data = object["users"];
            const tableElement = document.getElementsByTagName('tbody')[0];
            tableElement.innerHTML = '';
            for(user of data){
                tableElement.innerHTML += `
                        <tr id="${user['id']}">
                            <td>${user['firstName'].trim()} ${user['lastName'].trim()}</td>
                            <td>${user['gender'].trim()}</td>
                            <td>${user['phone'].trim()}</td>
                            <td class="edit-col">
                                <button class="edit">Edit</button>
                                <button class="delete">Delete</button>
                            </td>
                        </tr>           
                `;
            };
            return true
        })
        .then(() => {
            resolve(true);
        })
    })
}

//Handling the edit and delete functionality
const handlingSubmit = (id) => {
    const submitElement = document.getElementById('submit');
    const cancelElement = document.getElementById('cancel');
    submitElement.addEventListener('click', async (event) => {
        event.preventDefault();
        const row = Array.from(document.getElementById(id).children);
        row[0].innerHTML = document.getElementById('name').value;
        row[1].innerHTML = document.getElementById('gender').value;
        row[2].innerHTML = document.getElementById('phone').value;
        const popupElement = document.getElementById('popup');
        popupElement.innerHTML = '';
        popupElement.style.opacity = 0;
    });
    cancelElement.addEventListener('click', (event) => {
        event.preventDefault();
        const popupElement = document.getElementById('popup');
        popupElement.innerHTML = '';
        popupElement.style.opacity = 0;
    });
};

const handlingEdit = (name, gender, phone, id) => {
        const popupElement = document.getElementById('popup');
        popupElement.innerHTML = `
            <h1>Enter Details</h1>
            <form action="/">
                <label for="event" name="event">Name</label>
                <input type="text" id="name" required value='${name}'>
                <label for="amount">Gender</label>
                <input type="text" name="gender" id="gender" required value='${gender}'>
                <label for="amount">Gender</label>
                <input type="text" name="phone" id="phone" required value='${phone}'>
                <div id="form-buttons">
                    <button id="submit" class="submit-button" type="submit">Submit</button>
                    <button id="cancel" type="button">Cancel</button>
                </div>
            </form>
        `;
        popupElement.style.opacity = 1;
        handlingSubmit(id);
};

const loadingButtons = () => {
    const edit_list = document.getElementsByClassName('edit');
    const delete_list = document.getElementsByClassName('delete');
    for(button of edit_list){
        button.addEventListener('click', (e) => {
            let row_id = e.target.closest('tr').id;
            const row = Array.from(document.getElementById(row_id).children);
            let name = row[0].innerHTML;
            let gender = row[1].innerHTML;
            let phone = row[2].innerHTML;
            handlingEdit(name, gender, phone, row_id);
        });
    };
    for(button of delete_list){
        button.addEventListener('click', (e) => {
            let row_id = e.target.closest('tr').id;
            const row = document.getElementById(row_id);
            document.getElementsByTagName('tbody')[0].removeChild(row);
        });
    };
}
loadUsers(User_URL)
.then(loadingButtons);


//handling Dropdowns
const handleDrop = (id) => {
    if(document.getElementById(`${id}`).nextSibling){
        const drop = document.getElementById(`${id}`).nextSibling;
        document.getElementsByClassName('menu-box')[(id%10)-1].removeChild(drop);
    }
    else if(!document.getElementById(`${id}`).nextSibling){
        const dropmenu = document.createElement('div');
        dropmenu.className = 'drop';
        dropmenu.innerHTML = `
            <a href="www.google.com" target="_main">Commerce</a>
            <a href="www.google.com" target="_main">Analytics</a>
            <a href="www.google.com" target="_main">Crypto</a>
        `;
        document.getElementById(`${id}`).insertAdjacentElement('afterend', dropmenu);
    };
};
// handling sidemenu transition
const handleMenu = () => {
    const container = document.getElementById('main-container');
    if(document.getElementById('sidemenu') && container.contains(document.getElementById('sidemenu'))){
        container.removeChild(document.getElementById('sidemenu'));
        container.style.gridTemplateColumns = '1fr';
    }
    else if(!document.getElementById('sidemenu')){
        const newSidemenu = document.createElement('div');
        newSidemenu.id = 'sidemenu';
        newSidemenu.innerHTML = `
            <button id="new">
                <img src="styles/images/plus.png" id="new-icon">
                <p>New Item</p>
            </button>
            <div class="menu-box">
                <div class="menu-items" id="11" onclick='handleDrop(this.id)'>
                    <img src="styles/images/icon.png" id="icon">
                    <p>Dashboard</p>
                    <img src="styles/images/drop.png" id="drop">
                </div>
            </div>
            <div class="menu-box">
                <div class="menu-items" id="12" onclick='handleDrop(this.id)'>
                    <img src="styles/images/icon.png" id="icon">
                    <p>Application</p>
                    <img src="styles/images/drop.png" id="drop">
                </div>
            </div>
            <div class="menu-box">
                <div class="menu-items" id="13" onclick='handleDrop(this.id)'>
                    <img src="styles/images/icon.png" id="icon">
                    <p>Elements</p>
                    <img src="styles/images/drop.png" id="drop">
                </div>
            </div>
        `;
        container.insertBefore(newSidemenu, container.firstChild);
        if(window.innerWidth > 650){
            container.style.gridTemplateColumns = '0.2fr 0.8fr';
        }
        else{
            const nav = document.getElementsByTagName('nav')[0];
            document.body.insertAdjacentElement('afterend'. newSidemenu);
        }
    }
    else{
        document.body.removeChild(newSidemenu);
    }
}
const home = document.getElementById('home');
home.addEventListener('click', handleMenu);
