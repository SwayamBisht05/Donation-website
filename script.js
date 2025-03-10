// Store user data
let userData = {};

// Registration Form Validation
document.getElementById('registrationForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const donationType = document.getElementById('donationType').value;
    
    if (password !== confirmPassword) {
        showMessage('registrationMessage', 'Passwords do not match!', 'error');
        return;
    }
    
    if (!donationType) {
        showMessage('registrationMessage', 'Please select a donation type', 'error');
        return;
    }
    
    // Store user data
    userData = {
        fullname,
        email,
        phone,
        donationType
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('userData', JSON.stringify(userData));
    
    showMessage('registrationMessage', 'Registration successful! Redirecting to donation page...', 'success');
    
    // Redirect to payment page after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});

// Payment Form Setup and Validation
if (document.getElementById('paymentForm')) {
    // Load user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
        userData = JSON.parse(storedUserData);
        
        // Display user details
        document.getElementById('userFullName').textContent = `Donor: ${userData.fullname}`;
        document.getElementById('userEmail').textContent = `Email: ${userData.email}`;
        document.getElementById('donationTypeDisplay').textContent = 
            `Donation Type: ${userData.donationType.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
    } else {
        // Redirect back to registration if no user data
        window.location.href = 'registration.html';
    }
    
    // Handle donation amount buttons
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmount = document.getElementById('custom-amount');
    
    amountButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            amountButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            customAmount.value = '';
        });
    });
    
    customAmount.addEventListener('input', function() {
        amountButtons.forEach(btn => btn.classList.remove('selected'));
    });
}

document.getElementById('paymentForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    const customAmount = document.getElementById('custom-amount').value;
    const selectedBtn = document.querySelector('.amount-btn.selected');
    
    // Validate amount
    const donationAmount = customAmount || (selectedBtn ? selectedBtn.dataset.amount : '');
    if (!donationAmount) {
        showMessage('paymentMessage', 'Please select or enter a donation amount', 'error');
        return;
    }
    
    // Basic validation
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        showMessage('paymentMessage', 'Invalid card number', 'error');
        return;
    }
    
    if (!/^\d{3,4}$/.test(cvv)) {
        showMessage('paymentMessage', 'Invalid CVV', 'error');
        return;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        showMessage('paymentMessage', 'Invalid expiry date format (MM/YY)', 'error');
        return;
    }
    
    showMessage('paymentMessage', 'Thank you for your donation! Processing...', 'success');
    
    // Clear stored user data
    localStorage.removeItem('userData');
    
    // Redirect to success page after 2 seconds
    setTimeout(() => {
        window.location.href = 'donation-success.html';
    }, 2000);
});

// Format card number while typing
document.getElementById('card-number')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = value;
});

// Format expiry date while typing
document.getElementById('expiry')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0,2) + '/' + value.slice(2,4);
    }
    e.target.value = value;
});

// Helper function to show messages
function showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
    }
}
