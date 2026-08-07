
# WARD — Minimal Issuer & Holder UX

## Product Philosophy

WARD should feel less like a blockchain application and more like **sending something to another person's wallet**.

The user should never need to understand:

- Blockchain
- Midnight
- Smart contracts
- Cryptographic signatures
- Public/private keys
- Hashes
- Transactions

The visible mental model is simply:

> **"I am sending a credential to someone's WARD wallet."**
> 

---

# 1. Issuer — Web App

The issuer experience should be an extremely simple form.

The issuer could be:

- Doctor
- University
- Hospital
- Employer
- Government institution
- Certification authority
- Any trusted organization

The main action is:

> **Send to Wallet**
> 

---

## New Credential

```
------------------------------------------------

                 New Credential

------------------------------------------------

Recipient

[ joaquin.night                         ]

------------------------------------------------

Credential Type

[ Prescription ▼ ]

------------------------------------------------

Title

[ Clonazepam Prescription              ]

------------------------------------------------

Description

[ Take 0.5mg once daily                 ]

------------------------------------------------

Valid Until

[ 30 Aug 2026 ]   [ 30 days ▼ ]

------------------------------------------------

             [ Send to Wallet ]

------------------------------------------------
```

The form should be intentionally boring and simple.

No dashboard complexity is required for the MVP.

---

# 2. Recipient / Wallet Alias

Users should not need to enter cryptographic identifiers.

Instead of:

```
did:key:z6Mk...
```

or:

```
0x742...
```

the issuer enters:

```
joaquin.night
```

or:

```
@joaquin.night
```

The alias represents the user's WARD wallet

checkout  [https://docs.midnight.domains/reference/](https://docs.midnight.domains/reference/)

rather than blockchain addresses.

---

# 3. Credential Types

For the MVP, the issuer can select a predefined credential type.

Example:

```
Credential Type

[ Prescription ▼ ]
```

Possible types:

```
Prescription

Medical Certificate

University Degree

Employment Certificate

Professional License

Membership

Identity

Custom
```

The form can dynamically change depending on the selected credential type.

---

# 4. Prescription Example

For a doctor:

```
Recipient

[ joaquin.night ]

Credential Type

[ Prescription ]

Title

[ Clonazepam Prescription ]

Description

[ Take 0.5mg once daily ]

Valid Until

[ 30 Aug 2026 ]

[ Send to Wallet ]
```

The UI should not expose any blockchain-related concepts.

---

# 5. What Happens After Submit

The issuer presses:

```
Send credential
```

The application handles the technical process automatically.

Conceptually:

```
Create Credential

        ↓

Generate / Build Payload

        ↓

Issuer Signs Credential

        ↓

Submit Contract to Midnight

        ↓

Notify Recipient

        ↓

Waiting for Acceptance
```

The issuer only sees the result.

---

## Sending State

```
Sending to

@joaquin.night

────────────────

Creating credential...

Signing...

Sending...
```

The individual technical steps may not even need to be shown in the final UX.

A simpler version:

```
Sending credential...

        ● ● ●
```

---

# 6. Success State

After the transaction has been submitted:

```
✓ Sent

Credential sent to

@joaquin.night

Waiting for recipient to accept.
```

Button:

```
Done
```

---

# 7. Holder — Mobile App

The holder should receive a notification.

Example:

```
WARD

Dr. Hector

wants to send you

Clonazepam Prescription
```

Opening the notification displays a very simple confirmation screen.

---

# 8. Credential Acceptance

```
Dr. Hector

wants to send you

🩺

Clonazepam Prescription

Valid until
30 Aug 2026

[ Accept ]

[ Decline ]
```

The user does not need to know that a smart contract exists.

They are simply accepting something into their wallet.

---

# 9. Accept Flow

The user presses:

```
Accept
```

WARD performs the required cryptographic / blockchain operations automatically.

Conceptually:

```
User accepts

        ↓

Holder binding / authorization

        ↓

Credential becomes associated
with the holder

        ↓

Credential available in WARD
```

The user sees:

```
✓ Added to WARD

Your credential is now available
in your wallet.
```

---

# 10. Wallet

The wallet itself should follow the **Apple Wallet mental model**.

Very simple.

```
WARD

Your Wallet

────────────────────────

🩺

Clonazepam Prescription

Dr. Hector

Valid until
30 Aug 2026

────────────────────────

🎓

Bachelor Degree

University of Buenos Aires

Verified

────────────────────────

💼

Employment Certificate

Company XYZ

Verified
```

Large cards.

Lots of whitespace.

Minimal information.

---

# 11. Credential Card

Each credential should be recognizable immediately.

Example:

```
┌──────────────────────────────┐

🩺

Prescription

Clonazepam

Dr. Hector

──────────────────────────────

Valid until
30 Aug 2026

✓ Valid

└──────────────────────────────┘
```

The issuer's identity can provide:

- Logo
- Name
- Brand color

But the overall WARD layout remains consistent.

---

# 12. Credential Detail

Opening the card:

```
Prescription

Clonazepam

Dr. Hector

────────────────────────

Valid until

30 Aug 2026

────────────────────────

Details

Take 0.5mg once daily
```

Primary actions:

```
Show

Share
```

Additional technical information should remain hidden.

---

# 13. Important UX Principle

The user should never think:

> "I received a smart contract."
> 

They should think:

> **"Dr. Hector sent me a prescription."**
> 

Similarly, the issuer should never think:

> "I deployed a credential contract."
> 

They should think:

> **"I sent a prescription to Joaquin's wallet."**
> 

This abstraction is fundamental to WARD.

---

# 14. Blockchain Is Invisible

The following should NEVER appear in the primary UI:

```
Transaction hash
Block number
Smart contract
Network
Gas
Private key
Public key
Signature
Wallet address
DID
```

These concepts can exist in developer/admin views if necessary, but never in the core user experience.

---

# 15. Issuer UX Summary

The entire issuer flow should effectively be:

```
New Credential

Recipient
@joaquin.night

Type
Prescription

Title
Clonazepam Prescription

Description
Take 0.5mg once daily

Valid Until
30 Aug 2026

        ↓

[ Send to Wallet ]

        ↓

✓ Sent
```

That's it.

---

# 16. Holder UX Summary

The holder experience:

```
Notification

Dr. Hector
sent you a credential

        ↓

Review

Clonazepam Prescription

Valid until
30 Aug 2026

        ↓

[ Accept ]   [ Decline ]

        ↓

✓ Added to WARD
```

Then it appears in the Wallet.

---

# 17. Design Direction

WARD should combine:

### Apple Wallet

For:

- Credential cards
- Minimalism
- Visual hierarchy
- Animations
- Familiar wallet metaphor

### Apple Pay

For:

- Confirmation flows
- User authorization
- Trust
- Simplicity

### Modern web forms

For:

- Issuer experience
- Fast credential creation
- Minimal fields
- Clear CTA

---

# 18. MVP Rule

The MVP should intentionally avoid building unnecessary functionality.

The first version only needs to prove this loop:

```
ISSUER

Create credential
       ↓
Enter @alias
       ↓
Send to Wallet

             ↓

HOLDER

Notification
       ↓
Review
       ↓
Accept / Decline
       ↓
Credential appears in Wallet
```

Everything else can come later.

The fundamental product promise is:

> **Trusted organizations can send verifiable credentials directly to a user's private wallet.**
> 

And the experience should be as simple as sending a message.
