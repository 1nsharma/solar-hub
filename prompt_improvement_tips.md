# 💡 Prompt Improvement Tips for SolarHub

Based on a forensic analysis of past sessions, following these patterns will significantly improve AI performance, reduce cost, and minimize rework.

## 1. Persona-Specific Feature Isolation
**Issue**: Asking for "mobile and web changes" in one prompt often leads to the agent losing context on platform-specific constraints (e.g., trying to use DOM APIs in React Native).
**Tip**: Split prompts by user persona/platform.
- *Instead of*: "Update the order flow for everyone."
- *Use*: "Update the Customer mobile app order tracking view to include AMC status badges."

## 2. Definitive "Definition of Done"
**Issue**: Vague vision prompts (especially in Hindi) lead to the agent implementing "mock" services (like `storage.js` or `audit.js`) that may not align with your actual production intent.
**Tip**: Explicitly state if you want a **Mock**, a **Stub**, or a **Production-Ready** implementation.
- *Example*: "Implement a Storage service in `apps/backend/services/storage.js`. For now, just mock the S3 upload to local disk so I can test the UI."

## 3. Environment Context
**Issue**: Agents often struggle with local port conflicts (5000 vs 5173 vs 5174) or database state.
**Tip**: If you know the environment is in a specific state, tell the agent.
- *Example*: "The backend is currently running on port 5000 but the database needs to be re-seeded. Use the `init-db.js` script before implementing the new routes."

## 4. Multi-Language Prompting (Hindi/English)
**Issue**: High-level vision in Hindi is great for brainstorming, but technical execution benefits from English specificity to avoid "hallucinated" business logic.
**Tip**: Use Hindi for the **Why** and **What**, but use English (or code blocks) for the **How**.
- *Example*: "SolarHub को 'One-Step' बनाना है। Specifically: When a user enters their pincode, fetch the `solar_intensity` from a mock API and calculate the ROI."

## 5. Scope Batching
**Issue**: "Progressive Scope Expansion" (adding more tasks mid-session) leads to 100+ turn sessions that become expensive and slow.
**Tip**: If a new idea comes up while the agent is working, wait for the current task to finish, then start a **New Session**.
- **Benefit**: Keeps the context window clean and reduces the risk of the agent breaking existing code due to context overflow.
