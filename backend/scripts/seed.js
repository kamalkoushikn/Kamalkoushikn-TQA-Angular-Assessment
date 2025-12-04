#!/usr/bin/env node
/**
 * MongoDB Seeder Script
 * Run with: node backend/scripts/seed.js
 * 
 * This script connects to MongoDB and seeds the database with sample astrology chart data.
 * Make sure MongoDB is running on localhost:27017 or update the connection string.
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const chartData = [
  {
    name: "Sample Chart 1",
    birthDate: new Date("1990-05-15"),
    birthTime: "10:30",
    birthLocation: "New York, NY",
    latitude: 40.7128,
    longitude: -74.0060,
    sunSign: "Taurus",
    moonSign: "Scorpio",
    risingSign: "Leo",
    planets: {
      sun: { sign: "Taurus", degree: 24 },
      moon: { sign: "Scorpio", degree: 12 },
      mercury: { sign: "Gemini", degree: 8 },
      venus: { sign: "Aries", degree: 18 },
      mars: { sign: "Pisces", degree: 6 },
      jupiter: { sign: "Cancer", degree: 15 },
      saturn: { sign: "Capricorn", degree: 22 },
      uranus: { sign: "Aquarius", degree: 3 },
      neptune: { sign: "Capricorn", degree: 11 },
      pluto: { sign: "Scorpio", degree: 14 }
    },
    isPublic: true,
    notes: "Sample chart for testing purposes",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Sample Chart 2",
    birthDate: new Date("1985-12-20"),
    birthTime: "14:45",
    birthLocation: "Los Angeles, CA",
    latitude: 34.0522,
    longitude: -118.2437,
    sunSign: "Sagittarius",
    moonSign: "Cancer",
    risingSign: "Virgo",
    planets: {
      sun: { sign: "Sagittarius", degree: 28 },
      moon: { sign: "Cancer", degree: 5 },
      mercury: { sign: "Capricorn", degree: 3 },
      venus: { sign: "Scorpio", degree: 15 },
      mars: { sign: "Libra", degree: 22 },
      jupiter: { sign: "Aquarius", degree: 7 },
      saturn: { sign: "Scorpio", degree: 19 },
      uranus: { sign: "Sagittarius", degree: 12 },
      neptune: { sign: "Capricorn", degree: 2 },
      pluto: { sign: "Scorpio", degree: 8 }
    },
    isPublic: true,
    notes: "Another sample chart",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Aries Fire Chart",
    birthDate: new Date("1992-04-05"),
    birthTime: "06:00",
    birthLocation: "Miami, FL",
    latitude: 25.7617,
    longitude: -80.1918,
    sunSign: "Aries",
    moonSign: "Leo",
    risingSign: "Aries",
    planets: {
      sun: { sign: "Aries", degree: 15 },
      moon: { sign: "Leo", degree: 22 },
      mercury: { sign: "Aries", degree: 8 },
      venus: { sign: "Pisces", degree: 28 },
      mars: { sign: "Aries", degree: 12 },
      jupiter: { sign: "Virgo", degree: 9 },
      saturn: { sign: "Aquarius", degree: 18 },
      uranus: { sign: "Capricorn", degree: 25 },
      neptune: { sign: "Capricorn", degree: 16 },
      pluto: { sign: "Scorpio", degree: 21 }
    },
    isPublic: true,
    notes: "Fire sign dominant chart",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Water Element Chart",
    birthDate: new Date("1988-07-22"),
    birthTime: "20:15",
    birthLocation: "Seattle, WA",
    latitude: 47.6062,
    longitude: -122.3321,
    sunSign: "Cancer",
    moonSign: "Pisces",
    risingSign: "Scorpio",
    planets: {
      sun: { sign: "Cancer", degree: 0 },
      moon: { sign: "Pisces", degree: 17 },
      mercury: { sign: "Cancer", degree: 5 },
      venus: { sign: "Leo", degree: 3 },
      mars: { sign: "Taurus", degree: 19 },
      jupiter: { sign: "Gemini", degree: 11 },
      saturn: { sign: "Pisces", degree: 7 },
      uranus: { sign: "Capricorn", degree: 29 },
      neptune: { sign: "Capricorn", degree: 13 },
      pluto: { sign: "Scorpio", degree: 18 }
    },
    isPublic: true,
    notes: "Water element emphasis",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Air Sign Chart",
    birthDate: new Date("1995-09-30"),
    birthTime: "12:30",
    birthLocation: "Denver, CO",
    latitude: 39.7392,
    longitude: -104.9903,
    sunSign: "Libra",
    moonSign: "Gemini",
    risingSign: "Aquarius",
    planets: {
      sun: { sign: "Libra", degree: 7 },
      moon: { sign: "Gemini", degree: 14 },
      mercury: { sign: "Libra", degree: 22 },
      venus: { sign: "Virgo", degree: 6 },
      mars: { sign: "Sagittarius", degree: 28 },
      jupiter: { sign: "Sagittarius", degree: 4 },
      saturn: { sign: "Pisces", degree: 12 },
      uranus: { sign: "Aquarius", degree: 8 },
      neptune: { sign: "Capricorn", degree: 20 },
      pluto: { sign: "Scorpio", degree: 9 }
    },
    isPublic: true,
    notes: "Air element dominant",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Earth Sign Chart",
    birthDate: new Date("1991-01-18"),
    birthTime: "16:45",
    birthLocation: "Austin, TX",
    latitude: 30.2672,
    longitude: -97.7431,
    sunSign: "Capricorn",
    moonSign: "Virgo",
    risingSign: "Taurus",
    planets: {
      sun: { sign: "Capricorn", degree: 28 },
      moon: { sign: "Virgo", degree: 11 },
      mercury: { sign: "Capricorn", degree: 19 },
      venus: { sign: "Sagittarius", degree: 23 },
      mars: { sign: "Cancer", degree: 15 },
      jupiter: { sign: "Leo", degree: 6 },
      saturn: { sign: "Aquarius", degree: 14 },
      uranus: { sign: "Capricorn", degree: 7 },
      neptune: { sign: "Capricorn", degree: 18 },
      pluto: { sign: "Scorpio", degree: 25 }
    },
    isPublic: true,
    notes: "Earth element focus",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Private Chart Example",
    birthDate: new Date("1993-11-08"),
    birthTime: "03:20",
    birthLocation: "Portland, OR",
    latitude: 45.5152,
    longitude: -122.6784,
    sunSign: "Scorpio",
    moonSign: "Capricorn",
    risingSign: "Pisces",
    planets: {
      sun: { sign: "Scorpio", degree: 16 },
      moon: { sign: "Capricorn", degree: 29 },
      mercury: { sign: "Scorpio", degree: 4 },
      venus: { sign: "Libra", degree: 27 },
      mars: { sign: "Virgo", degree: 13 },
      jupiter: { sign: "Libra", degree: 18 },
      saturn: { sign: "Pisces", degree: 5 },
      uranus: { sign: "Capricorn", degree: 22 },
      neptune: { sign: "Capricorn", degree: 9 },
      pluto: { sign: "Scorpio", degree: 16 }
    },
    isPublic: false,
    notes: "Private chart example",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Gemini Communication Chart",
    birthDate: new Date("1987-06-12"),
    birthTime: "11:00",
    birthLocation: "Boston, MA",
    latitude: 42.3601,
    longitude: -71.0589,
    sunSign: "Gemini",
    moonSign: "Aquarius",
    risingSign: "Gemini",
    planets: {
      sun: { sign: "Gemini", degree: 21 },
      moon: { sign: "Aquarius", degree: 8 },
      mercury: { sign: "Gemini", degree: 17 },
      venus: { sign: "Cancer", degree: 2 },
      mars: { sign: "Libra", degree: 26 },
      jupiter: { sign: "Aries", degree: 13 },
      saturn: { sign: "Sagittarius", degree: 20 },
      uranus: { sign: "Sagittarius", degree: 28 },
      neptune: { sign: "Capricorn", degree: 4 },
      pluto: { sign: "Scorpio", degree: 11 }
    },
    isPublic: true,
    notes: "Strong communication focus",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Leo Creative Chart",
    birthDate: new Date("1994-08-03"),
    birthTime: "18:30",
    birthLocation: "Nashville, TN",
    latitude: 36.1627,
    longitude: -86.7816,
    sunSign: "Leo",
    moonSign: "Sagittarius",
    risingSign: "Leo",
    planets: {
      sun: { sign: "Leo", degree: 11 },
      moon: { sign: "Sagittarius", degree: 19 },
      mercury: { sign: "Leo", degree: 26 },
      venus: { sign: "Virgo", degree: 14 },
      mars: { sign: "Taurus", degree: 7 },
      jupiter: { sign: "Scorpio", degree: 22 },
      saturn: { sign: "Pisces", degree: 3 },
      uranus: { sign: "Capricorn", degree: 15 },
      neptune: { sign: "Capricorn", degree: 1 },
      pluto: { sign: "Scorpio", degree: 19 }
    },
    isPublic: true,
    notes: "Creative and expressive",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Pisces Dreamer Chart",
    birthDate: new Date("1989-03-14"),
    birthTime: "22:00",
    birthLocation: "San Francisco, CA",
    latitude: 37.7749,
    longitude: -122.4194,
    sunSign: "Pisces",
    moonSign: "Cancer",
    risingSign: "Pisces",
    planets: {
      sun: { sign: "Pisces", degree: 23 },
      moon: { sign: "Cancer", degree: 10 },
      mercury: { sign: "Pisces", degree: 9 },
      venus: { sign: "Aquarius", degree: 16 },
      mars: { sign: "Gemini", degree: 4 },
      jupiter: { sign: "Cancer", degree: 28 },
      saturn: { sign: "Capricorn", degree: 11 },
      uranus: { sign: "Capricorn", degree: 5 },
      neptune: { sign: "Capricorn", degree: 14 },
      pluto: { sign: "Scorpio", degree: 12 }
    },
    isPublic: true,
    notes: "Intuitive and dreamy",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/astrology';
    
    console.log(`🔄 Connecting to MongoDB: ${mongoUri}...`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Get the database
    const db = mongoose.connection.db;
    
    // Drop existing collection
    const collections = await db.listCollections().toArray();
    const chartsCollectionExists = collections.some(col => col.name === 'charts');
    
    if (chartsCollectionExists) {
      await db.collection('charts').deleteMany({});
      console.log('🗑️  Cleared existing charts');
    }
    
    // Insert seed data
    const result = await db.collection('charts').insertMany(chartData);
    console.log(`✅ Seeded ${result.insertedIds.length} astrology charts`);
    
    // Verify data
    const count = await db.collection('charts').countDocuments();
    console.log(`📊 Total charts in database: ${count}`);
    
    await mongoose.connection.close();
    console.log('✅ Seeding complete! Database connection closed.');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
