const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

registerLink.addEventListener('click', () => wrapper.classList.add('active'));
loginLink.addEventListener('click', () => wrapper.classList.remove('active'));
btnPopup.addEventListener('click', () => wrapper.classList.add('active-popup'));
iconClose.addEventListener('click', () => wrapper.classList.remove('active-popup'));

async function fetchInfo(event) {
    event.preventDefault();

    try{
        const mail = document.querySelector('#mail').value;
        const pass = document.querySelector('#pass').value;
        const loginData = {
            mail: mail,
            pass: pass
        }

        if(mail === '' || pass === '') {
            alert('Field cannot be empty');
            return;
        }

        const response = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginData)
        })

        if(!response.ok){
            throw new Error('Error bro');
        }

        const data = await response.json();
        localStorage.setItem('chatUsername', data);
        localStorage.setItem('userMail', data);
        window.location.href = '/chat';
    }


    catch(error){
        console.error(error);
    }
}

async function sendInfo(event) {
    event.preventDefault();

    try{
        const name = document.querySelector('#name').value;
        const mail = document.querySelector('#regmail').value;
        const pass = document.querySelector('#regpass').value;
        const data = {
            name: name,
            mail: mail,
            pass: pass
        }

        if(name === '' || mail === '' || pass === '') {
            alert('Field cannot be empty');
            return;
        }

        const response = await fetch('/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if(!response.ok){
            console.log('failed');
        }

        else{
            console.log('success');
            wrapper.classList.remove('active');
            document.querySelector('#name').value = '';
            document.querySelector('#regmail').value = '';
            document.querySelector('#regpass').value = '';
        }
    }

    catch(error){
        console.error(error);
    }
}
