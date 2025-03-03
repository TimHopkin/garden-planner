// Initialize the map when the tab is selected
document.addEventListener('DOMContentLoaded', function() {
  // Get all tab buttons and add click event listeners
  const tabButtons = document.querySelectorAll('.tab-button');
  
  // Get the map view button specifically
  const mapViewBtn = document.getElementById('map-view-tab-btn');
  
  // Add special handling for the map view tab
  if (mapViewBtn) {
    mapViewBtn.addEventListener('click', function() {
      // Switch to map tab and initialize the map
      switchToMapTab();
    });
  }
  
  // Generic tab handling for all tabs
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Skip the special handling for map view since we have specific handler
      if (tabId === 'map-view') return;
      
      // Hide all tab content
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
      });
      
      // Deactivate all tab buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Show the selected tab content
      const selectedTab = document.getElementById(tabId);
      if (selectedTab) {
        selectedTab.style.display = 'block';
        selectedTab.classList.add('active');
      }
      
      // Activate the clicked button
      this.classList.add('active');
    });
  });
  
  // Show the first tab by default (if not already handled elsewhere)
  if (tabButtons.length > 0 && !document.querySelector('.tab-button.active')) {
    tabButtons[0].click();
  }
  
  // Add a direct click handler for map view button
  if (mapViewBtn) {
    // Create a mutation observer to check when the app.html is fully loaded
    const observer = new MutationObserver((mutations, obs) => {
      const mapTab = document.getElementById('map-view');
      if (mapTab) {
        // If map tab exists and there's a hash for it, show it
        if (window.location.hash === '#map-view') {
          setTimeout(() => {
            switchToMapTab();
          }, 500); // Short delay to ensure everything is ready
        }
        obs.disconnect(); // Stop observing once we've found the map tab
      }
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
});

// Function to switch to map tab and initialize the map
function switchToMapTab() {
  // Get all tab buttons and tab contents
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Hide all tab content
  tabContents.forEach(tab => {
    tab.style.display = 'none';
    tab.classList.remove('active');
  });
  
  // Deactivate all tab buttons
  tabButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Activate the map tab button
  const mapButton = document.getElementById('map-view-tab-btn');
  if (mapButton) {
    mapButton.classList.add('active');
  }
  
  // Show the map tab content
  const mapTab = document.getElementById('map-view');
  if (mapTab) {
    mapTab.style.display = 'block';
    mapTab.classList.add('active');
    
    // Initialize map if it doesn't exist yet
    if (!window.gardenMap) {
      console.log("Initializing map...");
      setTimeout(initializeMap, 100); // Short delay to ensure the tab is visible
    } else {
      // If map exists, trigger a resize event to refresh the map display
      if (window.gardenMap) {
        console.log("Map already exists, refreshing...");
        window.gardenMap.invalidateSize();
      }
    }
  }
}

// Initialize the Leaflet map
function initializeMap() {
  // Create the map if it doesn't exist yet
  if (!window.gardenMap) {
    // Set default view to a general location (will be updated when user searches)
    window.gardenMap = L.map('garden-map').setView([40.7128, -74.0060], 13);
    
    // Add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(window.gardenMap);
    
    // Add satellite imagery option
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    
    // Add layer control
    const baseMaps = {
      "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      }),
      "Satellite": satelliteLayer
    };
    
    L.control.layers(baseMaps).addTo(window.gardenMap);
    
    // Initialize the FeatureGroup to store editable layers
    const drawnItems = new L.FeatureGroup();
    window.gardenMap.addLayer(drawnItems);
    
    // Initialize the draw control and pass it the FeatureGroup
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        poly: {
          allowIntersection: false
        }
      },
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true
        },
        polyline: true,
        rectangle: true,
        circle: true,
        marker: true,
        circlemarker: false
      }
    });
    window.gardenMap.addControl(drawControl);
    
    // Handle the created layers
    window.gardenMap.on(L.Draw.Event.CREATED, function (event) {
      const layer = event.layer;
      
      // Add created layer properties for identification
      layer.options.id = new Date().getTime(); // Unique ID
      if (event.layerType === 'polygon' || event.layerType === 'rectangle') {
        // Set default styles
        layer.setStyle({
          color: '#3388ff',
          weight: 3,
          opacity: 1,
          fillColor: '#3388ff',
          fillOpacity: 0.2
        });
        
        // Add a popup with information
        layer.bindPopup(createShapePopup(layer, event.layerType));
      }
      
      // Add the layer to the featureGroup
      drawnItems.addLayer(layer);
      
      // Open the popup for immediate editing
      if (layer.getPopup()) {
        layer.openPopup();
      }
    });
    
    // Set up the search functionality
    const searchButton = document.getElementById('search-button');
    const addressInput = document.getElementById('address-search');
    
    searchButton.addEventListener('click', function() {
      searchLocation(addressInput.value);
    });
    
    addressInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchLocation(addressInput.value);
      }
    });
    
    // Set up save and load functionality
    const saveButton = document.getElementById('save-map');
    const loadButton = document.getElementById('load-map');
    
    saveButton.addEventListener('click', function() {
      saveMapData(drawnItems);
    });
    
    loadButton.addEventListener('click', function() {
      loadMapData(drawnItems);
    });
  }
}

