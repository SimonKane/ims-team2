# ims-team2

Simon Kaneborn, William Gertoft, Saif Shamasha, Moa Sjögren

## Backend:

- .env-variablerna MONGODB_URI och PORT krävs för att köra koden.

- Det finns två npm run dev-kommandon:

  1. `npm run dev:rest` för rest-servern.
  2. `npm run dev:gql` för GraphQl-servern.

- Det finns en seed-fil i "seed/seed.js" som körs med `node seed/seed.js`.

## Frontend:

- I root finns även en mapp för frontend. Klienten är skapad med React.
- Mappen har en egen package.json. Kör `npm install`, sedan `npm run dev` för att testa.
