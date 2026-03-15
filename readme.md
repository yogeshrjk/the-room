


# The Room — Property Listing & Management Platform

The Room is a full-stack property listing web application where users can list, explore, save, update, and manage properties.

It provides a clean user interface along with secure backend APIs for property operations.

## Features

- User Authentication (Login / Register)
- Create Property Listings  
- Update Property Details  
- Delete Property Listings  
- Save / Favourite Properties  
- Responsive UI Design  
- Profile Dashboard with Saved Properties  
- File Upload Support (Images / Documents)

## Tech Stack

### Frontend
- React.js  
- React Router  
- Axios  
- Bootstrap  

### Backend
- Django  
- Django REST Framework  

### Database
- MySQL  

## Project Structure

The Room
│
├── client        # React Frontend
├── server        # Django Backend
└── README.md

## Installation & Setup

### Clone the Repository

git clone https://github.com/your-username/the-room.git  
cd the-room  

### Backend Setup (Django)

cd server  

python -m venv venv  
source venv/bin/activate   (Mac/Linux)  
venv\Scripts\activate      (Windows)  

pip install -r requirements.txt  

python manage.py migrate  
python manage.py runserver  

### Frontend Setup (React)

cd client  

npm install  
npm start  

## API Endpoints (Sample)

- POST `/api/properties/` — Create Property  
- PUT `/api/properties/:id/` — Update Property  
- DELETE `/api/properties/:id/` — Delete Property  
- POST `/api/properties/:id/toggle-save/` — Save / Unsave Property  
- GET `/api/profile/` — Get User Profile  

## Future Improvements

- Property Search & Filters  
- Chat Between Owner & Buyer  
- Reviews & Ratings  
- Map Integration  
- Notifications System  

## Author

Yogesh Rajak  

FullStack Developer focused on building scalable web applications.

## Support

If you like this project, consider giving it a star on GitHub or contributing to improve it.