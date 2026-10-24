const form = document.querySelector(".booking-form");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const routeInput = document.getElementById("route");

const nameError = document.getElementById("name-error");
const phoneError = document.getElementById("phone-error");
const routeError = document.getElementById("route-error");

const note = form.querySelector(".booking-note");
const defaultNote = note.textContent;

function cleanSpaces(text) {
    return text.trim().replace(/\s+/g, " ");
}

function capitalizeName(text) {
    return text
        .split(" ")
        .map(word =>
            word.charAt(0).toLocaleUpperCase("uk-UA") + word.slice(1)
        )
        .join(" ");
}


function showStatus(input, messageElement, isValid, message) {
    messageElement.textContent = message;

    input.classList.toggle("is-valid", isValid);
    input.classList.toggle("is-invalid", !isValid);

    messageElement.classList.toggle("is-valid", isValid);
    messageElement.classList.toggle("is-invalid", !isValid);

    input.setAttribute("aria-invalid", String(!isValid));
    input.setAttribute("aria-describedby", messageElement.id);

    return isValid;
}


function validateName() {
    const value = cleanSpaces(nameInput.value);
    const words = value.split(" ");
    const wordPattern = /^[\p{L}\p{M}]+(?:['’ʼ-][\p{L}\p{M}]+)*$/u;

    let error = "";

    if (value === "") {
        error = "Введіть ім’я та прізвище.";
    } else if (words.length < 2) {
        error = "Введіть щонайменше два слова: ім’я та прізвище.";
    } else if (!words.every(word => wordPattern.test(word))) {
        error = "Дозволені лише літери, апострофи та дефіси.";
    }

    return showStatus(
        nameInput,
        nameError,
        error === "",
        error || "✓ Ім’я та прізвище введено правильно."
    );
}


function validatePhone() {
    const value = phoneInput.value.replace(/\s+/g, "");
    let error = "";

    if (value === "") {
        error = "Введіть номер телефону.";
    } else if (!/^\+380\d{9}$/.test(value)) {
        error = "Потрібен формат +380991234567.";
    }

    return showStatus(
        phoneInput,
        phoneError,
        error === "",
        error || "✓ Формат номера правильний."
    );
}


function validateRoute() {
    const value = cleanSpaces(routeInput.value);
    const words = value === "" ? [] : value.split(" ");
    let error = "";

    if (value === "") {
        error = "Вкажіть маршрут.";
    } else if (!/^[\p{L}\p{M}\p{N}\s]+$/u.test(value)) {
        error = "Дозволені лише літери, цифри та пробіли.";
    } else if (words.length > 50) {
        error = `Максимум 50 слів. Зараз: ${words.length}.`;
    }

    return showStatus(
        routeInput,
        routeError,
        error === "",
        error || `✓ Маршрут введено правильно. Слів: ${words.length}/50.`
    );
}


nameInput.addEventListener("input", validateName);
phoneInput.addEventListener("input", validatePhone);
routeInput.addEventListener("input", validateRoute);


nameInput.addEventListener("blur", function () {
    if (validateName()) {
        nameInput.value = capitalizeName(cleanSpaces(nameInput.value));
    }
});


form.addEventListener("input", function () {
    note.textContent = defaultNote;
});


form.addEventListener("submit", function (event) {
    event.preventDefault();
    note.textContent = defaultNote;

    const nameValid = validateName();
    const phoneValid = validatePhone();
    const routeValid = validateRoute();

    if (!nameValid || !phoneValid || !routeValid) {
        const firstInvalid = form.querySelector(
            "input.is-invalid, textarea.is-invalid"
        );

        firstInvalid.focus();
        return;
    }

    nameInput.value = capitalizeName(cleanSpaces(nameInput.value));
    phoneInput.value = phoneInput.value.replace(/\s+/g, "");

    note.textContent =
        "✓ Усі поля заповнені правильно. форма: дані надіслано.";
});


