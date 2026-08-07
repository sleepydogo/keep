# 1. Wallet Creation & Identity

WARD should automatically create a **headless wallet** for every user during onboarding.

The user should never be exposed to wallet creation, seed phrases, private keys, addresses, or other blockchain-specific concepts.

From the user's perspective, the process is simply:

```
Create WARD account

        ↓

Headless wallet is created

        ↓

Choose / assign .night alias

        ↓

Wallet becomes associated with the alias

        ↓

WARD is ready to receive credentials
```

The wallet creation and management happen entirely in the background.

---

## Headless Wallet

When a user creates a WARD account, the application creates a wallet without requiring the user to interact with a traditional wallet interface.

There should be no:

- Seed phrase
- "Connect Wallet" button
- Wallet extension
- Manual private key management
- Blockchain address shown to the user

The wallet exists as the underlying identity and cryptographic container for WARD.

The user interacts with it through the WARD UI.

---

# 2. `.night` Alias

After the headless wallet is created, WARD associates the wallet with a human-readable `.night` alias.

Example:

```
joaquin.night
```

The alias becomes the user's public-facing identifier.

Instead of asking an issuer to enter a blockchain address:

```
addr_1xxxx...
```

they simply enter:

```
joaquin.night
```

WARD can resolve the `.night` domain to its underlying target/address using the Midnight Domains SDK.

Reference:

Midnight Domains SDK Reference

The SDK supports resolving `.night` domains and returns the associated domain target/address.

---

# 3. Wallet + Alias Creation Flow

The complete onboarding flow becomes:

```
User creates WARD account
            │
            ▼
WARD creates headless wallet
            │
            ▼
User chooses .night alias
            │
            ▼
WARD registers / associates alias
            │
            ▼
Alias resolves to wallet
            │
            ▼
WARD Wallet Ready
```

Example:

```
Welcome to WARD

Choose your identity

[ joaquin.night ]

✓ Available

[ Continue ]
```

After confirmation:

```
Your WARD wallet is ready.

@joaquin.night

You can now receive
credentials from trusted issuers.
```

The entire blockchain process remains invisible.

---

# 4. System Architecture

The MVP should be split into two main components:

```
KEEP
Back-end / Issuer
        │
        │
        │ Issues credentials
        │
        ▼
    Midnight
        │
        │
        ▼
WARD
Front-end / Holder / Validator
```

### KEEP — Back / Issuer

KEEP is responsible for the issuer-side infrastructure.

It handles:

- Issuer accounts
- Credential creation
- Credential payloads
- Issuer signing
- Submission to Midnight
- Recipient resolution
- Issuer-side logic

The issuer interacts with KEEP through a simple web interface.

---

### WARD — Front / Holder / Validator

WARD is the user-facing mobile application.

It handles:

- Headless wallet creation
- `.night` identity
- Receiving credentials
- Accepting / rejecting credentials
- Local credential storage
- Holder authorization
- Credential presentation
- Verification
- Offline validation where supported

The user should experience WARD as a simple wallet, not as a blockchain application.

---

# 5. End-to-End Flow

The complete system should work like this:

```
                    KEEP
              Issuer Platform
                    │
                    │
             Create Credential
                    │
                    ▼
             Sign Credential
                    │
                    ▼
                 Midnight
                    │
                    │
             Resolve @alias
                    │
                    ▼
                  WARD
             Holder Wallet
                    │
                    ▼
             Accept / Decline
                    │
                    ▼
            Credential stored
                    │
                    ▼
              Show / Present
                    │
                    ▼
                Verifier
```

The important distinction is:

> **KEEP manages the issuer side. WARD manages the holder side and verification experience. Midnight provides the underlying blockchain infrastructure.**

The user should never need to understand how these layers interact.

---

# 6. Product Mental Model

The entire product should be understandable with one sentence:

> **KEEP sends trusted credentials to a user's WARD wallet using their `.night` identity.**

For example:

```
Doctor Hector
      │
      │
      │ Send Prescription
      ▼
joaquin.night
      │
      ▼
WARD Wallet
      │
      │
      ▼
Accept
      │
      ▼
Credential stored
```

The blockchain, wallet, signing and domain resolution are infrastructure behind this experience.

The UI should remain extremely simple.

# KEEP — Institutional Issuer & Key Management

## 1. Purpose

KEEP is the institutional side of WARD.

It is used by trusted organizations to:

- Create and issue credentials.
- Manage authorized users and devices.
- Sign credentials.
- Manage issuer keys.
- Revoke compromised devices or keys.
- Rotate signing keys.
- Recover access to the organization.
- Submit credentials to Midnight.

KEEP should not be modeled as a wallet belonging to one person.

It should be modeled as an **organizational identity with multiple authorized devices and signing keys**.

---

# 2. Core Architecture

The fundamental model is:

