const bookingForm = document.querySelector('form.booking-form');
const nameInput  = bookingForm.querySelector('#name');
const phoneInput = bookingForm.querySelector('#phone');
const routeInput = bookingForm.querySelector('#route');
const submitButton = bookingForm.querySelector('.booking-submit');


function checkFormValidity() {
    const isNameValid  = nameInput.value.trim() !== '';
    const isPhoneValid = phoneInput.value.trim() !== '';
    const isRouteValid = routeInput.value.trim() !== '';

    submitButton.disabled = !(isNameValid && isPhoneValid && isRouteValid);
    return isNameValid && isPhoneValid && isRouteValid;
}

[nameInput, phoneInput, routeInput].forEach(input => {
    input.addEventListener('input', checkFormValidity);
});

submitButton.onclick = function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log('Form submitted:');
    console.log('Name:', nameInput.value);
    console.log('Phone:', phoneInput.value);
    console.log('Route:', routeInput.value);

    // Save the form data to localStorage
    localStorage.setItem('name' , nameInput.value );
    localStorage.setItem('phone', phoneInput.value);
    localStorage.setItem('route', routeInput.value);
    console.log('Form data saved to localStorage.');
};

document.addEventListener('DOMContentLoaded', function() {
    nameInput .value = localStorage.getItem('name')  || '';
    phoneInput.value = localStorage.getItem('phone') || '';
    routeInput.value = localStorage.getItem('route') || '';
    checkFormValidity(); // Check form validity on page load

});