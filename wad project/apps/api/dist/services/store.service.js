import bcrypt from 'bcryptjs';
// In-memory persistent datastore supporting full relational queries, geospatial filtering and transactions
export class StoreService {
    static instance;
    users = new Map();
    customerProfiles = new Map();
    providerProfiles = new Map();
    categories = new Map();
    services = new Map();
    providerServices = new Map();
    addresses = new Map();
    workingHours = new Map(); // key is providerId
    bookings = new Map();
    reviews = new Map();
    favorites = new Map(); // key is customerId_providerId
    conversations = new Map();
    messages = new Map(); // key is conversationId
    notifications = new Map(); // key is userId
    disputes = new Map();
    payments = new Map();
    quotes = new Map();
    adminActions = [];
    isInitialized = false;
    constructor() { }
    static getInstance() {
        if (!StoreService.instance) {
            StoreService.instance = new StoreService();
        }
        return StoreService.instance;
    }
    async initialize() {
        if (this.isInitialized)
            return;
        await this.seedData();
        this.isInitialized = true;
        console.log(`[StoreService] Loaded: ${this.users.size} users, ${this.providerProfiles.size} providers, ${this.categories.size} categories, ${this.services.size} services, ${this.bookings.size} bookings, ${this.reviews.size} reviews.`);
    }
    async seedData() {
        const defaultPasswordHash = await bcrypt.hash('FixNear@123', 10);
        // 1. Categories
        const categoriesData = [
            { id: 'cat-1', name: 'Electrical', slug: 'electrical', description: 'Expert electricians for wiring, switches, lighting, and power fixes', iconName: 'Zap', displayOrder: 1 },
            { id: 'cat-2', name: 'Plumbing', slug: 'plumbing', description: 'Pipes, leak repairs, taps, bathroom fittings, and motor installation', iconName: 'Wrench', displayOrder: 2 },
            { id: 'cat-3', name: 'AC & Cooling', slug: 'ac-cooling', description: 'AC servicing, gas charging, filter cleanup, installation, and PCB repair', iconName: 'Wind', displayOrder: 3 },
            { id: 'cat-4', name: 'Appliance Repair', slug: 'appliance-repair', description: 'Washing machine, refrigerator, microwave, and TV diagnostics & repair', iconName: 'Tv', displayOrder: 4 },
            { id: 'cat-5', name: 'Laptop & Mobile Repair', slug: 'laptop-mobile', description: 'Screen replacement, battery, software, motherboard, and OS servicing', iconName: 'Laptop', displayOrder: 5 },
            { id: 'cat-6', name: 'Car Services', slug: 'car-services', description: 'Car breakdown, battery jumpstart, periodic maintenance, and denting', iconName: 'Car', displayOrder: 6 },
            { id: 'cat-7', name: 'Bike Services', slug: 'bike-services', description: 'Two-wheeler doorstep servicing, puncture repair, and engine tuning', iconName: 'Bike', displayOrder: 7 },
            { id: 'cat-8', name: 'Carpentry', slug: 'carpentry', description: 'Furniture repair, door locks, modular kitchen woodwork, and drilling', iconName: 'Hammer', displayOrder: 8 },
            { id: 'cat-9', name: 'Painting', slug: 'painting', description: 'Interior/exterior wall painting, waterproof coating, and touch-up work', iconName: 'Paintbrush', displayOrder: 9 },
            { id: 'cat-10', name: 'Cleaning', slug: 'cleaning', description: 'Full home deep cleaning, bathroom sanitization, and sofa shampooing', iconName: 'Sparkles', displayOrder: 10 },
            { id: 'cat-11', name: 'Pest Control', slug: 'pest-control', description: 'Cockroach, termite, bed bug, and mosquito management treatment', iconName: 'Bug', displayOrder: 11 },
        ];
        for (const c of categoriesData) {
            this.categories.set(c.id, {
                ...c,
                imageUrl: `https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80`,
                isActive: true,
                serviceCount: 3,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }
        // 2. Services
        const servicesData = [
            // Electrical
            { id: 'srv-1', categoryId: 'cat-1', name: 'Switch & Socket Repair / Replacement', slug: 'switch-socket-repair', description: 'Fix faulty switchboards, MCBs, plug points and sockets', basePrice: 199, pricingType: 'STARTING_FROM', duration: 45 },
            { id: 'srv-2', categoryId: 'cat-1', name: 'Ceiling Fan Installation & Repair', slug: 'fan-installation', description: 'Ceiling fan mounting, regulator replacement, blade balancing', basePrice: 299, pricingType: 'FIXED_PRICE', duration: 60 },
            { id: 'srv-3', categoryId: 'cat-1', name: 'Complete House Wiring Inspection', slug: 'house-wiring-check', description: 'Check load distribution, short circuits, earthing tests', basePrice: 799, pricingType: 'QUOTE_REQUIRED', duration: 120 },
            // Plumbing
            { id: 'srv-4', categoryId: 'cat-2', name: 'Tap & Shower Leakage Repair', slug: 'tap-leak-repair', description: 'Fix dripping faucets, washers, valves, and shower heads', basePrice: 249, pricingType: 'FIXED_PRICE', duration: 45 },
            { id: 'srv-5', categoryId: 'cat-2', name: 'Drainage & Pipe Blockage Removal', slug: 'drainage-blockage', description: 'Kitchen sink, toilet, or pipeline blockage clearance', basePrice: 499, pricingType: 'STARTING_FROM', duration: 60 },
            { id: 'srv-6', categoryId: 'cat-2', name: 'Water Tank & Motor Pump Installation', slug: 'motor-installation', description: 'Monoblock or submersible water pump fitting & plumbing', basePrice: 850, pricingType: 'QUOTE_REQUIRED', duration: 90 },
            // AC & Cooling
            { id: 'srv-7', categoryId: 'cat-3', name: 'Split AC Deep Foam Jet Servicing', slug: 'split-ac-servicing', description: 'High-pressure foam water cleaning of cooling coils & indoor unit', basePrice: 499, pricingType: 'FIXED_PRICE', duration: 60 },
            { id: 'srv-8', categoryId: 'cat-3', name: 'AC Gas Charging / Leak Fix', slug: 'ac-gas-charging', description: 'Vacuum testing, copper leak brazing, and refrigerant top-up', basePrice: 1800, pricingType: 'STARTING_FROM', duration: 90 },
            { id: 'srv-9', categoryId: 'cat-3', name: 'AC Installation / Uninstallation', slug: 'ac-installation', description: 'Professional wall bracket mounting, copper piping and ducting', basePrice: 1200, pricingType: 'FIXED_PRICE', duration: 120 },
            // Appliance Repair
            { id: 'srv-10', categoryId: 'cat-4', name: 'Washing Machine Repair & Diagnostics', slug: 'washing-machine-repair', description: 'Front-load or top-load spin issues, water drainage, and PCB fixes', basePrice: 349, pricingType: 'STARTING_FROM', duration: 60 },
            { id: 'srv-11', categoryId: 'cat-4', name: 'Refrigerator Cooling Repair', slug: 'refrigerator-repair', description: 'Defrost timer, thermostat, compressor, and gas troubleshooting', basePrice: 399, pricingType: 'STARTING_FROM', duration: 60 },
            { id: 'srv-12', categoryId: 'cat-4', name: 'Microwave Oven Repair', slug: 'microwave-repair', description: 'Heating problem, turntable motor, magnetron, and touch panel fix', basePrice: 299, pricingType: 'FIXED_PRICE', duration: 45 },
            // Laptop & Mobile
            { id: 'srv-13', categoryId: 'cat-5', name: 'Laptop Doorstep Diagnosis & Cleaning', slug: 'laptop-diagnosis', description: 'Thermal paste reapplication, fan dust removal, slow performance check', basePrice: 399, pricingType: 'FIXED_PRICE', duration: 60 },
            { id: 'srv-14', categoryId: 'cat-5', name: 'Laptop Screen / Keyboard Replacement', slug: 'laptop-screen-replacement', description: 'Genuine replacement display and keyboard for HP, Dell, Lenovo, Apple', basePrice: 1500, pricingType: 'QUOTE_REQUIRED', duration: 90 },
            { id: 'srv-15', categoryId: 'cat-5', name: 'Mobile Phone Screen & Battery Replacement', slug: 'mobile-screen-repair', description: 'High grade OLED/LCD glass and battery replacement for smartphones', basePrice: 999, pricingType: 'STARTING_FROM', duration: 60 },
            // Car Services
            { id: 'srv-16', categoryId: 'cat-6', name: 'Doorstep Car Battery Jumpstart', slug: 'car-jumpstart', description: 'Emergency quick jumpstart service anywhere within service radius', basePrice: 399, pricingType: 'FIXED_PRICE', duration: 30 },
            { id: 'srv-17', categoryId: 'cat-6', name: 'Car Basic Periodic Service', slug: 'car-periodic-service', description: 'Engine oil replacement, oil filter, air filter, brake inspection', basePrice: 2499, pricingType: 'STARTING_FROM', duration: 180 },
            // Bike Services
            { id: 'srv-18', categoryId: 'cat-7', name: 'Doorstep Bike General Service', slug: 'bike-general-service', description: 'Brake tuning, spark plug cleaning, chain lubrication, engine oil change', basePrice: 499, pricingType: 'FIXED_PRICE', duration: 60 },
            { id: 'srv-19', categoryId: 'cat-7', name: 'Emergency Bike Breakdown & Puncture', slug: 'bike-breakdown', description: 'Tubeless tyre puncture repair and on-the-spot mechanic assistance', basePrice: 299, pricingType: 'FIXED_PRICE', duration: 30 },
            // Carpentry
            { id: 'srv-20', categoryId: 'cat-8', name: 'Door Lock Installation & Repair', slug: 'door-lock-repair', description: 'Deadbolts, mortise locks, handles, and hinge adjustments', basePrice: 299, pricingType: 'FIXED_PRICE', duration: 45 },
            { id: 'srv-21', categoryId: 'cat-8', name: 'Furniture Assembly / Repair', slug: 'furniture-assembly', description: 'Bed, wardrobe, bookshelf, and table assembly or fixing', basePrice: 450, pricingType: 'HOURLY', duration: 60 },
            // Painting
            { id: 'srv-22', categoryId: 'cat-9', name: '1 Room Painting / Touch-Up', slug: 'room-painting', description: 'Wall primer + 2 coats of premium emulsion painting', basePrice: 2499, pricingType: 'STARTING_FROM', duration: 360 },
            { id: 'srv-23', categoryId: 'cat-9', name: 'Waterproofing & Wall Seepage Fix', slug: 'waterproofing-fix', description: 'Chemical coating and dampness repair for interior walls', basePrice: 1800, pricingType: 'QUOTE_REQUIRED', duration: 240 },
            // Cleaning
            { id: 'srv-24', categoryId: 'cat-10', name: 'Bathroom Deep Cleaning (Per Bathroom)', slug: 'bathroom-deep-cleaning', description: 'Tile scrubbing, hard water stain removal, mirror and chrome polish', basePrice: 399, pricingType: 'FIXED_PRICE', duration: 60 },
            { id: 'srv-25', categoryId: 'cat-10', name: 'Full Home Deep Cleaning (2 BHK)', slug: 'full-home-cleaning', description: 'Floor scrubbing, cobweb removal, kitchen degreasing, bathroom polish', basePrice: 2999, pricingType: 'STARTING_FROM', duration: 300 },
            // Pest Control
            { id: 'srv-26', categoryId: 'cat-11', name: 'Cockroach & Ant Herbal Gel Treatment', slug: 'cockroach-pest-control', description: 'Odorless non-toxic herbal gel bait application with 3-month guarantee', basePrice: 699, pricingType: 'FIXED_PRICE', duration: 45 },
            { id: 'srv-27', categoryId: 'cat-11', name: 'Termite Inspection & Chemical Treatment', slug: 'termite-treatment', description: 'Drill-fill-seal barrier protection for wooden doors and furniture', basePrice: 1999, pricingType: 'QUOTE_REQUIRED', duration: 180 },
        ];
        for (const s of servicesData) {
            this.services.set(s.id, {
                id: s.id,
                categoryId: s.categoryId,
                name: s.name,
                slug: s.slug,
                description: s.description,
                basePrice: s.basePrice,
                pricingType: s.pricingType,
                estimatedDurationMinutes: s.duration,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }
        // 3. Demo Admin User
        const adminUser = {
            id: 'usr-admin-1',
            email: 'admin@fixnear.dev',
            passwordHash: defaultPasswordHash,
            name: 'FixNear Super Admin',
            phone: '9876543210',
            role: 'ADMIN',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80',
            isEmailVerified: true,
            isPhoneVerified: true,
            createdAt: new Date('2025-01-01').toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.users.set(adminUser.id, adminUser);
        // 4. Demo Customer User
        const demoCustomer = {
            id: 'usr-cust-demo',
            email: 'customer@fixnear.dev',
            passwordHash: defaultPasswordHash,
            name: 'Rohan Sharma',
            phone: '9840123456',
            role: 'CUSTOMER',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop&q=80',
            isEmailVerified: true,
            isPhoneVerified: true,
            createdAt: new Date('2025-02-01').toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.users.set(demoCustomer.id, demoCustomer);
        this.customerProfiles.set('cp-demo', {
            id: 'cp-demo',
            userId: demoCustomer.id,
            preferredLanguage: 'English',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        // 5. Demo Provider User (Arun Electricals & Cooling)
        const demoProviderUser = {
            id: 'usr-prov-demo',
            email: 'provider@fixnear.dev',
            passwordHash: defaultPasswordHash,
            name: 'Arun Kumar',
            phone: '9841234567',
            role: 'SERVICE_PROVIDER',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop&q=80',
            isEmailVerified: true,
            isPhoneVerified: true,
            createdAt: new Date('2025-01-10').toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.users.set(demoProviderUser.id, demoProviderUser);
        const demoProviderProfile = {
            id: 'prov-demo',
            userId: demoProviderUser.id,
            businessName: 'Arun Electricals & Cooling',
            description: 'Licensed electrical master and certified AC technician with over 11 years of experience in domestic and commercial repairs in Chennai. Specializes in emergency wiring fixes, split AC foam servicing, inverter wiring, and DB box upgrades.',
            status: 'VERIFIED',
            isAvailable: true,
            isEmergencyAvailable: true,
            experienceYears: 11,
            serviceRadiusKm: 20,
            rating: 4.9,
            reviewCount: 142,
            completedJobsCount: 218,
            responseRatePercent: 99,
            cancellationRatePercent: 1.2,
            identityDocumentUrl: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=500',
            licenseDocumentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500',
            portfolioImages: [
                'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80'
            ],
            createdAt: new Date('2025-01-10').toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.providerProfiles.set(demoProviderProfile.id, demoProviderProfile);
        // Provider address (Anna Nagar, Chennai)
        const demoProviderAddress = {
            id: 'addr-prov-demo',
            street: '14, 2nd Avenue, Anna Nagar',
            city: 'Chennai',
            state: 'Tamil Nadu',
            postalCode: '600040',
            country: 'India',
            latitude: 13.0850,
            longitude: 80.2100,
            landmark: 'Near Roundtana',
        };
        this.addresses.set(demoProviderAddress.id, demoProviderAddress);
        demoProviderProfile.address = demoProviderAddress;
        // Attach services to Arun Electricals
        const arunServices = [
            { id: 'ps-1', providerId: 'prov-demo', serviceId: 'srv-1', customPrice: 199, pricingType: 'STARTING_FROM', isActive: true },
            { id: 'ps-2', providerId: 'prov-demo', serviceId: 'srv-2', customPrice: 299, pricingType: 'FIXED_PRICE', isActive: true },
            { id: 'ps-3', providerId: 'prov-demo', serviceId: 'srv-7', customPrice: 499, pricingType: 'FIXED_PRICE', isActive: true },
            { id: 'ps-4', providerId: 'prov-demo', serviceId: 'srv-8', customPrice: 1800, pricingType: 'STARTING_FROM', isActive: true },
        ];
        for (const ps of arunServices) {
            this.providerServices.set(ps.id, {
                ...ps,
                service: this.services.get(ps.serviceId),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }
        // Weekly hours for Arun
        const defaultHours = [
            { day: 'MONDAY', isOpen: true, openTime: '08:30', closeTime: '20:00' },
            { day: 'TUESDAY', isOpen: true, openTime: '08:30', closeTime: '20:00' },
            { day: 'WEDNESDAY', isOpen: true, openTime: '08:30', closeTime: '20:00' },
            { day: 'THURSDAY', isOpen: true, openTime: '08:30', closeTime: '20:00' },
            { day: 'FRIDAY', isOpen: true, openTime: '08:30', closeTime: '20:00' },
            { day: 'SATURDAY', isOpen: true, openTime: '08:30', closeTime: '20:00' },
            { day: 'SUNDAY', isOpen: true, openTime: '09:00', closeTime: '15:00' },
        ];
        this.workingHours.set('prov-demo', defaultHours);
        demoProviderProfile.workingHours = defaultHours;
        // 6. Generate 20+ Realistic Providers in Indian Metros
        const providerSeeds = [
            { id: 'prov-2', name: 'Suresh Babu', biz: 'Sri Lakshmi Plumbing Works', catId: 'cat-2', exp: 8, rating: 4.8, reviews: 88, city: 'Chennai', area: 'T. Nagar', lat: 13.0418, lng: 80.2341, srvs: ['srv-4', 'srv-5', 'srv-6'], status: 'VERIFIED' },
            { id: 'prov-3', name: 'Karthik Raja', biz: 'CoolTech AC Solutions', catId: 'cat-3', exp: 7, rating: 4.7, reviews: 104, city: 'Chennai', area: 'Velachery', lat: 12.9815, lng: 80.2180, srvs: ['srv-7', 'srv-8', 'srv-9'], status: 'VERIFIED' },
            { id: 'prov-4', name: 'Dinesh Kumar', biz: 'QuickFix Laptop & Mobile Care', catId: 'cat-5', exp: 6, rating: 4.9, reviews: 76, city: 'Chennai', area: 'OMR Thoraipakkam', lat: 12.9360, lng: 80.2310, srvs: ['srv-13', 'srv-14', 'srv-15'], status: 'VERIFIED' },
            { id: 'prov-5', name: 'Murugan V', biz: 'MotoCare Garage & Towing', catId: 'cat-6', exp: 12, rating: 4.6, reviews: 62, city: 'Chennai', area: 'Guindy', lat: 13.0067, lng: 80.2025, srvs: ['srv-16', 'srv-17'], status: 'VERIFIED' },
            { id: 'prov-6', name: 'Priya Sundaram', biz: 'SparkleClean Home Services', catId: 'cat-10', exp: 5, rating: 4.8, reviews: 92, city: 'Chennai', area: 'Adyar', lat: 13.0012, lng: 80.2565, srvs: ['srv-24', 'srv-25'], status: 'VERIFIED' },
            { id: 'prov-7', name: 'Selvan Woodcraft', biz: 'Royal Carpentry & Interiors', catId: 'cat-8', exp: 14, rating: 4.9, reviews: 110, city: 'Chennai', area: 'Porur', lat: 13.0382, lng: 80.1565, srvs: ['srv-20', 'srv-21'], status: 'VERIFIED' },
            { id: 'prov-8', name: 'Govind Swamy', biz: 'Asian Paints Pro Squad', catId: 'cat-9', exp: 9, rating: 4.7, reviews: 54, city: 'Chennai', area: 'Alwarpet', lat: 13.0336, lng: 80.2505, srvs: ['srv-22', 'srv-23'], status: 'VERIFIED' },
            { id: 'prov-9', name: 'Mani K', biz: 'PestShield Express Solutions', catId: 'cat-11', exp: 8, rating: 4.8, reviews: 69, city: 'Chennai', area: 'Mylapore', lat: 13.0368, lng: 80.2676, srvs: ['srv-26', 'srv-27'], status: 'VERIFIED' },
            { id: 'prov-10', name: 'Venkatesh Rao', biz: 'TechFix Appliance Doctor', catId: 'cat-4', exp: 10, rating: 4.9, reviews: 130, city: 'Bengaluru', area: 'Koramangala', lat: 12.9352, lng: 77.6245, srvs: ['srv-10', 'srv-11', 'srv-12'], status: 'VERIFIED' },
            { id: 'prov-11', name: 'Deepak Reddy', biz: 'Precision Electricals & Smart Home', catId: 'cat-1', exp: 7, rating: 4.7, reviews: 85, city: 'Bengaluru', area: 'Indiranagar', lat: 12.9784, lng: 77.6408, srvs: ['srv-1', 'srv-2', 'srv-3'], status: 'VERIFIED' },
            { id: 'prov-12', name: 'Basavaraj H', biz: 'AquaFlow Plumbing Pro', catId: 'cat-2', exp: 11, rating: 4.8, reviews: 95, city: 'Bengaluru', area: 'HSR Layout', lat: 12.9121, lng: 77.6446, srvs: ['srv-4', 'srv-5', 'srv-6'], status: 'VERIFIED' },
            { id: 'prov-13', name: 'Ramesh N', biz: 'CoolBreeze HVAC Care', catId: 'cat-3', exp: 6, rating: 4.6, reviews: 48, city: 'Bengaluru', area: 'Whitefield', lat: 12.9698, lng: 77.7500, srvs: ['srv-7', 'srv-8'], status: 'VERIFIED' },
            { id: 'prov-14', name: 'Satish G', biz: 'BikeDoc Two Wheeler Clinic', catId: 'cat-7', exp: 8, rating: 4.8, reviews: 71, city: 'Bengaluru', area: 'BTM Layout', lat: 12.9166, lng: 77.6101, srvs: ['srv-18', 'srv-19'], status: 'VERIFIED' },
            { id: 'prov-15', name: 'Naveen Kumar', biz: 'CleanZen Deep Home Cleaning', catId: 'cat-10', exp: 4, rating: 4.9, reviews: 114, city: 'Bengaluru', area: 'Jayanagar', lat: 12.9250, lng: 77.5938, srvs: ['srv-24', 'srv-25'], status: 'VERIFIED' },
            { id: 'prov-16', name: 'Rajesh Patil', biz: 'Mumbai Express Electricians', catId: 'cat-1', exp: 9, rating: 4.8, reviews: 90, city: 'Mumbai', area: 'Andheri West', lat: 19.1136, lng: 72.8697, srvs: ['srv-1', 'srv-2'], status: 'VERIFIED' },
            { id: 'prov-17', name: 'Sachin More', biz: 'Apex Auto Garage & Detailing', catId: 'cat-6', exp: 13, rating: 4.7, reviews: 83, city: 'Mumbai', area: 'Bandra', lat: 19.0596, lng: 72.8295, srvs: ['srv-16', 'srv-17'], status: 'VERIFIED' },
            { id: 'prov-18', name: 'Amit Tyagi', biz: 'Delhi Cleaners & Sanitization', catId: 'cat-10', exp: 5, rating: 4.7, reviews: 65, city: 'Delhi NCR', area: 'South Extension', lat: 28.5729, lng: 77.2207, srvs: ['srv-24', 'srv-25'], status: 'VERIFIED' },
            { id: 'prov-19', name: 'Syed Nizam', biz: 'Hyderabad Cooling Engineers', catId: 'cat-3', exp: 10, rating: 4.9, reviews: 122, city: 'Hyderabad', area: 'Madhapur', lat: 17.4483, lng: 78.3915, srvs: ['srv-7', 'srv-8', 'srv-9'], status: 'VERIFIED' },
            // 2 pending verification providers for Admin to inspect and approve!
            { id: 'prov-20', name: 'Praveen Chandran', biz: 'Chennai Speedy Fix Techs', catId: 'cat-1', exp: 3, rating: 0, reviews: 0, city: 'Chennai', area: 'Kilpauk', lat: 13.0805, lng: 80.2420, srvs: ['srv-1', 'srv-2'], status: 'PENDING' },
            { id: 'prov-21', name: 'Anand Verma', biz: 'Bangalore Smart Care Pro', catId: 'cat-4', exp: 4, rating: 0, reviews: 0, city: 'Bengaluru', area: 'Hebbal', lat: 13.0358, lng: 77.5970, srvs: ['srv-10', 'srv-11'], status: 'UNDER_REVIEW' },
        ];
        for (const p of providerSeeds) {
            const uId = `usr-${p.id}`;
            const user = {
                id: uId,
                email: `${p.id}@fixnear.dev`,
                passwordHash: defaultPasswordHash,
                name: p.name,
                phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
                role: 'SERVICE_PROVIDER',
                avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=200&fit=crop&q=80`,
                isEmailVerified: true,
                isPhoneVerified: true,
                createdAt: new Date('2025-01-15').toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.users.set(uId, user);
            const profile = {
                id: p.id,
                userId: uId,
                user,
                businessName: p.biz,
                description: `Top-rated professional service provider based in ${p.area}, ${p.city}. Fully verified, vetted background, guaranteed on-time doorstep arrival with genuine spare parts.`,
                status: p.status,
                isAvailable: true,
                isEmergencyAvailable: p.status === 'VERIFIED' && Math.random() > 0.4,
                experienceYears: p.exp,
                serviceRadiusKm: 18,
                rating: p.rating,
                reviewCount: p.reviews,
                completedJobsCount: Math.round(p.reviews * 1.5),
                responseRatePercent: Math.round(92 + Math.random() * 7),
                cancellationRatePercent: Math.round(Math.random() * 3 * 10) / 10,
                identityDocumentUrl: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=500',
                licenseDocumentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500',
                portfolioImages: [
                    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
                ],
                createdAt: new Date('2025-01-15').toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const addr = {
                id: `addr-${p.id}`,
                street: `Building ${Math.floor(Math.random() * 80) + 1}, ${p.area}`,
                city: p.city,
                state: p.city === 'Chennai' ? 'Tamil Nadu' : p.city === 'Bengaluru' ? 'Karnataka' : p.city === 'Mumbai' ? 'Maharashtra' : p.city === 'Hyderabad' ? 'Telangana' : 'Delhi',
                postalCode: p.city === 'Chennai' ? '600028' : '560034',
                country: 'India',
                latitude: p.lat,
                longitude: p.lng,
            };
            this.addresses.set(addr.id, addr);
            profile.address = addr;
            this.workingHours.set(p.id, defaultHours);
            profile.workingHours = defaultHours;
            // Add services
            for (const srvId of p.srvs) {
                const srv = this.services.get(srvId);
                if (srv) {
                    const psId = `ps-${p.id}-${srvId}`;
                    this.providerServices.set(psId, {
                        id: psId,
                        providerId: p.id,
                        serviceId: srvId,
                        service: srv,
                        customPrice: srv.basePrice,
                        pricingType: srv.pricingType,
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    });
                }
            }
            this.providerProfiles.set(p.id, profile);
        }
        // 7. Generate 20 Customers with realistic Indian names
        const customerNames = [
            'Aditi Rao', 'Vikram Seth', 'Ananya Iyer', 'Rahul Nair',
            'Pooja Hegde', 'Siddharth Menon', 'Kavitha Balan', 'Arjun Kapoor',
            'Meera Nambiar', 'Ramesh Krishnan', 'Shreya Ghoshal', 'Naveen Jindal',
            'Divya Prakash', 'Ganesh Murthy', 'Tara Subramanian', 'Karthik Sivakumar',
            'Sneha Reddy', 'Vijay Raghavan', 'Preeti Deshmukh', 'Manoj Bajpayee'
        ];
        for (let i = 0; i < customerNames.length; i++) {
            const cId = `usr-cust-${i + 1}`;
            const name = customerNames[i];
            const email = `customer${i + 1}@fixnear.dev`;
            const custUser = {
                id: cId,
                email,
                passwordHash: defaultPasswordHash,
                name,
                phone: `9840${100000 + i}`,
                role: 'CUSTOMER',
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
                isEmailVerified: true,
                isPhoneVerified: true,
                createdAt: new Date('2025-02-10').toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.users.set(cId, custUser);
            this.customerProfiles.set(`cp-${i + 1}`, {
                id: `cp-${i + 1}`,
                userId: cId,
                preferredLanguage: 'English',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }
        // 8. Generate 50+ Bookings and 100+ Reviews
        const reviewComments = [
            'Arun arrived right on time and fixed our switchboard sparking issue in 20 minutes. Extremely neat work!',
            'Very courteous and explained the root cause clearly. Replaced the faulty capacitor and AC cools rapidly now.',
            'Super responsive! Booked emergency water pipe leakage service and he reached in 25 minutes. Saved my wooden floor.',
            'Professional service, transparent pricing without any surprise charges. Will definitely rebook on FixNear.',
            'Top notch workmanship. Tested everything before leaving and cleaned up all debris afterwards.',
            'Genuine parts used, showed the warranty sticker. Very polite behavior.',
            'Extremely satisfied with the service quality. Highly recommend to everyone in the neighborhood.',
            'Prompt response and clear communication. Fixed the problem that 2 other electricians failed to diagnose.'
        ];
        const providerList = Array.from(this.providerProfiles.values()).filter(p => p.status === 'VERIFIED');
        let bookingCounter = 1;
        let reviewCounter = 1;
        // Create a set of completed historical bookings with reviews
        for (const provider of providerList) {
            const pServices = Array.from(this.providerServices.values()).filter(ps => ps.providerId === provider.id);
            if (pServices.length === 0)
                continue;
            for (let j = 0; j < 3; j++) {
                const bkId = `bk-${bookingCounter++}`;
                const custIndex = (bookingCounter % customerNames.length) + 1;
                const custId = `usr-cust-${custIndex}`;
                const cust = this.users.get(custId);
                const srv = pServices[j % pServices.length].service;
                const bookingDate = new Date();
                bookingDate.setDate(bookingDate.getDate() - (j * 4 + 2));
                const booking = {
                    id: bkId,
                    customerId: custId,
                    customer: {
                        id: cust?.id || custId,
                        name: cust?.name || 'Customer',
                        email: cust?.email || '',
                        phone: cust?.phone,
                        avatarUrl: cust?.avatarUrl
                    },
                    providerId: provider.id,
                    provider: {
                        id: provider.id,
                        businessName: provider.businessName,
                        rating: provider.rating,
                        reviewCount: provider.reviewCount,
                        user: {
                            name: provider.user?.name || provider.businessName,
                            email: provider.user?.email || '',
                            phone: provider.user?.phone,
                            avatarUrl: provider.user?.avatarUrl
                        }
                    },
                    serviceId: srv.id,
                    service: srv,
                    status: 'COMPLETED',
                    scheduledAt: bookingDate.toISOString(),
                    estimatedDurationMinutes: srv.estimatedDurationMinutes,
                    street: '12 Greenways Road, Ext 4',
                    city: provider.address?.city || 'Chennai',
                    state: provider.address?.state || 'Tamil Nadu',
                    postalCode: provider.address?.postalCode || '600028',
                    latitude: (provider.address?.latitude || 13.08) + 0.01,
                    longitude: (provider.address?.longitude || 80.22) + 0.01,
                    contactPhone: cust?.phone || '9840123456',
                    problemDescription: `Regular maintenance and complete inspection for ${srv.name}.`,
                    problemImages: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500'],
                    completionImages: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500'],
                    servicePrice: srv.basePrice,
                    platformFee: 49,
                    discountAmount: 0,
                    totalPrice: srv.basePrice + 49,
                    isEmergency: false,
                    createdAt: bookingDate.toISOString(),
                    updatedAt: bookingDate.toISOString(),
                };
                this.bookings.set(bkId, booking);
                // Add payment for completed booking
                const payId = `pay-${bkId}`;
                const payment = {
                    id: payId,
                    bookingId: bkId,
                    amount: booking.totalPrice,
                    currency: 'INR',
                    status: 'PAID',
                    paymentMethod: 'RAZORPAY',
                    razorpayOrderId: `order_${bkId}`,
                    razorpayPaymentId: `pay_${bkId}_mock`,
                    platformFee: 49,
                    providerEarnings: srv.basePrice,
                    createdAt: bookingDate.toISOString(),
                    updatedAt: bookingDate.toISOString(),
                };
                this.payments.set(payId, payment);
                booking.payment = payment;
                // Add Review
                const revId = `rev-${reviewCounter++}`;
                const rating = Math.random() > 0.15 ? 5 : 4;
                const review = {
                    id: revId,
                    bookingId: bkId,
                    customerId: custId,
                    customerName: cust?.name,
                    customerAvatar: cust?.avatarUrl,
                    providerId: provider.id,
                    rating,
                    comment: reviewComments[(bookingCounter + j) % reviewComments.length],
                    createdAt: bookingDate.toISOString(),
                    updatedAt: bookingDate.toISOString(),
                };
                this.reviews.set(revId, review);
                booking.review = review;
            }
        }
        // 9. Create Active Bookings for Demo Customer and Demo Provider
        // Active Booking 1: CONFIRMED upcoming job for tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 30, 0, 0);
        const activeConfirmedBooking = {
            id: 'bk-demo-active-1',
            customerId: 'usr-cust-demo',
            customer: {
                id: demoCustomer.id,
                name: demoCustomer.name,
                email: demoCustomer.email,
                phone: demoCustomer.phone,
                avatarUrl: demoCustomer.avatarUrl
            },
            providerId: 'prov-demo',
            provider: {
                id: demoProviderProfile.id,
                businessName: demoProviderProfile.businessName,
                rating: demoProviderProfile.rating,
                reviewCount: demoProviderProfile.reviewCount,
                user: {
                    name: demoProviderUser.name,
                    email: demoProviderUser.email,
                    phone: demoProviderUser.phone,
                    avatarUrl: demoProviderUser.avatarUrl
                }
            },
            serviceId: 'srv-7', // Split AC Servicing
            service: this.services.get('srv-7'),
            status: 'CONFIRMED',
            scheduledAt: tomorrow.toISOString(),
            estimatedDurationMinutes: 60,
            street: 'Flat 402, Shanthi Niketan, Anna Nagar West',
            city: 'Chennai',
            state: 'Tamil Nadu',
            postalCode: '600040',
            latitude: 13.0890,
            longitude: 80.2080,
            contactPhone: '9840123456',
            problemDescription: 'Split AC is cooling very slowly and water is dripping from the indoor unit vent.',
            problemImages: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500'],
            completionImages: [],
            servicePrice: 499,
            platformFee: 49,
            discountAmount: 0,
            totalPrice: 548,
            isEmergency: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.bookings.set(activeConfirmedBooking.id, activeConfirmedBooking);
        // Active Booking 2: EN_ROUTE job for immediate live tracking demonstration
        const activeEnRouteBooking = {
            id: 'bk-demo-active-2',
            customerId: 'usr-cust-demo',
            customer: {
                id: demoCustomer.id,
                name: demoCustomer.name,
                email: demoCustomer.email,
                phone: demoCustomer.phone,
                avatarUrl: demoCustomer.avatarUrl
            },
            providerId: 'prov-2', // Sri Lakshmi Plumbing Works
            provider: {
                id: 'prov-2',
                businessName: 'Sri Lakshmi Plumbing Works',
                rating: 4.8,
                reviewCount: 88,
                user: {
                    name: 'Suresh Babu',
                    email: 'prov-2@fixnear.dev',
                    phone: '9840112233',
                    avatarUrl: null
                }
            },
            serviceId: 'srv-4', // Tap Leak Repair
            service: this.services.get('srv-4'),
            status: 'EN_ROUTE',
            scheduledAt: new Date().toISOString(),
            estimatedDurationMinutes: 45,
            street: 'Flat 402, Shanthi Niketan, Anna Nagar West',
            city: 'Chennai',
            state: 'Tamil Nadu',
            postalCode: '600040',
            latitude: 13.0890,
            longitude: 80.2080,
            contactPhone: '9840123456',
            problemDescription: 'Kitchen mixer tap handle broke and continuous water flow is occurring.',
            problemImages: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500'],
            completionImages: [],
            servicePrice: 249,
            platformFee: 49,
            discountAmount: 0,
            totalPrice: 298,
            isEmergency: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.bookings.set(activeEnRouteBooking.id, activeEnRouteBooking);
        // Active Booking 3: PENDING request waiting for Arun to accept/reject
        const pendingRequestBooking = {
            id: 'bk-demo-pending',
            customerId: 'usr-cust-1',
            customer: {
                id: 'usr-cust-1',
                name: 'Aditi Rao',
                email: 'customer1@fixnear.dev',
                phone: '9840100001',
                avatarUrl: null
            },
            providerId: 'prov-demo',
            provider: {
                id: demoProviderProfile.id,
                businessName: demoProviderProfile.businessName,
                rating: demoProviderProfile.rating,
                reviewCount: demoProviderProfile.reviewCount,
                user: {
                    name: demoProviderUser.name,
                    email: demoProviderUser.email,
                    phone: demoProviderUser.phone,
                    avatarUrl: demoProviderUser.avatarUrl
                }
            },
            serviceId: 'srv-2', // Fan installation
            service: this.services.get('srv-2'),
            status: 'PENDING',
            scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
            estimatedDurationMinutes: 60,
            street: '7B, Crescent Road, Shenoy Nagar',
            city: 'Chennai',
            state: 'Tamil Nadu',
            postalCode: '600030',
            latitude: 13.0760,
            longitude: 80.2220,
            contactPhone: '9840100001',
            problemDescription: 'Need to replace an old ceiling fan with a new BLDC energy efficient fan in bedroom.',
            problemImages: [],
            completionImages: [],
            servicePrice: 299,
            platformFee: 49,
            discountAmount: 0,
            totalPrice: 348,
            isEmergency: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.bookings.set(pendingRequestBooking.id, pendingRequestBooking);
        // Active Booking 4: DISPUTED booking for Admin Dispute workflow testing!
        const disputedBooking = {
            id: 'bk-demo-disputed',
            customerId: 'usr-cust-2',
            customer: {
                id: 'usr-cust-2',
                name: 'Vikram Seth',
                email: 'customer2@fixnear.dev',
                phone: '9840100002',
                avatarUrl: null
            },
            providerId: 'prov-3',
            provider: {
                id: 'prov-3',
                businessName: 'CoolTech AC Solutions',
                rating: 4.7,
                reviewCount: 104,
                user: {
                    name: 'Karthik Raja',
                    email: 'prov-3@fixnear.dev',
                    phone: '9840998877',
                    avatarUrl: null
                }
            },
            serviceId: 'srv-8',
            service: this.services.get('srv-8'),
            status: 'DISPUTED',
            scheduledAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            estimatedDurationMinutes: 90,
            street: '5th Main, Velachery Bypass',
            city: 'Chennai',
            state: 'Tamil Nadu',
            postalCode: '600042',
            latitude: 12.9800,
            longitude: 80.2170,
            contactPhone: '9840100002',
            problemDescription: 'AC gas refill was performed but cooling stopped after only 24 hours.',
            problemImages: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500'],
            completionImages: [],
            servicePrice: 1800,
            platformFee: 49,
            discountAmount: 0,
            totalPrice: 1849,
            isEmergency: false,
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.bookings.set(disputedBooking.id, disputedBooking);
        const disputeRecord = {
            id: 'disp-demo-1',
            bookingId: disputedBooking.id,
            booking: disputedBooking,
            raisedById: 'usr-cust-2',
            raisedBy: this.users.get('usr-cust-2'),
            reason: 'Poor service / AC stopped cooling immediately after technician left',
            description: 'Technician charged ₹1,800 for gas charging without testing the copper joint leak properly. The refrigerant leaked out completely overnight.',
            evidenceImages: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500'],
            status: 'OPEN',
            adminNotes: 'Awaiting technician explanation on brazing test procedure.',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.disputes.set(disputeRecord.id, disputeRecord);
        // 10. Favorites for Demo Customer
        this.favorites.set(`usr-cust-demo_prov-demo`, {
            id: 'fav-1',
            customerId: 'usr-cust-demo',
            providerId: 'prov-demo',
            provider: demoProviderProfile,
            createdAt: new Date().toISOString(),
        });
        this.favorites.set(`usr-cust-demo_prov-2`, {
            id: 'fav-2',
            customerId: 'usr-cust-demo',
            providerId: 'prov-2',
            provider: this.providerProfiles.get('prov-2'),
            createdAt: new Date().toISOString(),
        });
        // 11. Initial Conversation between Customer and Arun for Booking 1
        const convId = 'conv-demo-1';
        const conversation = {
            id: convId,
            bookingId: activeConfirmedBooking.id,
            customerId: 'usr-cust-demo',
            providerId: 'prov-demo',
            customer: demoCustomer,
            provider: demoProviderUser,
            lastMessage: null,
            unreadCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.conversations.set(convId, conversation);
        const initialMessages = [
            {
                id: 'msg-1',
                conversationId: convId,
                senderId: 'usr-cust-demo',
                receiverId: demoProviderUser.id,
                content: 'Hi Arun, looking forward to the AC servicing tomorrow at 10:30 AM.',
                isRead: true,
                createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            },
            {
                id: 'msg-2',
                conversationId: convId,
                senderId: demoProviderUser.id,
                receiverId: 'usr-cust-demo',
                content: 'Hello Rohan! Yes, I have noted the address. I will carry the jet foam cleaning kit and spare capacitor just in case.',
                isRead: true,
                createdAt: new Date(Date.now() - 3600000).toISOString(),
            }
        ];
        this.messages.set(convId, initialMessages);
        conversation.lastMessage = initialMessages[1];
        // 12. Notifications for Demo Customer
        this.notifications.set('usr-cust-demo', [
            {
                id: 'notif-1',
                userId: 'usr-cust-demo',
                type: 'BOOKING_CONFIRMED',
                title: 'Booking Confirmed!',
                message: 'Arun Electricals accepted your AC servicing request for tomorrow at 10:30 AM.',
                data: { bookingId: activeConfirmedBooking.id },
                isRead: false,
                createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
            {
                id: 'notif-2',
                userId: 'usr-cust-demo',
                type: 'BOOKING_EN_ROUTE',
                title: 'Technician is on the way',
                message: 'Suresh Babu (Sri Lakshmi Plumbing) is traveling to your location.',
                data: { bookingId: activeEnRouteBooking.id },
                isRead: false,
                createdAt: new Date().toISOString(),
            }
        ]);
        // Notifications for Demo Provider
        this.notifications.set(demoProviderUser.id, [
            {
                id: 'notif-prov-1',
                userId: demoProviderUser.id,
                type: 'BOOKING_REQUEST',
                title: 'New Service Request',
                message: 'Aditi Rao requested Ceiling Fan Installation for Shenoy Nagar.',
                data: { bookingId: pendingRequestBooking.id },
                isRead: false,
                createdAt: new Date().toISOString(),
            }
        ]);
    }
}
//# sourceMappingURL=store.service.js.map