export default {
  "expo": {
    "name": "nuvualt-frontend",
    "slug": "nuvualt-frontend",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mogas.nuvault",
      "googleServicesFile": process.env.GOOGLE_SERVICES_INFOPLIST
    },
    "android": {
      "package": "com.mogas.nuvault",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-web-browser",
      "@react-native-google-signin/google-signin"
    ],
    "scheme": "nuvault",
    "extra": {
      "GOOGLE_CLIENT_ID_WEB": "353964303816-3gkgjiavsklvno2dr5mqrpjfqcsi2sm2.apps.googleusercontent.com",
      "GOOGLE_CLIENT_ID_ANDROID": "353964303816-rksfsisaanuqe1q9ppsneg3f968krpg1.apps.googleusercontent.com",
      "router": {},
      "eas": {
        "projectId": "806b0060-f444-4eed-8fa3-2b145f8a0f70"
      }
    }
  }
}
