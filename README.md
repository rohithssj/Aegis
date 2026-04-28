# Aegis

Aegis is an AI-powered incident response and crisis management system designed to simulate real-world emergency coordination. It provides a unified interface for reporting incidents, monitoring live situations, analyzing risks, and managing response operations through an intelligent and visually rich dashboard.

---

## Problem Statement

Emergency response systems today often suffer from fragmented workflows, delayed coordination, lack of real-time insights, and minimal transparency for users reporting incidents. Citizens have limited visibility into how their reports are handled, while administrators lack centralized intelligence to make informed decisions quickly.

There is a need for a system that:

* Centralizes incident reporting and tracking
* Provides real-time situational awareness
* Uses AI to assist decision-making
* Offers transparency to users and control to administrators

---

## Solution

Aegis Command Center addresses these challenges by combining:

* Real-time incident tracking
* AI-assisted analysis and response recommendations
* Interactive map-based visualization
* Admin-controlled response workflows
* User-facing tracking system

The platform bridges the gap between users and responders while simulating a scalable, intelligent emergency infrastructure.

---

## Core Features

### 1. Incident Reporting

Users can report incidents with details such as:

* Title and description
* Severity level
* Location

Each report generates a unique tracking ID for monitoring progress.

---

### 2. Real-Time Tracking System

Users can track their incident using the tracking ID and view:

* Current status (Processing, Analyzing, Responding, Resolved)
* Timeline updates
* AI-generated insights
* Location mapping

---

### 3. Command Center Dashboard

A centralized interface for monitoring and controlling operations:

* Live incident feed
* AI-powered tactical intelligence
* Deployment timeline
* Status management
* Map-based visualization

---

### 4. Interactive Map View

* Displays incidents geographically
* Clusters incidents by location
* Color-coded severity levels:

  * Red: Critical
  * Yellow: Medium
  * Green: Low

---

### 5. AI-Powered Intelligence

AI is integrated to:

* Analyze incident context
* Generate concise tactical briefings
* Predict possible outcomes
* Provide decision explanations

AI is triggered manually to optimize performance and reduce unnecessary requests.

---

### 6. Admin Control System

Administrators can:

* Manually update incident status
* Assign response actions
* Control operational flow

---

### 7. System Configuration (Simplified)

Includes key configurable parameters:

* Inference Sensitivity
* Predictive Horizon
* Auto-Isolation
* Critical Alert Priority

These influence system behavior and AI decision logic.

---

## Authentication

To access the Command Center (admin panel), use the following key:

Admin Key:
**aegis-admin-123**

This allows full access to administrative features for testing and evaluation.

---

## Technology Stack

Frontend:

* Next.js (App Router)
* React
* Tailwind CSS
* Framer Motion

Backend / Services:

* Firebase (Firestore for real-time data)
* OpenRouter API (AI integration)

Visualization:

* Leaflet (Map rendering)
* Recharts (Analytics)

---

## Deployment

The project is deployed using Vercel.

Key requirements:

* Proper environment variables (API keys, Firebase config)
* Clean dependency installation
* Compatible versions (React 18 + React Leaflet v4)

---

## Key Highlights

* Fully responsive design
* Real-time data synchronization
* AI-assisted decision support
* Transparent user tracking system
* Admin-controlled workflow
* Clean, modern UI with glassmorphism

---

## Future Improvements

* Integration with real emergency APIs
* Role-based authentication system
* Advanced predictive analytics
* Push notifications and alerts
* Scalable backend infrastructure

---

## Conclusion

Aegis Command Center demonstrates how AI, real-time systems, and intuitive interfaces can be combined to build a modern crisis response platform. It showcases both technical capability and practical applicability in emergency management scenarios.

---
