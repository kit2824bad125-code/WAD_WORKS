export const PLATFORM_FEE_INR = 49;
export const PLATFORM_COMMISSION_PERCENT = 5;
// Strict state transition machine rules
export const VALID_STATUS_TRANSITIONS = {
    PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
    ACCEPTED: ['CONFIRMED', 'CANCELLED', 'REJECTED'],
    REJECTED: [],
    CONFIRMED: ['EN_ROUTE', 'CANCELLED'],
    EN_ROUTE: ['ARRIVED', 'CANCELLED'],
    ARRIVED: ['IN_PROGRESS', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'DISPUTED'],
    COMPLETED: ['DISPUTED'],
    CANCELLED: [],
    DISPUTED: ['COMPLETED', 'CANCELLED']
};
export const CITIES = [
    { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
    { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
    { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
    { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
    { name: 'Delhi NCR', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
    { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
    { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 }
];
export const DEMO_CREDENTIALS = {
    customer: {
        email: 'customer@fixnear.dev',
        password: 'FixNear@123',
        name: 'Rohan Sharma',
        role: 'CUSTOMER'
    },
    provider: {
        email: 'provider@fixnear.dev',
        password: 'FixNear@123',
        name: 'Arun Kumar',
        businessName: 'Arun Electricals & Cooling',
        role: 'SERVICE_PROVIDER'
    },
    admin: {
        email: 'admin@fixnear.dev',
        password: 'FixNear@123',
        name: 'FixNear Admin',
        role: 'ADMIN'
    }
};
//# sourceMappingURL=constants.js.map