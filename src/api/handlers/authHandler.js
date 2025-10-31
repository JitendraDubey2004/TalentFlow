import { http, HttpResponse } from "msw";
import db from "../db/dexie";

//  Seed default user (for testing)
async function seedDefaultUser() {
  const existing = await db.users.where({ email: "b22ee009@nitm.ac.in" }).first();
  if (!existing) {
    await db.users.add({
      name: "Jitendra Dubey",
      email: "b22ee009@nitm.ac.in",
      password: "123456",
    });
  }
}

export const authHandler = [
  //  Signup API
  http.post("/api/signup", async ({ request }) => {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return HttpResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await db.users.where({ email }).first();
    if (existingUser) {
      return HttpResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    await db.users.add({ name, email, password });

    return HttpResponse.json(
      { message: "Signup successful", user: { name, email } },
      { status: 201 }
    );
  }),

  //  Login API
  http.post("/api/login", async ({ request }) => {
    const { email, password } = await request.json();

    if (!email || !password) {
      return HttpResponse.json(
        { message: "Missing credentials" },
        { status: 400 }
      );
    }

    await seedDefaultUser(); //  ensure default login always exists

    const user = await db.users.where({ email }).first();

    if (!user || user.password !== password) {
      return HttpResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Save session token
    localStorage.setItem("authToken", "fake-jwt-token");
    localStorage.setItem("currentUser", JSON.stringify(user));

    return HttpResponse.json(
      {
        message: "Login successful",
        user: { name: user.name, email: user.email },
        token: "fake-jwt-token",
      },
      { status: 200 }
    );
  }),

  //  Logout API
  http.post("/api/logout", async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    return HttpResponse.json({ message: "Logged out successfully" }, { status: 200 });
  }),
];




