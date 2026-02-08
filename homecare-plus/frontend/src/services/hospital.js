// Hospital Service
import { hospitalAPI } from './api';

/**
 * Hospital Service
 * Handles all hospital-related operations including location-based search,
 * caching, and Google Maps integration
 */

class HospitalService {
  constructor() {
    this.cachedHospitals = null;
    this.cacheTimestamp = null;
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get user's current location using browser Geolocation API
   * @returns {Promise<{latitude: number, longitude: number}>}
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let errorMessage = 'Unable to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location services.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  /**
   * Get nearby hospitals based on current location
   * @param {number} radius - Search radius in kilometers (default: 10)
   * @param {boolean} useCache - Whether to use cached results (default: true)
   * @returns {Promise<Array>}
   */
  async getNearbyHospitals(radius = 10, useCache = true) {
    try {
      // Check cache first
      if (useCache && this.isCacheValid()) {
        return this.cachedHospitals;
      }

      // Get current location
      const location = await this.getCurrentLocation();
      
      // Fetch hospitals from API
      const response = await hospitalAPI.getNearby(
        location.latitude,
        location.longitude,
        radius
      );

      if (response.data.success) {
        this.cachedHospitals = response.data.hospitals;
        this.cacheTimestamp = Date.now();
        return response.data.hospitals;
      }

      throw new Error(response.data.message || 'Failed to fetch hospitals');
    } catch (error) {
      console.error('Error getting nearby hospitals:', error);
      throw error;
    }
  }

  /**
   * Get hospitals by specific coordinates
   * @param {number} latitude 
   * @param {number} longitude 
   * @param {number} radius - Search radius in kilometers
   * @returns {Promise<Array>}
   */
  async getHospitalsByLocation(latitude, longitude, radius = 10) {
    try {
      const response = await hospitalAPI.getNearby(latitude, longitude, radius);
      
      if (response.data.success) {
        return response.data.hospitals;
      }

      throw new Error(response.data.message || 'Failed to fetch hospitals');
    } catch (error) {
      console.error('Error getting hospitals by location:', error);
      throw error;
    }
  }

  /**
   * Search hospitals by city name
   * @param {string} city 
   * @returns {Promise<Array>}
   */
  async searchByCity(city) {
    try {
      if (!city || city.trim() === '') {
        throw new Error('City name is required');
      }

      const response = await hospitalAPI.searchByCity(city.trim());
      
      if (response.data.success) {
        return response.data.hospitals;
      }

      throw new Error(response.data.message || 'Failed to search hospitals');
    } catch (error) {
      console.error('Error searching hospitals:', error);
      throw error;
    }
  }

  /**
   * Get hospital details by ID
   * @param {number} hospitalId 
   * @returns {Promise<Object>}
   */
  async getHospitalDetails(hospitalId) {
    try {
      const response = await hospitalAPI.getDetails(hospitalId);
      
      if (response.data.success) {
        return response.data.hospital;
      }

      throw new Error(response.data.message || 'Failed to fetch hospital details');
    } catch (error) {
      console.error('Error getting hospital details:', error);
      throw error;
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param {number} lat1 
   * @param {number} lon1 
   * @param {number} lat2 
   * @param {number} lon2 
   * @returns {number} Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees 
   * @returns {number}
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Generate Google Maps URL for a hospital
   * @param {Object} hospital 
   * @returns {string}
   */
  getGoogleMapsUrl(hospital) {
    if (hospital.latitude && hospital.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`;
    }
    
    // Fallback to address search
    const address = `${hospital.hospital_name}, ${hospital.address}, ${hospital.city}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  /**
   * Get directions URL from user location to hospital
   * @param {Object} hospital 
   * @param {Object} userLocation - {latitude, longitude}
   * @returns {string}
   */
  getDirectionsUrl(hospital, userLocation = null) {
    if (!userLocation) {
      return this.getGoogleMapsUrl(hospital);
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${hospital.latitude},${hospital.longitude}`;
  }

  /**
   * Make a phone call to hospital
   * @param {string} phoneNumber 
   */
  callHospital(phoneNumber) {
    if (!phoneNumber) {
      console.error('Phone number not available');
      return;
    }

    window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
  }

  /**
   * Filter hospitals by specialty
   * @param {Array} hospitals 
   * @param {string} specialty 
   * @returns {Array}
   */
  filterBySpecialty(hospitals, specialty) {
    if (!specialty || specialty.trim() === '') {
      return hospitals;
    }

    return hospitals.filter(hospital => {
      if (!hospital.specialties) return false;
      return hospital.specialties.toLowerCase().includes(specialty.toLowerCase());
    });
  }

  /**
   * Filter hospitals with emergency services
   * @param {Array} hospitals 
   * @returns {Array}
   */
  filterEmergencyOnly(hospitals) {
    return hospitals.filter(hospital => hospital.emergency_available === 1);
  }

  /**
   * Sort hospitals by distance
   * @param {Array} hospitals 
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array}
   */
  sortByDistance(hospitals, order = 'asc') {
    return [...hospitals].sort((a, b) => {
      const distanceA = a.distance || 0;
      const distanceB = b.distance || 0;
      return order === 'asc' ? distanceA - distanceB : distanceB - distanceA;
    });
  }

  /**
   * Sort hospitals by rating
   * @param {Array} hospitals 
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array}
   */
  sortByRating(hospitals, order = 'desc') {
    return [...hospitals].sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return order === 'desc' ? ratingB - ratingA : ratingA - ratingB;
    });
  }

  /**
   * Check if cache is still valid
   * @returns {boolean}
   */
  isCacheValid() {
    if (!this.cachedHospitals || !this.cacheTimestamp) {
      return false;
    }

    const now = Date.now();
    return (now - this.cacheTimestamp) < this.CACHE_DURATION;
  }

  /**
   * Clear cached hospitals
   */
  clearCache() {
    this.cachedHospitals = null;
    this.cacheTimestamp = null;
  }

  /**
   * Get hospital rating stars
   * @param {number} rating 
   * @returns {Object} {full: number, half: boolean, empty: number}
   */
  getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return {
      full: fullStars,
      half: hasHalfStar,
      empty: emptyStars
    };
  }

  /**
   * Format phone number for display
   * @param {string} phone 
   * @returns {string}
   */
  formatPhoneNumber(phone) {
    if (!phone) return 'N/A';
    
    // Remove any existing formatting
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as: 000-00000000 or based on length
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    
    return phone;
  }

  /**
   * Get distance display text
   * @param {number} distance - Distance in kilometers
   * @returns {string}
   */
  getDistanceText(distance) {
    if (!distance) return 'Distance unknown';
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)} meters`;
    }
    
    return `${distance.toFixed(1)} km`;
  }

  /**
   * Add sample hospitals (for testing/demo)
   * @returns {Promise<Object>}
   */
  async addSampleHospitals() {
    try {
      const response = await hospitalAPI.addSample();
      return response.data;
    } catch (error) {
      console.error('Error adding sample hospitals:', error);
      throw error;
    }
  }

  /**
   * Share hospital details
   * @param {Object} hospital 
   */
  async shareHospital(hospital) {
    const shareData = {
      title: hospital.hospital_name,
      text: `${hospital.hospital_name}\n${hospital.address}, ${hospital.city}\nPhone: ${hospital.phone}`,
      url: this.getGoogleMapsUrl(hospital)
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        this.copyToClipboard(shareData.text);
      }
    } else {
      this.copyToClipboard(shareData.text);
    }
  }

  /**
   * Copy text to clipboard
   * @param {string} text 
   */
  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Hospital details copied to clipboard!');
      }).catch(() => {
        this.fallbackCopyToClipboard(text);
      });
    } else {
      this.fallbackCopyToClipboard(text);
    }
  }

  /**
   * Fallback clipboard copy method
   * @param {string} text 
   */
  fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      alert('Hospital details copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    document.body.removeChild(textArea);
  }
}

// Export singleton instance
const hospitalService = new HospitalService();
export default hospitalService;
