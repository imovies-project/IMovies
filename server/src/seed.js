import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Movie from './models/Movie.js';
import Theatre from './models/Theatre.js';
import Show from './models/Show.js';
import Booking from './models/Booking.js';
import { connectDB } from './config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting IMovies database seeding...');
    const connected = await connectDB();

    if (!connected) {
      console.error('❌ Could not connect to database. Ensure MONGODB_URI is set.');
      process.exit(1);
    }

    // Clean existing records safely
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});

    console.log('🧹 Cleared existing database records.');

    // 1. Seed Users (1 Admin, 1 Regular Demo User)
    const adminUser = await User.create({
      name: 'IMovies Admin',
      email: process.env.ADMIN_EMAIL || 'admin@imovies.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'admin',
      phone: '+91 98765 43210',
    });

    const demoUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'User@12345',
      role: 'user',
      phone: '+91 91234 56789',
    });

    console.log(`👤 Created Admin (${adminUser.email}) and Demo User (${demoUser.email})`);

    // 2. Seed Movies with rich data and reliable high-resolution posters
    const moviesData = [
      {
        title: 'Dune: Part Two',
        description:
          'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
        posterUrl:
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        backdropUrl:
          'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
        genre: ['Sci-Fi', 'Adventure', 'Action'],
        language: 'English',
        duration: 166,
        rating: 8.8,
        releaseDate: new Date('2024-03-01'),
        trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
        status: 'now-showing',
        director: 'Denis Villeneuve',
        cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler'],
        featured: true,
      },
      {
        title: 'Oppenheimer',
        description:
          'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the profound moral dilemmas and geopolitical fallout.',
        posterUrl:
          'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
        backdropUrl:
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        genre: ['Biography', 'Drama', 'History'],
        language: 'English',
        duration: 180,
        rating: 8.9,
        releaseDate: new Date('2023-07-21'),
        trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
        status: 'now-showing',
        director: 'Christopher Nolan',
        cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
        featured: true,
      },
      {
        title: 'Cyberpunk: Neon Genesis',
        description:
          'In a sprawling rain-drenched megacity of 2088, an augmented neural investigator uncovers a syndicate synthesizing human memories to alter reality itself.',
        posterUrl:
          'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
        backdropUrl:
          'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80',
        genre: ['Sci-Fi', 'Thriller', 'Action'],
        language: 'English',
        duration: 135,
        rating: 8.4,
        releaseDate: new Date('2024-04-15'),
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        status: 'now-showing',
        director: 'Elena Rostova',
        cast: ['Kenji Sato', 'Maya Lin', 'Alexei Vance'],
        featured: true,
      },
      {
        title: 'The Dark Knight Returns: Legacy',
        description:
          'Gotham faces an unprecedented technological siege orchestrated by an enigmatic mastermind known as The Architect. An aging Bruce Wayne must push beyond his limits.',
        posterUrl:
          'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
        backdropUrl:
          'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
        genre: ['Action', 'Crime', 'Drama'],
        language: 'English',
        duration: 152,
        rating: 9.0,
        releaseDate: new Date('2024-05-10'),
        trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        status: 'now-showing',
        director: 'Jonathan Nolan',
        cast: ['Christian Bale', 'Gary Oldman', 'Michael Caine'],
        featured: false,
      },
      {
        title: 'Interstellar Odyssey',
        description:
          'A team of courageous explorers travels through a newly discovered wormhole near Saturn in an audacious attempt to find a habitable sanctuary for humanity.',
        posterUrl:
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        backdropUrl:
          'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80',
        genre: ['Sci-Fi', 'Adventure', 'Drama'],
        language: 'English',
        duration: 169,
        rating: 8.7,
        releaseDate: new Date('2024-06-01'),
        trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        status: 'coming-soon',
        director: 'Christopher Nolan',
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
        featured: false,
      },
      {
        title: 'Spider-Man: Across the Multiverse',
        description:
          'Miles Morales catapults across the Multiverse, encountering a society of Spider-Heroes charged with protecting its existence. When heroes clash, Miles redefines what it means to be a hero.',
        posterUrl:
          'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
        backdropUrl:
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
        genre: ['Animation', 'Action', 'Adventure'],
        language: 'English',
        duration: 140,
        rating: 8.9,
        releaseDate: new Date('2024-06-15'),
        trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
        status: 'coming-soon',
        director: 'Joaquim Dos Santos',
        cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
        featured: false,
      },
    ];

    const seededMovies = await Movie.insertMany(moviesData);
    console.log(`🎬 Seeded ${seededMovies.length} movies.`);

    // 3. Seed Theatres
    const theatresData = [
      {
        name: 'IMovies Luxe IMAX & 4DX - Palladium',
        location: 'Level 5, High Street Mall, Senapati Bapat Marg',
        city: 'Mumbai',
        amenities: ['IMAX with Laser', 'Dolby Atmos', 'Recliner Seats', 'Gourmet Lounge'],
        totalScreens: 3,
        screens: [
          {
            screenNumber: 1,
            name: 'IMAX Laser Audi 1',
            seatingCapacity: 80,
            seatLayout: {
              rows: 8,
              cols: 10,
              vipRows: ['A', 'B'],
              premiumRows: ['C', 'D', 'E'],
              standardRows: ['F', 'G', 'H'],
            },
          },
          {
            screenNumber: 2,
            name: 'Dolby Atmos Audi 2',
            seatingCapacity: 80,
            seatLayout: {
              rows: 8,
              cols: 10,
              vipRows: ['A', 'B'],
              premiumRows: ['C', 'D', 'E'],
              standardRows: ['F', 'G', 'H'],
            },
          },
        ],
      },
      {
        name: 'IMovies Premiere Cineplex - Nexus Koramangala',
        location: 'Hosur Main Road, Koramangala 7th Block',
        city: 'Bangalore',
        amenities: ['4K Dolby Vision', 'Dolby Atmos 7.1', 'Plush Rocker Chairs', 'Snack Bar'],
        totalScreens: 2,
        screens: [
          {
            screenNumber: 1,
            name: 'Audi 1 (Dolby Vision)',
            seatingCapacity: 80,
            seatLayout: {
              rows: 8,
              cols: 10,
              vipRows: ['A', 'B'],
              premiumRows: ['C', 'D', 'E'],
              standardRows: ['F', 'G', 'H'],
            },
          },
        ],
      },
      {
        name: 'IMovies Gold Class - Select Citywalk',
        location: 'A3 District Centre, Saket',
        city: 'Delhi NCR',
        amenities: ['Full Recliner Seating', 'In-seat Butler Service', 'Chef Special Menu'],
        totalScreens: 2,
        screens: [
          {
            screenNumber: 1,
            name: 'Gold Class 1',
            seatingCapacity: 80,
            seatLayout: {
              rows: 8,
              cols: 10,
              vipRows: ['A', 'B'],
              premiumRows: ['C', 'D', 'E'],
              standardRows: ['F', 'G', 'H'],
            },
          },
        ],
      },
    ];

    const seededTheatres = await Theatre.insertMany(theatresData);
    console.log(`🏛️ Seeded ${seededTheatres.length} theatres.`);

    // 4. Seed Shows for Today, Tomorrow, and Day After Tomorrow
    const showsData = [];
    const nowShowingMovies = seededMovies.filter((m) => m.status === 'now-showing');

    // Generate dates: today, tomorrow, day 3
    const days = [0, 1, 2];
    const timeSlots = [
      { hour: 10, minute: 30, format: '2D' },
      { hour: 14, minute: 15, format: 'IMAX 2D' },
      { hour: 18, minute: 0, format: '3D' },
      { hour: 21, minute: 30, format: 'IMAX 3D' },
    ];

    days.forEach((dayOffset) => {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + dayOffset);

      seededTheatres.forEach((theatre) => {
        nowShowingMovies.forEach((movie, mIdx) => {
          // Add 2 showtimes per movie per theatre per day
          const slotsForThisMovie = [
            timeSlots[mIdx % timeSlots.length],
            timeSlots[(mIdx + 2) % timeSlots.length],
          ];

          slotsForThisMovie.forEach((slot, sIdx) => {
            const showTime = new Date(baseDate);
            showTime.setHours(slot.hour, slot.minute, 0, 0);

            // Seed a few pre-booked seats for realism
            const preBooked = dayOffset === 0 && sIdx === 0 ? ['C4', 'C5', 'D6', 'D7'] : [];

            showsData.push({
              movie: movie._id,
              theatre: theatre._id,
              screenNumber: 1,
              screenName: theatre.screens[0]?.name || 'Audi 1',
              showDateTime: showTime,
              format: slot.format,
              pricing: {
                vip: slot.format.includes('IMAX') ? 450 : 380,
                premium: slot.format.includes('IMAX') ? 320 : 260,
                standard: slot.format.includes('IMAX') ? 220 : 180,
              },
              totalSeats: 80,
              bookedSeats: preBooked,
              status: 'scheduled',
            });
          });
        });
      });
    });

    const seededShows = await Show.insertMany(showsData);
    console.log(`🎟️ Seeded ${seededShows.length} shows across multiple dates and theatres.`);

    // 5. Seed a sample booking for the demo user
    if (seededShows.length > 0) {
      const sampleShow = seededShows[0];
      await Booking.create({
        bookingReference: 'IMV-INIT-DEMO1',
        user: demoUser._id,
        show: sampleShow._id,
        movie: sampleShow.movie,
        theatre: sampleShow.theatre,
        seats: [
          { seatNumber: 'C4', row: 'C', col: 4, type: 'premium', price: 260 },
          { seatNumber: 'C5', row: 'C', col: 5, type: 'premium', price: 260 },
        ],
        subtotal: 520,
        convenienceFee: 50,
        tax: 103,
        totalAmount: 673,
        paymentStatus: 'completed',
        paymentMethod: 'UPI (Mock Test Mode)',
        bookingStatus: 'confirmed',
      });
      console.log('📦 Created initial sample confirmed booking.');
    }

    console.log('\n✨ Database seeding completed successfully!');
    console.log('--------------------------------------------------');
    console.log('Admin Account:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@12345'}`);
    console.log('Demo User Account:');
    console.log(`   Email: ${demoUser.email}`);
    console.log(`   Password: User@12345`);
    console.log('--------------------------------------------------\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
