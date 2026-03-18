const mongoose = require("mongoose");
const vault = require("node-vault")({
  apiVersion: "v1",
  endpoint: "http://192.168.1.136:8200", // Your Vault address
  token: process.env.VAULT_TOKEN, // You can also set this in .env
});

const connectDB = async () => {
  try {
    // 🔐 AppRole login
    const login = await vault.approleLogin({
      role_id: "d904b31a-e2de-b971-6915-5e9d5acbb6dd",
      secret_id: "a0b7780b-f14c-4ebd-ebe1-f861935d9a7f" 
    });

    vault.token = login.auth.client_token;
     // 🔹 Print success message
    console.log("✅ AppRole login successful");

    // 🔑 Read from Vault (YOUR PATH)
    const result = await vault.read("secret/data/mongo");

    const mongoURI = result?.data?.data?.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("❌ MONGODB_URI not found in Vault");
    }

    console.log("✅ Using MongoDB URI from Vault");

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB ConnecteD SUCCESSFULLY");

  } catch (err) {
    console.error("❌ Vault/DB Error:", err.message);
    process.exit(1); // 🔴 stop app if Vault fails
  }
};

module.exports = connectDB;