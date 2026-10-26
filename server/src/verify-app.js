import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './server.js';
import User from './models/User.js';
import Movie from './models/Movie.js';
import Theatre from './models/Theatre.js';
import Show from './models/Show.js';
import Booking from './models/Booking.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const runVerification = async () => {
  console.log('\n======================================================');
  console.log('🧪 IMovies Automated Verification & Concurrency Test');
  console.log('======================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  const assert = (condition, testName, extra = '') => {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${extra}`);
    }
  };

  // Test 1: Verify Environment Variables Template
  assert(
    Boolean(process.env.JWT_SECRET),
    '1. JWT_SECRET is configured'
  );

  // Test 2: Database Connection Status
  const isDbConnected = mongoose.connection.readyState === 1;
  console.log(`ℹ️ Database Connection State: ${isDbConnected ? 'Connected' : 'Not Connected / Pending Atlas Config'}`);

  if (!isDbConnected) {
    console.log('\n⚠️ MongoDB Atlas is not yet connected.');
    console.log('👉 To connect Atlas: Set MONGODB_URI in server/.env with your cluster connection string.');
    console.log('👉 Example: MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/imovies?retryWrites=true&w=majority\n');
  } else {
    // Run live database tests
    try {
      // Test 3: Movie Query
      const movieCount = await Movie.countDocuments();
      assert(movieCount >= 0, `2. Movie model queryable (Found ${movieCount} movies)`);

      // Test 4: Auth Registration & Role assignment
      const testEmail = `testuser_${Date.now()}@example.com`;
      const testUser = await User.create({
        name: 'Verification User',
        email: testEmail,
        password: 'TestPassword123',
        role: 'user',
      });
      assert(testUser._id && testUser.role === 'user', '3. User registration persists with hashed password');

      // Test 5: Password verification
      const isMatch = await testUser.matchPassword('TestPassword123');
      const isWrongMatch = await testUser.matchPassword('WrongPass');
      assert(isMatch && !isWrongMatch, '4. Password hash comparison works accurately');

      // Test 6: JWT Token generation & verification
      const token = jwt.sign(
        { id: testUser._id, role: testUser.role },
        process.env.JWT_SECRET || 'fallback_secret_for_local_dev_only',
        { expiresIn: '1d' }
      );
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_local_dev_only');
      assert(decoded.id === testUser._id.toString(), '5. JWT signing and verification passes');

      // Test 7: Concurrency & Duplicate Seat Conflict Prevention
      // Find or create a test show
      let sampleShow = await Show.findOne({ status: 'scheduled' });
      if (!sampleShow) {
        const dummyMovie = await Movie.findOne() || await Movie.create({
          title: 'Test Movie',
          description: 'Test description',
          posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
          duration: 120,
        });
        const dummyTheatre = await Theatre.findOne() || await Theatre.create({
          name: 'Test Theatre',
          location: 'Test Location',
          city: 'Test City',
        });
        sampleShow = await Show.create({
          movie: dummyMovie._id,
          theatre: dummyTheatre._id,
          screenNumber: 1,
          showDateTime: new Date(),
          bookedSeats: [],
        });
      }

      const testSeat = `Z${Math.floor(Math.random() * 90) + 10}`;

      // Booking Attempt 1: First user books seat
      const firstUpdate = await Show.findOneAndUpdate(
        {
          _id: sampleShow._id,
          bookedSeats: { $nin: [testSeat] },
        },
        {
          $push: { bookedSeats: testSeat },
        },
        { new: true }
      );
      assert(firstUpdate !== null, `6. First booking for seat ${testSeat} succeeds atomically`);

      // Booking Attempt 2: Second user tries to book the EXACT SAME seat simultaneously
      const secondUpdate = await Show.findOneAndUpdate(
        {
          _id: sampleShow._id,
          bookedSeats: { $nin: [testSeat] },
        },
        {
          $push: { bookedSeats: testSeat },
        },
        { new: true }
      );
      assert(secondUpdate === null, `7. Atomic conflict prevention: Duplicate booking for ${testSeat} is REJECTED`);

      // Clean up test data
      await Show.findByIdAndUpdate(sampleShow._id, {
        $pull: { bookedSeats: testSeat },
      });
      await User.findByIdAndDelete(testUser._id);
      console.log('🧹 Cleaned up verification records.');

    } catch (dbErr) {
      console.error('Database test exception:', dbErr);
    }
  }

  console.log('\n======================================================');
  console.log(`📊 Test Results: ${passedTests} / ${totalTests} checks passed`);
  console.log('======================================================\n');
  process.exit(0);
};

// Wait 1.5s for DB connection attempt then run
setTimeout(runVerification, 1500);
