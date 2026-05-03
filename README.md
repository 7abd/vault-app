
# 🛡️ VaultApp — Zero-Knowledge Encrypted Personal Vault

VaultApp is a **zero-knowledge encrypted vault** where all sensitive data is encrypted locally in the browser before being stored in the database. The server never has access to plaintext data or user passwords.

It is designed to explore real-world **client-side cryptography**, secure key management, and privacy-first architecture using modern web technologies.

---

##  Core Idea

Unlike traditional applications where user data is stored in readable or server-decryptable form, VaultApp ensures:

- All data is encrypted **on the client-side**
- The server only stores **ciphertext**
- Decryption is only possible on the user’s device

This simulates the architecture used in **secure password managers and privacy-focused applications**.

---

##  How It Works (Simplified Flow)

1. User enters a master password  
2. A cryptographic key is derived using **PBKDF2 + salt**  
3. Data is encrypted in the browser using **AES-GCM (Web Crypto API)**  
4. Only encrypted data is sent and stored in **Supabase**  
5. On login, data is decrypted locally in memory  
6. On logout or inactivity, the key is discarded  

---

## Key Features

###  Secure Authentication Flow
- Master password-based unlock system
- Password validation and controlled login attempts

###  Zero-Knowledge Encryption
- AES-GCM encryption for all sensitive data
- PBKDF2 key derivation with unique salt per user
- Server never has access to raw data or keys

###  Secure Password Change (Migration)
- Re-encrypts all vault data when password is updated
- Ensures zero data loss during migration

###  Auto-Lock System
- Automatically locks vault after inactivity
- Clears encryption keys from memory on lock

###  Data Export
- Export decrypted vault data as JSON

###  Hard Reset
- Completely wipes all user vault data

###  UI / UX
- Light & Dark mode support using CSS variables
- Clean and responsive interface

---

##  Architecture Highlights

- Fully client-side encryption model
- Stateless server design (stores only encrypted blobs)
- Secure in-memory key handling
- Separation of encryption logic from UI layer

---

##  Security & Design Challenges Solved

###  Key Management
Encryption keys never leave the client and are carefully managed in memory, then destroyed on logout or lock.

###  Re-encryption System
Password changes require securely decrypting and re-encrypting all stored data without corruption or partial failure.

###  Async Encryption Handling
Handled multiple encryption/decryption operations safely to avoid race conditions or inconsistent state.

###  Security vs UX Tradeoffs
Balanced strong security features (auto-lock, session control) with usability to avoid friction in user experience.

---

##  Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/Auth:** Supabase (@supabase/ssr)
- **Cryptography:** Web Crypto API  
  - AES-GCM encryption  
  - PBKDF2 key derivation
- **Icons:** Lucide React

---

##  Why This Project Matters

This project demonstrates practical understanding of:

- Client-side cryptography
- Secure key derivation and encryption flows
- Zero-knowledge system design
- State management for sensitive data
- Real-world security vs usability tradeoffs

These concepts are used in privacy-focused systems such as secure vaults, password managers, and encrypted note applications.

---

##  What I Learned

- Designing secure frontend architectures
- Working with low-level Web Crypto API
- Handling sensitive state in memory safely
- Building production-style authentication flows
- Thinking in terms of system design, not just UI

**Live Demo**: [vault-app-gray.vercel.app](https://vault-app-gray.vercel.app)
## Contact

Feel free to reach out if you have questions or want to connect:

- [LinkedIn](https://www.linkedin.com/in/abdennour-darkaoui-2b2873356/)
- [abd@darkaoui.org](mailto:abd@darkaoui.org)
-[My portfolio] (https://www.darkaoui.org)


- My Discord:abdel_07532

## Preview

![Vault App Preview](public/vault-preview.png)


##  Installation & Setup

```bash
# Clone this repo
git clone https://github.com/7abd/vault-app

# Go into the project___
cd vault-app

# Install dependencies
npm install

# Run the development server
npm run dev



##  Getting Started

### 1. Prerequisites
- Node.js 20+
- A Supabase project (Auth enabled + `vault_items` table created)

### 2. Environment Setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