```
                    Organization
                          │
                    Organization ID
                          │
          ┌───────────────┼───────────────┐
          │               │               │
       Device A        Device B        Device C
       Key A           Key B           Key C
          │               │               │
       Doctor           Admin          Director
```

The organization has a persistent identity.

Individual devices have their own cryptographic keypairs.

The organization should **never depend on a single private key stored across multiple devices**.

---

# 3. Why There Should Not Be One Shared Private Key

A naive implementation could look like:

```
Hospital
   │
   └── Private Key
          │
          ├── Doctor Laptop
          ├── Admin Laptop
          └── Hospital PC
```

This creates a major security problem.

The same private key would exist in multiple locations.

If one device is compromised, the organization's entire issuer identity may be compromised.

It also creates operational problems:

- How do we revoke one device?
- How do we know which device issued a credential?
- How do we rotate the key?
- What happens when an employee leaves?
- What happens when a laptop is stolen?

KEEP should avoid this architecture.

---

# 4. Organization Identity vs Device Identity

KEEP should distinguish between:

### Organization Identity

Represents the institution.

Example:

```
Hospital Italiano
```

### Device Identity

Represents a specific authorized device/user.

Example:

```
Hospital Italiano

Dr. Hector
Device #A82F
Issuer Key #91D2
```

The organization authorizes individual device keys to act on its behalf.

Conceptually:

```
Hospital Italiano
        │
        ├── Dr. Hector
        │     └── Key A
        │
        ├── Maria Admin
        │     └── Key B
        │
        └── Joaquin Director
              └── Key C
```

---

# 5. Device Keys

Every KEEP installation/device should generate its own keypair.

```
Device
   │
   ├── Private Key
   │      └── Stored securely on device
   │
   └── Public Key
          └── Registered with organization
```

The private key should remain on the device whenever possible.

KEEP's backend should not need to store every organization's private signing keys.

The backend can manage:

- Organization membership
- Device registration
- Permissions
- Public keys
- Credential metadata
- Revocation state
- Key rotation
- Recovery workflows

---

# 6. Adding a New Device

The organization should be able to add new authorized devices without manually handling private keys.

Example:

```
KEEP

Settings
→ Devices
→ Add Device
```

KEEP displays:

```
Add New Device

Scan this QR code
with the new KEEP device.
```

The new device generates its own keypair.

```
New Device
    │
    ├── Generate Keypair
    │
    └── Send Public Key
             │
             ▼
       Organization
```

The existing authorized administrator approves the new device.

```
New Device

Hospital Italiano

Requesting access

Dr. Hector

[ Approve ]
```

After approval:

```
✓ Device Added

Dr. Hector
Authorized Issuer
```

The private key never needs to be copied from the existing device.

---

# 7. Device Management

KEEP should have a dedicated Devices section.

Example:

```
Devices

────────────────────────

MacBook Pro
Dr. Hector

● Active

────────────────────────

Windows PC
Maria

● Active

────────────────────────

MacBook Air
Former Admin

○ Revoked
```

Each device should show:

- User
- Device name
- Status
- Date added
- Last activity
- Key identifier

---

# 8. Revoking a Device

If a device is lost, stolen, compromised, or the employee leaves the organization:

```
Devices

MacBook Pro
Dr. Hector

[ Revoke Device ]
```

Confirmation:

```
Revoke MacBook Pro?

This device will no longer
be authorized to issue credentials.

[ Cancel ]

[ Revoke ]
```

Afterwards:

```
MacBook Pro

● Revoked
```

Other devices remain unaffected.

The organization identity does not need to change.

---

# 9. Roles & Permissions

KEEP should support organizational roles.

Example:

```
Organization

Hospital Italiano

────────────────────────

Dr. Hector
Doctor

Maria
Administrator

Joaquin
Owner
```

Roles can determine what each device/user is allowed to do.

Example:

### Doctor

```
✓ Issue prescriptions
✓ Issue medical certificates
✕ Manage organization
✕ Manage devices
```

### Administrator

```
✓ Manage devices
✓ Manage members
✓ Manage credentials
✓ Revoke credentials
✕ Change organization ownership
```

### Owner

```
✓ Everything
```

The exact role system can evolve, but the architecture should support authorization at the organization level.

---

# 10. Credential Issuance

When an authorized KEEP user creates a credential:

```
New Credential

Recipient

@joaquin.night

Type

Prescription

Title

Clonazepam Prescription

Valid Until

30 Aug 2026

[ Send to Wallet ]
```

Behind the scenes:

```
KEEP
  │
  ├── Validate permissions
  │
  ├── Resolve recipient
  │
  ├── Create credential
  │
  ├── Sign credential
  │
  └── Submit to Midnight
```

The user should not need to understand any of these steps.

---

# 11. Issuer Key Rotation

Issuer keys should not be permanent.