// Function to search for a location
function searchLocation(address) {
  if (!address) return;
  
  // Simple geocoding using Nominatim API (for demonstration)
  // In production, you'd want to use a more robust geocoding service
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
    .then(response => response.json())
    .then(data => {
      if (data && data.length > 0) {
        const location = data[0];
        window.gardenMap.setView([parseFloat(location.lat), parseFloat(location.lon)], 18);
      } else {
        alert('Location not found. Please try a different address.');
      }
    })
    .catch(error => {
      console.error('Error searching for location:', error);
      alert('Error searching for location. Please try again.');
    });
}

// Create popup content for shapes
function createShapePopup(layer, type) {
  const container = document.createElement('div');
  container.className = 'shape-popup';
  
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Garden area name';
  nameInput.className = 'popup-input';
  nameInput.value = layer.options.name || '';
  nameInput.addEventListener('change', function() {
    layer.options.name = this.value;
  });
  
  const typeSelect = document.createElement('select');
  typeSelect.className = 'popup-select';
  const types = ['Vegetable Garden', 'Flower Bed', 'Herb Garden', 'Orchard', 'Lawn', 'Path', 'Structure', 'Other'];
  types.forEach(t => {
    const option = document.createElement('option');
    option.value = t;
    option.textContent = t;
    typeSelect.appendChild(option);
  });
  typeSelect.value = layer.options.gardenType || types[0];
  typeSelect.addEventListener('change', function() {
    layer.options.gardenType = this.value;
    // Set color based on type
    const colors = {
      'Vegetable Garden': '#388E3C',
      'Flower Bed': '#D81B60',
      'Herb Garden': '#7CB342',
      'Orchard': '#FF8F00',
      'Lawn': '#66BB6A',
      'Path': '#8D6E63',
      'Structure': '#5D4037',
      'Other': '#3949AB'
    };
    if (colors[this.value]) {
      layer.setStyle({
        color: colors[this.value],
        fillColor: colors[this.value]
      });
    }
  });
  
  // Trigger change to set initial color if type is already set
  if (layer.options.gardenType) {
    typeSelect.dispatchEvent(new Event('change'));
  }
  
  // Add elements to container
  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Name:';
  container.appendChild(nameLabel);
  container.appendChild(nameInput);
  
  const typeLabel = document.createElement('label');
  typeLabel.textContent = 'Type:';
  container.appendChild(document.createElement('br'));
  container.appendChild(typeLabel);
  container.appendChild(typeSelect);
  
  // Calculate and display area if it's a polygon or rectangle
  if (type === 'polygon' || type === 'rectangle') {
    const areaLabel = document.createElement('div');
    areaLabel.className = 'area-label';
    let area = 0;
    
    if (layer.getLatLngs) {
      // Calculate approximate area in square meters
      area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
      // Convert to square feet
      const areaInSqFt = (area * 10.7639).toFixed(1);
      areaLabel.textContent = `Area: ~${areaInSqFt} sq ft`;
      
      container.appendChild(document.createElement('br'));
      container.appendChild(areaLabel);
    }
  }
  
  return container;
}

