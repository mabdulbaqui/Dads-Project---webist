# 📋 Neon Color Website - Content Update Guide

This guide explains how to update website content **without any coding**. All content is stored in JSON files in the `data/` folder.

---

## 📁 File Locations

| File                 | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `data/content.json`  | General text (hero, navigation, contact, footer) |
| `data/projects.json` | Project portfolio                                |
| `data/services.json` | Services catalog                                 |
| `data/seo.json`      | SEO metadata                                     |

---

## 🖼️ How to Add a New Project

1. **Open** `data/projects.json` in any text editor (Notepad, VS Code, etc.)

2. **Find** the `"projects"` array

3. **Add** a new project object at the end (before the closing `]`):

```json
{
  "id": 7,
  "title": {
    "ar": "اسم المشروع بالعربي",
    "en": "Project Name in English"
  },
  "description": {
    "ar": "وصف المشروع بالعربي",
    "en": "Project description in English"
  },
  "category": "retail",
  "images": ["assets/images/projects/new-project.jpg"],
  "featured": true
}
```

4. **Upload your image** to `assets/images/projects/`

5. **Save** the file and refresh the website

### Project Categories

- `hospital` - مستشفيات
- `retail` - محلات تجارية
- `outdoor` - لافتات خارجية
- `indoor` - ديكور داخلي

---

## 📞 How to Update Contact Information

1. **Open** `data/content.json`

2. **Find** the `"contact"` section

3. **Update** the values:

```json
"contact": {
  "whatsapp": "+201234567890",
  "phone": "+20123456789",
  "email": "info@neoncolor.com",
  "address": {
    "ar": "القاهرة، مصر",
    "en": "Cairo, Egypt"
  }
}
```

4. **Save** and refresh

---

## 🔧 How to Add a New Service

1. **Open** `data/services.json`

2. **Add** a new service object:

```json
{
  "id": 7,
  "title": {
    "ar": "اسم الخدمة",
    "en": "Service Name"
  },
  "description": {
    "ar": "وصف الخدمة",
    "en": "Service description"
  },
  "icon": "sign",
  "features": {
    "ar": ["ميزة 1", "ميزة 2", "ميزة 3"],
    "en": ["Feature 1", "Feature 2", "Feature 3"]
  }
}
```

### Available Icons

- `sign` - لافتات
- `hospital` - مستشفيات
- `store` - محلات
- `paint` - ديكور
- `print` - طباعة
- `lightbulb` - إضاءة

---

## 📈 How to Update Statistics

1. **Open** `data/content.json`

2. **Find** the `"stats"` section:

```json
"stats": {
  "years": 15,
  "clients": 500,
  "projects": 1200
}
```

3. **Update** the numbers and save

---

## 🔍 How to Update SEO Metadata

1. **Open** `data/seo.json`

2. **Update** titles and descriptions:

```json
"home": {
  "ar": {
    "title": "نيون كولر | شركة دعاية واعلان",
    "description": "وصف الموقع بالعربي...",
    "keywords": "كلمات مفتاحية..."
  },
  "en": {
    "title": "Neon Color | Advertising Company",
    "description": "Site description in English...",
    "keywords": "keywords here..."
  }
}
```

---

## 🌐 How to Update Social Media Links

1. **Open** `data/content.json`

2. **Find** the `"social"` section:

```json
"social": {
  "facebook": "https://facebook.com/neoncolor",
  "instagram": "https://instagram.com/neoncolor",
  "tiktok": "https://tiktok.com/@neoncolor"
}
```

3. **Update** the URLs and save

---

## 📸 Image Guidelines

### Project Images

- **Size**: 800 x 600 pixels (recommended)
- **Format**: JPG or WebP
- **Location**: `assets/images/projects/`
- **Naming**: Use lowercase, no spaces (e.g., `hospital-project-1.jpg`)

### Brand Images

- **Logo**: `assets/images/brand/logo.png`
- **OpenGraph**: `assets/images/brand/og-image.jpg` (1200 x 630 pixels)

---

## ⚠️ Important Notes

1. **Always keep backups** before making changes
2. **Test on a local server** before uploading
3. **Validate JSON** at [jsonlint.com](https://jsonlint.com/) if you get errors
4. **Don't forget commas** between items in arrays
5. **Use double quotes** for all strings

---

## 🚀 Deploying Changes

1. Make your changes to the JSON files
2. Test locally by opening `index.html` in a browser
3. Upload the changed files to your web hosting
4. Clear browser cache (Ctrl+F5) to see updates

---

## 🆘 Need Help?

If you encounter any issues, contact your web developer or email the original creator with the error message and what you were trying to do.