KEEP should support key rotation.

Example:

```
Signing Keys

Key #91D2

Active
Created Jan 2026

────────────────────

Key #73AF

Retired
Created Jan 2025
```

When rotating:

```
Old Key
   │
   ▼
Retired

New Key
   │
   ▼
Active
```

New credentials are signed with the new key.

Historical credentials remain associated with the key that was valid when they were issued.

This allows the organization to rotate keys without invalidating its entire historical credential set.

---

# 12. Key Compromise

If a signing key is suspected to be compromised:

```
Signing Keys

Key #91D2

⚠ Compromised

[ Revoke Key ]
```

The organization can revoke that key and move to a new signing key.

The organization identity itself remains unchanged.

Conceptually:

```
Hospital Italiano
       │
       ├── Key A
       │     └── Revoked
       │
       └── Key B
             └── Active
```

---

# 13. Organization Recovery

The most important operational scenario is:

> What happens if the organization loses all of its devices?

KEEP should not rely on one administrator or one private key.

The long-term architecture should support **multi-party recovery**.

Example:

```
Hospital Italiano

Recovery Policy

3 of 5 administrators
required
```

Potential recovery participants:

```
Owner
Director
IT Administrator
Security Administrator
Legal Administrator
```

If all normal devices are lost:

```
Admin A ─┐
Admin B ─┼──► Recovery
Admin D ─┘
```

Once the required threshold approves:

```
✓ Organization Recovery Approved

Create New Authorized Device
```

A new device generates its own keypair and becomes authorized.

---

# 14. Why Recovery Should Be Multi-Party

A single recovery account creates a dangerous single point of failure.

For example:

```
Hospital
    │
    └── Admin Password
            │
            └── Full Organization Control
```

If that account is compromised, the attacker potentially controls the organization.

Instead:

```
Hospital
    │
    └── Recovery Policy
            │
            ├── Admin A
            ├── Admin B
            ├── Admin C
            ├── Admin D
            └── Admin E

             3-of-5
```

No single person can recover the organization alone.

The exact cryptographic implementation of this mechanism should depend on the capabilities supported by the chosen Midnight architecture.

---

# 15. Audit Log

KEEP should maintain an organizational audit trail.

Example:

```
Activity

Today

10:42
Dr. Hector issued
Prescription to @joaquin.night

09:31
Maria added a new device

Yesterday

16:20
Admin revoked Device #A82F

Monday

11:04
Signing Key #73AF rotated
```

This is particularly important for institutions such as:

- Hospitals
- Universities
- Governments
- Employers
- Financial institutions

The audit log allows an organization to understand who performed an action and from which authorized device.

---

# 16. Security Model

The conceptual model is:

```
                    ORGANIZATION
                         │
                  Organization ID
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       User A         User B         User C
          │              │              │
       Device A       Device B       Device C
          │              │              │
       Key A           Key B           Key C
          │              │              │
          └──────────────┼──────────────┘
                         │
                         ▼
                    Credential
                         │
                         ▼
                      Midnight
```

The key principle is:

> **The organization owns the issuer identity; individual devices hold individual authorized keys.**

---

# 17. KEEP UX

Despite the complexity underneath, KEEP should remain extremely simple.

The main navigation could be:

```
Credentials

Members

Devices

Activity

Settings
```

The issuer primarily interacts with:

```
New Credential
```

Everything related to key management lives under:

```
Settings
    │
    ├── Organization
    ├── Members
    ├── Devices
    ├── Signing Keys
    └── Recovery
```

The normal issuer should almost never need to visit those sections.

---

# 18. MVP Scope

For the first version, KEEP should prioritize:

### Required

- Organization creation
- Organization identity
- User accounts
- Device registration
- Per-device keypair
- Device authorization
- Device revocation
- Credential issuance
- Issuer signing
- Midnight submission
- Basic audit log

### Next

- Key rotation
- Credential revocation
- Role-based permissions
- Multiple administrators
- Device management UI

### Advanced

- Multi-party organization recovery
- Threshold recovery
- Advanced key policies
- Hardware-backed keys
- Enterprise SSO
- Enterprise audit/compliance features

---

# 19. Core Principle

KEEP should never be designed around:

> **"Where do we store the hospital's private key?"**

The correct question is:

> **"Which devices are currently authorized to act on behalf of the hospital?"**

That leads to a much more robust architecture:

```
Organization
     │
     ├── Authorized Device A
     │        └── Key A
     │
     ├── Authorized Device B
     │        └── Key B
     │
     └── Authorized Device C
              └── Key C
```

A device can be added.

A device can be revoked.

A key can be rotated.

An organization can be recovered.

The organization's identity remains stable.

This makes KEEP suitable for institutions where losing a laptop, changing employees, or rotating cryptographic keys should **never require creating an entirely new organization identity**.