// Save map data to localStorage (in a real app, you'd save to a database via Firebase)
function saveMapData(featureGroup) {
  // Convert the layers to GeoJSON
  const geoData = featureGroup.toGeoJSON();
  
  // Add custom properties stored in layer.options
  geoData.features.forEach((feature, index) => {
    // Find the corresponding layer to get its options
    const layers = featureGroup.getLayers();
    if (index < layers.length) {
      const layer = layers[index];
      feature.properties = {
        ...feature.properties,
        id: layer.options.id,
        name: layer.options.name || '',
        gardenType: layer.options.gardenType || 'Other'
      };
    }
  });
  
  // Save to localStorage without requiring authentication
  localStorage.setItem('gardenMap_user', JSON.stringify(geoData));
  alert('Map saved successfully!');
}

// Load map data from localStorage
function loadMapData(featureGroup) {
  // Clear existing layers
  featureGroup.clearLayers();
  
  // Use standard storage key without authentication
  const storageKey = 'gardenMap_user';
  
  // Load the data
  const savedData = localStorage.getItem(storageKey);
  if (savedData) {
    try {
      const geoData = JSON.parse(savedData);
      
      // Convert GeoJSON back to layers
      const geoJsonLayer = L.geoJSON(geoData, {
        onEachFeature: function(feature, layer) {
          // Restore custom properties
          if (feature.properties) {
            layer.options.id = feature.properties.id;
            layer.options.name = feature.properties.name;
            layer.options.gardenType = feature.properties.gardenType;
            
            // Bind popup
            layer.bindPopup(createShapePopup(layer, 
              feature.geometry.type === 'Polygon' ? 'polygon' : 
              feature.geometry.type === 'Point' ? 'marker' : 'other'
            ));
            
            // Set style based on garden type
            const colors = {
              'Vegetable Garden': '#388E3C',
              'Flower Bed': '#D81B60',
              'Herb Garden': '#7CB342',
              'Orchard': '#FF8F00',
              'Lawn': '#66BB6A',
              'Path': '#8D6E63',
              'Structure': '#5D4037',
              'Other': '#3949AB'
            };
            
            if (colors[feature.properties.gardenType]) {
              layer.setStyle({
                color: colors[feature.properties.gardenType],
                fillColor: colors[feature.properties.gardenType],
                weight: 3,
                opacity: 1,
                fillOpacity: 0.2
              });
            }
          }
        }
      });
      
      // Add all the GeoJSON layers to the feature group
      geoJsonLayer.eachLayer(function(layer) {
        featureGroup.addLayer(layer);
      });
      
      // Zoom the map to show all the features
      if (featureGroup.getLayers().length > 0) {
        window.gardenMap.fitBounds(featureGroup.getBounds());
      }
      
      alert('Map loaded successfully!');
    } catch (e) {
      console.error('Error loading map data:', e);
      alert('Error loading map data. The saved map may be corrupted.');
    }
  } else {
    alert('No saved map found.');
  }
}

// Add the L.GeometryUtil for area calculations if it doesn't exist
if (!L.GeometryUtil) {
  L.GeometryUtil = {
    // Calculate geodesic area of a polygon
    geodesicArea: function(latLngs) {
      let area = 0;
      const d2r = Math.PI / 180;
      let p1, p2;
      
      for (let i = 0, len = latLngs.length - 1; i < len; i++) {
        p1 = latLngs[i];
        p2 = latLngs[i + 1];
        area += ((p2.lng - p1.lng) * d2r) * 
                (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
      }
      
      area = area * 6378137.0 * 6378137.0 / 2.0;
      return Math.abs(area);
    }
  };
}