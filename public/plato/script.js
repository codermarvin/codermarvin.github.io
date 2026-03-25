// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcjmdSZSZ4SyuQjVYI25i3-B_wF8TGxly_-1SC0FtBmb5MSykjSWZN3vfpcFwgO0kOrg/exec'; 

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailValue)) {
        emailInput.classList.add('error');
        emailInput.style.animation = 'shake 0.5s';
        setTimeout(() => { emailInput.style.animation = 'none'; }, 500);
        return false;
    }

    emailInput.classList.remove('error');
    
    const form = document.getElementById('waitlistForm');
    const btn = form.querySelector('button');
    const successMsg = document.getElementById('successMessage');

    btn.textContent = 'Adding you...';
    btn.disabled = true;

    if (!SCRIPT_URL) {
        console.warn("No SCRIPT_URL provided. Simulating success...");
        setTimeout(() => {
            form.classList.add('hidden');
            successMsg.classList.remove('hidden');
        }, 1000);
        return;
    }

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Apps Script requires no-cors if not using a complex setup
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailValue })
        });

        // Since we use 'no-cors', we won't get a proper JSON response back, 
        // but the request will still reach the script.
        form.classList.add('hidden');
        successMsg.classList.remove('hidden');
        
        // Redirect to thank you page after a short delay
        setTimeout(() => {
            window.location.href = 'thankyou.html';
        }, 2000);

    } catch (error) {
        console.error('Error!', error.message);
        btn.textContent = 'Keep Me Posted';
        btn.disabled = false;
        alert('Something went wrong. Please try again.');
    }
}
