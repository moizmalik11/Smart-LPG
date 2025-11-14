# Smart LPG Store (React)

A minimal React app (JSX) to manage a single LPG shop dashboard. It includes:
- Admin login (shop name)
- Inventory (45kg example), receive shipments and record sales
- Per-kg rate input — used to compute sale amounts for 45kg cylinders
- Transaction list and today's sales summary

Setup (Windows PowerShell):

```powershell
# 1) Install dependencies
npm install

# 2) Run dev server
npm run dev

# Then open the printed local URL (http://localhost:5173 by default)
```

Notes:
- This is a client-only demo that persists data to `localStorage` per shop id.
- Login accepts any password; the shop name is used as an id.
- Feel free to extend with backend, authentication, extra cylinder sizes, and reports.
