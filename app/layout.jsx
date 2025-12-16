import "./globals.css";
import { cookies } from "next/headers";
import Header from "./components/Header";
import { verifyToken } from "../lib/auth";

export const metadata = {
  title: "Hackathon Manager",
};

export default function RootLayout({ children }) {
  let role = null;
  let email = null;
  try {
    const c = cookies().get("token")?.value;
    const payload = c ? verifyToken(c) : null;
    role = payload?.role || null;
    email = payload?.email || null;
  } catch (e) {
    role = null;
  }

  return (
    <html lang="en">
      <body>
        <div className="container mx-auto p-4">
          <header className="mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Hackathon Manager</h1>
              {role && (
                <div
                  className="px-2 py-0.5 text-xs rounded text-white role-badge"
                  style={{
                    background:
                      role === "admin"
                        ? "#7c3aed"
                        : role === "judge"
                        ? "#0ea5e9"
                        : "#16a34a",
                  }}
                >
                  {role}
                </div>
              )}
            </div>
            {/* client header handles logout and user display */}
            <div id="header-client-root">
              {/* Header is a client component that handles logout */}
              <Header role={role} email={email} />
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
