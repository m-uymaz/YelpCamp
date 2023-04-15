const validateRegistrationInput = (username, email, password) => {
  const usernameRe = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const usernameTest = usernameRe.test(username);
  
  const emailRe = /\S+@\S+\.\S+/;
  const emailTest = emailRe.test(email);
  
  
  if (usernameTest) {
    return "Do not use spaces or special characters in username";
  }
  if (!emailTest) {
    return "Not a valid email";
  }
  if (password.length < 4) {
    return "Password length must be at least 4 characters";
  }
}

module.exports = validateRegistrationInput;