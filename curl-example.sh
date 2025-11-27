#!/bin/bash

# Sample curl command for POST /contact API (localhost)
# Copy this curl command and import it into Postman or run directly

curl -X POST http://localhost:4000/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "company": "Acme Inc",
    "title": "Test Contact",
    "message": "This is a test message from the contact form."
  }'

echo ""
echo "Expected response: {\"ok\":true}"

# For Vercel deployment (replace YOUR_VERCEL_URL):
# curl -X POST https://YOUR_VERCEL_URL.vercel.app/contact \
#   -H "Content-Type: application/json" \
#   -d '{
#     "name": "John Doe",
#     "email": "john.doe@example.com",
#     "title": "Test Contact",
#     "message": "This is a test message from the contact form."
#   }'

