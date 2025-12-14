// We added the 'type' keyword here to fix the error
import type { ReviewHistoryItem, ReviewQueueItem, BackendHealthItem, ReviewItem } from '../types';

export const reviewHistoryData: ReviewHistoryItem[] = [
  { id: 1, appName: "Music Streaming App", developer: "SoundWave Inc.", reviewer: "Reviewer A", outcome: "Approved", timestamp: "2024-01-15 10:00 AM", notes: "App meets all guidelines." },
  { id: 2, appName: "Fitness Tracker App", developer: "FitLife Co.", reviewer: "Reviewer B", outcome: "Rejected", timestamp: "2024-01-16 02:30 PM", notes: "Privacy policy needs clarification." },
  { id: 3, appName: "Social Media App", developer: "ConnectNow LLC", reviewer: "Reviewer C", outcome: "Approved", timestamp: "2024-01-17 09:45 AM", notes: "App functions as expected." },
  { id: 4, appName: "E-commerce App", developer: "ShopSmart Ltd.", reviewer: "Reviewer A", outcome: "Rejected", timestamp: "2024-01-18 04:15 PM", notes: "Payment gateway integration issues." },
  { id: 5, appName: "Travel Booking App", developer: "Wanderlust Inc.", reviewer: "Reviewer B", outcome: "Approved", timestamp: "2024-01-19 11:20 AM", notes: "User interface is intuitive." },
];

export const reviewQueueData: ReviewQueueItem[] = [
  { id: 1, appName: "Music Streamer", version: "1.2.3", status: "In Review", submitted: "2023-08-15" },
  { id: 2, appName: "Navigation App", version: "2.0.1", status: "Pending", submitted: "2023-08-14" },
  { id: 3, appName: "Podcast Player", version: "3.1.0", status: "In Review", submitted: "2023-08-12" },
  { id: 4, appName: "News Aggregator", version: "1.0.5", status: "Pending", submitted: "2023-08-10" },
  { id: 5, appName: "Audiobook Reader", version: "2.5.2", status: "In Review", submitted: "2023-08-08" },
];

export const backendHealthData: BackendHealthItem[] = [
  { service: "Authentication Service", status: "Healthy", updated: "2024-01-20 10:00 AM" },
  { service: "Data Storage", status: "Healthy", updated: "2024-01-20 10:05 AM" },
  { service: "API Gateway", status: "Healthy", updated: "2024-01-20 10:10 AM" },
  { service: "Notification Service", status: "Unhealthy", updated: "2024-01-20 10:15 AM" },
  { service: "Analytics Pipeline", status: "Healthy", updated: "2024-01-20 10:20 AM" },
];

export const reviewsData: ReviewItem[] = [
    { id:1, app: "Music Streamer", user: "Liam Carter", rating: 5, comment: "Great app, love the music selection!", date: "2023-08-15"},
    { id:2, app: "Fitness Tracker", user: "Olivia Bennett", rating: 4, comment: "Helps me stay motivated, but needs more workout variety.", date: "2023-08-12"},
    { id:3, app: "Recipe Finder", user: "Ethan Harper", rating: 3, comment: "Decent recipes, but the search function could be better.", date: "2023-08-10"},
    { id:4, app: "Travel Planner", user: "Sophia Evans", rating: 5, comment: "Excellent for planning trips, very user-friendly.", date: "2023-08-05"},
    { id:5, app: "Language Tutor", user: "Noah Foster", rating: 2, comment: "Not very effective, the lessons are repetitive.", date: "2023-08-01"},
];