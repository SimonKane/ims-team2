# ims-team2

Simon Kaneborn, William Gertoft, Saif Shamasha, Moa Sjögren

## Backend:

- .env-variablerna MONGODB_URI och PORT krävs för att köra koden.
- `DOTENV_CONFIG_QUIET=true` gör så att man slipper läsa dotenvs tips och tricks varje gång man uppdaterar en fil.

```
  MONGODB_URI="länk-här"
  PORT=3000
  DOTENV_CONFIG_QUIET=true
```

- Det finns två npm run dev-kommandon:

  1. `npm run dev:rest` för rest-servern.
  2. `npm run dev:gql` för GraphQl-servern.

- Det finns en seed-fil i "seed/seed.js" som körs med `node seed/seed.js`.

## Frontend:

Klienten visar upp utvalda delar av vad servern kan göra. Exempelvis lista manufacturers och products, sortera och söka.

- I root finns även en mapp för frontend. Klienten är skapad med React och Vite.
- Mappen har en egen package.json. Kör `npm install`, sedan `npm run dev` för att testa.
- Klienten är kopplad till rest-servern.
