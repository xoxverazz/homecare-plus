// Hospital Controller
const { pool } = require('../config/database');

// Get nearby hospitals using Haversine formula
exports.getNearbyHospitals = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusKm = parseFloat(radius);
    
    // Haversine formula to calculate distance
    const [hospitals] = await pool.query(
      `SELECT 
        hospital_id,
        hospital_name,
        address,
        city,
        state,
        phone,
        latitude,
        longitude,
        specialties,
        emergency_available,
        rating,
        (6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians(?)) + 
          sin(radians(?)) * sin(radians(latitude))
        )) AS distance
       FROM hospitals
       HAVING distance <= ?
       ORDER BY distance
       LIMIT 20`,
      [lat, lng, lat, radiusKm]
    );
    
    res.json({
      success: true,
      hospitals,
      count: hospitals.length,
      searchRadius: radiusKm
    });
  } catch (error) {
    console.error('Get nearby hospitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby hospitals'
    });
  }
};

// Get hospital by ID
exports.getHospitalById = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    
    const [hospitals] = await pool.query(
      'SELECT * FROM hospitals WHERE hospital_id = ?',
      [hospitalId]
    );
    
    if (hospitals.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }
    
    res.json({
      success: true,
      hospital: hospitals[0]
    });
  } catch (error) {
    console.error('Get hospital error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hospital details'
    });
  }
};

// Search hospitals by city
exports.searchHospitalsByCity = async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City is required'
      });
    }
    
    const [hospitals] = await pool.query(
      'SELECT * FROM hospitals WHERE city LIKE ? ORDER BY rating DESC LIMIT 20',
      [`%${city}%`]
    );
    
    res.json({
      success: true,
      hospitals,
      count: hospitals.length
    });
  } catch (error) {
    console.error('Search hospitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search hospitals'
    });
  }
};

// Add sample hospitals (for initial setup)
exports.addSampleHospitals = async (req, res) => {
  try {
    const sampleHospitals = [
      {
        hospital_name: 'All India Institute of Medical Sciences (AIIMS)',
        address: 'Ansari Nagar, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110029',
        phone: '011-26588500',
        latitude: 28.5672,
        longitude: 77.2100,
        specialties: 'Cardiology, Neurology, Oncology, Emergency',
        emergency_available: 1,
        rating: 4.8
      },
      {
        hospital_name: 'Apollo Hospital',
        address: 'Greams Road, Chennai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600006',
        phone: '044-28293333',
        latitude: 13.0569,
        longitude: 80.2497,
        specialties: 'Multi-specialty, Emergency, ICU',
        emergency_available: 1,
        rating: 4.6
      },
      {
        hospital_name: 'Fortis Hospital',
        address: 'Sector 62, Noida',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        phone: '0120-3882222',
        latitude: 28.6139,
        longitude: 77.3910,
        specialties: 'Cardiology, Orthopedics, Emergency',
        emergency_available: 1,
        rating: 4.5
      },
      {
        hospital_name: 'Lilavati Hospital',
        address: 'Bandra West, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        phone: '022-26567891',
        latitude: 19.0596,
        longitude: 72.8295,
        specialties: 'Multi-specialty, Emergency, Trauma Care',
        emergency_available: 1,
        rating: 4.7
      },
      {
        hospital_name: 'Manipal Hospital',
        address: 'HAL Airport Road, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560017',
        phone: '080-25023344',
        latitude: 12.9716,
        longitude: 77.5946,
        specialties: 'Multi-specialty, Emergency, Pediatrics',
        emergency_available: 1,
        rating: 4.6
      }
    ];
    
    for (const hospital of sampleHospitals) {
      await pool.query(
        `INSERT INTO hospitals (hospital_name, address, city, state, pincode, phone, latitude, longitude, specialties, emergency_available, rating) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE hospital_name = hospital_name`,
        [
          hospital.hospital_name,
          hospital.address,
          hospital.city,
          hospital.state,
          hospital.pincode,
          hospital.phone,
          hospital.latitude,
          hospital.longitude,
          hospital.specialties,
          hospital.emergency_available,
          hospital.rating
        ]
      );
    }
    
    res.json({
      success: true,
      message: 'Sample hospitals added successfully'
    });
  } catch (error) {
    console.error('Add sample hospitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add sample hospitals'
    });
  }
};
