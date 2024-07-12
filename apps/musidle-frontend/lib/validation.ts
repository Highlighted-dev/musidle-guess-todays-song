export const doesPasswordHaveCapitalLetter = (password: string) => {
  // Check if there is any uppercase letter in password. If there is not, return error
  if (/[A-Z]/.test(password)) return true;
  return false;
};

export const doesPasswordHaveNumber = (password: string) => {
  // Check if there is any number in password. If there is not, return error
  if (/[1-9]/.test(password)) return true;
  return false;
};

export const isEmailValid = (email: string) => {
  // Regular Expression validating email with rfc822 standard. If email is not valid, return error. Examples:
  // asdkladlkaslkaslk  /Not valid
  // test.com  /Not valid
  // test@test  /Not valid
  // test@test.com   /Valid
  if (
    // eslint-disable-next-line no-control-regex
    /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/.test(
      email,
    )
  )
    return true;
  return false;
};

export const isPasswordLongEnough = (password: string) => {
  // Check if password is at least 8 characters long. If it is not, return error
  if (password.length >= 8) return true;
  return false;
};

export const isUsernameLengthValid = (username: string) => {
  // Check if username is between 3 and 20 characters long. If it is not, return error
  if (username.length >= 3 && username.length <= 20) return true;
  return false;
};

export const doesUsernameHaveValidCharacters = (username: string) => {
  // Check if username has only letters, numbers and underscores. If it does not, return error. The username can have letters, numbers and underscores. Examples:
  // test  /Valid
  // test123  /Valid
  // test_123  /Valid
  // test-123  /Not valid
  // test 123  /Not valid
  if (/^[a-zA-Z0-9_]*$/.test(username)) return true;
  return false;
};

//throw error if any of the validations fail
export const validateSingUp = (email: string, password: string, username: string) => {
  if (!isEmailValid(email)) throw new Error('Email is not valid');
  if (!doesPasswordHaveCapitalLetter(password))
    throw new Error('Password does not have a capital letter');
  if (!doesPasswordHaveNumber(password)) throw new Error('Password does not have a number');
  if (!isUsernameLengthValid(username))
    throw new Error('Username must be between 3 and 20 characters long');
  if (!doesUsernameHaveValidCharacters(username))
    throw new Error('Username can only have letters, numbers and underscores');
  return true;
};
