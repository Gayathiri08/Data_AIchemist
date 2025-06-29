# 🧪 Data Alchemist

**Data Alchemist** is an AI-powered data grid and scheduling web application built using **Next.js**, **TypeScript**, and smart validation logic. It enables non-technical users to upload, edit, validate, and prioritize CSV/XLSX data through an intuitive interface.

---

## 🧠 Features

### ✅ Milestone 1: Smart Data Upload & Validation
- Upload `clients.csv`, `workers.csv`, and `tasks.csv` via drag-and-drop
- Inline editable data grid
- Real-time validation of:
  - Missing columns
  - Duplicate IDs
  - Invalid ranges (e.g., priority levels)
  - JSON field parsing
  - List format checks

### 📏 Milestone 2: Rule Engine & Prioritization
- Add **business rules** like co-running tasks or qualification constraints
- Adjustable sliders for:
  - **Priority vs Fairness**
  - **Efficiency vs Cost**
- Export final schedule configuration to JSON

### 🗣️ Milestone 3: Natural Language Filtering (AI-Powered)
- Type queries like:
  - `"Duration > 2 and PreferredPhases includes 3"`
  - `"QualificationLevel >= 4 and MaxLoadPerPhase < 5"`
- AI translates the sentence into a filter expression dynamically

---

## 🚀 Deployment

You can access the deployed application over your local network at:

### 🔗 [http://192.168.0.3:3000/](http://192.168.0.3:3000/)

> ⚠️ Make sure your device is connected to the **same Wi-Fi** as the host PC to access the app from other devices.

---

## 🛠️ Getting Started (Local Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/Gayathiri08/Data_AIchemist.git
cd Data_AIchemist


The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
