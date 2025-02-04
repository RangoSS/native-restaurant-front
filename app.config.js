export default {
    expo: {
      name: "restaurant-front",
      slug: "restaurant-front",
      version: "1.0.0",
      platforms: ["ios", "android", "web"],
      android: {
        permissions: [
          "CAMERA",
          "ACCESS_FINE_LOCATION",
          "READ_EXTERNAL_STORAGE",
          "WRITE_EXTERNAL_STORAGE"
        ],
      },
      extra: {
        eas: {
          projectId: "your-project-id"
        }
      }
    }
  };
  