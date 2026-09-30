const bcrypt = require("bcryptjs");

async function main() {
  const password = process.argv[2];

  if (!password) {
    console.log("Please provide a password.");
    return;
  }

  const hash = await bcrypt.hash(password, 12);

  console.log(hash);
}

main();


