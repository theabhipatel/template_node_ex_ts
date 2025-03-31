export const generatePassword = () => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/";

  const password = [
    uppercase[Math.floor(Math.random() * uppercase.length)],
    lowercase[Math.floor(Math.random() * lowercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    specialChars[Math.floor(Math.random() * specialChars.length)],
  ];

  const allChars = uppercase + lowercase + numbers + specialChars;
  for (let i = password.length; i < 8; i++) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  const finalPassword = password.sort(() => Math.random() - 0.5).join("");

  return finalPassword;
};
