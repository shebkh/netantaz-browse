document.querySelector('a').addEventListener('click', function (event) {
    event.preventDefault();
    document.querySelector('form').style.opacity = '1';
    document.querySelector('form').style.transform = 'scale(1)';
    document.querySelector('a').style.transform = 'scale(0)';
});

document.querySelector('button').addEventListener('click', function (event) {
    event.preventDefault();

    const form = document.querySelector('form');
    const input = document.querySelector('input');
    const phoneNumber = input.value.trim();

    form.classList.remove('error');

    if (!/^\d{1,10}$/.test(phoneNumber)) {
        form.classList.add('error');
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://reqres.in/api/users', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 201) {
                document.querySelector('.correct_message').style.opacity = '1';
                document.querySelector('.correct_message').style.transform = 'scale(1)';
                form.style.transform = 'scale(0)';
                input.value = '';
            } else {
                form.classList.add('error');
            }
        }
    };

    const data = JSON.stringify({ phone_number: phoneNumber });
    xhr.send(data);
});

const inputField = document.querySelector('input');
inputField.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
});
