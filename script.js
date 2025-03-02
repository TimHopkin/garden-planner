/*
 * GardenMaster 2025 - Interactive Garden Planner
 * A tool for planning and visualizing your garden, with companion planting guides,
 * planting calendars, and detailed plant information.
 */

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Main UI Elements
    const gardenGrid = document.getElementById('garden-grid');
    const gridSizeSelect = document.getElementById('grid-size');
    const clearGardenBtn = document.getElementById('clear-garden-btn');
    const newGardenBtn = document.getElementById('new-garden-btn');
    const saveGardenBtn = document.getElementById('save-garden-btn');
    const loadGardenBtn = document.getElementById('load-garden-btn');
    const plantSearch = document.getElementById('plant-search');
    const clearSearch = document.getElementById('clear-search');
    const plantsList = document.getElementById('plants-list');
    const plantInfoPanel = document.getElementById('plant-info-panel');
    const calendarBody = document.getElementById('calendar-body');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const categoryFilter = document.getElementById('category-filter');
    const plantingDate = document.getElementById('planting-date');
    const monthTimeline = document.getElementById('month-timeline');
    const plantingTimelines = document.getElementById('planting-timelines');
    
    // Garden state
    let garden = {
        name: 'My Garden',
        rows: 10,
        cols: 10,
        grid: Array(10).fill().map(() => Array(10).fill('')),
        plants: {},
        plantingDate: new Date()
    };
    
    // Selected plant for planting
    let selectedPlant = '';
    
    // Month name utilities
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Plant emojis for common vegetables
    const plantEmojis = {
        "Tomato": "🍅",
        "Potato": "🥔",
        "Carrot": "🥕",
        "Onion": "🧅",
        "Garlic": "🧄",
        "Lettuce": "🥬",
        "Cucumber": "🥒",
        "Pepper": "🌶️",
        "Corn": "🌽",
        "Pumpkin": "🎃",
        "Eggplant": "🍆",
        "Broccoli": "🥦",
        "Cabbage": "🥬",
        "Herb": "🌿",
        "Fruits": "🍓",
        "Bean": "🫘",
        "Pea": "🫛",
        "Aubergine": "🍆",
        "Beetroot": "🫒", // No beetroot emoji, using olive
        "Chili": "🌶️",
        "Peas": "🫛"
    };
    
    // Default emojis for plant categories
    const categoryEmojis = {
        "Annual fruit & veg": "🍎",
        "Annual herb & spice": "🌿",
        "Perennial veg": "🥦",
        "Perennial herbs & spice": "🌱",
        "Flowers and companions": "🌼",
        "Winter poly crops": "❄️",
        "Soft fruit": "🍓",
        "Trees": "🌳",
        "Tomatoes": "🍅",
        "Green manures": "🌱",
        "Annual flowers": "🌸",
        "Biennial flowers": "🌺",
        "Perennial flowers": "🌻",
        "default": "🌱"
    };
    
    // Sample plant database based on your CSV
    const plantDatabase = {
        'tomato': { 
            ID: 1, 
            Crop: 'Tomato',
            Family: 'Solanaceae',
            Category: 'Annual fruit & veg',
            Species: 'Solanum lycopersicum',
            Varieties: 'Roma, Moneymaker, Cherry, Beefsteak, San Marzano',
            Soil: 'Rich, Warm',
            Site: 'Sunny, Sheltered',
            'Conditions for germination': '>21°C',
            'Sow early': 'February',
            'Sow late': 'March',
            'Transplant after': '5-6 weeks',
            'Plant out from': 'May',
            'Plant out until': 'June',
            Method: 'Transplant',
            'Between rows [RHS]': '60cm [50]',
            'Between plants': '40cm [50]',
            'Harvest from': 'July',
            'Latest harvest': 'October',
            'Weeks in bed': '24-28',
            Rotation: 'Fruiting Veg',
            Profitability: 'High',
            Hardiness: 'Tender',
            'Growing tips': 'Sow on Valentine\'s Day and again in mid-March; pot on (9cm) with a couple mm below the seed leaves to encourage more roots, and plant out when 20cm tall, again a little deeper to encourage root; feed with high potash every 2 weeks after flowering; top after 4-6 trusses when outside.',
            'Harvest tips': 'Harvest every 2-3 days',
            // Derived values for the app
            sowEarlyMonth: 1, // 0-based index for February
            sowLateMonth: 2,  // 0-based index for March
            harvestFromMonth: 6, // 0-based index for July
            harvestToMonth: 9,  // 0-based index for October
            // Custom fields for companion planting
            companions: ['basil', 'marigold', 'onion', 'carrot', 'nasturtium'],
            enemies: ['potato', 'fennel', 'corn']
        },
        'carrot': { 
            ID: 2, 
            Crop: 'Carrot',
            Family: 'Apiaceae',
            Category: 'Annual fruit & veg',
            Species: 'Daucus carota subsp. sativus',
            Varieties: 'Nantes, Amsterdam Forcing, Autumn King, Chantenay Red',
            Soil: 'Well Drained, Low N',
            Site: 'Not Too Shady',
            'Conditions for germination': '>7°C, 1cm deep',
            'Sow early': 'February',
            'Sow late': 'July',
            'Transplant after': '',
            'Plant out from': '-',
            'Plant out until': '-',
            Method: 'Direct',
            'Between rows [RHS]': '15cm [30]',
            'Between plants': '4-8cm [10]',
            'Harvest from': 'May',
            'Latest harvest': 'November',
            'Weeks in bed': '7-18',
            Rotation: 'Root',
            Profitability: 'Medium',
            Hardiness: 'Light Frost',
            'Growing tips': 'Carrots sown in late May/early June will miss worst of the carrot fly; intercrop with radish or lettuce; keep soil moist for the first month, do not sow into fresh compost, best after brassicas.',
            'Harvest tips': 'Bunches with leaves indicating freshness sell for higher price',
            sowEarlyMonth: 1,
            sowLateMonth: 6,
            harvestFromMonth: 4,
            harvestToMonth: 10,
            companions: ['onion', 'sage', 'pea', 'lettuce', 'radish'],
            enemies: ['dill', 'parsnip', 'beetroot']
        },
        'lettuce': { 
            ID: 3, 
            Crop: 'Lettuce',
            Family: 'Asteraceae',
            Category: 'Annual fruit & veg',
            Species: 'Lactuca sativa',
            Varieties: 'Little Gem, Butterhead, Iceberg, Romaine, Red Salad Bowl',
            Soil: 'Moist, Rich',
            Site: 'Partial Shade In Summer',
            'Conditions for germination': '10-20°C, light needed',
            'Sow early': 'February',
            'Sow late': 'September',
            'Transplant after': '3-4 weeks',
            'Plant out from': 'March',
            'Plant out until': 'September',
            Method: 'Direct or Transplant',
            'Between rows [RHS]': '30cm',
            'Between plants': '20-30cm',
            'Harvest from': 'May',
            'Latest harvest': 'November',
            'Weeks in bed': '6-10',
            Rotation: 'Salad',
            Profitability: 'Medium',
            Hardiness: 'Half Hardy',
            'Growing tips': 'Succession sow every 2-3 weeks for continuous harvest. Provide partial shade in hot weather to prevent bolting.',
            'Harvest tips': 'Harvest in morning when crisp, outer leaves can be picked continuously for cut-and-come-again',
            sowEarlyMonth: 1,
            sowLateMonth: 8,
            harvestFromMonth: 4,
            harvestToMonth: 10,
            companions: ['carrot', 'radish', 'cucumber', 'strawberry'],
            enemies: ['broccoli', 'cabbage', 'celery']
        },
        'potato': { 
            ID: 4, 
            Crop: 'Potato (1st early)',
            Family: 'Solanaceae',
            Category: 'Annual fruit & veg',
            Species: 'Solanum tuberosum',
            Varieties: 'Pink Fir, Jersey Royal, Foremost, Casablanca',
            Soil: 'Rich, Well Drained',
            Site: 'Full Sun',
            'Conditions for germination': 'pre-chit indoors',
            'Sow early': 'March',
            'Sow late': 'March',
            'Transplant after': '3 weeks',
            'Plant out from': '-',
            'Plant out until': '-',
            Method: 'Tubers',
            'Between rows [RHS]': '75cm',
            'Between plants': '25cm [60]',
            'Harvest from': 'May',
            'Latest harvest': 'June',
            'Weeks in bed': '10-12',
            Rotation: 'Potato',
            Profitability: 'Medium',
            Hardiness: 'Tender',
            'Growing tips': 'Buy seed potatoes in February and chit in egg boxes; plant with chopped comfrey and earth up ¾ of plant every 6 weeks or especially if frosts predicted.',
            'Harvest tips': 'Harvest once plants have started to flower',
            sowEarlyMonth: 2,
            sowLateMonth: 2,
            harvestFromMonth: 4,
            harvestToMonth: 5,
            companions: ['horseradish', 'corn', 'cabbage', 'beans'],
            enemies: ['tomato', 'cucumber', 'pumpkin', 'sunflower']
        },
        'onion': { 
            ID: 5, 
            Crop: 'Onion',
            Family: 'Alliaceae',
            Category: 'Annual fruit & veg',
            Species: 'Allium cepa',
            Varieties: 'Walla Walla, White Ebenezer, Sturon, Red Baron',
            Soil: 'Rich, Well Drained',
            Site: 'Sun* – Light Shade',
            'Conditions for germination': '>10°C',
            'Sow early': 'Feb [July]',
            'Sow late': 'March [Sept]',
            'Transplant after': '6 weeks',
            'Plant out from': 'Mar [Sept]',
            'Plant out until': 'May [Nov]',
            Method: 'Transplant / sets',
            'Between rows [RHS]': '10cm [25]',
            'Between plants': '10cm [10]',
            'Harvest from': 'June',
            'Latest harvest': 'August',
            'Weeks in bed': '26',
            Rotation: 'Allium',
            Profitability: 'Medium',
            Hardiness: 'Hardy',
            'Growing tips': 'Germinate best at 21°C, grow best at 12-24°C. Sow in Feb and prick out into modules when large enough and transplant a couple months later.',
            'Harvest tips': 'Ready when tops yellow / fall over, lift and leave to dry out in sun until skins are papery',
            sowEarlyMonth: 1,
            sowLateMonth: 2,
            harvestFromMonth: 5,
            harvestToMonth: 7,
            companions: ['carrot', 'beetroot', 'strawberry', 'tomato', 'lettuce'],
            enemies: ['beans', 'peas', 'asparagus']
        },
        'cucumber': { 
            ID: 6, 
            Crop: 'Cucumber',
            Family: 'Cucurbitaceae',
            Category: 'Annual fruit & veg',
            Species: 'Cucumis sativus',
            Varieties: 'Crystal Lemon, Marketmore, Diva, Telegraph Improved',
            Soil: 'Rich, Moist',
            Site: 'Sunny, Sheltered',
            'Conditions for germination': '>15°C [20°C] then 28°C',
            'Sow early': 'March',
            'Sow late': 'July',
            'Transplant after': '3 weeks',
            'Plant out from': 'May',
            'Plant out until': 'August',
            Method: 'Transplant',
            'Between rows [RHS]': '45cm [75]',
            'Between plants': '45cm',
            'Harvest from': 'July',
            'Latest harvest': 'October',
            'Weeks in bed': '16-20',
            Rotation: 'Fruiting Veg',
            Profitability: 'High',
            Hardiness: 'Tender',
            'Growing tips': 'Transplants dislike root disturbance so ideally use biodegradable pots; remove all flowers until 2ft tall / 6 leaves.',
            'Harvest tips': 'Must be picked every 2-3 days, immerse in water to cool.',
            sowEarlyMonth: 2,
            sowLateMonth: 6,
            harvestFromMonth: 6,
            harvestToMonth: 9,
            companions: ['sunflower', 'corn', 'beans', 'peas', 'radish'],
            enemies: ['potato', 'sage', 'aromatic herbs']
        },
        'pepper': { 
            ID: 7, 
            Crop: 'Pepper',
            Family: 'Solanaceae',
            Category: 'Annual fruit & veg',
            Species: 'Capsicum annuum',
            Varieties: 'Bell, Jalapeño, Cayenne, Hungarian Wax',
            Soil: 'Rich, well-drained',
            Site: 'Full sun, sheltered',
            'Conditions for germination': '20-30°C, consistent warmth',
            'Sow early': 'February',
            'Sow late': 'March',
            'Transplant after': '6-8 weeks',
            'Plant out from': 'May',
            'Plant out until': 'June',
            Method: 'Transplant',
            'Between rows [RHS]': '45cm',
            'Between plants': '45cm',
            'Harvest from': 'July',
            'Latest harvest': 'October',
            'Weeks in bed': '20-24',
            Rotation: 'Fruiting Veg',
            Profitability: 'Medium',
            Hardiness: 'Tender',
            'Growing tips': 'Need consistent warmth. Pinch out growing tip when plant has 6-8 leaves to encourage bushier habit. Feed with high potash once flowering starts.',
            'Harvest tips': 'Green peppers can be harvested when firm, or leave to ripen to red/yellow/orange for sweeter flavor',
            sowEarlyMonth: 1,
            sowLateMonth: 2,
            harvestFromMonth: 6,
            harvestToMonth: 9,
            companions: ['tomato', 'basil', 'onion', 'carrots'],
            enemies: ['fennel', 'kohlrabi', 'beans']
        },
        'beetroot': { 
            ID: 8, 
            Crop: 'Beetroot',
            Family: 'Amaranthaceae',
            Category: 'Annual fruit & veg',
            Species: 'Beta vulgaris',
            Varieties: 'Detroit, Chioggia, Bulls Blood, Cylindra',
            Soil: 'Well-drained, not too acidic',
            Site: 'Sun or partial shade',
            'Conditions for germination': '10-25°C',
            'Sow early': 'March',
            'Sow late': 'July',
            'Transplant after': 'Not recommended',
            'Plant out from': 'N/A',
            'Plant out until': 'N/A',
            Method: 'Direct sow',
            'Between rows [RHS]': '30cm',
            'Between plants': '10cm',
            'Harvest from': 'June',
            'Latest harvest': 'November',
            'Weeks in bed': '8-12',
            Rotation: 'Root',
            Profitability: 'Medium',
            Hardiness: 'Hardy',
            'Growing tips': 'Each "seed" is actually a cluster that may produce multiple seedlings that should be thinned. Keep soil consistently moist to prevent woodiness.',
            'Harvest tips': 'Best harvested young at golf ball to tennis ball size. Twist off leaves rather than cutting to prevent bleeding',
            sowEarlyMonth: 2,
            sowLateMonth: 6,
            harvestFromMonth: 5,
            harvestToMonth: 10,
            companions: ['onion', 'lettuce', 'cabbage', 'kohlrabi'],
            enemies: ['mustard', 'charlock', 'pole beans']
        },
        'broccoli': { 
            ID: 9, 
            Crop: 'Broccoli',
            Family: 'Brassicaceae',
            Category: 'Annual fruit & veg',
            Species: 'Brassica oleracea var. italica',
            Varieties: 'Calabrese, Purple Sprouting, Romanesco',
            Soil: 'Firm, moisture-retentive',
            Site: 'Full sun or light shade',
            'Conditions for germination': '7-30°C',
            'Sow early': 'March',
            'Sow late': 'June',
            'Transplant after': '4-6 weeks',
            'Plant out from': 'May',
            'Plant out until': 'July',
            Method: 'Transplant',
            'Between rows [RHS]': '45cm',
            'Between plants': '30cm',
            'Harvest from': 'July',
            'Latest harvest': 'April',
            'Weeks in bed': '16-40',
            Rotation: 'Brassica',
            Profitability: 'Medium',
            Hardiness: 'Hardy',
            'Growing tips': 'Firm soil around plants to prevent wind rock. Cover with netting to prevent cabbage white butterflies. Apply lime if soil pH is below 6.5.',
            'Harvest tips': 'Cut main head with knife before flowers open. Side shoots will develop after main head harvest',
            sowEarlyMonth: 2,
            sowLateMonth: 5,
            harvestFromMonth: 6,
            harvestToMonth: 3,
            companions: ['celery', 'onion', 'potato', 'aromatic herbs'],
            enemies: ['tomato', 'strawberry', 'runner beans']
        }
    };
    
    // Initialize the app
    function init() {
        console.log("Initializing application...");
        
        // Set the current date in the date picker
        const today = new Date();
        plantingDate.valueAsDate = today;
        garden.plantingDate = today;
        
        // Populate category filter
        populateCategoryFilter();
        
        // Populate plant list
        updatePlantList();
        
        // Initialize garden grid
        initializeGrid();
        
        // Initialize month timeline
        initializeMonthTimeline();
        
        // Initialize event listeners
        initializeEventListeners();
        
        // Add direct click handlers to tab buttons for redundancy
        document.getElementById('garden-tab-btn').addEventListener('click', () => switchTab('garden'));
        document.getElementById('info-tab-btn').addEventListener('click', () => switchTab('info'));
        document.getElementById('timeline-tab-btn').addEventListener('click', () => switchTab('timeline'));
        
        // Fix search functionality
        plantSearch.addEventListener('input', () => {
            console.log("Search input detected:", plantSearch.value);
            updatePlantList();
        });
        
        // Fix category filter
        categoryFilter.addEventListener('change', () => {
            console.log("Category filter changed:", categoryFilter.value);
            updatePlantList();
        });
        
        // Add a plant database tab (alternative way to view all plants)
        // Load a default plant info if no plant selected
        const firstPlantId = Object.keys(plantDatabase)[0];
        showPlantInfo(firstPlantId);
        
        // Show welcome notification
        showNotification("Welcome to GardenMaster 2025! Select plants from the list and click on the grid to start planning your garden.", "success");
        
        console.log("Initialization complete");
    }
    
    // Initialize grid
    function initializeGrid() {
        gardenGrid.innerHTML = '';
        gardenGrid.style.gridTemplateColumns = `repeat(${garden.cols}, 50px)`;
        gardenGrid.style.gridTemplateRows = `repeat(${garden.rows}, 50px)`;
        
        for (let y = 0; y < garden.rows; y++) {
            for (let x = 0; x < garden.cols; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                if (garden.grid[y][x]) {
                    const plantId = garden.grid[y][x];
                    const plant = plantDatabase[plantId];
                    cell.textContent = getPlantEmoji(plant);
                    
                    // Add plant label
                    const label = document.createElement('div');
                    label.className = 'plant-label';
                    label.textContent = plant.Crop;
                    cell.appendChild(label);
                }
                
                cell.addEventListener('click', handleGridCellClick);
                
                gardenGrid.appendChild(cell);
            }
        }
    }
    
    // Handle grid cell click
    function handleGridCellClick(event) {
        const cell = event.currentTarget;
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        if (selectedPlant) {
            if (garden.grid[y][x]) {
                if (!confirm('Replace existing plant?')) {
                    return;
                }
                // Remove existing plant from count
                const existingPlantId = garden.grid[y][x];
                garden.plants[existingPlantId]--;
            }
            
            // Check for companions and enemies
            const neighbors = getNeighboringPlants(x, y);
            const plant = plantDatabase[selectedPlant];
            
            let compatibilityMsg = '';
            
            // Check companions
            const companions = neighbors.filter(n => {
                const neighborPlant = plantDatabase[n];
                return plant.companions && plant.companions.some(c => 
                    neighborPlant.Crop.toLowerCase().includes(c.toLowerCase())
                );
            });
            
            // Check enemies
            const enemies = neighbors.filter(n => {
                const neighborPlant = plantDatabase[n];
                return plant.enemies && plant.enemies.some(e => 
                    neighborPlant.Crop.toLowerCase().includes(e.toLowerCase())
                );
            });
            
            if (enemies.length > 0) {
                const enemyNames = enemies.map(e => plantDatabase[e].Crop).join(', ');
                compatibilityMsg = `Warning: ${plant.Crop} doesn't grow well near ${enemyNames}. `;
                
                if (!confirm(`${compatibilityMsg}Plant anyway?`)) {
                    return;
                }
            }
            
            // Plant the selected plant
            garden.grid[y][x] = selectedPlant;
            garden.plants[selectedPlant] = (garden.plants[selectedPlant] || 0) + 1;
            
            // Update cell
            cell.textContent = getPlantEmoji(plant);
            
            // Add plant label
            const label = document.createElement('div');
            label.className = 'plant-label';
            label.textContent = plant.Crop;
            cell.appendChild(label);
            
            if (companions.length > 0) {
                const companionNames = companions.map(c => plantDatabase[c].Crop).join(', ');
                showNotification(`Good companion planting! ${plant.Crop} grows well with nearby ${companionNames}`, "success");
            } else if (enemies.length > 0) {
                showNotification(compatibilityMsg, "warning");
            } else {
                showNotification(`Planted ${plant.Crop}`, "success");
            }
            
            // Update calendar
            updateCalendar();
            updatePlantingTimelines();
        } else if (garden.grid[y][x]) {
            // Show plant info when clicking on a planted cell without selection
            showPlantInfo(garden.grid[y][x]);
            switchTab('info');
        }
    }
    
    // Get neighboring plants
    function getNeighboringPlants(x, y) {
        const neighbors = [];
        
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                
                const nx = Number(x) + dx;
                const ny = Number(y) + dy;
                
                if (nx >= 0 && nx < garden.cols && ny >= 0 && ny < garden.rows) {
                    const plantId = garden.grid[ny][nx];
                    if (plantId) neighbors.push(plantId);
                }
            }
        }
        
        return neighbors;
    }
    
    // Populate category filter
    function populateCategoryFilter() {
        const categories = new Set();
        
        // Extract unique categories
        Object.values(plantDatabase).forEach(plant => {
            if (plant.Category) {
                categories.add(plant.Category);
            }
        });
        
        // Populate dropdown
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        
        Array.from(categories).sort().forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
    
    // Update plant list based on search and category filter
    function updatePlantList() {
        console.log("Updating plant list...");
        const searchTerm = plantSearch.value.toLowerCase();
        const category = categoryFilter.value;
        
        plantsList.innerHTML = '';
        
        let matchCount = 0;
        
        Object.entries(plantDatabase).forEach(([plantId, plant]) => {
            // Apply filters
            let searchMatch = true;
            if (searchTerm) {
                searchMatch = plant.Crop.toLowerCase().includes(searchTerm) || 
                             (plant.Category && plant.Category.toLowerCase().includes(searchTerm)) ||
                             (plant.Family && plant.Family.toLowerCase().includes(searchTerm));
            }
            
            let categoryMatch = true;
            if (category) {
                categoryMatch = plant.Category === category;
            }
            
            // Skip if doesn't match filters
            if (!searchMatch || !categoryMatch) {
                return;
            }
            
            matchCount++;
            
            // Create plant item
            const plantItem = document.createElement('div');
            plantItem.className = 'plant-item';
            plantItem.dataset.plant = plantId;
            
            // Add selected class if currently selected
            if (plantId === selectedPlant) {
                plantItem.classList.add('selected');
            }
            
            const emoji = document.createElement('span');
            emoji.className = 'plant-emoji';
            emoji.textContent = getPlantEmoji(plant);
            
            const name = document.createElement('span');
            name.textContent = plant.Crop;
            
            plantItem.appendChild(emoji);
            plantItem.appendChild(name);
            
            // Add click event
            plantItem.addEventListener('click', () => {
                // Deselect if clicking on the same plant
                if (plantId === selectedPlant) {
                    selectedPlant = '';
                    plantItem.classList.remove('selected');
                } else {
                    // Remove selected class from previous selection
                    const prevSelected = plantsList.querySelector('.plant-item.selected');
                    if (prevSelected) {
                        prevSelected.classList.remove('selected');
                    }
                    
                    // Select this plant
                    selectedPlant = plantId;
                    plantItem.classList.add('selected');
                    
                    // Show plant info
                    showPlantInfo(plantId);
                }
            });
            
            plantsList.appendChild(plantItem);
        });
        
        // Show result count or no results message
        if (matchCount === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <i class="fas fa-search"></i>
                <p>No plants match your search.</p>
                <button class="clear-filters-btn" id="clear-filters">Clear Filters</button>
            `;
            plantsList.appendChild(noResults);
            
            // Add event listener to clear filters button
            document.getElementById('clear-filters').addEventListener('click', () => {
                plantSearch.value = '';
                categoryFilter.value = '';
                updatePlantList();
            });
        } else {
            console.log(`Found ${matchCount} matching plants`);
        }
    }
    
    // Show plant information in the info panel
    function showPlantInfo(plantId) {
        const plant = plantDatabase[plantId];
        
        // Create a dashboard-style UI for plant details
        let infoHTML = `
            <div class="plant-detail-header">
                <div class="plant-detail-emoji">${getPlantEmoji(plant)}</div>
                <div>
                    <h2>${plant.Crop}</h2>
                    <p><em>${plant.Species || ''}</em> • Family: ${plant.Family || 'Unknown'}</p>
                </div>
            </div>
            
            <div class="plant-info-cards">
                <!-- Key Info Card -->
                <div class="info-card">
                    <div class="info-card-header">
                        <i class="fas fa-info-circle"></i>
                        <h3>Key Information</h3>
                    </div>
                    <table class="info-table">
                        <tr>
                            <td><strong>Category:</strong></td>
                            <td>${plant.Category || 'Unknown'}</td>
                        </tr>
                        <tr>
                            <td><strong>Varieties:</strong></td>
                            <td>${plant.Varieties || 'Not specified'}</td>
                        </tr>
                        <tr>
                            <td><strong>Soil:</strong></td>
                            <td>${plant.Soil || 'Not specified'}</td>
                        </tr>
                        <tr>
                            <td><strong>Site:</strong></td>
                            <td>${plant.Site || 'Not specified'}</td>
                        </tr>
                        <tr>
                            <td><strong>Hardiness:</strong></td>
                            <td>${plant.Hardiness || 'Unknown'}</td>
                        </tr>
                    </table>
                </div>
                
                <!-- Growing Calendar Card -->
                <div class="info-card calendar-card">
                    <div class="info-card-header">
                        <i class="fas fa-calendar-alt"></i>
                        <h3>Growing Calendar</h3>
                    </div>
                    <table class="info-table">
                        <tr>
                            <td><strong>Sow from:</strong></td>
                            <td>${plant['Sow early'] || 'Not specified'}</td>
                        </tr>
                        <tr>
                            <td><strong>Sow until:</strong></td>
                            <td>${plant['Sow late'] || 'Not specified'}</td>
                        </tr>
                        <tr>
                            <td><strong>Harvest from:</strong></td>
                            <td>${plant['Harvest from'] || 'Not specified'}</td>
                        </tr>
                        <tr>
                            <td><strong>Harvest until:</strong></td>
                            <td>${plant['Latest harvest'] || 'Not specified'}</td>
                        </tr>
                        <tr>
                            <td><strong>Time in bed:</strong></td>
                            <td>${plant['Weeks in bed'] || 'Unknown'} weeks</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <!-- Growing Guide Card -->
            <div class="info-card guide-card">
                <div class="info-card-header">
                    <i class="fas fa-seedling"></i>
                    <h3>Growing Guide</h3>
                </div>
                <table class="info-table">
                    <tr>
                        <td><strong>Germination:</strong></td>
                        <td>${plant['Conditions for germination'] || 'Not specified'}</td>
                    </tr>
                    <tr>
                        <td><strong>Method:</strong></td>
                        <td>${plant.Method || 'Not specified'}</td>
                    </tr>
                    <tr>
                        <td><strong>Transplant after:</strong></td>
                        <td>${plant['Transplant after'] || 'Not specified'}</td>
                    </tr>
                    <tr>
                        <td><strong>Spacing (rows):</strong></td>
                        <td>${plant['Between rows [RHS]'] || 'Not specified'}</td>
                    </tr>
                    <tr>
                        <td><strong>Spacing (plants):</strong></td>
                        <td>${plant['Between plants'] || 'Not specified'}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Tips Card -->
            <div class="info-card tips-card">
                <div class="info-card-header">
                    <i class="fas fa-lightbulb"></i>
                    <h3>Growing & Harvesting Tips</h3>
                </div>
                <div class="info-card-content">
                    <p><strong>Growing:</strong> ${plant['Growing tips'] || 'No specific growing tips provided.'}</p>
                    <p><strong>Harvesting:</strong> ${plant['Harvest tips'] || 'No specific harvesting tips provided.'}</p>
                </div>
            </div>
            
            <!-- Companion Planting Card -->
            <div class="info-card companion-card">
                <div class="info-card-header">
                    <i class="fas fa-handshake"></i>
                    <h3>Companion Planting</h3>
                </div>
                <div class="companion-container">
                    <div class="companion-column">
                        <h4><i class="fas fa-check-circle" style="color: var(--success-color);"></i> Good Companions</h4>
                        <ul class="companion-list">
        `;
        
        if (plant.companions && plant.companions.length > 0) {
            plant.companions.forEach(companion => {
                infoHTML += `<li><span class="compatibility-indicator compatibility-good"></span>${companion}</li>`;
            });
        } else {
            infoHTML += `<li>No specific companions listed</li>`;
        }
        
        infoHTML += `
                        </ul>
                    </div>
                    <div class="companion-column">
                        <h4><i class="fas fa-times-circle" style="color: var(--error-color);"></i> Plants to Avoid</h4>
                        <ul class="companion-list">
        `;
        
        if (plant.enemies && plant.enemies.length > 0) {
            plant.enemies.forEach(enemy => {
                infoHTML += `<li><span class="compatibility-indicator compatibility-bad"></span>${enemy}</li>`;
            });
        } else {
            infoHTML += `<li>No specific plants to avoid listed</li>`;
        }
        
        infoHTML += `
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        plantInfoPanel.innerHTML = infoHTML;
        
        // Additional CSS for plant info panel elements
        const style = document.createElement('style');
        style.textContent = `
            .plant-info-cards {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                margin-bottom: 20px;
            }
            
            .info-card {
                flex: 1;
                min-width: 300px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
                margin-bottom: 20px;
            }
            
            .info-card-header {
                background-color: var(--primary-color);
                color: white;
                padding: 10px 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .info-card-header h3 {
                margin: 0;
                color: white;
            }
            
            .info-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .info-table tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            
            .info-table td {
                padding: 10px 15px;
                border-bottom: 1px solid #eee;
            }
            
            .info-card-content {
                padding: 15px;
            }
            
            .calendar-card .info-card-header {
                background-color: #3498db;
            }
            
            .guide-card .info-card-header {
                background-color: #2ecc71;
            }
            
            .tips-card .info-card-header {
                background-color: #f39c12;
            }
            
            .companion-card .info-card-header {
                background-color: #9b59b6;
            }
            
            .companion-container {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                padding: 15px;
            }
            
            .companion-column {
                flex: 1;
                min-width: 200px;
            }
            
            .companion-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .companion-list li {
                display: flex;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Initialize month timeline
    function initializeMonthTimeline() {
        monthTimeline.innerHTML = '';
        
        // Create month headers
        monthNames.forEach((month, index) => {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'month';
            
            // Highlight current month
            const currentMonth = new Date().getMonth();
            if (index === currentMonth) {
                monthDiv.classList.add('current');
            }
            
            monthDiv.textContent = month;
            monthTimeline.appendChild(monthDiv);
        });
        
        // Update planting timelines
        updatePlantingTimelines();
    }
    
    // Update planting timelines
    function updatePlantingTimelines() {
        plantingTimelines.innerHTML = '';
        
        // Get plants in the garden
        const plantsInGarden = Object.entries(garden.plants)
            .filter(([_, count]) => count > 0)
            .map(([plantId, _]) => plantId);
        
        if (plantsInGarden.length === 0) {
            plantingTimelines.innerHTML = '<p>Add plants to your garden to see their growing timeline.</p>';
            return;
        }
        
        // Create timeline for each plant
        plantsInGarden.forEach(plantId => {
            const plant = plantDatabase[plantId];
            
            const timelineContainer = document.createElement('div');
            timelineContainer.className = 'plant-timeline';
            
            const labelDiv = document.createElement('div');
            labelDiv.className = 'plant-timeline-label';
            
            const emoji = document.createElement('span');
            emoji.style.fontSize = '20px';
            emoji.style.marginRight = '10px';
            emoji.textContent = getPlantEmoji(plant);
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = plant.Crop;
            
            labelDiv.appendChild(emoji);
            labelDiv.appendChild(nameSpan);
            
            const timelineBar = document.createElement('div');
            timelineBar.className = 'timeline-bar';
            
            // Create segments for each month
            for (let month = 0; month < 12; month++) {
                const segment = document.createElement('div');
                segment.style.width = '8.33%'; // 100% / 12 months
                segment.style.height = '100%';
                
                // Determine segment type
                if (isSowingMonth(plant, month)) {
                    segment.className = 'timeline-segment sowing';
                    segment.textContent = 'S';
                } else if (isHarvestingMonth(plant, month)) {
                    segment.className = 'timeline-segment harvesting';
                    segment.textContent = 'H';
                } else if (isGrowingMonth(plant, month)) {
                    segment.className = 'timeline-segment growing';
                    segment.textContent = 'G';
                } else {
                    segment.style.backgroundColor = '#eee';
                }
                
                timelineBar.appendChild(segment);
            }
            
            timelineContainer.appendChild(labelDiv);
            timelineContainer.appendChild(timelineBar);
            
            plantingTimelines.appendChild(timelineContainer);
        });
        
        // Add a legend
        const legend = document.createElement('div');
        legend.style.marginTop = '20px';
        legend.style.display = 'flex';
        legend.style.gap = '15px';
        legend.style.justifyContent = 'center';
        
        const legendItems = [
            { label: 'Sowing', color: '#3498db', letter: 'S' },
            { label: 'Growing', color: '#2ecc71', letter: 'G' },
            { label: 'Harvesting', color: '#e67e22', letter: 'H' }
        ];
        
        legendItems.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.style.display = 'flex';
            legendItem.style.alignItems = 'center';
            
            const colorBox = document.createElement('div');
            colorBox.style.width = '15px';
            colorBox.style.height = '15px';
            colorBox.style.backgroundColor = item.color;
            colorBox.style.marginRight = '5px';
            colorBox.style.display = 'flex';
            colorBox.style.alignItems = 'center';
            colorBox.style.justifyContent = 'center';
            colorBox.style.color = 'white';
            colorBox.style.fontSize = '10px';
            colorBox.textContent = item.letter;
            
            const label = document.createElement('span');
            label.textContent = item.label;
            
            legendItem.appendChild(colorBox);
            legendItem.appendChild(label);
            legend.appendChild(legendItem);
        });
        
        plantingTimelines.appendChild(legend);
    }
    
    // Helper function to determine if a month is a sowing month for a plant
    function isSowingMonth(plant, month) {
        if (!plant.sowEarlyMonth || !plant.sowLateMonth) return false;
        
        if (plant.sowEarlyMonth <= plant.sowLateMonth) {
            return month >= plant.sowEarlyMonth && month <= plant.sowLateMonth;
        } else {
            // Handle wrapping around the year (e.g., November to February)
            return month >= plant.sowEarlyMonth || month <= plant.sowLateMonth;
        }
    }
    
    // Helper function to determine if a month is a harvesting month for a plant
    function isHarvestingMonth(plant, month) {
        if (!plant.harvestFromMonth || !plant.harvestToMonth) return false;
        
        if (plant.harvestFromMonth <= plant.harvestToMonth) {
            return month >= plant.harvestFromMonth && month <= plant.harvestToMonth;
        } else {
            // Handle wrapping around the year (e.g., November to February)
            return month >= plant.harvestFromMonth || month <= plant.harvestToMonth;
        }
    }
    
    // Helper function to determine if a month is a growing month for a plant
    function isGrowingMonth(plant, month) {
        if (!plant.sowEarlyMonth || !plant.harvestToMonth) return false;
        
        const startGrowing = plant.sowEarlyMonth;
        const endGrowing = plant.harvestToMonth;
        
        if (startGrowing <= endGrowing) {
            return month > startGrowing && month < endGrowing && !isSowingMonth(plant, month) && !isHarvestingMonth(plant, month);
        } else {
            // Handle wrapping around the year
            return (month > startGrowing || month < endGrowing) && !isSowingMonth(plant, month) && !isHarvestingMonth(plant, month);
        }
    }
    
    // Helper function to get plant emoji
    function getPlantEmoji(plant) {
        if (!plant) return "🌱";
        
        const name = plant.Crop?.toLowerCase() || "";
        
        // Check exact matches first
        for (const [key, emoji] of Object.entries(plantEmojis)) {
            if (name === key.toLowerCase()) return emoji;
        }
        
        // Then check for contains
        for (const [key, emoji] of Object.entries(plantEmojis)) {
            if (name.includes(key.toLowerCase())) return emoji;
        }
        
        // Fall back to category emoji
        return categoryEmojis[plant.Category] || categoryEmojis.default;
    }
    
    // Update the calendar view
    function updateCalendar() {
        calendarBody.innerHTML = '';
        
        // Get the growing calendar for each plant
        const plantsInGarden = Object.entries(garden.plants)
            .filter(([_, count]) => count > 0)
            .map(([plantId, count]) => ({ 
                id: plantId, 
                count, 
                plant: plantDatabase[plantId] 
            }));
        
        if (plantsInGarden.length === 0) {
            calendarBody.innerHTML = '<tr><td colspan="2">Add plants to your garden to see the calendar.</td></tr>';
            return;
        }
        
        // Sort plants by sowing month
        plantsInGarden.sort((a, b) => {
            const aMonth = a.plant.sowEarlyMonth || 12;
            const bMonth = b.plant.sowEarlyMonth || 12;
            return aMonth - bMonth;
        });
        
        // Create calendar rows
        plantsInGarden.forEach(({ id, count, plant }) => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.style.display = 'flex';
            nameCell.style.alignItems = 'center';
            
            const emoji = document.createElement('span');
            emoji.style.marginRight = '5px';
            emoji.textContent = getPlantEmoji(plant);
            
            const name = document.createElement('span');
            name.textContent = `${plant.Crop} (${count})`;
            
            nameCell.appendChild(emoji);
            nameCell.appendChild(name);
            
            const timingCell = document.createElement('td');
            
            // Format planting/harvesting dates
            let timingText = '';
            if (plant['Sow early'] && plant['Sow late']) {
                timingText += `Sow: ${plant['Sow early']}`;
                if (plant['Sow early'] !== plant['Sow late']) {
                    timingText += ` - ${plant['Sow late']}`;
                }
            }
            
            if (plant['Harvest from'] && plant['Latest harvest']) {
                if (timingText) timingText += ', ';
                timingText += `Harvest: ${plant['Harvest from']}`;
                if (plant['Harvest from'] !== plant['Latest harvest']) {
                    timingText += ` - ${plant['Latest harvest']}`;
                }
            }
            
            timingCell.textContent = timingText || 'Timing information not available';
            
            row.appendChild(nameCell);
            row.appendChild(timingCell);
            calendarBody.appendChild(row);
        });
    }
    
    // Show notification
    function showNotification(message, type = "") {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = 'notification';
        
        if (type) {
            notification.classList.add(type);
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Switch between tabs
    function switchTab(tabId) {
        console.log(`Switching to tab: ${tabId}`);
        
        // Update active tab button
        tabButtons.forEach(button => {
            if (button.dataset.tab === tabId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update active tab content
        const tabContentsArray = Array.from(tabContents);
        tabContentsArray.forEach(content => {
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
                content.style.display = 'block';
            } else {
                content.classList.remove('active');
                content.style.display = 'none';
            }
        });
        
        // If switching to plant info tab
        if (tabId === 'info') {
            // If no plant is selected, show the first plant in the database
            if (!selectedPlant) {
                const firstPlantId = Object.keys(plantDatabase)[0];
                showPlantInfo(firstPlantId);
            }
        }
        
        // If switching to timeline tab, update it
        if (tabId === 'timeline') {
            updatePlantingTimelines();
        }
    }
    
    // Initialize event listeners
    function initializeEventListeners() {
        // Tab switching
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                switchTab(tabId);
                console.log('Switched to tab:', tabId);
            });
        });
        
        // Grid size change
        gridSizeSelect.addEventListener('change', () => {
            const size = parseInt(gridSizeSelect.value);
            
            if (confirm('Changing the grid size will clear your current garden. Continue?')) {
                garden.rows = size;
                garden.cols = size;
                garden.grid = Array(size).fill().map(() => Array(size).fill(''));
                garden.plants = {};
                
                initializeGrid();
                updateCalendar();
                updatePlantingTimelines();
            } else {
                // Reset select to current size
                gridSizeSelect.value = garden.rows.toString();
            }
        });
        
        // Clear garden button
        clearGardenBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all plants from your garden?')) {
                garden.grid = Array(garden.rows).fill().map(() => Array(garden.cols).fill(''));
                garden.plants = {};
                
                initializeGrid();
                updateCalendar();
                updatePlantingTimelines();
                
                showNotification('Garden cleared.', 'success');
            }
        });
        
        // New garden button
        newGardenBtn.addEventListener('click', () => {
            if (confirm('Create a new garden? This will clear all current plants.')) {
                const name = prompt('Enter a name for your garden:', 'My Garden');
                if (name) {
                    garden = {
                        name: name,
                        rows: garden.rows,
                        cols: garden.cols,
                        grid: Array(garden.rows).fill().map(() => Array(garden.cols).fill('')),
                        plants: {},
                        plantingDate: new Date()
                    };
                    
                    plantingDate.valueAsDate = garden.plantingDate;
                    
                    initializeGrid();
                    updateCalendar();
                    updatePlantingTimelines();
                    
                    showNotification(`New garden "${name}" created.`, 'success');
                }
            }
        });
        
        // Save garden button
        saveGardenBtn.addEventListener('click', () => {
            // Create a garden data object
            const gardenData = {
                ...garden,
                plantingDate: garden.plantingDate.toISOString()
            };
            
            // Convert to JSON
            const gardenJson = JSON.stringify(gardenData);
            
            // Save to localStorage
            localStorage.setItem('gardenMasterData', gardenJson);
            
            // Optionally, download as file
            if (confirm('Garden saved locally. Do you also want to download a backup file?')) {
                const blob = new Blob([gardenJson], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `${garden.name.replace(/\s+/g, '_')}_garden.json`;
                a.click();
                URL.revokeObjectURL(a.href);
            }
            
            showNotification('Garden saved successfully!', 'success');
        });
        
        // Load garden button
        loadGardenBtn.addEventListener('click', () => {
            // First try to load from localStorage
            const savedGarden = localStorage.getItem('gardenMasterData');
            
            if (savedGarden) {
                if (confirm('Load the previously saved garden from browser storage?')) {
                    // Parse the saved garden
                    try {
                        const gardenData = JSON.parse(savedGarden);
                        
                        // Restore the garden
                        garden = {
                            ...gardenData,
                            plantingDate: new Date(gardenData.plantingDate)
                        };
                        
                        // Update the UI
                        plantingDate.valueAsDate = garden.plantingDate;
                        initializeGrid();
                        updateCalendar();
                        updatePlantingTimelines();
                        
                        showNotification(`Garden "${garden.name}" loaded successfully.`, 'success');
                        return;
                    } catch (error) {
                        console.error('Error loading garden:', error);
                        showNotification('Error loading saved garden.', 'error');
                    }
                }
            }
            
            // If no localStorage or user declined, offer file upload
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        try {
                            const gardenData = JSON.parse(e.target.result);
                            
                            // Restore the garden
                            garden = {
                                ...gardenData,
                                plantingDate: new Date(gardenData.plantingDate)
                            };
                            
                            // Update the UI
                            plantingDate.valueAsDate = garden.plantingDate;
                            initializeGrid();
                            updateCalendar();
                            updatePlantingTimelines();
                            
                            showNotification(`Garden "${garden.name}" loaded successfully.`, 'success');
                        } catch (error) {
                            console.error('Error loading garden from file:', error);
                            showNotification('Error loading garden from file.', 'error');
                        }
                    };
                    
                    reader.readAsText(file);
                }
            });
            
            fileInput.click();
        });
        
        // Plant search input
        plantSearch.addEventListener('input', updatePlantList);
        
        // Clear search button
        clearSearch.addEventListener('click', () => {
            plantSearch.value = '';
            updatePlantList();
        });
        
        // Category filter change
        categoryFilter.addEventListener('change', updatePlantList);
        
        // Planting date change
        plantingDate.addEventListener('change', () => {
            garden.plantingDate = new Date(plantingDate.value);
            updateCalendar();
        });
    }
    
    // Initialize the app
    init();
});
        // =================================================
        // PLANT DATABASE AND UTILITIES
        // =================================================
        
        // Month name utilities
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Plant emojis for common vegetables
        const plantEmojis = {
            "Tomato": "🍅",
            "Potato": "🥔",
            "Carrot": "🥕",
            "Onion": "🧅",
            "Garlic": "🧄",
            "Lettuce": "🥬",
            "Cucumber": "🥒",
            "Pepper": "🌶️",
            "Corn": "🌽",
            "Pumpkin": "🎃",
            "Eggplant": "🍆",
            "Broccoli": "🥦",
            "Cabbage": "🥬",
            "Herb": "🌿",
            "Fruits": "🍓",
            "Bean": "🫘",
            "Pea": "🫛",
            "Aubergine": "🍆",
            "Beetroot": "🫒", // No beetroot emoji, using olive
            "Chili": "🌶️",
            "Peas": "🫛"
        };
        
        // Default emojis for plant categories
        const categoryEmojis = {
            "Annual fruit & veg": "🍎",
            "Annual herb & spice": "🌿",
            "Perennial veg": "🥦",
            "Perennial herbs & spice": "🌱",
            "Flowers and companions": "🌼",
            "Winter poly crops": "❄️",
            "Soft fruit": "🍓",
            "Trees": "🌳",
            "Tomatoes": "🍅",
            "Green manures": "🌱",
            "Annual flowers": "🌸",
            "Biennial flowers": "🌺",
            "Perennial flowers": "🌻",
            "default": "🌱"
        };
        
        // Helper function to determine emoji for a plant
        function getPlantEmoji(plant) {
            if (!plant) return "🌱";
            
            const name = plant.Crop?.toLowerCase() || "";
            
            // Check exact matches first
            for (const [key, emoji] of Object.entries(plantEmojis)) {
                if (name === key.toLowerCase()) return emoji;
            }
            
            // Then check for contains
            for (const [key, emoji] of Object.entries(plantEmojis)) {
                if (name.includes(key.toLowerCase())) return emoji;
            }
            
            // Fall back to category emoji
            return categoryEmojis[plant.Category] || categoryEmojis.default;
        }
        
        // Sample plant database based on your CSV
        const plantDatabase = {
            'tomato': { 
                ID: 1, 
                Crop: 'Tomato',
                Family: 'Solanaceae',
                Category: 'Annual fruit & veg',
                Species: 'Solanum lycopersicum',
                Varieties: 'Roma, Moneymaker, Cherry, Beefsteak, San Marzano',
                Soil: 'Rich, Warm',
                Site: 'Sunny, Sheltered',
                'Conditions for germination': '>21°C',
                'Sow early': 'February',
                'Sow late': 'March',
                'Transplant after': '5-6 weeks',
                'Plant out from': 'May',
                'Plant out until': 'June',
                Method: 'Transplant',
                'Between rows [RHS]': '60cm [50]',
                'Between plants': '40cm [50]',
                'Harvest from': 'July',
                'Latest harvest': 'October',
                'Weeks in bed': '24-28',
                Rotation: 'Fruiting Veg',
                Profitability: 'High',
                Hardiness: 'Tender',
                'Growing tips': 'Sow on Valentine\'s Day and again in mid-March; pot on (9cm) with a couple mm below the seed leaves to encourage more roots, and plant out when 20cm tall, again a little deeper to encourage root; feed with high potash every 2 weeks after flowering; top after 4-6 trusses when outside.',
                'Harvest tips': 'Harvest every 2-3 days',
                // Derived values for the app
                sowEarlyMonth: 1, // 0-based index for February
                sowLateMonth: 2,  // 0-based index for March
                harvestFromMonth: 6, // 0-based index for July
                harvestToMonth: 9,  // 0-based index for October
                // Custom fields for companion planting
                companions: ['basil', 'marigold', 'onion', 'carrot', 'nasturtium'],
                enemies: ['potato', 'fennel', 'corn']
            },
            'carrot': { 
                ID: 2, 
                Crop: 'Carrot',
                Family: 'Apiaceae',
                Category: 'Annual fruit & veg',
                Species: 'Daucus carota subsp. sativus',
                Varieties: 'Nantes, Amsterdam Forcing, Autumn King, Chantenay Red',
                Soil: 'Well Drained, Low N',
                Site: 'Not Too Shady',
                'Conditions for germination': '>7°C, 1cm deep',
                'Sow early': 'February',
                'Sow late': 'July',
                'Transplant after': '',
                'Plant out from': '-',
                'Plant out until': '-',
                Method: 'Direct',
                'Between rows [RHS]': '15cm [30]',
                'Between plants': '4-8cm [10]',
                'Harvest from': 'May',
                'Latest harvest': 'November',
                'Weeks in bed': '7-18',
                Rotation: 'Root',
                Profitability: 'Medium',
                Hardiness: 'Light Frost',
                'Growing tips': 'Carrots sown in late May/early June will miss worst of the carrot fly; intercrop with radish or lettuce; keep soil moist for the first month, do not sow into fresh compost, best after brassicas.',
                'Harvest tips': 'Bunches with leaves indicating freshness sell for higher price',
                sowEarlyMonth: 1,
                sowLateMonth: 6,
                harvestFromMonth: 4,
                harvestToMonth: 10,
                companions: ['onion', 'sage', 'pea', 'lettuce', 'radish'],
                enemies: ['dill', 'parsnip', 'beetroot']
            },
            'lettuce': { 
                ID: 3, 
                Crop: 'Lettuce',
                Family: 'Asteraceae',
                Category: 'Annual fruit & veg',
                Species: 'Lactuca sativa',
                Varieties: 'Little Gem, Butterhead, Iceberg, Romaine, Red Salad Bowl',
                Soil: 'Moist, Rich',
                Site: 'Partial Shade In Summer',
                'Conditions for germination': '10-20°C, light needed',
                'Sow early': 'February',
                'Sow late': 'September',
                'Transplant after': '3-4 weeks',
                'Plant out from': 'March',
                'Plant out until': 'September',
                Method: 'Direct or Transplant',
                'Between rows [RHS]': '30cm',
                'Between plants': '20-30cm',
                'Harvest from': 'May',
                'Latest harvest': 'November',
                'Weeks in bed': '6-10',
                Rotation: 'Salad',
                Profitability: 'Medium',
                Hardiness: 'Half Hardy',
                'Growing tips': 'Succession sow every 2-3 weeks for continuous harvest. Provide partial shade in hot weather to prevent bolting.',
                'Harvest tips': 'Harvest in morning when crisp, outer leaves can be picked continuously for cut-and-come-again',
                sowEarlyMonth: 1,
                sowLateMonth: 8,
                harvestFromMonth: 4,
                harvestToMonth: 10,
                companions: ['carrot', 'radish', 'cucumber', 'strawberry'],
                enemies: ['broccoli', 'cabbage', 'celery']
            },
            'potato': { 
                ID: 4, 
                Crop: 'Potato (1st early)',
                Family: 'Solanaceae',
                Category: 'Annual fruit & veg',
                Species: 'Solanum tuberosum',
                Varieties: 'Pink Fir, Jersey Royal, Foremost, Casablanca',
                Soil: 'Rich, Well Drained',
                Site: 'Full Sun',
                'Conditions for germination': 'pre-chit indoors',
                'Sow early': 'March',
                'Sow late': 'March',
                'Transplant after': '3 weeks',
                'Plant out from': '-',
                'Plant out until': '-',
                Method: 'Tubers',
                'Between rows [RHS]': '75cm',
                'Between plants': '25cm [60]',
                'Harvest from': 'May',
                'Latest harvest': 'June',
                'Weeks in bed': '10-12',
                Rotation: 'Potato',
                Profitability: 'Medium',
                Hardiness: 'Tender',
                'Growing tips': 'Buy seed potatoes in February and chit in egg boxes; plant with chopped comfrey and earth up ¾ of plant every 6 weeks or especially if frosts predicted.',
                'Harvest tips': 'Harvest once plants have started to flower',
                sowEarlyMonth: 2,
                sowLateMonth: 2,
                harvestFromMonth: 4,
                harvestToMonth: 5,
                companions: ['horseradish', 'corn', 'cabbage', 'beans'],
                enemies: ['tomato', 'cucumber', 'pumpkin', 'sunflower']
            },
            'onion': { 
                ID: 5, 
                Crop: 'Onion',
                Family: 'Alliaceae',
                Category: 'Annual fruit & veg',
                Species: 'Allium cepa',
                Varieties: 'Walla Walla, White Ebenezer, Sturon, Red Baron',
                Soil: 'Rich, Well Drained',
                Site: 'Sun* – Light Shade',
                'Conditions for germination': '>10°C',
                'Sow early': 'Feb [July]',
                'Sow late': 'March [Sept]',
                'Transplant after': '6 weeks',
                'Plant out from': 'Mar [Sept]',
                'Plant out until': 'May [Nov]',
                Method: 'Transplant / sets',
                'Between rows [RHS]': '10cm [25]',
                'Between plants': '10cm [10]',
                'Harvest from': 'June',
                'Latest harvest': 'August',
                'Weeks in bed': '26',
                Rotation: 'Allium',
                Profitability: 'Medium',
                Hardiness: 'Hardy',
                'Growing tips': 'Germinate best at 21°C, grow best at 12-24°C. Sow in Feb and prick out into modules when large enough and transplant a couple months later.',
                'Harvest tips': 'Ready when tops yellow / fall over, lift and leave to dry out in sun until skins are papery',
                sowEarlyMonth: 1,
                sowLateMonth: 2,
                harvestFromMonth: 5,
                harvestToMonth: 7,
                companions: ['carrot', 'beetroot', 'strawberry', 'tomato', 'lettuce'],
                enemies: ['beans', 'peas', 'asparagus']
            },
            'cucumber': { 
                ID: 6, 
                Crop: 'Cucumber',
                Family: 'Cucurbitaceae',
                Category: 'Annual fruit & veg',
                Species: 'Cucumis sativus',
                Varieties: 'Crystal Lemon, Marketmore, Diva, Telegraph Improved',
                Soil: 'Rich, Moist',
                Site: 'Sunny, Sheltered',
                'Conditions for germination': '>15°C [20°C] then 28°C',
                'Sow early': 'March',
                'Sow late': 'July',
                'Transplant after': '3 weeks',
                'Plant out from': 'May',
                'Plant out until': 'August',
                Method: 'Transplant',
                'Between rows [RHS]': '45cm [75]',
                'Between plants': '45cm',
                'Harvest from': 'July',
                'Latest harvest': 'October',
                'Weeks in bed': '16-20',
                Rotation: 'Fruiting Veg',
                Profitability: 'High',
                Hardiness: 'Tender',
                'Growing tips': 'Transplants dislike root disturbance so ideally use biodegradable pots; remove all flowers until 2ft tall / 6 leaves.',
                'Harvest tips': 'Must be picked every 2-3 days, immerse in water to cool.',
                sowEarlyMonth: 2,
                sowLateMonth: 6,
                harvestFromMonth: 6,
                harvestToMonth: 9,
                companions: ['sunflower', 'corn', 'beans', 'peas', 'radish'],
                enemies: ['potato', 'sage', 'aromatic herbs']
            },
            'pepper': { 
                ID: 7, 
                Crop: 'Pepper',
                Family: 'Solanaceae',
                Category: 'Annual fruit & veg',
                Species: 'Capsicum annuum',
                Varieties: 'Bell, Jalapeño, Cayenne, Hungarian Wax',
                Soil: 'Rich, well-drained',
                Site: 'Full sun, sheltered',
                'Conditions for germination': '20-30°C, consistent warmth',
                'Sow early': 'February',
                'Sow late': 'March',
                'Transplant after': '6-8 weeks',
                'Plant out from': 'May',
                'Plant out until': 'June',
                Method: 'Transplant',
                'Between rows [RHS]': '45cm',
                'Between plants': '45cm',
                'Harvest from': 'July',
                'Latest harvest': 'October',
                'Weeks in bed': '20-24',
                Rotation: 'Fruiting Veg',
                Profitability: 'Medium',
                Hardiness: 'Tender',
                'Growing tips': 'Need consistent warmth. Pinch out growing tip when plant has 6-8 leaves to encourage bushier habit. Feed with high potash once flowering starts.',
                'Harvest tips': 'Green peppers can be harvested when firm, or leave to ripen to red/yellow/orange for sweeter flavor',
                sowEarlyMonth: 1,
                sowLateMonth: 2,
                harvestFromMonth: 6,
                harvestToMonth: 9,
                companions: ['tomato', 'basil', 'onion', 'carrots'],
                enemies: ['fennel', 'kohlrabi', 'beans']
            },
            'beetroot': { 
                ID: 8, 
                Crop: 'Beetroot',
                Family: 'Amaranthaceae',
                Category: 'Annual fruit & veg',
                Species: 'Beta vulgaris',
                Varieties: 'Detroit, Chioggia, Bulls Blood, Cylindra',
                Soil: 'Well-drained, not too acidic',
                Site: 'Sun or partial shade',
                'Conditions for germination': '10-25°C',
                'Sow early': 'March',
                'Sow late': 'July',
                'Transplant after': 'Not recommended',
                'Plant out from': 'N/A',
                'Plant out until': 'N/A',
                Method: 'Direct sow',
                'Between rows [RHS]': '30cm',
                'Between plants': '10cm',
                'Harvest from': 'June',
                'Latest harvest': 'November',
                'Weeks in bed': '8-12',
                Rotation: 'Root',
                Profitability: 'Medium',
                Hardiness: 'Hardy',
                'Growing tips': 'Each "seed" is actually a cluster that may produce multiple seedlings that should be thinned. Keep soil consistently moist to prevent woodiness.',
                'Harvest tips': 'Best harvested young at golf ball to tennis ball size. Twist off leaves rather than cutting to prevent bleeding',
                sowEarlyMonth: 2,
                sowLateMonth: 6,
                harvestFromMonth: 5,
                harvestToMonth: 10,
                companions: ['onion', 'lettuce', 'cabbage', 'kohlrabi'],
                enemies: ['mustard', 'charlock', 'pole beans']
            },
            'broccoli': { 
                ID: 9, 
                Crop: 'Broccoli',
                Family: 'Brassicaceae',
                Category: 'Annual fruit & veg',
                Species: 'Brassica oleracea var. italica',
                Varieties: 'Calabrese, Purple Sprouting, Romanesco',
                Soil: 'Firm, moisture-retentive',
                Site: 'Full sun or light shade',
                'Conditions for germination': '7-30°C',
                'Sow early': 'March',
                'Sow late': 'June',
                'Transplant after': '4-6 weeks',
                'Plant out from': 'May',
                'Plant out until': 'July',
                Method: 'Transplant',
                'Between rows [RHS]': '45cm',
                'Between plants': '30cm',
                'Harvest from': 'July',
                'Latest harvest': 'April',
                'Weeks in bed': '16-40',
                Rotation: 'Brassica',
                Profitability: 'Medium',
                Hardiness: 'Hardy',
                'Growing tips': 'Firm soil around plants to prevent wind rock. Cover with netting to prevent cabbage white butterflies. Apply lime if soil pH is below 6.5.',
                'Harvest tips': 'Cut main head with knife before flowers open. Side shoots will develop after main head harvest',
                sowEarlyMonth: 2,
                sowLateMonth: 5,
                harvestFromMonth: 6,
                harvestToMonth: 3,
                companions: ['celery', 'onion', 'potato', 'aromatic herbs'],
                enemies: ['tomato', 'strawberry', 'runner beans']
            }