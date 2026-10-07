const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log("\nHOMEHEALTH 360 - Permanent Admin Account Setup\n");

  const name = (await ask("Admin name: ")).trim();
  const email = (await ask("Admin email: ")).trim().toLowerCase();
  const password = await ask("Admin password: ");

  if (!name || !email || !password) {
    throw new Error("All fields are required.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  let admin;

  if (existingUser) {
    admin = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name,
        passwordHash,
        role: "ADMIN",
      },
    });

    console.log("\nExisting account updated as ADMIN.");
  } else {
    admin = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "ADMIN",
      },
    });

    console.log("\nPermanent ADMIN account created successfully.");
  }

  console.log("Admin ID:", admin.id);
  console.log("Admin Email:", admin.email);
  console.log("Admin Role:", admin.role);
}

main()
  .catch((error) => {
    console.error("\nADMIN CREATION ERROR:");
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });