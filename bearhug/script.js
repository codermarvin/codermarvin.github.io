var submitted = false;

function handleFormSubmit() {
    const emailInput = document.getElementById('email');
    const emailValue = emailInput.value.trim();
    // Simple but robust email regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email
    if (!emailPattern.test(emailValue)) {
        // Prevent submission (this function is called onsubmit, so return false works if returned to event, 
        // but since we are inside the function called by onsubmit="handleFormSubmit()", we need to prevent default or handle UI here.
        // Actually, the form will submit unless we return false from the onsubmit attribute.
        // Let's update the UI to show error and we need to update the HTML to return the result of this function.

        emailInput.classList.add('error');
        // Shake animation
        emailInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            emailInput.style.animation = 'none';
        }, 500);

        // Return false to prevent form submission
        return false;
    }

    // if valid
    emailInput.classList.remove('error');
    submitted = true;

    // UI Update
    const form = document.getElementById('waitlistForm');
    const successMsg = document.getElementById('successMessage');
    const btn = form.querySelector('button');

    // Change button state
    btn.textContent = 'Joining...';
    btn.disabled = true;

    // Restore UI logic for "Thank You" experience since iframe is back
    // Show success message after a delay (simulating network request time)
    // The actual redirect happens via iframe onload, but we want to show loading state.
}
